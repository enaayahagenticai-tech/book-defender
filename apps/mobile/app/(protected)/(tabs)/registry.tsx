import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { useRegistryStore } from '@/lib/store/registry';
import { RegistryCard } from '@/components/tactical/RegistryCard';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';

export default function RegistryScreen() {
  const entries = useRegistryStore((state) => state.entries);
  const fetchEntries = useRegistryStore((state) => state.fetchEntries);
  const loading = useRegistryStore((state) => state.loading);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchEntries();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  }, [fetchEntries]);

  const filteredEntries = useMemo(() => {
    if (!searchQuery) return entries;
    const lowerQuery = searchQuery.toLowerCase();
    return entries.filter(entry =>
      entry.domain.toLowerCase().includes(lowerQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [entries, searchQuery]);

  return (
    <View className="flex-1 bg-background p-4">
      <View className="mb-4 flex-row items-center border-b border-border pb-2">
        <FontAwesome name="search" size={20} color="#64748b" style={{ marginRight: 10 }} />
        <TextInput
            className="flex-1 text-foreground font-mono h-10 placeholder:text-muted-foreground"
            placeholder="SEARCH REGISTRY..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
                <FontAwesome name="times-circle" size={20} color="#64748b" />
            </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading || refreshing} onRefresh={onRefresh} tintColor={colorScheme === 'dark' ? '#fff' : '#000'} />}
        renderItem={({ item }) => (
            <View className="mb-4">
                <RegistryCard {...item} />
            </View>
        )}
        ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
                <Text className="text-muted-foreground font-mono">NO ENTRIES FOUND</Text>
            </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
