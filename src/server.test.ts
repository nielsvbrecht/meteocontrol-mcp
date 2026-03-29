import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Define mocks at the top level so they are available to the mock factory
const mockSetRequestHandler = jest.fn();
const mockConnect = jest.fn();

// Use unstable_mockModule for ESM support
jest.unstable_mockModule('@modelcontextprotocol/sdk/server/index.js', () => ({
  Server: jest.fn().mockImplementation(() => ({
    setRequestHandler: mockSetRequestHandler,
    connect: mockConnect,
  })),
}));

jest.unstable_mockModule('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: jest.fn().mockImplementation(() => ({})),
}));

// Dynamically import the server and SDK AFTER mocking
const { MeteoControlServer } = await import('./server.js');
const { ListToolsRequestSchema, CallToolRequestSchema } = await import('@modelcontextprotocol/sdk/types.js');

describe('MeteoControlServer', () => {
  let server: MeteoControlServer;

  beforeEach(() => {
    jest.clearAllMocks();
    server = new MeteoControlServer();
  });

  it('should have a name and version', () => {
    expect(server.name).toBe('meteocontrol-mcp');
    expect(server.version).toBe('1.0.0');
  });

  it('should set up request handlers', () => {
    expect(mockSetRequestHandler).toHaveBeenCalled();
    // Verify specific handlers are registered
    expect(mockSetRequestHandler).toHaveBeenCalledWith(ListToolsRequestSchema, expect.any(Function));
    expect(mockSetRequestHandler).toHaveBeenCalledWith(CallToolRequestSchema, expect.any(Function));
  });

  it('should handle ListToolsRequest', async () => {
    const listToolsHandler = mockSetRequestHandler.mock.calls.find(
      (call: unknown[]) => call[0] === ListToolsRequestSchema,
    )![1] as () => Promise<unknown>;
    const result = await listToolsHandler();
    expect(result).toEqual({ tools: [] });
  });

  it('should handle CallToolRequest with error', async () => {
    const callToolHandler = mockSetRequestHandler.mock.calls.find(
      (call: unknown[]) => call[0] === CallToolRequestSchema,
    )![1] as (request: { params: { name: string } }) => Promise<unknown>;
    await expect(callToolHandler({ params: { name: 'test-tool' } })).rejects.toThrow('Tool not found: test-tool');
  });

  it('should connect to transport when run is called', async () => {
    await server.run();
    expect(mockConnect).toHaveBeenCalled();
  });
});
