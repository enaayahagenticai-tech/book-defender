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
  const statusColor = status === 'online' ? 'bg-green-500' : status === 'offline' ? 'bg-red-500' : 'bg-yellow-500';

  return (
    <View className="bg-gray-900 p-4 rounded-lg mb-6 border border-gray-800">
      <View className="flex-row items-center mb-4">
        <View className={twMerge("w-3 h-3 rounded-full mr-2", statusColor)} />
        <Text className="text-white font-bold text-lg uppercase tracking-wider">System Status: {status}</Text>
      </View>
      <View className="flex-row justify-between">
        <View>
          <Text className="text-gray-500 text-xs uppercase mb-1">Uptime</Text>
          <Text className="text-white font-mono">{uptime}</Text>
        </View>
        <View>
          <Text className="text-gray-500 text-xs uppercase mb-1">Last Scan</Text>
          <Text className="text-white font-mono">{lastScan}</Text>
        </View>
      </View>
    </View>
  );
}
