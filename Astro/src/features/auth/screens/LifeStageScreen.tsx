import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '~/store/useAuthStore';
import { useNavigation } from '@react-navigation/native';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Minus,
  Plus,
  Heart,
  Baby,
  ShieldCheck,
  Check,
  Clock,
  ArrowRight,
  Sun,
  Award,
} from 'lucide-react-native';
import { api } from '~/shared/api';

const { width } = Dimensions.get('window');

type StepType = 'select_stage' | 'pregnant_details' | 'planning_details';

// Month-wise Krishna Coming developmental milestones & Ayurvedic focus
const getMonthDetails = (month: number, isHindi: boolean) => {
  const data: Record<number, { weeks: string; trimester: number; milestone: string; focus: string }> = {
    1: {
      weeks: '1 - 4 Weeks',
      trimester: 1,
      milestone: isHindi ? 'प्राण ऊर्जा व कोशिका विभाजन' : 'Cellular creation & embryo nesting',
      focus: isHindi ? 'बीज शुद्धि एवं ध्यान' : 'Sacred conception & deep calm',
    },
    2: {
      weeks: '5 - 8 Weeks',
      trimester: 1,
      milestone: isHindi ? 'नन्हे हृदय की धड़कन आरंभ' : 'First heartbeat & vital organ buds',
      focus: isHindi ? '432Hz शांत संगीत व प्राणायाम' : '432Hz Raagas & Morning prayer',
    },
    3: {
      weeks: '9 - 13 Weeks',
      trimester: 1,
      milestone: isHindi ? 'हाथ-पैर व मुखाकृति का निर्माण' : 'Facial contours & tiny fingers form',
      focus: isHindi ? 'पौष्टिक आहार व गर्भ संवाद' : 'Nutritious diet & tender Garbh Samvad',
    },
    4: {
      weeks: '14 - 17 Weeks',
      trimester: 2,
      milestone: isHindi ? 'मस्तिष्क व संवेदी तंत्रिकाओं का तीव्र विकास' : 'Rapid sensory nerve & brain wiring',
      focus: isHindi ? 'वैदिक श्लोक व प्रेरक कथाएं' : 'Vedic shlokas & virtues storytelling',
    },
    5: {
      weeks: '18 - 22 Weeks',
      trimester: 2,
      milestone: isHindi ? 'शिशु की पहली हलचल (किक) का अनुभव' : 'First flutter & audible hearing kicks',
      focus: isHindi ? 'किक ट्रैकिंग व संगीत थेरेपी' : 'Kick counting & harmonious ragas',
    },
    6: {
      weeks: '23 - 26 Weeks',
      trimester: 2,
      milestone: isHindi ? 'आंखें खुलना व मां की आवाज पहचानना' : 'Eyes open, responds to Maa & Papa',
      focus: isHindi ? 'संवाद, रामायण/गीता पठन' : 'Daily dialogue & spiritual reading',
    },
    7: {
      weeks: '27 - 30 Weeks',
      trimester: 3,
      milestone: isHindi ? 'मस्तिष्क की सभी इंद्रियां सक्रिय' : 'Active brainwaves & REM dreams in womb',
      focus: isHindi ? 'सीमंतोन्नयन व सकारात्मक चिंतन' : 'Simantonnayan & stress detox',
    },
    8: {
      weeks: '31 - 35 Weeks',
      trimester: 3,
      milestone: isHindi ? 'फेफड़े व रोग प्रतिरोधक क्षमता का विकास' : 'Lung maturation & antibody immunity',
      focus: isHindi ? 'सुखप्रसव योगासन व विश्राम' : 'Normal delivery yoga & rest',
    },
    9: {
      weeks: '36 - 40 Weeks',
      trimester: 3,
      milestone: isHindi ? 'पूर्ण परिपक्वता, जन्म हेतु तत्पर' : 'Full-term ready for sacred arrival',
      focus: isHindi ? 'सुखप्रसव मुद्रा व मंत्र ध्यान' : 'Gentle birthing mudras & mantra peace',
    },
  };
  return data[month] || data[4];
};

