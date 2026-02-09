import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useRegistryStore } from '@/lib/store/registry';
import { RegistryCard } from '@/components/tactical/RegistryCard';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function RegistryScreen() {
  const entries = useRegistryStore((state) => state.entries);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    if (!searchQuery) return entries;
    const lowerQuery = searchQuery.toLowerCase();
    return entries.filter(entry =>
      entry.domain.toLowerCase().includes(lowerQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [entries, searchQuery]);

  return (
    <View className="flex-1 bg-black p-4">
      <View className="mb-4 flex-row items-center border-b border-gray-700 pb-2">
        <FontAwesome name="search" size={20} color="#666" style={{ marginRight: 10 }} />
        <TextInput
            className="flex-1 text-white font-mono h-10"
            placeholder="SEARCH REGISTRY..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
                <FontAwesome name="times-circle" size={20} color="#666" />
            </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View className="mb-4">
                <RegistryCard {...item} />
            </View>
        )}
        ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
                <Text className="text-gray-500 font-mono">NO ENTRIES FOUND</Text>
            </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
