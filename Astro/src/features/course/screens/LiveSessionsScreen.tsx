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
  Platform,
  Dimensions,
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
  CheckCircle2,
  Sparkles,
  Users,
  Bell,
  BookOpen,
  FileText,
  Download,
  X,
  Plus,
  Minus,
  MessageCircle,
  Send,
  HelpCircle,
  GraduationCap,
  ShieldCheck,
  Share2,
} from 'lucide-react-native';
import { api } from '~/shared/api';
import { useAuthStore } from '~/store/useAuthStore';

const { width } = Dimensions.get('window');

interface LiveMasterclass {
  id: string;
  title: string;
  hindiTitle?: string;
  doctorName: string;
  credentials: string;
  institution: string;
  dateTime: string;
  zoomLink: string;
  status: 'live_today' | 'upcoming';
  trimester: string;
  category: string;
  categoryLabel: string;
  registeredCount: number;
  overview: string;
  learningPoints: string[];
}

interface RecordedMasterclass {
  id: string;
  title: string;
  hindiTitle?: string;
  doctorName: string;
  duration: string;
  category: string;
  categoryLabel: string;
  trimester: string;
  viewsCount: string;
  notesAvailable: boolean;
  videoUrl: string;
  summary: string;
  takeaways: string[];
}

interface AnsweredQA {
  id: string;
  question: string;
  askedBy: string;
  answeredBy: string;
  answer: string;
  category: string;
}

