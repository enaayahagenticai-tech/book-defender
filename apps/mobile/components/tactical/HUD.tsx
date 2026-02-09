import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThreatCard } from './ThreatCard';
import { SystemHealth } from './SystemHealth';
import { LiveLogs } from './LiveLogs';
import { useThreatStore } from '@/lib/store/threats';
import { scheduleDelayedNotification, TAKEDOWN_CATEGORY } from '@/lib/notifications';

export function HUD() {
  const [refreshing, setRefreshing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState("2 mins ago");
  const threats = useThreatStore((state) => state.threats);
  const addThreat = useThreatStore((state) => state.addThreat);
  const refreshThreats = useThreatStore((state) => state.refreshThreats);
  const loading = useThreatStore((state) => state.loading);
  const isMounted = useRef(true);

  useEffect(() => {
    refreshThreats();
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Filter for active and pending threats
  const activeThreats = threats.filter(t => t.status === 'active' || t.status === 'pending');

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshThreats();
    if (isMounted.current) {
        setRefreshing(false);
    }
  }, [refreshThreats]);

  const handleScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    // Simulate scan logic combined with API
    // Ideally this would trigger a backend job, but for now we simulate locally and add to DB
    setTimeout(async () => {
        if (!isMounted.current) return;
        setIsScanning(false);
        setLastScanTime("Just now");

        const newThreat = {
            domain: `suspicious-vector-${Math.floor(Math.random() * 1000)}.org`,
            riskScore: 95,
            status: 'active' as const
        };

        await addThreat(newThreat);

        // We don't have the ID immediately if addThreat is optimistic but generating temp ID.
        // But the store updates immediately.
        // We need the ID for notification payload.
        // Since addThreat is async and returns void, we can't easily get the ID unless we change store signature.
        // However, we can use a generated ID or just omit it for now if not critical.
        // Or we can query the latest threat.

        // For simulation, let's just trigger notification.
        await scheduleDelayedNotification(
            "THREAT DETECTED",
            `Suspicious activity detected on vector: ${newThreat.domain}`,
            1,
            { threatId: 'check-app' }, // Placeholder ID as we don't have the real one easily without refactoring
            TAKEDOWN_CATEGORY
        );
    }, 3000);
  };

  return (
    <ScrollView
      className="flex-1 bg-black p-4"
      refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor="#fff" />}
    >
      <Text className="text-white text-3xl font-bold mb-6 mt-10 font-mono">COMMAND CENTER</Text>

      <SystemHealth status="online" uptime="48h 12m" lastScan={lastScanTime} />

      <LiveLogs />

      <TouchableOpacity
        className={`w-full py-4 mb-8 rounded border ${isScanning ? 'bg-gray-800 border-gray-700' : 'bg-white border-white'} items-center justify-center`}
        onPress={handleScan}
        disabled={isScanning}
      >
        {isScanning ? (
            <View className="flex-row items-center gap-2">
                <ActivityIndicator color="#fff" />
                <Text className="text-white font-mono font-bold">SCANNING SECTOR...</Text>
            </View>
        ) : (
            <Text className="text-black font-mono font-bold tracking-widest">DEPLOY SCOUT AGENT</Text>
        )}
      </TouchableOpacity>

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
