"""Unit tests for threshold nowcaster pure functions."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from nowcaster import (  # noqa: E402
    classify_flux,
    compute_magnitude,
    compute_cme_risk,
    compute_forecast_probabilities,
    determine_trend,
    compute_model_confidence,
)


class TestClassifyFlux:
    def test_a_class(self):
        assert classify_flux(1e-8) == "A"
        assert classify_flux(5e-8) == "A"
        assert classify_flux(0) == "A"

    def test_b_class(self):
        assert classify_flux(1e-7) == "B"
        assert classify_flux(5e-7) == "B"

    def test_c_class(self):
        assert classify_flux(1e-6) == "C"
        assert classify_flux(5e-6) == "C"

    def test_m_class(self):
        assert classify_flux(1e-5) == "M"
        assert classify_flux(5e-5) == "M"

    def test_x_class(self):
        assert classify_flux(1e-4) == "X"
        assert classify_flux(3e-4) == "X"

    def test_boundaries_are_inclusive_at_threshold(self):
        assert classify_flux(1e-7) == "B"
        assert classify_flux(1e-6) == "C"
        assert classify_flux(1e-5) == "M"
        assert classify_flux(1e-4) == "X"


class TestComputeMagnitude:
    def test_returns_in_range_for_positive_flux(self):
        for flux in [1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 5e-5]:
            mag = compute_magnitude(flux)
            assert 1.0 <= mag <= 9.9

    def test_non_positive_returns_floor(self):
        assert compute_magnitude(0) == 1.0
        assert compute_magnitude(-1) == 1.0


class TestComputeCmeRisk:
    def test_insufficient_data_low_risk(self):
        assert compute_cme_risk([1e-7, 1e-7]) == 0.1

    def test_risk_is_clamped_0_to_1(self):
        history = [1e-8] * 5 + [1e-3]  # huge spike
        risk = compute_cme_risk(history)
        assert 0.0 <= risk <= 1.0

    def test_flat_history_low_risk(self):
        history = [5e-8] * 12
        risk = compute_cme_risk(history)
        assert risk < 0.2

    def test_m_class_peak_boosts_risk(self):
        history = [2e-6] * 5 + [2e-5]
        risk = compute_cme_risk(history)
        assert 0.0 < risk <= 1.0


class TestForecastProbabilities:
    def test_returns_c_m_x_keys(self):
        probs = compute_forecast_probabilities([5e-7] * 24)
        assert set(probs.keys()) == {"C", "M", "X"}

    def test_probabilities_in_unit_interval(self):
        for history in (
            [1e-8] * 12,
            [5e-7] * 24,
            [1e-5] * 12,
            [1e-4, 2e-4, 5e-5],
        ):
            probs = compute_forecast_probabilities(history)
            for v in probs.values():
                assert 0.0 <= v <= 1.0

    def test_empty_history_defaults(self):
        probs = compute_forecast_probabilities([])
        assert probs == {"C": 0.3, "M": 0.05, "X": 0.01}

    def test_higher_flux_higher_c_probability(self):
        low = compute_forecast_probabilities([1e-8] * 12)
        high = compute_forecast_probabilities([5e-6] * 12)
        assert high["C"] >= low["C"]


class TestDetermineTrend:
    def test_increasing(self):
        history = [1e-7 + i * 1e-7 for i in range(20)]
        assert determine_trend(history) == "increasing"

    def test_decreasing(self):
        history = [1e-5 * (0.85 ** i) for i in range(20)]
        assert determine_trend(history) == "decreasing"

    def test_stable(self):
        history = [5e-7] * 20
        assert determine_trend(history) == "stable"

    def test_short_history_stable(self):
        assert determine_trend([1e-7]) == "stable"


class TestModelConfidence:
    def test_little_data_low_confidence(self):
        assert compute_model_confidence([1e-7, 1e-7]) == 0.5

    def test_confidence_in_range(self):
        assert 0.0 <= compute_model_confidence([1e-7] * 20) <= 1.0
        volatile = [1e-8, 1e-5, 1e-8, 1e-5, 1e-8, 1e-5, 1e-8, 1e-5, 1e-8, 1e-5, 1e-8, 1e-5]
        assert 0.0 <= compute_model_confidence(volatile) <= 1.0
