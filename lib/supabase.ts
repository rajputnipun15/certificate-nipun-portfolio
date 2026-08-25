import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ehhvazggjgnoiuxikiqq.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaHZhemdnamdub2l1eGlraXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5OTgwNTEsImV4cCI6MjEwMTU3NDA1MX0.f_TSNh5teR8-lYz_C1qeWZOkz54RghwfrV2kvquVqfo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    supabaseUrl !== 'https://placeholder-supabase-url.supabase.co' &&
    !!supabaseAnonKey
  );
};
