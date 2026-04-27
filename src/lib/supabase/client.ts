import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

import { env, isSupabaseConfigured } from '@/src/lib/env';
import { mmkvStorageAdapter } from '@/src/lib/storage/mmkv';
import type { Database } from '@/src/types/database.types';

export const supabase = createClient<Database>(
  isSupabaseConfigured ? env.supabaseUrl : 'https://example.supabase.co',
  isSupabaseConfigured ? env.supabaseAnonKey : 'anon-key-not-configured',
  {
    auth: {
      storage: mmkvStorageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
