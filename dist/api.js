import axios from 'axios';
export class MeteoControlApi {
    client;
    constructor(config) {
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
    async get(url, params) {
        const response = await this.client.get(url, { params });
        return response.data;
    }
}
//# sourceMappingURL=api.js.map