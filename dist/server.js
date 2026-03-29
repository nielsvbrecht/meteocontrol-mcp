import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { MeteoControlApi } from './api.js';
import dotenv from 'dotenv';
dotenv.config();
/**
 * MeteoControl MCP Server
 * Provides access to solar installation data via the VCOM API v2.
 */
export class MeteoControlServer {
    server;
    api;
    name = 'meteocontrol-mcp';
    version = '1.0.0';
    constructor() {
        this.server = new Server({
            name: this.name,
            version: this.version,
        }, {
            capabilities: {
                tools: {},
            },
        });
        const apiKey = process.env['METEOCONTROL_API_KEY'] || '';
        const user = process.env['METEOCONTROL_USER'] || '';
        const password = process.env['METEOCONTROL_PASSWORD'] || '';
        if (!apiKey || !user || !password) {
            console.warn('Warning: MeteoControl credentials (API Key, User, Password) are not fully set in environment.');
        }
        this.api = new MeteoControlApi({
            apiKey,
            user,
            password,
            baseUrl: process.env['METEOCONTROL_API_BASE_URL'] || 'https://api.meteocontrol.de/v2',
        });
        this.setupHandlers();
    }
    setupHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'get_energy_data',
                    description: 'Retrieve real-time and historical energy and power metrics for a specific solar installation.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            systemKey: {
                                type: 'string',
                                description: 'The unique key/ID of the solar system (e.g., from VCOM dashboard).',
                            },
                            from: {
                                type: 'string',
                                description: 'The start date and time for the data request (ISO 8601 format, e.g., 2024-01-01T00:00:00Z).',
                            },
                            to: {
                                type: 'string',
                                description: 'The end date and time for the data request (ISO 8601 format, e.g., 2024-01-02T00:00:00Z).',
                            },
                        },
                        required: ['systemKey', 'from', 'to'],
                    },
                },
                {
                    name: 'get_alerts',
                    description: 'Fetch active system alerts and historical event logs for a connected solar installation.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            systemKey: {
                                type: 'string',
                                description: 'The unique key/ID of the solar system.',
                            },
                        },
                        required: ['systemKey'],
                    },
                },
                {
                    name: 'get_asset_info',
                    description: 'Get comprehensive configuration details and metadata for solar assets, including panels and inverters.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            systemKey: {
                                type: 'string',
                                description: 'The unique key/ID of the solar system.',
                            },
                        },
                        required: ['systemKey'],
                    },
                },
            ],
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'get_energy_data':
                        return await this.handleGetEnergyData(args);
                    case 'get_alerts':
                        return await this.handleGetAlerts(args);
                    case 'get_asset_info':
                        return await this.handleGetAssetInfo(args);
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${name}`);
                }
            }
            catch (error) {
                console.error(`Error executing tool ${name}:`, error);
                throw error;
            }
        });
    }
    async handleGetEnergyData(args) {
        try {
            const { systemKey, from, to } = args;
            const data = await this.api.get(`/systems/${systemKey}/metrics/energy`, {
                from,
                to,
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching energy data: ${errorMessage}`,
                    },
                ],
                isError: true,
            };
        }
    }
    async handleGetAlerts(args) {
        try {
            const { systemKey } = args;
            const data = await this.api.get(`/systems/${systemKey}/alerts`, {});
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching alerts: ${errorMessage}`,
                    },
                ],
                isError: true,
            };
        }
    }
    async handleGetAssetInfo(args) {
        try {
            const { systemKey } = args;
            const data = await this.api.get(`/systems/${systemKey}`, {});
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching asset info: ${errorMessage}`,
                    },
                ],
                isError: true,
            };
        }
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error(`MeteoControl MCP server v${this.version} running on stdio`);
    }
}
//# sourceMappingURL=server.js.map