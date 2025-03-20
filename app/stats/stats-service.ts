'use client';

import { supabase } from '../utils/supabase';
import { Tables } from '../utils/supabase';
import { User } from '@supabase/supabase-js';

type DatingEntry = Tables['dating_entries']['Row'];

export async function fetchDatingStats(user: User | null) {
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  try {
    const { data: entries, error } = await supabase
      .from('dating_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching dating entries:', error);
      throw error;
    }
    
    return entries || [];
  } catch (error: any) {
    console.error('Error in fetchDatingStats:', error);
    throw new Error(error.message || 'Failed to load stats');
  }
} 