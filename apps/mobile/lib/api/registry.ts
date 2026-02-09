import { supabase } from '../supabase';
import { RegistryEntry } from '../store/registry';

export async function fetchRegistryEntries(): Promise<RegistryEntry[] | null> {
  const { data, error } = await supabase
    .from('registry_entries')
    .select('*')
    .order('lastScanned', { ascending: false });

  if (error) {
    console.error('Error fetching registry entries:', error);
    return null;
  }

  return data as RegistryEntry[];
}

export async function createRegistryEntry(entry: Omit<RegistryEntry, 'id'>): Promise<RegistryEntry | null> {
  const { data, error } = await supabase
    .from('registry_entries')
    .insert([entry])
    .select()
    .single();

  if (error) {
    console.error('Error creating registry entry:', error);
    return null;
  }

  return data as RegistryEntry;
}

export async function updateRegistryEntry(id: string, updates: Partial<RegistryEntry>): Promise<boolean> {
  const { error } = await supabase
    .from('registry_entries')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating registry entry:', error);
    return false;
  }

  return true;
}

export async function deleteRegistryEntry(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('registry_entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting registry entry:', error);
    return false;
  }

  return true;
}
