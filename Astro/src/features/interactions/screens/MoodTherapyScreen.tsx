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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeft,
  Heart,
  Wind,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CheckCircle2,
  Calendar,
  Flower2,
  Sun,
} from 'lucide-react-native';
import { api } from '~/shared/api';
import { useAuthStore } from '~/store/useAuthStore';

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
    titleEn: 'Peaceful & Blessed',
    titleHi: 'प्रसन्न व शांत',
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
    titleEn: 'Loving & Joyful',
    titleHi: 'स्नेहमयी व आनंदित',
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
    titleEn: 'Tired & Low Energy',
    titleHi: 'थकी हुई व सुस्त',
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
    titleEn: 'Emotional / Anxious',
    titleHi: 'भावुक व चिंतित',
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
    titleHi: 'अशांत व बेचैन',
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
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const user = useAuthStore(state => state.user);

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

  const safeVibrate = (pattern: number | number[] = 25) => {
    try {
      if (Platform.OS === 'ios') {
        Vibration.vibrate(pattern);
      }
    } catch (e) {}
  };

  // Breathing Pacer Logic: 4s inhale, 4s hold, 4s exhale
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let phaseTimer: NodeJS.Timeout | null = null;

    if (breathingActive) {
      // Counter
      timer = setInterval(() => {
        setBreathTimer(prev => prev + 1);
      }, 1000);

      // Loop sequence
      const runBreathingCycle = () => {
        setBreathPhase('inhale');
        safeVibrate(20);
        Animated.timing(breathAnim, {
          toValue: 1.5,
          duration: 4000,
          useNativeDriver: true,
        }).start(() => {
          setBreathPhase('hold');
          safeVibrate(20);
          phaseTimer = setTimeout(() => {
            setBreathPhase('exhale');
            safeVibrate(20);
            Animated.timing(breathAnim, {
              toValue: 1,
              duration: 4000,
              useNativeDriver: true,
            }).start(() => {
              if (breathingActive) {
                runBreathingCycle();
              }
            });
          }, 3000);
        });
      };

      runBreathingCycle();
    } else {
      breathAnim.setValue(1);
      setBreathPhase('inhale');
      if (timer) clearInterval(timer);
      if (phaseTimer) clearTimeout(phaseTimer);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (phaseTimer) clearTimeout(phaseTimer);
    };
  }, [breathingActive]);

  const handleSelectMood = (mood: MoodOption) => {
    setSelectedMood(mood);
    safeVibrate(30);
  };

  const handleSaveMood = async () => {
    const logItem = {
      id: `mood_${Date.now()}`,
      moodId: selectedMood.id,
      emoji: selectedMood.emoji,
      title: isHindi ? selectedMood.titleHi : selectedMood.titleEn,
      date: new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      breathingSeconds: breathTimer,
    };

    const updated = [logItem, ...recentLogs];
    setRecentLogs(updated);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      await api.post('/api/v1/mom/mood', {
        phone: user?.phone || '9366128220',
        moodId: selectedMood.id,
        moodLabel: isHindi ? selectedMood.titleHi : selectedMood.titleEn,
        moodEmoji: selectedMood.emoji,
        breathingSeconds: breathTimer,
        calmingTherapyUsed: 'Pranayama + Sound Therapy',
      });
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e);
    }

    Alert.alert(
      isHindi ? 'चेक-इन सहेजा गया 🌸' : 'Mood Check-in Saved 🌸',
      isHindi 
        ? 'आपके मन की स्थिति दर्ज हो गई है। विश्राम व शांत मन से शिशु को सकारात्मक ऊर्जा मिलती है।'
        : 'Your mood check-in is saved. Nurturing your peace nurtures your baby.'
    );
  };

  const getBreathPhaseText = () => {
    if (breathPhase === 'inhale') {
      return isHindi ? 'श्वास लें (Inhale Peace)' : 'Breathe In Peace...';
    } else if (breathPhase === 'hold') {
      return isHindi ? 'रोकें (Hold & Feel Baby)' : 'Hold & Feel Baby...';
    } else {
      return isHindi ? 'श्वास छोड़ें (Exhale Worry)' : 'Breathe Out Tension...';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={22} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>
            {isHindi ? 'मन का मिजाज़ व शांत मन' : 'Mood Check-in & Therapy'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isHindi ? 'माँ का शांत मन, शिशु का उत्तम संस्कार' : 'Your calm mind shapes baby’s peace'}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mood Question */}
        <Text style={styles.questionTitle}>
          {isHindi ? 'आज मम्मा कैसा महसूस कर रही हैं?' : 'How is Mumma feeling right now?'}
        </Text>
        <Text style={styles.questionSubtitle}>
          {isHindi 
            ? 'अपनी भावना चुनें, हम आपके लिए विशेष शांत मंत्र व प्राणायाम प्रस्तुत करेंगे'
            : 'Select your state to unlock customized calming pranayama & shlokas'}
        </Text>

        {/* Mood Selector Horizontal Grid */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodsScroll}
        >
          {MOODS.map(mood => {
            const isSelected = selectedMood.id === mood.id;
            return (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodCard,
                  { backgroundColor: mood.bgColor },
                  isSelected && { borderColor: mood.accentColor, borderWidth: 2 },
                ]}
                activeOpacity={0.8}
                onPress={() => handleSelectMood(mood)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[styles.moodTitle, isSelected && { color: mood.accentColor }]}>
                  {isHindi ? mood.titleHi : mood.titleEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected Mood Affirmation Banner */}
        <View style={[styles.affirmationCard, { backgroundColor: selectedMood.bgColor }]}>
          <View style={styles.affirmationHeader}>
            <Sparkles size={18} color={selectedMood.accentColor} />
            <Text style={[styles.affirmationTag, { color: selectedMood.accentColor }]}>
              {isHindi ? 'आज का मातृ संकल्प (Mother’s Blessing)' : 'Today’s Maternal Affirmation'}
            </Text>
          </View>
          <Text style={styles.affirmationText}>
            "{isHindi ? selectedMood.affirmationHi : selectedMood.affirmationEn}"
          </Text>
        </View>

        {/* Instant Calming Therapy: Pranayama Breathing Circle */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Wind size={20} color="#7C3AED" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>
                {isHindi ? 'सुख प्राणायाम (Calming Breathwork)' : 'Calming Pranayama (4-4-4)'}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {isHindi ? '2 मिनट का गहरा श्वास शिशु तक ऑक्सीजन पहुंचाता है' : '2 minutes to calm fetal stress hormones'}
              </Text>
            </View>
          </View>

          {/* Animated Circle Container */}
          <View style={styles.breathArea}>
            <Animated.View
              style={[
                styles.breathCircleOuter,
                {
                  transform: [{ scale: breathAnim }],
                  borderColor: selectedMood.accentColor,
                },
              ]}
            >
              <View style={[styles.breathCircleInner, { backgroundColor: selectedMood.bgColor }]}>
                <Flower2 size={36} color={selectedMood.accentColor} />
                <Text style={[styles.breathPhaseText, { color: selectedMood.accentColor }]}>
                  {getBreathPhaseText()}
                </Text>
              </View>
            </Animated.View>
          </View>

          {/* Breathing Controls */}
          <View style={styles.breathControls}>
            <TouchableOpacity
              style={[
                styles.breathBtn,
                breathingActive ? styles.breathBtnStop : styles.breathBtnStart,
              ]}
              onPress={() => setBreathingActive(!breathingActive)}
            >
              {breathingActive ? (
                <>
                  <Pause size={18} color="#FFF" />
                  <Text style={styles.breathBtnText}>
                    {isHindi ? 'विश्राम समाप्त करें' : 'Pause Breathwork'}
                  </Text>
                </>
              ) : (
                <>
                  <Play size={18} color="#FFF" fill="#FFF" />
                  <Text style={styles.breathBtnText}>
                    {isHindi ? 'प्राणायाम शुरू करें (Start Breathwork)' : 'Begin Calm Breathing'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Sound Therapy & Sacred Shloka Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Volume2 size={20} color="#D97706" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>
                {isHindi ? 'शांत नाद व वैदिक श्लोक' : 'Soothing Soundscape & Shloka'}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {isHindi ? 'पवित्र ध्वनि तरंगें मन को शांत करती हैं' : 'Vedic frequencies for mother & baby tranquility'}
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
                ? 'हे परमात्मा, उस प्राणस्वरूप, दुःखनाशक, सुखस्वरूप तेजस्वी श्रेष्ठ परमात्मा को हम अंतःकरण में धारण करें, जो हमारी और हमारे शिशु की बुद्धि को सन्मार्ग पर प्रेरित करे।'
                : 'May the divine light of wisdom dispel all fears, blessing both mother and the womb with sacred serenity and auspicious strength.'}
            </Text>
          </View>

          {/* Audio Player Card */}
          <View style={styles.audioPlayerCard}>
            <View style={styles.audioDetails}>
              <Text style={styles.audioTitle}>
                {isHindi ? 'मंदिर की घंटियां व बांसुरी नाद' : 'Temple Bells & Soothing Flute'}
              </Text>
              <Text style={styles.audioDuration}>432Hz Womb Relaxation • 10 Mins</Text>
            </View>
            <TouchableOpacity
              style={styles.audioPlayBtn}
              onPress={() => {
                setIsPlayingAudio(!isPlayingAudio);
                safeVibrate(30);
              }}
            >
              {isPlayingAudio ? (
                <Pause size={18} color="#FFF" />
              ) : (
                <Play size={18} color="#FFF" fill="#FFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Today's Mood Check-in */}
        <TouchableOpacity style={styles.saveCheckinBtn} onPress={handleSaveMood}>
          <CheckCircle2 size={20} color="#FFF" />
          <Text style={styles.saveCheckinBtnText}>
            {isHindi ? 'आज का मिजाज़ सुरक्षित करें (Save Check-in)' : 'Save Mood to Health Diary'}
          </Text>
        </TouchableOpacity>

        {/* Past Mood History */}
        {recentLogs.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#F3E8FF' }]}>
                <Calendar size={18} color="#9333EA" />
              </View>
              <Text style={styles.sectionTitle}>
                {isHindi ? 'हाल का मिजाज़ इतिहास' : 'Recent Mood Journal'}
              </Text>
            </View>
            {recentLogs.slice(0, 4).map(item => (
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
    backgroundColor: '#FAF5FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124, 58, 237, 0.08)',
    backgroundColor: '#FFF',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#4C1D95',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6D28D9',
    marginTop: 2,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3B0764',
    marginBottom: 4,
  },
  questionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  moodsScroll: {
    gap: 12,
    paddingBottom: 16,
  },
  moodCard: {
    width: 130,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  affirmationCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  affirmationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  affirmationTag: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  affirmationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  breathArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  breathCircleOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathCircleInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  breathPhaseText: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 6,
  },
  breathControls: {
    alignItems: 'center',
    marginTop: 10,
  },
  breathBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 26,
    gap: 8,
  },
  breathBtnStart: {
    backgroundColor: '#7C3AED',
  },
  breathBtnStop: {
    backgroundColor: '#DC2626',
  },
  breathBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  shlokaBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  shlokaSanskrit: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  shlokaMeaning: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
    textAlign: 'center',
  },
  audioPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  audioDetails: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  audioDuration: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  audioPlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveCheckinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 24,
    paddingVertical: 16,
    gap: 8,
    marginBottom: 20,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  saveCheckinBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  logEmoji: {
    fontSize: 24,
  },
  logTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  logDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  checkDoneBadge: {
    backgroundColor: '#DEF7EC',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  checkDoneText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#03543F',
  },
});
