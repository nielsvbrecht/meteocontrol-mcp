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

// Set env vars for testing
process.env['METEOCONTROL_API_KEY'] = 'test-key';
process.env['METEOCONTROL_USER'] = 'test-user';
process.env['METEOCONTROL_PASSWORD'] = 'test-password';

const { MeteoControlServer } = await import('./server.js');
const { CallToolRequestSchema } = await import('@modelcontextprotocol/sdk/types.js');

describe('Tool Integration Tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    new MeteoControlServer();
  });

  const getHandler = () => mockSetRequestHandler.mock.calls.find(c => c[0] === CallToolRequestSchema)![1] as Function;

  it('should successfully handle a get_energy_data tool call', async () => {
    const mockData = { energy: 1234.5 };
    mockGet.mockResolvedValue(mockData);
    const handler = getHandler();

    const result = (await handler({
      params: {
        name: 'get_energy_data',
        arguments: { systemKey: 'sys1', from: '2024-01-01', to: '2024-01-02' },
      },
    })) as { content: Array<{ text: string }> };

    expect(mockGet).toHaveBeenCalledWith('/systems/sys1/metrics/energy', expect.any(Object));
    expect(result.content[0]!.text).toBe(JSON.stringify(mockData, null, 2));
  });

  it('should successfully handle a get_alerts tool call', async () => {
    const mockData = { alerts: [] };
    mockGet.mockResolvedValue(mockData);
    const handler = getHandler();

    const result = (await handler({
      params: {
        name: 'get_alerts',
        arguments: { systemKey: 'sys1' },
      },
    })) as { content: Array<{ text: string }> };

    expect(mockGet).toHaveBeenCalledWith('/systems/sys1/alerts', expect.any(Object));
    expect(result.content[0]!.text).toBe(JSON.stringify(mockData, null, 2));
  });

  it('should successfully handle a get_asset_info tool call', async () => {
    const mockData = { id: 'sys1', name: 'My System' };
    mockGet.mockResolvedValue(mockData);
    const handler = getHandler();

    const result = (await handler({
      params: {
        name: 'get_asset_info',
        arguments: { systemKey: 'sys1' },
      },
    })) as { content: Array<{ text: string }> };

    expect(mockGet).toHaveBeenCalledWith('/systems/sys1', expect.any(Object));
    expect(result.content[0]!.text).toBe(JSON.stringify(mockData, null, 2));
  });
});
