import { Request, Response, NextFunction } from 'express';
import { AdvisoryRequestSchema, type Advisory } from '../schemas/advisorySchema';
import { generateAdvisory } from '../services/geminiService';
import { supabaseAdmin } from '../config/supabase';
import { createError } from '../middleware/errorHandler';

// -----------------------------------------------------------------------
// POST /api/advisories/generate
// -----------------------------------------------------------------------
export async function generateAdvisoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;

    // Validate request body with Zod
    const parseResult = AdvisoryRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      next(parseResult.error);
      return;
    }

    const params = parseResult.data;

    // Call Gemini service
    const aiResponse = await generateAdvisory(params);

    if (!supabaseAdmin) {
      throw createError('Database service is not configured', 500);
    }

    const { data, error } = await supabaseAdmin
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
      throw createError('Failed to save advisory to database', 500);
    }

    res.status(201).json({ id: data.id, advisory: data as Advisory });
  } catch (error) {
    next(error);
  }
}

// -----------------------------------------------------------------------
// GET /api/advisories
// -----------------------------------------------------------------------
export async function getAdvisoriesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;

    if (!supabaseAdmin) {
      throw createError('Database service is not configured', 500);
    }

    const { data, error } = await supabaseAdmin
      .from('advisories')
      .select('id, user_id, region, land_size_acre, soil_type, season, irrigation, budget_range, primary_goal, ai_response, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[DB] Select error:', error);
      throw createError('Failed to fetch advisories', 500);
    }

    res.json({ advisories: data ?? [] });
  } catch (error) {
    next(error);
  }
}

// -----------------------------------------------------------------------
// GET /api/advisories/:id
// -----------------------------------------------------------------------
export async function getAdvisoryByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    if (!id) {
      throw createError('Advisory ID is required', 400);
    }

    if (!supabaseAdmin) {
      throw createError('Database service is not configured', 500);
    }

    const { data, error } = await supabaseAdmin
      .from('advisories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw createError('Advisory not found', 404);
    }

    res.json({ advisory: data as Advisory });
  } catch (error) {
    next(error);
  }
}

// -----------------------------------------------------------------------
// DELETE /api/advisories/:id
// -----------------------------------------------------------------------
export async function deleteAdvisoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    if (!id) {
      throw createError('Advisory ID is required', 400);
    }

    if (!supabaseAdmin) {
      throw createError('Database service is not configured', 500);
    }

    const { error } = await supabaseAdmin
      .from('advisories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('[DB] Delete error:', error);
      throw createError('Failed to delete advisory', 500);
    }

    res.status(200).json({ message: 'Advisory deleted successfully' });
  } catch (error) {
    next(error);
  }
}
