# CropAI Supabase Migrations

## How to Apply

### Option 1: Supabase Dashboard (Recommended for first-time setup)
1. Go to your Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Paste the contents of `001_initial_schema.sql`
4. Click **Run**

### Option 2: Migration Script
1. Set `DATABASE_URL` in `backend/.env`  
   *(Found in Supabase Dashboard → Project Settings → Database → Connection string → URI)*
2. Run:
   ```bash
   npm run migrate
   ```

## Migration Files

| File | Description |
|------|-------------|
| `001_initial_schema.sql` | Creates `advisories` table, indexes, and all RLS policies |

## Re-running

The migration uses `CREATE TABLE IF NOT EXISTS` and `DROP POLICY IF EXISTS` / `CREATE POLICY` 
so it is safe to run multiple times without error.
