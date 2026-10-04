"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdvisoryHandler = generateAdvisoryHandler;
exports.getAdvisoriesHandler = getAdvisoriesHandler;
exports.getAdvisoryByIdHandler = getAdvisoryByIdHandler;
exports.deleteAdvisoryHandler = deleteAdvisoryHandler;
const advisorySchema_1 = require("../schemas/advisorySchema");
const geminiService_1 = require("../services/geminiService");
const supabase_1 = require("../config/supabase");
const errorHandler_1 = require("../middleware/errorHandler");
// -----------------------------------------------------------------------
// POST /api/advisories/generate
// -----------------------------------------------------------------------
async function generateAdvisoryHandler(req, res, next) {
    try {
        const userId = req.user.id;
        // Validate request body with Zod
        const parseResult = advisorySchema_1.AdvisoryRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            next(parseResult.error);
            return;
        }
        const params = parseResult.data;
        // Call Gemini service
        const aiResponse = await (0, geminiService_1.generateAdvisory)(params);
        if (!supabase_1.supabaseAdmin) {
            throw (0, errorHandler_1.createError)('Database service is not configured', 500);
        }
        const { data, error } = await supabase_1.supabaseAdmin
            .from('advisories')
            .insert({
            user_id: userId,
            region: params.region,
            land_size_acre: params.landSizeAcre,
            soil_type: params.soilType,
            season: params.season,
            irrigation: params.irrigation,
            budget_range: params.budgetRange,
            primary_goal: params.primaryGoal ?? null,
            ai_response: aiResponse,
        })
            .select()
            .single();
        if (error || !data) {
            console.error('[DB] Insert error:', error);
            throw (0, errorHandler_1.createError)('Failed to save advisory to database', 500);
        }
        res.status(201).json({ id: data.id, advisory: data });
    }
    catch (error) {
        next(error);
    }
}
// -----------------------------------------------------------------------
// GET /api/advisories
// -----------------------------------------------------------------------
async function getAdvisoriesHandler(req, res, next) {
    try {
        const userId = req.user.id;
        if (!supabase_1.supabaseAdmin) {
            throw (0, errorHandler_1.createError)('Database service is not configured', 500);
        }
        const { data, error } = await supabase_1.supabaseAdmin
            .from('advisories')
            .select('id, user_id, region, land_size_acre, soil_type, season, irrigation, budget_range, primary_goal, ai_response, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('[DB] Select error:', error);
            throw (0, errorHandler_1.createError)('Failed to fetch advisories', 500);
        }
        res.json({ advisories: data ?? [] });
    }
    catch (error) {
        next(error);
    }
}
// -----------------------------------------------------------------------
// GET /api/advisories/:id
// -----------------------------------------------------------------------
async function getAdvisoryByIdHandler(req, res, next) {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        if (!id) {
            throw (0, errorHandler_1.createError)('Advisory ID is required', 400);
        }
        if (!supabase_1.supabaseAdmin) {
            throw (0, errorHandler_1.createError)('Database service is not configured', 500);
        }
        const { data, error } = await supabase_1.supabaseAdmin
            .from('advisories')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (error || !data) {
            throw (0, errorHandler_1.createError)('Advisory not found', 404);
        }
        res.json({ advisory: data });
    }
    catch (error) {
        next(error);
    }
}
// -----------------------------------------------------------------------
// DELETE /api/advisories/:id
// -----------------------------------------------------------------------
async function deleteAdvisoryHandler(req, res, next) {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        if (!id) {
            throw (0, errorHandler_1.createError)('Advisory ID is required', 400);
        }
        if (!supabase_1.supabaseAdmin) {
            throw (0, errorHandler_1.createError)('Database service is not configured', 500);
        }
        const { error } = await supabase_1.supabaseAdmin
            .from('advisories')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error) {
            console.error('[DB] Delete error:', error);
            throw (0, errorHandler_1.createError)('Failed to delete advisory', 500);
        }
        res.status(200).json({ message: 'Advisory deleted successfully' });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=advisoryController.js.map