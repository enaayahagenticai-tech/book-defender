import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

export default function ProtectedLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#333333',
        },
        tabBarActiveTintColor: '#FF4444',
        tabBarInactiveTintColor: '#666666',
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'COMMAND',
          tabBarIcon: ({ color }) => <FontAwesome name="shield" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="takedowns"
        options={{
          title: 'TARGETS',
          tabBarIcon: ({ color }) => <FontAwesome name="crosshairs" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'SYSTEM',
          tabBarIcon: ({ color }) => <FontAwesome name="cog" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
