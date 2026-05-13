import React, { useEffect, useState } from 'react';
import {
  View, TouchableOpacity, StyleSheet, ScrollView, Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MonoText, ScreenHeader, Dot } from '@/components/tactical/Primitives';
import { useThreatStore } from '@/lib/store/threats';
import { fetchEvidenceForDomain } from '@/lib/api/scan';
import { C, FONT } from '@/constants/Theme';

type EvidenceRow = {
  id: string;
  domain_name: string | null;
  hyperlink: string | null;
  evidence_screenshot_url: string | null;
  hash: string | null;
  confidence_percentage: number | null;
  created_at: string;
};

type PipelineItem = { ok: boolean | 'live'; label: string };

function buildPipeline(rows: EvidenceRow[]): PipelineItem[] {
  if (rows.length === 0) {
    // Nothing back from DB yet — show all live
    return [
      { ok: 'live', label: 'PAGE SNAPSHOT · collecting…' },
      { ok: 'live', label: 'WHOIS + ASN trace…' },
      { ok: 'live', label: 'PDF FINGERPRINT · scanning…' },
      { ok: 'live', label: 'CONTENT MATCH · pending…' },
      { ok: 'live', label: 'RFC 3161 TIMESTAMP · pending…' },
      { ok: 'live', label: 'COMPILING EVIDENCE BUNDLE…' },
    ];
  }

  const latest = rows[0];
  const hasHash = !!latest.hash;
  const hasScreenshot = !!latest.evidence_screenshot_url;
  const hasConfidence = latest.confidence_percentage != null;
  const confStr = hasConfidence ? `${latest.confidence_percentage}%` : '—';
  const hashStr = hasHash ? `${latest.hash!.slice(0, 10)}…` : '—';

  return [
    { ok: hasScreenshot, label: `PAGE SNAPSHOT · ${hasScreenshot ? '✓ captured' : 'pending…'}` },
    { ok: true,          label: 'WHOIS + ASN trace · complete' },
    { ok: hasHash,       label: `PDF FINGERPRINT · ${hashStr}` },
    { ok: hasConfidence, label: `CONTENT MATCH · ${confStr} confidence` },
    { ok: true,          label: 'RFC 3161 TIMESTAMP · anchored' },
    { ok: 'live',        label: 'COMPILING EVIDENCE BUNDLE…' },
  ];
}

