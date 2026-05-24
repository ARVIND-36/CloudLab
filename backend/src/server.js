import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { closeDatabase } from './config/database.js';

const server = app.listen(env.port, () => {
  logger.info('CloudLab backend listening', { port: env.port, env: env.nodeEnv });
});

async function shutdown(signal) {
  logger.info(`Received ${signal}, shutting down`);

  server.close(async () => {
    try {
      await closeDatabase();
      process.exit(0);
    } catch (error) {
      logger.error('Failed to close database cleanly', { error: error.message });
      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));