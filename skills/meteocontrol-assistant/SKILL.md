---
name: meteocontrol-assistant
description: Specialized assistant for monitoring and analyzing solar installations via the MeteoControl VCOM API. Use it to troubleshoot production drops, triage alerts, and generate system reports.
---

# MeteoControl Assistant

This skill provides expert guidance for analyzing solar energy production and diagnosing technical issues using the MeteoControl MCP server.

## Quick Start

1.  **Analyze System Health:** Use `get_asset_info` and `get_alerts`.
2.  **Evaluate Performance:** Use `get_energy_data` to calculate Specific Yield or check Performance Ratio (PR).
3.  **Troubleshoot Drops:** Follow the [troubleshooting workflow](references/troubleshooting.md).
4.  **Generate Reports:** Follow the [Periodic Report workflow](#periodic-report-generation).

## Capabilities

### 1. Performance Analysis
-   **Contextual Yield:** Compare current energy data against historical benchmarks or site capacity.
-   **Metric Translation:** Convert raw energy values into meaningful summaries (kWh, MWh, PR%).
-   **Reference:** See [vcom-metrics.md](references/vcom-metrics.md) for detailed definitions.

### 2. Technical Troubleshooting
-   **Root Cause Analysis:** Correlate energy production gaps with active system alerts.
-   **Inverter Triage:** Identify specific hardware failures (e.g., "Inverter Offline", "Phase Imbalance") and their impact on total site production.
-   **Reference:** Follow the [troubleshooting guide](references/troubleshooting.md).

### 3. Periodic Report Generation
Use the following workflow to generate site health summaries for operators and managers.
- **Workflow:**
    1. Retrieve asset configuration (`get_asset_info`).
    2. Fetch energy data for the report period (`get_energy_data`).
    3. Retrieve all alerts and events (`get_alerts`).
    4. Summarize total production, PR, and identify any critical hardware failures.

## Resource Usage

### References
-   **[vcom-metrics.md](references/vcom-metrics.md):** Guidance on interpreting VCOM-specific metrics and data units.
-   **[troubleshooting.md](references/troubleshooting.md):** Sequential workflow for diagnosing production issues.

### Best Practices
-   **Always** verify the `systemKey` if a request fails or returns unexpected data.
-   **Proactively** check for alerts when a user reports low performance.
-   **Normalize** timestamps to the site's local time if possible (the API returns data in the configured time zone).
-   **Unit Conversion:** Automatically convert large values (Wh to MWh) for better readability in reports.
