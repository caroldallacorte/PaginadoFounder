import { Pool } from 'pg';

// Do not expose your actual connection string in client-side code
// Use environment variables instead
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Needed for Neon PostgreSQL
  },
});

export default pool;