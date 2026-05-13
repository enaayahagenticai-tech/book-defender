import React from 'react';
import { View, StyleSheet } from 'react-native';
import { C, riskColor } from '@/constants/Theme';
import { MonoText, FourCorners, RiskBar, Tag } from './Primitives';
import type { Threat } from '@/lib/store/threats';

interface ThreatCardProps extends Threat {
  caseId?: string;
}

export function ThreatCard({ id, domain, riskScore, status, caseId }: ThreatCardProps) {
  const accent = riskScore >= 85 ? C.destructive : C.warning;
  const isActive = status === 'active';

  return (
    <View style={[styles.card, { borderLeftColor: accent }]}>
      <FourCorners color={C.primary} />

      {/* Header row */}
      <View style={styles.row}>
        <MonoText size={10} color={C.fg3} style={styles.label}>
          {caseId ?? id.slice(0, 8).toUpperCase()} · PIRATED PDF
        </MonoText>
        <MonoText size={10} weight="700" color={accent} style={styles.label}>
          {isActive ? '⚠ ' : ''}RISK {riskScore}
        </MonoText>
      </View>

      {/* Domain */}
      <MonoText size={13} weight="600" color={C.fg1} style={styles.domain}>
        {domain}
      </MonoText>

      {/* Risk bar */}
      <View style={styles.barWrap}>
        <RiskBar value={riskScore} />
      </View>

      {/* Tags */}
      <View style={styles.tags}>
        <Tag label="PIRATED PDF" />
        <Tag label={status.toUpperCase()} color={riskColor(riskScore)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 8,
    borderLeftWidth: 3,
    position: 'relative',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    letterSpacing: 2,
  },
  domain: {
    marginTop: 4,
  },
  barWrap: {
    marginTop: 8,
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    flexWrap: 'wrap',
  },
});
