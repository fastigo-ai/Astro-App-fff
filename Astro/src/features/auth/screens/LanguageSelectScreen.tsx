import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList, Dimensions, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { Button } from '~/shared/components/Button';
import { useAuthStore } from '~/store/useAuthStore';

type Props = NativeStackScreenProps<AppStackParamList, 'LanguageSelect'>;

const { width } = Dimensions.get('window');

const LANGUAGES = [
  { id: 'en', name: 'English', subtitle: 'Welcome' },
  { id: 'hi', name: 'हिन्दी', subtitle: 'स्वागत है' },
  { id: 'l3', name: 'Language 3', subtitle: 'Welcome' },
  { id: 'l4', name: 'Language 4', subtitle: 'Welcome' },
  { id: 'l5', name: 'Language 5', subtitle: 'Welcome' },
  { id: 'l6', name: 'Language 6', subtitle: 'Welcome' },
  { id: 'l7', name: 'Language 7', subtitle: 'Welcome' },
  { id: 'l8', name: 'Language 8', subtitle: 'Welcome' },
  { id: 'l9', name: 'Language 9', subtitle: 'Welcome' },
  { id: 'l10', name: 'Language 10', subtitle: 'Welcome' },
];

export const LanguageSelectScreen: React.FC<Props> = ({ navigation }) => {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState('en');
  const setHasLanguage = useAuthStore(state => state.setHasLanguage);

  const handleContinue = () => {
    if (selectedLang === 'en' || selectedLang === 'hi') {
      i18n.changeLanguage(selectedLang);
    }
    setHasLanguage(true);
  };

  const renderItem = ({ item }: { item: typeof LANGUAGES[0] }) => {
    const isSelected = selectedLang === item.id;
    return (
      <TouchableOpacity 
        style={[styles.card, isSelected && styles.cardSelected]} 
        onPress={() => setSelectedLang(item.id)}
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
      {/* Decorative Bubbles */}
      <View style={[styles.bubble, styles.bubble1]} />
      <View style={[styles.bubble, styles.bubble2]} />
      <View style={[styles.bubble, styles.bubble3]} />
      <View style={[styles.bubble, styles.bubble4]} />

      <View style={styles.inner}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => useAuthStore.getState().logout()}
          >
            <Text style={styles.backIcon}>{'<'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={require('~/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Choose your preferred{'\n'}language</Text>

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
          title="Continue →" 
          onPress={handleContinue} 
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
    backgroundColor: '#FFE6DF', // Matching Peach theme
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 5,
  },
  bubble1: {
    width: 250,
    height: 250,
    top: -80,
    right: -50,
  },
  bubble2: {
    width: 200,
    height: 200,
    bottom: 50,
    right: -80,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  bubble3: {
    width: 120,
    height: 120,
    bottom: -40,
    left: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  bubble4: {
    width: 80,
    height: 80,
    top: 150,
    left: -30,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  backIcon: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
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
    fontFamily: 'serif',
    fontWeight: '600',
    fontSize: 26,
    color: '#1E90FF', // Bright blue
    textAlign: 'center',
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    width: (width - 48 - 12) / 2, // 2 columns, 24 padding each side, 12 gap
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cardSelected: {
    backgroundColor: '#FFF',
    borderColor: '#1E90FF',
  },
  cardContent: {
    flex: 1,
  },
  langText: {
    fontWeight: '500',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  textSelected: {
    fontWeight: '700',
    color: '#111',
  },
  subText: {
    fontWeight: '500',
    fontSize: 11,
    color: '#666',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#FFF',
  },
  radioSelected: {
    backgroundColor: '#1E90FF',
    borderColor: '#1E90FF',
  },
  radioCheck: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#1E90FF', // Bright blue
    borderRadius: 27,
    height: 54,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#1E90FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFF',
  },
});
