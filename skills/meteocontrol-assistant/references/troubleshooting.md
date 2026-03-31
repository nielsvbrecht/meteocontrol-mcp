# Troubleshooting Workflow: Solar Energy Drops

Use this workflow to diagnose unexpected production drops via the MeteoControl MCP server.

## Step 1: Broad System Check
- **Tool:** `get_asset_info`
- **Goal:** Verify system capacity and overall configuration.
- **Verification:** Ensure the `systemKey` is correct and all assets (inverters, sensors) are accounted for.

## Step 2: Correlate Production and Alerts
- **Tools:** `get_energy_data`, `get_alerts`
- **Workflow:**
    - Retrieve energy data for the suspected period.
    - Fetch all alerts for the same period.
    - Look for "Inverter Failure," "Communication Loss," or "Grid Trip" events.

## Step 3: Identify Specific Asset Failures
- **Workflow:**
    - If `get_alerts` returns hardware-specific errors, focus the investigation on those assets.
    - If alerts are empty but energy is zero, suspect a site-wide communication failure or a power outage.

## Common Issue Indicators

| Indicator | Possible Cause |
| :--- | :--- |
| Zero power during daylight | Grid outage, inverter trip, site communication down. |
| Significant PR drop | Shading (new construction/trees), heavy soiling, string fuse failure. |
| Incomplete data gaps | Data logger offline or intermittent internet connection at site. |
