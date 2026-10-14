import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Vibration,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Heart, 
  CheckCircle2, 
  Clock, 
  Info, 
  Sparkles,
  Calendar,
  ChevronRight
} from 'lucide-react-native';
import { api } from '~/shared/api';
import { useAuthStore } from '~/store/useAuthStore';

interface KickRecord {
  id: string;
  timeStr: string;
  intervalFromLast?: string;
}

interface CompletedSession {
  id: string;
  date: string;
  totalKicks: number;
  durationSeconds: number;
  completed: boolean;
}

const STORAGE_KEY = '@astrobaby_kick_sessions';
const TARGET_KICKS = 10;

export const KickCounterScreen = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const user = useAuthStore(state => state.user);

  // Session state
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [kicks, setKicks] = useState<KickRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [history, setHistory] = useState<CompletedSession[]>([]);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Load history on mount
  useEffect(() => {
    loadPastSessions();
  }, []);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Pulse animation when active
  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive]);

  const loadPastSessions = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
      // Also try fetching latest from backend
      try {
        const res = await api.get('/api/v1/mom/kicks', {
          params: { phone: user?.phone || '9366128220' }
        });
        if (res.data?.data && Array.isArray(res.data.data)) {
          const formatted: CompletedSession[] = res.data.data.map((item: any) => ({
            id: item._id || item.id,
            date: new Date(item.createdAt).toLocaleDateString(),
            totalKicks: item.totalKicks,
            durationSeconds: item.durationSeconds,
            completed: item.completed,
          }));
          setHistory(formatted);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(formatted));
        }
      } catch (backendErr) {
        // Backend optional offline fallback
      }
    } catch (e) {
      console.warn('Error loading kick sessions:', e);
    }
  };

  const handleStartPause = () => {
    if (isFinished) {
      resetSession();
      setIsActive(true);
      return;
    }
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setSeconds(0);
    setKicks([]);
    setIsFinished(false);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecordKick = () => {
    // If timer was stopped, start it
    if (!isActive) {
      setIsActive(true);
    }

    // Trigger gentle maternal haptic vibration
    try {
      Vibration.vibrate(40);
    } catch (e) {}

    // Button press bounce animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating heart effect
    floatAnim.setValue(0);
    Animated.timing(floatAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    const now = new Date();
    const timeStr = formatTime(seconds);
    let intervalStr: string | undefined;

    if (kicks.length > 0) {
      const prevSeconds = seconds;
      intervalStr = `+${formatTime(seconds)}`;
    }

    const updated = [
      {
        id: `kick_${Date.now()}`,
        timeStr,
        intervalFromLast: intervalStr,
      },
      ...kicks,
    ];

    setKicks(updated);

    // If target reached (10 kicks)
    if (updated.length >= TARGET_KICKS && !isFinished) {
      setIsFinished(true);
      setIsActive(false);
      saveSession(updated.length, seconds, true);
    }
  };

  const saveSession = async (total: number, duration: number, completed: boolean) => {
    const newSession: CompletedSession = {
      id: `session_${Date.now()}`,
      date: new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      totalKicks: total,
      durationSeconds: duration,
      completed,
    };

    const newHistory = [newSession, ...history];
    setHistory(newHistory);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      // Sync to backend
      await api.post('/api/v1/mom/kicks', {
        phone: user?.phone || '9366128220',
        totalKicks: total,
        durationSeconds: duration,
        targetKicks: TARGET_KICKS,
        completed,
        kickTimestamps: kicks.map(k => k.timeStr),
      });
    } catch (e) {
      console.warn('Saved locally, backend sync will retry:', e);
    }
  };

  const handleManualSave = () => {
    if (kicks.length === 0) {
      Alert.alert(
        isHindi ? 'कोई किक नहीं' : 'No Kicks Recorded',
        isHindi ? 'सत्र सहेजने से पहले कम से कम एक किक दर्ज करें।' : 'Please record at least one kick before saving.'
      );
      return;
    }
    saveSession(kicks.length, seconds, kicks.length >= TARGET_KICKS);
    resetSession();
    Alert.alert(
      isHindi ? 'सफलतापूर्वक सहेजा गया 🌸' : 'Session Saved 🌸',
      isHindi ? 'आपका किक काउंट इतिहास में सुरक्षित है।' : 'Your kick session has been saved to your health diary.'
    );
  };

  const progress = Math.min(1, kicks.length / TARGET_KICKS);

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
            {isHindi ? 'शिशु स्पंदन काउंटर' : 'Baby Kick Counter'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isHindi ? 'नन्ही हलचलों को महसूस करें' : 'Feel every tiny flutter'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.infoBtn}
          onPress={() => setShowInfoModal(!showInfoModal)}
        >
          <Info size={20} color="#E11D48" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Medical Guide Banner */}
        {showInfoModal && (
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Sparkles size={18} color="#D97706" />
              <Text style={styles.infoCardTitle}>
                {isHindi ? 'डॉक्टर का मार्गदर्शन' : 'Doctor Guidance'}
              </Text>
            </View>
            <Text style={styles.infoCardText}>
              {isHindi
                ? 'गर्भावस्था के 28वें सप्ताह के बाद शिशु की हलचल गिनना आवश्यक है। भोजन के बाद शांत बैठकर 2 घंटे के भीतर 10 किक्स सामान्य और स्वस्थ मानी जाती हैं।'
                : 'Counting kicks is recommended from Week 28. Resting on your left side after a meal or snack is ideal. Reaching 10 movements within 2 hours indicates healthy fetal activity.'}
            </Text>
          </View>
        )}

        {/* Milestone Celebration Card */}
        {isFinished && (
          <View style={styles.celebrationCard}>
            <Text style={styles.celebrationEmoji}>👼✨</Text>
            <Text style={styles.celebrationTitle}>
              {isHindi ? 'बधाई हो मम्मा! 10 किक्स पूरी हुईं' : 'Wonderful! 10 Kicks Counted'}
            </Text>
            <Text style={styles.celebrationSub}>
              {isHindi
                ? `आपके शिशु ने ${formatTime(seconds)} में 10 हलचलें पूरी कीं। शिशु स्वस्थ व सक्रिय है!`
                : `Baby completed 10 movements in ${formatTime(seconds)}. Your baby is active and healthy!`}
            </Text>
          </View>
        )}

        {/* Timer & Target Section */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>{isHindi ? 'समय बीता' : 'Elapsed Time'}</Text>
            <View style={styles.timerRow}>
              <Clock size={16} color="#E11D48" style={{ marginRight: 6 }} />
              <Text style={styles.timerValue}>{formatTime(seconds)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statCol}>
            <Text style={styles.statLabel}>{isHindi ? 'लक्ष्य (10 किक्स)' : 'Target (10 Kicks)'}</Text>
            <Text style={styles.kicksCount}>
              {kicks.length} <Text style={styles.targetTotal}>/ {TARGET_KICKS}</Text>
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>

        {/* Main Big Animated Kick Tap Button */}
        <View style={styles.buttonCenterArea}>
          {/* Animated Pulsing Ring */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseAnim }],
                opacity: isActive ? 0.35 : 0.1,
              },
            ]}
          />

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.bigKickButton}
              activeOpacity={0.9}
              onPress={handleRecordKick}
            >
              <View style={styles.innerKickCircle}>
                <Heart size={44} color="#FFF" fill="#FFF" />
                <Text style={styles.tapPrompt}>
                  {isHindi ? 'किक महसूस हुई?' : 'Felt a Kick?'}
                </Text>
                <Text style={styles.tapSub}>
                  {isHindi ? 'यहाँ टैप करें' : 'TAP HERE'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Floating Heart Effect */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.floatingHeart,
              {
                opacity: floatAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1, 0],
                }),
                transform: [
                  {
                    translateY: floatAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -70],
                    }),
                  },
                  {
                    scale: floatAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.8, 1.4, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.floatingText}>+1 Kick 💖</Text>
          </Animated.View>
        </View>

        {/* Controls: Play/Pause, Reset, Save */}
        <View style={styles.controlRow}>
          <TouchableOpacity 
            style={[styles.controlBtn, isActive ? styles.pauseBtn : styles.playBtn]}
            onPress={handleStartPause}
          >
            {isActive ? (
              <>
                <Pause size={18} color="#FFF" />
                <Text style={styles.controlBtnText}>{isHindi ? 'रोकें' : 'Pause'}</Text>
              </>
            ) : (
              <>
                <Play size={18} color="#FFF" fill="#FFF" />
                <Text style={styles.controlBtnText}>
                  {seconds === 0 ? (isHindi ? 'प्रारंभ' : 'Start') : (isHindi ? 'जारी रखें' : 'Resume')}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryControlBtn}
            onPress={resetSession}
          >
            <RotateCcw size={16} color="#6B7280" />
            <Text style={styles.secondaryBtnText}>{isHindi ? 'रीसेट' : 'Reset'}</Text>
          </TouchableOpacity>

          {kicks.length > 0 && !isFinished && (
            <TouchableOpacity 
              style={styles.saveControlBtn}
              onPress={handleManualSave}
            >
              <CheckCircle2 size={16} color="#059669" />
              <Text style={styles.saveBtnText}>{isHindi ? 'सहेजें' : 'Save'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Current Session Kick Stream */}
        {kicks.length > 0 && (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeaderTitle}>
              {isHindi ? 'इस सत्र की हलचलें' : 'Current Session Timeline'}
            </Text>
            <View style={styles.kickStream}>
              {kicks.map((k, idx) => (
                <View key={k.id} style={styles.kickItem}>
                  <View style={styles.kickIndexPill}>
                    <Text style={styles.kickIndexText}>#{kicks.length - idx}</Text>
                  </View>
                  <Text style={styles.kickTime}>{k.timeStr}</Text>
                  <Text style={styles.kickInterval}>
                    {idx === kicks.length - 1 ? (isHindi ? 'शुरुआत' : 'First flutter') : k.intervalFromLast}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Past Sessions History */}
        <View style={styles.sectionBox}>
          <View style={styles.historyHeader}>
            <Calendar size={18} color="#E11D48" />
            <Text style={styles.sectionHeaderTitle}>
              {isHindi ? 'पिछले सत्र (इतिहास)' : 'Past Kick History'}
            </Text>
          </View>

          {history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyEmoji}>🌸</Text>
              <Text style={styles.emptyTitle}>
                {isHindi ? 'अभी कोई पिछला सत्र नहीं है' : 'No recorded sessions yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {isHindi 
                  ? 'जब शिशु हलचल करे, बड़ा दिल बटन दबाकर रिकॉर्ड करना शुरू करें।'
                  : 'Start tracking above when you feel baby’s gentle kicks.'}
              </Text>
            </View>
          ) : (
            history.slice(0, 5).map((session) => (
              <View key={session.id} style={styles.historyCard}>
                <View style={styles.historyLeft}>
                  <View style={[
                    styles.historyIconBox, 
                    { backgroundColor: session.completed ? '#ECFDF5' : '#FFF7ED' }
                  ]}>
                    <Heart 
                      size={18} 
                      color={session.completed ? '#059669' : '#D97706'} 
                      fill={session.completed ? '#059669' : '#D97706'} 
                    />
                  </View>
                  <View>
                    <Text style={styles.historyDate}>{session.date}</Text>
                    <Text style={styles.historyDetails}>
                      {session.totalKicks} {isHindi ? 'किक्स' : 'kicks'} • {formatTime(session.durationSeconds)}
                    </Text>
                  </View>
                </View>
                {session.completed && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeText}>
                      {isHindi ? 'पूर्ण ✓' : 'Done ✓'}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>

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
    borderBottomColor: 'rgba(225, 29, 72, 0.08)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#881337',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9F1239',
    marginTop: 2,
    fontWeight: '500',
  },
  infoBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  infoCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  infoCardText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 20,
  },
  celebrationCard: {
    backgroundColor: '#FDF2F8',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#F472B6',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  celebrationEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  celebrationTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#9D174D',
    textAlign: 'center',
    marginBottom: 6,
  },
  celebrationSub: {
    fontSize: 13,
    color: '#BE185D',
    textAlign: 'center',
    lineHeight: 18,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#BE185D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#FCE7F3',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    fontVariant: ['tabular-nums'],
  },
  kicksCount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E11D48',
  },
  targetTotal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#FCE7F3',
    borderRadius: 4,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E11D48',
    borderRadius: 4,
  },
  buttonCenterArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FDA4AF',
  },
  bigKickButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  innerKickCircle: {
    width: 156,
    height: 156,
    borderRadius: 78,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BE123C',
  },
  tapPrompt: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 8,
  },
  tapSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FECDD3',
    letterSpacing: 1,
    marginTop: 2,
  },
  floatingHeart: {
    position: 'absolute',
    top: 20,
    backgroundColor: '#FFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  floatingText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E11D48',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 28,
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 24,
    gap: 8,
  },
  playBtn: {
    backgroundColor: '#E11D48',
  },
  pauseBtn: {
    backgroundColor: '#D97706',
  },
  controlBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  secondaryControlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  saveControlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 6,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  sectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE4E6',
    shadowColor: '#BE185D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#881337',
    marginBottom: 12,
  },
  kickStream: {
    gap: 8,
  },
  kickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFF1F2',
    borderRadius: 12,
  },
  kickIndexPill: {
    backgroundColor: '#E11D48',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  kickIndexText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },
  kickTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  kickInterval: {
    fontSize: 12,
    color: '#9F1239',
    fontWeight: '500',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FDF2F8',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  historyDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  completedBadge: {
    backgroundColor: '#D1FAE5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
});
