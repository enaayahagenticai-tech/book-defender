import { useThreatStore } from './threats';
import { act } from 'react-test-renderer';

// Mock API
jest.mock('../api/threats', () => ({
  createThreat: jest.fn((threat) => Promise.resolve({ ...threat, id: 'mock-id-from-api' })),
  updateThreatStatus: jest.fn(() => Promise.resolve(true)),
  fetchThreats: jest.fn(() => Promise.resolve([])),
}));

describe('useThreatStore', () => {
  beforeEach(() => {
    useThreatStore.setState({
      threats: [
        { id: 'T-001', domain: 'phish-bank.com', riskScore: 98, status: 'active' },
        { id: 'T-002', domain: 'secure-login-update.net', riskScore: 85, status: 'pending' },
      ],
      error: null,
      loading: false,
    });
  });

  it('should resolve a threat optimistically', async () => {
    const { resolveThreat } = useThreatStore.getState();
    await resolveThreat('T-001');
    const updatedThreats = useThreatStore.getState().threats;
    const resolvedThreat = updatedThreats.find((t) => t.id === 'T-001');
    expect(resolvedThreat?.status).toBe('resolved');
  });

  it('should ignore a threat optimistically', async () => {
    const { ignoreThreat } = useThreatStore.getState();
    await ignoreThreat('T-001');
    const updatedThreats = useThreatStore.getState().threats;
    const ignoredThreat = updatedThreats.find((t) => t.id === 'T-001');
    expect(ignoredThreat?.status).toBe('ignored');
  });

  it('should add a threat and update ID from API', async () => {
    const { addThreat } = useThreatStore.getState();
    const newThreatData = {
      domain: 'new-threat.com',
      riskScore: 90,
      status: 'active' as const,
    };

    await addThreat(newThreatData);

    const updatedThreats = useThreatStore.getState().threats;
    expect(updatedThreats[0].domain).toEqual(newThreatData.domain);
    expect(updatedThreats[0].id).toBe('mock-id-from-api');
  });

  it('should get active threats', () => {
    const { getActiveThreats } = useThreatStore.getState();
    const activeThreats = getActiveThreats();
    expect(activeThreats).toHaveLength(2); // 'active' and 'pending'
    expect(activeThreats.every(t => t.status === 'active' || t.status === 'pending')).toBe(true);
  });
});
