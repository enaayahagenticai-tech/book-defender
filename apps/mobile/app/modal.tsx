import { StatusBar } from 'expo-status-bar';
import { Platform, View, Text } from 'react-native';

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-white text-xl font-bold">Modal</Text>
      <View className="my-8 h-[1px] w-[80%] bg-gray-800" />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
