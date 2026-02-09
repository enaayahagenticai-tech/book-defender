import React from 'react';
import { View, Text } from 'react-native';
import { useThreatStore } from '@/lib/store/threats';
import { SwipeableThreatCard } from '@/components/tactical/SwipeableThreatCard';

export default function TakedownScreen() {
  const threats = useThreatStore((state) => state.threats);
  const resolveThreat = useThreatStore((state) => state.resolveThreat);
  const ignoreThreat = useThreatStore((state) => state.ignoreThreat);

  // Filter for active/pending threats
  const activeThreats = threats.filter(t => t.status === 'active' || t.status === 'pending');

  if (activeThreats.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-black p-4">
        <Text className="text-white text-3xl font-bold font-mono mb-4 text-center">ALL CLEAR</Text>
        <Text className="text-gray-500 text-center">No active threats detected in your sector.</Text>
      </View>
    );
  }

  // We verify threats one by one. Stack visual effect.
  // Top card is the first one in activeThreats list.
  // We want to render a stack.
  // If we take first 3: [T1, T2, T3]
  // We want T1 on top.
  // Render order: T3, T2, T1.
  const stack = activeThreats.slice(0, 3).reverse();

  return (
    <View className="flex-1 bg-black p-4 items-center justify-center">
      <View className="w-full h-[300px] relative items-center justify-center">
          {stack.map((threat, index) => {
              // index 0 is T3 (bottom), index 2 is T1 (top)
              const isTop = index === stack.length - 1;
              const offsetIndex = stack.length - 1 - index; // 0 for top, 1 for second, 2 for third

              return (
                  <View key={threat.id} style={{
                      position: 'absolute',
                      width: '100%',
                      top: offsetIndex * 15,
                      transform: [{ scale: 1 - offsetIndex * 0.05 }],
                      zIndex: index, // Higher index on top
                      opacity: 1 - offsetIndex * 0.2
                  }}>
                    <SwipeableThreatCard
                        threat={threat}
                        onSwipeRight={resolveThreat}
                        onSwipeLeft={ignoreThreat}
                        enabled={isTop}
                    />
                  </View>
              )
          })}
      </View>
       <View className="mt-20 items-center">
          <Text className="text-gray-500 text-center font-mono text-xs tracking-widest">
            SWIPE RIGHT TO PURGE{'\n'}SWIPE LEFT TO IGNORE
          </Text>
       </View>
    </View>
  );
}
