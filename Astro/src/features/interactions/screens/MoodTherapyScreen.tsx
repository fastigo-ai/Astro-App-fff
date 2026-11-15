import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Vibration,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeft,
  Wind,
  Sparkles,
  Volume2,
  Play,
  Pause,
  CheckCircle2,
  Calendar,
  Flower2,
} from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';

const { width } = Dimensions.get('window');

interface MoodOption {
  id: string;
  emoji: string;
  titleEn: string;
  titleHi: string;
  subEn: string;
  subHi: string;
  affirmationEn: string;
  affirmationHi: string;
  bgColor: string;
  accentColor: string;
}

const MOODS: MoodOption[] = [
  {
    id: 'blessed',
    emoji: '🌸',
    titleEn: 'Peaceful',
    titleHi: 'प्रसन्न',
    subEn: 'Feeling serene and spiritually connected',
    subHi: 'मन में शांति और गर्भस्थ शिशु से आत्मीयता',
    affirmationEn: 'My inner peace surrounds my baby with love and divine purity.',
    affirmationHi: 'मेरी आंतरिक शांति मेरे शिशु को ईश्वरीय प्रेम और शक्ति प्रदान कर रही है।',
    bgColor: '#FDF2F8',
    accentColor: '#DB2777',
  },
  {
    id: 'loving',
    emoji: '💖',
    titleEn: 'Joyful',
    titleHi: 'आनंदित',
    subEn: 'Full of gratitude for this miracle',
    subHi: 'शिशु के आगमन की उत्सुकता और अपार स्नेह',
    affirmationEn: 'Every beat of my heart whispers unconditional love to my little one.',
    affirmationHi: 'मेरी हर धड़कन मेरे नन्हे शिशु को असीम वात्सल्य और सुरक्षा दे रही है।',
    bgColor: '#FFF1F2',
    accentColor: '#E11D48',
  },
  {
    id: 'tired',
    emoji: '🥱',
    titleEn: 'Tired',
    titleHi: 'थकान',
    subEn: 'Growing a human is hard work; need rest',
    subHi: 'शरीर को विश्राम और पोषण की आवश्यकता है',
    affirmationEn: 'I give myself permission to rest. In stillness, my baby flourishes.',
    affirmationHi: 'मैं स्वयं को विश्राम देती हूँ। शांत विश्राम में ही शिशु का उत्तम विकास होता है।',
    bgColor: '#FEF3C7',
    accentColor: '#D97706',
  },
  {
    id: 'anxious',
    emoji: '🌧️',
    titleEn: 'Anxious',
    titleHi: 'चिंतित',
    subEn: 'Worries about health or birth are normal',
    subHi: 'मन में कुछ उलझनें या स्वास्थ्य की चिंताएं',
    affirmationEn: 'I release all fears. My body is designed by nature to protect and nourish.',
    affirmationHi: 'मैं सभी चिंताओं को त्यागती हूँ। प्रकृति ने मेरे शरीर को शिशु की रक्षा के लिए रचा है।',
    bgColor: '#EFF6FF',
    accentColor: '#2563EB',
  },
  {
    id: 'restless',
    emoji: '⚡',
    titleEn: 'Overwhelmed',
    titleHi: 'तनाव',
    subEn: 'Too many thoughts; need to breathe & reset',
    subHi: 'थकावट और विचारों का दबाव, शांति की खोज',
    affirmationEn: 'One breath at a time. I breathe in sacred calm and exhale tension.',
    affirmationHi: 'एक गहरा श्वास... मैं शांति ग्रहण करती हूँ और तनाव को बाहर छोड़ती हूँ।',
    bgColor: '#FAF5FF',
    accentColor: '#7C3AED',
  },
];

const STORAGE_KEY = '@astrobaby_mood_logs';

