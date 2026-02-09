import { useThreatStore } from './threats';

describe('useThreatStore', () => {
  beforeEach(() => {
    useThreatStore.setState({
      threats: [
        { id: 'T-001', domain: 'phish-bank.com', riskScore: 98, status: 'active' },
        { id: 'T-002', domain: 'secure-login-update.net', riskScore: 85, status: 'pending' },
      ],
    });
  });

  it('should resolve a threat', () => {
    const { resolveThreat, threats } = useThreatStore.getState();
    resolveThreat('T-001');
    const updatedThreats = useThreatStore.getState().threats;
    const resolvedThreat = updatedThreats.find((t) => t.id === 'T-001');
    expect(resolvedThreat?.status).toBe('resolved');
  });

  it('should ignore a threat', () => {
    const { ignoreThreat } = useThreatStore.getState();
    ignoreThreat('T-001');
    const updatedThreats = useThreatStore.getState().threats;
    const ignoredThreat = updatedThreats.find((t) => t.id === 'T-001');
    expect(ignoredThreat?.status).toBe('ignored');
  });

  it('should add a threat', () => {
    const { addThreat } = useThreatStore.getState();
    const newThreat = {
      id: 'T-NEW',
      domain: 'new-threat.com',
      riskScore: 90,
      status: 'active' as const,
    };
    addThreat(newThreat);
    const updatedThreats = useThreatStore.getState().threats;
    expect(updatedThreats).toContainEqual(newThreat);
    expect(updatedThreats[0]).toEqual(newThreat); // Assuming added at the beginning
  });

  it('should get active threats', () => {
    const { getActiveThreats } = useThreatStore.getState();
    const activeThreats = getActiveThreats();
    expect(activeThreats).toHaveLength(2); // 'active' and 'pending'
    expect(activeThreats.every(t => t.status === 'active' || t.status === 'pending')).toBe(true);
  });
});
