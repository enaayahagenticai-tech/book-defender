import { create } from 'zustand';

interface SecurityState {
  isLocked: boolean;
  lastActive: number | null;
  lockApp: () => void;
  unlockApp: () => void;
  setLastActive: (timestamp: number) => void;
}

export const useSecurityStore = create<SecurityState>((set) => ({
  isLocked: true, // Default to locked on startup
  lastActive: null,
  lockApp: () => set({ isLocked: true }),
  unlockApp: () => set({ isLocked: false }),
  setLastActive: (timestamp) => set({ lastActive: timestamp }),
}));