// Krishna Coming Dynamic Pricing Tier per remaining months
const getDynamicPrice = (remMonths: number) => {
  const pricingMap: Record<number, { price: number; original: number; save: number }> = {
    9: { price: 8999, original: 13491, save: 4492 },
    8: { price: 7999, original: 11992, save: 3993 },
    7: { price: 6999, original: 10493, save: 3494 },
    6: { price: 5999, original: 8994, save: 2995 },
    5: { price: 4999, original: 7495, save: 2496 },
    4: { price: 3999, original: 5996, save: 1997 },
    3: { price: 2999, original: 4497, save: 1498 },
    2: { price: 2199, original: 2998, save: 799 },
    1: { price: 1499, original: 1499, save: 0 },
  };
  return pricingMap[remMonths] || { price: 5999, original: 8994, save: 2995 };
};

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
    formatAndSetDate(date);
    calculatePregnancyMonth(date);
  }, []);

  const formatAndSetDate = (d: Date) => {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    setDateString(`${mm}/${dd}/${yyyy}`);
  };

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
      formatAndSetDate(selectedDate);
      calculatePregnancyMonth(selectedDate);
    }
  };

  const remainingMonths = Math.max(1, 10 - confirmedMonth);
  const dynamicPricing = getDynamicPrice(remainingMonths);
  const currentMonthData = getMonthDetails(confirmedMonth, isHindi);

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

      const payload =
        selectedStage === 'pregnant'
          ? {
              stage: 'pregnant',
              lmp_date: date.toISOString(),
              confirmed_month: confirmedMonth,
              remaining_months: remainingMonths,
            }
          : {
              stage: 'planning',
              planning_timeline: planningTimeline,
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
        remaining_months: remainingMonths,
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
      {/* Krishna Coming Top Arc & Blush Background Accents */}
      <View style={styles.topCurvedArc} pointerEvents="none" />
      <View style={styles.bgDecorTop} pointerEvents="none" />
      <View style={styles.bgDecorBottom} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Navigation Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            activeOpacity={0.8}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressStepDone} />
            <View style={styles.progressStepDone} />
            <View
              style={currentStep !== 'select_stage' ? styles.progressStepDone : styles.progressStepActive}
            />
          </View>
        </View>

        {/* ======================================================== */}
        {/* STEP 1: SELECT LIFE STAGE (PREGNANT / PLANNING) */}
        {/* ======================================================== */}
        {currentStep === 'select_stage' && (
          <View>
            <View style={styles.headerTextContainer}>
              <View style={styles.stageTag}>
                <Sparkles size={14} color="#D97706" />
                <Text style={styles.stageTagText}>
                  {isHindi ? 'चरण 1 • मातृत्व संकल्प' : 'Step 1 • Your Sacred Journey'}
                </Text>
              </View>
              <Text style={styles.title}>
                {isHindi ? 'अपनी वर्तमान स्थिति चुनें' : 'Are you pregnant?'}
              </Text>
              <Text style={styles.subtitle}>
                {isHindi
                  ? 'अपनी स्थिति के अनुसार वैदिक गर्भसंस्कार अथवा गर्भधान बीज शुद्धि का चयन करें।'
                  : 'Select your journey to personalize your daily Garbhsanskar or Garbhadhaan practices.'}
              </Text>
            </View>

            <View style={styles.optionsList}>
              {/* Option 1: Already Pregnant (Yes) */}
              <TouchableOpacity
                style={[
                  styles.stageCard,
                  selectedStage === 'pregnant' && styles.stageCardSelected,
                ]}
                onPress={() => setSelectedStage('pregnant')}
                activeOpacity={0.88}
              >
                <View style={[styles.iconCircle, { backgroundColor: '#FDF2F4' }]}>
                  <Text style={{ fontSize: 32 }}>🤰</Text>
                </View>
                <View style={styles.cardTextContent}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>
                      {isHindi ? 'हां, मैं गर्भवती हूं' : 'Yes, I am Pregnant'}
                    </Text>
                    <View style={styles.badgeGarbh}>
                      <Text style={styles.badgeGarbhText}>Utkarsh & Aadhar</Text>
                    </View>
                  </View>
                  <Text style={styles.cardSubtitle}>
                    {isHindi
                      ? '9 माह का संपूर्ण वैदिक गर्भसंस्कार, 432Hz राग व लाइव डॉक्टर सत्र'
                      : '9-month full Vedic Garbhsanskar, 432Hz music therapy & live doctor sessions'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    selectedStage === 'pregnant' && styles.radioCircleSelected,
                  ]}
                >
                  {selectedStage === 'pregnant' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>

              {/* Option 2: Planning for Baby (No) */}
              <TouchableOpacity
                style={[
                  styles.stageCard,
                  selectedStage === 'planning' && styles.stageCardSelected,
                ]}
                onPress={() => setSelectedStage('planning')}
                activeOpacity={0.88}
              >
                <View style={[styles.iconCircle, { backgroundColor: '#F0F9FF' }]}>
                  <Text style={{ fontSize: 32 }}>🌸</Text>
                </View>
                <View style={styles.cardTextContent}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>
                      {isHindi ? 'नहीं, हम शिशु की योजना बना रहे हैं' : 'No, I am Planning for Baby'}
                    </Text>
                    <View style={[styles.badgeGarbh, { backgroundColor: '#EDE9FE', borderColor: '#DDD6FE' }]}>
                      <Text style={[styles.badgeGarbhText, { color: '#6D28D9' }]}>Garbhadhaan</Text>
                    </View>
                  </View>
                  <Text style={styles.cardSubtitle}>
                    {isHindi
                      ? 'आयुर्वेदिक बीज शुद्धि, प्राण ऊर्जा डिटॉक्स व गर्भधान संस्कार'
                      : 'Ayurvedic Beej Shuddhi, cellular detox & auspicious conception timing'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    selectedStage === 'planning' && styles.radioCircleSelected,
                  ]}
                >
                  {selectedStage === 'planning' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            </View>

            {/* Benefit Preview Callout */}
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxEmoji}>👑</Text>
              <Text style={styles.infoBoxText}>
                {selectedStage === 'pregnant'
                  ? (isHindi
                      ? 'अगली स्क्रीन पर आपके गर्भकाल के आधार पर शेष महीनों के लिए उत्कर्ष (Utkarsh) योजना का गतिशील मूल्य तय होगा।'
                      : 'Next screen will calculate your baby’s gestational age and tailor dynamic pricing for remaining months.')
                  : (isHindi
                      ? 'अगली स्क्रीन पर आपके लिए गर्भधान और बीज शुद्धि योजना तैयार की जाएगी।'
                      : 'On the next screen, we will personalize your Garbhadhaan conception preparation.')}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleProceedFromStageSelect}
              activeOpacity={0.88}
            >
              <Text style={styles.continueButtonText}>
                {isHindi ? 'विवरण दर्ज करें →' : 'Continue to Details →'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================== */}
        {/* STEP 2: DEDICATED PREGNANCY & LAST PERIOD DETAILS SCREEN */}
        {/* (Matching Krishna Coming business model and styling)    */}
        {/* ======================================================== */}
        {currentStep === 'pregnant_details' && (
          <View>
            <View style={styles.headerTextContainer}>
              <View style={styles.stageTagVedic}>
                <Baby size={14} color="#FD5580" />
                <Text style={styles.stageTagVedicText}>
                  {isHindi ? 'चरण 2 • गर्भकाल व अवधि विवरण' : 'Step 2 • Pregnancy Details'}
                </Text>
              </View>
              <Text style={styles.title}>
                {isHindi ? 'अंतिम माहवारी एवं गर्भकाल' : 'Month & Period Details'}
              </Text>
              <Text style={styles.subtitle}>
                {isHindi
                  ? 'अपने अंतिम माहवारी (LMP) की तिथि बताएं ताकि हम गर्भस्थ शिशु की सही आयु और विकास का हिसाब लगा सकें।'
                  : "Enter the first day of your last period to calculate your baby's gestational age and customize your daily Garbhsanskar."}
              </Text>
            </View>

            {/* LMP Date Selector Card */}
            <View style={styles.detailsCard}>
              <Text style={styles.inputSectionTitle}>
                {isHindi
                  ? 'आपकी अंतिम माहवारी का पहला दिन (LMP) क्या था?'
                  : 'When was the first day of your last period (LMP)?'}
              </Text>

              <TouchableOpacity
                style={styles.dateSelectorBox}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.82}
              >
                <View style={styles.dateLeft}>
                  <View style={styles.calendarIconCircle}>
                    <Calendar size={18} color="#FD5580" />
                  </View>
                  <View>
                    <Text style={styles.dateLabelSmall}>
                      {isHindi ? 'अंतिम माहवारी (LMP)' : 'First Day of Last Period'}
                    </Text>
                    <Text style={styles.dateValueText}>
                      {dateString || (isHindi ? 'तिथि चुनें' : 'Select Date')}
                    </Text>
                  </View>
                </View>
                <View style={styles.dateChangePill}>
                  <Text style={styles.dateChangePillText}>
                    {isHindi ? 'बदलें ▾' : 'Change ▾'}
                  </Text>
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

              {/* Gestational & Month Confirmation Feature Card */}
              <View style={styles.confirmationCard}>
                {/* Trimester & Weeks Header Pill */}
                <View style={styles.calcHeaderRow}>
                  <View style={styles.trimesterBadge}>
                    <Sparkles size={13} color="#D97706" />
                    <Text style={styles.calcBadgeText}>
                      Week {calculatedWeeks} • Trimester {confirmedMonth <= 3 ? '1st' : confirmedMonth <= 6 ? '2nd' : '3rd'}
                    </Text>
                  </View>
                  <View style={styles.remainingPillBox}>
                    <Text style={styles.remainingPillText}>
                      ~{remainingMonths} {isHindi ? 'महीने शेष' : 'Months Left'}
                    </Text>
                  </View>
                </View>

                {/* Milestone Detail Callout */}
                <View style={styles.milestoneBox}>
                  <Text style={styles.milestoneText}>
                    🌱 <Text style={{ fontWeight: '800', color: '#1F2937' }}>{currentMonthData.weeks}:</Text>{' '}
                    {currentMonthData.milestone}
                  </Text>
                </View>

                {/* Krishna Coming Prompt: Select Your Running Pregnancy Month */}
                <Text style={styles.confirmPromptText}>
                  {isHindi
                    ? 'वर्तमान गर्भावस्था माह की पुष्टि करें:'
                    : 'Select Your Running Pregnancy Month:'}
                </Text>

                {/* Stepper with Big Month Badge */}
                <View style={styles.monthStepperRow}>
                  <TouchableOpacity
                    style={[styles.stepBtn, confirmedMonth <= 1 && styles.stepBtnDisabled]}
                    onPress={() => setConfirmedMonth(prev => Math.max(1, prev - 1))}
                    disabled={confirmedMonth <= 1}
                    activeOpacity={0.7}
                  >
                    <Minus size={20} color={confirmedMonth <= 1 ? '#CBD5E1' : '#FD5580'} />
                  </TouchableOpacity>

                  <View style={styles.monthDisplayBox}>
                    <Text style={styles.monthBigNumber}>
                      {isHindi ? `माह ${confirmedMonth}` : `Month ${confirmedMonth}`}
                    </Text>
                    <Text style={styles.monthSubNote}>
                      {currentMonthData.weeks}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.stepBtn, confirmedMonth >= 9 && styles.stepBtnDisabled]}
                    onPress={() => setConfirmedMonth(prev => Math.min(9, prev + 1))}
                    disabled={confirmedMonth >= 9}
                    activeOpacity={0.7}
                  >
                    <Plus size={20} color={confirmedMonth >= 9 ? '#CBD5E1' : '#FD5580'} />
                  </TouchableOpacity>
                </View>

                {/* Krishna Coming 9-Month Box Grid (styled after bg_gray_month_box & bg_selected_month_box) */}
                <View style={styles.monthBoxContainer}>
                  <View style={styles.trimesterDivider}>
                    <Text style={styles.trimesterDividerLabel}>
                      {isHindi ? 'त्रैमासिक 1' : 'Trimester 1'}
                    </Text>
                    <View style={styles.trimesterDividerLine} />
                    <Text style={styles.trimesterDividerLabel}>
                      {isHindi ? 'त्रैमासिक 2' : 'Trimester 2'}
                    </Text>
                    <View style={styles.trimesterDividerLine} />
                    <Text style={styles.trimesterDividerLabel}>
                      {isHindi ? 'त्रैमासिक 3' : 'Trimester 3'}
                    </Text>
                  </View>

                  <View style={styles.monthGrid}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => {
                      const isSelected = confirmedMonth === m;
                      return (
                        <TouchableOpacity
                          key={m}
                          style={[
                            styles.kcMonthBox,
                            isSelected && styles.kcMonthBoxSelected,
                          ]}
                          onPress={() => setConfirmedMonth(m)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.kcMonthBoxText,
                              isSelected && styles.kcMonthBoxTextSelected,
                            ]}
                          >
                            {m}
                          </Text>
                          <Text
                            style={[
                              styles.kcMonthBoxSub,
                              isSelected && styles.kcMonthBoxSubSelected,
                            ]}
                          >
                            M{m}
                          </Text>
                          {isSelected && <View style={styles.kcSelectedDot} />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Krishna Coming Business Model: Dynamic Pricing Preview Card */}
                <View style={styles.dynamicPricingCard}>
                  <View style={styles.pricingCardHeader}>
                    <View style={styles.pricingHeaderLeft}>
                      <Award size={18} color="#D97706" />
                      <Text style={styles.pricingCardTitle}>
                        {isHindi ? 'उत्कर्ष (Utkarsh) पूर्ण योजना' : 'Utkarsh (Full) Plan Dynamic Price'}
                      </Text>
                    </View>
                    <View style={styles.pricingSaveBadge}>
                      <Text style={styles.pricingSaveBadgeText}>
                        {isHindi ? `₹${dynamicPricing.save} की बचत` : `SAVE ₹${dynamicPricing.save}`}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.pricingNumbersRow}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.currencySymbol}>₹</Text>
                      <Text style={styles.mainPriceText}>{dynamicPricing.price.toLocaleString('en-IN')}</Text>
                      <Text style={styles.originalPriceText}>
                        ₹{dynamicPricing.original.toLocaleString('en-IN')}
                      </Text>
                    </View>
                    <Text style={styles.priceDurationTag}>
                      {isHindi
                        ? `शेष ${remainingMonths} माह हेतु (डिलीवरी तक)`
                        : `For remaining ${remainingMonths} months`}
                    </Text>
                  </View>

                  <View style={styles.pricingFeatureDivider} />

                  <View style={styles.featuresPillRow}>
                    <View style={styles.featureItem}>
                      <Check size={12} color="#059669" />
                      <Text style={styles.featureItemText}>
                        {isHindi ? 'लाइव डॉक्टर सत्र' : 'Live Doctor Zoom'}
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Check size={12} color="#059669" />
                      <Text style={styles.featureItemText}>
                        {isHindi ? '432Hz राग' : '432Hz Raagas'}
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Check size={12} color="#059669" />
                      <Text style={styles.featureItemText}>
                        {isHindi ? 'कुंडली पंजीकरण' : 'Kundli Access'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.emiBanner}>
                    <Text style={styles.emiBannerText}>
                      💳 {isHindi
                        ? 'डाउनपेमेंट विकल्प: मात्र ₹1,999 से प्रारंभ (बाकी अगले माह)'
                        : 'EMI Option: Start with ₹1,999 down payment today'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Bottom Action Button Leading Directly to Krishna Coming Pricing Screen */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleSubmitFinal}
              disabled={isLoading}
              activeOpacity={0.88}
            >
              <Text style={styles.continueButtonText}>
                {isLoading
                  ? (isHindi ? 'योजनाएं तैयार हो रही हैं...' : 'Preparing Plans...')
                  : (isHindi
                      ? '🌸 गर्भसंस्कार योजनाएं देखें (Utkarsh & Aadhar) →'
                      : '🌸 View Garbhsanskar Plans (Utkarsh & Aadhar) →')}
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
              <Text style={styles.title}>
                {isHindi ? 'गर्भधारण की योजना कब की है?' : 'When are you planning to conceive?'}
              </Text>
              <Text style={styles.subtitle}>
                {isHindi
                  ? 'स्वस्थ और गुणवान शिशु के लिए बीज शुद्धि और गर्भधान तैयारी का सही समय चुनें।'
                  : 'Select your preferred conception timeline for Ayurvedic Beej Shuddhi & fertility optimization.'}
              </Text>
            </View>

            <View style={styles.timelineList}>
              <TouchableOpacity
                style={[
                  styles.timelineOption,
                  planningTimeline === '0_3' && styles.timelineOptionActive,
                ]}
                onPress={() => setPlanningTimeline('0_3')}
                activeOpacity={0.88}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.timelineText,
                      planningTimeline === '0_3' && styles.timelineTextActive,
                    ]}
                  >
                    🎯 {isHindi ? 'अगले 0 से 3 महीनों में' : 'Within 0 to 3 Months'}
                  </Text>
                  <Text style={styles.timelineSubText}>
                    {isHindi ? 'तत्काल बीज शुद्धि व गर्भधान' : 'Immediate cellular detox & conception'}
                  </Text>
                </View>
                {planningTimeline === '0_3' && <CheckCircle2 size={20} color="#FD5580" />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.timelineOption,
                  planningTimeline === '3_6' && styles.timelineOptionActive,
                ]}
                onPress={() => setPlanningTimeline('3_6')}
                activeOpacity={0.88}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.timelineText,
                      planningTimeline === '3_6' && styles.timelineTextActive,
                    ]}
                  >
                    🌱 {isHindi ? '3 से 6 महीनों में' : 'Within 3 to 6 Months'}
                  </Text>
                  <Text style={styles.timelineSubText}>
                    {isHindi ? 'शारीरिक एवं मानसिक संपूर्ण संतुलन' : 'Holistic emotional & physical balance'}
                  </Text>
                </View>
                {planningTimeline === '3_6' && <CheckCircle2 size={20} color="#FD5580" />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.timelineOption,
                  planningTimeline === 'detox' && styles.timelineOptionActive,
                ]}
                onPress={() => setPlanningTimeline('detox')}
                activeOpacity={0.88}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.timelineText,
                      planningTimeline === 'detox' && styles.timelineTextActive,
                    ]}
                  >
                    🧘‍♀️ {isHindi ? 'गर्भधारण में कठिनाई / विशेष परामर्श' : 'Conception Delay / Fertility Detox'}
                  </Text>
                  <Text style={styles.timelineSubText}>
                    {isHindi ? 'वैदिक आहार, योग व डॉक्टर मार्गदर्शन' : 'Ayurvedic guidance & fertility therapies'}
                  </Text>
                </View>
                {planningTimeline === 'detox' && <CheckCircle2 size={20} color="#FD5580" />}
              </TouchableOpacity>
            </View>

            <View style={styles.dynamicPricingCard}>
              <Text style={styles.pricingCardTitle}>
                🌸 {isHindi ? 'गर्भधान संस्कार योजनाएं' : 'Garbhadhaan Pre-Conception Plans'}
              </Text>
              <Text style={[styles.pricingSaveBadgeText, { marginTop: 4, color: '#374151' }]}>
                {isHindi
                  ? 'अगली स्क्रीन पर गर्भधान तैयारी की 2 विशेष योजनाएं (Full एवं Half) उपलब्ध होंगी।'
                  : 'You will view 2 personalized Garbhadhaan conception preparation plans on the next screen.'}
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
    backgroundColor: '#FDF6F0', // Krishna Coming signature warm blush ivory
  },
  topCurvedArc: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: '#FFF0F2',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  bgDecorTop: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FCE7F3',
    opacity: 0.5,
  },
  bgDecorBottom: {
    position: 'absolute',
    bottom: -50,
    left: -40,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#FEF3C7',
    opacity: 0.45,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  backIcon: {
    fontSize: 20,
    color: '#2A0845',
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
    backgroundColor: '#FD5580',
  },
  progressStepActive: {
    width: 32,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FECDD3',
  },
  headerTextContainer: {
    marginBottom: 20,
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
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 10,
  },
  stageTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  stageTagVedic: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FFF0F3',
    borderWidth: 1,
    borderColor: '#FFE4E8',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 10,
  },
  stageTagVedicText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FD5580',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2A0845', // Krishna Coming deep royal headline
    letterSpacing: -0.4,
    lineHeight: 32,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#4B5563',
    lineHeight: 20,
  },
  optionsList: {
    gap: 14,
    marginBottom: 20,
  },
  stageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#F3E8FF',
    shadowColor: '#2A0845',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  stageCardSelected: {
    borderColor: '#FD5580',
    backgroundColor: '#FFF9FA',
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
    fontSize: 16.5,
    fontWeight: '800',
    color: '#1E1B4B',
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
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
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
    borderColor: '#FD5580',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FD5580',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
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
    color: '#92400E',
    lineHeight: 18,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#F3E8FF',
    shadowColor: '#2A0845',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
    marginBottom: 20,
  },
  inputSectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
  },
  dateSelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF9F5',
    borderWidth: 1.5,
    borderColor: '#FFE4D6',
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
    backgroundColor: '#FFF0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabelSmall: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  dateValueText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
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
    color: '#FD5580',
  },
  confirmationCard: {
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 22,
    padding: 16,
  },
  calcHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  trimesterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  calcBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  remainingPillBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  remainingPillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#B45309',
  },
  milestoneBox: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  milestoneText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
  },
  confirmPromptText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2A0845',
    marginBottom: 10,
    textAlign: 'center',
  },
  monthStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FFE4E8',
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
    paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FD5580',
    shadowColor: '#FD5580',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  monthBigNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FD5580',
    letterSpacing: -0.3,
  },
  monthSubNote: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '700',
    marginTop: 2,
  },
  monthBoxContainer: {
    marginBottom: 16,
  },
  trimesterDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  trimesterDividerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  trimesterDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  monthGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  // Krishna Coming signature month box (from bg_gray_month_box.xml & bg_selected_month_box.xml)
  kcMonthBox: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  kcMonthBoxSelected: {
    backgroundColor: '#FD5580', // Krishna Coming coral accent
    borderColor: '#FD5580',
    shadowColor: '#FD5580',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  kcMonthBoxText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4B5563',
  },
  kcMonthBoxTextSelected: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  kcMonthBoxSub: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  kcMonthBoxSubSelected: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  kcSelectedDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  // Dynamic Pricing Card (Krishna Coming Business Model)
  dynamicPricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  pricingCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pricingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pricingCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  pricingSaveBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pricingSaveBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
  },
  pricingNumbersRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FD5580',
    marginRight: 2,
  },
  mainPriceText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FD5580',
    letterSpacing: -0.5,
  },
  originalPriceText: {
    fontSize: 13,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 8,
    fontWeight: '600',
  },
  priceDurationTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  pricingFeatureDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 10,
  },
  featuresPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureItemText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#4B5563',
  },
  emiBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  emiBannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    textAlign: 'center',
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
    borderColor: '#F3E8FF',
  },
  timelineOptionActive: {
    borderColor: '#FD5580',
    backgroundColor: '#FFF9FA',
  },
  timelineText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1F2937',
  },
  timelineTextActive: {
    color: '#FD5580',
    fontWeight: '800',
  },
  timelineSubText: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 2,
  },
  continueButton: {
    width: '100%',
    height: 56,
    borderRadius: 22,
    backgroundColor: '#FD5580', // Krishna Coming vibrant coral
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FD5580',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  continueButtonText: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
