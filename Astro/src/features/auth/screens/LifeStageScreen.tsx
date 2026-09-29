import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, Dimensions, BackHandler } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '~/store/useAuthStore';
import { Button } from '~/shared/components/Button';
import { theme } from '~/shared/theme';
import { api } from '~/shared/api';
const { width } = Dimensions.get('window');

export const LifeStageScreen = () => {
  const [lifeStage, setLifeStage] = useState<'pregnant' | 'planning' | 'difficulty' | null>(null);
  const [dateType, setDateType] = useState<'edd' | 'lmp'>('edd');
  const [date, setDate] = useState(new Date());
  const [dateString, setDateString] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const setHasLifeStage = useAuthStore(state => state.setHasLifeStage);
  const setHasProfile = useAuthStore(state => state.setHasProfile);

  const handleBack = () => {
    setHasProfile(false);
    return true; 
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => backHandler.remove();
  }, []);

  const STAGES = [
    { id: 'pregnant', label: 'I am already Pregnant', icon: '🤰' },
    { id: 'baby', label: 'I have a Baby', subtitle: 'Child Age: 0-3 yr', icon: '👶' },
    { id: 'planning', label: 'I am planning for Pregnancy', icon: '💭' },
    { id: 'child', label: 'Women with Child', subtitle: 'Child Age: 3-30 yr\n*Get women & parenting tips', icon: '👩‍👧' },
    { id: 'unmarried', label: 'Unmarried/Newly Married', subtitle: "I don't have a child / Not planning for pregnancy", icon: '👩' },
  ];

  const submitJourney = async (stageId: string, extraData: any = {}) => {
    try {
      setIsLoading(true);
      // Integrate with the Node.js Backend API
      await api.post('/api/v1/auth/journey', {
        stage: stageId,
        ...extraData
      });
      // Update local state to proceed to the main app
      setHasLifeStage(true, stageId, extraData);
    } catch (error) {
      console.error('Failed to save journey to backend:', error);
      // Fail gracefully for now so the user isn't stuck if backend is off
      setHasLifeStage(true, stageId, extraData); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectStage = (id: string) => {
    setLifeStage(id as any);
    if (id !== 'pregnant') {
      submitJourney(id);
    }
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
      <View style={styles.bgDecorTop} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text style={styles.backIcon}>←</Text>
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
          {STAGES.map((stage) => {
            // If a stage is selected and it's not this one, hide it
            if (lifeStage && lifeStage !== stage.id) return null;
            
            return (
              <TouchableOpacity
                key={stage.id}
                style={[styles.optionCard, lifeStage === stage.id && styles.optionCardActive]}
                onPress={() => handleSelectStage(stage.id)}
                disabled={!!lifeStage}
              >
                <View style={styles.optionIconWrapper}>
                  <Text style={styles.optionIcon}>{stage.icon}</Text>
                </View>
                <View style={styles.optionTextWrapper}>
                  <Text style={styles.optionLabel}>{stage.label}</Text>
                  {stage.subtitle && <Text style={styles.optionSubtitle}>{stage.subtitle}</Text>}
                </View>
                {!lifeStage && (
                  <View style={styles.arrowWrapper}>
                    <Text style={styles.arrowIcon}>›</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {lifeStage === 'pregnant' && (
            <View style={styles.datePickerContainer}>
              <Text style={styles.datePickerLabel}>When was the first day of your last period?</Text>
              
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                <Text style={dateString ? styles.dateText : styles.datePlaceholder}>
                  {dateString || 'Select Date (MM/DD/YYYY)'}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}

              <Button 
                title={isLoading ? "Saving..." : "Continue"} 
                onPress={() => submitJourney('pregnant', { lmp_date: date.toISOString() })} 
                disabled={!dateString || isLoading}
                style={styles.continueButton}
              />
            </View>
          )}

        </View>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  bgDecorTop: {
    position: 'absolute',
    top: -width * 0.5,
    right: -width * 0.2,
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: '#EEF2FF',
    opacity: 0.6,
  },
  scrollContent: { flexGrow: 1, paddingHorizontal: 28, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginRight: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  backIcon: { fontSize: 22, color: '#374151', marginTop: -2 },
  progressContainer: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 8, paddingRight: 60 },
  progressActive: { width: 32, height: 4, backgroundColor: '#4F46E5', borderRadius: 2 },
  progressInactive: { width: 32, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 },
  headerTextContainer: { alignItems: 'center', marginBottom: 32, paddingHorizontal: 10 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  metricsText: { fontSize: 12, fontWeight: '700', color: '#4F46E5', textAlign: 'center', marginBottom: 16, backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  subtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
  form: { gap: 16 },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1, borderWidth: 1, borderColor: '#E5E7EB' },
  optionCardActive: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  optionIconWrapper: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: '#EEF2FF' },
  optionIcon: { fontSize: 24 },
  optionTextWrapper: { flex: 1, justifyContent: 'center' },
  optionLabel: { fontSize: 16, color: '#111827', fontWeight: '600', marginBottom: 2 },
  optionSubtitle: { fontSize: 13, color: '#6B7280', lineHeight: 18 },
  arrowWrapper: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#EC4899', justifyContent: 'center', alignItems: 'center' },
  arrowIcon: { fontSize: 18, color: '#FFFFFF', fontWeight: 'bold', marginLeft: 2, marginTop: -2 },
  datePickerContainer: { marginTop: 20, backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  datePickerLabel: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16 },
  dateInput: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 24 },
  dateText: { fontSize: 16, color: '#111827', fontWeight: '600', textAlign: 'center' },
  datePlaceholder: { fontSize: 16, color: '#9CA3AF', textAlign: 'center' },
  continueButton: { marginTop: 8 },
});
