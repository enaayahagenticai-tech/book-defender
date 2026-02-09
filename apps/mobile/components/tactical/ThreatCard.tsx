import React from 'react';
import { View, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Threat } from '@/lib/store/threats';

export function ThreatCard({ id, domain, riskScore, status }: Threat) {
  const statusColor = status === 'active' ? 'text-destructive' : status === 'pending' ? 'text-warning' : status === 'resolved' ? 'text-success' : 'text-muted-foreground';
  const borderColor = status === 'active' ? 'border-destructive' : status === 'pending' ? 'border-warning' : status === 'resolved' ? 'border-success' : 'border-muted';

  return (
    <View className={twMerge("bg-card border p-4 rounded-lg mb-4", borderColor)}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-card-foreground font-bold text-lg font-mono">{domain}</Text>
        <Text className={twMerge("font-bold text-sm uppercase", statusColor)}>{status}</Text>
      </View>
      <View className="flex-row justify-between">
        <Text className="text-muted-foreground text-xs">ID: {id}</Text>
        <Text className="text-card-foreground text-xs font-mono">RISK: {riskScore}/100</Text>
      </View>
    </View>
  );
}
