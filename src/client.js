import { createClient } from '@supabase/supabase-js'

const URL = 'https://ryigducrvbphhbfsqasg.supabase.co'

const API_KEY = 'sb_publishable_9_6d1885MD7PoZzlpNV2WA_doCZK6wg'

export const supabase = createClient(URL, API_KEY);
