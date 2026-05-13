import { deployScoutAgent, dispatchTakedown, fetchEvidenceForDomain } from './scan';

// Mock supabase
jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

// Mock notifications
jest.mock('../notifications', () => ({
  scheduleDelayedNotification: jest.fn(() => Promise.resolve()),
  TAKEDOWN_CATEGORY: 'TAKEDOWN_CATEGORY',
}));

// Mock threat store
const mockAddThreat = jest.fn(() => Promise.resolve());
jest.mock('../store/threats', () => ({
  useThreatStore: {
    getState: () => ({ addThreat: mockAddThreat }),
  },
}));

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('scan API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('deployScoutAgent', () => {
    it('calls ADK /run endpoint when online', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });
      await deployScoutAgent();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/run'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ task: 'scan_piracy_sites' }),
        }),
      );
      expect(mockAddThreat).not.toHaveBeenCalled();
    });

    it('falls back to local threat insert when ADK is offline', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      await deployScoutAgent();
      expect(mockAddThreat).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'pending', riskScore: 70 }),
      );
    });

    it('falls back when ADK returns non-ok status', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 503 });
      await deployScoutAgent();
      expect(mockAddThreat).toHaveBeenCalled();
    });
  });

  describe('dispatchTakedown', () => {
    it('returns true when ADK accepts the takedown', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });
      const result = await dispatchTakedown('T-001', 'piracy-site.org');
      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/run'),
        expect.objectContaining({
          body: JSON.stringify({ task: 'dispatch_takedown', threat_id: 'T-001', domain: 'piracy-site.org' }),
        }),
      );
    });

    it('returns false when ADK is unreachable', async () => {
      mockFetch.mockRejectedValueOnce(new Error('offline'));
      const result = await dispatchTakedown('T-001', 'piracy-site.org');
      expect(result).toBe(false);
    });
  });

  describe('fetchEvidenceForDomain', () => {
    it('returns null on supabase error', async () => {
      const { supabase } = require('../supabase');
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: null, error: { message: 'not found' } }),
      });
      const result = await fetchEvidenceForDomain('bad-domain.com');
      expect(result).toBeNull();
    });

    it('returns evidence rows on success', async () => {
      const mockRows = [{ id: '1', domain_name: 'piracy.com', hash: 'abc', confidence_percentage: 98 }];
      const { supabase } = require('../supabase');
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockRows, error: null }),
      });
      const result = await fetchEvidenceForDomain('piracy.com');
      expect(result).toEqual(mockRows);
    });
  });
});
