import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Linking,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  Video,
  Calendar,
  Clock,
  Play,
  Bell,
  X,
  MessageCircle,
  Send,
  HelpCircle,
  Sparkles,
} from 'lucide-react-native';
import { api } from '~/shared/api';
import { useAuthStore } from '~/store/useAuthStore';

interface LiveClassItem {
  id: string;
  title: string;
  courseName: string;
  dayTime: string;
  doctorName: string;
  zoomLink: string;
  imageUrl: string;
}

interface RecordedClassItem {
  id: string;
  title: string;
  courseName: string;
  duration: string;
  doctorName: string;
  videoUrl: string;
  imageUrl: string;
}

const DEFAULT_LIVE_IMAGES = [
  'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=700&auto=format&fit=crop&q=80', // Mother bond & music/brain
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&auto=format&fit=crop&q=80', // Prenatal yoga & pelvic stretch
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&auto=format&fit=crop&q=80', // Ayurvedic nutrition & diet
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&auto=format&fit=crop&q=80', // Preconception doctor consultation
];

const DEFAULT_REC_IMAGES = [
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=700&auto=format&fit=crop&q=80', // Spiritual peaceful birth
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=700&auto=format&fit=crop&q=80', // Father & mother bump bonding
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&auto=format&fit=crop&q=80', // Morning sickness & herbal relief
  'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=700&auto=format&fit=crop&q=80', // Newborn Vedic massage care
];

interface AnsweredQA {
  id: string;
  question: string;
  doctor: string;
  answer: string;
  course: string;
}

