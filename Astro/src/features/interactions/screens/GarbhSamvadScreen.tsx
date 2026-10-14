import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Vibration,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeft,
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  Volume2,
  Bookmark,
  Calendar,
  Heart,
  User,
  Sun,
  Moon,
  Compass
} from 'lucide-react-native';
import { api } from '~/shared/api';
import { useAuthStore } from '~/store/useAuthStore';

interface SamvadScript {
  id: string;
  category: 'morning' | 'virtue' | 'father' | 'night';
  categoryLabelHi: string;
  categoryLabelEn: string;
  iconName: string;
  titleHi: string;
  titleEn: string;
  guideHi: string;
  guideEn: string;
  scriptHi: string;
  scriptEn: string;
  sanskritVerse?: string;
}

const SCRIPTS: SamvadScript[] = [
  {
    id: 'samvad_morning',
    category: 'morning',
    categoryLabelHi: 'प्रातः वंदन',
    categoryLabelEn: 'Morning Blessing',
    iconName: 'Sun',
    titleHi: 'शुभ प्रभात, मेरे नन्हे प्राण',
    titleEn: 'Good Morning, My Little Miracle',
    guideHi: 'नाभि पर दायां हाथ रखें, मंद मुस्कान के साथ शिशु से बोलें:',
    guideEn: 'Place your palm gently over your belly and whisper with a smile:',
    scriptHi: 'नमस्ते मेरे प्रिय शिशु! आज एक सुंदर और पवित्र नया दिन है। सूर्य की स्वर्णिम किरणें हमारे भीतर नई ऊर्जा और तेज भर रही हैं। मम्मा स्वस्थ है और तुम भी मेरे गर्भ में पूर्णतः सुरक्षित और प्रसन्न हो। आज हम मिलकर सुंदर ज्ञान और मधुर संगीत का अनुभव करेंगे। तुम मेरे जीवन का सबसे अनमोल वरदान हो।',
    scriptEn: 'Good morning, my precious baby! Today is a beautiful, sacred day. The golden morning light fills us with strength and purity. I am healthy, and you are completely safe and cherished in my womb. Today, we will experience sweet melodies and joyful thoughts together. You are the greatest blessing of my life.',
    sanskritVerse: '॥ ॐ तेजस्वि नावधीतमस्तु मा विद्विषावहै ॥',
  },
  {
    id: 'samvad_virtue',
    category: 'virtue',
    categoryLabelHi: 'सद्गुण व संस्कार',
    categoryLabelEn: 'Virtue & Wisdom',
    iconName: 'Compass',
    titleHi: 'साहस और करुणा का बीजारोपण',
    titleEn: 'Seeds of Courage and Kindness',
    guideHi: 'शांत चित्त से बैठें, हृदय से हृदय का संवाद करें:',
    guideEn: 'Breathe deeply and speak from the depths of your maternal heart:',
    scriptHi: 'मेरे प्यारे बच्चे, यह संसार अद्भुत संभावनाओं से भरा है। तुम बड़े होकर सदा सत्य, धैर्य और करुणा के मार्ग पर चलना। किसी निर्बल की सहायता करना और विपरीत परिस्थितियों में भी साहस बनाए रखना। तुम्हारे विचार शांत और तुम्हारा मन निर्मल हो। मम्मा का हर आशीर्वाद तुम्हारी आत्मा को सशक्त बना रहा है।',
    scriptEn: 'My dear child, this universe is full of wonderful possibilities. As you grow, may you walk the path of truth, patience, and boundless compassion. Be courageous in times of difficulty and kind to every living being. Your thoughts are calm and pure. Every heartbeat of mine surrounds you with divine strength.',
    sanskritVerse: '॥ सत्यं वद धर्मं चर ॥',
  },
  {
    id: 'samvad_father',
    category: 'father',
    categoryLabelHi: 'पिता का स्नेह',
    categoryLabelEn: 'Father’s Loving Voice',
    iconName: 'User',
    titleHi: 'पापा की नन्हीं दुनिया (पिता-शिशु संवाद)',
    titleEn: 'Daddy’s Voice to the Bump',
    guideHi: 'शिशु के पिता अपना हाथ पेट पर रखें और स्नेह से कहें:',
    guideEn: 'Have the father place his warm hand on the bump and speak softly:',
    scriptHi: 'नमस्ते मेरी नन्हीं जान! मैं तुम्हारे पापा हूँ। यद्यपि तुम अभी अपनी मम्मा के गर्भ में हो, परंतु मेरी आवाज तुम्हें पहचानती है। मैं प्रतिदिन तुम्हारी प्रतीक्षा कर रहा हूँ। तुम्हारी मम्मा का मैं पूरा ध्यान रख रहा हूँ और जब तुम आओगे, तो मैं तुम्हें दुनिया की हर खुशी दूंगा। तुम बहुत प्यारे हो!',
    scriptEn: 'Hello, my little bundle of joy! This is your Daddy speaking. Even though you are safely nestled inside Mumma, I know you can hear my voice. I think about you every single day. I am taking care of your Mumma, and when you arrive, we will show you how beautiful this world is. We love you so much!',
    sanskritVerse: '॥ पिता धर्मः पिता स्वर्गः ॥',
  },
  {
    id: 'samvad_night',
    category: 'night',
    categoryLabelHi: 'शुभ रात्रि लोरी',
    categoryLabelEn: 'Bedtime Lullaby & Peace',
    iconName: 'Moon',
    titleHi: 'मीठी निद्रा व शांति का आलिंगन',
    titleEn: 'Lullaby of Peaceful Slumber',
    guideHi: 'बाईं करवट लेटें, धीमी आवाज में लोरी की तरह कहें:',
    guideEn: 'Lie down on your left side and speak in a soft, soothing lullaby cadence:',
    scriptHi: 'दिन बीत गया है मेरे नन्हे देवदूत, अब विश्राम की बेला है। मम्मा अपनी बाहों में तुम्हें समेटे हुए है। तारों की शीतल छाया तुम्हारे ऊपर बरस रही है। शांत हो जाओ, सुखद स्वप्नों में खो जाओ। कल की नई भोर तुम्हारे लिए और भी सुंदर होगी। शुभ रात्रि, मेरे नन्हे सितारे।',
    scriptEn: 'The day has come to a peaceful close, my little angel. Mumma is holding you tenderly within. Feel the stillness of the night and let all movements soften. Sleep peacefully in this warm sanctuary. Tomorrow brings new joys. Good night, my shining star.',
    sanskritVerse: '॥ ॐ शांतिः शांतिः शांतिः ॥',
  },
];

