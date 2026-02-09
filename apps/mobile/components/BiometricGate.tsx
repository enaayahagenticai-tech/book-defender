import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, AppState, AppStateStatus, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useSecurityStore } from '@/lib/store/security';
import { useAuthStore } from '@/lib/store/auth';

const LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function BiometricGate({ children }: { children: React.ReactNode }) {
  const { isLocked, lockApp, unlockApp, lastActive, setLastActive } = useSecurityStore();
  const { session } = useAuthStore();
  const appState = useRef(AppState.currentState);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Auto-lock on background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground
        const now = Date.now();
        // If we were inactive for longer than timeout, lock.
        // Or if we were just locked manually.
        if (lastActive && now - lastActive > LOCK_TIMEOUT) {
          lockApp();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        // App is going to background
        setLastActive(Date.now());
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [lastActive, lockApp, setLastActive]);


  // Prompt for biometrics if locked and logged in
  useEffect(() => {
    if (isLocked && session) {
      authenticate();
    }
  }, [isLocked, session]);

  const authenticate = async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        // Fallback if no biometrics available (e.g. Simulator without enrolled faceid)
        // In production, this might require a passcode fallback.
        // For now, we unlock to allow access.
        unlockApp();
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Sentinel Scout',
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        unlockApp();
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
    } finally {
        setIsAuthenticating(false);
    }
  };

  // If not logged in, we don't gate. The router handles auth redirection.
  if (!session) {
    return <>{children}</>;
  }

  if (isLocked) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
            <Text style={styles.title}>LOCKED</Text>
            <Text style={styles.subtitle}>Biometric Authentication Required</Text>
            <TouchableOpacity style={styles.button} onPress={authenticate}>
            <Text style={styles.buttonText}>Unlock</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        gap: 20,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'SpaceMono',
        letterSpacing: 2,
    },
    subtitle: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'SpaceMono',
    },
    button: {
        borderWidth: 1,
        borderColor: '#333',
        paddingHorizontal: 40,
        paddingVertical: 15,
        marginTop: 20,
        borderRadius: 4,
        backgroundColor: '#1a1a1a'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'SpaceMono',
    }
});
