import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('supabaseUrl и supabaseKey обязательны для настройки Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseKey);