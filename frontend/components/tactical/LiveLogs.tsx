import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { C, FONT } from '@/constants/Theme';
import { MonoText, Dot } from './Primitives';
import { LiveIntelSocket, LogEntry } from '@/lib/api/websocket';

export function LiveLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const socket = LiveIntelSocket.getInstance();
    socket.connect();
    const unsub = socket.subscribe((log) => {
      if (!isMounted.current) return;
      setLogs((prev) => [...prev.slice(-19), log]);
    });
    return () => {
      isMounted.current = false;
      unsub();
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <MonoText size={10} color={C.fg3} style={styles.headerLabel}>LIVE INTEL STREAM</MonoText>
        <View style={styles.recRow}>
          <Dot color={C.success} pulse />
          <MonoText size={10} weight="700" color={C.success} style={styles.recLabel}>REC</MonoText>
        </View>
      </View>

      {/* Log lines */}
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        {logs.map((log) => (
          <View key={log.id} style={styles.logRow}>
            <Text style={styles.ts}>{log.timestamp}</Text>
            <Text style={[
              styles.msg,
              log.type === 'warn'    ? { color: C.warning }    :
              log.type === 'success' ? { color: C.success }    :
              { color: C.fg1 },
            ]}>
              {log.message}
            </Text>
          </View>
        ))}
        {logs.length === 0 && (
          <MonoText size={10} color={C.fg4} style={{ fontStyle: 'italic' }}>
            Awaiting signal…
          </MonoText>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 8,
    padding: 14,
    height: 160,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerLabel: {
    letterSpacing: 2,
  },
  recRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recLabel: {
    letterSpacing: 2,
  },
  scroll: {
    flex: 1,
  },
  logRow: {
    flexDirection: 'row',
    marginBottom: 3,
    gap: 8,
  },
  ts: {
    fontFamily: FONT.mono,
    fontSize: 10,
    color: C.fg3,
    flexShrink: 0,
  },
  msg: {
    fontFamily: FONT.mono,
    fontSize: 10,
    flex: 1,
    flexWrap: 'wrap',
  },
});
