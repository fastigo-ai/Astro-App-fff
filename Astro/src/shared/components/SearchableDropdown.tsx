import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, TextInput, SafeAreaView, Platform } from 'react-native';

interface SearchableDropdownProps {
  label: string;
  data: string[];
  value: string;
  onSelect: (item: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label, data, value, onSelect, placeholder = 'Select...', disabled = false
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [data, searchQuery]);

  const handleSelect = (item: string) => {
    onSelect(item);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={[styles.inputButton, disabled && styles.disabled]} 
        onPress={() => !disabled && setModalVisible(true)}
      >
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={false} onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select {label}</Text>
            <View style={{ width: 40 }} />
          </View>
          
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${label}...`}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>

          <FlatList
            data={filteredData}
            keyExtractor={item => item}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.listItem} onPress={() => handleSelect(item)}>
                <Text style={[styles.listItemText, value === item && styles.listItemSelected]}>{item}</Text>
                {value === item && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No results found.</Text>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: { fontWeight: '600', fontSize: 14, color: '#374151' },
  inputButton: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB',
    height: 54, borderRadius: 12, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  disabled: { backgroundColor: '#F3F4F6', opacity: 0.7 },
  inputText: { fontSize: 16, color: '#111827' },
  placeholderText: { color: '#9CA3AF' },
  chevron: { fontSize: 12, color: '#6B7280' },
  
  modalContainer: { flex: 1, backgroundColor: '#FAFAFA' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 20 : 10, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  closeBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  closeIcon: { fontSize: 20, color: '#374151' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', margin: 16, borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E7EB', height: 50 },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#111827' },
  
  listItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 20, backgroundColor: '#FFFFFF' },
  listItemText: { fontSize: 16, color: '#374151' },
  listItemSelected: { fontWeight: '700', color: '#4F46E5' },
  checkIcon: { fontSize: 16, color: '#4F46E5', fontWeight: 'bold' },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 20 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#6B7280', fontSize: 15 }
});
