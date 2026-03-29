#!/usr/bin/env node
import { MeteoControlServer } from './server.js';

const server = new MeteoControlServer();
server.run().catch((error) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
