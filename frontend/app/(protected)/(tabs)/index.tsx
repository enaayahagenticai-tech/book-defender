import { View } from 'react-native';
import { HUD } from '@/components/tactical/HUD';

export default function TabOneScreen() {
  return (
    <View className="flex-1 bg-black">
      <HUD />
    </View>
  );
}
