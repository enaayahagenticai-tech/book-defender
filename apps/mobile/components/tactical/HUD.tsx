import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThreatCard } from './ThreatCard';
import { SystemHealth } from './SystemHealth';
import { LiveLogs } from './LiveLogs';
import { useThreatStore } from '@/lib/store/threats';
import { useColorScheme } from '@/components/useColorScheme';
import { deployScoutAgent } from '@/lib/api/scan';

export function HUD() {
  const [refreshing, setRefreshing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState("2 mins ago");
  const threats = useThreatStore((state) => state.threats);
  const refreshThreats = useThreatStore((state) => state.refreshThreats);
  const loading = useThreatStore((state) => state.loading);
  const isMounted = useRef(true);
  const colorScheme = useColorScheme();

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

    try {
        await deployScoutAgent();
        if (isMounted.current) {
            setLastScanTime("Just now");
        }
    } catch (e) {
        console.error("Scan failed", e);
    } finally {
        if (isMounted.current) {
            setIsScanning(false);
        }
    }
  };

  const spinnerColor = colorScheme === 'dark' ? '#fff' : '#000';

  return (
    <ScrollView
      className="flex-1 bg-background p-4"
      refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor={colorScheme === 'dark' ? '#fff' : '#000'} />}
    >
      <Text className="text-foreground text-3xl font-bold mb-6 mt-10 font-mono">COMMAND CENTER</Text>

      <SystemHealth status="online" uptime="48h 12m" lastScan={lastScanTime} />

      <LiveLogs />

      <TouchableOpacity
        className={`w-full py-4 mb-8 rounded border ${isScanning ? 'bg-secondary border-border' : 'bg-primary border-primary'} items-center justify-center`}
        onPress={handleScan}
        disabled={isScanning}
      >
        {isScanning ? (
            <View className="flex-row items-center gap-2">
                <ActivityIndicator color={spinnerColor} />
                <Text className="text-secondary-foreground font-mono font-bold">SCANNING SECTOR...</Text>
            </View>
        ) : (
            <Text className="text-primary-foreground font-mono font-bold tracking-widest">DEPLOY SCOUT AGENT</Text>
        )}
      </TouchableOpacity>

      <Text className="text-muted-foreground text-sm uppercase tracking-widest mb-4 font-bold">
        Active Threats ({activeThreats.length})
      </Text>

      {activeThreats.length === 0 ? (
          <Text className="text-muted-foreground italic mt-4">No active threats detected.</Text>
      ) : (
          activeThreats.map((threat) => (
            <ThreatCard key={threat.id} {...threat} />
          ))
      )}

      <View className="h-20" />
    </ScrollView>
  );
}
