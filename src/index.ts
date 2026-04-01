#!/usr/bin/env node
import { MeteoControlServer } from './server.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';

const server = new MeteoControlServer();

if (process.env.MCP_TRANSPORT === 'sse') {
  // Remote / Hosted Mode (SSE)
  const app = express();
  const port = process.env.PORT || 3000;
  const serverToken = process.env.MCP_SERVER_TOKEN;

  if (!serverToken) {
    console.error('CRITICAL: MCP_SERVER_TOKEN must be set for SSE transport.');
    process.exit(1);
  }

  // Authentication Middleware
  const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${serverToken}`) {
      console.error('Unauthorized access attempt blocked');
      res.status(401).send('Unauthorized: Invalid or missing Bearer token');
      return;
    }
    next();
  };

  let sseTransport: SSEServerTransport | null = null;

  // Protect both the SSE establishment and the message posting
  app.get('/sse', authMiddleware, async (req, res) => {
    console.error('Authorized SSE connection established');
    sseTransport = new SSEServerTransport('/messages', res);
    await server.run(sseTransport);
  });

  app.post('/messages', authMiddleware, express.json(), async (req, res) => {
    if (sseTransport) {
      await sseTransport.handlePostMessage(req, res);
    } else {
      res.status(400).send('No active SSE connection');
    }
  });

  app.listen(port, () => {
    console.error(`MeteoControl MCP Server (SSE) running on port ${port}`);
    console.error(`Authentication: Required (Bearer token)`);
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
