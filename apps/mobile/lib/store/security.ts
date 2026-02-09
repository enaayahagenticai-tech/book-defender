import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SecurityState {
  isLocked: boolean;
  lastActive: number | null;
  biometricsEnabled: boolean;
  lockApp: () => void;
  unlockApp: () => void;
  setLastActive: (timestamp: number) => void;
  setBiometricsEnabled: (enabled: boolean) => void;
}

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set) => ({
      isLocked: true, // Default to locked on startup
      lastActive: null,
      biometricsEnabled: true, // Default enabled
      lockApp: () => set({ isLocked: true }),
      unlockApp: () => set({ isLocked: false }),
      setLastActive: (timestamp) => set({ lastActive: timestamp }),
      setBiometricsEnabled: (enabled) => set({ biometricsEnabled: enabled }),
    }),
    {
      name: 'security-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ biometricsEnabled: state.biometricsEnabled }),
    }
  )
);
