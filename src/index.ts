#!/usr/bin/env node
import { MeteoControlServer } from './server.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';

const server = new MeteoControlServer();

if (process.env.MCP_TRANSPORT === 'sse') {
  // Remote / Hosted Mode (SSE)
  const app = express();
  const port = process.env.PORT || 3000;
  let sseTransport: SSEServerTransport | null = null;

  app.get('/sse', async (req, res) => {
    console.error('New SSE connection established');
    sseTransport = new SSEServerTransport('/messages', res);
    await server.run(sseTransport);
  });

  app.post('/messages', async (req, res) => {
    if (sseTransport) {
      await sseTransport.handlePostMessage(req, res);
    } else {
      res.status(400).send('No active SSE connection');
    }
  });

  app.listen(port, () => {
    console.error(`MeteoControl MCP Server (SSE) running on port ${port}`);
    console.error(`Endpoints: GET /sse, POST /messages`);
  });
} else {
  // Local Mode (Stdio)
  const transport = new StdioServerTransport();
  server.run(transport).catch((error) => {
    console.error('Fatal error running server:', error);
    process.exit(1);
  });
}
