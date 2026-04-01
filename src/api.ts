import axios from 'axios';

export interface ApiConfig {
  apiKey: string;
  user: string;
  password: string;
  baseUrl: string;
}

export class MeteoControlApi {
  private client;

  constructor(config: ApiConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.meteocontrol.de/v2',
      headers: config.apiKey ? { 'X-API-KEY': config.apiKey } : {},
      auth:
        config.user && config.password
          ? {
              username: config.user,
              password: config.password,
            }
          : undefined,
    });
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }
}
