import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { C, FONT } from '@/constants/Theme';

function TabIcon({ glyph, label, focused }: { glyph: string; label: string; focused: boolean }) {
  const color = focused ? C.primary : C.fg3;
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabGlyph, { color }]}>{glyph}</Text>
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon glyph="◧" label="COMMAND" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="takedown"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon glyph="⌖" label="TAKEDOWN" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="registry"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon glyph="▦" label="REGISTRY" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon glyph="⚙" label="SYSTEM" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: C.bg2,
    borderTopColor: C.line,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 24,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  tabGlyph: {
    fontSize: 18,
    lineHeight: 22,
  },
  tabLabel: {
    marginTop: 4,
    fontFamily: FONT.mono,
    fontSize: 9,
    letterSpacing: 1.8,
  },
});
