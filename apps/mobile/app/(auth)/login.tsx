import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

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

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    // Redirect is handled by the root layout's effect
  }

  return (
    <View className="flex-1 items-center justify-center bg-black p-4">
      <Text className="text-3xl font-bold text-red-500 mb-8">SENTINEL ACCESS</Text>

      <View className="w-full max-w-sm gap-4">
        <View className="bg-gray-900 border border-gray-700 rounded-lg p-1">
          <TextInput
            className="text-white p-3"
            placeholder="Agent ID (Email)"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View className="bg-gray-900 border border-gray-700 rounded-lg p-1">
          <TextInput
            className="text-white p-3"
            placeholder="Passcode"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <Pressable
          onPress={signInWithEmail}
          disabled={loading}
          className={`bg-red-600 p-4 rounded-lg items-center mt-4 ${loading ? 'opacity-50' : ''}`}
        >
          <Text className="text-white font-bold tracking-widest">
            {loading ? 'AUTHENTICATING...' : 'AUTHORIZE'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