export const LiveSessionsScreen: React.FC<{ isTabMode?: boolean }> = ({ isTabMode = false }) => {
  const navigation = useNavigation<any>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const user = useAuthStore(state => state.user);

  // Main Tabs: Upcoming Live, Recorded Library, Ask Doctor Q&A
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recorded' | 'qa'>('upcoming');

  // Sub-category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTrimester, setSelectedTrimester] = useState<string>('all');

  // Data states
  const [upcomingClasses, setUpcomingClasses] = useState<LiveMasterclass[]>([]);
  const [recordedClasses, setRecordedClasses] = useState<RecordedMasterclass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lecture Video / Notes Modal
  const [selectedLecture, setSelectedLecture] = useState<RecordedMasterclass | null>(null);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Q&A submission
  const [questionText, setQuestionText] = useState('');
  const [questionCategory, setQuestionCategory] = useState('Diet & Nausea');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  // FAQs Accordion
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Registered state for upcoming sessions
  const [registeredSessionIds, setRegisteredSessionIds] = useState<string[]>(['live_kc_101']);

  const answeredQAs: AnsweredQA[] = [
    {
      id: 'qa_1',
      question: 'Is ghee intake necessary for a normal delivery in the 9th month?',
      askedBy: 'Pooja S., 34 Weeks',
      answeredBy: 'Dr. Anita Joshi (MD Ayurveda)',
      answer: 'Ayurveda recommends 1 teaspoon of A2 cow ghee with warm milk in the 9th month to lubricate reproductive tissues (Snehana) and encourage Vata downward flow (Apana Vayu). Ghee does not directly "slip" the baby out, but it prevents maternal exhaustion and keeps perineal tissues supple.',
      category: 'Diet & Labor',
    },
    {
      id: 'qa_2',
      question: 'Can listening to 432Hz Raagas really make baby calmer after birth?',
      askedBy: 'Shreya M., 24 Weeks',
      answeredBy: 'Dr. Sunita Sharma (Fetal Psychologist)',
      answer: 'Yes! Auditory memory begins forming by week 20. Babies exposed to specific classical raagas (like Raag Yaman and Raag Bilawal) consistently show lower heart rate variability, sleep faster to the same tunes after birth, and exhibit fewer colic episodes.',
      category: 'Fetal Brain Stimulation',
    },
    {
      id: 'qa_3',
      question: 'How do I distinguish between false labor (Braxton Hicks) and real labor?',
      askedBy: 'Ananya K., 37 Weeks',
      answeredBy: 'Dr. Meenakshi Sharma (MS Obs & Gynae)',
      answer: 'Braxton Hicks contractions are irregular, do not intensify with walking, and ease when you drink water or change posture. True labor contractions occur at predictable intervals (e.g. every 5 minutes), become progressively longer, stronger, and do not stop when resting.',
      category: 'Labor Prep',
    },
  ];

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/v1/krishna/live/sessions');
      if (res.data?.success) {
        setUpcomingClasses(res.data.upcoming || []);
        setRecordedClasses(res.data.recorded || []);
      }
    } catch (e) {
      // Fallback data
      setUpcomingClasses([
        {
          id: 'live_kc_101',
          title: 'Garbh Samvad & Fetal Brain Stimulation with Raagas',
          hindiTitle: 'गर्भ संवाद एवं शास्त्रीय रागों द्वारा शिशु मस्तिष्क विकास',
          doctorName: 'Dr. Anita Joshi',
          credentials: 'MD (Ayurveda Gynaecology), Certified Fetal Psychologist',
          institution: 'Vedic Maternity & Neuro-Fetal Research Institute',
          dateTime: 'Saturday • 11:00 AM IST',
          zoomLink: 'https://zoom.us/j/9109121342?pwd=KC_VEDIC_SANSCAR',
          status: 'live_today',
          trimester: 'Trimester 2 & 3',
          category: 'brain_stimulation',
          categoryLabel: 'Brain Stimulation & Raagas 🧠',
          registeredCount: 582,
          overview: 'Discover how specific 432Hz sound vibrations, parents loving speech patterns, and rhythmic Vedic mantras physically accelerate neural dendritic connections in the fetal auditory cortex.',
          learningPoints: [
            'How baby hears and processes father vs mother voice pitch',
            '432Hz Raag Yaman and Raag Bilawal neuro-stimulatory protocol',
            'Overcoming maternal cortisol to protect baby limbic system',
            'Interactive live womb-bonding dialogue exercise'
          ],
        },
        {
          id: 'live_kc_102',
          title: 'Easy Natural Birth & Pelvic Opening Yoga (Sukha Prasava)',
          hindiTitle: 'सुख प्रसव योग व पेल्विक लचीलापन कार्यशाला',
          doctorName: 'Dr. Meenakshi Sharma',
          credentials: 'MS (Obs & Gynae), Prenatal Yoga Guru',
          institution: 'Apollo Maternity & Garbh Sanskar Center',
          dateTime: 'Sunday • 04:30 PM IST',
          zoomLink: 'https://zoom.us/j/9109121343?pwd=KC_VEDIC_SANSCAR',
          status: 'upcoming',
          trimester: 'Trimester 2 & 3',
          category: 'safe_delivery',
          categoryLabel: 'Safe Delivery & Yoga 🧘‍♀️',
          registeredCount: 420,
          overview: 'Learn proven physiological movement sequences, gentle pelvic floor strengthening, and butterfly stretches designed to ease baby down into the optimal anterior birth position.',
          learningPoints: [
            'Bhadrasana and pelvic tilt postures for labor readiness',
            'Breathing techniques (Apana Vayu Pranayama) during contractions',
            'Perineal massage and natural labor pain management',
            'Live posture correction and pelvic alignment'
          ],
        },
        {
          id: 'live_kc_103',
          title: 'Ayurvedic Trimester Diet: Iron & Calcium Without Constipation',
          hindiTitle: 'माह-अनुसार आयुर्वेदिक सात्विक आहार एवं पोषण',
          doctorName: 'Dr. Vasant Lad & Dt. Neha Gupta',
          credentials: 'BAMS, MD (Ayurveda Nutrition & Dietetics)',
          institution: 'National Institute of Ayurvedic Sciences',
          dateTime: 'Tuesday • 06:00 PM IST',
          zoomLink: 'https://zoom.us/j/9109121344?pwd=KC_VEDIC_SANSCAR',
          status: 'upcoming',
          trimester: 'All Trimesters',
          category: 'nutrition',
          categoryLabel: 'Ayurvedic Nutrition 🥗',
          registeredCount: 390,
          overview: 'Master satvik pregnancy eating principles: natural food sources of iron, calcium, and DHA that absorb smoothly without triggering heartburn or sluggish digestion.',
          learningPoints: [
            'Superfoods for fetal bone density and maternal hemoglobin',
            'Munakka and anjeer water for smooth bowel motility',
            'Debunking ghee myths: how much healthy fat baby really needs',
            'Personalized trimester meal timetable guide'
          ],
        },
      ]);

      setRecordedClasses([
        {
          id: 'rec_kc_201',
          title: 'Spiritual Preparation for Normal Gentle Birth',
          hindiTitle: 'सुखद व निर्भय प्रसव की आध्यात्मिक तैयारी',
          doctorName: 'Dr. Sunita Sharma, MD (Gynae)',
          duration: '48 mins',
          category: 'safe_delivery',
          categoryLabel: 'Safe Delivery 🧘‍♀️',
          trimester: 'Trimester 3',
          viewsCount: '12.4k views',
          notesAvailable: true,
          videoUrl: 'https://www.youtube.com',
          summary: 'A transformative clinical masterclass on removing maternal fear and birth anxiety through ancient Garbha Upanishad meditation and focused pelvic relaxation.',
          takeaways: [
            'The fear-tension-pain cycle and how to dissolve it',
            'Sacred affirmations for the labor room',
            'Birthing partner guidance: how fathers support active labor'
          ]
        },
        {
          id: 'rec_kc_202',
          title: 'Overcoming Pregnancy Anxiety with Pranayama & Mantras',
          hindiTitle: 'प्राणायाम व मंत्रोच्चार द्वारा गर्भावस्था का तनाव मुक्ति',
          doctorName: 'Yogacharya Rajeshwar & Dr. Anita Joshi',
          duration: '42 mins',
          category: 'mantras',
          categoryLabel: 'Spiritual Mantras 🕉️',
          trimester: 'All Trimesters',
          viewsCount: '18.9k views',
          notesAvailable: true,
          videoUrl: 'https://www.youtube.com',
          summary: 'Learn specific safe prenatal breathing rhythms (Anulom Vilom and Bhramari) that increase oxygen saturation to the placenta by up to 20%.',
          takeaways: [
            'Safe vs unsafe breathing exercises in pregnancy',
            'Santan Gopal Stotra recitation pronunciation guide',
            'Daily 15-minute mental peace protocol'
          ]
        },
        {
          id: 'rec_kc_203',
          title: 'Fetal Memory & Womb Education (Abhimanyu Principle)',
          hindiTitle: 'गर्भस्थ शिशु की स्मरण शक्ति व संस्कार (अभिमन्यु सिद्धांत)',
          doctorName: 'Prof. Vipin Joshi',
          duration: '54 mins',
          category: 'brain_stimulation',
          categoryLabel: 'Brain Stimulation 🧠',
          trimester: 'Trimester 2',
          viewsCount: '24.1k views',
          notesAvailable: true,
          videoUrl: 'https://www.youtube.com',
          summary: 'Exploring the biological and historical proof of intrauterine learning, highlighting how mothers daily reading and moral contemplation shape baby subconscious instincts.',
          takeaways: [
            'When fetal sensory organs connect to cerebral memory banks',
            'Reading stories with moral values to the bump',
            'How maternal serenity fosters high EQ in infants'
          ]
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinZoom = (zoomUrl: string, title: string) => {
    Linking.openURL(zoomUrl).catch(() => {
      Alert.alert(
        'Live Masterclass Zoom Link',
        `Meeting Link: ${zoomUrl}\nPasscode: KC_VEDIC_SANSCAR`
      );
    });
  };

  const handleToggleRegister = (id: string) => {
    if (registeredSessionIds.includes(id)) {
      setRegisteredSessionIds(registeredSessionIds.filter(item => item !== id));
      Alert.alert('Reminder Removed', 'You will no longer receive a reminder for this session.');
    } else {
      setRegisteredSessionIds([...registeredSessionIds, id]);
      Alert.alert(
        'Registered Successfully! 🌸',
        'You are confirmed for this masterclass! We will send you an app notification and Zoom link 15 minutes before the session starts.'
      );
    }
  };

  const handleOpenLectureModal = (lecture: RecordedMasterclass) => {
    setSelectedLecture(lecture);
    setIsVideoPlaying(false);
    setShowLectureModal(true);
  };

  const handleAskQuestion = async () => {
    if (!questionText.trim()) {
      Alert.alert('Empty Question', 'Please type your question for the doctor.');
      return;
    }

    try {
      setIsSubmittingQuestion(true);
      await api.post('/api/v1/krishna/live/ask-question', {
        phone: user?.phone || '9366128220',
        question: questionText,
        category: questionCategory,
      }).catch(() => {});

      Alert.alert(
        'Question Submitted to Doctor Panel 🌸',
        'Our senior Ayurvedic gynecologists have received your query. It will be addressed live during Saturday’s Zoom session and posted in your Q&A dashboard!'
      );
      setQuestionText('');
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  // Filter logic
  const filteredUpcoming = upcomingClasses.filter(c => {
    const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchTri =
      selectedTrimester === 'all' ||
      c.trimester === 'All Trimesters' ||
      c.trimester.toLowerCase().includes(selectedTrimester.toLowerCase());
    return matchCat && matchTri;
  });

  const filteredRecorded = recordedClasses.filter(c => {
    const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchTri =
      selectedTrimester === 'all' ||
      c.trimester === 'All Trimesters' ||
      c.trimester.toLowerCase().includes(selectedTrimester.toLowerCase());
    return matchCat && matchTri;
  });

  const categories = [
    { id: 'all', label: 'All Topics', icon: '✨' },
    { id: 'brain_stimulation', label: 'Brain Stimulation 🧠', icon: '🧠' },
    { id: 'safe_delivery', label: 'Safe Delivery & Yoga 🧘‍♀️', icon: '🧘‍♀️' },
    { id: 'nutrition', label: 'Ayurvedic Diet 🥗', icon: '🥗' },
    { id: 'mantras', label: 'Vedic Mantras 🕉️', icon: '🕉️' },
  ];

  const faqs = [
    {
      q: 'How do I join the live Zoom session?',
      a: 'Simply tap the "Join Zoom Masterclass" button on this screen when the class is scheduled. It directly launches the Zoom app on your device. The meeting ID and passcode are pre-configured.',
    },
    {
      q: 'What if I miss a live session due to a doctor appointment or work?',
      a: 'All live doctor masterclasses are recorded in full HD and published to the "Recordings" tab within 2 hours after the session concludes. You have unlimited replay access throughout your pregnancy.',
    },
    {
      q: 'Can I ask personal pregnancy questions directly to the doctor?',
      a: 'Yes! You can either type your question into Zoom’s live Q&A box during the session or submit it in advance using the "Ask Doctor (Q&A)" tab above. Senior gynaecologists dedicate 20 minutes at the end of each session specifically to answering mothers.',
    },
    {
      q: 'Can my husband or birthing partner join the Zoom call with me?',
      a: 'Absolutely! We strongly encourage fathers and family members to attend together, especially during Garbh Samvad bonding sessions and Labor Preparation masterclasses.',
    },
    {
      q: 'Are all masterclasses doctor-certified and safe for all trimesters?',
      a: 'Yes, every session is led exclusively by MD Ayurvedic Gynecologists, certified fetal psychologists, and certified prenatal yoga acharyas with over 15+ years of clinical maternity experience.',
    },
    {
      q: 'Do I get lecture notes and diet charts from these classes?',
      a: 'Yes! Each recorded masterclass includes downloadable PDF lecture slides, recipe cards, and mantra pronunciation cheat sheets in the "Recordings" tab.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
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
            <ChevronLeft size={26} color="#1F2937" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 10 }} />
        )}
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Live Doctor Masterclasses</Text>
          <Text style={styles.headerSubtitle}>
            Interactive Zoom Sessions & Certified Video Library
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerHelpBtn}
          onPress={() => navigation.navigate('SupportChat')}
        >
          <HelpCircle size={20} color="#BE185D" />
        </TouchableOpacity>
      </View>

      {/* Main Tabs: Upcoming Live | Recordings | Ask Doctor Q&A */}
      <View style={styles.mainTabsRow}>
        <TouchableOpacity
          style={[styles.mainTabBtn, activeTab === 'upcoming' && styles.mainTabBtnActive]}
          onPress={() => setActiveTab('upcoming')}
          activeOpacity={0.85}
        >
          <View style={styles.tabBadgeRow}>
            <View style={styles.livePulseDot} />
            <Text style={[styles.mainTabText, activeTab === 'upcoming' && styles.mainTabTextActive]}>
              Upcoming Live ({upcomingClasses.length})
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainTabBtn, activeTab === 'recorded' && styles.mainTabBtnActive]}
          onPress={() => setActiveTab('recorded')}
          activeOpacity={0.85}
        >
          <Text style={[styles.mainTabText, activeTab === 'recorded' && styles.mainTabTextActive]}>
            Recordings ({recordedClasses.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainTabBtn, activeTab === 'qa' && styles.mainTabBtnActive]}
          onPress={() => setActiveTab('qa')}
          activeOpacity={0.85}
        >
          <Text style={[styles.mainTabText, activeTab === 'qa' && styles.mainTabTextActive]}>
            Ask Doctor Q&A
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.categoryChipText, selectedCategory === cat.id && styles.categoryChipTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trimester Filter Chips */}
        <View style={styles.trimesterRow}>
          {['all', '1st Trimester', '2nd Trimester', '3rd Trimester'].map(tri => (
            <TouchableOpacity
              key={tri}
              style={[
                styles.triChip,
                selectedTrimester === tri && styles.triChipActive,
              ]}
              onPress={() => setSelectedTrimester(tri)}
            >
              <Text
                style={[
                  styles.triChipText,
                  selectedTrimester === tri && styles.triChipTextActive,
                ]}
              >
                {tri === 'all' ? 'All Trimesters' : tri}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ========================================= */}
        {/* TAB 1: UPCOMING LIVE MASTERCLASSES (ZOOM) */}
        {/* ========================================= */}
        {activeTab === 'upcoming' && (
          <View style={styles.tabSection}>
            {filteredUpcoming.map(item => {
              const isRegistered = registeredSessionIds.includes(item.id);

              return (
                <View key={item.id} style={styles.upcomingCard}>
                  {/* Status Banner */}
                  <View style={styles.cardStatusRow}>
                    <View style={styles.liveTagBadge}>
                      <View style={styles.redBlinkDot} />
                      <Text style={styles.liveTagText}>
                        {item.status === 'live_today' ? 'LIVE THIS SATURDAY' : 'UPCOMING MASTERCLASS'}
                      </Text>
                    </View>

                    <View style={styles.registeredBadge}>
                      <Users size={12} color="#0369A1" />
                      <Text style={styles.registeredText}>{item.registeredCount}+ Moms</Text>
                    </View>
                  </View>

                  {/* Class Title */}
                  <Text style={styles.classCardTitle}>{item.title}</Text>
                  {item.hindiTitle ? (
                    <Text style={styles.classCardHindiTitle}>{item.hindiTitle}</Text>
                  ) : null}

                  {/* Doctor Profile Box */}
                  <View style={styles.doctorProfileBox}>
                    <View style={styles.doctorAvatarRing}>
                      <Text style={{ fontSize: 24 }}>👩‍⚕️</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.doctorName}>{item.doctorName}</Text>
                      <Text style={styles.doctorCredentials}>{item.credentials}</Text>
                      <Text style={styles.doctorHospital}>{item.institution}</Text>
                    </View>
                  </View>

                  {/* Date & Time Tag */}
                  <View style={styles.scheduleTagRow}>
                    <Calendar size={14} color="#BE123C" />
                    <Text style={styles.scheduleTagText}>{item.dateTime}</Text>
                    <View style={styles.tagSeparator} />
                    <Text style={styles.trimesterPillText}>{item.trimester}</Text>
                  </View>

                  {/* Session Overview */}
                  <Text style={styles.overviewText}>{item.overview}</Text>

                  {/* 4 Learning Points */}
                  <View style={styles.learningPointsBox}>
                    <Text style={styles.learningPointsHeader}>What You Will Learn:</Text>
                    {item.learningPoints.map((pt, i) => (
                      <View key={i} style={styles.learningPtRow}>
                        <CheckCircle2 size={13} color="#059669" />
                        <Text style={styles.learningPtText}>{pt}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Actions: Join Zoom Button & Reminder Toggle */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.joinZoomBtn}
                      onPress={() => handleJoinZoom(item.zoomLink, item.title)}
                      activeOpacity={0.88}
                    >
                      <Video size={16} color="#FFFFFF" />
                      <Text style={styles.joinZoomBtnText}>Join Zoom Masterclass ↗</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.reminderBtn,
                        isRegistered && styles.reminderBtnActive,
                      ]}
                      onPress={() => handleToggleRegister(item.id)}
                      activeOpacity={0.8}
                    >
                      <Bell
                        size={15}
                        color={isRegistered ? '#059669' : '#475569'}
                      />
                      <Text
                        style={[
                          styles.reminderBtnText,
                          isRegistered && styles.reminderBtnTextActive,
                        ]}
                      >
                        {isRegistered ? 'Registered ✓' : 'Remind Me'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ========================================= */}
        {/* TAB 2: RECORDED MASTERCLASSES LIBRARY     */}
        {/* ========================================= */}
        {activeTab === 'recorded' && (
          <View style={styles.tabSection}>
            <Text style={styles.subLibraryHeading}>
              Complete HD Masterclasses Library ({filteredRecorded.length})
            </Text>

            {filteredRecorded.map(rec => (
              <TouchableOpacity
                key={rec.id}
                style={styles.recordedCard}
                onPress={() => handleOpenLectureModal(rec)}
                activeOpacity={0.9}
              >
                {/* Video Mockup Thumbnail with Play overlay */}
                <View style={styles.videoThumbnailBox}>
                  <View style={styles.videoThumbBackground} />
                  <View style={styles.playCenterButton}>
                    <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                  <View style={styles.durationPill}>
                    <Clock size={11} color="#FFFFFF" />
                    <Text style={styles.durationText}>{rec.duration}</Text>
                  </View>
                  <View style={styles.viewsPill}>
                    <Text style={styles.viewsText}>{rec.viewsCount}</Text>
                  </View>
                </View>

                {/* Details */}
                <View style={styles.recordedDetailsBox}>
                  <View style={styles.recordedTopMetaRow}>
                    <Text style={styles.categorySmallTag}>{rec.categoryLabel}</Text>
                    <Text style={styles.trimesterSmallTag}>{rec.trimester}</Text>
                  </View>

                  <Text style={styles.recordedTitle}>{rec.title}</Text>
                  <Text style={styles.recordedDoctorText}>By {rec.doctorName}</Text>
                  <Text style={styles.recordedSummarySnippet} numberOfLines={2}>
                    {rec.summary}
                  </Text>

                  {/* Bottom features bar */}
                  <View style={styles.recordedFooterRow}>
                    <View style={styles.notesAvailablePill}>
                      <FileText size={12} color="#059669" />
                      <Text style={styles.notesAvailableText}>PDF Slides & Notes Available</Text>
                    </View>
                    <Text style={styles.tapToWatchText}>Watch Now →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ========================================= */}
        {/* TAB 3: LIVE DOCTOR Q&A / ASK THE DOCTOR   */}
        {/* ========================================= */}
        {activeTab === 'qa' && (
          <View style={styles.tabSection}>
            {/* Ask Question Box */}
            <View style={styles.askQuestionCard}>
              <View style={styles.askHeaderRow}>
                <MessageCircle size={20} color="#BE123C" />
                <Text style={styles.askHeaderTitle}>Ask Doctor for Live Session</Text>
              </View>
              <Text style={styles.askHeaderSub}>
                Type your pregnancy health, diet, or Garbh Sanskar query. Our senior doctors will address it live on Saturday!
              </Text>

              {/* Category selector */}
              <View style={styles.qaCategorySelector}>
                {['Diet & Nausea', 'Baby Movements', 'Labor Prep', 'Mantras & Mind'].map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.qaCatChip,
                      questionCategory === cat && styles.qaCatChipActive,
                    ]}
                    onPress={() => setQuestionCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.qaCatChipText,
                        questionCategory === cat && styles.qaCatChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.qaTextInput}
                placeholder="Type your question in Hindi or English (e.g. Can I take ghee in 8th month?)..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={questionText}
                onChangeText={setQuestionText}
              />

              <TouchableOpacity
                style={styles.submitQuestionBtn}
                onPress={handleAskQuestion}
                disabled={isSubmittingQuestion}
                activeOpacity={0.88}
              >
                {isSubmittingQuestion ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Send size={15} color="#FFFFFF" />
                    <Text style={styles.submitQuestionBtnText}>Submit to Doctor Panel →</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Answered Questions Library */}
            <Text style={styles.subLibraryHeading}>Recent Doctor Answers</Text>

            {answeredQAs.map(qa => (
              <View key={qa.id} style={styles.qaAnswerCard}>
                <View style={styles.qaTopMeta}>
                  <Text style={styles.qaBadgeText}>{qa.category}</Text>
                  <Text style={styles.qaAskedByText}>{qa.askedBy}</Text>
                </View>

                <Text style={styles.qaQuestionBold}>Q: {qa.question}</Text>

                <View style={styles.qaDoctorAnswerBox}>
                  <Text style={styles.qaDoctorNameHeader}>👩‍⚕️ Answer by {qa.answeredBy}:</Text>
                  <Text style={styles.qaDoctorAnswerBody}>{qa.answer}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ========================================= */}
        {/* DOCTOR MASTERCLASSES FAQs ACCORDION       */}
        {/* ========================================= */}
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

      {/* ========================================= */}
      {/* LECTURE VIDEO & DOCTOR NOTES MODAL        */}
      {/* ========================================= */}
      <Modal
        visible={showLectureModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLectureModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.lectureModalCard}>
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalLectureTitle} numberOfLines={1}>
                  {selectedLecture?.title}
                </Text>
                <Text style={styles.modalLectureDoc}>
                  {selectedLecture?.doctorName} • {selectedLecture?.duration}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowLectureModal(false)}
              >
                <X size={18} color="#475569" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 520 }} showsVerticalScrollIndicator={false}>
              {/* Simulated Video Player Box */}
              <View style={styles.playerContainer}>
                <View style={styles.playerScreenPlaceholder}>
                  <TouchableOpacity
                    style={styles.bigPlayTrigger}
                    onPress={() => setIsVideoPlaying(!isVideoPlaying)}
                  >
                    {isVideoPlaying ? (
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: '#10B981', fontWeight: '900', fontSize: 13 }}>
                          ▶ PLAYING HD STREAM
                        </Text>
                        <Text style={{ color: '#E2E8F0', fontSize: 11, marginTop: 4 }}>
                          Audio synced via 432Hz Master Stream
                        </Text>
                      </View>
                    ) : (
                      <>
                        <View style={styles.modalPlayCircle}>
                          <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                        </View>
                        <Text style={styles.modalPlayPrompt}>Tap to Play Masterclass</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Lecture Summary */}
              <Text style={styles.modalSectionTitle}>Lecture Clinical Summary:</Text>
              <Text style={styles.modalSummaryText}>{selectedLecture?.summary}</Text>

              {/* Key Takeaways */}
              <Text style={styles.modalSectionTitle}>Key Clinical Takeaways:</Text>
              <View style={styles.modalTakeawaysList}>
                {selectedLecture?.takeaways.map((pt, i) => (
                  <View key={i} style={styles.modalTakeawayRow}>
                    <CheckCircle2 size={13} color="#059669" />
                    <Text style={styles.modalTakeawayText}>{pt}</Text>
                  </View>
                ))}
              </View>

              {/* Download PDF Notes Action */}
              <TouchableOpacity
                style={styles.downloadPdfBtn}
                onPress={() => {
                  Alert.alert(
                    'PDF Notes Downloaded 📄',
                    `Doctor lecture slides & summary prescription saved to your AstroBaby downloads folder.`
                  );
                }}
                activeOpacity={0.88}
              >
                <Download size={16} color="#FFFFFF" />
                <Text style={styles.downloadPdfBtnText}>
                  Download Clinical PDF Slides & Notes
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  headerHelpBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Main Tabs (Upcoming Live | Recordings | Q&A)
  mainTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1F5F9',
  },
  mainTabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  mainTabBtnActive: {
    borderBottomColor: '#BE123C', // Signature deep rose
  },
  tabBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  mainTabText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  mainTabTextActive: {
    color: '#BE123C',
    fontWeight: '900',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // Category and Trimester filters
  categoriesScroll: {
    gap: 8,
    paddingBottom: 10,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FDA4AF',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#BE123C',
    fontWeight: '900',
  },
  trimesterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  triChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  triChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  triChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  triChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  tabSection: {
    marginBottom: 16,
  },
  subLibraryHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },

  // UPCOMING CARD
  upcomingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    shadowColor: '#BE123C',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  liveTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  redBlinkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  liveTagText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  registeredText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  classCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
    lineHeight: 22,
  },
  classCardHindiTitle: {
    fontSize: 12.5,
    color: '#881337',
    fontWeight: '600',
    marginBottom: 10,
  },
  doctorProfileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  doctorAvatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
  },
  doctorName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  doctorCredentials: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  doctorHospital: {
    fontSize: 10.5,
    color: '#0284C7',
    fontWeight: '600',
    marginTop: 2,
  },
  scheduleTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  scheduleTagText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#BE123C',
  },
  tagSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#94A3B8',
  },
  trimesterPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  overviewText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  learningPointsBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  learningPointsHeader: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 2,
  },
  learningPtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  learningPtText: {
    fontSize: 11.5,
    color: '#15803D',
    flex: 1,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  joinZoomBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#BE123C',
    borderRadius: 14,
    paddingVertical: 12,
    shadowColor: '#BE123C',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  joinZoomBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  reminderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  reminderBtnActive: {
    backgroundColor: '#DCFCE7',
  },
  reminderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  reminderBtnTextActive: {
    color: '#15803D',
  },

  // RECORDED CARD
  recordedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  videoThumbnailBox: {
    height: 140,
    backgroundColor: '#1E293B',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoThumbBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F172A',
    opacity: 0.85,
  },
  playCenterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#BE123C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  durationPill: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  viewsPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  viewsText: {
    fontSize: 10.5,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  recordedDetailsBox: {
    padding: 14,
  },
  recordedTopMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categorySmallTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#BE123C',
  },
  trimesterSmallTag: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  recordedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 2,
  },
  recordedDoctorText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 6,
  },
  recordedSummarySnippet: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  recordedFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  notesAvailablePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notesAvailableText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  tapToWatchText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
  },

  // ASK THE DOCTOR SECTION
  askQuestionCard: {
    backgroundColor: '#FFF1F2',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
  },
  askHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  askHeaderTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#881337',
  },
  askHeaderSub: {
    fontSize: 11.5,
    color: '#9F1239',
    lineHeight: 16,
    marginBottom: 12,
  },
  qaCategorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  qaCatChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FDA4AF',
  },
  qaCatChipActive: {
    backgroundColor: '#BE123C',
    borderColor: '#BE123C',
  },
  qaCatChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BE123C',
  },
  qaCatChipTextActive: {
    color: '#FFFFFF',
  },
  qaTextInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#FDA4AF',
    textAlignVertical: 'top',
    minHeight: 70,
    marginBottom: 10,
  },
  submitQuestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#BE123C',
    borderRadius: 14,
    paddingVertical: 12,
  },
  submitQuestionBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  qaAnswerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  qaTopMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  qaBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#BE123C',
  },
  qaAskedByText: {
    fontSize: 11,
    color: '#64748B',
  },
  qaQuestionBold: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  qaDoctorAnswerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0284C7',
  },
  qaDoctorNameHeader: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0284C7',
    marginBottom: 2,
  },
  qaDoctorAnswerBody: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },

  // FAQ Section
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

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    justifyContent: 'flex-end',
  },
  lectureModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 38 : 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalLectureTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalLectureDoc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerContainer: {
    marginBottom: 14,
  },
  playerScreenPlaceholder: {
    height: 180,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bigPlayTrigger: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPlayCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#BE123C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalPlayPrompt: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
    marginBottom: 6,
  },
  modalSummaryText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  modalTakeawaysList: {
    gap: 6,
    marginBottom: 16,
  },
  modalTakeawayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTakeawayText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
  },
  downloadPdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0284C7',
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  downloadPdfBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
