import React, { useState, useMemo, useEffect } from 'react';
import {
  View, TextInput, FlatList, TouchableOpacity, RefreshControl, StyleSheet,
} from 'react-native';
import { useRegistryStore } from '@/lib/store/registry';
import { RegistryCard } from '@/components/tactical/RegistryCard';
import { MonoText, ScreenHeader } from '@/components/tactical/Primitives';
import { C, FONT } from '@/constants/Theme';

export default function RegistryScreen() {
  const entries = useRegistryStore((s) => s.entries);
  const fetchEntries = useRegistryStore((s) => s.fetchEntries);
  const loading = useRegistryStore((s) => s.loading);
  const [query, setQuery]       = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    if (!query) return entries;
    const q = query.toLowerCase();
    return entries.filter(
      (e) => e.domain.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [entries, query]);

  return (
    <View style={styles.screen}>
      <ScreenHeader subtitle="PURGED DOMAIN LEDGER" title="Registry" />

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="SEARCH REGISTRY…"
          placeholderTextColor={C.fg4}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <MonoText size={12} color={C.fg3}>✕</MonoText>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading || refreshing}
            onRefresh={onRefresh}
            tintColor={C.primary}
            colors={[C.primary]}
          />
        }
        renderItem={({ item }) => (
          <View style={{ marginBottom: 8 }}>
            <RegistryCard {...item} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <MonoText size={11} color={C.fg3} style={{ letterSpacing: 2 }}>
              NO ENTRIES FOUND
            </MonoText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg0,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.line2,
    borderRadius: 8,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONT.mono,
    fontSize: 11,
    color: C.fg1,
    letterSpacing: 1.5,
    height: '100%',
  },
  clearBtn: {
    paddingLeft: 8,
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 100,
  },
  emptyWrap: {
    marginTop: 60,
    alignItems: 'center',
  },
});
