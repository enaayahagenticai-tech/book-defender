import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated, KeyboardAvoidingView, Platform,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { Stack } from 'expo-router';
import { useToastStore } from '@/lib/store/toast';
import { MonoText, FourCorners, Dot } from '@/components/tactical/Primitives';
import { C, FONT } from '@/constants/Theme';

export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [mode, setMode]         = useState<'signin' | 'signup'>('signin');
  const showToast = useToastStore((s) => s.showToast);

  // Scan line animation
  const scanY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, { toValue: 1, duration: 2600, useNativeDriver: true }),
        Animated.timing(scanY, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ]),
    ).start();
  }, [scanY]);

  const scanTranslate = scanY.interpolate({ inputRange: [0, 1], outputRange: [-40, 100] });

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) showToast({ type: 'error', title: 'AUTH FAILED', message: error.message });
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      showToast({ type: 'error', title: 'REGISTRATION FAILED', message: error.message });
    } else {
      showToast({ type: 'success', title: 'CLEARANCE REQUESTED', message: 'Check your inbox to verify.' });
      setMode('signin');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Radial glow */}
      <View style={styles.glow} />

      <View style={styles.inner}>
        {/* Brand */}
        <MonoText size={9} color={C.fg3} style={styles.eyebrow}>AIRLOCK · v4.12</MonoText>
        <Text style={styles.brand}>
          BOOK<Text style={{ color: C.primary }}>SENTINEL</Text>
        </Text>
        <Text style={styles.subtitle}>
          {mode === 'signin'
            ? 'Enter credentials to access the Command Center.'
            : 'Request operator clearance to join the network.'}
        </Text>

        {/* Scan card */}
        <View style={styles.scanCard}>
          <FourCorners color={C.primary} />

          {/* Face scan icon */}
          <View style={styles.faceWrap}>
            <View style={styles.faceOval} />
            <View style={styles.eyeL} /><View style={styles.eyeR} />
            <View style={styles.mouth} />
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanTranslate }] }]} />
            {/* Corner brackets */}
            <View style={[styles.corner, styles.cTL]} />
            <View style={[styles.corner, styles.cTR]} />
            <View style={[styles.corner, styles.cBL]} />
            <View style={[styles.corner, styles.cBR]} />
          </View>

          <View style={styles.verifyRow}>
            <Dot color={C.primary} pulse />
            <MonoText size={10} weight="600" color={C.primary} style={{ letterSpacing: 3 }}>
              {loading ? 'VERIFYING…' : 'AWAITING CREDENTIALS'}
            </MonoText>
          </View>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="EMAIL"
            placeholderTextColor={C.fg4}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="PASSWORD"
            placeholderTextColor={C.fg4}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
            onPress={mode === 'signin' ? signInWithEmail : signUpWithEmail}
            disabled={loading}
            activeOpacity={0.8}
          >
            <MonoText size={12} weight="700" color="#FFF8EC" style={{ letterSpacing: 3.5 }}>
              {mode === 'signin' ? 'AUTHENTICATE →' : 'REQUEST CLEARANCE →'}
            </MonoText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          >
            <MonoText size={10} color={C.fg3} style={{ letterSpacing: 2 }}>
              {mode === 'signin' ? 'NEW OPERATOR? REQUEST ACCESS' : 'HAVE CREDENTIALS? SIGN IN'}
            </MonoText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: C.bg0 },
  glow:       { position: 'absolute', top: 0, left: 0, right: 0, height: '50%', backgroundColor: 'rgba(193,95,60,0.07)', borderBottomLeftRadius: 999, borderBottomRightRadius: 999 },
  inner:      { flex: 1, paddingHorizontal: 28, paddingTop: 80, alignItems: 'center' },
  eyebrow:    { letterSpacing: 3 },
  brand:      { marginTop: 10, fontFamily: FONT.sans, fontSize: 28, fontWeight: '800', color: C.fg1, letterSpacing: -1 },
  subtitle:   { marginTop: 8, fontFamily: FONT.mono, fontSize: 11, color: C.fg3, textAlign: 'center', lineHeight: 18, letterSpacing: 1 },
  scanCard:   { marginTop: 32, width: '100%', backgroundColor: C.bg2, borderWidth: 1, borderColor: C.line2, borderRadius: 14, padding: 24, alignItems: 'center', position: 'relative', shadowColor: '#402616', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 6 },
  faceWrap:   { width: 120, height: 120, position: 'relative', overflow: 'hidden' },
  faceOval:   { position: 'absolute', width: 72, height: 90, top: 15, left: 24, borderWidth: 1.4, borderColor: C.fg3, borderRadius: 99, opacity: 0.8 },
  eyeL:       { position: 'absolute', width: 5, height: 5, top: 44, left: 38, borderRadius: 99, backgroundColor: C.fg3, opacity: 0.8 },
  eyeR:       { position: 'absolute', width: 5, height: 5, top: 44, left: 76, borderRadius: 99, backgroundColor: C.fg3, opacity: 0.8 },
  mouth:      { position: 'absolute', width: 22, height: 5, top: 76, left: 49, borderBottomWidth: 1.4, borderLeftWidth: 1.4, borderRightWidth: 1.4, borderColor: C.fg3, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, opacity: 0.8 },
  scanLine:   { position: 'absolute', left: 0, right: 0, height: 12, backgroundColor: 'rgba(193,95,60,0.35)', borderRadius: 2 },
  corner:     { position: 'absolute', width: 16, height: 16, borderColor: C.primary },
  cTL:        { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 },
  cTR:        { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 },
  cBL:        { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 },
  cBR:        { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 },
  verifyRow:  { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  form:       { width: '100%', marginTop: 24, gap: 10 },
  input:      { width: '100%', paddingHorizontal: 14, paddingVertical: 13, backgroundColor: C.bg2, borderWidth: 1, borderColor: C.line2, borderRadius: 8, fontFamily: FONT.mono, fontSize: 12, color: C.fg1, letterSpacing: 2 },
  primaryBtn: { width: '100%', paddingVertical: 14, backgroundColor: C.primary, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  switchBtn:  { alignItems: 'center', paddingVertical: 12 },
});