export const LiveSessionsScreen: React.FC<{ isTabMode?: boolean }> = ({ isTabMode = false }) => {
  const navigation = useNavigation<any>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const user = useAuthStore(state => state.user);

  // 3 Main Headings: 'live' (default), 'recorded', 'qa'
  const [activeTab, setActiveTab] = useState<'live' | 'recorded' | 'qa'>('live');

  // Live classes list
  const [liveClasses, setLiveClasses] = useState<LiveClassItem[]>([
    {
      id: 'live_1',
      title: isHindi ? 'गर्भ संवाद एवं शिशु मस्तिष्क विकास' : 'Garbh Samvad & Fetal Brain Stimulation with Raagas',
      courseName: 'Brain',
      dayTime: 'Saturday • 11:00 AM IST',
      doctorName: 'Dr. Anita Joshi',
      zoomLink: 'https://zoom.us/j/9109121342?pwd=KC_VEDIC_SANSCAR',
      imageUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=700&auto=format&fit=crop&q=80',
    },
    {
      id: 'live_2',
      title: isHindi ? 'सुख प्रसव योग व पेल्विक लचीलापन कार्यशाला' : 'Easy Natural Birth & Pelvic Opening Yoga (Sukha Prasava)',
      courseName: 'Safe',
      dayTime: 'Sunday • 04:30 PM IST',
      doctorName: 'Dr. Meenakshi Sharma',
      zoomLink: 'https://zoom.us/j/9109121343?pwd=KC_VEDIC_SANSCAR',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&auto=format&fit=crop&q=80',
    },
    {
      id: 'live_3',
      title: isHindi ? 'माह-अनुसार आयुर्वेदिक सात्विक आहार एवं पोषण' : 'Ayurvedic Trimester Diet: Iron & Calcium Without Constipation',
      courseName: 'Ayurvedic',
      dayTime: 'Tuesday • 06:00 PM IST',
      doctorName: 'Dr. Vasant Lad & Dt. Neha Gupta',
      zoomLink: 'https://zoom.us/j/9109121344?pwd=KC_VEDIC_SANSCAR',
      imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&auto=format&fit=crop&q=80',
    },
    {
      id: 'live_4',
      title: isHindi ? 'शिशु की योजना व प्राकृतिक गर्भधारण' : 'Preconception Vedic Detox & Planning',
      courseName: 'Preconception',
      dayTime: 'Wednesday • 07:00 PM IST',
      doctorName: 'Dr. Anita Joshi',
      zoomLink: 'https://zoom.us/j/9109121345?pwd=KC_VEDIC_SANSCAR',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&auto=format&fit=crop&q=80',
    },
  ]);

  // Recorded classes list
  const [recordedClasses, setRecordedClasses] = useState<RecordedClassItem[]>([
    {
      id: 'rec_1',
      title: isHindi ? 'सुखद व निर्भय प्रसव की आध्यात्मिक तैयारी' : 'Spiritual Preparation for Gentle Birth',
      courseName: 'Safe Delivery',
      duration: '48 mins',
      doctorName: 'Dr. Sunita Sharma',
      videoUrl: 'https://www.youtube.com',
      imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=700&auto=format&fit=crop&q=80',
    },
    {
      id: 'rec_2',
      title: isHindi ? 'गर्भ में शिशु से संवाद व पिता की भूमिका' : 'Fetal Communication & Father-Baby Bonding',
      courseName: 'Bonding',
      duration: '35 mins',
      doctorName: 'Prof. Vipin Joshi',
      videoUrl: 'https://www.youtube.com',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=700&auto=format&fit=crop&q=80',
    },
    {
      id: 'rec_3',
      title: isHindi ? 'गर्भावस्था में उल्टी व गैस के अचूक घरेलू उपाय' : 'Nausea, Acidity & Morning Sickness Relief',
      courseName: 'Ayurveda',
      duration: '28 mins',
      doctorName: 'Dr. Anita Joshi',
      videoUrl: 'https://www.youtube.com',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&auto=format&fit=crop&q=80',
    },
    {
      id: 'rec_4',
      title: isHindi ? 'नवजात शिशु मालिश व वैदिक बाल संस्कार' : 'Newborn Oil Massage & Vedic Care Routine',
      courseName: 'Bal Sanskar',
      duration: '40 mins',
      doctorName: 'Dr. Meenakshi Sharma',
      videoUrl: 'https://www.youtube.com',
      imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=700&auto=format&fit=crop&q=80',
    },
  ]);

  const answeredQAs: AnsweredQA[] = [
    {
      id: 'qa_1',
      question: 'Is ghee intake necessary for a normal delivery in the 9th month?',
      doctor: 'Dr. Anita Joshi',
      answer: '1 teaspoon of A2 cow ghee with warm milk in 9th month supports pelvic lubrication and calm energy.',
      course: 'Garbh Sanskar',
    },
    {
      id: 'qa_2',
      question: 'Can listening to 432Hz Raagas make baby calmer after birth?',
      doctor: 'Dr. Sunita Sharma',
      answer: 'Yes! Auditory memory begins by week 20. Babies exposed to Raag Yaman consistently sleep faster.',
      course: 'Garbh Sanskar',
    },
    {
      id: 'qa_3',
      question: 'How do I distinguish between false labor and real labor?',
      doctor: 'Dr. Meenakshi Sharma',
      answer: 'Braxton Hicks are irregular and ease with rest. Real contractions occur at regular intervals and get stronger.',
      course: 'Garbh Sanskar',
    },
  ];

  // Registered reminder IDs
  const [reminders, setReminders] = useState<string[]>(['live_1']);

  // Q&A form
  const [questionText, setQuestionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Video Player Modal
  const [activeVideo, setActiveVideo] = useState<RecordedClassItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchRemoteClasses();
  }, []);

  const fetchRemoteClasses = async () => {
    try {
      const res = await api.get('/api/v1/krishna/live/sessions');
      if (res.data?.success && res.data.upcoming?.length) {
        setLiveClasses(res.data.upcoming.map((u: any, idx: number) => ({
          id: u.id,
          title: u.title,
          courseName: u.categoryLabel ? u.categoryLabel.split(' ')[0] : 'Brain',
          dayTime: u.dateTime || 'Saturday • 11:00 AM IST',
          doctorName: u.doctorName || 'Senior Ayurvedic Gynecologist',
          zoomLink: u.zoomLink || 'https://zoom.us',
          imageUrl: u.thumbnail || u.imageUrl || DEFAULT_LIVE_IMAGES[idx % DEFAULT_LIVE_IMAGES.length],
        })));
      }
      if (res.data?.success && res.data.recorded?.length) {
        setRecordedClasses(res.data.recorded.map((r: any, idx: number) => ({
          id: r.id,
          title: r.title,
          courseName: r.categoryLabel ? uCleanCategory(r.categoryLabel) : 'Garbh Sanskar',
          duration: r.duration || '40 mins',
          doctorName: r.doctorName || 'Doctor Faculty',
          videoUrl: r.videoUrl || 'https://www.youtube.com',
          imageUrl: r.thumbnail || r.imageUrl || DEFAULT_REC_IMAGES[idx % DEFAULT_REC_IMAGES.length],
        })));
      }
    } catch (e) {
      // Use defaults
    }
  };

  const uCleanCategory = (cat: string) => {
    return cat.replace(/[^\w\s]/gi, '').trim().split(' ')[0] || 'Garbh Sanskar';
  };

  const handleJoinClass = async (zoomUrl: string, title: string, id?: string) => {
    if (id) {
      try {
        await api.post(`/api/v1/classes/${id}/join`).catch(() => {});
      } catch (e) {}
    }
    Linking.openURL(zoomUrl).catch(() => {
      Alert.alert(
        'Live Class Link',
        `Class: ${title}\nMeeting Link: ${zoomUrl}\nPasscode: KC_VEDIC_SANSCAR`
      );
    });
  };

  const handleToggleReminder = async (id: string) => {
    if (reminders.includes(id)) {
      setReminders(reminders.filter(r => r !== id));
      Alert.alert('Reminder Removed', 'Notification turned off for this class.');
    } else {
      setReminders([...reminders, id]);
      try {
        await api.post(`/api/v1/classes/${id}/register`).catch(() => {});
      } catch (e) {}
      Alert.alert('Reminder Set! 🌸', 'We will notify you 15 minutes before the live class starts.');
    }
  };

  const handleSubmitQuestion = async () => {
    if (!questionText.trim()) {
      Alert.alert('Empty Question', 'Please type your question for the doctor.');
      return;
    }
    try {
      setIsSubmitting(true);
      await api.post('/api/v1/krishna/live/ask-question', {
        phone: user?.phone || '9366128220',
        question: questionText,
      }).catch(() => {});

      Alert.alert(
        'Question Sent 🌸',
        'Our doctor panel has received your question. It will be answered in the live class!'
      );
      setQuestionText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        {!isTabMode ? (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('WelcomeCourseSelection');
              }
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ChevronLeft size={24} color="#1E1B4B" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 8 }} />
        )}

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>
            {isHindi ? 'कक्षाएं (Classes)' : 'Classes'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isHindi ? 'लाइव सत्र, रिकॉर्डेड कक्षाएं व प्रश्नोत्तरी' : 'Live doctor sessions & recorded library'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.helpBtn}
          onPress={() => navigation.navigate('SupportChat')}
          activeOpacity={0.8}
        >
          <HelpCircle size={20} color="#BE123C" />
        </TouchableOpacity>
      </View>

      {/* Main 3 Headings: Live Classes | Recorded Classes | Ask Doctor Q&A */}
      <View style={styles.topHeadingsContainer}>
        <TouchableOpacity
          style={[styles.headingTab, activeTab === 'live' && styles.headingTabActive]}
          onPress={() => setActiveTab('live')}
          activeOpacity={0.85}
        >
          <View style={styles.tabBadgeRow}>
            <View style={[styles.pulseDot, activeTab === 'live' && styles.pulseDotActive]} />
            <Text style={[styles.headingTabText, activeTab === 'live' && styles.headingTabTextActive]}>
              Live Classes ({liveClasses.length})
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.headingTab, activeTab === 'recorded' && styles.headingTabActive]}
          onPress={() => setActiveTab('recorded')}
          activeOpacity={0.85}
        >
          <Text style={[styles.headingTabText, activeTab === 'recorded' && styles.headingTabTextActive]}>
            Recorded ({recordedClasses.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.headingTab, activeTab === 'qa' && styles.headingTabActive]}
          onPress={() => setActiveTab('qa')}
          activeOpacity={0.85}
        >
          <Text style={[styles.headingTabText, activeTab === 'qa' && styles.headingTabTextActive]}>
            Ask Doctor Q&A
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================= */}
        {/* 1. LIVE CLASSES (DEFAULT SELECTED)        */}
        {/* ========================================= */}
        {activeTab === 'live' && (
          <View style={styles.cardsList}>
            {liveClasses.map(item => {
              const isReminded = reminders.includes(item.id);

              return (
                <View key={item.id} style={styles.minimalCard}>
                  {/* Theme Hero Image Banner */}
                  <View style={styles.cardImageContainer}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                    {/* Top Overlay Badges */}
                    <View style={styles.imageOverlayTop}>
                      <View style={styles.liveBadge}>
                        <View style={styles.livePulseDot} />
                        <Text style={styles.liveBadgeText}>LIVE</Text>
                      </View>
                      <View style={styles.courseTagPill}>
                        <Text style={styles.courseTagText}>{item.courseName}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Card Content Details */}
                  <View style={styles.cardBody}>
                    {/* Day & Time */}
                    <View style={styles.dayTimePill}>
                      <Calendar size={11} color="#C2410C" />
                      <Text style={styles.dayTimeText}>{item.dayTime}</Text>
                    </View>

                    {/* Heading for the Live Class */}
                    <Text style={styles.cardTitle}>{item.title}</Text>

                    {/* Doctor Name */}
                    <Text style={styles.doctorName}>By {item.doctorName}</Text>

                    {/* Clean Action Row */}
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.joinBtn}
                        onPress={() => handleJoinClass(item.zoomLink, item.title, item.id)}
                        activeOpacity={0.88}
                      >
                        <Video size={14} color="#FFFFFF" />
                        <Text style={styles.joinBtnText}>Join Live Class ↗</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.reminderBtn, isReminded && styles.reminderBtnActive]}
                        onPress={() => handleToggleReminder(item.id)}
                        activeOpacity={0.8}
                      >
                        <Bell size={13} color={isReminded ? '#15803D' : '#64748B'} />
                        <Text style={[styles.reminderText, isReminded && styles.reminderTextActive]}>
                          {isReminded ? '✓ Set' : 'Remind'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ========================================= */}
        {/* 2. RECORDED CLASSES                       */}
        {/* ========================================= */}
        {activeTab === 'recorded' && (
          <View style={styles.cardsList}>
            {recordedClasses.map(rec => (
              <View key={rec.id} style={styles.minimalCard}>
                {/* Theme Hero Image Banner */}
                <View style={styles.cardImageContainer}>
                  <Image
                    source={{ uri: rec.imageUrl }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  {/* Top Overlay Badges */}
                  <View style={styles.imageOverlayTop}>
                    <View style={styles.recordedBadge}>
                      <Play size={10} color="#FFFFFF" fill="#FFFFFF" />
                      <Text style={styles.recordedBadgeText}>RECORDED</Text>
                    </View>
                    <View style={styles.courseTagPill}>
                      <Text style={styles.courseTagText}>{rec.courseName}</Text>
                    </View>
                  </View>
                </View>

                {/* Card Content Details */}
                <View style={styles.cardBody}>
                  {/* Duration Pill */}
                  <View style={styles.durationPill}>
                    <Clock size={11} color="#1D4ED8" />
                    <Text style={styles.durationText}>{rec.duration}</Text>
                  </View>

                  {/* Heading */}
                  <Text style={styles.cardTitle}>{rec.title}</Text>

                  {/* Doctor */}
                  <Text style={styles.doctorName}>By {rec.doctorName}</Text>

                  {/* Clean Action Button */}
                  <TouchableOpacity
                    style={styles.watchBtn}
                    onPress={() => {
                      setActiveVideo(rec);
                      setIsPlaying(false);
                    }}
                    activeOpacity={0.88}
                  >
                    <Play size={13} color="#FFFFFF" fill="#FFFFFF" />
                    <Text style={styles.watchBtnText}>Watch Recording</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ========================================= */}
        {/* 3. ASK DOCTOR Q&A                         */}
        {/* ========================================= */}
        {activeTab === 'qa' && (
          <View style={styles.cardsList}>
            {/* Minimal Question Card */}
            <View style={[styles.minimalCard, styles.qaCard]}>
              <View style={styles.qaHeader}>
                <MessageCircle size={16} color="#BE123C" />
                <Text style={styles.qaHeaderTitle}>Ask Doctor for Live Session</Text>
              </View>

              <TextInput
                style={styles.qaInput}
                placeholder="Type your question for the doctor..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={2}
                value={questionText}
                onChangeText={setQuestionText}
              />

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmitQuestion}
                disabled={isSubmitting}
                activeOpacity={0.88}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Send size={13} color="#FFFFFF" />
                    <Text style={styles.submitBtnText}>Ask Doctor →</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Answered Q&As list */}
            <Text style={styles.sectionTitle}>Recent Doctor Answers</Text>

            {answeredQAs.map(qa => (
              <View key={qa.id} style={[styles.minimalCard, styles.qaCard]}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.courseTagPill}>
                    <Text style={styles.courseTagText}>{qa.course}</Text>
                  </View>
                  <Text style={styles.qaDoctorText}>{qa.doctor}</Text>
                </View>

                <Text style={styles.qaQuestion}>Q: {qa.question}</Text>
                <Text style={styles.qaAnswer}>A: {qa.answer}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Video Modal */}
      <Modal
        visible={!!activeVideo}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveVideo(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {activeVideo?.title}
                </Text>
                <Text style={styles.modalSub}>
                  {activeVideo?.doctorName} • {activeVideo?.duration}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setActiveVideo(null)}
              >
                <X size={18} color="#475569" />
              </TouchableOpacity>
            </View>

            <View style={styles.playerBox}>
              {activeVideo?.imageUrl && !isPlaying && (
                <Image
                  source={{ uri: activeVideo.imageUrl }}
                  style={styles.playerBackdropImage}
                  resizeMode="cover"
                />
              )}
              {activeVideo?.imageUrl && !isPlaying && (
                <View style={styles.playerBackdropOverlay} />
              )}
              <TouchableOpacity
                style={styles.playTrigger}
                onPress={() => setIsPlaying(!isPlaying)}
                activeOpacity={0.85}
              >
                {isPlaying ? (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#059669', fontWeight: '800', fontSize: 13 }}>
                      ▶ PLAYING HD RECORDING
                    </Text>
                    <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 4 }}>
                      Audio synced with 432Hz Sound Vibration
                    </Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.playCircle}>
                      <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
                    </View>
                    <Text style={styles.playPrompt}>Tap to Play Lecture</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Soft creamy warm off-white
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF9F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 4,
    marginRight: 6,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
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
  helpBtn: {
    padding: 6,
  },

  // Main 3 Headings Tabs
  topHeadingsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FAF9F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  headingTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headingTabActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FDA4AF',
  },
  tabBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  pulseDotActive: {
    backgroundColor: '#BE123C',
  },
  headingTabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  headingTabTextActive: {
    color: '#BE123C',
    fontWeight: '800',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },

  cardsList: {
    gap: 10,
  },

  // Minimal Clean Card Box
  minimalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 8,
  },
  qaCard: {
    padding: 14,
  },
  cardImageContainer: {
    height: 135,
    width: '100%',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(190, 18, 60, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  recordedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recordedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  courseTagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  dayTimePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    marginBottom: 8,
  },
  dayTimeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#C2410C',
  },
  durationPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    marginBottom: 8,
  },
  durationText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1D4ED8',
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 2,
    lineHeight: 20,
  },
  doctorName: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 10,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  joinBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DE6B81', // Gentle pastel coral rose
    borderRadius: 12,
    paddingVertical: 9,
  },
  joinBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  reminderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reminderBtnActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#BBF7D0',
  },
  reminderText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  reminderTextActive: {
    color: '#15803D',
  },

  watchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DE6B81',
    borderRadius: 12,
    paddingVertical: 9,
  },
  watchBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },

  // Q&A
  qaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  qaHeaderTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  qaInput: {
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: '#1E1B4B',
    minHeight: 52,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DE6B81',
    borderRadius: 10,
    paddingVertical: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E1B4B',
    marginVertical: 6,
  },
  qaDoctorText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  qaQuestion: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: 3,
  },
  qaAnswer: {
    fontSize: 11.5,
    color: '#4B5563',
    lineHeight: 16,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  modalSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  playerBox: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  playerBackdropImage: {
    ...StyleSheet.absoluteFill,
  },
  playerBackdropOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  playTrigger: {
    alignItems: 'center',
  },
  playCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DE6B81',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  playPrompt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
});
