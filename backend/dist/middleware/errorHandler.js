"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.createError = createError;
const zod_1 = require("zod");
const env_1 = require("../config/env");
function errorHandler(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
    // Log full error details on the server side
    console.error('[ERROR]', {
        message: err.message,
        stack: env_1.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
    });
    // Handle Zod validation errors specifically
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            error: 'Validation failed',
            details: err.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
        return;
    }
    const statusCode = err.statusCode ?? 500;
    // Never expose raw internal errors to clients
    const message = statusCode < 500
        ? err.message
        : 'An internal server error occurred. Please try again.';
    res.status(statusCode).json({ error: message });
}
function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}
//# sourceMappingURL=errorHandler.js.map