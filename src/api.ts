import axios from 'axios';

export interface ApiConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
}

export class MeteoControlApi {
  private client;

  constructor(config: ApiConfig) {
    if (!config.apiKey || !config.apiSecret) {
      throw new Error('MeteoControl API key and secret are required');
    }

    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.meteocontrol.de/v2',
      auth: {
        username: config.apiKey,
        password: config.apiSecret,
      },
    });
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }
}
