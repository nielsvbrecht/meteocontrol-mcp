/**
 * MeteoControl MCP Server
 * Provides access to solar installation data via the VCOM API v2.
 */
export declare class MeteoControlServer {
    private server;
    private api;
    readonly name = "meteocontrol-mcp";
    readonly version = "1.0.0";
    constructor();
    private setupHandlers;
    private handleGetEnergyData;
    private handleGetAlerts;
    private handleGetAssetInfo;
    run(): Promise<void>;
}
//# sourceMappingURL=server.d.ts.map