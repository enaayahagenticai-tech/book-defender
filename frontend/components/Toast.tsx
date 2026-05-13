import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useToastStore, ToastMessage } from '@/lib/store/toast';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function ToastItem({ toast }: { toast: ToastMessage }) {
  const hideToast = useToastStore((state) => state.hideToast);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return 'check-circle';
      case 'error': return 'exclamation-circle';
      case 'info': return 'info-circle';
      default: return 'info-circle';
    }
  };

  const getColor = () => {
    switch (toast.type) {
      case 'success': return 'bg-emerald-900/90 border-emerald-500';
      case 'error': return 'bg-red-900/90 border-red-500';
      case 'info': return 'bg-blue-900/90 border-blue-500';
      default: return 'bg-gray-900/90 border-gray-500';
    }
  };

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      className={`w-[90%] self-center mb-2 p-4 rounded border flex-row items-center justify-between ${getColor()}`}
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}
    >
      <View className="flex-row items-center flex-1">
        <FontAwesome name={getIcon()} size={24} color="#fff" style={{ marginRight: 12 }} />
        <View className="flex-1">
          <Text className="text-white font-bold font-mono text-sm">{toast.title}</Text>
          {toast.message && <Text className="text-gray-300 font-mono text-xs mt-1">{toast.message}</Text>}
        </View>
      </View>
      <TouchableOpacity onPress={() => hideToast(toast.id)}>
        <FontAwesome name="times" size={16} color="#aaa" />
      </TouchableOpacity>
    </Animated.View>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50, // Below status bar
    left: 0,
    right: 0,
    zIndex: 9999, // Ensure it's on top
    alignItems: 'center',
  },
});
