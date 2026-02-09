import { useSecurityStore } from './security';

describe('useSecurityStore', () => {
  beforeEach(() => {
    // Reset store state
    useSecurityStore.setState({ isLocked: true, lastActive: null });
  });

  it('should initialize with locked state', () => {
    const state = useSecurityStore.getState();
    expect(state.isLocked).toBe(true);
    expect(state.lastActive).toBeNull();
  });

  it('should unlock the app', () => {
    useSecurityStore.getState().unlockApp();
    const state = useSecurityStore.getState();
    expect(state.isLocked).toBe(false);
  });

  it('should lock the app', () => {
    useSecurityStore.getState().unlockApp();
    useSecurityStore.getState().lockApp();
    const state = useSecurityStore.getState();
    expect(state.isLocked).toBe(true);
  });

  it('should set last active timestamp', () => {
    const timestamp = 1234567890;
    useSecurityStore.getState().setLastActive(timestamp);
    const state = useSecurityStore.getState();
    expect(state.lastActive).toBe(timestamp);
  });
});
