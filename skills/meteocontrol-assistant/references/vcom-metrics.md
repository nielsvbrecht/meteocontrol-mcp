# VCOM API Metrics Reference

This guide provides context for common solar performance metrics retrieved via the MeteoControl VCOM API.

## Core Metrics

### 1. Specific Yield (kWh/kWp)
- **Definition:** The amount of energy produced (kWh) per kilowatt-peak (kWp) of installed capacity.
- **Usage:** Used to compare systems of different sizes or the same system across different time periods.
- **Analysis:** Low specific yield compared to local benchmarks suggests technical issues or shading.

### 2. Performance Ratio (PR)
- **Definition:** The ratio of actual energy output to the theoretical maximum output under ideal conditions (STC).
- **Interpretation:**
    - **> 85%:** Excellent performance.
    - **75% - 85%:** Good performance.
    - **< 75%:** Potential issues (soiling, inverter clipping, degradation).
- **Note:** Requires accurate irradiation data (pyranometers).

### 3. Energy vs. Power
- **Energy (kWh/MWh):** Cumulative production over time.
- **Power (kW/MW):** Instantaneous production.
- **Correlation:** If power is zero during daylight hours but energy was produced earlier, an inverter may have tripped.

## API Response Mapping

- `get_energy_data` returns raw JSON. When summarizing, always convert large values to the most appropriate unit (e.g., 1,500,000 Wh → 1.5 MWh).
