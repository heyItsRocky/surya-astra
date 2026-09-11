"""
Surya-Astra Backend — FastAPI Application
Threshold-based solar flare nowcaster with real-time data.
"""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import (
    NowcastData, ForecastData, SpaceWeatherAlert, Mission,
    FluxReading, FlareProbability, FluxClass, AlertLevel
)
from nowcaster import (
    classify_flux, compute_magnitude, compute_cme_risk,
    compute_forecast_probabilities, determine_trend,
    compute_model_confidence
)
from data_fetcher import get_flux_data, get_flux_values


# ============================================================
# App Setup
# ============================================================

app = FastAPI(
    title="Surya-Astra API",
    description="Solar Flare Intelligence Dashboard — Threshold Nowcaster",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://surya-astra.vercel.app",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Helper
# ============================================================

def make_response(data, success: bool = True, error: Optional[str] = None):
    """Wrap data in standard API response format."""
    return {
        "success": success,
        "data": data,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "error": error,
    }


# ============================================================
# Seed Mission Data
# ============================================================

ADITYA_L1_MISSION = Mission(
    name="Aditya-L1",
    status="active",
    launchDate="2023-09-02",
    description="First Indian space-based observatory-class solar mission to study the Sun from a halo orbit around first Sun-Earth Lagrangian point (L1).",
    instruments=[
        "VELC (Visible Emission Line Coronagraph)",
        "SUIT (Solar Ultraviolet Imaging Telescope)",
        "SoLEXS (Solar Low Energy X-ray Spectrometer)",
        "HEL1OS (High Energy L1 Orbiting X-ray Spectrometer)",
        "ASPEX (Aditya Solar wind Particle Experiment)",
        "PAPA (Plasma Analyser Package for Aditya)",
        "MAG (Advanced Tri-axial High Resolution Digital Magnetometers)",
    ],
    orbit="Halo orbit at L1 (1.5 million km from Earth)",
    keyFact="Provides uninterrupted view of the Sun without any occultation/eclipses.",
)


# ============================================================
# Endpoints
# ============================================================

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return make_response({"status": "healthy", "service": "surya-astra-backend"})


@app.get("/api/nowcast")
async def get_nowcast(use_real_data: bool = False):
    """
    Get current solar conditions.
    
    Returns flux history, current class, CME risk, and active regions.
    """
    try:
        data = await get_flux_data(use_real=use_real_data)
        values = get_flux_values(data)
        
        if not values:
            raise HTTPException(status_code=503, detail="No flux data available")
        
        # Current = most recent reading
        current_flux = values[-1]
        current_class = classify_flux(current_flux)
        
        # Peak in last 24h (last 144 readings at 10-min intervals)
        recent_24h = values[-144:] if len(values) >= 144 else values
        peak_24h = max(recent_24h)
        
        # CME risk from history
        cme_risk = compute_cme_risk(values)
        
        # Convert to FluxReading format (last 24 readings)
        flux_history = [
            FluxReading.model_validate({
                "timestamp": d["timestamp"],
                "value": d["value"],
                "class": classify_flux(d["value"])
            })
            for d in data[-24:]
        ]
        
        # Estimate active regions from flux variability
        import statistics
        try:
            stdev = statistics.stdev(values[-48:]) if len(values) >= 48 else 0.1
            active_regions = max(1, min(15, int(stdev / 1e-7) + 1))
        except Exception:
            active_regions = 3
        
        nowcast = NowcastData.model_validate({
            "fluxHistory": [r.model_dump(by_alias=True) for r in flux_history],
            "currentClass": current_class,
            "currentFlux": current_flux,
            "peak24h": peak_24h,
            "activeRegions": active_regions,
            "cmeRisk": cme_risk,
        })
        
        return make_response(nowcast.model_dump(by_alias=True))
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/forecast")
async def get_forecast(use_real_data: bool = False):
    """
    Get 24-hour flare forecast.
    
    Returns probabilities for C, M, X class flares.
    """
    try:
        data = await get_flux_data(use_real=use_real_data)
        values = get_flux_values(data)
        
        if not values:
            raise HTTPException(status_code=503, detail="No flux data available")
        
        # Compute forecast
        probs = compute_forecast_probabilities(values)
        trend = determine_trend(values)
        confidence = compute_model_confidence(values)
        
        valid_until = (datetime.utcnow() + timedelta(hours=24)).isoformat() + "Z"
        
        probabilities = [
            FlareProbability.model_validate({
                "class": k,
                "probability": v,
                "confidence": confidence,
                "valid_until": valid_until,
            })
            for k, v in probs.items()
        ]
        
        forecast = ForecastData.model_validate({
            "probabilities": [p.model_dump(by_alias=True) for p in probabilities],
            "trend": trend,
            "modelConfidence": confidence,
            "validUntil": valid_until,
        })
        
        return make_response(forecast.model_dump(by_alias=True))
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/alerts")
async def get_alerts(use_real_data: bool = False):
    """
    Get active space weather alerts.
    
    Generates alerts based on current conditions.
    """
    try:
        data = await get_flux_data(use_real=use_real_data)
        values = get_flux_values(data)
        
        alerts = []
        
        if values:
            current_flux = values[-1]
            current_class = classify_flux(current_flux)
            cme_risk = compute_cme_risk(values)
            
            # Generate alerts based on conditions
            if current_class in ('M', 'X'):
                alerts.append(SpaceWeatherAlert(
                    id="alert-flare-active",
                    level=AlertLevel.WARNING if current_class == 'M' else AlertLevel.EXTREME,
                    title=f"{current_class}-Class Flare Detected",
                    message=f"Active {current_class}-class solar flare detected. X-ray flux: {current_flux:.1e} W/m². Potential radio blackout risk.",
                    timestamp=datetime.utcnow().isoformat() + "Z",
                    source="HEL1OS/Aditya-L1",
                ))
            
            if cme_risk > 0.5:
                alerts.append(SpaceWeatherAlert(
                    id="alert-cme-risk",
                    level=AlertLevel.WARNING if cme_risk > 0.7 else AlertLevel.WATCH,
                    title="Elevated CME Risk",
                    message=f"Coronal Mass Ejection risk at {cme_risk*100:.0f}%. Recent flux variability suggests potential CME activity.",
                    timestamp=datetime.utcnow().isoformat() + "Z",
                    source="Surya-Astra Nowcaster",
                ))
            
            # Check for recent M-class spike
            recent_6h = values[-36:] if len(values) >= 36 else values
            if any(classify_flux(v) == 'M' for v in recent_6h):
                alerts.append(SpaceWeatherAlert(
                    id="alert-m-watch",
                    level=AlertLevel.WATCH,
                    title="M-Class Flare Watch",
                    message="Active region shows complex magnetic configuration. Risk of M-class flares elevated over next 24 hours.",
                    timestamp=datetime.utcnow().isoformat() + "Z",
                    source="Surya-Astra Nowcaster",
                ))
        
        if not alerts:
            alerts.append(SpaceWeatherAlert(
                id="alert-normal",
                level=AlertLevel.NORMAL,
                title="Conditions Normal",
                message="Solar activity within normal parameters. No significant flares detected.",
                timestamp=datetime.utcnow().isoformat() + "Z",
                source="Surya-Astra Nowcaster",
            ))
        
        return make_response([a.model_dump() for a in alerts])
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/mission")
async def get_mission():
    """Get Aditya-L1 mission information."""
    return make_response(ADITYA_L1_MISSION.model_dump(by_alias=True))


@app.get("/api/team")
async def get_team():
    """Get team member information."""
    team = [
        {
            "name": "Rakshith",
            "role": "Lead Developer & Architect",
            "bio": "Full-stack engineer specializing in performant web applications and data visualization.",
        },
        {
            "name": "Ghost AI",
            "role": "AI Co-pilot",
            "bio": "Agentic coding assistant providing rapid implementation, architecture guidance, and specialized problem solving.",
        }
    ]
    return make_response(team)


# ============================================================
# Run
# ============================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
