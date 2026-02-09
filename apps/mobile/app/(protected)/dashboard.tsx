import { View, Text, ScrollView, Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function DashboardScreen() {
  const [threats, setThreats] = useState(12);
  const [pending, setPending] = useState(5);
  const [health, setHealth] = useState('OPTIMAL');

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <View className="flex-1 bg-black p-4 pt-16">
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-white text-3xl font-bold tracking-widest">COMMAND</Text>
        <Pressable onPress={signOut}>
          <FontAwesome name="sign-out" size={24} color="#FF4444" />
        </Pressable>
      </View>

      <ScrollView className="flex-1">
        <View className="flex-row justify-between mb-4">
          <View className="bg-red-900/30 border border-red-500 rounded-lg p-4 flex-1 mr-2 items-center">
            <Text className="text-red-400 text-xs font-bold uppercase mb-2">Active Threats</Text>
            <Text className="text-white text-4xl font-black">{threats}</Text>
          </View>
          <View className="bg-orange-900/30 border border-orange-500 rounded-lg p-4 flex-1 ml-2 items-center">
            <Text className="text-orange-400 text-xs font-bold uppercase mb-2">Pending Ops</Text>
            <Text className="text-white text-4xl font-black">{pending}</Text>
          </View>
        </View>

        <View className="bg-green-900/30 border border-green-500 rounded-lg p-4 mb-6">
          <Text className="text-green-400 text-xs font-bold uppercase mb-2">System Health</Text>
          <Text className="text-white text-2xl font-bold tracking-wider">{health}</Text>
          <Text className="text-gray-400 text-xs mt-1">All Systems Nominal. Uplink Secure.</Text>
        </View>

        <View className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
          <Text className="text-gray-400 text-xs font-bold uppercase mb-4">Recent Activity</Text>
          <View className="mb-3 border-b border-gray-800 pb-2">
            <Text className="text-red-400 font-bold text-sm">THREAT DETECTED</Text>
            <Text className="text-gray-500 text-xs">Vector: domain.xyz (Phishing)</Text>
          </View>
          <View className="mb-3 border-b border-gray-800 pb-2">
            <Text className="text-green-400 font-bold text-sm">TAKEDOWN CONFIRMED</Text>
            <Text className="text-gray-500 text-xs">Target: malicious-site.org</Text>
          </View>
          <View>
             <Text className="text-blue-400 font-bold text-sm">SCAN COMPLETE</Text>
             <Text className="text-gray-500 text-xs">Sector 7 (Internal Network)</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
