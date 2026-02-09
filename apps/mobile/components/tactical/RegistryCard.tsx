import React from 'react';
import { View, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { RegistryEntry } from '@/lib/store/registry';

export function RegistryCard({ id, domain, status, riskScore, tags }: RegistryEntry) {
  const statusColor =
    status === 'active' ? 'text-destructive' :
    status === 'monitored' ? 'text-primary' :
    'text-muted-foreground';

  const borderColor =
    status === 'active' ? 'border-destructive' :
    status === 'monitored' ? 'border-primary' :
    'border-muted';

  return (
    <View className={twMerge("bg-card border p-4 rounded-lg mb-4", borderColor)}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-card-foreground font-bold text-lg font-mono flex-1 mr-2" numberOfLines={1}>{domain}</Text>
        <Text className={twMerge("font-bold text-sm uppercase", statusColor)}>{status}</Text>
      </View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-muted-foreground text-xs font-mono">ID: {id}</Text>
        <Text className="text-card-foreground text-xs font-mono">RISK: {riskScore}/100</Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
          {tags.map(tag => (
              <View key={tag} className="bg-secondary px-2 py-1 rounded">
                  <Text className="text-secondary-foreground text-[10px] uppercase font-mono">{tag}</Text>
              </View>
          ))}
      </View>
    </View>
  );
}
