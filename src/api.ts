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
    if (!config.apiKey || !config.user || !config.password) {
      throw new Error('MeteoControl API key, user, and password are required');
    }

    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.meteocontrol.de/v2',
      headers: {
        'X-API-KEY': config.apiKey,
      },
      auth: {
        username: config.user,
        password: config.password,
      },
    });
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }
}
