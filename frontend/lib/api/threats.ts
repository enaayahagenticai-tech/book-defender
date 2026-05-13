import { supabase } from '../supabase';
import { Threat } from '../store/threats';

export async function fetchThreats(): Promise<Threat[] | null> {
  const { data, error } = await supabase
    .from('threats')
    .select('*')
    .order('riskScore', { ascending: false });

  if (error) {
    console.error('Error fetching threats:', error);
    return null;
  }

  return data as Threat[];
}

export async function createThreat(threat: Omit<Threat, 'id'>): Promise<Threat | null> {
  const { data, error } = await supabase
    .from('threats')
    .insert([threat])
    .select()
    .single();

  if (error) {
    console.error('Error creating threat:', error);
    return null;
  }

  return data as Threat;
}

export async function updateThreatStatus(id: string, status: Threat['status']): Promise<boolean> {
  const { error } = await supabase
    .from('threats')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating threat status:', error);
    return false;
  }

  return true;
}
