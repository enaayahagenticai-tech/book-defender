import { supabase } from '../supabase';

export interface Profile {
  id: string;
  expo_push_token?: string | null;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data as Profile;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    return false;
  }

  return true;
}

/**
 * Ensures a profile exists for the user. If not, creates one.
 * This is useful if the trigger on auth.users -> public.profiles fails or doesn't exist.
 */
export async function ensureProfile(userId: string, email?: string): Promise<boolean> {
    const existing = await getProfile(userId);
    if (existing) return true;

    const { error } = await supabase
        .from('profiles')
        .insert([{ id: userId, username: email?.split('@')[0] ?? 'User' }]);

    if (error) {
        console.error('Error creating profile:', error);
        return false;
    }
    return true;
}
