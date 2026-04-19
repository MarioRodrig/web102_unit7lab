import { createClient } from '@supabase/supabase-js'

const URL = 'https://ryigducrvbphhbfsqasg.supabase.co'


export const supabase = createClient(URL, API_KEY);