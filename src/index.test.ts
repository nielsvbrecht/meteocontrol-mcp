import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockRun = jest.fn();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
const mockProcessExit = jest
  .spyOn(process, 'exit')
  .mockImplementation((_code?: number | string | null | undefined) => undefined as never);

jest.unstable_mockModule('./server.js', () => ({
  MeteoControlServer: jest.fn().mockImplementation(() => ({
    run: mockRun,
  })),
}));

describe('Index Entry Point', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize and run the server successfully', async () => {
    mockRun.mockResolvedValue(undefined);
    await import(`./index.js?test=${Date.now()}`);
    expect(mockRun).toHaveBeenCalled();
  });

  it('should handle fatal errors during startup', async () => {
    const error = new Error('Test Fatal Error');
    mockRun.mockRejectedValue(error);
    await import(`./index.js?error=${Date.now()}`);

    // We need to wait a bit for the promise rejection in index.js to be handled
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(mockConsoleError).toHaveBeenCalledWith('Fatal error running server:', error);
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });
});
