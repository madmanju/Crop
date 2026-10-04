import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import advisoryRoutes from './routes/advisoryRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// -----------------------------------------------------------------------
// CORS — only allow requests from the configured frontend URL
// -----------------------------------------------------------------------
app.use(
  cors({
    origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:4173'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// -----------------------------------------------------------------------
// Body parsing
// -----------------------------------------------------------------------
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// -----------------------------------------------------------------------
// Request logger (development only)
// -----------------------------------------------------------------------
if (env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// -----------------------------------------------------------------------
// Health check
// -----------------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      supabase: env.hasSupabase ? 'configured' : 'mock mode',
      gemini: env.hasGemini ? 'configured' : 'mock mode',
    },
  });
});

// -----------------------------------------------------------------------
// API Routes
// -----------------------------------------------------------------------
app.use('/api/advisories', advisoryRoutes);

// -----------------------------------------------------------------------
// 404 handler for unknown API routes
// -----------------------------------------------------------------------
app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// -----------------------------------------------------------------------
// Global error handler (must be registered last)
// -----------------------------------------------------------------------
app.use(errorHandler);

// -----------------------------------------------------------------------
// Start server
// -----------------------------------------------------------------------
app.listen(env.PORT, () => {
  console.log(`\n🌱 CropAI Backend running at http://localhost:${env.PORT}`);
  console.log(`   Health: http://localhost:${env.PORT}/api/health`);
  console.log(`   Mode:   ${env.NODE_ENV}`);
  console.log(`   Supabase: ${env.hasSupabase ? '✅ Connected' : '⚠️  Mock mode'}`);
  console.log(`   Gemini:   ${env.hasGemini ? '✅ Connected' : '⚠️  Mock mode'}\n`);
});

export default app;
