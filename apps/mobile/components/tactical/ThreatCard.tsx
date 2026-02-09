import React from 'react';
import { View, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Threat } from '@/lib/store/threats';

export function ThreatCard({ id, domain, riskScore, status }: Threat) {
  const statusColor = status === 'active' ? 'text-red-500' : status === 'pending' ? 'text-yellow-500' : status === 'resolved' ? 'text-green-500' : 'text-gray-500';
  const borderColor = status === 'active' ? 'border-red-500' : status === 'pending' ? 'border-yellow-500' : status === 'resolved' ? 'border-green-500' : 'border-gray-500';

  return (
    <View className={twMerge("bg-black border p-4 rounded-lg mb-4", borderColor)}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white font-bold text-lg font-mono">{domain}</Text>
        <Text className={twMerge("font-bold text-sm uppercase", statusColor)}>{status}</Text>
      </View>
      <View className="flex-row justify-between">
        <Text className="text-gray-400 text-xs">ID: {id}</Text>
        <Text className="text-white text-xs font-mono">RISK: {riskScore}/100</Text>
      </View>
    </View>
  );
}
