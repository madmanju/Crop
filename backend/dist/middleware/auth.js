"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const supabase_1 = require("../config/supabase");
async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Authorization header missing or malformed' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const user = await (0, supabase_1.verifySupabaseToken)(token);
        req.user = { id: user.id, email: user.email ?? undefined };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid or expired authentication token' });
    }
}
//# sourceMappingURL=auth.js.map