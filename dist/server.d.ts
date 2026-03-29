export declare class MeteoControlServer {
    private server;
    private api;
    readonly name = "meteocontrol-mcp";
    readonly version = "1.0.0";
    constructor();
    private setupHandlers;
    private handleGetEnergyData;
    private handleGetAlerts;
    run(): Promise<void>;
}
//# sourceMappingURL=server.d.ts.map