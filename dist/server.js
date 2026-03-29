import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { MeteoControlApi } from './api.js';
import dotenv from 'dotenv';
dotenv.config();
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
        const apiKey = process.env.METEOCONTROL_API_KEY || '';
        const apiSecret = process.env.METEOCONTROL_API_SECRET || '';
        this.api = new MeteoControlApi({
            apiKey,
            apiSecret,
            baseUrl: 'https://api.meteocontrol.de/v2',
        });
        this.setupHandlers();
    }
    setupHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'get_energy_data',
                    description: 'Get energy and power metrics for a solar system',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            systemKey: {
                                type: 'string',
                                description: 'The unique key/ID of the solar system',
                            },
                            from: {
                                type: 'string',
                                description: 'Start date (ISO 8601)',
                            },
                            to: {
                                type: 'string',
                                description: 'End date (ISO 8601)',
                            },
                        },
                        required: ['systemKey', 'from', 'to'],
                    },
                },
            ],
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            if (name === 'get_energy_data') {
                return this.handleGetEnergyData(args);
            }
            throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${name}`);
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
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error(`MeteoControl MCP server running on stdio`);
    }
}
//# sourceMappingURL=server.js.map