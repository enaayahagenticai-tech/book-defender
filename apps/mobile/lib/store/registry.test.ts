import { act } from 'react-test-renderer';
import { useRegistryStore, RegistryEntry } from './registry';

describe('useRegistryStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useRegistryStore.setState({
      entries: [
        { id: 'R-001', domain: 'malware-distribution.net', status: 'active', riskScore: 95, lastScanned: '2023-10-27T10:00:00Z', tags: ['malware', 'phishing'] },
      ],
    });
  });

  it('should add a new entry', () => {
    const newEntry: RegistryEntry = {
      id: 'R-NEW',
      domain: 'new-threat.com',
      status: 'active',
      riskScore: 80,
      lastScanned: '2023-10-28T09:00:00Z',
      tags: ['new'],
    };

    act(() => {
      useRegistryStore.getState().addEntry(newEntry);
    });

    const entries = useRegistryStore.getState().entries;
    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual(newEntry);
  });

  it('should remove an entry', () => {
    act(() => {
      useRegistryStore.getState().removeEntry('R-001');
    });

    const entries = useRegistryStore.getState().entries;
    expect(entries).toHaveLength(0);
  });

  it('should update an entry', () => {
    act(() => {
      useRegistryStore.getState().updateEntry('R-001', { status: 'inactive' });
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
