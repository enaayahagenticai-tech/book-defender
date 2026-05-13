import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, RefreshControl,
  TouchableOpacity, ActivityIndicator, StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { C, FONT, riskColor } from '@/constants/Theme';
import { MonoText, Dot, RiskBar, FourCorners, Eyebrow, PrimaryBtn } from './Primitives';
import { SystemHealth } from './SystemHealth';
import { LiveLogs } from './LiveLogs';
import { useThreatStore } from '@/lib/store/threats';
import { deployScoutAgent } from '@/lib/api/scan';
import type { Threat } from '@/lib/store/threats';

export function HUD() {
  const [refreshing, setRefreshing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState('12s ago');
  const threats = useThreatStore((s) => s.threats);
  const refreshThreats = useThreatStore((s) => s.refreshThreats);
  const subscribeRealtime = useThreatStore((s) => s.subscribeRealtime);
  const loading = useThreatStore((s) => s.loading);
  const isMounted = useRef(true);
  const router = useRouter();

  useEffect(() => {
    refreshThreats();
    const unsub = subscribeRealtime();
    return () => { isMounted.current = false; unsub(); };
  }, [refreshThreats, subscribeRealtime]);

  const activeThreats = threats.filter((t) => t.status === 'active' || t.status === 'pending');
  const purgedCount  = threats.filter((t) => t.status === 'resolved').length;
  const pendingCount = threats.filter((t) => t.status === 'pending').length;

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshThreats();
    if (isMounted.current) setRefreshing(false);
  };

  const handleScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    try {
      await deployScoutAgent();
      if (isMounted.current) setLastScanTime('Just now');
    } catch (_) {
      // scan failed — surface via toast in real impl
    } finally {
      if (isMounted.current) setIsScanning(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || loading}
          onRefresh={onRefresh}
          tintColor={C.primary}
          colors={[C.primary]}
        />
      }
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Eyebrow color={C.fg3}>MISSION · 24H · NORTH-AM</Eyebrow>
          <Text style={styles.title}>Command Center</Text>
        </View>
        <View style={styles.livePill}>
          <Dot color={C.success} pulse />
          <MonoText size={9} color={C.fg2} style={styles.liveLabel}>LIVE</MonoText>
        </View>
      </View>

      {/* ── System health ── */}
      <SystemHealth status="online" uptime="312d 04h" lastScan={lastScanTime} />

      {/* ── KPI tiles ── */}
      <View style={styles.kpiRow}>
        <KpiTile label="ACTIVE"  value={activeThreats.length} color={C.destructive} />
        <KpiTile label="PENDING" value={pendingCount}          color={C.warning} />
        <KpiTile label="PURGED"  value={purgedCount}           color={C.success} />
      </View>

      {/* ── Deploy scout ── */}
      <TouchableOpacity
        onPress={handleScan}
        disabled={isScanning}
        style={[styles.scanBtn, isScanning && { opacity: 0.7 }]}
        activeOpacity={0.8}
      >
        {isScanning ? (
          <View style={styles.scanningRow}>
            <ActivityIndicator color="#FFF8EC" size="small" />
            <MonoText size={12} weight="700" color="#FFF8EC" style={styles.scanLabel}>
              SCANNING SECTOR…
            </MonoText>
          </View>
        ) : (
          <MonoText size={12} weight="700" color="#FFF8EC" style={styles.scanLabel}>
            ⚡ DEPLOY SCOUT AGENT
          </MonoText>
        )}
      </TouchableOpacity>

      {/* ── Live intel ── */}
      <LiveLogs />

      {/* ── Threats list ── */}
      <View style={styles.threatHeader}>
        <MonoText size={10} weight="700" color={C.fg2} style={styles.label}>
          ACTIVE THREATS · {activeThreats.length} SHOWN
        </MonoText>
        <MonoText size={10} color={C.primary} style={styles.label}>VIEW ALL →</MonoText>
      </View>

      {activeThreats.length === 0 ? (
        <MonoText size={11} color={C.fg3} style={{ marginTop: 12, fontStyle: 'italic' }}>
          No active threats detected.
        </MonoText>
      ) : (
        activeThreats.slice(0, 5).map((t) => (
          <TouchableOpacity
            key={t.id}
            onPress={() => router.push(`/threat/${t.id}` as never)}
            activeOpacity={0.8}
          >
            <ThreatRow threat={t} />
          </TouchableOpacity>
        ))
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// ─── KPI tile ────────────────────────────────────────────────────────────────
function KpiTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.kpiTile}>
      <MonoText size={9} color={C.fg3} style={styles.label}>{label}</MonoText>
      <Text style={[styles.kpiValue, { color }]}>{value}</Text>
    </View>
  );
}

// ─── Inline threat row ───────────────────────────────────────────────────────
function ThreatRow({ threat }: { threat: Threat }) {
  const accent = threat.riskScore >= 85 ? C.destructive : C.warning;
  return (
    <View style={[styles.threatRow, { borderLeftColor: accent }]}>
      <FourCorners color={C.primary} />
      <View style={styles.rowTop}>
        <MonoText size={10} color={C.fg3} style={styles.label}>
          {threat.id.slice(0, 6).toUpperCase()} · PIRATED PDF
        </MonoText>
        <MonoText size={10} weight="700" color={accent} style={styles.label}>
          RISK {threat.riskScore}
        </MonoText>
      </View>
      <MonoText size={13} weight="600" color={C.fg1} style={styles.domain}>
        {threat.domain}
      </MonoText>
      <View style={{ marginTop: 8 }}>
        <RiskBar value={threat.riskScore} />
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
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: '700',
    color: C.fg1,
    letterSpacing: -0.5,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: C.line2,
    borderRadius: 6,
  },
  liveLabel: {
    letterSpacing: 2,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  kpiTile: {
    flex: 1,
    padding: 12,
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 8,
  },
  kpiValue: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  scanBtn: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: C.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scanningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scanLabel: {
    letterSpacing: 3.5,
  },
  threatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
    marginTop: 4,
  },
  label: {
    letterSpacing: 2,
  },
  threatRow: {
    padding: 12,
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 8,
    borderLeftWidth: 3,
    marginBottom: 8,
    position: 'relative',
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  domain: {
    marginTop: 4,
  },
});
