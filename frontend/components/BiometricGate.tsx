import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, AppState, StyleSheet, Animated,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useSecurityStore } from '@/lib/store/security';
import { useAuthStore } from '@/lib/store/auth';
import { MonoText, FourCorners, Dot } from './tactical/Primitives';
import { C, FONT } from '@/constants/Theme';

const LOCK_TIMEOUT = 5 * 60 * 1000;

export function BiometricGate({ children }: { children: React.ReactNode }) {
  const { isLocked, lockApp, unlockApp, lastActive, setLastActive, biometricsEnabled } =
    useSecurityStore();
  const { session } = useAuthStore();
  const appState = useRef(AppState.currentState);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Scan line animation
  const scanY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, { toValue: 1, duration: 2400, useNativeDriver: true }),
        Animated.timing(scanY, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ]),
    ).start();
  }, [scanY]);

  useEffect(() => {
    if (!biometricsEnabled) return;
    const sub = AppState.addEventListener('change', (next) => {
      if (appState.current.match(/inactive|background/) && next === 'active') {
        if (lastActive && Date.now() - lastActive > LOCK_TIMEOUT) lockApp();
      } else if (next.match(/inactive|background/)) {
        setLastActive(Date.now());
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, [lastActive, lockApp, setLastActive, biometricsEnabled]);

  useEffect(() => {
    if (!session) return;
    if (!biometricsEnabled) { if (isLocked) unlockApp(); return; }
    if (isLocked) authenticate();
  }, [isLocked, session, biometricsEnabled]);

  const authenticate = async () => {
    if (isAuthenticating) return;
    if (!biometricsEnabled) { unlockApp(); return; }
    setIsAuthenticating(true);
    try {
      const hasHW = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHW || !enrolled) { unlockApp(); return; }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access BookSentinel',
        fallbackLabel: 'Use Passcode',
      });
      if (result.success) unlockApp();
    } catch {
      // silently fail — user can retry via button
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!session || !biometricsEnabled) return <>{children}</>;

  if (isLocked) {
    const scanTranslate = scanY.interpolate({
      inputRange: [0, 1],
      outputRange: [-60, 120],
    });

    return (
      <View style={styles.screen}>
        {/* Radial glow */}
        <View style={[styles.glow, { pointerEvents: 'none' }]} />

        <View style={styles.inner}>
          <MonoText size={9} color={C.fg2} style={styles.eyebrow}>AIRLOCK · v4.12</MonoText>
          <Text style={styles.brandText}>
            {'BOOK'}
            <Text style={{ color: C.primary }}>SENTINEL</Text>
          </Text>
          <Text style={styles.subtitle}>
            Awaiting biometric clearance.{'\n'}Hold the device to your face.
          </Text>

          {/* Face scan card */}
          <View style={styles.scanCard}>
            <FourCorners color={C.primary} />

            {/* SVG-like face scan using Views */}
            <View style={styles.faceContainer}>
              {/* Corner brackets drawn with Views */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {/* Face outline */}
              <View style={styles.faceOval} />
              <View style={styles.eyeLeft} />
              <View style={styles.eyeRight} />
              <View style={styles.mouth} />

              {/* Animated scan line */}
              <Animated.View
                style={[styles.scanLine, { transform: [{ translateY: scanTranslate }] }]}
              />
            </View>

            <View style={styles.verifyingRow}>
              <Dot color={C.primary} pulse />
              <MonoText size={11} weight="600" color={C.primary} style={{ letterSpacing: 3 }}>
                {isAuthenticating ? 'VERIFYING…' : 'HOLD FOR FACE ID'}
              </MonoText>
            </View>

            <View style={styles.divider}>
              <MonoText size={10} color={C.fg3} style={styles.label}>OPERATOR</MonoText>
              <MonoText size={10} color={C.fg2} style={styles.label}>SENTINEL AGENT</MonoText>
            </View>
          </View>

          <TouchableOpacity onPress={authenticate} disabled={isAuthenticating} style={styles.retryBtn}>
            <MonoText size={10} color={C.fg3} style={styles.label}>
              OR USE PASSCODE · SUPABASE AUTH
            </MonoText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg0,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    // Simulated radial glow with a soft background
    backgroundColor: 'rgba(193,95,60,0.08)',
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
  },
  inner: {
    flex: 1,
    paddingTop: 90,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  eyebrow: {
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  brandText: {
    marginTop: 12,
    fontFamily: FONT.sans,
    fontSize: 30,
    fontWeight: '800',
    color: C.fg1,
    letterSpacing: -1,
  },
  subtitle: {
    marginTop: 10,
    fontFamily: FONT.sans,
    fontSize: 14,
    color: C.fg2,
    lineHeight: 22,
    textAlign: 'center',
  },
  scanCard: {
    marginTop: 56,
    width: '100%',
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.line2,
    borderRadius: 14,
    padding: 28,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#402616',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 8,
  },
  faceContainer: {
    width: 160,
    height: 160,
    position: 'relative',
    overflow: 'hidden',
  },
  // Corner bracket pieces (L-shaped with two Views each — simplified as single rectangles here)
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: C.primary,
  },
  cornerTL: {
    top: 0, left: 0,
    borderTopWidth: 2, borderLeftWidth: 2,
  },
  cornerTR: {
    top: 0, right: 0,
    borderTopWidth: 2, borderRightWidth: 2,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderBottomWidth: 2, borderLeftWidth: 2,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderBottomWidth: 2, borderRightWidth: 2,
  },
  faceOval: {
    position: 'absolute',
    width: 96,
    height: 120,
    top: 20,
    left: 32,
    borderWidth: 1.4,
    borderColor: C.fg3,
    borderRadius: 99,
    opacity: 0.85,
  },
  eyeLeft: {
    position: 'absolute',
    width: 6,
    height: 6,
    top: 58,
    left: 55,
    borderRadius: 99,
    backgroundColor: C.fg3,
    opacity: 0.85,
  },
  eyeRight: {
    position: 'absolute',
    width: 6,
    height: 6,
    top: 58,
    left: 98,
    borderRadius: 99,
    backgroundColor: C.fg3,
    opacity: 0.85,
  },
  mouth: {
    position: 'absolute',
    width: 28,
    height: 6,
    top: 100,
    left: 66,
    borderBottomWidth: 1.4,
    borderLeftWidth: 1.4,
    borderRightWidth: 1.4,
    borderColor: C.fg3,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    opacity: 0.85,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: 'rgba(193,95,60,0.38)',
    borderRadius: 2,
  },
  verifyingRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: C.line,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    letterSpacing: 2,
  },
  retryBtn: {
    marginTop: 18,
  },
});
