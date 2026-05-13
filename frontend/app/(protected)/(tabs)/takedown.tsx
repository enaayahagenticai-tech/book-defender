import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThreatStore } from '@/lib/store/threats';
import { SwipeableThreatCard } from '@/components/tactical/SwipeableThreatCard';
import { MonoText, ScreenHeader } from '@/components/tactical/Primitives';
import { C, FONT } from '@/constants/Theme';

const { width: SW } = Dimensions.get('window');

export default function TakedownScreen() {
  const router        = useRouter();
  const threats       = useThreatStore((s) => s.threats);
  const ignoreThreat  = useThreatStore((s) => s.ignoreThreat);
  const refreshThreats = useThreatStore((s) => s.refreshThreats);
  const loading       = useThreatStore((s) => s.loading);

  useEffect(() => { refreshThreats(); }, [refreshThreats]);

  // Right swipe = begin takedown flow (navigate to evidence)
  const handlePurge = (id: string) => router.push(`/evidence?threatId=${id}` as never);
  // Left swipe = ignore (mark in DB, remove from queue)
  const handleIgnore = (id: string) => ignoreThreat(id);

  const queue = threats.filter((t) => t.status === 'active' || t.status === 'pending');
  const queueLabel = `${queue.length > 0 ? 1 : 0}/${queue.length}`;

  if (loading && queue.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={C.primary} />
        <MonoText size={10} color={C.fg3} style={{ marginTop: 12, letterSpacing: 2 }}>
          LOADING INTEL…
        </MonoText>
      </View>
    );
  }

  if (queue.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.clearGlyph}>✓</Text>
        <MonoText size={18} weight="700" color={C.success} style={{ letterSpacing: 3, marginTop: 12 }}>
          ALL CLEAR
        </MonoText>
        <MonoText size={11} color={C.fg3} style={{ marginTop: 8, textAlign: 'center', letterSpacing: 1 }}>
          No active threats in queue.
        </MonoText>
      </View>
    );
  }

  // Render back-to-front so top card sits last (highest z-index)
  const stack = queue.slice(0, 3);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        subtitle="QUEUE · PENDING"
        title="Triage"
        right={
          <MonoText size={11} color={C.fg3} style={{ letterSpacing: 3 }}>
            {queueLabel}
          </MonoText>
        }
      />

      {/* Card stack */}
      <View style={styles.stackArea}>
        {/* Back card */}
        {stack.length >= 3 && (
          <View style={[styles.cardSlot, styles.backCard]}>
            <FaintCard />
          </View>
        )}
        {/* Middle card */}
        {stack.length >= 2 && (
          <View style={[styles.cardSlot, styles.midCard]}>
            <FaintCard />
          </View>
        )}
        {/* Top card — swipeable */}
        <View style={[styles.cardSlot, styles.topCard]}>
          <SwipeableThreatCard
            threat={stack[0]}
            onSwipeRight={handlePurge}
            onSwipeLeft={handleIgnore}
            enabled
            queueLabel={queueLabel}
          />
        </View>
      </View>

      {/* Action row */}
      <View style={styles.actionRow}>
        {/* IGNORE */}
        <TouchableOpacity
          onPress={() => handleIgnore(stack[0].id)}
          style={[styles.circleBtn, styles.ignoreBtn]}
          activeOpacity={0.7}
        >
          <Text style={[styles.circleBtnGlyph, { color: C.destructive }]}>✕</Text>
        </TouchableOpacity>

        {/* Biometric verify (center) */}
        <View style={styles.verifyWrap}>
          <MonoText size={9} color={C.fg3} style={{ letterSpacing: 3, marginBottom: 4 }}>
            VERIFY
          </MonoText>
          <TouchableOpacity style={[styles.circleBtn, styles.verifyBtn]} activeOpacity={0.7}>
            <Text style={[styles.circleBtnGlyph, { color: C.primary, fontSize: 20 }]}>◉</Text>
          </TouchableOpacity>
        </View>

        {/* PURGE */}
        <TouchableOpacity
          onPress={() => handlePurge(stack[0].id)}
          style={[styles.circleBtn, styles.purgeBtn]}
          activeOpacity={0.7}
        >
          <Text style={[styles.circleBtnGlyph, { color: C.success }]}>✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FaintCard() {
  return (
    <View style={styles.faintCard} />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg0,
  },
  center: {
    flex: 1,
    backgroundColor: C.bg0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  clearGlyph: {
    fontSize: 64,
    color: C.success,
    fontFamily: FONT.mono,
    fontWeight: '700',
  },
  stackArea: {
    position: 'relative',
    marginHorizontal: 18,
    marginTop: 24,
    height: 460,
  },
  cardSlot: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  backCard: {
    top: 24,
    transform: [{ scaleX: 0.92 }, { scaleY: 0.92 }],
    opacity: 0.5,
    zIndex: 1,
  },
  midCard: {
    top: 12,
    transform: [{ scaleX: 0.96 }, { scaleY: 0.96 }],
    opacity: 0.85,
    zIndex: 2,
  },
  topCard: {
    top: 0,
    zIndex: 3,
  },
  faintCard: {
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.line2,
    borderRadius: 12,
    height: 380,
    shadowColor: '#402616',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 4,
  },
  actionRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 96,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 24,
  },
  circleBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
    borderWidth: 1,
  },
  ignoreBtn: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(164,54,31,0.10)',
    borderColor: 'rgba(164,54,31,0.45)',
  },
  verifyWrap: {
    alignItems: 'center',
  },
  verifyBtn: {
    width: 48,
    height: 48,
    backgroundColor: C.bg2,
    borderColor: C.line2,
  },
  purgeBtn: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(107,127,74,0.10)',
    borderColor: 'rgba(107,127,74,0.45)',
  },
  circleBtnGlyph: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: FONT.mono,
  },
});
