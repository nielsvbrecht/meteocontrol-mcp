import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

export class MeteoControlServer {
  private server: Server;
  public readonly name = 'meteocontrol-mcp';
  public readonly version = '1.0.0';

  constructor() {
    this.server = new Server(
      {
        name: this.name,
        version: this.version,
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      throw new Error(`Tool not found: ${request.params.name}`);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error(`MeteoControl MCP server running on stdio`);
  }
}
