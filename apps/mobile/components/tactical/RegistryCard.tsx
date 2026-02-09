import React from 'react';
import { View, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { RegistryEntry } from '@/lib/store/registry';

export function RegistryCard({ id, domain, status, riskScore, tags }: RegistryEntry) {
  const statusColor =
    status === 'active' ? 'text-red-500' :
    status === 'monitored' ? 'text-blue-500' :
    'text-gray-500';

  const borderColor =
    status === 'active' ? 'border-red-500' :
    status === 'monitored' ? 'border-blue-500' :
    'border-gray-500';

  return (
    <View className={twMerge("bg-black border p-4 rounded-lg mb-4", borderColor)}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white font-bold text-lg font-mono flex-1 mr-2" numberOfLines={1}>{domain}</Text>
        <Text className={twMerge("font-bold text-sm uppercase", statusColor)}>{status}</Text>
      </View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-400 text-xs font-mono">ID: {id}</Text>
        <Text className="text-white text-xs font-mono">RISK: {riskScore}/100</Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
          {tags.map(tag => (
              <View key={tag} className="bg-gray-800 px-2 py-1 rounded">
                  <Text className="text-gray-300 text-[10px] uppercase font-mono">{tag}</Text>
              </View>
          ))}
      </View>
    </View>
  );
}
