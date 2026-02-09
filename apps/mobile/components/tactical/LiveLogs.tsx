import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

const SAMPLE_LOGS: string[] = [
  'Scanning port 443...',
  'Handshake established.',
  'Cert validation: OK',
  'Analyzing packet headers...',
  'Traffic anomaly detected.',
  'Heuristic analysis complete.',
  'Cross-referencing database...',
  'Signature match verified.',
  'Uplink stable.',
  'Encrypting payload...',
  'Data packet sent.',
  'Latency: 24ms',
];

export function LiveLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    // Initial logs
    const initialLogs = Array.from({ length: 3 }).map(() => generateLog());
    setLogs(initialLogs);

    const interval = setInterval(() => {
      if (!isMounted.current) return;

      const newLog = generateLog();
      setLogs((prev) => [...prev.slice(-19), newLog]); // Keep last 20 logs
    }, 2000);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, []);

  const generateLog = (): LogEntry => {
    const message = SAMPLE_LOGS[Math.floor(Math.random() * SAMPLE_LOGS.length)];
    const type = message.includes('anomaly') ? 'warn' : message.includes('verified') ? 'success' : 'info';
    return {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message,
      type
    };
  };

  return (
    <View className="bg-gray-900/80 border border-gray-800 rounded p-4 h-48 mb-6">
      <Text className="text-gray-500 text-xs font-bold tracking-widest mb-2 border-b border-gray-700 pb-1">
        LIVE INTEL STREAM
      </Text>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        {logs.map((log) => (
          <View key={log.id} className="flex-row mb-1">
            <Text className="text-gray-600 font-mono text-[10px] mr-2">{log.timestamp}</Text>
            <Text className={`font-mono text-[10px] ${
                log.type === 'warn' ? 'text-yellow-500' :
                log.type === 'success' ? 'text-emerald-500' :
                'text-gray-300'
            }`}>
              {log.message}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
