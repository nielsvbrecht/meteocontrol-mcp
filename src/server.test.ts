import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';

const mockConnect = jest.fn();
const mockSetRequestHandler = jest.fn();
const toolHandlers = new Map<string, (args: Record<string, unknown>) => Promise<unknown>>();

jest.unstable_mockModule('@modelcontextprotocol/sdk/server/mcp.js', () => ({
  McpServer: jest.fn().mockImplementation(() => {
    const server = {
      tool: jest.fn().mockImplementation((name, _schema, handler) => {
        toolHandlers.set(name, handler);
        return server;
      }),
      setRequestHandler: mockSetRequestHandler,
      connect: mockConnect,
      assertCanSetRequestHandler: jest.fn(),
    };
    return server;
  }),
}));

jest.unstable_mockModule('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: jest.fn().mockImplementation(() => ({})),
}));

const mockGet = jest.fn();
jest.unstable_mockModule('./api.js', () => ({
  MeteoControlApi: jest.fn().mockImplementation(() => ({
    get: mockGet,
  })),
}));

const { MeteoControlServer } = await import('./server.js');

describe('MeteoControlServer Full Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    toolHandlers.clear();
  });

  it('should register all tools', async () => {
    new MeteoControlServer();
    expect(toolHandlers.has('list_systems')).toBe(true);
    expect(toolHandlers.has('get_energy_data')).toBe(true);
    expect(toolHandlers.has('get_alerts')).toBe(true);
    expect(toolHandlers.has('get_asset_info')).toBe(true);
  });

  it('should handle list_systems successfully', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('list_systems')!;
    mockGet.mockResolvedValue({ data: [] });
    const result = await handler({});
    expect(result.content[0].text).toContain('data');
  });

  it('should handle get_energy_data successfully', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('get_energy_data')!;
    mockGet.mockResolvedValue({ energy: 100 });
    const result = await handler({ systemKey: 's', from: 'f', to: 't' });
    expect(result.content[0].text).toContain('100');
  });

  it('should handle errors in tools', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('get_alerts')!;
    mockGet.mockRejectedValue(new Error('API Error'));
    const result = await handler({ systemKey: 's' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('API Error');
  });

  it('should run correctly', async () => {
    const server = new MeteoControlServer();
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockTransport = {} as unknown as Transport;
    await server.run(mockTransport);
    expect(mockConnect).toHaveBeenCalledWith(mockTransport);
    spy.mockRestore();
  });
});
