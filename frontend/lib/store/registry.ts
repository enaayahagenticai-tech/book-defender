import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchRegistryEntries, createRegistryEntry, updateRegistryEntry, deleteRegistryEntry } from '../api/registry';
import { useToastStore } from './toast';

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
  loading: boolean;
  error: string | null;
  setEntries: (entries: RegistryEntry[]) => void;
  addEntry: (entry: Omit<RegistryEntry, 'id'>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  updateEntry: (id: string, updates: Partial<RegistryEntry>) => Promise<void>;
  getEntry: (id: string) => RegistryEntry | undefined;
  fetchEntries: () => Promise<void>;
}

export const useRegistryStore = create<RegistryState>()(
  persist(
    (set, get) => ({
      entries: [
        // Initial Mock Data (Fallback)
        { id: 'R-001', domain: 'malware-distribution.net', status: 'active', riskScore: 95, lastScanned: '2023-10-27T10:00:00Z', tags: ['malware', 'phishing'] },
        { id: 'R-002', domain: 'suspicious-activity.com', status: 'monitored', riskScore: 60, lastScanned: '2023-10-26T14:30:00Z', tags: ['botnet'] },
        { id: 'R-003', domain: 'verified-safe.org', status: 'inactive', riskScore: 10, lastScanned: '2023-10-25T09:15:00Z', tags: ['whitelisted'] },
        { id: 'R-004', domain: 'dark-market.onion', status: 'active', riskScore: 99, lastScanned: '2023-10-27T11:45:00Z', tags: ['darkweb', 'crypto'] },
        { id: 'R-005', domain: 'legit-service.io', status: 'monitored', riskScore: 40, lastScanned: '2023-10-24T16:20:00Z', tags: ['cloud'] },
      ],
      loading: false,
      error: null,
      setEntries: (entries) => set({ entries }),
      addEntry: async (entryData) => {
        // Optimistic Update
        const tempId = `temp-${Date.now()}`;
        const newEntry: RegistryEntry = { ...entryData, id: tempId };
        set((state) => ({ entries: [newEntry, ...state.entries] }));

        const savedEntry = await createRegistryEntry(entryData);
        if (savedEntry) {
            set((state) => ({
                entries: state.entries.map(e => e.id === tempId ? savedEntry : e)
            }));
            useToastStore.getState().showToast({
                type: 'success',
                title: 'Entry Added',
                message: `${entryData.domain} added to registry.`
            });
        } else {
            set((state) => ({
                entries: state.entries.filter(e => e.id !== tempId),
                error: 'Failed to add registry entry'
            }));
            useToastStore.getState().showToast({
                type: 'error',
                title: 'Operation Failed',
                message: 'Failed to add registry entry.'
            });
        }
      },
      removeEntry: async (id) => {
        // Optimistic Update
        const previousEntries = get().entries;
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        }));

        const success = await deleteRegistryEntry(id);
        if (!success) {
            set({ entries: previousEntries, error: 'Failed to delete registry entry' });
            useToastStore.getState().showToast({
                type: 'error',
                title: 'Operation Failed',
                message: 'Failed to delete registry entry.'
            });
        } else {
            useToastStore.getState().showToast({
                type: 'success',
                title: 'Entry Removed',
                message: 'Registry entry removed successfully.'
            });
        }
      },
      updateEntry: async (id, updates) => {
        // Optimistic Update
        const previousEntries = get().entries;
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        }));

        const success = await updateRegistryEntry(id, updates);
        if (!success) {
            set({ entries: previousEntries, error: 'Failed to update registry entry' });
            useToastStore.getState().showToast({
                type: 'error',
                title: 'Operation Failed',
                message: 'Failed to update registry entry.'
            });
        } else {
            useToastStore.getState().showToast({
                type: 'success',
                title: 'Entry Updated',
                message: 'Registry entry updated successfully.'
            });
        }
      },
      getEntry: (id) => get().entries.find((e) => e.id === id),
      fetchEntries: async () => {
          set({ loading: true, error: null });
          const data = await fetchRegistryEntries();
          if (data) {
              set({ entries: data, loading: false });
          } else {
              set({ loading: false, error: 'Failed to fetch registry entries' });
              useToastStore.getState().showToast({
                type: 'error',
                title: 'Connection Error',
                message: 'Failed to fetch registry entries. Showing offline cache.'
              });
          }
      }
    }),
    {
      name: 'registry-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ entries: state.entries }),
    }
  )
);
