import React from 'react';
import { View, StyleSheet } from 'react-native';
import { C } from '@/constants/Theme';
import { MonoText, Dot } from './Primitives';

interface SystemHealthProps {
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  lastScan: string;
}

export function SystemHealth({ status, uptime, lastScan }: SystemHealthProps) {
  const statusColor =
    status === 'online'   ? C.success :
    status === 'offline'  ? C.destructive :
    C.warning;

  const statusLabel = status.toUpperCase();

  return (
    <View style={styles.card}>
      {/* STATUS */}
      <View style={styles.cell}>
        <MonoText size={9} color={C.fg3} style={styles.cellLabel}>STATUS</MonoText>
        <View style={styles.statusRow}>
          <Dot color={statusColor} pulse={status === 'online'} />
          <MonoText size={13} weight="600" color={statusColor} style={{ marginLeft: 6 }}>
            {statusLabel}
          </MonoText>
        </View>
      </View>

      {/* UPTIME */}
      <View style={styles.cell}>
        <MonoText size={9} color={C.fg3} style={styles.cellLabel}>UPTIME</MonoText>
        <MonoText size={13} weight="600" color={C.fg1} style={{ marginTop: 4 }}>
          {uptime}
        </MonoText>
      </View>

      {/* LAST SCAN */}
      <View style={styles.cell}>
        <MonoText size={9} color={C.fg3} style={styles.cellLabel}>LAST SCAN</MonoText>
        <MonoText size={13} weight="600" color={C.primary} style={{ marginTop: 4 }}>
          {lastScan}
        </MonoText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
  },
  cell: {
    flex: 1,
  },
  cellLabel: {
    letterSpacing: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});
