import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LiveIntelSocket, LogEntry } from '@/lib/api/websocket';

export function LiveLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const socket = LiveIntelSocket.getInstance();

    // Connect (starts simulation if no URL provided)
    socket.connect();

    const unsubscribe = socket.subscribe((log) => {
        if (!isMounted.current) return;
        setLogs((prev) => [...prev.slice(-19), log]); // Keep last 20 logs
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
      // We might not want to disconnect globally if other components used it,
      // but here it's the only consumer.
      socket.disconnect();
    };
  }, []);

  return (
    <View className="bg-card/80 border border-border rounded p-4 h-48 mb-6">
      <Text className="text-muted-foreground text-xs font-bold tracking-widest mb-2 border-b border-border pb-1">
        LIVE INTEL STREAM
      </Text>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        {logs.map((log) => (
          <View key={log.id} className="flex-row mb-1">
            <Text className="text-muted-foreground font-mono text-[10px] mr-2">{log.timestamp}</Text>
            <Text className={`font-mono text-[10px] ${
                log.type === 'warn' ? 'text-warning' :
                log.type === 'success' ? 'text-success' :
                'text-foreground'
            }`}>
              {log.message}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
