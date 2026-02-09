import { StyleSheet } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function TabOneScreen() {
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Checking...');

  useEffect(() => {
    if (supabase) {
      setSupabaseStatus('Supabase Initialized');
    } else {
      setSupabaseStatus('Supabase Failed');
    }
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-2xl font-bold text-blue-500 mb-4">NativeWind Test</Text>
      <View style={styles.separator} />
      <Text className="text-lg text-green-600 mb-4">{supabaseStatus}</Text>
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
  },
});
