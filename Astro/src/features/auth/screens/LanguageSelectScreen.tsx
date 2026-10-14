import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList, Dimensions, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { Button } from '~/shared/components/Button';
import { useAuthStore } from '~/store/useAuthStore';
import { api } from '~/shared/api';

import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<AppStackParamList, 'LanguageSelect'>;

const { width } = Dimensions.get('window');

const LANGUAGES = [
  { id: 'en', name: 'English', subtitle: 'Welcome' },
  { id: 'hi', name: 'हिन्दी', subtitle: 'स्वागत है' },
];

export const LanguageSelectScreen: React.FC<Props> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language?.startsWith('hi') ? 'hi' : 'en');
  const [isLoading, setIsLoading] = useState(false);
  const setHasLanguage = useAuthStore(state => state.setHasLanguage);

  const handleSelect = (id: string) => {
    setSelectedLang(id);
    i18n.changeLanguage(id);
    AsyncStorage.setItem('@garbhcompanion/language', id);
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('@garbhcompanion/language', selectedLang);
      i18n.changeLanguage(selectedLang);
      
      // 1. Sync choice to Backend
      try {
        await api.post('/api/v1/profile/language', { language: selectedLang });
      } catch (e) {
        console.warn('Backend language sync optional warning:', e);
      }
      
      // 2. Complete step locally
      setHasLanguage(true);
    } catch (error) {
      console.error('Failed to save language:', error);
      setHasLanguage(true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: typeof LANGUAGES[0] }) => {
    const isSelected = selectedLang === item.id;
    return (
      <TouchableOpacity 
        style={[styles.card, isSelected && styles.cardSelected]} 
        onPress={() => handleSelect(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <Text style={[styles.langText, isSelected && styles.textSelected]}>{item.name}</Text>
          <Text style={styles.subText}>{item.subtitle}</Text>
        </View>
        <View style={[styles.radio, isSelected && styles.radioSelected]}>
          {isSelected && <Text style={styles.radioCheck}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Modern Background Decor */}
      <View style={styles.bgDecorTop} pointerEvents="none" />

      <View style={styles.inner}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => useAuthStore.getState().logout()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={require('~/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{t('languageSelect.title')}</Text>

        <FlatList
          data={LANGUAGES}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />

        <Button 
          title={isLoading ? t('languageSelect.saving') : t('languageSelect.continue')} 
          onPress={handleContinue} 
          isLoading={isLoading}
          style={styles.submitBtn}
          textStyle={styles.submitBtnText}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Clean off-white background
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  bgDecorTop: {
    position: 'absolute',
    top: -width * 0.5,
    right: -width * 0.2,
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: '#EEF2FF', // Very subtle indigo tint
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  backIcon: {
    fontSize: 22,
    color: '#374151',
    marginTop: -2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 240,
    height: 100,
  },
  title: {
    fontSize: 28, 
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: (width - 56 - 16) / 2, // 2 columns, 28 padding each side, 16 gap
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  cardSelected: {
    borderColor: '#4F46E5', // Indigo
    backgroundColor: '#EEF2FF', // Very subtle indigo
    shadowColor: '#4F46E5',
    shadowOpacity: 0.05,
  },
  cardContent: {
    flex: 1,
  },
  langText: {
    fontWeight: '500',
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  textSelected: {
    fontWeight: '700',
    color: '#111827',
  },
  subText: {
    fontWeight: '500',
    fontSize: 12,
    color: '#6B7280',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#FFFFFF',
  },
  radioSelected: {
    backgroundColor: '#EC4899', // Pink accent
    borderColor: '#EC4899',
  },
  radioCheck: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#4F46E5', // Indigo primary
    borderRadius: 16,
    height: 60,
    marginTop: 10,
    marginBottom: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  submitBtnText: {
    fontWeight: '700',
    fontSize: 17,
    color: '#FFFFFF',
  },
});
