# MeteoControl MCP Server

A Model Context Protocol (MCP) server that provides seamless interaction with the MeteoControl VCOM API v2. This server allows users to ask natural language questions about their solar array installations through MCP-enabled clients (like Claude Desktop).

## Features

- **Energy Monitoring (`get_energy_data`):** Retrieve real-time and historical energy and power metrics.
- **Alert Retrieval (`get_alerts`):** Fetch active system alerts and historical event logs.
- **Asset Information (`get_asset_info`):** Get detailed configuration and metadata for solar assets (panels, inverters, sensors).

## Prerequisites

- Node.js 18 or higher (for local development).
- Docker (for containerized deployment).
- A MeteoControl VCOM API v2 account with:
  - **API Key**
  - **Username (E-mail address)**
  - **Password**

## Installation

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/meteocontrol-mcp.git
   cd meteocontrol-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Configuration

Create a `.env` file in the project root and add your MeteoControl API credentials:

```env
METEOCONTROL_API_KEY=your_api_key_here
METEOCONTROL_USER=your_email_address_here
METEOCONTROL_PASSWORD=your_password_here
METEOCONTROL_API_BASE_URL=https://api.meteocontrol.de/v2
```

## Usage

### Running Locally

To start the MCP server on `stdio`:

```bash
npm start
```

### Running with Docker

1. **Build the Docker image:**
   ```bash
   docker build -t meteocontrol-mcp .
   ```

2. **Run the container:**
   ```bash
   docker run --rm -it \
     -e METEOCONTROL_API_KEY=your_api_key \
     -e METEOCONTROL_USER=your_email \
     -e METEOCONTROL_PASSWORD=your_password \
     meteocontrol-mcp
   ```

### Integration with Claude Desktop

Add the following configuration to your `claude_desktop_config.json`:

#### Local Node.js
```json
{
  "mcpServers": {
    "meteocontrol": {
      "command": "node",
      "args": ["/path/to/meteocontrol-mcp/dist/index.js"],
      "env": {
        "METEOCONTROL_API_KEY": "your_api_key_here",
        "METEOCONTROL_USER": "your_email_address_here",
        "METEOCONTROL_PASSWORD": "your_password_here"
      }
    }
  }
}
```

#### Docker
```json
{
  "mcpServers": {
    "meteocontrol-docker": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e", "METEOCONTROL_API_KEY=your_api_key_here",
        "-e", "METEOCONTROL_USER=your_email_address_here",
        "-e", "METEOCONTROL_PASSWORD=your_password_here",
        "meteocontrol-mcp"
      ]
    }
  }
}
```

## Development

- **Run tests:** `npm test`
- **Lint code:** `npm run lint`
- **Format code:** `npm run format`
- **Full check:** `npm run check`

## License

This project is licensed under the ISC License.
