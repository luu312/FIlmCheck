// api/supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gdjxsykqhysbxkcjmrkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkanhzeWtxaHlzYnhrY2ptcmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNzAyNDIsImV4cCI6MjAzMDg0NjI0Mn0.Qp3f9-pNfLYkHEMIb5LpYheSEAViFwXsCFsW0DWQz9I';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
