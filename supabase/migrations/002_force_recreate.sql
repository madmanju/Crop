-- ============================================================
-- CropAI - Force Drop & Recreate Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- Drop everything cleanly
DROP TABLE IF EXISTS advisories CASCADE;
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ADVISORIES TABLE
-- ============================================================
CREATE TABLE advisories (
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
CREATE INDEX idx_advisories_user_id     ON advisories(user_id);
CREATE INDEX idx_advisories_created_at  ON advisories(user_id, created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
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
-- SERVICE ROLE BYPASS (needed for backend service role key)
-- ============================================================
DROP POLICY IF EXISTS "Service role bypass" ON advisories;
CREATE POLICY "Service role bypass"
    ON advisories
    USING (true)
    WITH CHECK (true);

-- Verify
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'advisories'
ORDER BY ordinal_position;
