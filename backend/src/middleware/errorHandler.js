import { ApiError } from '../utils/apiError.js';
import { logger } from '../config/logger.js';

export function errorHandler(error, _req, res, _next) {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const payload = {
    error: error.message ?? 'Internal Server Error',
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (statusCode >= 500) {
    logger.error('Unhandled request error', {
      error: error.message,
      stack: error.stack,
    });
  }

  res.status(statusCode).json(payload);
}