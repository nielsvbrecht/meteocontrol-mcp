# MeteoControl MCP Server

A Model Context Protocol (MCP) server for the MeteoControl VCOM API v2. This extension allows you to monitor solar arrays, retrieve energy production data, and perform system health checks using natural language via the Gemini CLI.

## Features

- **System Discovery:** List all solar systems associated with your account.
- **Energy Monitoring:** Retrieve historical energy production data (Wh/kWh/MWh).
- **Asset Information:** Get technical details about panels, inverters, and site capacity.
- **Real-time Power:** Check instantaneous AC power output.
- **Multi-Transport Support:** Run locally via Stdio or host remotely via SSE.
- **Multi-Tenant (BYOC):** Support for "Bring Your Own Credentials" in a shared environment.

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

### Multi-Tenant Usage (BYOC)
If you are using a shared MCP server, you can provide your own credentials directly in your prompts or configure them locally. The tools accept optional `apiKey`, `user`, and `password` arguments.

### Pre-configured Commands

- `/health [systemKey]`: Perform a comprehensive site health check.
- `/yield [systemKey]`: Retrieve and summarize energy production data.

## Deployment & Hosting

The server supports multiple modes of operation:

### 1. Local Mode (Stdio)
This is the default mode used by the Gemini CLI.
- **Command:** `node dist/index.js`
- **Setup:** Defined in `gemini-extension.json` using `command` and `args`.

### 2. Remote Mode (SSE)
Use this mode to host the MCP server on a central server for multiple users.

#### Security: Generating an Access Token
Remote mode requires a mandatory `MCP_SERVER_TOKEN` for security. You can generate a secure token using:
```bash
openssl rand -base64 32
```

#### Server Configuration
- **Environment Variables:**
  - `MCP_TRANSPORT=sse`
  - `MCP_SERVER_TOKEN=your_generated_token` (Required)
  - `PORT=3000` (optional, defaults to 3000)
- **Run Command:**
  ```bash
  MCP_TRANSPORT=sse MCP_SERVER_TOKEN=your_token node dist/index.js
  ```

### 3. Docker Mode
You can run the server as a container for easy deployment.

#### For Stdio Mode (CLI use):
```bash
docker run -i --rm \
  -e METEOCONTROL_API_KEY=your_key \
  -e METEOCONTROL_USER=your_user \
  -e METEOCONTROL_PASSWORD=your_password \
  ghcr.io/your-org/meteocontrol-mcp:latest
```

#### For SSE Mode (Hosted use):
```bash
docker run -d \
  -p 3000:3000 \
  -e MCP_TRANSPORT=sse \
  -e MCP_SERVER_TOKEN=your_token \
  -e METEOCONTROL_API_KEY=your_key \
  -e METEOCONTROL_USER=your_user \
  -e METEOCONTROL_PASSWORD=your_password \
  ghcr.io/your-org/meteocontrol-mcp:latest
```

#### Client Configuration (for SSE)
In your local `.gemini/settings.json`, add the `url` and the `Authorization` header:
```json
{
  "mcpServers": {
    "meteocontrol": {
      "url": "https://your-mcp-server.com/sse",
      "headers": {
        "Authorization": "Bearer your_generated_token"
      }
    }
  }
}
```

## Configuration

The following environment variables are required for the server to talk to MeteoControl (unless credentials are provided per request):

- `METEOCONTROL_API_KEY`: Your VCOM API key.
- `METEOCONTROL_USER`: Your VCOM username (email).
- `METEOCONTROL_PASSWORD`: Your VCOM password.

## License

Apache License 2.0
