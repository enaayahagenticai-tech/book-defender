import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Stack } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    else Alert.alert('Check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <View className="flex-1 bg-background items-center justify-center p-5">
      <Stack.Screen options={{ title: 'Login', headerShown: false }} />
      <View className="w-full gap-4">
        <Text className="text-3xl font-bold text-foreground text-center mb-10 font-mono tracking-tighter">
          SENTINEL<Text className="text-primary">SCOUT</Text>
        </Text>

        <TextInput
          className="bg-card border border-border p-4 rounded text-foreground text-base font-mono placeholder:text-muted-foreground"
          placeholder="EMAIL"
          placeholderTextColor="#64748b" // Fallback for platforms not supporting placeholder: modifier if any, but NativeWind handles it usually via className
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          className="bg-card border border-border p-4 rounded text-foreground text-base font-mono placeholder:text-muted-foreground"
          placeholder="PASSWORD"
          placeholderTextColor="#64748b"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          autoCapitalize="none"
        />

        <TouchableOpacity
          className="bg-primary p-4 rounded items-center mt-2 active:opacity-80"
          onPress={signInWithEmail}
          disabled={loading}
        >
          <Text className="text-primary-foreground font-bold text-base font-mono tracking-widest">
            AUTHENTICATE
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="p-4 items-center active:opacity-60"
          onPress={signUpWithEmail}
          disabled={loading}
        >
          <Text className="text-muted-foreground text-sm font-mono tracking-widest">
            REQUEST CLEARANCE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
