import { create } from 'zustand';
import { fetchThreats, updateThreatStatus, createThreat } from '../api/threats';
import { useToastStore } from './toast';

export interface Threat {
  id: string;
  domain: string;
  riskScore: number;
  status: 'active' | 'pending' | 'resolved' | 'ignored';
}

interface ThreatState {
  threats: Threat[];
  loading: boolean;
  error: string | null;
  setThreats: (threats: Threat[]) => void;
  addThreat: (threat: Omit<Threat, 'id'>) => Promise<void>;
  resolveThreat: (id: string) => Promise<void>;
  ignoreThreat: (id: string) => Promise<void>;
  getActiveThreats: () => Threat[];
  refreshThreats: () => Promise<void>;
}

export const useThreatStore = create<ThreatState>((set, get) => ({
  threats: [
     // Initial Mock Data (Fallback)
     { id: 'T-001', domain: 'phish-bank.com', riskScore: 98, status: 'active' },
     { id: 'T-002', domain: 'secure-login-update.net', riskScore: 85, status: 'pending' },
     { id: 'T-003', domain: 'update-your-account.org', riskScore: 45, status: 'resolved' },
     { id: 'T-004', domain: 'malicious-server.xyz', riskScore: 92, status: 'active' },
     { id: 'T-005', domain: 'fake-promo.biz', riskScore: 78, status: 'pending' },
     { id: 'T-006', domain: 'urgent-verify-id.net', riskScore: 88, status: 'active' },
     { id: 'T-007', domain: 'free-gift-card.com', riskScore: 65, status: 'pending' },
  ],
  loading: false,
  error: null,
  setThreats: (threats) => set({ threats }),
  addThreat: async (threatData) => {
    // Optimistic Update (Generate temp ID)
    const tempId = `temp-${Date.now()}`;
    const newThreat: Threat = { ...threatData, id: tempId, status: 'active' }; // Default status

    set((state) => ({ threats: [newThreat, ...state.threats] }));

    const savedThreat = await createThreat(threatData);
    if (savedThreat) {
        // Replace temp threat with saved one
        set((state) => ({
            threats: state.threats.map(t => t.id === tempId ? savedThreat : t)
        }));
        useToastStore.getState().showToast({
            type: 'success',
            title: 'Threat Added',
            message: `${threatData.domain} added to watchlist.`
        });
    } else {
        // Rollback on error
        set((state) => ({
            threats: state.threats.filter(t => t.id !== tempId),
            error: 'Failed to add threat'
        }));
        useToastStore.getState().showToast({
            type: 'error',
            title: 'Operation Failed',
            message: 'Failed to add threat.'
        });
    }
  },
  resolveThreat: async (id) => {
    // Optimistic Update
    const previousThreats = get().threats;
    set((state) => ({
      threats: state.threats.map((t) =>
        t.id === id ? { ...t, status: 'resolved' } : t
      ),
    }));

    const success = await updateThreatStatus(id, 'resolved');
    if (!success) {
        // Rollback
        set({ threats: previousThreats, error: 'Failed to resolve threat' });
        useToastStore.getState().showToast({
            type: 'error',
            title: 'Operation Failed',
            message: 'Failed to resolve threat.'
        });
    } else {
        useToastStore.getState().showToast({
            type: 'success',
            title: 'Threat Resolved',
            message: 'Threat neutralized.'
        });
    }
  },
  ignoreThreat: async (id) => {
    // Optimistic Update
    const previousThreats = get().threats;
    set((state) => ({
      threats: state.threats.map((t) =>
        t.id === id ? { ...t, status: 'ignored' } : t
      ),
    }));

    const success = await updateThreatStatus(id, 'ignored');
    if (!success) {
        // Rollback
        set({ threats: previousThreats, error: 'Failed to ignore threat' });
        useToastStore.getState().showToast({
            type: 'error',
            title: 'Operation Failed',
            message: 'Failed to ignore threat.'
        });
    } else {
        useToastStore.getState().showToast({
            type: 'info',
            title: 'Threat Ignored',
            message: 'Threat marked as false positive.'
        });
    }
  },
  getActiveThreats: () => {
      const { threats } = get();
      return threats.filter(t => t.status === 'active' || t.status === 'pending');
  },
  refreshThreats: async () => {
      set({ loading: true, error: null });
      const data = await fetchThreats();
      if (data) {
          set({ threats: data, loading: false });
      } else {
          set({ loading: false, error: 'Failed to fetch threats' });
          useToastStore.getState().showToast({
            type: 'error',
            title: 'Connection Error',
            message: 'Failed to fetch threats. Showing offline cache.'
          });
      }
  }
}));