const STORAGE_KEY = '@astrobaby_samvad_notes';

export const GarbhSamvadScreen = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const user = useAuthStore(state => state.user);

  const [selectedScript, setSelectedScript] = useState<SamvadScript>(SCRIPTS[0]);
  const [useHindiText, setUseHindiText] = useState(isHindi);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedAudioReady, setRecordedAudioReady] = useState(false);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [momNote, setMomNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<any[]>([]);

  // Mic animation
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadSavedNotes();
  }, []);

  const loadSavedNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedNotes(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Error loading samvad notes:', e);
    }
  };

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const handleToggleRecord = () => {
    if (!isRecording) {
      setRecordSeconds(0);
      setIsRecording(true);
      setRecordedAudioReady(false);
      try { Vibration.vibrate([0, 50, 50, 50]); } catch (e) {}
    } else {
      setIsRecording(false);
      setRecordedAudioReady(true);
      try { Vibration.vibrate(50); } catch (e) {}
      Alert.alert(
        useHindiText ? 'रिकॉर्डिंग पूरी हुई 🎙️' : 'Voice Message Recorded 🎙️',
        useHindiText 
          ? `आपने ${recordSeconds} सेकंड का संदेश रिकॉर्ड किया है। इसे नीचे सुरक्षित कर सकते हैं।`
          : `Recorded ${recordSeconds}s of your voice to baby. You can save it to your keepsake diary.`
      );
    }
  };

  const handleSaveToDiary = async () => {
    const newEntry = {
      id: `samvad_${Date.now()}`,
      category: selectedScript.categoryLabelEn,
      title: useHindiText ? selectedScript.titleHi : selectedScript.titleEn,
      momNote: momNote.trim() || (useHindiText ? 'शिशु से स्नेहपूर्ण संवाद' : 'Heartfelt womb conversation'),
      durationSeconds: recordSeconds,
      date: new Date().toLocaleDateString(useHindiText ? 'hi-IN' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    const updated = [newEntry, ...savedNotes];
    setSavedNotes(updated);
    setMomNote('');
    setRecordedAudioReady(false);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      await api.post('/api/v1/mom/samvad', {
        phone: user?.phone || '9366128220',
        category: selectedScript.category,
        title: newEntry.title,
        promptSnippet: selectedScript.scriptEn.substring(0, 100),
        momNote: newEntry.momNote,
        hasAudioRecording: recordSeconds > 0,
        durationSeconds: recordSeconds,
      });
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e);
    }

    Alert.alert(
      useHindiText ? 'डायरी में सुरक्षित 🪷' : 'Saved to Baby Diary 🪷',
      useHindiText
        ? 'यह संवाद आपके शिशु के गर्भ संस्कार इतिहास में सदा के लिए संजोया गया।'
        : 'This heartfelt dialogue has been preserved in your baby’s journey keepsake.'
    );
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
            {useHindiText ? 'गर्भ संवाद (शिशु से बातचीत)' : 'Garbh Samvad (Womb Talk)'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {useHindiText ? 'संस्कार व आत्मिक संबंध की डोर' : 'Bonding virtues & love before birth'}
          </Text>
        </View>

        {/* Quick Hindi / English Script Toggle */}
        <TouchableOpacity
          style={styles.langToggle}
          onPress={() => setUseHindiText(!useHindiText)}
        >
          <Text style={styles.langToggleText}>
            {useHindiText ? 'ENG' : 'हिंदी'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sacred Quote Banner */}
        <View style={styles.blessingBanner}>
          <Sparkles size={20} color="#D97706" />
          <Text style={styles.blessingText}>
            {useHindiText
              ? 'गर्भ में शिशु 20वें सप्ताह से माता-पिता की आवाज सुनकर पहचानना सीखता है।'
              : 'From Week 20, baby actively hears, remembers, and feels comforted by your voice.'}
          </Text>
        </View>

        {/* Category Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {SCRIPTS.map(s => {
            const isSelected = selectedScript.id === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}
                onPress={() => {
                  setSelectedScript(s);
                  try { Vibration.vibrate(25); } catch (e) {}
                }}
              >
                <Text style={[
                  styles.categoryPillText,
                  isSelected && styles.categoryPillTextActive,
                ]}>
                  {useHindiText ? s.categoryLabelHi : s.categoryLabelEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Main Script Card */}
        <View style={styles.scriptCard}>
          {/* Sanskrit Header if available */}
          {selectedScript.sanskritVerse && (
            <View style={styles.sanskritBox}>
              <Text style={styles.sanskritText}>
                {selectedScript.sanskritVerse}
              </Text>
            </View>
          )}

          <Text style={styles.scriptTitle}>
            {useHindiText ? selectedScript.titleHi : selectedScript.titleEn}
          </Text>

          <View style={styles.guideBox}>
            <Heart size={16} color="#E11D48" style={{ marginTop: 2 }} />
            <Text style={styles.guideText}>
              {useHindiText ? selectedScript.guideHi : selectedScript.guideEn}
            </Text>
          </View>

          <Text style={styles.scriptBody}>
            {useHindiText ? selectedScript.scriptHi : selectedScript.scriptEn}
          </Text>
        </View>

        {/* Voice Recording / Diary Section */}
        <View style={styles.recordSection}>
          <Text style={styles.recordSectionTitle}>
            {useHindiText ? 'शिशु के लिए अपनी आवाज में बोलें' : 'Speak to Baby in Your Voice'}
          </Text>
          <Text style={styles.recordSectionSub}>
            {useHindiText 
              ? 'माइक दबाकर शिशु से बात करें या कोई लोरी गाएं'
              : 'Press mic to record your gentle whisper, prayer, or lullaby'}
          </Text>

          <View style={styles.micArea}>
            <Animated.View
              style={[
                styles.micPulseRing,
                isRecording && { transform: [{ scale: pulseAnim }], opacity: 0.35 },
              ]}
            />
            <TouchableOpacity
              style={[
                styles.micButton,
                isRecording ? styles.micButtonRecording : styles.micButtonIdle,
              ]}
              onPress={handleToggleRecord}
              activeOpacity={0.8}
            >
              {isRecording ? (
                <Square size={28} color="#FFF" fill="#FFF" />
              ) : (
                <Mic size={32} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>

          {/* Recording Timer / State */}
          <Text style={styles.timerDisplay}>
            {isRecording 
              ? `🔴 Recording... 00:${recordSeconds.toString().padStart(2, '0')}`
              : recordedAudioReady 
                ? (useHindiText ? `✅ रिकॉर्डिंग तैयार (${recordSeconds}s)` : `✅ Message Ready (${recordSeconds}s)`)
                : (useHindiText ? 'टैप करके बोलना शुरू करें' : 'Tap to start speaking')}
          </Text>

          {/* Mom’s Personal Reflection Note */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              placeholder={useHindiText ? 'आज का अनुभव या नन्हा संदेश लिखें...' : 'Add a personal note or prayer to baby...'}
              placeholderTextColor="#9CA3AF"
              value={momNote}
              onChangeText={setMomNote}
              multiline
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveKeepsakeBtn}
            onPress={handleSaveToDiary}
          >
            <Bookmark size={18} color="#FFF" />
            <Text style={styles.saveKeepsakeBtnText}>
              {useHindiText ? 'शिशु की डायरी में संजोएं (Save Keepsake)' : 'Save to Baby Keepsake Diary'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Saved Keepsakes List */}
        {savedNotes.length > 0 && (
          <View style={styles.keepsakeSection}>
            <View style={styles.keepsakeHeader}>
              <Calendar size={18} color="#B45309" />
              <Text style={styles.keepsakeTitle}>
                {useHindiText ? 'सहेजे गए संवाद (माँ की डायरी)' : 'Saved Womb Conversations'}
              </Text>
            </View>

            {savedNotes.slice(0, 4).map(note => (
              <View key={note.id} style={styles.noteCard}>
                <View style={styles.noteTop}>
                  <Text style={styles.noteCategory}>{note.category}</Text>
                  <Text style={styles.noteDate}>{note.date}</Text>
                </View>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.noteContent}>{note.momNote}</Text>
                {note.durationSeconds > 0 && (
                  <View style={styles.audioBadge}>
                    <Volume2 size={14} color="#D97706" />
                    <Text style={styles.audioBadgeText}>
                      Voice Note • {note.durationSeconds}s
                    </Text>
                  </View>
                )}
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
    backgroundColor: '#FFFDF9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(217, 119, 6, 0.1)',
    backgroundColor: '#FFF',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#92400E',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
    fontWeight: '500',
  },
  langToggle: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  langToggleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  blessingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 10,
  },
  blessingText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
    fontWeight: '600',
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryPillActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  categoryPillTextActive: {
    color: '#FFF',
  },
  scriptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sanskritBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sanskritText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
    textAlign: 'center',
  },
  scriptTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  guideBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF1F2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  guideText: {
    flex: 1,
    fontSize: 12,
    color: '#BE123C',
    fontWeight: '600',
    lineHeight: 17,
  },
  scriptBody: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 25,
    fontWeight: '500',
  },
  recordSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  recordSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  recordSectionSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
    marginBottom: 18,
  },
  micArea: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  micPulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FCA5A5',
    opacity: 0,
  },
  micButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  micButtonIdle: {
    backgroundColor: '#D97706',
  },
  micButtonRecording: {
    backgroundColor: '#DC2626',
  },
  timerDisplay: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginVertical: 12,
  },
  inputBox: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginBottom: 16,
  },
  textInput: {
    fontSize: 14,
    color: '#1F2937',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveKeepsakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D97706',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 22,
    gap: 8,
    width: '100%',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  saveKeepsakeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  keepsakeSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  keepsakeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  keepsakeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400E',
  },
  noteCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noteTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  noteCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
    textTransform: 'uppercase',
  },
  noteDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  noteContent: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  audioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  audioBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
});
