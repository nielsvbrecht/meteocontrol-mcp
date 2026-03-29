import axios from 'axios';
export class MeteoControlApi {
    client;
    constructor(config) {
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
    async get(url, params) {
        const response = await this.client.get(url, { params });
        return response.data;
    }
}
//# sourceMappingURL=api.js.map