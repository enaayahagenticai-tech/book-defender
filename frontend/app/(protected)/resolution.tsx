import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MonoText, ScreenHeader, FourCorners, RiskBar } from '@/components/tactical/Primitives';
import { useThreatStore } from '@/lib/store/threats';
import { dispatchTakedown } from '@/lib/api/scan';
import { C, FONT, riskColor } from '@/constants/Theme';

const REGISTRY_ROWS = [
  { id: 'T-2031', domain: 'freebooks-vault[.]ru/atlas-of-fog', status: 'pending' as const, risk: 96 },
  { id: 'T-2024', domain: 'lit-mirror[.]to/shadow-archive',   status: 'active'  as const, risk: 88 },
  { id: 'T-2018', domain: 'phish-readers[.]xyz/login',         status: 'active'  as const, risk: 82 },
];

export default function ResolutionScreen() {
  const router = useRouter();
  const { threatId } = useLocalSearchParams<{ threatId: string }>();
  const threat = useThreatStore((s) => s.threats.find((t) => t.id === threatId));
  const resolveThreat = useThreatStore((s) => s.resolveThreat);

  useEffect(() => {
    if (!threatId) return;
    resolveThreat(threatId);
    if (threat?.domain) dispatchTakedown(threatId, threat.domain);
  }, [threatId]);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        subtitle="ACTIONED · 14:11:08Z"
        title="Purged"
        right={
          <MonoText size={11} weight="700" color={C.success} style={{ letterSpacing: 3 }}>✓</MonoText>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success hero */}
        <View style={styles.heroCard}>
          <FourCorners color={C.success} />

          <View style={styles.checkCircle}>
            <Text style={styles.checkGlyph}>✓</Text>
          </View>

          <Text style={styles.heroTitle}>Takedown dispatched.</Text>
          <MonoText size={12} color={C.fg2} style={styles.heroSub}>
            {threat
              ? `Notice + evidence queued for ${threat.domain}.`
              : 'Notice + evidence delivered to host abuse and registrar.'}
          </MonoText>

          <View style={styles.statusRow}>
            <MonoText size={10} color={C.fg3} style={styles.label}>STATUS</MonoText>
            <MonoText size={10} weight="700" color={C.warning} style={styles.label}>
              AWAITING HOST ACK
            </MonoText>
          </View>
          <View style={[styles.statusRow, { marginTop: 6 }]}>
            <MonoText size={10} color={C.fg3} style={styles.label}>EST. MTTR</MonoText>
            <MonoText size={10} weight="700" color={C.fg1} style={styles.label}>14–42 MIN</MonoText>
          </View>
        </View>

        {/* Registry queue */}
        <View style={{ marginTop: 18 }}>
          <MonoText size={10} weight="700" color={C.fg2} style={[styles.label, { marginBottom: 8 }]}>
            REGISTRY · NEXT IN QUEUE
          </MonoText>
          <View style={styles.regList}>
            {REGISTRY_ROWS.map((row) => (
              <RegRow key={row.id} {...row} />
            ))}
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/(protected)/(tabs)/takedown' as never)}
          activeOpacity={0.8}
        >
          <MonoText size={12} weight="700" color="#FFF8EC" style={{ letterSpacing: 3.5 }}>
            CONTINUE TRIAGE →
          </MonoText>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function RegRow({
  id, domain, status, risk,
}: { id: string; domain: string; status: 'active' | 'pending'; risk: number }) {
  const accent = riskColor(risk);
  const statusColor = status === 'pending' ? C.warning : C.destructive;

  return (
    <View style={[styles.regRow, { borderLeftColor: accent }]}>
      <View style={styles.rowBetween}>
        <MonoText size={9} color={C.fg3} style={styles.label}>{id} · PIRATED PDF</MonoText>
        <MonoText size={9} weight="700" color={statusColor} style={styles.label}>
          {status.toUpperCase()}
        </MonoText>
      </View>
      <MonoText size={12} weight="600" color={C.fg1} style={{ marginTop: 4 }}>
        {domain}
      </MonoText>
      <View style={{ marginTop: 6 }}>
        <RiskBar value={risk} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg0,
  },
  content: {
    padding: 18,
  },
  label: {
    letterSpacing: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroCard: {
    padding: 22,
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.line2,
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative',
  },
  checkCircle: {
    width: 56,
    height: 56,
    borderRadius: 99,
    backgroundColor: 'rgba(107,127,74,0.14)',
    borderWidth: 1.5,
    borderColor: C.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkGlyph: {
    fontSize: 26,
    fontWeight: '800',
    color: C.success,
    fontFamily: FONT.mono,
  },
  heroTitle: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '700',
    color: C.fg1,
    fontFamily: FONT.sans,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  heroSub: {
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
  },
  statusRow: {
    marginTop: 14,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: C.bg0,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 6,
  },
  regList: {
    gap: 8,
  },
  regRow: {
    padding: 12,
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  primaryBtn: {
    marginTop: 18,
    width: '100%',
    paddingVertical: 14,
    backgroundColor: C.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
});
