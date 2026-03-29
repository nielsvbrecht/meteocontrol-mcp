import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockGet = jest.fn();
const mockCreate = jest.fn().mockReturnValue({
  get: mockGet,
});

jest.unstable_mockModule('axios', () => ({
  default: {
    create: mockCreate,
  },
}));

const { MeteoControlApi } = await import('./api.js');

interface MockApi {
  get: <T>(url: string, params?: Record<string, unknown>) => Promise<T>;
}

describe('MeteoControlApi', () => {
  let api: MockApi;
  const mockConfig = {
    apiKey: 'test-api-key',
    apiSecret: 'test-api-secret',
    baseUrl: 'https://api.meteocontrol.de/v2',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    api = new MeteoControlApi(mockConfig) as unknown as MockApi;
  });

  it('should initialize with config', () => {
    expect(api).toBeDefined();
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: mockConfig.baseUrl,
        auth: {
          username: mockConfig.apiKey,
          password: mockConfig.apiSecret,
        },
      }),
    );
  });

  it('should throw error if apiKey or apiSecret is missing', async () => {
    const { MeteoControlApi: ApiClass } = await import('./api.js');
    expect(() => new ApiClass({ apiKey: '', apiSecret: '', baseUrl: '' })).toThrow();
  });

  it('should perform GET request', async () => {
    mockGet.mockResolvedValue({ data: { result: 'ok' } });
    const result = await api.get('/test');

    expect(mockGet).toHaveBeenCalledWith('/test', { params: undefined });
    expect(result).toEqual({ result: 'ok' });
  });
});
