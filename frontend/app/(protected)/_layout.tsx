import { Slot } from 'expo-router';
import { View } from 'react-native';
import { BiometricGate } from '@/components/BiometricGate';
import { C } from '@/constants/Theme';

export default function ProtectedLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg0 }}>
      <BiometricGate>
        <Slot />
      </BiometricGate>
    </View>
  );
}
