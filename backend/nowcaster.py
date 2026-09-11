"""
Surya-Astra Backend — Threshold Nowcaster
Simple math-based solar flare classification and risk assessment.
No ML required — just threshold comparisons.
"""

from typing import Optional


# Solar flare classes by X-ray flux threshold (W/m²)
FLUX_THRESHOLDS = {
    'A': 1e-8,    # Background
    'B': 1e-7,    # Quiet
    'C': 1e-6,    # Common
    'M': 1e-5,    # Moderate — can cause radio blackouts
    'X': 1e-4,    # Extreme — satellite damage, grid failures
}


def classify_flux(flux_value: float) -> str:
    """
    Convert raw X-ray flux (W/m²) to NOAA flare class.
    
    Args:
        flux_value: X-ray flux in Watts per square meter
        
    Returns:
        Flare class letter (A, B, C, M, or X)
    """
    if flux_value >= 1e-4:
        return 'X'
    if flux_value >= 1e-5:
        return 'M'
    if flux_value >= 1e-6:
        return 'C'
    if flux_value >= 1e-7:
        return 'B'
    return 'A'


def compute_magnitude(flux_value: float) -> float:
    """
    Compute flare magnitude within its class.
    e.g., M5.4 means magnitude 5.4 within M class.
    
    Args:
        flux_value: X-ray flux in W/m²
        
    Returns:
        Magnitude value (1.0-9.9)
    """
    if flux_value <= 0:
        return 1.0
    
    import math
    # Get the log of the flux, normalized to class range
    log_flux = math.log10(flux_value)
    
    # Map to 1-9.9 range within the class decade
    # A: -8 to -7, B: -7 to -6, etc.
    class_base = math.floor(log_flux)
    fractional = log_flux - class_base
    magnitude = 1.0 + fractional * 8.9  # Scale to 1.0-9.9
    
    return min(9.9, max(1.0, magnitude))


def compute_cme_risk(flux_history: list[float]) -> float:
    """
    Estimate CME risk from flux history.
    
    Simple heuristic: if flux spiked >10x in last 6 readings,
    risk goes up proportionally.
    
    Args:
        flux_history: List of flux values (most recent last)
        
    Returns:
        Risk score between 0.0 and 1.0
    """
    if len(flux_history) < 6:
        return 0.1  # Default low risk with insufficient data
    
    # Look at last 6 readings
    recent = flux_history[-6:]
    peak = max(recent)
    baseline = min(recent)
    
    if baseline <= 0:
        return 0.5
    
    ratio = peak / baseline
    
    # Normalize: 100x spike = 100% risk
    # 10x spike = ~50% risk
    risk = min(1.0, ratio / 100)
    
    # Boost risk if flux is in M or X range
    current_class = classify_flux(peak)
    if current_class == 'X':
        risk = min(1.0, risk + 0.3)
    elif current_class == 'M':
        risk = min(1.0, risk + 0.15)
    
    return round(risk, 3)


def compute_forecast_probabilities(flux_history: list[float]) -> dict:
    """
    Estimate next-24h flare probability from recent trend.
    
    Uses simple statistical model:
    - Baseline probability from average flux level
    - Multiplier from trend direction
    
    Args:
        flux_history: List of flux values (most recent last)
        
    Returns:
        Dict with C, M, X class probabilities
    """
    if not flux_history:
        return {'C': 0.3, 'M': 0.05, 'X': 0.01}
    
    # Use last 12 readings for average (or all if fewer)
    recent = flux_history[-12:] if len(flux_history) >= 12 else flux_history
    recent_avg = sum(recent) / len(recent)
    
    # Calculate trend (positive = increasing)
    if len(flux_history) >= 2:
        trend = flux_history[-1] - flux_history[0]
    else:
        trend = 0
    
    # Base probabilities from average flux level
    # Higher average flux = higher flare probability
    c_prob = min(0.95, 0.3 + (recent_avg / 1e-6) * 0.1)
    m_prob = min(0.8, 0.05 + (recent_avg / 1e-5) * 0.15)
    x_prob = min(0.3, 0.01 + (recent_avg / 1e-4) * 0.1)
    
    # Adjust for trend
    if trend > 0:  # Flux increasing
        c_prob *= 1.2
        m_prob *= 1.3
        x_prob *= 1.5
    elif trend < 0:  # Flux decreasing
        c_prob *= 0.9
        m_prob *= 0.8
        x_prob *= 0.7
    
    return {
        'C': min(0.95, round(c_prob, 3)),
        'M': min(0.8, round(m_prob, 3)),
        'X': min(0.3, round(x_prob, 3)),
    }


def determine_trend(flux_history: list[float], window: int = 12) -> str:
    """
    Determine if flux is increasing, stable, or decreasing.
    
    Args:
        flux_history: List of flux values
        window: Number of recent readings to compare
        
    Returns:
        'increasing', 'stable', or 'decreasing'
    """
    if len(flux_history) < 2:
        return 'stable'
    
    recent = flux_history[-window:] if len(flux_history) >= window else flux_history
    first_half = sum(recent[:len(recent)//2]) / max(1, len(recent)//2)
    second_half = sum(recent[len(recent)//2:]) / max(1, len(recent) - len(recent)//2)
    
    # 10% threshold for "stable"
    if second_half > first_half * 1.1:
        return 'increasing'
    elif second_half < first_half * 0.9:
        return 'decreasing'
    return 'stable'


def compute_model_confidence(flux_history: list[float]) -> float:
    """
    Estimate confidence based on data consistency.
    
    More consistent data = higher confidence.
    Very volatile data = lower confidence.
    """
    if len(flux_history) < 3:
        return 0.5  # Low confidence with little data
    
    import statistics
    try:
        stdev = statistics.stdev(flux_history[-12:])
        mean = statistics.mean(flux_history[-12:])
        
        if mean <= 0:
            return 0.5
        
        # Coefficient of variation — lower = more consistent = higher confidence
        cv = stdev / mean
        
        # Map CV to confidence (inverted)
        # CV of 0 = 100% confidence, CV of 2 = 30% confidence
        confidence = max(0.3, min(0.95, 1.0 - cv * 0.35))
        return round(confidence, 2)
    except Exception:
        return 0.6
