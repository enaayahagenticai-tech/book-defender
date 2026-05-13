import React from 'react';
import {
  View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { useAuthStore } from '@/lib/store/auth';
import { useSecurityStore } from '@/lib/store/security';
import { schedulePushNotification, TAKEDOWN_CATEGORY } from '@/lib/notifications';
import { useToastStore } from '@/lib/store/toast';
import Constants from 'expo-constants';
import { MonoText, ScreenHeader, FourCorners } from '@/components/tactical/Primitives';
import { C, FONT } from '@/constants/Theme';

export default function SettingsScreen() {
  const { session, signOut }                    = useAuthStore();
  const { biometricsEnabled, setBiometricsEnabled } = useSecurityStore();
  const showToast = useToastStore((s) => s.showToast);

  const email = session?.user?.email ?? 'UNKNOWN OPERATOR';
  const initials = email.slice(0, 2).toUpperCase();

  const triggerTestNotification = async () => {
    await schedulePushNotification(
      'SYSTEM TEST',
      'Communication protocols verified. Forensics module online.',
      { type: 'test' },
    );
    setTimeout(async () => {
      await schedulePushNotification(
        'CRITICAL THREAT DETECTED',
        'High confidence detection: piracy-mirror.org. Action required.',
        { threatId: 'T-001' },
        TAKEDOWN_CATEGORY,
      );
    }, 1500);
    showToast({ type: 'success', title: 'COMMS TEST', message: 'Test notifications dispatched.' });
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader subtitle="OPERATOR PROFILE" title="System" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Operator card */}
        <View style={styles.operatorCard}>
          <FourCorners color={C.primary} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.emailText}>{email}</Text>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <MonoText size={9} color={C.success} style={{ letterSpacing: 3 }}>OPERATOR ACTIVE</MonoText>
          </View>
        </View>

        {/* Security section */}
        <View style={styles.section}>
          <MonoText size={9} color={C.fg3} style={styles.sectionLabel}>SECURITY PROTOCOLS</MonoText>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <MonoText size={12} weight="600" color={C.fg1}>Biometric Lock</MonoText>
              <MonoText size={10} color={C.fg3} style={{ marginTop: 2, letterSpacing: 1 }}>
                Require Face ID / Touch ID on entry
              </MonoText>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: C.line2, true: C.primary }}
              thumbColor={biometricsEnabled ? '#FFF8EC' : C.fg4}
              ios_backgroundColor={C.bg3}
            />
          </View>

          <TouchableOpacity style={styles.row} onPress={triggerTestNotification} activeOpacity={0.7}>
            <View style={{ flex: 1 }}>
              <MonoText size={12} weight="600" color={C.fg1}>Test Comms</MonoText>
              <MonoText size={10} color={C.fg3} style={{ marginTop: 2, letterSpacing: 1 }}>
                Verify push notification relay
              </MonoText>
            </View>
            <MonoText size={16} color={C.primary}>⚡</MonoText>
          </TouchableOpacity>
        </View>

        {/* System info */}
        <View style={styles.section}>
          <MonoText size={9} color={C.fg3} style={styles.sectionLabel}>SYSTEM INFO</MonoText>
          <View style={styles.infoCard}>
            {[
              ['VERSION',     Constants.expoConfig?.version ?? '1.0.0'],
              ['BUILD',       Constants.expoConfig?.ios?.buildNumber ?? '1'],
              ['ENVIRONMENT', 'PRODUCTION'],
              ['PROTOCOL',    'TLS 1.3 · AES-256'],
            ].map(([label, value]) => (
              <View key={label} style={styles.infoRow}>
                <MonoText size={10} color={C.fg3} style={{ letterSpacing: 2 }}>{label}</MonoText>
                <MonoText size={10} color={C.fg1} weight="600" style={{ letterSpacing: 1 }}>{value}</MonoText>
              </View>
            ))}
          </View>
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
          <MonoText size={12} weight="700" color={C.destructive} style={{ letterSpacing: 3 }}>
            TERMINATE SESSION
          </MonoText>
        </TouchableOpacity>

        <MonoText size={9} color={C.fg4} style={styles.footer}>BOOKSENTINEL · SENTINEL NETWORK</MonoText>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: C.bg0 },
  content:       { padding: 18 },
  operatorCard:  { padding: 22, backgroundColor: C.bg2, borderWidth: 1, borderColor: C.line2, borderRadius: 12, alignItems: 'center', position: 'relative', marginBottom: 24 },
  avatar:        { width: 60, height: 60, borderRadius: 99, backgroundColor: C.primarySoft, borderWidth: 1.5, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText:    { fontFamily: FONT.mono, fontSize: 20, fontWeight: '700', color: C.primary },
  emailText:     { marginTop: 12, fontFamily: FONT.mono, fontSize: 12, color: C.fg1, letterSpacing: 1 },
  statusPill:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  statusDot:     { width: 6, height: 6, borderRadius: 99, backgroundColor: C.success },
  section:       { marginBottom: 20 },
  sectionLabel:  { letterSpacing: 3, marginBottom: 10 },
  row:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, backgroundColor: C.bg2, borderWidth: 1, borderColor: C.line, borderRadius: 8, marginBottom: 8 },
  infoCard:      { backgroundColor: C.bg2, borderWidth: 1, borderColor: C.line, borderRadius: 8, overflow: 'hidden' },
  infoRow:       { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.line },
  signOutBtn:    { width: '100%', paddingVertical: 14, backgroundColor: 'rgba(164,54,31,0.08)', borderWidth: 1, borderColor: 'rgba(164,54,31,0.35)', borderRadius: 8, alignItems: 'center', marginTop: 8 },
  footer:        { textAlign: 'center', letterSpacing: 4, marginTop: 24 },
});