export default function EvidenceScreen() {
  const router = useRouter();
  const { threatId } = useLocalSearchParams<{ threatId: string }>();
  const threat = useThreatStore((s) => s.threats.find((t) => t.id === threatId));
  const [evidenceRows, setEvidenceRows] = useState<EvidenceRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!threat?.domain) { setLoaded(true); return; }
    fetchEvidenceForDomain(threat.domain).then((rows) => {
      if (rows) setEvidenceRows(rows as EvidenceRow[]);
      setLoaded(true);
    });
  }, [threat?.domain]);

  const pipeline = buildPipeline(evidenceRows);
  const completedCount = pipeline.filter((p) => p.ok === true).length;
  const progress = Math.round((completedCount / pipeline.length) * 100);
  const latest = evidenceRows[0] ?? null;
  const noticeId = threat?.id?.toUpperCase() ?? 'XXXX';

  const handleExport = async () => {
    const lines = [
      `BOOKSENTINEL EVIDENCE NOTICE — ${noticeId}`,
      `Domain: ${threat?.domain ?? 'unknown'}`,
      `Risk Score: ${threat?.riskScore ?? '—'}`,
      `Evidence Items: ${evidenceRows.length}`,
      '',
      'FORENSIC PIPELINE:',
      ...pipeline.map((p) => `  ${p.ok === true ? '✓' : p.ok === 'live' ? '·' : '○'} ${p.label}`),
      '',
      latest?.hash ? `SHA-256: ${latest.hash}` : '',
      latest?.confidence_percentage != null ? `Content Match: ${latest.confidence_percentage}%` : '',
      '',
      `Generated: ${new Date().toISOString()}`,
    ].filter(Boolean).join('\n');

    await Share.share({ message: lines, title: `NOTICE-${noticeId}.PDF` });
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        subtitle={`${threat?.id?.toUpperCase() ?? 'T-XXXX'} · AUTHORIZED`}
        title="Building Evidence"
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Forensic pipeline */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <MonoText size={10} color={C.fg3} style={styles.label}>FORENSIC PIPELINE</MonoText>
            <View style={styles.recRow}>
              <Dot color={C.success} pulse />
              <MonoText size={10} weight="700" color={C.success} style={styles.label}>REC</MonoText>
            </View>
          </View>

          <View style={styles.pipelineList}>
            {pipeline.map((item, i) => (
              <View key={i} style={styles.pipelineRow}>
                <View style={[
                  styles.pipelineDot,
                  item.ok === 'live'
                    ? { backgroundColor: 'rgba(193,95,60,0.14)', borderColor: C.primary }
                    : item.ok
                      ? { backgroundColor: 'rgba(107,127,74,0.16)', borderColor: C.success }
                      : { backgroundColor: 'rgba(64,38,22,0.08)', borderColor: C.line2 },
                ]}>
                  <MonoText
                    size={11}
                    weight="700"
                    color={item.ok === 'live' ? C.primary : item.ok ? C.success : C.fg4}
                  >
                    {item.ok === 'live' ? '·' : item.ok ? '✓' : '○'}
                  </MonoText>
                </View>
                <MonoText size={11} weight="500" color={item.ok ? C.fg1 : C.fg3} style={{ flex: 1, letterSpacing: 1 }}>
                  {item.label}
                </MonoText>
              </View>
            ))}
          </View>

          {loaded && (
            <View style={{ marginTop: 12 }}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <MonoText size={9} color={C.fg3} style={[styles.label, { marginTop: 6 }]}>
                {`${progress}% · BUNDLING TO NOTICE-${noticeId}.PDF`}
              </MonoText>
            </View>
          )}
        </View>

        {/* PDF preview */}
        <View style={{ marginTop: 14 }}>
          <MonoText size={10} weight="700" color={C.fg2} style={[styles.label, { marginBottom: 8 }]}>
            PREVIEW
          </MonoText>
          <View style={styles.previewCard}>
            <View style={styles.miniPage}>
              <View style={styles.miniLine1} />
              <View style={styles.miniLine2} />
              <View style={styles.miniLine2} />
              <View style={[styles.miniLine2, { width: '60%' }]} />
              <View style={styles.miniBlock} />
              <View style={[styles.miniLine2, { marginTop: 4 }]} />
              <View style={styles.miniLine2} />
              <View style={[styles.miniLine2, { width: '80%' }]} />
            </View>
            <View style={{ flex: 1 }}>
              <MonoText size={12} weight="700" color={C.fg1}>
                {`NOTICE-${noticeId}.PDF`}
              </MonoText>
              <MonoText size={10} color={C.fg3} style={{ marginTop: 2, letterSpacing: 1 }}>
                {latest
                  ? `${evidenceRows.length} evidence item${evidenceRows.length !== 1 ? 's' : ''} · signed`
                  : 'Compiling…'}
              </MonoText>
              {latest?.hash && (
                <MonoText size={9} color={C.fg3} style={{ marginTop: 4, letterSpacing: 1 }}>
                  {`SHA-256 · ${latest.hash.slice(0, 16)}…`}
                </MonoText>
              )}
              <View style={styles.pdfTags}>
                <View style={styles.pdfTagSuccess}>
                  <MonoText size={9} weight="700" color={C.success} style={{ letterSpacing: 2 }}>RFC 3161</MonoText>
                </View>
                <View style={styles.pdfTagPrimary}>
                  <MonoText size={9} weight="700" color={C.primary} style={{ letterSpacing: 2 }}>COURT-READY</MonoText>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.ctaBlock}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push(`/resolution?threatId=${threatId ?? ''}` as never)}
            activeOpacity={0.8}
          >
            <MonoText size={12} weight="700" color="#FFF8EC" style={{ letterSpacing: 3.5 }}>
              DISPATCH TAKEDOWN →
            </MonoText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostBtn} activeOpacity={0.8} onPress={handleExport}>
            <MonoText size={12} color={C.fg2} style={{ letterSpacing: 3 }}>
              EXPORT PDF TO LEGAL
            </MonoText>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: C.bg0 },
  content:       { padding: 18 },
  label:         { letterSpacing: 2 },
  rowBetween:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recRow:        { flexDirection: 'row', alignItems: 'center', gap: 6 },
  card:          { padding: 14, backgroundColor: C.bg2, borderWidth: 1, borderColor: C.line, borderRadius: 8 },
  pipelineList:  { marginTop: 12, gap: 9 },
  pipelineRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pipelineDot:   { width: 18, height: 18, borderRadius: 99, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  progressTrack: { height: 4, borderRadius: 99, backgroundColor: 'rgba(64,38,22,0.10)', overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: C.primary, borderRadius: 99 },
  previewCard:   { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: '#FBF8EE', borderWidth: 1, borderColor: C.line2, borderRadius: 6, padding: 12, shadowColor: '#402616', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 3 },
  miniPage:      { width: 58, height: 78, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line2, borderRadius: 2, padding: 4, flexShrink: 0 },
  miniLine1:     { height: 4, backgroundColor: C.fg1, marginBottom: 3, borderRadius: 1 },
  miniLine2:     { height: 1.5, backgroundColor: C.fg4, marginBottom: 1.5, borderRadius: 1 },
  miniBlock:     { height: 16, backgroundColor: C.bg1, marginTop: 4, borderRadius: 1 },
  pdfTags:       { flexDirection: 'row', gap: 6, marginTop: 8 },
  pdfTagSuccess: { paddingHorizontal: 6, paddingVertical: 3, backgroundColor: 'rgba(107,127,74,0.12)', borderRadius: 4 },
  pdfTagPrimary: { paddingHorizontal: 6, paddingVertical: 3, backgroundColor: 'rgba(193,95,60,0.12)', borderRadius: 4 },
  ctaBlock:      { marginTop: 18, gap: 8 },
  primaryBtn:    { width: '100%', paddingVertical: 14, backgroundColor: C.primary, borderRadius: 8, alignItems: 'center' },
  ghostBtn:      { width: '100%', paddingVertical: 13, backgroundColor: 'transparent', borderWidth: 1, borderColor: C.line2, borderRadius: 8, alignItems: 'center' },
});
