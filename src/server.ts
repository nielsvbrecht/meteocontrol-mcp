import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { z } from 'zod';
import { MeteoControlApi } from './api.js';
import dotenv from 'dotenv';

dotenv.config();

// Common schema for authentication arguments
const AuthSchema = {
  apiKey: z.string().optional().describe('Optional: MeteoControl API Key (if not set on server)'),
  user: z.string().optional().describe('Optional: MeteoControl Username (if not set on server)'),
  password: z.string().optional().describe('Optional: MeteoControl Password (if not set on server)'),
};

/**
 * MeteoControl MCP Server
 * Provides access to solar installation data via the VCOM API v2.
 */
export class MeteoControlServer {
  private server: McpServer;
  private defaultApi: MeteoControlApi;
  public readonly name = 'meteocontrol-mcp';
  public readonly version = '1.0.0';

  constructor() {
    this.server = new McpServer({
      name: this.name,
      version: this.version,
    });

    const apiKey = process.env['METEOCONTROL_API_KEY'] || '';
    const user = process.env['METEOCONTROL_USER'] || '';
    const password = process.env['METEOCONTROL_PASSWORD'] || '';

    this.defaultApi = new MeteoControlApi({
      apiKey,
      user,
      password,
      baseUrl: process.env['METEOCONTROL_API_BASE_URL'] || 'https://api.meteocontrol.de/v2',
    });

    this.registerTools();
  }

  private getApi(args: { apiKey?: string; user?: string; password?: string }): MeteoControlApi {
    // If specific credentials are provided in tool arguments, use them
    if (args.apiKey && args.user && args.password) {
      return new MeteoControlApi({
        apiKey: args.apiKey,
        user: args.user,
        password: args.password,
        baseUrl: process.env['METEOCONTROL_API_BASE_URL'] || 'https://api.meteocontrol.de/v2',
      });
    }
    // Otherwise use default API (environment variables)
    return this.defaultApi;
  }

  private registerTools() {
    // Tool - System Discovery
    this.server.tool('list_systems', { ...AuthSchema }, async (args) => {
      try {
        const api = this.getApi(args);
        const data = await api.get('/systems');
        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        };
      } catch (error: unknown) {
        return {
          content: [
            { type: 'text', text: `Error listing systems: ${error instanceof Error ? error.message : String(error)}` },
          ],
          isError: true,
        };
      }
    });

    // Tool - Energy Monitoring
    this.server.tool(
      'get_energy_data',
      {
        systemKey: z.string().describe('The unique key/ID of the solar system.'),
        from: z.string().describe('The start date and time (ISO 8601).'),
        to: z.string().describe('The end date and time (ISO 8601).'),
        ...AuthSchema,
      },
      async (args) => {
        try {
          const api = this.getApi(args);
          const data = await api.get(`/systems/${args.systemKey}/basics/abbreviations/E_Z_EVU/measurements`, {
            from: args.from,
            to: args.to,
          });
          return {
            content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
          };
        } catch (error: unknown) {
          return {
            content: [
              {
                type: 'text',
                text: `Error fetching energy data: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            isError: true,
          };
        }
      },
    );

    // Tool - Alert Retrieval
    this.server.tool(
      'get_alerts',
      {
        systemKey: z.string().describe('The unique key/ID of the solar system.'),
        ...AuthSchema,
      },
      async (args) => {
        try {
          const api = this.getApi(args);
          const data = await api.get(`/systems/${args.systemKey}/alarms`);
          return {
            content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
          };
        } catch (error: unknown) {
          return {
            content: [
              {
                type: 'text',
                text: `Error fetching alerts: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            isError: true,
          };
        }
      },
    );

    // Tool - Asset Information
    this.server.tool(
      'get_asset_info',
      {
        systemKey: z.string().describe('The unique key/ID of the solar system.'),
        ...AuthSchema,
      },
      async (args) => {
        try {
          const api = this.getApi(args);
          const data = await api.get(`/systems/${args.systemKey}`);
          return {
            content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
          };
        } catch (error: unknown) {
          return {
            content: [
              {
                type: 'text',
                text: `Error fetching asset info: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  }

  async run(transport: Transport) {
    await this.server.connect(transport);
    console.error(`MeteoControl MCP server v${this.version} running`);
  }
}
