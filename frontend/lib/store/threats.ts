import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchThreats, updateThreatStatus, createThreat } from '../api/threats';
import { useToastStore } from './toast';
import { supabase } from '../supabase';

export interface Threat {
  id: string;
  domain: string;
  riskScore: number;
  status: 'active' | 'pending' | 'resolved' | 'ignored';
  // Extended fields populated by ADK agent
  host?: string;
  registrar?: string;
  firstSeen?: string;
  mirrorCount?: number;
  threatType?: string;
  analysisText?: string;
  tags?: string[];
  fingerprint?: string;
  matchPercentage?: number;
  bookTitle?: string;
  bookAuthor?: string;
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
  subscribeRealtime: () => () => void;
}

export const useThreatStore = create<ThreatState>()(
  persist(
    (set, get) => ({
      threats: [],
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
      subscribeRealtime: () => {
        const channel = supabase
          .channel('threats-realtime')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'threats' }, (payload) => {
            const t = payload.new as Threat;
            set((state) => ({ threats: [t, ...state.threats.filter(x => x.id !== t.id)] }));
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'threats' }, (payload) => {
            const t = payload.new as Threat;
            set((state) => ({ threats: state.threats.map(x => x.id === t.id ? t : x) }));
          })
          .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'threats' }, (payload) => {
            const id = payload.old.id as string;
            set((state) => ({ threats: state.threats.filter(x => x.id !== id) }));
          })
          .subscribe();
        return () => { supabase.removeChannel(channel); };
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
    }),
    {
      name: 'threat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ threats: state.threats }),
    }
  )
);
