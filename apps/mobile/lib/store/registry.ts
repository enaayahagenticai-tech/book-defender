import { create } from 'zustand';

export interface RegistryEntry {
  id: string;
  domain: string;
  status: 'active' | 'monitored' | 'inactive';
  riskScore: number;
  lastScanned: string;
  tags: string[];
}

interface RegistryState {
  entries: RegistryEntry[];
  setEntries: (entries: RegistryEntry[]) => void;
  addEntry: (entry: RegistryEntry) => void;
  removeEntry: (id: string) => void;
  updateEntry: (id: string, updates: Partial<RegistryEntry>) => void;
  getEntry: (id: string) => RegistryEntry | undefined;
}

export const useRegistryStore = create<RegistryState>((set, get) => ({
  entries: [
    { id: 'R-001', domain: 'malware-distribution.net', status: 'active', riskScore: 95, lastScanned: '2023-10-27T10:00:00Z', tags: ['malware', 'phishing'] },
    { id: 'R-002', domain: 'suspicious-activity.com', status: 'monitored', riskScore: 60, lastScanned: '2023-10-26T14:30:00Z', tags: ['botnet'] },
    { id: 'R-003', domain: 'verified-safe.org', status: 'inactive', riskScore: 10, lastScanned: '2023-10-25T09:15:00Z', tags: ['whitelisted'] },
    { id: 'R-004', domain: 'dark-market.onion', status: 'active', riskScore: 99, lastScanned: '2023-10-27T11:45:00Z', tags: ['darkweb', 'crypto'] },
    { id: 'R-005', domain: 'legit-service.io', status: 'monitored', riskScore: 40, lastScanned: '2023-10-24T16:20:00Z', tags: ['cloud'] },
  ],
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
  removeEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    })),
  updateEntry: (id, updates) =>
    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),
  getEntry: (id) => get().entries.find((e) => e.id === id),
}));
