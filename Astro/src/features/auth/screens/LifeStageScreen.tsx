import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, Dimensions, BackHandler } from 'react-native';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '~/store/useAuthStore';
import { Button } from '~/shared/components/Button';
import { theme } from '~/shared/theme';
import { api } from '~/shared/api';
import { useNavigation } from '@react-navigation/native';
import { Calendar, CheckCircle2, ChevronRight, Sparkles, Minus, Plus, Heart, Baby } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type StepType = 'select_stage' | 'pregnant_details' | 'planning_details';

export const LifeStageScreen = () => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [currentStep, setCurrentStep] = useState<StepType>('select_stage');
  const [selectedStage, setSelectedStage] = useState<'pregnant' | 'planning'>('pregnant');
  
  // Pregnant details
  const [date, setDate] = useState(new Date(Date.now() - 105 * 24 * 60 * 60 * 1000)); // Default ~15 weeks back
  const [dateString, setDateString] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [confirmedMonth, setConfirmedMonth] = useState(4);
  const [calculatedWeeks, setCalculatedWeeks] = useState(15);
  
  // Planning details
  const [planningTimeline, setPlanningTimeline] = useState<'0_3' | '3_6' | 'detox'>('0_3');

  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation<any>();
  const setHasLifeStage = useAuthStore(state => state.setHasLifeStage);
  const setHasProfile = useAuthStore(state => state.setHasProfile);

  // Initialize date string on mount
  useEffect(() => {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    setDateString(`${mm}/${dd}/${yyyy}`);
    calculatePregnancyMonth(date);
  }, []);

  const handleBack = () => {
    if (currentStep !== 'select_stage') {
      setCurrentStep('select_stage');
      return true;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    setHasProfile(false);
    return true; 
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => backHandler.remove();
  }, [currentStep]);

  // Calculate gestational age and month from LMP
  const calculatePregnancyMonth = (selectedDate: Date) => {
    const diffTime = Date.now() - selectedDate.getTime();
    const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const w = Math.max(1, Math.floor(diffDays / 7));
    setCalculatedWeeks(w);
    let m = Math.min(9, Math.max(1, Math.ceil(w / 4.33)));
    setConfirmedMonth(m);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      const yyyy = selectedDate.getFullYear();
      setDateString(`${mm}/${dd}/${yyyy}`);
      calculatePregnancyMonth(selectedDate);
    }
  };

  const remainingMonths = Math.max(1, 10 - confirmedMonth);

  const handleProceedFromStageSelect = () => {
    if (selectedStage === 'pregnant') {
      setCurrentStep('pregnant_details');
    } else {
      setCurrentStep('planning_details');
    }
  };

  const handleSubmitFinal = async () => {
    try {
      setIsLoading(true);

      const payload = selectedStage === 'pregnant' ? {
        stage: 'pregnant',
        lmp_date: date.toISOString(),
        confirmed_month: confirmedMonth,
        remaining_months: remainingMonths,
      } : {
        stage: 'planning',
        planning_timeline: planningTimeline
      };

      // 1. Save directly into MongoDB/Backend Collection
      console.log('[LifeStage] Syncing journey data to backend collection:', payload);
      await api.post('/api/v1/auth/journey', payload).catch(err => {
        console.warn('Backend journey save non-blocking warning:', err);
      });

      // 2. Save in local store and advance to Subscription (Pricing) Screen
      setHasLifeStage(true, selectedStage, payload);

      if (navigation.canGoBack()) {
        navigation.navigate('Pricing');
      }
    } catch (error) {
      console.error('Failed to submit journey:', error);
      setHasLifeStage(true, selectedStage, {
        confirmed_month: confirmedMonth,
        remaining_months: remainingMonths
      });
      if (navigation.canGoBack()) {
        navigation.navigate('Pricing');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgDecorTop} pointerEvents="none" />
      <View style={styles.bgDecorBottom} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Navigation Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressStepDone} />
            <View style={styles.progressStepDone} />
            <View style={currentStep !== 'select_stage' ? styles.progressStepDone : styles.progressStepActive} />
          </View>
        </View>

        {/* ======================================================== */}
        {/* STEP 1: SELECT LIFE STAGE (ONLY 2 OPTIONS: PREGNANT / PLANNING) */}
        {/* ======================================================== */}
        {currentStep === 'select_stage' && (
          <View>
            <View style={styles.headerTextContainer}>
              <View style={styles.stageTag}>
                <Sparkles size={14} color="#D97706" />
                <Text style={styles.stageTagText}>{isHindi ? 'चरण 1 • मातृत्व यात्रा' : 'Step 1 • Your Sacred Journey'}</Text>
              </View>
              <Text style={styles.title}>{t('lifeStage.title')}</Text>
              <Text style={styles.subtitle}>{t('lifeStage.subtitle')}</Text>
            </View>

            <View style={styles.optionsList}>
              {/* Option 1: Already Pregnant */}
              <TouchableOpacity
                style={[
                  styles.stageCard,
                  selectedStage === 'pregnant' && styles.stageCardSelected
                ]}
                onPress={() => setSelectedStage('pregnant')}
                activeOpacity={0.88}
              >
                <View style={[styles.iconCircle, { backgroundColor: '#FCE7F3' }]}>
                  <Text style={{ fontSize: 32 }}>🤰</Text>
                </View>
                <View style={styles.cardTextContent}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>{t('lifeStage.pregnant')}</Text>
                    <View style={styles.badgeGarbh}>
                      <Text style={styles.badgeGarbhText}>Garbhsanskar</Text>
                    </View>
                  </View>
                  <Text style={styles.cardSubtitle}>{t('lifeStage.pregnantSub')}</Text>
                </View>
                <View style={[styles.radioCircle, selectedStage === 'pregnant' && styles.radioCircleSelected]}>
                  {selectedStage === 'pregnant' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>

              {/* Option 2: Planning for Pregnancy */}
              <TouchableOpacity
                style={[
                  styles.stageCard,
                  selectedStage === 'planning' && styles.stageCardSelected
                ]}
                onPress={() => setSelectedStage('planning')}
                activeOpacity={0.88}
              >
                <View style={[styles.iconCircle, { backgroundColor: '#EEF2FF' }]}>
                  <Text style={{ fontSize: 32 }}>💭</Text>
                </View>
                <View style={styles.cardTextContent}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>{t('lifeStage.planning')}</Text>
                    <View style={[styles.badgeGarbh, { backgroundColor: '#EDE9FE', borderColor: '#DDD6FE' }]}>
                      <Text style={[styles.badgeGarbhText, { color: '#6D28D9' }]}>Garbhadhaan</Text>
                    </View>
                  </View>
                  <Text style={styles.cardSubtitle}>{t('lifeStage.planningSub')}</Text>
                </View>
                <View style={[styles.radioCircle, selectedStage === 'planning' && styles.radioCircleSelected]}>
                  {selectedStage === 'planning' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            </View>

            {/* Benefit Preview */}
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxEmoji}>🌸</Text>
              <Text style={styles.infoBoxText}>
                {selectedStage === 'pregnant'
                  ? (isHindi ? 'अगली स्क्रीन पर आपके गर्भकाल और अंतिम माहवारी के आधार पर आपके और शिशु के लिए योजना तैयार की जाएगी।' : 'On the next screen, we will take your last period & month details to tailor your baby’s womb journey.')
                  : (isHindi ? 'अगली स्क्रीन पर आपके लिए गर्भधान और बीज शुद्धि योजना तैयार की जाएगी।' : 'On the next screen, we will personalize your Garbhadhaan conception preparation.')}
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={handleProceedFromStageSelect}
              activeOpacity={0.88}
            >
              <Text style={styles.continueButtonText}>
                {isHindi ? 'आगे बढ़ें →' : 'Continue to Details →'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================== */}
        {/* STEP 2: DEDICATED PREGNANCY & LAST PERIOD DETAILS SCREEN */}
        {/* ======================================================== */}
        {currentStep === 'pregnant_details' && (
          <View>
            <View style={styles.headerTextContainer}>
              <View style={[styles.stageTag, { backgroundColor: '#FCE7F3', borderColor: '#FBCFE8' }]}>
                <Baby size={14} color="#BE185D" />
                <Text style={[styles.stageTagText, { color: '#BE185D' }]}>
                  {isHindi ? 'चरण 2 • गर्भकाल विवरण' : 'Step 2 • Pregnancy Details'}
                </Text>
              </View>
              <Text style={styles.title}>
                {isHindi ? 'अंतिम माहवारी एवं गर्भकाल' : 'Month & Period Details'}
              </Text>
              <Text style={styles.subtitle}>
                {isHindi 
                  ? 'अपने अंतिम माहवारी (LMP) की तिथि बताएं ताकि हम गर्भस्थ शिशु की सही आयु और विकास का हिसाब लगा सकें।'
                  : 'Enter the first day of your last period to calculate your baby\'s gestational age and customize your daily Garbhsanskar.'}
              </Text>
            </View>

            {/* LMP Date Selector Card */}
            <View style={styles.detailsCard}>
              <Text style={styles.inputSectionTitle}>
                {t('lifeStage.periodQuestion')}
              </Text>

              <TouchableOpacity 
                style={styles.dateSelectorBox} 
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
              >
                <View style={styles.dateLeft}>
                  <View style={styles.calendarIconCircle}>
                    <Calendar size={18} color="#FF4D6D" />
                  </View>
                  <View>
                    <Text style={styles.dateLabelSmall}>{isHindi ? 'अंतिम माहवारी (LMP)' : 'First Day of Last Period'}</Text>
                    <Text style={styles.dateValueText}>
                      {dateString || t('lifeStage.selectDate')}
                    </Text>
                  </View>
                </View>
                <View style={styles.dateChangePill}>
                  <Text style={styles.dateChangePillText}>{isHindi ? 'बदलें ▾' : 'Change ▾'}</Text>
                </View>
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

              {/* Gestational & Month Confirmation Feature */}
              <View style={styles.confirmationCard}>
                <View style={styles.calcHeaderRow}>
                  <Text style={styles.calcBadgeText}>
                    ✨ Week {calculatedWeeks} • Trimester {confirmedMonth <= 3 ? '1st' : confirmedMonth <= 6 ? '2nd' : '3rd'}
                  </Text>
                  <View style={styles.remainingPillBox}>
                    <Text style={styles.remainingPillText}>~{remainingMonths} {isHindi ? 'महीने शेष' : 'Months Left'}</Text>
                  </View>
                </View>

                <Text style={styles.confirmPromptText}>
                  {t('lifeStage.confirmMonth')}
                </Text>

                {/* Month Stepper Controller */}
                <View style={styles.monthStepperRow}>
                  <TouchableOpacity 
                    style={[styles.stepBtn, confirmedMonth <= 1 && styles.stepBtnDisabled]}
                    onPress={() => setConfirmedMonth(prev => Math.max(1, prev - 1))}
                    disabled={confirmedMonth <= 1}
                  >
                    <Minus size={20} color={confirmedMonth <= 1 ? '#D1D5DB' : '#BE185D'} />
                  </TouchableOpacity>

                  <View style={styles.monthDisplayBox}>
                    <Text style={styles.monthBigNumber}>
                      {isHindi ? `माह ${confirmedMonth}` : `Month ${confirmedMonth}`}
                    </Text>
                    <Text style={styles.monthSubNote}>
                      {confirmedMonth === 1 ? '1 - 4 Weeks' :
                       confirmedMonth === 2 ? '5 - 8 Weeks' :
                       confirmedMonth === 3 ? '9 - 13 Weeks' :
                       confirmedMonth === 4 ? '14 - 17 Weeks' :
                       confirmedMonth === 5 ? '18 - 22 Weeks' :
                       confirmedMonth === 6 ? '23 - 26 Weeks' :
                       confirmedMonth === 7 ? '27 - 30 Weeks' :
                       confirmedMonth === 8 ? '31 - 35 Weeks' : '36 - 40 Weeks'}
                    </Text>
                  </View>

                  <TouchableOpacity 
                    style={[styles.stepBtn, confirmedMonth >= 9 && styles.stepBtnDisabled]}
                    onPress={() => setConfirmedMonth(prev => Math.min(9, prev + 1))}
                    disabled={confirmedMonth >= 9}
                  >
                    <Plus size={20} color={confirmedMonth >= 9 ? '#D1D5DB' : '#BE185D'} />
                  </TouchableOpacity>
                </View>

                {/* Quick Month Chips */}
                <View style={styles.monthChipsRow}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.monthChip, confirmedMonth === m && styles.monthChipActive]}
                      onPress={() => setConfirmedMonth(m)}
                    >
                      <Text style={[styles.monthChipText, confirmedMonth === m && styles.monthChipTextActive]}>
                        M{m}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Plan Insight Callout */}
                <View style={styles.planInsightBanner}>
                  <Text style={styles.planInsightText}>
                    💡 {isHindi 
                      ? `उत्कर्ष (Utkarsh) योजना आपके शेष ${remainingMonths} महीनों के लिए स्वतः कम मूल्य पर समायोजित की जाएगी!`
                      : `Utkarsh (Full) Plan will be dynamically priced for your remaining ${remainingMonths} months!`}
                  </Text>
                </View>
              </View>
            </View>

            {/* Submit Button to Pricing Screen */}
            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={handleSubmitFinal}
              disabled={isLoading}
              activeOpacity={0.88}
            >
              <Text style={styles.continueButtonText}>
                {isLoading 
                  ? (isHindi ? 'योजनाएं तैयार हो रही हैं...' : 'Preparing Plans...') 
                  : (isHindi ? '🌸 गर्भसंस्कार योजनाएं देखें (Utkarsh & Aadhar) →' : '🌸 View Garbhsanskar Plans (Utkarsh & Aadhar) →')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================== */}
        {/* STEP 2 (ALTERNATIVE): DEDICATED PLANNING DETAILS SCREEN */}
        {/* ======================================================== */}
        {currentStep === 'planning_details' && (
          <View>
            <View style={styles.headerTextContainer}>
              <View style={[styles.stageTag, { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }]}>
                <Sparkles size={14} color="#4338CA" />
                <Text style={[styles.stageTagText, { color: '#4338CA' }]}>
                  {isHindi ? 'चरण 2 • गर्भधान तैयारी' : 'Step 2 • Conception Timeline'}
                </Text>
              </View>
              <Text style={styles.title}>{t('lifeStage.planningDurationQuestion')}</Text>
              <Text style={styles.subtitle}>
                {isHindi 
                  ? 'स्वस्थ और गुणवान शिशु के लिए बीज शुद्धि और गर्भधान तैयारी का सही समय चुनें।'
                  : 'Select your preferred conception timeline for Ayurvedic Beej Shuddhi & fertility optimization.'}
              </Text>
            </View>

            <View style={styles.timelineList}>
              <TouchableOpacity 
                style={[styles.timelineOption, planningTimeline === '0_3' && styles.timelineOptionActive]}
                onPress={() => setPlanningTimeline('0_3')}
                activeOpacity={0.88}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.timelineText, planningTimeline === '0_3' && styles.timelineTextActive]}>
                    🎯 {t('lifeStage.planning03')}
                  </Text>
                </View>
                {planningTimeline === '0_3' && <CheckCircle2 size={20} color="#BE185D" />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.timelineOption, planningTimeline === '3_6' && styles.timelineOptionActive]}
                onPress={() => setPlanningTimeline('3_6')}
                activeOpacity={0.88}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.timelineText, planningTimeline === '3_6' && styles.timelineTextActive]}>
                    🌱 {t('lifeStage.planning36')}
                  </Text>
                </View>
                {planningTimeline === '3_6' && <CheckCircle2 size={20} color="#BE185D" />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.timelineOption, planningTimeline === 'detox' && styles.timelineOptionActive]}
                onPress={() => setPlanningTimeline('detox')}
                activeOpacity={0.88}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.timelineText, planningTimeline === 'detox' && styles.timelineTextActive]}>
                    🧘‍♀️ {t('lifeStage.planningDifficulty')}
                  </Text>
                </View>
                {planningTimeline === 'detox' && <CheckCircle2 size={20} color="#BE185D" />}
              </TouchableOpacity>
            </View>

            <View style={styles.planInsightBanner}>
              <Text style={styles.planInsightText}>
                🌸 {isHindi 
                  ? 'अगली स्क्रीन पर केवल गर्भधान की 2 योजनाएं (Full एवं Half) दिखाई देंगी।'
                  : 'You will view the 2 Garbhadhaan conception preparation plans on the next screen.'}
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={handleSubmitFinal}
              disabled={isLoading}
              activeOpacity={0.88}
            >
              <Text style={styles.continueButtonText}>
                {isLoading 
                  ? (isHindi ? 'योजनाएं तैयार हो रही हैं...' : 'Preparing Plans...') 
                  : (isHindi ? '🌸 गर्भधान योजनाएं देखें →' : '🌸 View Garbhadhaan Plans →')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8FA', // Warm maternal blush
  },
  bgDecorTop: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FFE4E6',
    opacity: 0.6,
  },
  bgDecorBottom: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FEF3C7',
    opacity: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  backIcon: {
    fontSize: 20,
    color: '#831843',
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressStepDone: {
    width: 32,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FF4D6D',
  },
  progressStepActive: {
    width: 32,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FDA4AF',
  },
  headerTextContainer: {
    marginBottom: 22,
  },
  stageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    marginBottom: 10,
  },
  stageTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4C0519',
    letterSpacing: -0.4,
    lineHeight: 32,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
  },
  optionsList: {
    gap: 16,
    marginBottom: 22,
  },
  stageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#FCE7F3',
    shadowColor: '#9F1239',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  stageCardSelected: {
    borderColor: '#FF4D6D',
    backgroundColor: '#FFF5F7',
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#4C0519',
  },
  badgeGarbh: {
    backgroundColor: '#FCE7F3',
    borderWidth: 1,
    borderColor: '#FBCFE8',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeGarbhText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#BE185D',
  },
  cardSubtitle: {
    fontSize: 12.5,
    color: '#6B7280',
    lineHeight: 18,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioCircleSelected: {
    borderColor: '#FF4D6D',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4D6D',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E6',
    borderRadius: 18,
    padding: 14,
    marginBottom: 24,
  },
  infoBoxEmoji: {
    fontSize: 22,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 12.5,
    color: '#9F1239',
    lineHeight: 18,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#FCE7F3',
    shadowColor: '#9F1239',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 22,
  },
  inputSectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#4C0519',
    marginBottom: 12,
  },
  dateSelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8FA',
    borderWidth: 1.5,
    borderColor: '#FCE7F3',
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
  },
  dateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calendarIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabelSmall: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  dateValueText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4C0519',
    marginTop: 2,
  },
  dateChangePill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  dateChangePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#BE185D',
  },
  confirmationCard: {
    backgroundColor: '#FFF5F7',
    borderWidth: 1,
    borderColor: '#FFE4E6',
    borderRadius: 20,
    padding: 16,
  },
  calcHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calcBadgeText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#BE185D',
  },
  remainingPillBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  remainingPillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#B45309',
  },
  confirmPromptText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4C0519',
    marginBottom: 10,
  },
  monthStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 14,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepBtnDisabled: {
    opacity: 0.4,
    borderColor: '#E5E7EB',
  },
  monthDisplayBox: {
    alignItems: 'center',
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FDA4AF',
  },
  monthBigNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#BE185D',
    letterSpacing: -0.3,
  },
  monthSubNote: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
  },
  monthChipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 14,
  },
  monthChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  monthChipActive: {
    backgroundColor: '#FF4D6D',
    borderColor: '#FF4D6D',
  },
  monthChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  monthChipTextActive: {
    color: '#FFFFFF',
  },
  planInsightBanner: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 12,
    padding: 10,
  },
  planInsightText: {
    fontSize: 11.5,
    color: '#1E40AF',
    lineHeight: 16,
    fontWeight: '600',
  },
  timelineList: {
    gap: 12,
    marginBottom: 20,
  },
  timelineOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FCE7F3',
  },
  timelineOptionActive: {
    borderColor: '#BE185D',
    backgroundColor: '#FFF5F7',
  },
  timelineText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#374151',
  },
  timelineTextActive: {
    color: '#BE185D',
    fontWeight: '800',
  },
  continueButton: {
    width: '100%',
    height: 56,
    borderRadius: 20,
    backgroundColor: '#FF4D6D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF4D6D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
