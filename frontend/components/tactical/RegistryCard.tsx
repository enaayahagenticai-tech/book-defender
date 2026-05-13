import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MonoText, RiskBar, Dot } from './Primitives';
import { C, riskColor } from '@/constants/Theme';
import type { RegistryEntry } from '@/lib/store/registry';

const STATUS_MAP = {
  active:    { color: C.destructive, label: 'ACTIVE' },
  monitored: { color: C.warning,     label: 'MONITORED' },
  resolved:  { color: C.success,     label: 'RESOLVED' },
} as const;

export function RegistryCard({ id, domain, status, riskScore, tags }: RegistryEntry) {
  const s = STATUS_MAP[status as keyof typeof STATUS_MAP] ?? STATUS_MAP.monitored;
  const accent = riskColor(riskScore);

  return (
    <View style={[styles.card, { borderLeftColor: accent }]}>
      {/* Header row */}
      <View style={styles.rowBetween}>
        <MonoText size={9} color={C.fg3} style={styles.label}>{id}</MonoText>
        <View style={styles.statusRow}>
          <Dot color={s.color} />
          <MonoText size={9} weight="700" color={s.color} style={styles.label}>{s.label}</MonoText>
        </View>
      </View>

      {/* Domain */}
      <MonoText size={12} weight="600" color={C.fg1} style={{ marginTop: 4 }}>
        {domain}
      </MonoText>

      {/* Risk bar */}
      <View style={{ marginTop: 6 }}>
        <RiskBar value={riskScore} />
      </View>

      {/* Tags */}
      {tags.length > 0 && (
        <View style={styles.tagRow}>
          {tags.slice(0, 4).map((tag) => (
            <View key={tag} style={styles.tag}>
              <MonoText size={9} color={C.fg2} style={{ letterSpacing: 1.5 }}>
                {tag.toUpperCase()}
              </MonoText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.line,
    borderLeftWidth: 3,
    borderRadius: 8,
  },
  label: {
    letterSpacing: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: C.line2,
    borderRadius: 4,
  },
});
