import { act } from 'react-test-renderer';
import { useRegistryStore, RegistryEntry } from './registry';

// Mock API calls
jest.mock('../api/registry', () => ({
  createRegistryEntry: jest.fn((entry) => Promise.resolve({ ...entry, id: 'mock-id-from-api' })),
  updateRegistryEntry: jest.fn(() => Promise.resolve(true)),
  deleteRegistryEntry: jest.fn(() => Promise.resolve(true)),
  fetchRegistryEntries: jest.fn(() => Promise.resolve([])),
}));

describe('useRegistryStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useRegistryStore.setState({
      entries: [
        { id: 'R-001', domain: 'malware-distribution.net', status: 'active', riskScore: 95, lastScanned: '2023-10-27T10:00:00Z', tags: ['malware', 'phishing'] },
      ],
      error: null,
      loading: false,
    });
  });

  it('should add a new entry optimistically', async () => {
    const newEntryData = {
      domain: 'new-threat.com',
      status: 'active' as const,
      riskScore: 80,
      lastScanned: '2023-10-28T09:00:00Z',
      tags: ['new'],
    };

    await act(async () => {
      await useRegistryStore.getState().addEntry(newEntryData);
    });

    const entries = useRegistryStore.getState().entries;
    expect(entries).toHaveLength(2);
    expect(entries[0].domain).toEqual(newEntryData.domain);
    // The ID will be updated by the API mock
    expect(entries[0].id).toEqual('mock-id-from-api');
  });

  it('should remove an entry optimistically', async () => {
    await act(async () => {
      await useRegistryStore.getState().removeEntry('R-001');
    });

    const entries = useRegistryStore.getState().entries;
    expect(entries).toHaveLength(0);
  });

  it('should update an entry optimistically', async () => {
    await act(async () => {
      await useRegistryStore.getState().updateEntry('R-001', { status: 'inactive' });
    });

    const entry = useRegistryStore.getState().getEntry('R-001');
    expect(entry?.status).toBe('inactive');
  });

  it('should get an entry by id', () => {
    const entry = useRegistryStore.getState().getEntry('R-001');
    expect(entry).toBeDefined();
    expect(entry?.id).toBe('R-001');
  });
});
