import { createClient } from '@supabase/supabase-js'

const URL = 'https://ryigducrvbphhbfsqasg.supabase.co'

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aWdkdWNydmJwaGhiZnNxYXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzcyNjUsImV4cCI6MjA5MjExMzI2NX0.94oe4FgjRfOyTBTmyZDcBhbavL1AWI8zP_6cTiOeCvU'

export const supabase = createClient(URL, API_KEY);