import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ckvdlpwfkoqkwrolsxfp.supabase.co'
const supabaseKey = 'sb_publishable_IY5GvNZwjXQ6xIIOPAoy6A_mmIjGZ9Q'

export const supabase = createClient(supabaseUrl, supabaseKey)