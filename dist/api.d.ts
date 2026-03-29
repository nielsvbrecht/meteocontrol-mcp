export interface ApiConfig {
    apiKey: string;
    apiSecret: string;
    baseUrl: string;
}
export declare class MeteoControlApi {
    private client;
    constructor(config: ApiConfig);
    get<T>(url: string, params?: Record<string, unknown>): Promise<T>;
}
//# sourceMappingURL=api.d.ts.map