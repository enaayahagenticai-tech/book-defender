import { create } from 'zustand';

export interface Threat {
  id: string;
  domain: string;
  riskScore: number;
  status: 'active' | 'pending' | 'resolved' | 'ignored';
}

interface ThreatState {
  threats: Threat[];
  setThreats: (threats: Threat[]) => void;
  addThreat: (threat: Threat) => void;
  resolveThreat: (id: string) => void;
  ignoreThreat: (id: string) => void;
  getActiveThreats: () => Threat[];
}

export const useThreatStore = create<ThreatState>((set, get) => ({
  threats: [
     { id: 'T-001', domain: 'phish-bank.com', riskScore: 98, status: 'active' },
     { id: 'T-002', domain: 'secure-login-update.net', riskScore: 85, status: 'pending' },
     { id: 'T-003', domain: 'update-your-account.org', riskScore: 45, status: 'resolved' },
     { id: 'T-004', domain: 'malicious-server.xyz', riskScore: 92, status: 'active' },
     { id: 'T-005', domain: 'fake-promo.biz', riskScore: 78, status: 'pending' },
     { id: 'T-006', domain: 'urgent-verify-id.net', riskScore: 88, status: 'active' },
     { id: 'T-007', domain: 'free-gift-card.com', riskScore: 65, status: 'pending' },
  ],
  setThreats: (threats) => set({ threats }),
  addThreat: (threat) => set((state) => ({ threats: [threat, ...state.threats] })),
  resolveThreat: (id) =>
    set((state) => ({
      threats: state.threats.map((t) =>
        t.id === id ? { ...t, status: 'resolved' } : t
      ),
    })),
  ignoreThreat: (id) =>
    set((state) => ({
      threats: state.threats.map((t) =>
        t.id === id ? { ...t, status: 'ignored' } : t
      ),
    })),
  getActiveThreats: () => {
      const { threats } = get();
      return threats.filter(t => t.status === 'active' || t.status === 'pending');
  }
}));
