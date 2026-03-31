# MeteoControl MCP Server

A Model Context Protocol (MCP) server for the MeteoControl VCOM API v2. This extension allows you to monitor solar arrays, retrieve energy production data, and perform system health checks using natural language via the Gemini CLI.

## Features

- **System Discovery:** List all solar systems associated with your account.
- **Energy Monitoring:** Retrieve historical energy production data (Wh/kWh/MWh).
- **Asset Information:** Get technical details about panels, inverters, and site capacity.
- **Real-time Power:** Check instantaneous AC power output.
- **Multi-Transport Support:** Run locally via Stdio or host remotely via SSE.

## Installation

### Via Gemini CLI (Recommended)

To install the extension directly from GitHub:

```bash
gemini extensions add https://github.com/your-org/meteocontrol-mcp
```

### Manual Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-org/meteocontrol-mcp.git
    cd meteocontrol-mcp
    ```
2.  Install dependencies and build:
    ```bash
    npm install
    npm run build
    ```

## Usage

Once installed, you can ask Gemini about your solar systems:

- "List my solar systems."
- "What is the energy production for system NCLLA for the last 24 hours?"
- "Show me the technical details for INV1 in system NCLLA."

### Pre-configured Commands

- `/health [systemKey]`: Perform a comprehensive site health check.
- `/yield [systemKey]`: Retrieve and summarize energy production data.

## Deployment & Hosting

The server supports two modes of operation:

### 1. Local Mode (Stdio)
This is the default mode used by the Gemini CLI.
- **Command:** `node dist/index.js`
- **Setup:** Defined in `gemini-extension.json` using `command` and `args`.

### 2. Remote Mode (SSE)
Use this mode to host the MCP server on a central server for multiple users.
- **Environment Variables:**
  - `MCP_TRANSPORT=sse`
  - `PORT=3000` (optional, defaults to 3000)
- **Run Command:**
  ```bash
  MCP_TRANSPORT=sse node dist/index.js
  ```
- **Configuration:** In `.gemini/settings.json`, use the `url` property:
  ```json
  {
    "mcpServers": {
      "meteocontrol": {
        "url": "https://your-mcp-server.com/sse"
      }
    }
  }
  ```

## Configuration

The following environment variables are required for the server to talk to MeteoControl:

- `METEOCONTROL_API_KEY`: Your VCOM API key.
- `METEOCONTROL_USER`: Your VCOM username (email).
- `METEOCONTROL_PASSWORD`: Your VCOM password.

## License

Apache License 2.0
