import { View, Text } from 'react-native';

export default function TakedownScreen() {
  return (
    <View className="flex-1 bg-black p-4 pt-16 items-center">
      <Text className="text-white text-3xl font-bold tracking-widest mb-8">TARGETS</Text>
      <View className="flex-1 justify-center items-center opacity-50">
        <Text className="text-gray-500 font-bold uppercase tracking-widest text-xl">
          [SWIPE MODULE PENDING]
        </Text>
      </View>
    </View>
  );
}
