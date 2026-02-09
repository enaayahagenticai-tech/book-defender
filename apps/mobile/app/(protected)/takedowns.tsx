import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TakedownCard, { Threat } from '@/components/tactical/TakedownCard';

export default function TakedownScreen() {
  const [threats, setThreats] = useState<Threat[]>([
    {
      id: '1',
      domain: 'login-microsoft-secure.com',
      threatLevel: 'CRITICAL',
      source: 'PhishTank',
      timestamp: '2023-10-27 14:32:01',
    },
    {
      id: '2',
      domain: 'update-delivery-express.net',
      threatLevel: 'HIGH',
      source: 'Internal Scanner',
      timestamp: '2023-10-27 13:15:45',
    },
    {
      id: '3',
      domain: 'promo-free-gift.xyz',
      threatLevel: 'MEDIUM',
      source: 'User Report',
      timestamp: '2023-10-27 12:44:12',
    },
    {
       id: '4',
       domain: 'account-verify-support.io',
       threatLevel: 'CRITICAL',
       source: 'Heuristic Engine',
       timestamp: '2023-10-27 11:22:33',
    }
  ]);

  const handleSwipeLeft = (id: string) => {
    console.log('False Positive:', id);
    setThreats((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSwipeRight = (id: string) => {
    console.log('Takedown Authorized:', id);
    setThreats((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-black p-4 pt-16 items-center">
        <Text className="text-white text-3xl font-bold tracking-widest mb-4">TARGETS</Text>
        <Text className="text-gray-500 text-xs font-mono mb-8 uppercase">
           {threats.length > 0 ? `${threats.length} THREATS PENDING REVIEW` : 'ALL TARGETS CLEARED'}
        </Text>

        <View style={styles.cardContainer}>
          {threats.map((threat, index) => {
             // Only render the top cards to save memory, but we need the stack effect
             // Reverse order so the first item in array is on top (highest z-index)
             if (index >= 3) return null;

             return (
              <View key={threat.id} style={[StyleSheet.absoluteFillObject, { zIndex: threats.length - index }]}>
                 <TakedownCard
                   threat={threat}
                   onSwipeLeft={handleSwipeLeft}
                   onSwipeRight={handleSwipeRight}
                 />
              </View>
            );
          }).reverse()}

          {threats.length === 0 && (
             <View className="items-center justify-center h-full opacity-50">
                <Text className="text-green-500 font-bold text-2xl tracking-widest">SYSTEM SECURE</Text>
                <Text className="text-gray-500 mt-2">No active threats detected.</Text>
             </View>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
