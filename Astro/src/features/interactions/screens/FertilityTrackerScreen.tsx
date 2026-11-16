import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ArrowLeft,
  Calendar,
  Lock,
  Sparkles,
  Info,
  Heart,
  Droplet,
  Crown,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Edit3,
} from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';

const { width } = Dimensions.get('window');

export const FertilityTrackerScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const user = useAuthStore(state => state.user);
  const journeyData = useAuthStore(state => state.journeyData);
  const isProgramSubscribed = useAuthStore(state => state.isProgramSubscribed);
  const activeSubscriptions = useAuthStore(state => state.activeSubscriptions);

  // Check if user has Beej Sanskar (Garbhadhaan) subscription
  const isBeejSanskarSubscribed =
    isProgramSubscribed('garbhadhaan') ||
    isProgramSubscribed('beej_sanskar') ||
    !!activeSubscriptions['garbhadhaan'] ||
    !!activeSubscriptions['beej_sanskar'];

  // Demo preview toggle for testing/previewing
  const [demoOverride, setDemoOverride] = useState(false);
  const isUnlocked = isBeejSanskarSubscribed || demoOverride;

  // Cycle Parameters
  const [cycleLength, setCycleLength] = useState(28); // Standard 28-day cycle
  const [lmpDate, setLmpDate] = useState<Date>(new Date(Date.now() - 17 * 24 * 60 * 60 * 1000)); // Default ~18 days ago
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Calculate current cycle day (1-based, clamped to 1..cycleLength)
  const diffDays = Math.floor((Date.now() - lmpDate.getTime()) / (24 * 60 * 60 * 1000));
  const currentCycleDay = Math.max(1, (diffDays % cycleLength) + 1);

  // Determine biological phase & conception chance
  const getPhaseInfo = (day: number) => {
    if (day <= 5) {
      return {
        name: isHindi ? 'मासिक धर्म प्रावस्था (Menstrual Phase)' : 'Menstrual Phase',
        chance: isHindi ? 'कम (Low)' : 'Low',
        chanceColor: '#64748B',
        badgeBg: '#F1F5F9',
        desc: isHindi
          ? 'गर्भाशय की आंतरिक परत का नवीनीकरण। सात्विक विश्राम व बीज शुद्धि का समय।'
          : 'Uterine lining shedding and renewal. Ideal time for deep rest & gentle Beej Shuddhi.',
        icon: '🩸',
      };
    }
    if (day <= 9) {
      return {
        name: isHindi ? 'पुटिका प्रावस्था (Follicular Phase)' : 'Follicular Phase',
        chance: isHindi ? 'मध्यम (Moderate)' : 'Moderate',
        chanceColor: '#D97706',
        badgeBg: '#FEF3C7',
        desc: isHindi
          ? 'एस्ट्रोजन हार्मोन में वृद्धि व डिंब का परिपक्व होना। ओजस वर्धक आहार लें।'
          : 'Estrogen rises as ovarian follicles mature. Nourish reproductive tissues with Ojas foods.',
        icon: '🌸',
      };
    }
    if (day <= 14) {
      return {
        name: isHindi ? 'अंडोत्सर्ग प्रावस्था (Ovulation Window)' : 'Ovulation Phase (Peak)',
        chance: isHindi ? 'उच्चतम (Peak)' : 'Peak Fertile',
        chanceColor: '#16A34A',
        badgeBg: '#DCFCE7',
        desc: isHindi
          ? 'परिपक्व डिंब का निकास। गर्भधारण हेतु सर्वाधिक अनुकूल व पवित्र गर्भाधान मुहूर्त।'
          : 'Egg is released into fallopian tube. Prime biological & Vedic Garbhadhaan conception window.',
        icon: '🥚',
      };
    }
    return {
      name: isHindi ? 'पीत प्रावस्था (Luteal Phase)' : 'Luteal Phase',
      chance: day <= 19 ? (isHindi ? 'मध्यम (Moderate)' : 'Moderate') : (isHindi ? 'कम (Low)' : 'Low'),
      chanceColor: day <= 19 ? '#D97706' : '#64748B',
      badgeBg: day <= 19 ? '#FEF3C7' : '#F1F5F9',
      desc: isHindi
        ? 'प्रोजेस्टेरोन हार्मोन का स्राव। गर्भ आरोपण (Implantation) व गर्भाशय पोषण का समय।'
        : 'Progesterone prepares uterine lining for sacred embryo nesting & implantation.',
      icon: '🪷',
    };
  };

  const phase = getPhaseInfo(currentCycleDay);

  // Key projected dates
  const nextPeriodDate = new Date(lmpDate.getTime() + cycleLength * 24 * 60 * 60 * 1000);
  const ovulationDate = new Date(lmpDate.getTime() + 14 * 24 * 60 * 60 * 1000);
  const fertileStart = new Date(lmpDate.getTime() + 10 * 24 * 60 * 60 * 1000);
  const fertileEnd = new Date(lmpDate.getTime() + 15 * 24 * 60 * 60 * 1000);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setLmpDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={22} color="#1E1B4B" />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>
            {isHindi ? 'फर्टिलिटी व ओव्यूलेशन ट्रैकर' : 'Fertility Tracker'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isHindi ? 'आज गर्भधारण की संभावना व ऋतु चक्र' : 'Know Your Conception Chances Today'}
          </Text>
        </View>

        {isUnlocked && (
          <TouchableOpacity
            style={styles.editLmpBtn}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <Edit3 size={13} color="#059669" />
            <Text style={styles.editLmpText}>Edit LMP</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ======================================================== */}
        {/* SUBSCRIPTION GATE / PAYWALL BANNER IF NOT SUBSCRIBED    */}
        {/* ======================================================== */}
        {!isUnlocked && (
          <View style={styles.lockedPaywallCard}>
            <View style={styles.lockCrownWrap}>
              <Crown size={28} color="#D97706" />
            </View>

            <Text style={styles.lockedHeading}>
              {isHindi
                ? 'बीज संस्कार (गर्भधान) विशेष सुविधा 🌸'
                : 'Exclusive to Beej Sanskar Subscribers'}
            </Text>

            <Text style={styles.lockedSubtext}>
              {isHindi
                ? 'यह 28-दिवसीय वैदिक फर्टिलिटी व ओव्यूलेशन ट्रैकर केवल उन माताओं के लिए उपलब्ध है जिन्होंने गर्भधान संस्कार (Pre-Pregnancy) योजना ली है।'
                : 'Accurately track your peak conception window, Beej Shuddhi diet calendar, and auspicious Vedic Garbhadhaan Muhurats to conceive naturally.'}
            </Text>

            <View style={styles.lockedFeaturesList}>
              <View style={styles.featureBulletRow}>
                <CheckCircle2 size={15} color="#15803D" />
                <Text style={styles.featureBulletText}>
                  {isHindi ? '28-दिवसीय ऋतु चक्र व अंडोत्सर्ग (Ovulation) गणना' : 'Interactive 28-Day Cycle Wheel & Ovulation Window'}
                </Text>
              </View>
              <View style={styles.featureBulletRow}>
                <CheckCircle2 size={15} color="#15803D" />
                <Text style={styles.featureBulletText}>
                  {isHindi ? 'दैनिक गर्भाधान संभावना (Peak / High / Low)' : 'Real-time Daily Conception Probability Meter'}
                </Text>
              </View>
              <View style={styles.featureBulletRow}>
                <CheckCircle2 size={15} color="#15803D" />
                <Text style={styles.featureBulletText}>
                  {isHindi ? 'बीज शुद्धि आहार व वैदिक गर्भाधान मुहूर्त' : 'Ayurvedic Beej Shuddhi Diet & Sacred Conception Timing'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.unlockCourseBtn}
              onPress={() => {
                navigation.navigate('Pricing', {
                  selectedMonth: 1,
                  remainingMonths: 3,
                });
              }}
              activeOpacity={0.88}
            >
              <Sparkles size={16} color="#FFFFFF" />
              <Text style={styles.unlockCourseBtnText}>
                {isHindi ? 'गर्भधान (बीज संस्कार) अनलॉक करें →' : 'Unlock Beej Sanskar Course →'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.previewDemoBtn}
              onPress={() => {
                setDemoOverride(true);
                Alert.alert(
                  'Interactive Demo Activated 🌸',
                  'You can now preview the 28-Day Fertility Cycle Wheel in action!'
                );
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.previewDemoBtnText}>
                {isHindi ? 'डेमो पूर्वावलोकन देखें (Try Preview)' : 'Try Interactive Demo Preview'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================== */}
        {/* THE 28-DAY CYCLE WHEEL & CURRENT PHASE (MATCHING IMAGE)   */}
        {/* ======================================================== */}
        <View style={[styles.wheelContainerCard, !isUnlocked && styles.blurredCard]}>
          <Text style={styles.wheelHeaderTitle}>
            {isHindi ? '28-दिवसीय वैदिक ऋतु चक्र' : '28-Day Conception & Ovulation Wheel'}
          </Text>

          {/* Central Circular Dial Display */}
          <View style={styles.circularWheelWrapper}>
            {/* Outer Phase Ring Indicator */}
            <View style={styles.outerWheelRing}>
              {/* Segment 1: Menstrual Phase (Days 1 - 5) */}
              <View style={[styles.phaseArcSegment, styles.menstrualArc]}>
                <Text style={styles.arcLabel}>🩸 1-5 Menstrual</Text>
              </View>

              {/* Segment 2: Follicular Phase (Days 6 - 9) */}
              <View style={[styles.phaseArcSegment, styles.follicularArc]}>
                <Text style={styles.arcLabel}>🌸 6-9 Follicular</Text>
              </View>

              {/* Segment 3: Ovulation Phase (Days 10 - 14) */}
              <View style={[styles.phaseArcSegment, styles.ovulationArc]}>
                <Text style={styles.arcLabel}>🥚 10-14 Ovulation (Peak)</Text>
              </View>

              {/* Segment 4: Luteal Phase (Days 15 - 28) */}
              <View style={[styles.phaseArcSegment, styles.lutealArc]}>
                <Text style={styles.arcLabel}>🪷 15-28 Luteal Phase</Text>
              </View>

              {/* Inner Center Orb */}
              <View style={styles.innerCenterOrb}>
                <Text style={styles.uterusEmoji}>🪷</Text>

                <Text style={styles.innerPhaseIntro}>
                  {isHindi ? 'आप इस चरण में हैं:' : 'You are in'}
                </Text>
                <Text style={styles.innerPhaseName}>{phase.name}</Text>

                {/* Conception Probability Pill */}
                <View style={[styles.conceptionChancePill, { backgroundColor: phase.badgeBg }]}>
                  <Text style={[styles.conceptionChanceText, { color: phase.chanceColor }]}>
                    {isHindi ? 'गर्भधारण संभावना:' : 'Conception Chance:'} {phase.chance}
                  </Text>
                </View>

                {/* Current Day Badge */}
                <View style={styles.cycleDayBadge}>
                  <Text style={styles.cycleDayText}>
                    {isHindi ? 'चक्र दिवस' : 'Cycle Day'} {currentCycleDay} of {cycleLength}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Phase Guidance Description */}
          <View style={styles.phaseGuidanceBox}>
            <Info size={16} color="#059669" />
            <Text style={styles.phaseGuidanceText}>{phase.desc}</Text>
          </View>
        </View>

        {/* ======================================================== */}
        {/* 3 BOTTOM SUMMARY CARDS (MATCHING IMAGE FOOTER)           */}
        {/* ======================================================== */}
        <View style={styles.bottomSummaryRow}>
          {/* Card 1: Next Period Expected */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>
              {isHindi ? 'आगामी मासिक धर्म' : 'Next Period Expected On'}
            </Text>
            <View style={styles.summaryDateWrap}>
              <Text style={styles.summaryDateText}>{formatDate(nextPeriodDate)}</Text>
            </View>
          </View>

          {/* Card 2: Likely Ovulation */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>
              {isHindi ? 'संभावित अंडोत्सर्ग' : 'Likely Ovulation'}
            </Text>
            <View style={[styles.summaryDateWrap, styles.ovulationHighlight]}>
              <Text style={[styles.summaryDateText, { color: '#16A34A' }]}>
                {formatDate(ovulationDate)}
              </Text>
            </View>
          </View>

          {/* Card 3: Most Fertile Period */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>
              {isHindi ? 'सर्वाधिक उर्वर काल' : 'Most Fertile Period'}
            </Text>
            <View style={styles.summaryDateWrap}>
              <Text style={styles.summaryDateText}>
                {formatDate(fertileStart)} - {formatDate(fertileEnd)}
              </Text>
            </View>
          </View>
        </View>

        {/* ======================================================== */}
        {/* AYURVEDIC BEEJ SHUDDHI & PRECONCEPTION TIPS              */}
        {/* ======================================================== */}
        <View style={styles.beejSanskarCard}>
          <View style={styles.beejCardHeader}>
            <Sparkles size={18} color="#D97706" />
            <Text style={styles.beejCardTitle}>
              {isHindi ? 'वैदिक बीज शुद्धि एवं गर्भाधान सूत्र' : 'Ayurvedic Beej Shuddhi Guidelines'}
            </Text>
          </View>

          <View style={styles.beejTipRow}>
            <Text style={styles.beejTipNumber}>1.</Text>
            <Text style={styles.beejTipText}>
              {isHindi
                ? 'उर्वर काल में दंपत्ति का मन शांत, तनावमुक्त व पवित्र भाव से युक्त होना चाहिए।'
                : 'Both partners should cultivate joyful, serene, and stress-free mental states during the fertile window.'}
            </Text>
          </View>

          <View style={styles.beejTipRow}>
            <Text style={styles.beejTipNumber}>2.</Text>
            <Text style={styles.beejTipText}>
              {isHindi
                ? 'गाय का शुद्ध ए2 घी, मुनक्का, बादाम व शतावरी का सेवन डिंब व शुक्राणु की ओजस्विता बढ़ाता है।'
                : 'A2 Cow Ghee, organic almonds, soaked munakka, and Shatavari strengthen reproductive tissues (Shukra & Artava Dhatus).'}
            </Text>
          </View>

          <View style={styles.beejTipRow}>
            <Text style={styles.beejTipNumber}>3.</Text>
            <Text style={styles.beejTipText}>
              {isHindi
                ? 'शुभ गर्भाधान मुहूर्त में संतान गोपाल मंत्र का जाप दिव्य आत्मा के आह्वान में सहायक है।'
                : 'Chanting the sacred Santan Gopal Mantra harmonizes womb energy for welcoming a noble, divine soul.'}
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* LMP Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={lmpDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E1B4B',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 1,
  },
  editLmpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  editLmpText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 12,
  },

  // Locked Paywall Card
  lockedPaywallCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    alignItems: 'center',
  },
  lockCrownWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  lockedHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 6,
  },
  lockedSubtext: {
    fontSize: 12,
    color: '#B45309',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 14,
  },
  lockedFeaturesList: {
    alignSelf: 'stretch',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  featureBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureBulletText: {
    fontSize: 11.5,
    color: '#1E1B4B',
    fontWeight: '600',
    flex: 1,
  },
  unlockCourseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D97706',
    borderRadius: 14,
    paddingVertical: 13,
    alignSelf: 'stretch',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  unlockCourseBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  previewDemoBtn: {
    marginTop: 10,
    paddingVertical: 4,
  },
  previewDemoBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
    textDecorationLine: 'underline',
  },

  // Wheel Card
  wheelContainerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  blurredCard: {
    opacity: 0.85,
  },
  wheelHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 12,
  },
  circularWheelWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  outerWheelRing: {
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: '#F8FAFC',
    borderWidth: 4,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  phaseArcSegment: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  menstrualArc: {
    top: 10,
    backgroundColor: '#FFE4E6',
  },
  follicularArc: {
    right: 8,
    backgroundColor: '#FEF3C7',
  },
  ovulationArc: {
    bottom: 12,
    backgroundColor: '#DCFCE7',
  },
  lutealArc: {
    left: 8,
    backgroundColor: '#F3E8FF',
  },
  arcLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1E1B4B',
  },

  innerCenterOrb: {
    width: 175,
    height: 175,
    borderRadius: 87.5,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#10B981', // Glowing fertile green border
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  uterusEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  innerPhaseIntro: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  innerPhaseName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E1B4B',
    textAlign: 'center',
    marginTop: 1,
  },
  conceptionChancePill: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
    marginTop: 6,
  },
  conceptionChanceText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  cycleDayBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 5,
  },
  cycleDayText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#475569',
  },

  phaseGuidanceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginTop: 14,
    alignSelf: 'stretch',
  },
  phaseGuidanceText: {
    fontSize: 11.5,
    color: '#166534',
    lineHeight: 16,
    flex: 1,
    fontWeight: '600',
  },

  // 3 Bottom Summary Cards
  bottomSummaryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'space-between',
    minHeight: 74,
  },
  summaryCardLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    lineHeight: 13,
  },
  summaryDateWrap: {
    marginTop: 6,
  },
  ovulationHighlight: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  summaryDateText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1E1B4B',
  },

  // Beej Sanskar Ayurvedic Guidelines
  beejSanskarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    gap: 10,
  },
  beejCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  beejCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#92400E',
  },
  beejTipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  beejTipNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  beejTipText: {
    fontSize: 11.5,
    color: '#451A03',
    lineHeight: 16,
    flex: 1,
  },
});
