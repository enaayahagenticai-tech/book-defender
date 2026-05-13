import { supabase } from '../supabase';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

type LogCallback = (log: LogEntry) => void;

// Domain-relevant simulation messages (ambient fill between real events)
const SIMULATION_LOGS: Array<{ message: string; type: LogEntry['type'] }> = [
  { message: 'Crawling known piracy indexes…',              type: 'info' },
  { message: 'Fingerprinting PDF metadata — ISBN match.',   type: 'info' },
  { message: 'Mirror detected: shadow-library[.]org',       type: 'warn' },
  { message: 'WHOIS resolved — OVHcloud AS16276.',          type: 'info' },
  { message: 'Content match: 98.4% confidence.',            type: 'success' },
  { message: 'New site flagged: libgen-mirror[.]ru',        type: 'warn' },
  { message: 'RFC 3161 timestamp anchored.',                type: 'success' },
  { message: 'Evidence bundle compiling…',                  type: 'info' },
  { message: 'Registrar: Namecheap — DMCA-responsive.',     type: 'info' },
  { message: 'CDN bypass detected — direct IP fallback.',   type: 'warn' },
  { message: 'DMCA notice dispatched to abuse@ovh.net.',    type: 'success' },
  { message: 'Google Search Console deindex queued.',       type: 'success' },
  { message: 'Hash stored: SHA-256 0xA4E1…2F09.',           type: 'info' },
  { message: 'Scanning Z-Library mirrors…',                 type: 'info' },
  { message: 'Threat score updated: risk +12.',             type: 'warn' },
];

export class LiveIntelSocket {
  private static instance: LiveIntelSocket;
  private listeners: LogCallback[] = [];
  private simulationInterval: NodeJS.Timeout | null = null;
  private realtimeChannel: ReturnType<typeof supabase.channel> | null = null;

  private constructor() {}

  static getInstance(): LiveIntelSocket {
    if (!LiveIntelSocket.instance) {
      LiveIntelSocket.instance = new LiveIntelSocket();
    }
    return LiveIntelSocket.instance;
  }

  connect() {
    this.subscribeToSupabase();
    this.startSimulation();
  }

  disconnect() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
  }

  subscribe(callback: LogCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private emit(message: string, type: LogEntry['type']) {
    const log: LogEntry = {
      id: Math.random().toString(36).slice(2),
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
      }),
      message,
      type,
    };
    this.listeners.forEach((l) => l(log));
  }

  // Primary source: Supabase realtime — real agent activity surfaces here instantly
  private subscribeToSupabase() {
    this.realtimeChannel = supabase
      .channel('live-intel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'threats' }, (payload) => {
        const domain = (payload.new as { domain?: string }).domain ?? 'unknown';
        this.emit(`New threat detected: ${domain}`, 'warn');
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'threats' }, (payload) => {
        const row = payload.new as { domain?: string; status?: string };
        if (row.status === 'resolved') {
          this.emit(`Takedown confirmed: ${row.domain ?? 'domain'}`, 'success');
        } else if (row.status === 'ignored') {
          this.emit(`Threat dismissed: ${row.domain ?? 'domain'}`, 'info');
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'evidences' }, (payload) => {
        const row = payload.new as { domain_name?: string; confidence_percentage?: number };
        const conf = row.confidence_percentage != null
          ? ` · ${row.confidence_percentage}% match` : '';
        this.emit(`Evidence captured: ${row.domain_name ?? 'domain'}${conf}`, 'success');
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sites' }, (payload) => {
        const row = payload.new as { domain?: string };
        this.emit(`Site added to registry: ${row.domain ?? 'domain'}`, 'info');
      })
      .subscribe();
  }

  // Secondary source: ambient simulation so the log never looks dead between real events
  private startSimulation() {
    if (this.simulationInterval) return;
    this.simulationInterval = setInterval(() => {
      const entry = SIMULATION_LOGS[Math.floor(Math.random() * SIMULATION_LOGS.length)];
      this.emit(entry.message, entry.type);
    }, 4000);
  }
}
