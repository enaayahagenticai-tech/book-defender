import { Slot } from 'expo-router';
import { View } from 'react-native';
import { BiometricGate } from '@/components/BiometricGate';

export default function ProtectedLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <BiometricGate>
        <Slot />
      </BiometricGate>
    </View>
  );
}
