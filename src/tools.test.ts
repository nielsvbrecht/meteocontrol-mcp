import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockGet = jest.fn();
const mockSetRequestHandler = jest.fn();

jest.unstable_mockModule('@modelcontextprotocol/sdk/server/index.js', () => ({
  Server: jest.fn().mockImplementation(() => ({
    setRequestHandler: mockSetRequestHandler,
    connect: jest.fn(),
  })),
}));

jest.unstable_mockModule('./api.js', () => ({
  MeteoControlApi: jest.fn().mockImplementation(() => ({
    get: mockGet,
  })),
}));

const { MeteoControlServer } = await import('./server.js');
const { ListToolsRequestSchema, CallToolRequestSchema } = await import('@modelcontextprotocol/sdk/types.js');

describe('Energy Monitoring Tool', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    new MeteoControlServer();
  });

  it('should register the get_energy_data tool', async () => {
    const listToolsHandler = mockSetRequestHandler.mock.calls.find(
      (call: unknown[]) => call[0] === ListToolsRequestSchema,
    )![1] as () => Promise<{ tools: Array<{ name: string }> }>;
    const result = await listToolsHandler();
    expect(result.tools).toContainEqual(expect.objectContaining({ name: 'get_energy_data' }));
  });

  it('should fetch energy data for a system', async () => {
    const mockData = { result: 'ok' };
    mockGet.mockResolvedValue(mockData);

    const callToolHandler = mockSetRequestHandler.mock.calls.find(
      (call: unknown[]) => call[0] === CallToolRequestSchema,
    )![1] as (request: { params: { name: string; arguments: Record<string, unknown> } }) => Promise<unknown>;

    const result = (await callToolHandler({
      params: {
        name: 'get_energy_data',
        arguments: { systemKey: 'sys1', from: '2024-01-01', to: '2024-01-02' },
      },
    })) as { content: Array<{ text: string }> };

    expect(mockGet).toHaveBeenCalledWith('/systems/sys1/metrics/energy', {
      from: '2024-01-01',
      to: '2024-01-02',
    });
    expect(result.content[0]!.text).toBe(JSON.stringify(mockData, null, 2));
  });

  it('should handle errors when fetching energy data', async () => {
    mockGet.mockRejectedValue(new Error('API Error'));

    const callToolHandler = mockSetRequestHandler.mock.calls.find(
      (call: unknown[]) => call[0] === CallToolRequestSchema,
    )![1] as (request: { params: { name: string; arguments: Record<string, unknown> } }) => Promise<unknown>;

    const result = (await callToolHandler({
      params: {
        name: 'get_energy_data',
        arguments: { systemKey: 'sys1', from: '2024-01-01', to: '2024-01-02' },
      },
    })) as { content: Array<{ text: string }>; isError: boolean };

    expect(result.isError).toBe(true);
    expect(result.content[0]!.text).toContain('Error fetching energy data: API Error');
  });
});
