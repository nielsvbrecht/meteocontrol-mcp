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
const { CallToolRequestSchema } = await import('@modelcontextprotocol/sdk/types.js');

describe('Tool Integration Tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    new MeteoControlServer();
  });

  it('should successfully handle a get_energy_data tool call', async () => {
    const mockData = { energy: 1234.5 };
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

    expect(mockGet).toHaveBeenCalled();
    expect(result.content[0]!.text).toBe(JSON.stringify(mockData, null, 2));
  });

  it('should successfully handle a get_alerts tool call', async () => {
    const mockData = { alerts: [] };
    mockGet.mockResolvedValue(mockData);

    const callToolHandler = mockSetRequestHandler.mock.calls.find(
      (call: unknown[]) => call[0] === CallToolRequestSchema,
    )![1] as (request: { params: { name: string; arguments: Record<string, unknown> } }) => Promise<unknown>;

    const result = (await callToolHandler({
      params: {
        name: 'get_alerts',
        arguments: { systemKey: 'sys1' },
      },
    })) as { content: Array<{ text: string }> };

    expect(mockGet).toHaveBeenCalled();
    expect(result.content[0]!.text).toBe(JSON.stringify(mockData, null, 2));
  });

  it('should successfully handle a get_asset_info tool call', async () => {
    const mockData = { id: 'sys1', name: 'My System' };
    mockGet.mockResolvedValue(mockData);

    const callToolHandler = mockSetRequestHandler.mock.calls.find(
      (call: unknown[]) => call[0] === CallToolRequestSchema,
    )![1] as (request: { params: { name: string; arguments: Record<string, unknown> } }) => Promise<unknown>;

    const result = (await callToolHandler({
      params: {
        name: 'get_asset_info',
        arguments: { systemKey: 'sys1' },
      },
    })) as { content: Array<{ text: string }> };

    expect(mockGet).toHaveBeenCalled();
    expect(result.content[0]!.text).toBe(JSON.stringify(mockData, null, 2));
  });
});
