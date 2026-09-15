import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '~/store/useAuthStore';
import { Button } from '~/shared/components/Button';
import { theme } from '~/shared/theme';

export const LifeStageScreen = () => {
  const [lifeStage, setLifeStage] = useState<'pregnant' | 'planning' | 'difficulty' | null>(null);
  const [dateType, setDateType] = useState<'edd' | 'lmp'>('edd');
  const [date, setDate] = useState(new Date());
  const [dateString, setDateString] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isFirstPregnancy, setIsFirstPregnancy] = useState<boolean | null>(null);
  const [isMultiplePregnancy, setIsMultiplePregnancy] = useState<boolean | null>(null);
  
  const setHasLifeStage = useAuthStore(state => state.setHasLifeStage);
  const setHasProfile = useAuthStore(state => state.setHasProfile);

  const STAGES = [
    { id: 'pregnant', label: 'I am already Pregnant', icon: '🤰' },
    { id: 'baby', label: 'I have a Baby', subtitle: 'Child Age: 0-3 yr', icon: '👶' },
    { id: 'planning', label: 'I am planning for Pregnancy', icon: '💭' },
    { id: 'child', label: 'Women with Child', subtitle: 'Child Age: 3-30 yr\n*Get women & parenting tips', icon: '👩‍👧' },
    { id: 'unmarried', label: 'Unmarried/Newly Married', subtitle: "I don't have a child / Not planning for pregnancy", icon: '👩' },
  ];

  const handleSelectStage = (id: string) => {
    setLifeStage(id as any);
    setHasLifeStage(true, id);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      const yyyy = selectedDate.getFullYear();
      setDateString(`${mm}/${dd}/${yyyy}`);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.bubble, styles.bubble1]} />
      <View style={[styles.bubble, styles.bubble2]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setHasProfile(false)}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressInactive} />
            <View style={styles.progressActive} />
          </View>
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Choose your Life Stage:</Text>
          <Text style={styles.metricsText}>20 M+ Healthy Deliveries | Made by Top Global Experts</Text>
          <Text style={styles.subtitle}>This helps us personalize your experience with tailored wisdom and clinical guidance.</Text>
        </View>

        <View style={styles.form}>
            {STAGES.map((stage) => (
              <TouchableOpacity
                key={stage.id}
                style={styles.optionCard}
                onPress={() => handleSelectStage(stage.id)}
              >
                <View style={styles.optionIconWrapper}>
                  <Text style={styles.optionIcon}>{stage.icon}</Text>
                </View>
                <View style={styles.optionTextWrapper}>
                  <Text style={styles.optionLabel}>{stage.label}</Text>
                  {stage.subtitle && <Text style={styles.optionSubtitle}>{stage.subtitle}</Text>}
                </View>
                <View style={styles.arrowWrapper}>
                  <Text style={styles.arrowIcon}>›</Text>
                </View>
              </TouchableOpacity>
            ))}


          </View>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFE5DD' },
  bubble: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255, 255, 255, 0.25)' },
  bubble1: { width: 300, height: 300, top: -100, right: -100 },
  bubble2: { width: 250, height: 250, bottom: -50, left: -100 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.4)', justifyContent: 'center', alignItems: 'center', marginRight: 20 },
  backIcon: { fontSize: 28, color: '#FFF', lineHeight: 32, marginLeft: -2 },
  progressContainer: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 8, paddingRight: 56 },
  progressActive: { width: 32, height: 4, backgroundColor: theme.colors.primary, borderRadius: 2 },
  progressInactive: { width: 32, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, opacity: 0.7 },
  headerTextContainer: { alignItems: 'center', marginBottom: 24, paddingHorizontal: 10 },
  title: { fontFamily: 'Libre Caslon Text', fontSize: 28, color: '#1B1C1A', textAlign: 'center', marginBottom: 8 },
  metricsText: { fontSize: 11, fontWeight: '600', color: '#111', textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: 16, color: '#333', textAlign: 'center', lineHeight: 24 },
  form: { gap: 16 },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  optionIconWrapper: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0E6EF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  optionIcon: { fontSize: 24 },
  optionTextWrapper: { flex: 1, justifyContent: 'center' },
  optionLabel: { fontSize: 16, color: '#111', fontWeight: '600', marginBottom: 4 },
  optionSubtitle: { fontSize: 12, color: '#888', lineHeight: 16 },
  arrowWrapper: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#EC4899', justifyContent: 'center', alignItems: 'center' },
  arrowIcon: { fontSize: 18, color: '#FFF', fontWeight: 'bold', marginLeft: 2, marginTop: -2 },
});
