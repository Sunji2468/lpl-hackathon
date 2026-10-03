import express from 'express';
import { authRouter } from './routes/auth.js';
import { advisorRouter } from './routes/advisor.js';

export function createApp({ prisma, jwtSecret }) {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));
  app.use('/api/auth', authRouter({ prisma, jwtSecret }));
  app.use('/api/advisor', advisorRouter({ jwtSecret }));

  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the LPL API' });
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Add API routes above this fallback.
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);

    const status = err.status >= 400 && err.status < 600 ? err.status : 500;
    if (status >= 500) console.error('Request failed:', err.code || err.name);

    res.status(status).json({
      error: status >= 500 ? 'Internal server error' : 'Invalid request',
    });
  });

  return app;
}
