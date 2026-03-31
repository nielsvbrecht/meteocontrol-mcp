# Implementation Plan: Gemini CLI Extension Integration

This plan outlines the steps to finalize and enhance the Gemini CLI extension for the MeteoControl MCP server, providing specialized context, workflows, and slash commands.

## Objective
Enable a seamless and expert-level interaction with solar installation data by providing the model with clear guidelines, specialized skills, and convenient shortcuts within the Gemini CLI.

## Key Files & Context
- `gemini-extension.json`: Extension manifest and configuration.
- `GEMINI.md`: Persistent instructions and contextual guidelines for the model.
- `skills/meteocontrol-assistant/SKILL.md`: Specialized workflows for solar monitoring and troubleshooting.
- `commands/`: (New) Slash commands for quick user access.

## Implementation Steps

### Phase 1: Context and Guidelines Refinement
- [x] **Review `GEMINI.md`**: Ensure it includes the core mandates, data-first communication style, and VCOM terminology as defined in the product guidelines.
- [x] **Enhance Metrics Translation**: Add specific instructions on how to calculate and present Performance Ratio (PR) and Specific Yield if the API returns raw data.

### Phase 2: Skills Enhancement
- [x] **Update `meteocontrol-assistant` Skill**:
    - [x] Add a "Periodic Report" workflow for generating weekly/monthly site health summaries.
    - [x] Include detailed troubleshooting steps for common inverter errors (e.g., "Inverter Offline", "Phase Imbalance").
    - [x] Reference the `vcom-metrics.md` and `troubleshooting.md` documentation.

### Phase 3: Slash Command Implementation
- [x] **Create `commands/yield.toml`**: Shortcut to get energy production for a site (`/yield [systemKey] [from] [to]`).
- [x] **Create `commands/alerts.toml`**: Shortcut to list active alerts for a site (`/alerts [systemKey]`).
- [x] **Create `commands/health.toml`**: Shortcut for a comprehensive site health check (`/health [systemKey]`).

### Phase 4: Extension Finalization
- [x] **Update `gemini-extension.json`**: Register the new commands and ensure all settings are correctly documented.
- [x] **Verify Local Linking**: Ensure the extension can be linked and all components are correctly discovered by the Gemini CLI.

## Verification & Testing
- [ ] **Context Test**: Ask the model a general question about its role as a MeteoControl assistant to verify `GEMINI.md` instructions are active.
- [ ] **Skill Test**: Activate the `meteocontrol-assistant` skill and verify it can guide through a production drop analysis.
- [ ] **Command Test**: Execute slash commands and verify they correctly trigger the underlying MCP tools.
