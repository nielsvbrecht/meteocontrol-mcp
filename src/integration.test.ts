import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockGet = jest.fn();
const toolHandlers = new Map<string, (args: Record<string, unknown>) => Promise<unknown>>();

jest.unstable_mockModule('@modelcontextprotocol/sdk/server/mcp.js', () => ({
  McpServer: jest.fn().mockImplementation(() => {
    const server = {
      tool: jest.fn().mockImplementation((name, _schema, handler) => {
        toolHandlers.set(name, handler);
        return server;
      }),
      setRequestHandler: jest.fn(),
      connect: jest.fn(),
      assertCanSetRequestHandler: jest.fn(),
    };
    return server;
  }),
}));

jest.unstable_mockModule('./api.js', () => ({
  MeteoControlApi: jest.fn().mockImplementation(() => ({
    get: mockGet,
  })),
}));

const { MeteoControlServer } = await import('./server.js');

describe('Tool Integration Full Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    toolHandlers.clear();
  });

  it('should successfully handle a get_energy_data tool call', async () => {
    const mockData = { energy: 100 };
    mockGet.mockResolvedValue(mockData);
    new MeteoControlServer();
    const handler = toolHandlers.get('get_energy_data')!;

    const result = await handler({ systemKey: 'sys1', from: '2024-01-01', to: '2024-01-02' });

    expect(mockGet).toHaveBeenCalledWith('/systems/sys1/basics/abbreviations/E_Z_EVU/measurements', expect.any(Object));
    expect(result.content[0]!.text).toBe(JSON.stringify(mockData, null, 2));
  });

  it('should successfully handle a get_alerts tool call', async () => {
    const mockData = { alarms: [] };
    mockGet.mockResolvedValue(mockData);
    new MeteoControlServer();
    const handler = toolHandlers.get('get_alerts')!;

    const result = await handler({ systemKey: 'sys1' });

    expect(mockGet).toHaveBeenCalledWith('/systems/sys1/alarms');
    expect(result.content[0]!.text).toBe(JSON.stringify(mockData, null, 2));
  });
});
