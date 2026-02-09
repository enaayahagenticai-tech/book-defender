import { Link, Stack } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-black p-5">
        <Text className="text-white text-xl font-bold">This screen doesn't exist.</Text>

        <Link href="/" asChild>
          <TouchableOpacity className="mt-4 p-4">
            <Text className="text-blue-500 text-sm">Go to home screen!</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}
