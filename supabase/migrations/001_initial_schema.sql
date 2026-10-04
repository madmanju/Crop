-- ============================================================
-- CropAI - Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Apply via: npm run migrate (from project root)
--            or paste directly into Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ADVISORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS advisories (
    id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    region          TEXT         NOT NULL,
    land_size_acre  NUMERIC      NOT NULL CHECK (land_size_acre > 0),
    soil_type       TEXT         NOT NULL CHECK (soil_type IN ('Alluvial','Black','Red','Laterite','Arid','Saline','Peaty')),
    season          TEXT         NOT NULL CHECK (season IN ('Spring','Summer','Monsoon','Autumn','Winter')),
    irrigation      TEXT         NOT NULL CHECK (irrigation IN ('Rainfed','Drip','Sprinkler','Canal','Tube well')),
    budget_range    TEXT         NOT NULL CHECK (budget_range IN ('Low','Medium','High')),
    primary_goal    TEXT,
    ai_response     JSONB        NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index for fast user-specific queries
CREATE INDEX IF NOT EXISTS idx_advisories_user_id     ON advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_created_at  ON advisories(user_id, created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Users can only access their own advisories
-- ============================================================
ALTER TABLE advisories ENABLE ROW LEVEL SECURITY;

-- SELECT: users can read only their own rows
DROP POLICY IF EXISTS "Users can view own advisories" ON advisories;
CREATE POLICY "Users can view own advisories"
    ON advisories FOR SELECT
    USING (auth.uid() = user_id);

-- INSERT: users can only insert rows with their own user_id
DROP POLICY IF EXISTS "Users can insert own advisories" ON advisories;
CREATE POLICY "Users can insert own advisories"
    ON advisories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- DELETE: users can only delete their own rows
DROP POLICY IF EXISTS "Users can delete own advisories" ON advisories;
CREATE POLICY "Users can delete own advisories"
    ON advisories FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- COMMENTS
-- ============================================================
COMMENT ON TABLE  advisories                   IS 'AI-generated crop advisory reports created per user';
COMMENT ON COLUMN advisories.user_id           IS 'References auth.users.id — all queries MUST be scoped to this';
COMMENT ON COLUMN advisories.ai_response       IS 'Structured JSON from Gemini: { recommendedCrops, fertilizerSchedule, riskFactors }';
COMMENT ON COLUMN advisories.land_size_acre    IS 'Total cultivable land area in acres (must be positive)';
