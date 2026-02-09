import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThreatCard } from './ThreatCard';
import { SystemHealth } from './SystemHealth';
import { useThreatStore } from '@/lib/store/threats';
import { scheduleDelayedNotification } from '@/lib/notifications';

export function HUD() {
  const [refreshing, setRefreshing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState("2 mins ago");
  const threats = useThreatStore((state) => state.threats);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Filter for active and pending threats
  const activeThreats = threats.filter(t => t.status === 'active' || t.status === 'pending');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, this would re-fetch data
    setTimeout(() => {
      if (isMounted.current) {
        setRefreshing(false);
      }
    }, 2000);
  }, []);

  const handleScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    // Simulate scan
    setTimeout(async () => {
        if (!isMounted.current) return;
        setIsScanning(false);
        setLastScanTime("Just now");
        await scheduleDelayedNotification(
            "THREAT DETECTED",
            "Suspicious activity detected on vector: 192.168.1.105",
            1
        );
    }, 3000);
  };

  return (
    <ScrollView
      className="flex-1 bg-black p-4"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
    >
      <Text className="text-white text-3xl font-bold mb-6 mt-10 font-mono">COMMAND CENTER</Text>

      <SystemHealth status="online" uptime="48h 12m" lastScan={lastScanTime} />

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
