import { Registry, collectDefaultMetrics, Histogram, Counter } from 'prom-client';
import { RequestHandler } from 'express';
import { logger } from './logger';

// Create a new registry
export const register = new Registry();

// Add default metrics (CPU, memory, etc.)
collectDefaultMetrics({ register });

// Define thresholds for different types of requests (in ms)
const THRESHOLDS = {
  CONCERNING: 2000,    // 2 seconds - concerning
  CRITICAL: 5000,      // 5 seconds - critical
  SEVERE: 10000,       // 10 seconds - severe
  
  // Route-specific thresholds
  ROUTES: {
    'default': 1000
  } as Record<string, number>
};

// Create custom metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register]
});

export const httpRequestTotal = new Counter({
  name: 'http_request_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

// Middleware to track request metrics
export const metricsMiddleware: RequestHandler = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const durationMs = duration * 1000;

    const labels = {
      method: req.method,
      route: req.originalUrl || req.route?.path || req.path,
      status: res.statusCode
    };

    // Record metrics
    httpRequestDuration.observe(labels, duration);
    httpRequestTotal.inc(labels);

    // Get route-specific threshold
    const routeThreshold = THRESHOLDS.ROUTES[req.path] || THRESHOLDS.ROUTES.default;

    // Determine severity and log appropriately
    if (durationMs > THRESHOLDS.SEVERE) {
      logger.error('SEVERE: Extremely slow request detected', {
        requestId: req.id,
        ...labels,
        durationMs,
        threshold: THRESHOLDS.SEVERE,
        exceedBy: `${((durationMs / THRESHOLDS.SEVERE) * 100 - 100).toFixed(1)}%`,
        query: req.query,
        userId: req.headers['x-user-id'],
        memory: process.memoryUsage(),
      });
    } else if (durationMs > THRESHOLDS.CRITICAL) {
      logger.error('CRITICAL: Very slow request detected', {
        requestId: req.id,
        ...labels,
        durationMs,
        threshold: THRESHOLDS.CRITICAL,
        exceedBy: `${((durationMs / THRESHOLDS.CRITICAL) * 100 - 100).toFixed(1)}%`,
        query: req.query,
        userId: req.headers['x-user-id']
      });
    } else if (durationMs > THRESHOLDS.CONCERNING) {
      logger.warn('CONCERNING: Slow request detected', {
        requestId: req.id,
        ...labels,
        durationMs,
        threshold: THRESHOLDS.CONCERNING,
        exceedBy: `${((durationMs / THRESHOLDS.CONCERNING) * 100 - 100).toFixed(1)}%`,
        query: req.query,
        userId: req.headers['x-user-id']
      });
    } else if (durationMs > routeThreshold) {
      logger.warn('Slow request for route', {
        requestId: req.id,
        ...labels,
        durationMs,
        threshold: routeThreshold,
        exceedBy: `${((durationMs / routeThreshold) * 100 - 100).toFixed(1)}%`,
        query: req.query
      });
    } else {
      logger.debug('Request metrics recorded', {
        requestId: req.id,
        ...labels,
        durationMs
      });
    }
  });

  next();
};

// Metrics endpoint handler
export const metricsHandler: RequestHandler = async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    logger.error('Failed to generate metrics', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    res.status(500).end();
  }
}; 