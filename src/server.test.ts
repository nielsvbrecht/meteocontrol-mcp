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
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    toolHandlers.clear();
    process.env = {
      ...originalEnv,
      METEOCONTROL_API_KEY: 'k',
      METEOCONTROL_USER: 'u',
      METEOCONTROL_PASSWORD: 'p',
    };
  });

  it('should register all tools', async () => {
    new MeteoControlServer();
    expect(toolHandlers.has('list_systems')).toBe(true);
    expect(toolHandlers.has('get_energy_data')).toBe(true);
    expect(toolHandlers.has('get_alerts')).toBe(true);
    expect(toolHandlers.has('get_asset_info')).toBe(true);
  });

  it('should warn if credentials are missing (API_KEY missing)', async () => {
    delete process.env.METEOCONTROL_API_KEY;
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    new MeteoControlServer();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should warn if credentials are missing (USER missing)', async () => {
    delete process.env.METEOCONTROL_USER;
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    new MeteoControlServer();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should warn if credentials are missing (PASSWORD missing)', async () => {
    delete process.env.METEOCONTROL_PASSWORD;
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    new MeteoControlServer();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should handle list_systems successfully', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('list_systems')!;
    mockGet.mockResolvedValue({ data: [] });
    const result = await handler({});
    expect(result.content[0].text).toContain('data');
  });

  it('should handle list_systems error (Error object)', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('list_systems')!;
    mockGet.mockRejectedValue(new Error('List failed'));
    const result = await handler({});
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('List failed');
  });

  it('should handle list_systems error (String)', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('list_systems')!;
    mockGet.mockRejectedValue('List failed string');
    const result = await handler({});
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('List failed string');
  });

  it('should handle get_energy_data successfully', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('get_energy_data')!;
    mockGet.mockResolvedValue({ energy: 100 });
    const result = await handler({ systemKey: 's', from: 'f', to: 't' });
    expect(result.content[0].text).toContain('100');
  });

  it('should handle get_energy_data error (Error)', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('get_energy_data')!;
    mockGet.mockRejectedValue(new Error('Energy failed'));
    const result = await handler({ systemKey: 's', from: 'f', to: 't' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Energy failed');
  });

  it('should handle get_energy_data error (String)', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('get_energy_data')!;
    mockGet.mockRejectedValue('Energy failed string');
    const result = await handler({ systemKey: 's', from: 'f', to: 't' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Energy failed string');
  });

  it('should handle get_alerts successfully', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('get_alerts')!;
    mockGet.mockResolvedValue({ alarms: [] });
    const result = await handler({ systemKey: 's' });
    expect(result.content[0].text).toContain('alarms');
  });

  it('should handle get_alerts error (Error)', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('get_alerts')!;
    mockGet.mockRejectedValue(new Error('Alerts failed'));
    const result = await handler({ systemKey: 's' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Alerts failed');
  });

  it('should handle get_alerts error (String)', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('get_alerts')!;
    mockGet.mockRejectedValue('Alerts failed string');
    const result = await handler({ systemKey: 's' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Alerts failed string');
  });

  it('should handle get_asset_info successfully', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('get_asset_info')!;
    mockGet.mockResolvedValue({ info: 'ok' });
    const result = await handler({ systemKey: 's' });
    expect(result.content[0].text).toContain('ok');
  });

  it('should handle get_asset_info error (Error)', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('get_asset_info')!;
    mockGet.mockRejectedValue(new Error('Asset failed'));
    const result = await handler({ systemKey: 's' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Asset failed');
  });

  it('should handle get_asset_info error (String)', async () => {
    new MeteoControlServer();
    const handler = toolHandlers.get('get_asset_info')!;
    mockGet.mockRejectedValue('Asset failed string');
    const result = await handler({ systemKey: 's' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Asset failed string');
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
