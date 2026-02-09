import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { ThreatCard } from './ThreatCard';
import { SystemHealth } from './SystemHealth';

export function HUD() {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Mock data
  const threats = [
    { id: 'T-001', domain: 'phish-bank.com', riskScore: 98, status: 'active' as const },
    { id: 'T-002', domain: 'secure-login-update.net', riskScore: 85, status: 'pending' as const },
    { id: 'T-003', domain: 'update-your-account.org', riskScore: 45, status: 'resolved' as const },
  ];

  return (
    <ScrollView
      className="flex-1 bg-black p-4"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
    >
      <Text className="text-white text-3xl font-bold mb-6 mt-10 font-mono">COMMAND CENTER</Text>

      <SystemHealth status="online" uptime="48h 12m" lastScan="2 mins ago" />

      <Text className="text-gray-400 text-sm uppercase tracking-widest mb-4 font-bold">Active Threats</Text>

      {threats.map((threat) => (
        <ThreatCard key={threat.id} {...threat} />
      ))}

      <View className="h-20" />
    </ScrollView>
  );
}
