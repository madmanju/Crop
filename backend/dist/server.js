"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const advisoryRoutes_1 = __importDefault(require("./routes/advisoryRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// -----------------------------------------------------------------------
// CORS — only allow requests from the configured frontend URL
// -----------------------------------------------------------------------
app.use((0, cors_1.default)({
    origin: [env_1.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:4173'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// -----------------------------------------------------------------------
// Body parsing
// -----------------------------------------------------------------------
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// -----------------------------------------------------------------------
// Request logger (development only)
// -----------------------------------------------------------------------
if (env_1.env.NODE_ENV === 'development') {
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
            supabase: env_1.env.hasSupabase ? 'configured' : 'mock mode',
            gemini: env_1.env.hasGemini ? 'configured' : 'mock mode',
        },
    });
});
// -----------------------------------------------------------------------
// API Routes
// -----------------------------------------------------------------------
app.use('/api/advisories', advisoryRoutes_1.default);
// -----------------------------------------------------------------------
// 404 handler for unknown API routes
// -----------------------------------------------------------------------
app.use('/api/*', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});
// -----------------------------------------------------------------------
// Global error handler (must be registered last)
// -----------------------------------------------------------------------
app.use(errorHandler_1.errorHandler);
// -----------------------------------------------------------------------
// Start server
// -----------------------------------------------------------------------
app.listen(env_1.env.PORT, () => {
    console.log(`\n🌱 CropAI Backend running at http://localhost:${env_1.env.PORT}`);
    console.log(`   Health: http://localhost:${env_1.env.PORT}/api/health`);
    console.log(`   Mode:   ${env_1.env.NODE_ENV}`);
    console.log(`   Supabase: ${env_1.env.hasSupabase ? '✅ Connected' : '⚠️  Mock mode'}`);
    console.log(`   Gemini:   ${env_1.env.hasGemini ? '✅ Connected' : '⚠️  Mock mode'}\n`);
});
exports.default = app;
//# sourceMappingURL=server.js.map