// Shared design primitives for BookSentinel UI
// Matches the Journey design system exactly.

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { C, FONT, riskColor } from '@/constants/Theme';

// ─── Eyebrow (mono uppercase label) ─────────────────────────────────────────
interface EyebrowProps {
  children: string;
  color?: string;
  style?: StyleProp<TextStyle>;
}
export function Eyebrow({ children, color = C.fg3, style }: EyebrowProps) {
  return (
    <Text style={[styles.eyebrow, { color }, style]}>
      {children}
    </Text>
  );
}

// ─── MonoText ────────────────────────────────────────────────────────────────
interface MonoTextProps {
  children: React.ReactNode;
  size?: number;
  weight?: TextStyle['fontWeight'];
  color?: string;
  style?: StyleProp<TextStyle>;
}
export function MonoText({ children, size = 12, weight = '400', color = C.fg1, style }: MonoTextProps) {
  return (
    <Text style={[{ fontFamily: FONT.mono, fontSize: size, fontWeight: weight, color }, style]}>
      {children}
    </Text>
  );
}

// ─── Four corner brackets ────────────────────────────────────────────────────
interface FourCornersProps {
  color?: string;
  size?: number;
}
export function FourCorners({ color = C.primary, size = 8 }: FourCornersProps) {
  const w = size;
  const base: ViewStyle = { position: 'absolute', width: w, height: w };
  return (
    <>
      <View style={[base, { top: -1, left: -1, borderTopWidth: 1, borderLeftWidth: 1, borderColor: color }]} />
      <View style={[base, { top: -1, right: -1, borderTopWidth: 1, borderRightWidth: 1, borderColor: color }]} />
      <View style={[base, { bottom: -1, left: -1, borderBottomWidth: 1, borderLeftWidth: 1, borderColor: color }]} />
      <View style={[base, { bottom: -1, right: -1, borderBottomWidth: 1, borderRightWidth: 1, borderColor: color }]} />
    </>
  );
}

// ─── Pulsing dot ─────────────────────────────────────────────────────────────
interface DotProps {
  color: string;
  size?: number;
  pulse?: boolean;
}
export function Dot({ color, size = 6, pulse = false }: DotProps) {
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulse) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.35, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: pulse ? anim : 1,
      }}
    />
  );
}

// ─── Risk bar ────────────────────────────────────────────────────────────────
interface RiskBarProps {
  value: number;   // 0–100
  height?: number;
}
export function RiskBar({ value, height = 4 }: RiskBarProps) {
  const color = riskColor(value);
  return (
    <View style={{ height, borderRadius: 99, backgroundColor: 'rgba(64,38,22,0.10)', overflow: 'hidden' }}>
      <View style={{ width: `${value}%`, height: '100%', backgroundColor: color }} />
    </View>
  );
}

// ─── Screen header ───────────────────────────────────────────────────────────
interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}
export function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <View>
        {subtitle ? <Eyebrow>{subtitle}</Eyebrow> : null}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

// ─── Pill badge / tag ────────────────────────────────────────────────────────
interface TagProps {
  label: string;
  color?: string;
}
export function Tag({ label, color = C.fg2 }: TagProps) {
  return (
    <View style={[styles.tag, { borderColor: C.line2 }]}>
      <MonoText size={9} color={color} style={{ letterSpacing: 2 }}>{label}</MonoText>
    </View>
  );
}

// ─── Primary button ──────────────────────────────────────────────────────────
import { TouchableOpacity } from 'react-native';
interface PrimaryBtnProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}
export function PrimaryBtn({ label, onPress, disabled }: PrimaryBtnProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.primaryBtn, disabled && { opacity: 0.6 }]}
      activeOpacity={0.8}
    >
      <MonoText size={12} weight="700" color="#FFF8EC" style={{ letterSpacing: 3.5 }}>
        {label}
      </MonoText>
    </TouchableOpacity>
  );
}

// ─── Ghost button ────────────────────────────────────────────────────────────
interface GhostBtnProps {
  label: string;
  onPress?: () => void;
}
export function GhostBtn({ label, onPress }: GhostBtnProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.ghostBtn}
      activeOpacity={0.7}
    >
      <MonoText size={12} color={C.fg2} style={{ letterSpacing: 3.5 }}>
        {label}
      </MonoText>
    </TouchableOpacity>
  );
}

// ─── KV field ────────────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  value: string;
}
export function Field({ label, value }: FieldProps) {
  return (
    <View>
      <MonoText size={9} color={C.fg3} style={{ letterSpacing: 3.5 }}>{label}</MonoText>
      <MonoText size={12} color={C.fg1} weight="500" style={{ marginTop: 2 }}>{value}</MonoText>
    </View>
  );
}

// ─── Section group ───────────────────────────────────────────────────────────
interface SectionProps {
  title: string;
  children: React.ReactNode;
}
export function Section({ title, children }: SectionProps) {
  return (
    <View style={{ marginTop: 18 }}>
      <MonoText size={10} color={C.fg2} weight="700" style={{ letterSpacing: 3.5, marginBottom: 8 }}>
        {title}
      </MonoText>
      {children}
    </View>
  );
}

// ─── Status row ──────────────────────────────────────────────────────────────
const statusMap = {
  active:   { color: '#A4361F', label: 'ACTIVE' },
  pending:  { color: '#C8841C', label: 'PENDING' },
  resolved: { color: '#6B7F4A', label: 'RESOLVED' },
  ignored:  { color: '#8B7355', label: 'IGNORED' },
} as const;

interface StatusBadgeProps {
  status: keyof typeof statusMap;
}
export function StatusBadge({ status }: StatusBadgeProps) {
  const s = statusMap[status] ?? statusMap.active;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Dot color={s.color} />
      <MonoText size={9} color={s.color} weight="700" style={{ letterSpacing: 3 }}>
        {s.label}
      </MonoText>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: 3.5,
    textTransform: 'uppercase',
  },
  headerRow: {
    paddingHorizontal: 18,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerTitle: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: '700',
    color: C.fg1,
    letterSpacing: -0.5,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 4,
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: C.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtn: {
    width: '100%',
    paddingVertical: 13,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
