import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { useToastStore } from './toast';

interface AuthState {
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
  initialized: boolean;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initialized: false,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setInitialized: (initialized) => set({ initialized }),
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        useToastStore.getState().showToast({
            type: 'error',
            title: 'Sign Out Error',
            message: error.message
        });
    } else {
        useToastStore.getState().showToast({
            type: 'info',
            title: 'Session Terminated',
            message: 'You have been logged out securely.'
        });
    }
    set({ session: null, user: null });
  },
}));
