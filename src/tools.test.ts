import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockGet = jest.fn();
const mockSetRequestHandler = jest.fn();

const { CallToolRequestSchema } = await import('@modelcontextprotocol/sdk/types.js');

const toolHandlers = new Map<string, unknown>();
jest.unstable_mockModule('@modelcontextprotocol/sdk/server/mcp.js', () => ({
  McpServer: jest.fn().mockImplementation(() => ({
    tool: (name: string, _schema: unknown, handler: unknown) => {
      toolHandlers.set(name, handler);
      mockSetRequestHandler(
        CallToolRequestSchema,
        (req: { params: { name: string; arguments?: Record<string, unknown> } }) => {
          const h = toolHandlers.get(req.params.name) as (args: Record<string, unknown>) => Promise<unknown>;
          if (h) return h(req.params.arguments || {});
          throw new Error(`Tool ${req.params.name} not found`);
        },
      );
    },
    setRequestHandler: mockSetRequestHandler,
    assertCanSetRequestHandler: jest.fn(),
  })),
}));

jest.unstable_mockModule('./api.js', () => ({
  MeteoControlApi: jest.fn().mockImplementation(() => ({
    get: mockGet,
  })),
}));

const { MeteoControlServer } = await import('./server.js');

describe('Energy Monitoring Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    toolHandlers.clear();
  });

  it('should fetch energy data for a system', async () => {
    const mockData = { energy: 100 };
    mockGet.mockResolvedValue(mockData);

    new MeteoControlServer();
    const callToolHandler = mockSetRequestHandler.mock.calls.find(
      (c) => c[0] === CallToolRequestSchema,
    )![1] as (request: {
      params: { name: string; arguments?: Record<string, unknown> };
    }) => Promise<{ content: Array<{ text: string }> }>;

    const result = await callToolHandler({
      params: {
        name: 'get_energy_data',
        arguments: { systemKey: 'sys1', from: '2024-01-01', to: '2024-01-02' },
      },
    });

    expect(mockGet).toHaveBeenCalledWith('/systems/sys1/basics/abbreviations/E_Z_EVU/measurements', {
      from: '2024-01-01',
      to: '2024-01-02',
    });
    expect(result.content[0]!.text).toBe(JSON.stringify(mockData, null, 2));
  });

  it('should handle errors when fetching energy data', async () => {
    mockGet.mockRejectedValue(new Error('API Error'));

    new MeteoControlServer();
    const callToolHandler = mockSetRequestHandler.mock.calls.find(
      (c) => c[0] === CallToolRequestSchema,
    )![1] as (request: {
      params: { name: string; arguments?: Record<string, unknown> };
    }) => Promise<{ content: Array<{ text: string }>; isError: boolean }>;

    const result = await callToolHandler({
      params: {
        name: 'get_energy_data',
        arguments: { systemKey: 'sys1', from: '2024-01-01', to: '2024-01-02' },
      },
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]!.text).toContain('Error fetching energy data: API Error');
  });
});
