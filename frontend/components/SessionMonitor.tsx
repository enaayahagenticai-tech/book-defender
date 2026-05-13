import React, { useEffect, useRef, useCallback } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import { useSecurityStore } from '@/lib/store/security';
import { useAuthStore } from '@/lib/store/auth';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

interface SessionMonitorProps {
  children: React.ReactNode;
}

export function SessionMonitor({ children }: SessionMonitorProps) {
  const { session } = useAuthStore();
  const { isLocked, lockApp, biometricsEnabled } = useSecurityStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Use refs to access latest state in event handlers without recreating PanResponder constantly
  const stateRef = useRef({ session, isLocked, biometricsEnabled, lockApp });
  stateRef.current = { session, isLocked, biometricsEnabled, lockApp };

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const { session, isLocked, biometricsEnabled, lockApp } = stateRef.current;

    if (session && biometricsEnabled && !isLocked) {
      timerRef.current = setTimeout(() => {
        console.log('Session timeout: Locking app due to inactivity');
        lockApp();
      }, INACTIVITY_TIMEOUT);
    }
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetTimer();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => {
        resetTimer();
        return false;
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => false,
    })
  ).current;

  // Initial timer start on mount or session/lock change
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [session, isLocked, biometricsEnabled, resetTimer]);

  if (!session || !biometricsEnabled) {
      return <View style={styles.container}>{children}</View>;
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
