import { View, Text, Switch, Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function SettingsScreen() {
  const [biometrics, setBiometrics] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <View className="flex-1 bg-black p-4 pt-16">
      <Text className="text-white text-3xl font-bold tracking-widest mb-8">SYSTEM</Text>

      <View className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white font-bold">Biometric Access</Text>
          <Switch
            value={biometrics}
            onValueChange={setBiometrics}
            trackColor={{ false: "#333", true: "#ff4444" }}
          />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-white font-bold">Mission Alerts</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#333", true: "#ff4444" }}
          />
        </View>
      </View>

      <Pressable
        className="bg-red-900/50 border border-red-700 p-4 rounded-lg items-center mt-auto mb-8"
        onPress={() => supabase.auth.signOut()}
      >
        <Text className="text-red-400 font-bold uppercase tracking-widest">
          TERMINATE SESSION
        </Text>
      </Pressable>
    </View>
  );
}
