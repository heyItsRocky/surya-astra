"""
Surya-Astra Backend — Pydantic Response Models
Matches the TypeScript types in src/lib/types.ts
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class FluxClass(str, Enum):
    """NOAA X-ray flux class"""
    A = "A"
    B = "B"
    C = "C"
    M = "M"
    X = "X"


class AlertLevel(str, Enum):
    """Space weather alert level"""
    NORMAL = "normal"
    WATCH = "watch"
    WARNING = "warning"
    EXTREME = "extreme"


class FluxReading(BaseModel):
    """Real-time flux reading"""
    timestamp: str
    value: float = Field(description="X-ray flux in W/m²")
    class_: FluxClass = Field(alias="class")

    model_config = {"populate_by_name": True}


class SolarFlare(BaseModel):
    """Solar flare event"""
    id: str
    timestamp: str
    class_: FluxClass = Field(alias="class")
    magnitude: float = Field(description="e.g. 1.5 for M1.5, 3.2 for X3.2")
    region: str = Field(description="Active region number")
    location: str
    duration: Optional[int] = Field(None, description="Duration in minutes")
    cme: Optional[bool] = Field(None, description="CME associated")
    peak_flux: Optional[float] = Field(None, description="Peak flux in W/m²")

    model_config = {"populate_by_name": True}


class FlareProbability(BaseModel):
    """Forecast probability for a flare class"""
    class_: FluxClass = Field(alias="class")
    probability: float = Field(ge=0, le=1)
    confidence: float = Field(ge=0, le=1)
    valid_until: str

    model_config = {"populate_by_name": True}


class SpaceWeatherAlert(BaseModel):
    """Space weather alert"""
    id: str
    level: AlertLevel
    title: str
    message: str
    timestamp: str
    source: str


class NowcastData(BaseModel):
    """Current solar conditions"""
    flux_history: list[FluxReading] = Field(alias="fluxHistory")
    current_class: FluxClass = Field(alias="currentClass")
    current_flux: float = Field(alias="currentFlux")
    peak_24h: float = Field(alias="peak24h")
    active_regions: int = Field(alias="activeRegions")
    cme_risk: float = Field(ge=0, le=1, alias="cmeRisk")

    model_config = {"populate_by_name": True}


class ForecastData(BaseModel):
    """24-hour flare forecast"""
    probabilities: list[FlareProbability]
    trend: str = Field(description="increasing, stable, or decreasing")
    model_confidence: float = Field(ge=0, le=1, alias="modelConfidence")
    valid_until: str = Field(alias="validUntil")

    model_config = {"populate_by_name": True}


class Mission(BaseModel):
    """Aditya-L1 mission info"""
    name: str
    status: str
    launch_date: Optional[str] = Field(None, alias="launchDate")
    description: str
    instruments: list[str]
    orbit: Optional[str] = None
    key_fact: Optional[str] = Field(None, alias="keyFact")

    model_config = {"populate_by_name": True}


class TeamMember(BaseModel):
    """Team member"""
    name: str
    role: str
    bio: str
    image: Optional[str] = None


class ApiResponse(BaseModel):
    """Standard API response wrapper"""
    success: bool
    data: dict | list | None = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    error: Optional[str] = None
