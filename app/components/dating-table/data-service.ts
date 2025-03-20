'use client';

import { supabase } from '../../utils/supabase';
import { Tables } from '../../utils/supabase';

type DatingEntry = Tables['dating_entries']['Row'];
type NewDatingEntry = Tables['dating_entries']['Insert'];

// Extended types to include temporary animation properties
type ExtendedDatingEntry = DatingEntry & { tempId?: string };
type ExtendedNewDatingEntry = NewDatingEntry & { tempId?: string };

export async function fetchUserEntries() {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Fetch entries for this user
    const { data: entries, error } = await supabase
      .from('dating_entries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { 
      userId: user.id,
      entries: entries || [] 
    };
  } catch (error: any) {
    console.error('Error fetching data:', error);
    throw new Error(error.message || 'Failed to load data');
  }
}

export async function saveEntry(userId: string, entry: ExtendedDatingEntry | ExtendedNewDatingEntry) {
  try {
    // Create a copy without the tempId property
    const { tempId, ...entryWithoutTempId } = entry;
    
    if ('id' in entry) {
      // Update existing entry
      const { error } = await supabase
        .from('dating_entries')
        .update({
          person_name: entry.person_name,
          platform: entry.platform,
          num_dates: entry.num_dates,
          total_cost: entry.total_cost,
          avg_duration: entry.avg_duration,
          rating: entry.rating,
          outcome: entry.outcome,
          notes: entry.notes,
          age: entry.age,
          hotness: entry.hotness,
          occupation: entry.occupation,
          relationship_status: entry.relationship_status,
          status: entry.status,
          red_flags: entry.red_flags,
          green_flags: entry.green_flags,
        })
        .eq('id', entry.id);
        
      if (error) throw error;
      return null;
    } else {
      // Insert new entry
      const { data: insertedData, error } = await supabase
        .from('dating_entries')
        .insert({
          user_id: userId,
          person_name: entry.person_name,
          platform: entry.platform,
          num_dates: entry.num_dates,
          total_cost: entry.total_cost,
          avg_duration: entry.avg_duration,
          rating: entry.rating,
          outcome: entry.outcome,
          notes: entry.notes,
          age: entry.age,
          hotness: entry.hotness,
          occupation: entry.occupation,
          relationship_status: entry.relationship_status,
          status: entry.status,
          red_flags: entry.red_flags,
          green_flags: entry.green_flags,
        })
        .select();
        
      if (error) throw error;
      
      return insertedData?.[0] || null;
    }
  } catch (error: any) {
    console.error('Error saving entry:', error);
    throw new Error(error.message || 'Failed to save data');
  }
}

export async function deleteEntry(entryId: string) {
  try {
    const { error } = await supabase
      .from('dating_entries')
      .delete()
      .eq('id', entryId);
      
    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting entry:', error);
    throw new Error(error.message || 'Failed to delete data');
  }
}

export function createNewEntry(userId: string, entryCount: number): NewDatingEntry {
  return {
    user_id: userId,
    person_name: `Date #${entryCount + 1}`,
    platform: 'Tinder',
    num_dates: 1,
    total_cost: 0,
    avg_duration: 0,
    rating: 0,
    outcome: 'Ongoing',
    notes: '',
    age: undefined,
    hotness: undefined,
    occupation: '',
    relationship_status: 'Single',
    status: 'Active',
    red_flags: [],
    green_flags: [],
  };
} 