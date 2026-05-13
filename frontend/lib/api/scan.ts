import { supabase } from '../supabase';
import { scheduleDelayedNotification, TAKEDOWN_CATEGORY } from '../notifications';
import { useThreatStore } from '../store/threats';

const ADK_URL = process.env.EXPO_PUBLIC_ADK_URL ?? 'http://localhost:8000';

export async function deployScoutAgent(): Promise<void> {
  try {
    // Hit the real ADK agent endpoint
    const response = await fetch(`${ADK_URL}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: 'scan_piracy_sites' }),
    });

    if (!response.ok) throw new Error(`ADK returned ${response.status}`);

    // ADK agent writes threats directly to Supabase — realtime subscription picks them up.
    // Nothing more to do on the client side.
    return;
  } catch {
    // ADK offline or unreachable — fall back to a Supabase-direct insert so the
    // UI still responds. This simulates what the agent would have done.
    const fallbackThreat = {
      domain: `piracy-scan-${Date.now()}.org`,
      riskScore: 70,
      status: 'pending' as const,
    };

    await useThreatStore.getState().addThreat(fallbackThreat);

    await scheduleDelayedNotification(
      'SCOUT AGENT OFFLINE',
      'ADK unreachable — placeholder threat queued for manual review.',
      1,
      { threatId: 'offline' },
      TAKEDOWN_CATEGORY,
    );
  }
}

// Called from resolution screen after takedown is authorized.
// Posts the domain to ADK for DMCA dispatch workflow.
export async function dispatchTakedown(threatId: string, domain: string): Promise<boolean> {
  try {
    const response = await fetch(`${ADK_URL}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: 'dispatch_takedown', threat_id: threatId, domain }),
    });
    return response.ok;
  } catch {
    // ADK offline — takedown queued; status already updated in DB via resolveThreat()
    return false;
  }
}

// Fetch evidence rows from Supabase for a given domain (written by Python agent).
export async function fetchEvidenceForDomain(domain: string) {
  const { data, error } = await supabase
    .from('evidences')
    .select('id, domain_name, hyperlink, evidence_screenshot_url, hash, confidence_percentage, created_at')
    .eq('domain_name', domain)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) return null;
  return data;
}
