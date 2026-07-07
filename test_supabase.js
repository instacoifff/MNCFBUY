const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  try {
    const { data, error } = await supabase.from('categories').select('*').eq('slug', 'all').single();
    console.log("Data:", data);
    console.log("Error:", error);
  } catch (e) {
    console.log("Exception thrown!", e);
  }
}
run();
