import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ChevronLeft,
  Scale,
  Calendar,
  Clock,
  TrendingUp,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  Info,
  Activity,
  Heart,
  Baby,
} from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';
import { api } from '~/shared/api';

const { width } = Dimensions.get('window');
const WEIGHT_STORAGE_KEY = '@astrobaby_weight_logs';

interface WeightLog {
  id: string;
  date: string;
  week: number;
  weightKg: number;
  diffKg: number;
  notes?: string;
}

export const WeightTrackerScreen = () => {
  const navigation = useNavigation();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const user = useAuthStore(state => state.user);

  // Default baseline pre-pregnancy weight
  const [prePregnancyWeight, setPrePregnancyWeight] = useState(58);
  const [currentWeek, setCurrentWeek] = useState(20);
  const [inputWeight, setInputWeight] = useState('62.5');
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [isTwin, setIsTwin] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    loadSavedLogs();
  }, []);

  const loadSavedLogs = async () => {
    try {
      const stored = await AsyncStorage.getItem(WEIGHT_STORAGE_KEY);
      if (stored) {
        setWeightLogs(JSON.parse(stored));
      } else {
        // Sample default starting log
        const defaultLogs: WeightLog[] = [
          {
            id: '1',
            date: '10 Oct',
            week: 16,
            weightKg: 60.2,
            diffKg: 2.2,
            notes: 'Steady healthy growth',
          },
          {
            id: '2',
            date: '28 Oct',
            week: 18,
            weightKg: 61.4,
            diffKg: 3.4,
            notes: 'Good appetite, balanced satvik diet',
          },
        ];
        setWeightLogs(defaultLogs);
        await AsyncStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(defaultLogs));
      }
    } catch (e) {
      console.warn('Error loading weight logs:', e);
    }
  };

  const handleSaveWeight = async () => {
    const num = parseFloat(inputWeight);
    if (isNaN(num) || num < 35 || num > 180) {
      Alert.alert(
        isHindi ? 'अमान्य वजन' : 'Invalid Weight',
        isHindi ? 'कृपया 35 से 180 किग्रा के बीच मान्य वजन दर्ज करें।' : 'Please enter a valid weight between 35 and 180 kg.'
      );
      return;
    }

    const diff = parseFloat((num - prePregnancyWeight).toFixed(1));
    const newLog: WeightLog = {
      id: `weight_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      week: currentWeek,
      weightKg: num,
      diffKg: diff,
      notes: diff >= 0 ? `+${diff} kg from baseline` : `${diff} kg from baseline`,
    };

    const updated = [newLog, ...weightLogs];
    setWeightLogs(updated);

    try {
      await AsyncStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(updated));
      await api.post('/api/v1/mom/weight', {
        phone: user?.phone || '9366128220',
        weightKg: num,
        week: currentWeek,
        prePregnancyWeight,
      }).catch(() => {});
    } catch (e) {}

    Alert.alert(
      isHindi ? 'वजन सुरक्षित हुआ! 🌸' : 'Weight Recorded! 🌸',
      isHindi
        ? `आपका वर्तमान वजन ${num} किग्रा सुरक्षित कर लिया गया है।`
        : `Your current gestational weight (${num} kg) has been successfully recorded in your maternal diary.`
    );
  };

  // Target ranges according to Institute of Medicine (IOM)
  const targetMinGain = isTwin ? 16.8 : 11.5;
  const targetMaxGain = isTwin ? 24.5 : 16.0;

  const currentTotalGain =
    weightLogs.length > 0 ? weightLogs[0].diffKg : parseFloat(inputWeight) - prePregnancyWeight;

  const faqs = [
    {
      q: 'What if I lost weight in the first trimester due to morning sickness?',
      a: 'It is very common and normal to lose 1 to 2 kg in the first trimester due to nausea, vomiting, and food aversions. Your baby is tiny and draws required nutrients from your existing body reserves. Weight gain will naturally accelerate in the second trimester.',
    },
    {
      q: 'How much weight should I expect to gain per week?',
      a: 'During the first trimester, total gain is usually 0.5 to 2 kg. In the second and third trimesters, healthy weight gain is typically about 0.4 to 0.5 kg (around 1 pound) per week for a singleton pregnancy.',
    },
    {
      q: 'Where does all the pregnancy weight actually go?',
      a: 'A 12 kg gain breaks down roughly as: Baby (~3.5 kg), Placenta (~0.7 kg), Amniotic Fluid (~0.9 kg), Uterus enlargement (~1.0 kg), Increased Blood Volume (~1.5 kg), Breast Tissue (~0.9 kg), and Maternal Healthy Fat Stores (~3.5 kg) for lactation energy.',
    },
    {
      q: 'How does weight gain differ for twin pregnancies?',
      a: 'For twins, the recommended healthy gain is 17 to 25 kg (37 to 54 lbs) for women with a normal starting BMI. Weight gain starts earlier and averages about 0.7 kg per week in the 2nd and 3rd trimesters.',
    },
    {
      q: 'Should I try a weight-loss diet during pregnancy if I gain too fast?',
      a: 'Never restrict calories or attempt weight loss during pregnancy. Starvation creates ketones that can harm fetal brain development. Instead, cut refined sugars and fried foods, and focus on whole grains, fresh vegetables, pulses, and light prenatal yoga.',
    },
    {
      q: 'How quickly will I return to my pre-pregnancy weight?',
      a: 'You immediately shed 5 to 6 kg at delivery (baby, placenta, fluid). Over the next 6 weeks, blood and fluid volume normalize. Regular breastfeeding and nutrient-dense Ayurvedic postpartum diet help shed remaining stores safely over 6-9 months.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeft size={26} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Weight Gain Tracker</Text>
          <Text style={styles.headerSubtitle}>
            Gestational BMI & Trimester Progression
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Summary Banner */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryWeekLabel}>CURRENT GESTATION</Text>
              <Text style={styles.summaryWeekValue}>Week {currentWeek} (Trimester 2)</Text>
            </View>
            <TouchableOpacity
              style={[styles.twinToggleBtn, isTwin && styles.twinToggleBtnActive]}
              onPress={() => setIsTwin(!isTwin)}
              activeOpacity={0.8}
            >
              <Text style={[styles.twinToggleText, isTwin && styles.twinToggleTextActive]}>
                {isTwin ? '👯‍♀️ Twin Pregnancy' : '👶 Singleton'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryMetricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Baseline (Pre-Preg)</Text>
              <Text style={styles.metricValue}>{prePregnancyWeight} kg</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Current Total Gain</Text>
              <Text style={[styles.metricValue, { color: '#0284C7' }]}>
                {currentTotalGain >= 0 ? `+${currentTotalGain.toFixed(1)}` : currentTotalGain.toFixed(1)} kg
              </Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Target Full Term</Text>
              <Text style={[styles.metricValue, { color: '#059669' }]}>
                {targetMinGain}-{targetMaxGain} kg
              </Text>
            </View>
          </View>
        </View>

        {/* Interactive Weight Log Card */}
        <View style={styles.inputCard}>
          <Text style={styles.inputCardTitle}>Record Today's Weight</Text>
          <Text style={styles.inputCardSub}>
            Weigh yourself once a week, preferably in the morning before breakfast
          </Text>

          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepperCircleBtn}
              onPress={() => {
                const val = (parseFloat(inputWeight) || 60) - 0.5;
                setInputWeight(val.toFixed(1));
              }}
            >
              <Minus size={20} color="#0284C7" strokeWidth={2.5} />
            </TouchableOpacity>

            <View style={styles.stepperCenterBox}>
              <TextInput
                style={styles.weightNumberInput}
                value={inputWeight}
                onChangeText={setInputWeight}
                keyboardType="numeric"
              />
              <Text style={styles.weightKgUnit}>kg</Text>
            </View>

            <TouchableOpacity
              style={styles.stepperCircleBtn}
              onPress={() => {
                const val = (parseFloat(inputWeight) || 60) + 0.5;
                setInputWeight(val.toFixed(1));
              }}
            >
              <Plus size={20} color="#0284C7" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.saveLogBtn}
            onPress={handleSaveWeight}
            activeOpacity={0.88}
          >
            <Scale size={18} color="#FFFFFF" />
            <Text style={styles.saveLogBtnText}>Save Gestational Weight Log</Text>
          </TouchableOpacity>
        </View>

        {/* Trimester Progression Milestones */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Where Does Your Weight Go?</Text>
          <Text style={styles.sectionSubtitle}>
            Estimated distribution of a healthy 12 kg pregnancy gain
          </Text>

          <View style={styles.distributionList}>
            {[
              { label: 'Baby Birth Weight', val: '~3.5 kg', icon: '👶' },
              { label: 'Maternal Nutrient & Fat Stores', val: '~3.5 kg', icon: '⚡' },
              { label: 'Increased Blood Volume', val: '~1.5 kg', icon: '🩸' },
              { label: 'Uterus Muscle Enlargement', val: '~1.0 kg', icon: '🌸' },
              { label: 'Amniotic Fluid', val: '~0.9 kg', icon: '💧' },
              { label: 'Breast Tissue & Colostrum', val: '~0.9 kg', icon: '🥛' },
              { label: 'Placenta Support', val: '~0.7 kg', icon: '🌿' },
            ].map((item, i) => (
              <View key={i} style={styles.distributionRow}>
                <View style={styles.distLeft}>
                  <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                  <Text style={styles.distLabel}>{item.label}</Text>
                </View>
                <Text style={styles.distValue}>{item.val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Past Weight Logs History */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Weight Gain History Log</Text>

          {weightLogs.map(log => (
            <View key={log.id} style={styles.historyLogItem}>
              <View style={styles.historyLeftCol}>
                <Text style={styles.historyWeekText}>Week {log.week}</Text>
                <Text style={styles.historyDateText}>{log.date}</Text>
              </View>

              <View style={styles.historyRightCol}>
                <Text style={styles.historyWeightVal}>{log.weightKg} kg</Text>
                <View
                  style={[
                    styles.gainPill,
                    log.diffKg >= 0 ? styles.gainPillPositive : styles.gainPillNegative,
                  ]}
                >
                  <Text
                    style={[
                      styles.gainPillText,
                      log.diffKg >= 0
                        ? { color: '#0284C7' }
                        : { color: '#D97706' },
                    ]}
                  >
                    {log.diffKg >= 0 ? `+${log.diffKg}` : log.diffKg} kg
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Frequently Asked Questions */}
        <View style={styles.faqSection}>
          <Text style={styles.faqSectionTitle}>Frequently Asked Questions</Text>

          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <View key={idx} style={styles.faqAccordionCard}>
                <TouchableOpacity
                  style={styles.faqQuestionRow}
                  onPress={() => setExpandedFaq(isExpanded ? null : idx)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.faqQuestionText}>{faq.q}</Text>
                  <View style={styles.faqPlusBox}>
                    {isExpanded ? (
                      <Minus size={16} color="#0F172A" />
                    ) : (
                      <Plus size={16} color="#0F172A" />
                    )}
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswerText}>{faq.a}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  summaryCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    marginBottom: 16,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  summaryWeekLabel: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#0369A1',
    letterSpacing: 0.6,
  },
  summaryWeekValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  twinToggleBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  twinToggleBtnActive: {
    backgroundColor: '#FCE7F3',
    borderColor: '#F472B6',
  },
  twinToggleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  twinToggleTextActive: {
    color: '#BE185D',
  },
  summaryMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  inputCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  inputCardSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 16,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 18,
  },
  stepperCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperCenterBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  weightNumberInput: {
    fontSize: 40,
    fontWeight: '900',
    color: '#0F172A',
    minWidth: 100,
    textAlign: 'center',
  },
  weightKgUnit: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748B',
  },
  saveLogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0284C7',
    borderRadius: 16,
    paddingVertical: 14,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveLogBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  distributionList: {
    gap: 8,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  distLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  distValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  historyLogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  historyLeftCol: {
    gap: 2,
  },
  historyWeekText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  historyDateText: {
    fontSize: 11,
    color: '#64748B',
  },
  historyRightCol: {
    alignItems: 'flex-end',
    gap: 3,
  },
  historyWeightVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  gainPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gainPillPositive: {
    backgroundColor: '#E0F2FE',
  },
  gainPillNegative: {
    backgroundColor: '#FEF3C7',
  },
  gainPillText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  faqSection: {
    marginBottom: 16,
  },
  faqSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  faqAccordionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  faqQuestionText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    paddingRight: 10,
  },
  faqPlusBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqAnswerContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  faqAnswerText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
});
