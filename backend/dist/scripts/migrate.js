"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
async function runMigrations() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error('❌ DATABASE_URL is not set in .env\n' +
            '   Find it in: Supabase Dashboard → Project Settings → Database → Connection string (URI mode)\n' +
            '   Example: postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres');
        process.exit(1);
    }
    const client = new pg_1.Client({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
    });
    try {
        console.log('🔌 Connecting to Supabase PostgreSQL...');
        await client.connect();
        console.log('✅ Connected successfully');
        const migrationPath = path_1.default.resolve(__dirname, '../../../supabase/migrations/001_initial_schema.sql');
        if (!fs_1.default.existsSync(migrationPath)) {
            throw new Error(`Migration file not found at: ${migrationPath}`);
        }
        const sql = fs_1.default.readFileSync(migrationPath, 'utf8');
        console.log('📦 Executing migration: 001_initial_schema.sql...');
        await client.query(sql);
        console.log('✅ Migration applied successfully!');
        console.log('\n🌱 CropAI database schema is ready.');
        console.log('   Tables: advisories');
        console.log('   RLS:    enabled with user-scoped policies\n');
    }
    catch (error) {
        console.error('❌ Migration failed:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
    finally {
        await client.end();
    }
}
runMigrations();
//# sourceMappingURL=migrate.js.map