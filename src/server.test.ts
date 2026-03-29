import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockSetRequestHandler = jest.fn();
const mockConnect = jest.fn();

// Mock MCP SDK
jest.unstable_mockModule('@modelcontextprotocol/sdk/server/index.js', () => ({
  Server: jest.fn().mockImplementation(() => ({
    setRequestHandler: mockSetRequestHandler,
    connect: mockConnect,
  })),
}));

jest.unstable_mockModule('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: jest.fn().mockImplementation(() => ({})),
}));

// Mock API
const mockGet = jest.fn();
const mockApiConstructor = jest.fn();
jest.unstable_mockModule('./api.js', () => ({
  MeteoControlApi: mockApiConstructor.mockImplementation(() => ({
    get: mockGet,
  })),
}));

// Set default env vars for testing
process.env['METEOCONTROL_API_KEY'] = 'test-key';
process.env['METEOCONTROL_USER'] = 'test-user';
process.env['METEOCONTROL_PASSWORD'] = 'test-password';

// Dynamically import dependencies AFTER mocking
const { MeteoControlServer } = await import('./server.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = await import('@modelcontextprotocol/sdk/types.js');

describe('MeteoControlServer Comprehensive Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize successfully', () => {
    const server = new MeteoControlServer();
    expect(server).toBeDefined();
    expect(mockApiConstructor).toHaveBeenCalled();
  });

  it('should list tools', async () => {
    new MeteoControlServer();
    const handler = mockSetRequestHandler.mock.calls.find(c => c[0] === ListToolsRequestSchema)![1] as Function;
    const result = await handler();
    expect(result.tools).toHaveLength(3);
  });

  it('should handle tools successfully', async () => {
    new MeteoControlServer();
    const handler = mockSetRequestHandler.mock.calls.find(c => c[0] === CallToolRequestSchema)![1] as Function;
    
    mockGet.mockResolvedValueOnce({ energy: 100 });
    const r1 = await handler({ params: { name: 'get_energy_data', arguments: { systemKey: 's', from: 'f', to: 't' } } });
    expect(r1.content[0].text).toContain('100');

    mockGet.mockResolvedValueOnce({ alerts: [] });
    const r2 = await handler({ params: { name: 'get_alerts', arguments: { systemKey: 's' } } });
    expect(r2.content[0].text).toContain('alerts');

    mockGet.mockResolvedValueOnce({ id: 's' });
    const r3 = await handler({ params: { name: 'get_asset_info', arguments: { systemKey: 's' } } });
    expect(r3.content[0].text).toContain('s');
  });

  it('should handle tool errors (Error object)', async () => {
    new MeteoControlServer();
    const handler = mockSetRequestHandler.mock.calls.find(c => c[0] === CallToolRequestSchema)![1] as Function;
    
    mockGet.mockRejectedValueOnce(new Error('e1'));
    const r1 = await handler({ params: { name: 'get_energy_data', arguments: { systemKey: 's', from: 'f', to: 't' } } });
    expect(r1.isError).toBe(true);

    mockGet.mockRejectedValueOnce(new Error('e2'));
    const r2 = await handler({ params: { name: 'get_alerts', arguments: { systemKey: 's' } } });
    expect(r2.isError).toBe(true);

    mockGet.mockRejectedValueOnce(new Error('e3'));
    const r3 = await handler({ params: { name: 'get_asset_info', arguments: { systemKey: 's' } } });
    expect(r3.isError).toBe(true);
  });

  it('should handle tool errors (non-Error object)', async () => {
    new MeteoControlServer();
    const handler = mockSetRequestHandler.mock.calls.find(c => c[0] === CallToolRequestSchema)![1] as Function;
    
    mockGet.mockRejectedValueOnce('s1');
    const r1 = await handler({ params: { name: 'get_energy_data', arguments: { systemKey: 's', from: 'f', to: 't' } } });
    expect(r1.isError).toBe(true);

    mockGet.mockRejectedValueOnce('s2');
    const r2 = await handler({ params: { name: 'get_alerts', arguments: { systemKey: 's' } } });
    expect(r2.isError).toBe(true);

    mockGet.mockRejectedValueOnce('s3');
    const r3 = await handler({ params: { name: 'get_asset_info', arguments: { systemKey: 's' } } });
    expect(r3.isError).toBe(true);
  });

  it('should handle unknown tool and log error', async () => {
    new MeteoControlServer();
    const handler = mockSetRequestHandler.mock.calls.find(c => c[0] === CallToolRequestSchema)![1] as Function;
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await expect(handler({ params: { name: 'unknown' } })).rejects.toThrow();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should warn and cover empty string branches if credentials missing', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const k = process.env['METEOCONTROL_API_KEY'];
    const u = process.env['METEOCONTROL_USER'];
    const p = process.env['METEOCONTROL_PASSWORD'];
    
    delete process.env['METEOCONTROL_API_KEY'];
    delete process.env['METEOCONTROL_USER'];
    delete process.env['METEOCONTROL_PASSWORD'];
    
    const { MeteoControlServer: S } = await import(`./server.js?v=${Date.now()}_missing_all`);
    new S();
    expect(spy).toHaveBeenCalled();
    
    process.env['METEOCONTROL_API_KEY'] = k;
    process.env['METEOCONTROL_USER'] = u;
    process.env['METEOCONTROL_PASSWORD'] = p;
    spy.mockRestore();
  });

  it('should run correctly', async () => {
    const server = new MeteoControlServer();
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await server.run();
    expect(mockConnect).toHaveBeenCalled();
    spy.mockRestore();
  });
});
