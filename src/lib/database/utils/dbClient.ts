import { createClient } from '@supabase/supabase-js'


const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

export default db;