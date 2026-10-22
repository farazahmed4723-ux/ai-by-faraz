require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
// Use service role key if available for backend operations (bypasses RLS for secure server-side inserts), or anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.log(`[Supabase] Client initialized for: ${supabaseUrl}`);
  } catch (error) {
    console.error('[Supabase] Initialization failed:', error.message);
  }
} else {
  console.warn('[Supabase] Warning: SUPABASE_URL or SUPABASE_KEY missing in .env');
}

module.exports = supabase;
