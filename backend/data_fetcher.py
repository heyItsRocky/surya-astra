"""
Surya-Astra Backend — Data Fetcher
Loads seed data or fetches real NOAA X-ray flux data.
"""

import json
import math
import random
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

import httpx


# Path to seed data file
SEED_DATA_PATH = Path(__file__).parent / "seed_data.json"

# NOAA SWPC JSON endpoint for X-ray flux
NOAA_XRAY_URL = "https://services.swpc.noaa.gov/json/summary/xray-flux.json"


def generate_seed_data(days: int = 7, points_per_hour: int = 6) -> list[dict]:
    """
    Generate realistic synthetic solar X-ray flux data.
    
    Simulates:
    - A-class background (10^-8 W/m²)
    - Occasional B-class elevations
    - C-class flares (common)
    - Rare M-class spikes
    - Very rare X-class events
    
    Args:
        days: Number of days of data to generate
        points_per_hour: Data points per hour (6 = every 10 min)
        
    Returns:
        List of {"timestamp": ISO, "value": float} dicts
    """
    now = datetime.utcnow()
    start = now - timedelta(days=days)
    total_points = days * 24 * points_per_hour
    
    data = []
    current_flux = 5e-8  # Start in B-class range
    
    for i in range(total_points):
        timestamp = start + timedelta(minutes=i * (60 / points_per_hour))
        
        # Base: random walk in A-B range
        noise = random.gauss(0, 0.3)
        current_flux *= 10 ** (noise * 0.1)
        
        # Keep in realistic range
        current_flux = max(1e-8, min(1e-4, current_flux))
        
        # Occasional flare events
        if random.random() < 0.02:  # 2% chance of flare
            flare_class = random.choices(
                ['C', 'M', 'X'],
                weights=[0.85, 0.12, 0.03],
                k=1
            )[0]
            
            if flare_class == 'C':
                spike = random.uniform(1e-6, 1e-5)
            elif flare_class == 'M':
                spike = random.uniform(1e-5, 1e-4)
            else:  # X
                spike = random.uniform(1e-4, 3e-4)
            
            # Flare rises fast, decays slower
            current_flux = spike
        
        # Decay back to background after flare
        if current_flux > 1e-6:
            current_flux *= 0.85  # Quick decay
        
        data.append({
            "timestamp": timestamp.isoformat() + "Z",
            "value": round(current_flux, 10)
        })
    
    return data


def save_seed_data() -> None:
    """Generate and save seed data to JSON file."""
    data = generate_seed_data()
    with open(SEED_DATA_PATH, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Generated {len(data)} data points -> {SEED_DATA_PATH}")


def load_seed_data() -> list[dict]:
    """
    Load seed data from file.
    If file doesn't exist, generate it first.
    """
    if not SEED_DATA_PATH.exists():
        save_seed_data()
    
    with open(SEED_DATA_PATH, 'r') as f:
        return json.load(f)


async def fetch_noaa_data() -> Optional[list[dict]]:
    """
    Fetch real-time X-ray flux data from NOAA SWPC.
    
    Returns:
        List of {"timestamp": str, "value": float} or None on failure
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(NOAA_XRAY_URL)
            response.raise_for_status()
            
            raw = response.json()
            
            # NOAA format: [{"time_tag": "...", "flux": float}, ...]
            return [
                {
                    "timestamp": item.get("time_tag", ""),
                    "value": float(item.get("flux", 0))
                }
                for item in raw
                if "time_tag" in item and "flux" in item
            ]
    except Exception as e:
        print(f"NOAA fetch failed: {e}")
        return None


async def get_flux_data(use_real: bool = False) -> list[dict]:
    """
    Get flux data — try real NOAA first, fall back to seed data.
    
    Args:
        use_real: If True, try fetching from NOAA SWPC
        
    Returns:
        List of flux readings
    """
    if use_real:
        real_data = await fetch_noaa_data()
        if real_data:
            return real_data
    
    return load_seed_data()


def get_flux_values(data: list[dict]) -> list[float]:
    """Extract just the flux values from data list."""
    return [d["value"] for d in data]
