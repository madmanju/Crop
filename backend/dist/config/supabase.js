"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = void 0;
exports.verifySupabaseToken = verifySupabaseToken;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
// Admin client — uses service role key, bypasses RLS.
// ONLY use this on the backend; never expose service role key to the frontend.
exports.supabaseAdmin = env_1.env.hasSupabase
    ? (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
    : null;
// Lightweight helper to validate user JWTs from the Authorization header.
// We use the admin client's auth.getUser() which calls Supabase auth server.
async function verifySupabaseToken(token) {
    if (!exports.supabaseAdmin) {
        throw new Error('Supabase not configured');
    }
    const { data, error } = await exports.supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
        throw new Error(error?.message ?? 'Invalid token');
    }
    return data.user;
}
//# sourceMappingURL=supabase.js.map