export const MoodTherapyScreen = () => {
  const navigation = useNavigation();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const user = useAuthStore((state) => state.user);

  const [selectedMood, setSelectedMood] = useState<MoodOption>(MOODS[0]);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathTimer, setBreathTimer] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  // Breathing animation
  const breathAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadRecentLogs();
  }, []);

  const loadRecentLogs = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentLogs(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Error loading mood logs:', e);
    }
  };

  const safeVibrate = (duration = 40) => {
    if (Platform.OS !== 'web') {
      try {
        Vibration.vibrate(duration);
      } catch (err) {}
    }
  };

  // 4-4-4 Box Breathing cycle
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          const next = (prev + 1) % 12;
          if (next === 0) {
            setBreathPhase('inhale');
            safeVibrate(50);
            Animated.timing(breathAnim, {
              toValue: 1.25,
              duration: 4000,
              useNativeDriver: true,
            }).start();
          } else if (next === 4) {
            setBreathPhase('hold');
            safeVibrate(30);
          } else if (next === 8) {
            setBreathPhase('exhale');
            safeVibrate(40);
            Animated.timing(breathAnim, {
              toValue: 1,
              duration: 4000,
              useNativeDriver: true,
            }).start();
          }
          return next;
        });
      }, 1000);
    } else {
      Animated.timing(breathAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
      setBreathTimer(0);
      setBreathPhase('inhale');
    }
    return () => clearInterval(interval);
  }, [breathingActive]);

  const handleSelectMood = (mood: MoodOption) => {
    setSelectedMood(mood);
    safeVibrate(25);
  };

  const handleSaveMood = async () => {
    safeVibrate(40);
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      moodId: selectedMood.id,
      title: isHindi ? selectedMood.titleHi : selectedMood.titleEn,
      emoji: selectedMood.emoji,
    };

    const updated = [newEntry, ...recentLogs.slice(0, 9)];
    setRecentLogs(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    Alert.alert(
      isHindi ? 'चेक-इन सहेजा गया 🌸' : 'Mood Recorded! 🌸',
      isHindi
        ? 'आपके मन की स्थिति दर्ज हो गई है। शांत मन से शिशु को सकारात्मक ऊर्जा मिलती है।'
        : 'Your mood check-in is saved in your maternal health diary. Nurturing your peace nurtures your baby.'
    );
  };

  const getBreathPhaseText = () => {
    if (breathPhase === 'inhale') {
      return isHindi ? 'श्वास लें (Inhale)' : 'Breathe In Peace...';
    } else if (breathPhase === 'hold') {
      return isHindi ? 'रोकें (Hold Gently)' : 'Hold Gently...';
    } else {
      return isHindi ? 'श्वास छोड़ें (Exhale)' : 'Breathe Out Tension...';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>
            {isHindi ? 'मन का मिजाज़ व शांत मन' : 'Mood Check-in & Therapy'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isHindi ? 'माँ का शांत मन, शिशु का उत्तम विकास' : 'Calm Mind • Maternal Peace'}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mood Section Question */}
        <View style={styles.questionSection}>
          <Text style={styles.questionTitle}>
            {isHindi ? 'आज मम्मा कैसा महसूस कर रही हैं?' : 'How is Mumma feeling today?'}
          </Text>
        </View>

        {/* Minimal Circle Mood Avatars (Centered, Sleek) */}
        <View style={styles.moodsRow}>
          {MOODS.map((mood) => {
            const isSelected = selectedMood.id === mood.id;
            return (
              <TouchableOpacity
                key={mood.id}
                style={styles.moodItem}
                activeOpacity={0.8}
                onPress={() => handleSelectMood(mood)}
              >
                <View
                  style={[
                    styles.moodCircle,
                    { backgroundColor: mood.bgColor },
                    isSelected && styles.moodCircleSelected,
                  ]}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  {isSelected && <View style={styles.selectedMoodDot} />}
                </View>
                <Text
                  style={[
                    styles.moodTitle,
                    isSelected && styles.moodTitleSelected,
                  ]}
                  numberOfLines={1}
                >
                  {isHindi ? mood.titleHi : mood.titleEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Clean, Serene Maternal Affirmation Card */}
        <View style={styles.affirmationCard}>
          <View style={styles.affirmationHeader}>
            <Sparkles size={14} color="#D97706" />
            <Text style={styles.affirmationTag}>
              {isHindi ? 'मातृ संकल्प' : 'Daily Maternal Affirmation'}
            </Text>
          </View>
          <Text style={styles.affirmationText}>
            &ldquo;{isHindi ? selectedMood.affirmationHi : selectedMood.affirmationEn}&rdquo;
          </Text>
        </View>

        {/* Instant Calming Therapy: Pranayama Breathing Orb */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Wind size={20} color="#1E1B4B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>
                {isHindi ? 'सुख प्राणायाम (4-4-4)' : 'Calming Pranayama (4-4-4)'}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {isHindi
                  ? '2 मिनट का गहरा श्वास शिशु तक ऑक्सीजन पहुंचाता है'
                  : '2 minutes to calm fetal stress hormones'}
              </Text>
            </View>
          </View>

          {/* Serene Pulsing Breath Orb */}
          <View style={styles.breathArea}>
            <Animated.View
              style={[
                styles.breathCircleOuter,
                { transform: [{ scale: breathAnim }] },
              ]}
            >
              <View style={styles.breathCircleInner}>
                <Flower2 size={30} color="#059669" />
                <Text style={styles.breathPhaseText}>
                  {getBreathPhaseText()}
                </Text>
              </View>
            </Animated.View>
          </View>

          {/* Breathing Action Button */}
          <TouchableOpacity
            style={[
              styles.breathBtn,
              breathingActive ? styles.breathBtnStop : styles.breathBtnStart,
            ]}
            activeOpacity={0.88}
            onPress={() => setBreathingActive(!breathingActive)}
          >
            {breathingActive ? (
              <>
                <Pause size={17} color="#FFF" />
                <Text style={styles.breathBtnText}>
                  {isHindi ? 'विश्राम रोकें' : 'Pause Breathwork'}
                </Text>
              </>
            ) : (
              <>
                <Play size={17} color="#FFF" fill="#FFF" />
                <Text style={styles.breathBtnText}>
                  {isHindi ? 'प्राणायाम शुरू करें' : 'Begin Calm Breathing'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Sound Therapy & Sacred Shloka Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Volume2 size={20} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>
                {isHindi ? 'शांत नाद व वैदिक श्लोक' : 'Soothing Soundscape & Shloka'}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {isHindi
                  ? 'पवित्र ध्वनि तरंगें मन को शांत करती हैं'
                  : 'Vedic frequencies for mother & baby tranquility'}
              </Text>
            </View>
          </View>

          {/* Shloka Card */}
          <View style={styles.shlokaBox}>
            <Text style={styles.shlokaSanskrit}>
              ॥ ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥
            </Text>
            <Text style={styles.shlokaMeaning}>
              {isHindi
                ? 'हे परमात्मा, उस प्राणस्वरूप, दुःखनाशक तेजस्वी परमात्मा को हम अंतःकरण में धारण करें, जो हमारी व शिशु की बुद्धि को सन्मार्ग पर प्रेरित करे।'
                : 'May the divine light of wisdom dispel all fears, blessing both mother and womb with auspicious serenity.'}
            </Text>
          </View>

          {/* Audio Player Card */}
          <View style={styles.audioPlayerCard}>
            <View style={styles.audioDetails}>
              <Text style={styles.audioTitle}>
                {isHindi ? 'बांसुरी व मंदिर की घंटियां' : 'Temple Bells & Soothing Flute'}
              </Text>
              <Text style={styles.audioDuration}>432Hz Womb Relaxation • 10 Mins</Text>
            </View>
            <TouchableOpacity
              style={styles.audioPlayBtn}
              activeOpacity={0.85}
              onPress={() => {
                setIsPlayingAudio(!isPlayingAudio);
                safeVibrate(30);
              }}
            >
              {isPlayingAudio ? (
                <Pause size={17} color="#FFF" />
              ) : (
                <Play size={17} color="#FFF" fill="#FFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Today's Mood Check-in */}
        <TouchableOpacity
          style={styles.saveCheckinBtn}
          activeOpacity={0.88}
          onPress={handleSaveMood}
        >
          <CheckCircle2 size={18} color="#FFF" />
          <Text style={styles.saveCheckinBtnText}>
            {isHindi ? 'आज का मिजाज़ सुरक्षित करें' : 'Save Mood to Health Diary'}
          </Text>
        </TouchableOpacity>

        {/* Past Mood History */}
        {recentLogs.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#F1F5F9' }]}>
                <Calendar size={18} color="#0F172A" />
              </View>
              <Text style={styles.sectionTitle}>
                {isHindi ? 'हाल का मिजाज़ इतिहास' : 'Recent Mood Journal'}
              </Text>
            </View>
            {recentLogs.slice(0, 4).map((item) => (
              <View key={item.id} style={styles.logItem}>
                <Text style={styles.logEmoji}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.logTitle}>{item.title}</Text>
                  <Text style={styles.logDate}>{item.date}</Text>
                </View>
                <View style={styles.checkDoneBadge}>
                  <Text style={styles.checkDoneText}>{isHindi ? 'दर्ज ✓' : 'Saved ✓'}</Text>
                </View>
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  questionSection: {
    marginBottom: 12,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  moodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  moodItem: {
    alignItems: 'center',
    flex: 1,
  },
  moodCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  moodCircleSelected: {
    borderWidth: 2.5,
    borderColor: '#1E1B4B',
    transform: [{ scale: 1.08 }],
    shadowOpacity: 0.15,
  },
  moodEmoji: {
    fontSize: 24,
  },
  selectedMoodDot: {
    position: 'absolute',
    bottom: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1E1B4B',
  },
  moodTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },
  moodTitleSelected: {
    color: '#1E1B4B',
    fontWeight: '800',
  },
  affirmationCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  affirmationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  affirmationTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  affirmationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  breathArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  breathCircleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathCircleInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  breathPhaseText: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    color: '#047857',
    marginTop: 4,
  },
  breathBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
    gap: 8,
    alignSelf: 'center',
  },
  breathBtnStart: {
    backgroundColor: '#1E1B4B',
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  breathBtnStop: {
    backgroundColor: '#DC2626',
  },
  breathBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  shlokaBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  shlokaSanskrit: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 6,
  },
  shlokaMeaning: {
    fontSize: 11.5,
    color: '#78350F',
    lineHeight: 17,
    textAlign: 'center',
    fontWeight: '500',
  },
  audioPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  audioDetails: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  audioDuration: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  audioPlayBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E1B4B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  saveCheckinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  saveCheckinBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  logEmoji: {
    fontSize: 22,
  },
  logTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  logDate: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  checkDoneBadge: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  checkDoneText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
});
