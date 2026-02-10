import React from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuthStore } from '@/lib/store/auth';
import { useSecurityStore } from '@/lib/store/security';
import { schedulePushNotification, TAKEDOWN_CATEGORY } from '@/lib/notifications';
import { useColorScheme } from '@/components/useColorScheme';
import Constants from 'expo-constants';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SettingsScreen() {
  const { session, signOut } = useAuthStore();
  const { biometricsEnabled, setBiometricsEnabled } = useSecurityStore();
  const colorScheme = useColorScheme();

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

  const triggerTestNotification = async () => {
    // Send a standard system test notification
    await schedulePushNotification(
      'SYSTEM TEST',
      'Communication protocols verified. Forensics module online.',
      { type: 'test' }
    );

    // Send an interactive threat notification (simulating a "Mission Critical" alert)
    // Delay slightly to ensure distinct arrival
    setTimeout(async () => {
      await schedulePushNotification(
        'CRITICAL THREAT DETECTED',
        'High confidence detection: phish-bank.com. Action required immediately.',
        { threatId: 'T-001' },
        TAKEDOWN_CATEGORY
      );
    }, 1500);

    Alert.alert('Sent', 'Test notifications dispatched (System Test + Simulated Threat).');
  };

  const iconColor = colorScheme === 'dark' ? '#94a3b8' : '#64748b'; // slate-400 : slate-500
  const switchTrackColor = { false: colorScheme === 'dark' ? '#334155' : '#cbd5e1', true: '#3b82f6' }; // slate-700 : slate-300 : blue-500
  const switchThumbColor = biometricsEnabled ? '#fff' : '#f4f3f4';
  const iosBackgroundColor = colorScheme === 'dark' ? '#334155' : '#cbd5e1';

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="items-center mb-10 mt-10">
        <View className="w-24 h-24 bg-card rounded-full items-center justify-center mb-4 border border-border">
          <FontAwesome name="user-secret" size={40} color={iconColor} />
        </View>
        <Text className="text-foreground text-xl font-bold font-mono tracking-wider">{email}</Text>
        <Text className="text-success font-mono text-xs tracking-widest mt-1">OPERATOR ACTIVE</Text>
      </View>

      <View className="mb-8">
        <Text className="text-muted-foreground font-bold mb-4 tracking-widest text-xs ml-1">SECURITY PROTOCOLS</Text>

        <View className="flex-row items-center justify-between bg-card/50 p-4 rounded border border-border mb-4">
            <View>
                <Text className="text-foreground font-bold font-mono mb-1">Biometric Lock</Text>
                <Text className="text-muted-foreground text-xs font-mono">Require FaceID/TouchID on entry</Text>
            </View>
            <Switch
                trackColor={switchTrackColor}
                thumbColor={switchThumbColor}
                ios_backgroundColor={iosBackgroundColor}
                onValueChange={toggleSwitch}
                value={biometricsEnabled}
            />
        </View>

        <TouchableOpacity
            className="flex-row items-center justify-between bg-card/50 p-4 rounded border border-border"
            onPress={triggerTestNotification}
        >
            <View>
                <Text className="text-foreground font-bold font-mono mb-1">Test Comms</Text>
                <Text className="text-muted-foreground text-xs font-mono">Verify push notification relay</Text>
            </View>
            <FontAwesome name="bell-o" size={20} color={iconColor} />
        </TouchableOpacity>
      </View>

      <View className="mb-8">
        <Text className="text-muted-foreground font-bold mb-4 tracking-widest text-xs ml-1">SYSTEM INFO</Text>
         <View className="bg-card/50 p-4 rounded border border-border gap-2">
            <View className="flex-row justify-between">
                <Text className="text-foreground font-mono">Version</Text>
                <Text className="text-muted-foreground font-mono">{Constants.expoConfig?.version ?? '1.0.0'}</Text>
            </View>
             <View className="flex-row justify-between">
                <Text className="text-foreground font-mono">Build</Text>
                <Text className="text-muted-foreground font-mono">{Constants.expoConfig?.ios?.buildNumber ?? '1'}</Text>
            </View>
            <View className="flex-row justify-between">
                <Text className="text-foreground font-mono">Environment</Text>
                <Text className="text-muted-foreground font-mono">Production</Text>
            </View>
        </View>
      </View>

      <TouchableOpacity
        className="w-full bg-destructive/10 border border-destructive/50 py-4 rounded items-center mt-4 active:bg-destructive/30"
        onPress={handleSignOut}
      >
        <Text className="text-destructive font-bold font-mono tracking-widest">TERMINATE SESSION</Text>
      </TouchableOpacity>

      <View className="mt-8 items-center mb-10">
          <Text className="text-muted font-mono text-[10px] tracking-[4px]">SENTINEL SCOUT</Text>
      </View>
    </ScrollView>
  );
}
