import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeft,
  Droplets,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Heart,
  ShieldCheck,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const TARGET_PRESETS = [2000, 2500, 3000];

export const WaterIntakeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const [intake, setIntake] = useState(1500); // in ml
  const [target, setTarget] = useState(2500); // in ml
  const [streak, setStreak] = useState(4);
  const [history, setHistory] = useState<string[]>(['10:00 AM: +250ml', '11:45 AM: +250ml', '01:30 PM: +500ml', '03:15 PM: +500ml']);

  const todayKey = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadSavedWater();
  }, []);

  const loadSavedWater = async () => {
    try {
      const saved = await AsyncStorage.getItem(`@astrobaby_water_${todayKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.intake === 'number') setIntake(parsed.intake);
        if (typeof parsed.target === 'number') setTarget(parsed.target);
        if (Array.isArray(parsed.history)) setHistory(parsed.history);
      }
    } catch (e) {
      // defaults
    }
  };

  const persistWater = async (newIntake: number, newHistory: string[]) => {
    try {
      await AsyncStorage.setItem(
        `@astrobaby_water_${todayKey}`,
        JSON.stringify({ intake: newIntake, target, history: newHistory })
      );
    } catch (e) {}
  };

  const addWater = (amount: number, label: string) => {
    const updated = intake + amount;
    setIntake(updated);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntry = `${timeStr}: +${amount}ml (${label})`;
    const updatedHistory = [newEntry, ...history.slice(0, 9)];
    setHistory(updatedHistory);
    persistWater(updated, updatedHistory);

    if (updated >= target && intake < target) {
      Alert.alert(
        isHindi ? 'दैनिक लक्ष्य पूर्ण! 🌸💧' : 'Hydration Goal Achieved! 🌸💧',
        isHindi
          ? 'बधाई! आपने आज का 2.5 लीटर जल सेवन लक्ष्य पूरा कर लिया है। शिशु का एम्नियोटिक द्रव और रक्त संचार स्वस्थ है।'
          : 'Congratulations! You reached your daily hydration target. Your amniotic fluid levels & fetal blood circulation are well supported.'
      );
    }
  };

  const undoWater = () => {
    if (intake <= 0) return;
    const updated = Math.max(0, intake - 250);
    setIntake(updated);
    const updatedHistory = history.slice(1);
    setHistory(updatedHistory);
    persistWater(updated, updatedHistory);
  };

  const resetToday = () => {
    Alert.alert(
      isHindi ? 'रीसेट करें?' : 'Reset Tracker?',
      isHindi ? 'क्या आप आज का जल सेवन शून्य करना चाहते हैं?' : 'Are you sure you want to reset today’s water intake?',
      [
        { text: isHindi ? 'रद्द करें' : 'Cancel', style: 'cancel' },
        {
          text: isHindi ? 'रीसेट' : 'Reset',
          style: 'destructive',
          onPress: () => {
            setIntake(0);
            setHistory([]);
            persistWater(0, []);
          },
        },
      ]
    );
  };

  const progressPercent = Math.min(100, Math.round((intake / target) * 100));
  const glassesCount = (intake / 250).toFixed(1);
  const targetGlasses = target / 250;

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
            {isHindi ? 'जल सेवन व हाइड्रेशन ट्रैकर' : 'Water Intake & Hydration Tracker'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isHindi ? 'एम्नियोटिक द्रव व शिशु स्वास्थ्य के लिए' : 'Vital for amniotic fluid & baby nourishment'}
          </Text>
        </View>

        <TouchableOpacity style={styles.resetBtn} onPress={resetToday} activeOpacity={0.7}>
          <RotateCcw size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ======================================================== */}
        {/* 1. MAIN HYDRATION TANK & PROGRESS CARD                  */}
        {/* ======================================================== */}
        <View style={styles.mainProgressCard}>
          <View style={styles.progressTopRow}>
            <View style={styles.streakBadge}>
              <Award size={14} color="#D97706" />
              <Text style={styles.streakBadgeText}>
                {streak} {isHindi ? 'दिनों की स्ट्रीक' : 'Days Streak'}
              </Text>
            </View>

            <View style={[styles.statusBadge, progressPercent >= 100 ? styles.statusBadgeDone : styles.statusBadgeActive]}>
              <Text style={[styles.statusBadgeText, progressPercent >= 100 ? styles.statusBadgeTextDone : styles.statusBadgeTextActive]}>
                {progressPercent >= 100
                  ? (isHindi ? '✓ लक्ष्य पूर्ण' : '✓ Goal Reached')
                  : `${progressPercent}% ${isHindi ? 'पूर्ण' : 'Completed'}`}
              </Text>
            </View>
          </View>

          {/* Central Glass Graphic & Number */}
          <View style={styles.waterGraphicBox}>
            <View style={styles.glassContainer}>
              <View style={[styles.waterFill, { height: `${Math.min(100, Math.max(8, progressPercent))}%` }]} />
              <View style={styles.glassOverlay}>
                <Droplets size={36} color="#0284C7" />
                <Text style={styles.glassNumberText}>{intake}</Text>
                <Text style={styles.glassUnitText}>ml / {target} ml</Text>
              </View>
            </View>
          </View>

          {/* Glasses Sub-counter */}
          <View style={styles.glassesCounterRow}>
            <Text style={styles.glassesCounterText}>
              🥛 {glassesCount} / {targetGlasses} {isHindi ? 'गिलास पानी' : 'glasses logged today'}
            </Text>
          </View>

          {/* Quick Target Setter */}
          <View style={styles.targetPresetRow}>
            <Text style={styles.targetPresetLabel}>
              {isHindi ? 'दैनिक लक्ष्य:' : 'Daily Target:'}
            </Text>
            {TARGET_PRESETS.map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.targetChip, target === p && styles.targetChipActive]}
                onPress={() => setTarget(p)}
                activeOpacity={0.8}
              >
                <Text style={[styles.targetChipText, target === p && styles.targetChipTextActive]}>
                  {(p / 1000).toFixed(1)}L
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ======================================================== */}
        {/* 2. QUICK LOGGING BUTTONS                                 */}
        {/* ======================================================== */}
        <Text style={styles.sectionHeading}>
          {isHindi ? 'पानी दर्ज करें (Quick Log)' : 'Quick Log Drinks'}
        </Text>

        <View style={styles.quickAddGrid}>
          {/* +250ml Glass */}
          <TouchableOpacity
            style={styles.quickAddBtn}
            onPress={() => addWater(250, 'Glass')}
            activeOpacity={0.85}
          >
            <View style={[styles.quickAddIconWrap, { backgroundColor: '#E0F2FE' }]}>
              <Text style={styles.quickAddEmoji}>🥛</Text>
            </View>
            <Text style={styles.quickAddTitle}>+250 ml</Text>
            <Text style={styles.quickAddSub}>{isHindi ? '1 गिलास' : '1 Glass'}</Text>
          </TouchableOpacity>

          {/* +500ml Bottle */}
          <TouchableOpacity
            style={styles.quickAddBtn}
            onPress={() => addWater(500, 'Bottle')}
            activeOpacity={0.85}
          >
            <View style={[styles.quickAddIconWrap, { backgroundColor: '#DBEAFE' }]}>
              <Text style={styles.quickAddEmoji}>🍼</Text>
            </View>
            <Text style={styles.quickAddTitle}>+500 ml</Text>
            <Text style={styles.quickAddSub}>{isHindi ? '1 बोतल' : '1 Bottle'}</Text>
          </TouchableOpacity>

          {/* +150ml Coconut / Infusion */}
          <TouchableOpacity
            style={styles.quickAddBtn}
            onPress={() => addWater(150, 'Coconut / Herbal')}
            activeOpacity={0.85}
          >
            <View style={[styles.quickAddIconWrap, { backgroundColor: '#DCFCE7' }]}>
              <Text style={styles.quickAddEmoji}>🥥</Text>
            </View>
            <Text style={styles.quickAddTitle}>+150 ml</Text>
            <Text style={styles.quickAddSub}>{isHindi ? 'नारियल पानी' : 'Coconut / Tea'}</Text>
          </TouchableOpacity>

          {/* Undo Button */}
          <TouchableOpacity
            style={[styles.quickAddBtn, styles.undoBtn]}
            onPress={undoWater}
            activeOpacity={0.85}
          >
            <View style={[styles.quickAddIconWrap, { backgroundColor: '#F1F5F9' }]}>
              <Minus size={18} color="#64748B" />
            </View>
            <Text style={[styles.quickAddTitle, { color: '#64748B' }]}>-250 ml</Text>
            <Text style={styles.quickAddSub}>{isHindi ? 'हटाएं' : 'Undo'}</Text>
          </TouchableOpacity>
        </View>

        {/* ======================================================== */}
        {/* 3. MATERNAL HEALTH WHY HYDRATION MATTERS                 */}
        {/* ======================================================== */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeaderRow}>
            <ShieldCheck size={18} color="#0284C7" />
            <Text style={styles.infoCardTitle}>
              {isHindi ? 'गर्भावस्था में जल सेवन का वैज्ञानिक महत्व' : 'Why Hydration Matters for Baby'}
            </Text>
          </View>

          <View style={styles.benefitRow}>
            <Text style={styles.benefitBullet}>🫧</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.benefitTitle}>
                {isHindi ? 'एम्नियोटिक द्रव का नवीनीकरण' : 'Replenishes Amniotic Fluid'}
              </Text>
              <Text style={styles.benefitDesc}>
                {isHindi
                  ? 'शिशु का एम्नियोटिक द्रव हर 3 घंटे में पुनः रीसायकल होता है। पर्याप्त जल सेवन इसे स्वच्छ व पर्याप्त रखता है।'
                  : 'Amniotic fluid is fully exchanged every 3 hours. Proper water intake keeps volume healthy and prevents oligohydramnios.'}
              </Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <Text style={styles.benefitBullet}>🩺</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.benefitTitle}>
                {isHindi ? 'ब्रेक्सटन हिक्स (फाल्स लेबर) से बचाव' : 'Prevents False Contractions'}
              </Text>
              <Text style={styles.benefitDesc}>
                {isHindi
                  ? 'गर्भाशय की मांसपेशियों में ऐंठन व समय-पूर्व दर्द का मुख्य कारण निर्जलीकरण (Dehydration) होता है।'
                  : 'Dehydration causes uterine muscle irritability and painful Braxton Hicks contractions.'}
              </Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <Text style={styles.benefitBullet}>🌿</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.benefitTitle}>
                {isHindi ? 'वैदिक आयुर्वेदिक नियम' : 'Ayurvedic Water Rule'}
              </Text>
              <Text style={styles.benefitDesc}>
                {isHindi
                  ? 'हमेशा बैठकर घूंट-घूंट करके गुनगुना या कमरे के तापमान का पानी पिएं। भोजन के तुरंत बाद ठंडा पानी न पिएं।'
                  : 'Sip warm or room-temperature water slowly while seated. Avoid icy cold water immediately after meals to preserve digestive Agni.'}
              </Text>
            </View>
          </View>
        </View>

        {/* ======================================================== */}
        {/* 4. HOURLY HYDRATION SCHEDULE                             */}
        {/* ======================================================== */}
        <View style={styles.scheduleCard}>
          <View style={styles.infoHeaderRow}>
            <Clock size={16} color="#7C3AED" />
            <Text style={styles.scheduleCardTitle}>
              {isHindi ? 'दैनिक जल सेवन समय-सारणी' : 'Ideal Daily Hydration Routine'}
            </Text>
          </View>

          <View style={styles.timelineRow}>
            <View style={styles.timelineDot} />
            <Text style={styles.timelineTime}>07:30 AM</Text>
            <Text style={styles.timelineText}>{isHindi ? 'प्रातः काल: 1 गिलास गुनगुना पानी' : 'Wake-up: 1 glass warm water'}</Text>
          </View>

          <View style={styles.timelineRow}>
            <View style={styles.timelineDot} />
            <Text style={styles.timelineTime}>10:30 AM</Text>
            <Text style={styles.timelineText}>{isHindi ? 'मध्य-पूर्वाह्न: 1 गिलास ताजा नारियल पानी' : 'Mid-morning: Coconut water'}</Text>
          </View>

          <View style={styles.timelineRow}>
            <View style={styles.timelineDot} />
            <Text style={styles.timelineTime}>01:00 PM</Text>
            <Text style={styles.timelineText}>{isHindi ? 'दोपहर: भोजन से 30 मिनट पूर्व 1 गिलास' : 'Pre-lunch: 1 glass 30m before'}</Text>
          </View>

          <View style={styles.timelineRow}>
            <View style={styles.timelineDot} />
            <Text style={styles.timelineTime}>04:30 PM</Text>
            <Text style={styles.timelineText}>{isHindi ? 'शाम: नींबू-पानी या सादा जल' : 'Evening: Lemon water / infusion'}</Text>
          </View>

          <View style={styles.timelineRow}>
            <View style={styles.timelineDot} />
            <Text style={styles.timelineTime}>08:30 PM</Text>
            <Text style={styles.timelineText}>{isHindi ? 'रात्रि: सोने से पूर्व हल्का घूंट' : 'Night: Gentle sips before bed'}</Text>
          </View>
        </View>

        {/* ======================================================== */}
        {/* 5. TODAY'S RECENT LOGS                                   */}
        {/* ======================================================== */}
        {history.length > 0 && (
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>
              {isHindi ? 'आज के सेवन रिकॉर्ड' : 'Today’s Log History'}
            </Text>
            {history.map((h, idx) => (
              <View key={idx} style={styles.historyRow}>
                <CheckCircle2 size={13} color="#0284C7" />
                <Text style={styles.historyText}>{h}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F9FF', // Gentle serene sky blue
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0F2FE',
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
    color: '#0C4A6E',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '500',
    marginTop: 1,
  },
  resetBtn: {
    padding: 6,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 12,
  },

  // Main Card
  mainProgressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: '#E0F2FE',
  },
  statusBadgeDone: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusBadgeTextActive: {
    color: '#0369A1',
  },
  statusBadgeTextDone: {
    color: '#15803D',
  },

  // Center Glass
  waterGraphicBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  glassContainer: {
    width: 130,
    height: 150,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    borderWidth: 3,
    borderColor: '#38BDF8',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  waterFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#38BDF8',
    opacity: 0.35,
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassNumberText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0C4A6E',
    marginTop: 4,
  },
  glassUnitText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },

  glassesCounterRow: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  glassesCounterText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0369A1',
  },

  targetPresetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F9FF',
    paddingTop: 12,
  },
  targetPresetLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  targetChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  targetChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  targetChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  targetChipTextActive: {
    color: '#FFFFFF',
  },

  // Quick Add Grid
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0C4A6E',
    marginTop: 4,
    marginLeft: 4,
  },
  quickAddGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAddBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0F2FE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  undoBtn: {
    borderColor: '#E2E8F0',
  },
  quickAddIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickAddEmoji: {
    fontSize: 18,
  },
  quickAddTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
  },
  quickAddSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },

  // Benefits Card
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0F2FE',
    gap: 12,
  },
  infoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  infoCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0C4A6E',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  benefitBullet: {
    fontSize: 16,
    marginTop: 1,
  },
  benefitTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0C4A6E',
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },

  // Schedule
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    gap: 10,
  },
  scheduleCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#4C1D95',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 2,
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C3AED',
  },
  timelineTime: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6D28D9',
    width: 65,
  },
  timelineText: {
    fontSize: 11.5,
    color: '#334155',
    flex: 1,
  },

  // History
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0F2FE',
    gap: 8,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0C4A6E',
    marginBottom: 4,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyText: {
    fontSize: 11,
    color: '#475569',
  },
});
