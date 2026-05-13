import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThreatStore } from '@/lib/store/threats';
import { MonoText, FourCorners, RiskBar, ScreenHeader, Tag } from '@/components/tactical/Primitives';
import { C, FONT, riskColor } from '@/constants/Theme';

function relativeTime(iso?: string): string {
  if (!iso) return 'UNKNOWN';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ThreatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const threats = useThreatStore((s) => s.threats);
  const resolveThreat = useThreatStore((s) => s.resolveThreat);
  const ignoreThreat  = useThreatStore((s) => s.ignoreThreat);

  const threat = threats.find((t) => t.id === id);

  if (!threat) {
    return (
      <View style={styles.center}>
        <MonoText size={12} color={C.fg3} style={{ letterSpacing: 2 }}>THREAT NOT FOUND</MonoText>
      </View>
    );
  }

  const accent = riskColor(threat.riskScore);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        subtitle={`${threat.id.toUpperCase()} · INSPECTION`}
        title="Threat Detail"
        right={
          <TouchableOpacity onPress={() => router.back()}>
            <MonoText size={11} color={C.fg3} style={{ letterSpacing: 3 }}>← BACK</MonoText>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero summary */}
        <View style={[styles.heroCard, { borderLeftColor: accent }]}>
          <FourCorners color={C.destructive} />
          <View style={styles.rowBetween}>
            <MonoText size={10} color={C.fg3} style={styles.label}>
              {(threat.threatType ?? 'PIRATED PDF').toUpperCase()} · {threat.mirrorCount ?? 0} MIRRORS
            </MonoText>
            <MonoText size={11} weight="700" color={accent} style={styles.label}>
              ⚠ RISK {threat.riskScore}
            </MonoText>
          </View>
          <MonoText size={16} weight="700" color={C.fg1} style={styles.domainHero}>
            {threat.domain}
          </MonoText>
          <View style={{ marginTop: 10 }}>
            <RiskBar value={threat.riskScore} />
          </View>
          <View style={styles.fieldGrid}>
            <FieldCell label="HOST"       value={threat.host ?? 'UNKNOWN'} />
            <FieldCell label="REGISTRAR"  value={threat.registrar ?? 'UNKNOWN'} />
            <FieldCell label="FIRST SEEN" value={relativeTime(threat.firstSeen)} />
            <FieldCell label="MIRRORS"    value={threat.mirrorCount != null ? `${threat.mirrorCount} detected` : 'UNKNOWN'} />
          </View>
        </View>

        {/* Matched book */}
        {(threat.bookTitle || threat.bookAuthor) && (
          <SectionBlock title="MATCHED BOOK">
            <View style={styles.bookRow}>
              <View style={styles.bookCover}>
                <MonoText size={6} weight="700" color="#E8DCC4" style={{ letterSpacing: 2, textAlign: 'center' }}>
                  {(threat.bookTitle ?? '').split(' ')[0]?.toUpperCase() ?? ''}
                </MonoText>
                <View>
                  {(threat.bookTitle ?? '').split(' ').slice(1).map((word, i) => (
                    <MonoText key={i} size={7} color="#E8DCC4" style={{ textAlign: 'center' }}>{word.toUpperCase()}</MonoText>
                  ))}
                </View>
                <MonoText size={5} color="rgba(232,220,196,0.7)" style={{ letterSpacing: 2, textAlign: 'center' }}>
                  {(threat.bookAuthor ?? '').toUpperCase()}
                </MonoText>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bookTitle}>{threat.bookTitle ?? 'Unknown Title'}</Text>
                <MonoText size={11} color={C.fg2} style={{ marginTop: 2 }}>
                  {threat.bookAuthor ?? 'Unknown Author'}
                </MonoText>
                {threat.fingerprint && (
                  <MonoText size={11} color={C.fg3} style={{ marginTop: 8, letterSpacing: 1 }}>
                    {'Fingerprint: '}
                    <Text style={{ color: C.fg1, fontWeight: '600' }}>{threat.fingerprint}</Text>
                  </MonoText>
                )}
                {threat.matchPercentage != null && (
                  <MonoText size={11} color={C.fg3} style={{ marginTop: 2, letterSpacing: 1 }}>
                    {'Content match: '}
                    <Text style={{ color: C.success, fontWeight: '700' }}>{threat.matchPercentage.toFixed(1)}%</Text>
                  </MonoText>
                )}
              </View>
            </View>
          </SectionBlock>
        )}

        {/* Gemini analysis */}
        {(threat.analysisText || (threat.tags && threat.tags.length > 0)) && (
          <SectionBlock title="GEMINI · TRIAGE">
            <View style={styles.analysisCard}>
              {threat.analysisText && (
                <MonoText size={11} color={C.fg1} style={{ lineHeight: 18 }}>
                  {threat.analysisText}
                </MonoText>
              )}
              {threat.tags && threat.tags.length > 0 && (
                <View style={styles.tags}>
                  {threat.tags.map((t) => (
                    <Tag key={t} label={t.toUpperCase()} />
                  ))}
                </View>
              )}
            </View>
          </SectionBlock>
        )}

        {/* CTAs */}
        <View style={styles.ctaBlock}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push(`/evidence?threatId=${threat.id}` as never)}
            activeOpacity={0.8}
          >
            <MonoText size={12} weight="700" color="#FFF8EC" style={{ letterSpacing: 3.5 }}>
              BEGIN TAKEDOWN →
            </MonoText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={() => { ignoreThreat(threat.id); router.back(); }}
            activeOpacity={0.8}
          >
            <MonoText size={12} color={C.fg2} style={{ letterSpacing: 3 }}>
              MARK FALSE POSITIVE
            </MonoText>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

function FieldCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <MonoText size={9} color={C.fg3} style={styles.label}>{label}</MonoText>
      <MonoText size={12} weight="500" color={C.fg1} style={{ marginTop: 2 }}>{value}</MonoText>
    </View>
  );
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <MonoText size={10} weight="700" color={C.fg2} style={[styles.label, { marginBottom: 8 }]}>
        {title}
      </MonoText>
      {children}
    </View>
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
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  label: {
    letterSpacing: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroCard: {
    padding: 16,
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.line2,
    borderLeftWidth: 3,
    borderRadius: 8,
    position: 'relative',
  },
  domainHero: {
    marginTop: 8,
  },
  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  section: {
    marginTop: 18,
  },
  bookRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bookCover: {
    width: 64,
    height: 92,
    backgroundColor: '#2A1810',
    borderRadius: 3,
    padding: 6,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.fg1,
    fontFamily: FONT.sans,
  },
  analysisCard: {
    padding: 12,
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  ctaBlock: {
    marginTop: 18,
    gap: 8,
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: C.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  ghostBtn: {
    width: '100%',
    paddingVertical: 13,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: C.line2,
    borderRadius: 8,
    alignItems: 'center',
  },
});
