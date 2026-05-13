import { supabase } from '../supabase';
import type { RegistryEntry } from '../store/registry';

// Maps a `sites` row to the RegistryEntry shape the store/UI expects.
function mapSiteToEntry(row: Record<string, unknown>): RegistryEntry {
  const status =
    row.status === 'active' ? 'active' :
    row.status === 'inactive' ? 'inactive' :
    'monitored';

  return {
    id: String(row.domain),           // sites PK is domain text
    domain: String(row.domain),
    status,
    riskScore: Number(row.risk_score ?? 0),
    lastScanned: row.last_scanned ? String(row.last_scanned) : new Date().toISOString(),
    tags: (row.enforcement_status ? [String(row.enforcement_status)] : []),
  };
}

export async function fetchRegistryEntries(): Promise<RegistryEntry[] | null> {
  const { data, error } = await supabase
    .from('sites')
    .select('domain, risk_score, status, enforcement_status, discovery_date, last_scanned')
    .order('last_scanned', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching sites:', error);
    return null;
  }

  return (data as Record<string, unknown>[]).map(mapSiteToEntry);
}

export async function createRegistryEntry(
  entry: Omit<RegistryEntry, 'id'>,
): Promise<RegistryEntry | null> {
  const { data, error } = await supabase
    .from('sites')
    .insert([{
      domain: entry.domain,
      risk_score: entry.riskScore,
      status: entry.status === 'monitored' ? 'active' : entry.status,
      enforcement_status: entry.tags[0] ?? null,
      last_scanned: entry.lastScanned,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating site:', error);
    return null;
  }

  return mapSiteToEntry(data as Record<string, unknown>);
}

export async function updateRegistryEntry(
  id: string,
  updates: Partial<RegistryEntry>,
): Promise<boolean> {
  const patch: Record<string, unknown> = {};
  if (updates.riskScore !== undefined) patch.risk_score = updates.riskScore;
  if (updates.status !== undefined) patch.status = updates.status === 'monitored' ? 'active' : updates.status;
  if (updates.lastScanned !== undefined) patch.last_scanned = updates.lastScanned;
  if (updates.tags !== undefined) patch.enforcement_status = updates.tags[0] ?? null;

  const { error } = await supabase
    .from('sites')
    .update(patch)
    .eq('domain', id);  // id is the domain text (PK)

  if (error) {
    console.error('Error updating site:', error);
    return false;
  }

  return true;
}

export async function deleteRegistryEntry(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('domain', id);

  if (error) {
    console.error('Error deleting site:', error);
    return false;
  }

  return true;
}
