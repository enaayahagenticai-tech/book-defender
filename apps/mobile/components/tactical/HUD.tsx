import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { ThreatCard } from './ThreatCard';
import { SystemHealth } from './SystemHealth';
import { useThreatStore } from '@/lib/store/threats';

export function HUD() {
  const [refreshing, setRefreshing] = React.useState(false);
  const threats = useThreatStore((state) => state.threats);

  // Filter for active and pending threats
  const activeThreats = threats.filter(t => t.status === 'active' || t.status === 'pending');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, this would re-fetch data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-black p-4"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
    >
      <Text className="text-white text-3xl font-bold mb-6 mt-10 font-mono">COMMAND CENTER</Text>

      <SystemHealth status="online" uptime="48h 12m" lastScan="2 mins ago" />

      <Text className="text-gray-400 text-sm uppercase tracking-widest mb-4 font-bold">
        Active Threats ({activeThreats.length})
      </Text>

      {activeThreats.length === 0 ? (
          <Text className="text-gray-600 italic mt-4">No active threats detected.</Text>
      ) : (
          activeThreats.map((threat) => (
            <ThreatCard key={threat.id} {...threat} />
          ))
      )}

      <View className="h-20" />
    </ScrollView>
  );
}
