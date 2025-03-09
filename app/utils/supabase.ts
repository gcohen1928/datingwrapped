import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'sb-auth-token',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

export type Tables = {
  dating_entries: {
    Row: {
      id: string;
      user_id: string;
      person_name: string;
      platform: string;
      num_dates: number;
      total_cost: number;
      avg_duration: number;
      rating: number;
      outcome: string;
      notes: string;
      created_at: string;
      age?: number;
      hotness?: number;
      occupation?: string;
      relationship_status?: string;
      status?: string;
      red_flags?: string[];
      green_flags?: string[];
    };
    Insert: Omit<Tables['dating_entries']['Row'], 'id' | 'created_at'> & { 
      id?: string;
      created_at?: string;
    };
    Update: Partial<Tables['dating_entries']['Insert']>;
  };
  wrapped_shares: {
    Row: {
      id: string;
      user_id: string;
      data: Record<string, any>;
      is_public: boolean;
      created_at: string;
    };
    Insert: Omit<Tables['wrapped_shares']['Row'], 'id' | 'created_at'> & {
      id?: string;
      created_at?: string;
    };
    Update: Partial<Tables['wrapped_shares']['Insert']>;
  };
};