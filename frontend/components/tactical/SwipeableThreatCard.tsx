import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { C, FONT, riskColor } from '@/constants/Theme';
import { MonoText, FourCorners, RiskBar, Tag } from './Primitives';
import type { Threat } from '@/lib/store/threats';

const { width: SW } = Dimensions.get('window');
const THRESHOLD = SW * 0.28;

interface Props {
  threat: Threat;
  onSwipeLeft:  (id: string) => void;
  onSwipeRight: (id: string) => void;
  enabled?: boolean;
  queueLabel?: string;   // e.g. "1/8"
}

export function SwipeableThreatCard({
  threat, onSwipeLeft, onSwipeRight, enabled = true, queueLabel,
}: Props) {
  const tx = useSharedValue(0);
  const ctx = useSharedValue(0);

  const triggerLeft  = () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);   onSwipeLeft(threat.id);  };
  const triggerRight = () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onSwipeRight(threat.id); };

  const gesture = Gesture.Pan()
    .enabled(enabled)
    .onStart(() => { ctx.value = tx.value; })
    .onUpdate((e) => { tx.value = e.translationX + ctx.value; })
    .onEnd(() => {
      if (tx.value > THRESHOLD) {
        tx.value = withSpring(SW * 1.5, { damping: 20, stiffness: 200 }, (done) => {
          if (done) runOnJS(triggerRight)();
        });
      } else if (tx.value < -THRESHOLD) {
        tx.value = withSpring(-SW * 1.5, { damping: 20, stiffness: 200 }, (done) => {
          if (done) runOnJS(triggerLeft)();
        });
      } else {
        tx.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { rotate: `${tx.value / 20}deg` },
    ],
  }));

  // PURGE stamp opacity — appears as card swipes right
  const purgeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [0, THRESHOLD * 0.6], [0, 1], Extrapolation.CLAMP),
  }));

  // IGNORE stamp opacity — appears as card swipes left
  const ignoreOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [0, -THRESHOLD * 0.6], [0, 1], Extrapolation.CLAMP),
  }));

  const accent = threat.riskScore >= 85 ? C.destructive : C.warning;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.wrapper, cardStyle]}>
        <View style={[styles.card, { borderLeftColor: accent }]}>
          <FourCorners color={C.primary} />

          {/* PURGE stamp */}
          <Animated.View style={[styles.stamp, styles.purgeStamp, purgeOpacity]}>
            <Text style={[styles.stampText, { color: C.success, borderColor: C.success }]}>
              PURGE
            </Text>
          </Animated.View>

          {/* IGNORE stamp */}
          <Animated.View style={[styles.stamp, styles.ignoreStamp, ignoreOpacity]}>
            <Text style={[styles.stampText, { color: C.fg3, borderColor: C.fg3 }]}>
              IGNORE
            </Text>
          </Animated.View>

          {/* Header */}
          <View style={styles.row}>
            <MonoText size={9} color={C.fg3} style={styles.label}>
              {threat.id.slice(0, 8).toUpperCase()} · PIRATED PDF
            </MonoText>
            <MonoText size={10} weight="700" color={accent} style={styles.label}>
              ⚠ {threat.riskScore}
            </MonoText>
          </View>

          {/* Vector */}
          <View style={{ marginTop: 18 }}>
            <MonoText size={9} color={C.fg3} style={styles.label}>TARGET VECTOR</MonoText>
            <MonoText size={15} weight="700" color={C.fg1} style={styles.domain}>
              {threat.domain}
            </MonoText>
          </View>

          {/* Fields */}
          <View style={styles.fields}>
            <View style={{ flex: 1 }}>
              <MonoText size={9} color={C.fg3} style={styles.label}>RISK</MonoText>
              <MonoText size={12} weight="500" color={C.fg1} style={{ marginTop: 2 }}>
                {threat.riskScore}/100
              </MonoText>
            </View>
            <View style={{ flex: 1 }}>
              <MonoText size={9} color={C.fg3} style={styles.label}>STATUS</MonoText>
              <MonoText size={12} weight="500" color={accent} style={{ marginTop: 2 }}>
                {threat.status.toUpperCase()}
              </MonoText>
            </View>
          </View>

          {/* Confidence bar */}
          <View style={{ marginTop: 14 }}>
            <MonoText size={9} color={C.fg3} style={[styles.label, { marginBottom: 4 }]}>
              CONFIDENCE
            </MonoText>
            <RiskBar value={threat.riskScore} />
            <MonoText size={10} color={C.fg2} style={[styles.label, { textAlign: 'right', marginTop: 4 }]}>
              {threat.riskScore}/100
            </MonoText>
          </View>

          {/* Tags */}
          <View style={styles.tags}>
            <Tag label="PIRATED PDF" />
            <Tag label="EU/EN" />
          </View>

          {/* Swipe hints */}
          <View style={styles.hints}>
            <MonoText size={9} color={C.fg3} style={styles.label}>← IGNORE</MonoText>
            <MonoText size={9} color={C.fg3} style={styles.label}>PURGE →</MonoText>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
  },
  card: {
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.line2,
    borderRadius: 12,
    borderLeftWidth: 3,
    padding: 18,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#402616',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    letterSpacing: 2,
  },
  domain: {
    marginTop: 4,
  },
  fields: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  hints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: C.line,
  },
  stamp: {
    position: 'absolute',
    top: 20,
    zIndex: 10,
  },
  purgeStamp: {
    right: 18,
    transform: [{ rotate: '12deg' }],
  },
  ignoreStamp: {
    left: 18,
    transform: [{ rotate: '-12deg' }],
  },
  stampText: {
    fontFamily: FONT.mono,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 2.5,
    borderRadius: 4,
    backgroundColor: 'rgba(255,253,247,0.8)',
  },
});
