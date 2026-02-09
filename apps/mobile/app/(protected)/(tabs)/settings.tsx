import React from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuthStore } from '@/lib/store/auth';
import { useSecurityStore } from '@/lib/store/security';
import Constants from 'expo-constants';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SettingsScreen() {
  const { session, signOut } = useAuthStore();
  const { biometricsEnabled, setBiometricsEnabled } = useSecurityStore();

  // Handle case where user might be null but session exists (shouldn't happen often)
  const email = session?.user?.email ?? 'Unknown User';

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign out');
    }
  };

  const toggleSwitch = () => setBiometricsEnabled(!biometricsEnabled);

  return (
    <ScrollView className="flex-1 bg-black p-4">
      <View className="items-center mb-10 mt-10">
        <View className="w-24 h-24 bg-gray-900 rounded-full items-center justify-center mb-4 border border-gray-800">
          <FontAwesome name="user-secret" size={40} color="#666" />
        </View>
        <Text className="text-white text-xl font-bold font-mono tracking-wider">{email}</Text>
        <Text className="text-emerald-500 font-mono text-xs tracking-widest mt-1">OPERATOR ACTIVE</Text>
      </View>

      <View className="mb-8">
        <Text className="text-gray-500 font-bold mb-4 tracking-widest text-xs ml-1">SECURITY PROTOCOLS</Text>

        <View className="flex-row items-center justify-between bg-gray-900/50 p-4 rounded border border-gray-800 mb-4">
            <View>
                <Text className="text-white font-bold font-mono mb-1">Biometric Lock</Text>
                <Text className="text-gray-500 text-xs font-mono">Require FaceID/TouchID on entry</Text>
            </View>
            <Switch
                trackColor={{ false: '#333', true: '#fff' }}
                thumbColor={biometricsEnabled ? '#000' : '#f4f3f4'}
                ios_backgroundColor="#333"
                onValueChange={toggleSwitch}
                value={biometricsEnabled}
            />
        </View>
      </View>

      <View className="mb-8">
        <Text className="text-gray-500 font-bold mb-4 tracking-widest text-xs ml-1">SYSTEM INFO</Text>
         <View className="bg-gray-900/50 p-4 rounded border border-gray-800 gap-2">
            <View className="flex-row justify-between">
                <Text className="text-white font-mono">Version</Text>
                <Text className="text-gray-400 font-mono">{Constants.expoConfig?.version ?? '1.0.0'}</Text>
            </View>
             <View className="flex-row justify-between">
                <Text className="text-white font-mono">Build</Text>
                <Text className="text-gray-400 font-mono">{Constants.expoConfig?.ios?.buildNumber ?? '1'}</Text>
            </View>
            <View className="flex-row justify-between">
                <Text className="text-white font-mono">Environment</Text>
                <Text className="text-gray-400 font-mono">Production</Text>
            </View>
        </View>
      </View>

      <TouchableOpacity
        className="w-full bg-red-900/10 border border-red-900/50 py-4 rounded items-center mt-4 active:bg-red-900/30"
        onPress={handleSignOut}
      >
        <Text className="text-red-500 font-bold font-mono tracking-widest">TERMINATE SESSION</Text>
      </TouchableOpacity>

      <View className="mt-8 items-center mb-10">
          <Text className="text-gray-800 font-mono text-[10px] tracking-[4px]">SENTINEL SCOUT</Text>
      </View>
    </ScrollView>
  );
}
