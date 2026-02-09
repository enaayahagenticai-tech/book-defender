import React from 'react';
import { View, Text } from 'react-native';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ThreatCardProps {
  id: string;
  domain: string;
  riskScore: number;
  status: 'active' | 'pending' | 'resolved';
}

export function ThreatCard({ id, domain, riskScore, status }: ThreatCardProps) {
  const statusColor = status === 'active' ? 'text-red-500' : status === 'pending' ? 'text-yellow-500' : 'text-green-500';
  const borderColor = status === 'active' ? 'border-red-500' : status === 'pending' ? 'border-yellow-500' : 'border-green-500';

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
