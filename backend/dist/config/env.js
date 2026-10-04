"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
function optional(name, fallback = '') {
    return process.env[name] ?? fallback;
}
exports.env = {
    PORT: parseInt(optional('PORT', '3000'), 10),
    SUPABASE_URL: optional('SUPABASE_URL'),
    SUPABASE_SERVICE_ROLE_KEY: optional('SUPABASE_SERVICE_ROLE_KEY'),
    DATABASE_URL: optional('DATABASE_URL'),
    GEMINI_API_KEY: optional('GEMINI_API_KEY'),
    FRONTEND_URL: optional('FRONTEND_URL', 'http://localhost:5173'),
    NODE_ENV: optional('NODE_ENV', 'development'),
    // Runtime flags for graceful degradation when keys are missing or placeholders
    get hasSupabase() {
        return Boolean(this.SUPABASE_URL &&
            this.SUPABASE_SERVICE_ROLE_KEY &&
            !this.SUPABASE_URL.includes('your-project-ref') &&
            !this.SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role-key') &&
            !this.SUPABASE_URL.includes('placeholder'));
    },
    get hasGemini() {
        return Boolean(this.GEMINI_API_KEY &&
            !this.GEMINI_API_KEY.includes('your-gemini-api-key') &&
            !this.GEMINI_API_KEY.includes('placeholder'));
    },
};
// Warn (don't throw) so the app starts for UI development without full credentials
if (!exports.env.hasSupabase) {
    console.warn('[CONFIG] ⚠  SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — DB features will use mock data.');
}
if (!exports.env.hasGemini) {
    console.warn('[CONFIG] ⚠  GEMINI_API_KEY not set — AI features will return mock advisory data.');
}
//# sourceMappingURL=env.js.map