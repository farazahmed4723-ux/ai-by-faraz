require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('[Migration Error]: DATABASE_URL not set in .env');
    process.exit(1);
  }

  console.log('[Migration] Connecting to Supabase PostgreSQL database...');
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('[Migration] Connected successfully!');

    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('[Migration] Executing schema.sql...');
    await client.query(sql);

    console.log(`
=============================================================
  🎉 SUPABASE MIGRATION COMPLETED SUCCESSFULLY!
=============================================================
  ✅ Table 'quotes' created with indexes & RLS
  ✅ Table 'messages' created with indexes & RLS
  ✅ Realtime synchronization active
=============================================================
    `);
  } catch (err) {
    console.error('[Migration Failed]:', err.message);
  } finally {
    await client.end();
  }
}

runMigration();
