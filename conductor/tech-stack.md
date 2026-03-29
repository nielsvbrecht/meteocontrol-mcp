# Tech Stack: MCP Server for MeteoControl VCOM API v2

## Core Language and Runtime
- **Language:** TypeScript
- **Runtime:** Node.js 18+

## MCP Implementation
- **SDK:** @modelcontextprotocol/sdk (v1.0.0+)
- **Transport:** Standard MCP JSON-RPC over Standard Input/Output (stdio)

## API Integration
- **HTTP Client:** Axios (for robust, promise-based API requests)
- **API Target:** MeteoControl VCOM API v2 (RESTful interface)
- **Authentication:** 3-Credential Auth (X-API-KEY header + Basic Auth for User/Password)

## Testing and Quality Assurance
- **Test Runner:** Jest (for unit and integration testing)
- **TypeScript Support:** ts-jest (for seamless TypeScript compilation during tests)
- **Mocking:** axios-mock-adapter (for mocking VCOM API v2 responses)

## Tooling and Configuration
- **Package Manager:** npm (or yarn/pnpm based on preference)
- **Linter:** ESLint (for maintaining high code quality)
- **Formatter:** Prettier (for consistent code formatting)
- **Build Tool:** tsc (the standard TypeScript compiler)
