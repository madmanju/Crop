import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback: string = ''): string {
  return process.env[name] ?? fallback;
}

export const env = {
  PORT: parseInt(optional('PORT', '3000'), 10),
  SUPABASE_URL: optional('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: optional('SUPABASE_SERVICE_ROLE_KEY'),
  DATABASE_URL: optional('DATABASE_URL'),
  GEMINI_API_KEY: optional('GEMINI_API_KEY'),
  FRONTEND_URL: optional('FRONTEND_URL', 'http://localhost:5173'),
  NODE_ENV: optional('NODE_ENV', 'development'),

  // Runtime flags for graceful degradation when keys are missing or placeholders
  get hasSupabase(): boolean {
    return Boolean(
      this.SUPABASE_URL &&
      this.SUPABASE_SERVICE_ROLE_KEY &&
      !this.SUPABASE_URL.includes('your-project-ref') &&
      !this.SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role-key') &&
      !this.SUPABASE_URL.includes('placeholder')
    );
  },
  get hasGemini(): boolean {
    return Boolean(
      this.GEMINI_API_KEY &&
      !this.GEMINI_API_KEY.includes('your-gemini-api-key') &&
      !this.GEMINI_API_KEY.includes('placeholder')
    );
  },
};

// Warn (don't throw) so the app starts for UI development without full credentials
if (!env.hasSupabase) {
  console.warn(
    '[CONFIG] ⚠  SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — DB features will use mock data.'
  );
}
if (!env.hasGemini) {
  console.warn(
    '[CONFIG] ⚠  GEMINI_API_KEY not set — AI features will return mock advisory data.'
  );
}
