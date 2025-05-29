import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://postgres.fzuhgtooncgtosgbpejp:ygqI5zL0qj3deG3E@aws-0-ap-south-1.pooler.supabase.com:6543/postgres",
  },
});

