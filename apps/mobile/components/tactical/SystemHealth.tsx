import React from 'react';
import { View, Text } from 'react-native';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SystemHealthProps {
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  lastScan: string;
}

export function SystemHealth({ status, uptime, lastScan }: SystemHealthProps) {
  const statusColor = status === 'online' ? 'bg-success' : status === 'offline' ? 'bg-destructive' : 'bg-warning';

  return (
    <View className="bg-card p-4 rounded-lg mb-6 border border-border">
      <View className="flex-row items-center mb-4">
        <View className={twMerge("w-3 h-3 rounded-full mr-2", statusColor)} />
        <Text className="text-foreground font-bold text-lg uppercase tracking-wider">System Status: {status}</Text>
      </View>
      <View className="flex-row justify-between">
        <View>
          <Text className="text-muted-foreground text-xs uppercase mb-1 font-mono">Uptime</Text>
          <Text className="text-foreground font-mono">{uptime}</Text>
        </View>
        <View>
          <Text className="text-muted-foreground text-xs uppercase mb-1 font-mono">Last Scan</Text>
          <Text className="text-foreground font-mono">{lastScan}</Text>
        </View>
      </View>
    </View>
  );
}
