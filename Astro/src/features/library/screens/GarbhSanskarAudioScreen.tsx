import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Headphones,
  Sparkles,
  Heart,
  Brain,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  X,
  Clock,
  CheckCircle2,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface AudioTrack {
  id: string;
  title: string;
  titleHi: string;
  category: 'raagas' | 'mantras' | 'lullabies' | 'brain' | 'sleep';
  categoryLabel: string;
  categoryLabelHi: string;
  badge?: string;
  badgeHi?: string;
  imageUrl: string;
  duration: string;
  frequency: string;
  shortDesc: string;
  shortDescHi: string;
  fullDesc: string;
  fullDescHi: string;
  fetalBenefit: string;
  fetalBenefitHi: string;
  instrument: string;
  instrumentHi: string;
}

const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'a1',
    title: 'Raag Yaman & 432Hz Fetal Calm',
    titleHi: 'राग यमन व 432Hz शांति नाद',
    category: 'raagas',
    categoryLabel: '432Hz Raagas',
    categoryLabelHi: 'राग संगीत',
    badge: 'POPULAR',
    badgeHi: 'लोकप्रिय',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    duration: '15 mins',
    frequency: '432Hz Healing Frequency',
    shortDesc: 'Evening harmonic raaga that slows fetal heart rate variability into deep peaceful rhythm.',
    shortDescHi: 'शाम का मधुर शास्त्रीय राग जो शिशु की धड़कन को शांत और विश्रामपूर्ण लय प्रदान करता है।',
    fullDesc:
      'Raag Yaman is revered in Indian classical music for evoking profound serenity and divine bliss. Tuned to 432Hz—the natural harmonic frequency of nature—this track pacifies maternal cortisol and gently stimulates the developing auditory cortex of the fetus.',
    fullDescHi:
      'राग यमन भारतीय शास्त्रीय संगीत का अत्यंत शांत राग है। 432Hz की प्राकृतिक आवृत्ति पर निर्मित यह नाद माँ के तनाव को शून्य करता है और गर्भस्थ शिशु की श्रवण तंत्रिकाओं को शांति और सुरक्षा का अनुभव कराता है।',
    fetalBenefit: 'Promotes alpha brain waves and stabilizes fetal heart rate during maternal rest.',
    fetalBenefitHi: 'माँ के मन में शांति उत्पन्न कर शिशु में अल्फा तरंगों का संचार करता है।',
    instrument: 'Bansuri (Flute) & Tanpura',
    instrumentHi: 'बांसुरी व तानपुरा',
  },
  {
    id: 'a2',
    title: 'Gayatri Mahamantra & Vedic Sunrise',
    titleHi: 'गायत्री महामंत्र व वैदिक प्रभात',
    category: 'mantras',
    categoryLabel: 'Vedic Mantras',
    categoryLabelHi: 'वैदिक मंत्र',
    badge: 'MUST LISTEN',
    badgeHi: 'अनिवार्य',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=500&auto=format&fit=crop&q=80',
    duration: '12 mins',
    frequency: '528Hz DNA Resonance',
    shortDesc: '24 sacred Vedic acoustic syllables that awaken pure intelligence and vital life force (Prana).',
    shortDescHi: '24 पावन वैदिक अक्षरों की पावन ध्वनि जो शिशु की प्रज्ञा और प्राण ऊर्जा को जागृत करती है।',
    fullDesc:
      'Chanted in authentic Vedic metre, each syllable of the Gayatri Mantra produces distinct acoustic resonance points along the human endocrine system, delivering pure positive vibrations directly through the amniotic fluid to the unborn child.',
    fullDescHi:
      'वैदिक छंद में उच्चारित गायत्री मंत्र का प्रत्येक अक्षर माता के अंतःस्रावी तंत्र में दिव्य कंपन उत्पन्न करता है, जो गर्भ जल के माध्यम से शिशु तक पहुंचकर उसे तेजस्विता प्रदान करता है।',
    fetalBenefit: 'Cultivates high intellect (Dhee Shakti) and spiritual tranquility in fetal memory.',
    fetalBenefitHi: 'शिशु की स्मरण शक्ति और सात्विक बुद्धि (धी-शक्ति) को पोषित करता है।',
    instrument: 'Vedic Chanting & Temple Bells',
    instrumentHi: 'वैदिक स्वर व मंदिर की घंटियां',
  },
  {
    id: 'a3',
    title: 'Kanha Sweet Womb Lullaby',
    titleHi: 'कान्हा की मीठी गर्भ लोरी',
    category: 'lullabies',
    categoryLabel: 'Womb Lullabies',
    categoryLabelHi: 'गर्भ लोरी',
    badge: 'NEW',
    badgeHi: 'नया',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80',
    duration: '10 mins',
    frequency: 'Theta Wave Soothing',
    shortDesc: 'Gentle maternal hum and flute melody that lulls your baby into sweet womb slumber.',
    shortDescHi: 'माँ की कोमल गुनगुनाहट और बांसुरी की धुन जो शिशु को गर्भ में मीठी नींद की ओर ले जाती है।',
    fullDesc:
      'A mother’s voice and melodic humming are the very first sounds a fetus learns to love. This lullaby mimics the natural rhythm of the maternal pulse, making the womb feel safe, warm, and cocooned in unconditional love.',
    fullDescHi:
      'माँ की मधुर आवाज और ममतामयी लोरी वह प्रथम ध्वनि है जिसे शिशु गर्भ में पहचानता है। यह लोरी शिशु को गर्भ में पूर्ण सुरक्षा और मातृत्व के अगाध प्रेम का अनुभव कराती है।',
    fetalBenefit: 'Calms nighttime fetal kicks and supports healthy rapid eye movement (REM) sleep.',
    fetalBenefitHi: 'रात में शिशु की अत्यधिक हलचल को शांत कर गहरी और सुखद निद्रा में सहायक है।',
    instrument: 'Soft Acoustic Guitar & Bansuri',
    instrumentHi: 'बांसुरी व कोमल गिटार',
  },
  {
    id: 'a4',
    title: 'Saraswati Medha Suktam: Fetal Brain Power',
    titleHi: 'सरस्वती मेधा सूक्त व मस्तिष्क तरंगें',
    category: 'brain',
    categoryLabel: 'Brain Stimulation',
    categoryLabelHi: 'मस्तिष्क विकास',
    badge: 'IQ BOOSTER',
    badgeHi: 'आई-क्यू बूस्टर',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    duration: '18 mins',
    frequency: 'Gamma Resonance',
    shortDesc: 'Ancient Vedic hymn for neuro-cognitive synapse formation and prenatal memory retention.',
    shortDescHi: 'शिशु के मस्तिष्क की तंत्रिकाओं और स्मरण शक्ति को विकसित करने वाला प्राचीन वैदिक सूक्त।',
    fullDesc:
      'Medha Suktam invokes the divine faculty of memory, wisdom, and cognitive sharpness. Neuroscience confirms that complex acoustic rhythms played during the second and third trimesters enhance fetal dendritic branching and synaptic density.',
    fullDescHi:
      'मेधा सूक्त स्मरण शक्ति, बुद्धिमत्ता और एकाग्रता का आह्वान करता है। न्यूरोसाइंस प्रमाणित करता है कि गर्भावस्था में शास्त्रीय नाद सुनने से शिशु के मस्तिष्क की तंत्रिकाएं तेजी से जुड़ती हैं।',
    fetalBenefit: 'Stimulates auditory cortex and enhances future post-birth language comprehension.',
    fetalBenefitHi: 'शिशु के मस्तिष्क के श्रवण और भाषा केंद्रों को जन्म से पूर्व ही सशक्त बनाता है।',
    instrument: 'Veena, Sitar & Chanting',
    instrumentHi: 'वीणा, सितार व पावन मंत्र',
  },
  {
    id: 'a5',
    title: 'Raag Bhairavi Night Sleep Meditation',
    titleHi: 'शास्त्रीय भैरवी व गहन विश्राम',
    category: 'sleep',
    categoryLabel: 'Sleep & Calm',
    categoryLabelHi: 'निद्रा व शांति',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80',
    duration: '20 mins',
    frequency: '432Hz Deep Rest',
    shortDesc: 'Gentle sitar and tanpura frequencies that relieve maternal insomnia and soothe baby.',
    shortDescHi: 'सितार और तानपुरे की शांत तरंगें जो अनिद्रा दूर कर माँ और शिशु को गहरी शांति देती हैं।',
    fullDesc:
      'Designed for evening wind-down and bedtime, Raag Bhairavi dissolves pregnancy anxiety and helps the mother sink into deep restorative sleep. When the mother sleeps deeply, optimal blood and nutrient flow reach the placenta.',
    fullDescHi:
      'शाम और रात्रि के समय सुनने हेतु राग भैरवी गर्भावस्था के तनाव को मिटाकर गहरी नींद लाता है। जब माँ गहरी नींद में होती है, तो प्लेसेंटा तक रक्त और पोषण का प्रवाह सर्वोत्तम होता है।',
    fetalBenefit: 'Induces delta waves for deep cell regeneration and healthy fetal weight growth.',
    fetalBenefitHi: 'गहन विश्राम में शिशु का शारीरिक और कोशिकीय विकास तीव्र गति से होता है।',
    instrument: 'Sitar, Santoor & Water Stream',
    instrumentHi: 'सितार, संतूर व जल प्रवाह',
  },
];

export const GarbhSanskarAudioScreen: React.FC = () => {
  const navigation = useNavigation();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTrack, setActiveTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSeconds, setPlaybackSeconds] = useState<number>(0);

  const categories = [
    { id: 'all', label: isHindi ? 'सभी नाद' : 'All Audio' },
    { id: 'raagas', label: isHindi ? 'राग संगीत' : '432Hz Raagas' },
    { id: 'mantras', label: isHindi ? 'वैदिक मंत्र' : 'Vedic Mantras' },
    { id: 'lullabies', label: isHindi ? 'गर्भ लोरी' : 'Womb Lullabies' },
    { id: 'brain', label: isHindi ? 'मस्तिष्क विकास' : 'Brain Boost' },
    { id: 'sleep', label: isHindi ? 'निद्रा व शांति' : 'Sleep & Rest' },
  ];

  const filteredTracks =
    selectedCategory === 'all'
      ? AUDIO_TRACKS
      : AUDIO_TRACKS.filter((t) => t.category === selectedCategory);

  // Playback timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeTrack) {
      interval = setInterval(() => {
        setPlaybackSeconds((sec) => sec + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeTrack]);

  const handleOpenPlayer = (track: AudioTrack) => {
    setActiveTrack(track);
    setIsPlaying(true);
    setPlaybackSeconds(0);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Royal Purple Curved Header (Matching Audio Banner Aesthetic) */}
      <View style={styles.bannerHeader}>
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color="#FFFFFF" />
            <Text style={styles.backBtnText}>{isHindi ? 'वापस' : 'Back'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerContentRow}>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.screenTitle}>{isHindi ? 'ऑडियो संगीत' : 'Audio'}</Text>
            <Text style={styles.screenSubtitle}>
              {isHindi
                ? '432Hz पवित्र राग, श्लोक व गर्भ लोरी'
                : '432Hz Healing Raagas, Shlokas & Lullabies'}
            </Text>
          </View>

          {/* Headphone circle badge */}
          <View style={styles.headerIllustrationCircle}>
            <Headphones size={28} color="#7C3AED" />
          </View>
        </View>
      </View>

      {/* Category Pills Bar */}
      <View style={styles.categoriesBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Audio Tracks List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredTracks.map((track) => {
          const isCurrentActive = activeTrack?.id === track.id && isPlaying;

          return (
            <View key={track.id} style={styles.audioCard}>
              {/* Badge if present */}
              {track.badge && (
                <View
                  style={[
                    styles.ribbonBadge,
                    track.badge === 'POPULAR'
                      ? styles.ribbonPopular
                      : styles.ribbonMustListen,
                  ]}
                >
                  <Text style={styles.ribbonText}>
                    {isHindi ? track.badgeHi || track.badge : track.badge}
                  </Text>
                </View>
              )}

              <View style={styles.cardMainRow}>
                {/* Left Album / Soundscape Artwork */}
                <View style={styles.imageDecorWrap}>
                  <Image
                    source={{ uri: track.imageUrl }}
                    style={styles.trackImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageBackingShape} />
                  <View style={styles.durationChip}>
                    <Text style={styles.durationChipText}>{track.duration}</Text>
                  </View>
                </View>

                {/* Right Content */}
                <View style={styles.contentCol}>
                  <Text style={styles.trackTitle} numberOfLines={2}>
                    {isHindi ? track.titleHi : track.title}
                  </Text>

                  <Text style={styles.shortSynopsis} numberOfLines={2}>
                    {isHindi ? track.shortDescHi : track.shortDesc}
                  </Text>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[
                        styles.tapToListenBtn,
                        isCurrentActive && styles.tapToListenBtnActive,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => handleOpenPlayer(track)}
                    >
                      {isCurrentActive ? (
                        <>
                          <Pause size={14} color="#FFFFFF" />
                          <Text style={styles.tapToListenText}>
                            {isHindi ? 'चल रहा है...' : 'Playing...'}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
                          <Text style={styles.tapToListenText}>
                            {isHindi ? 'सुनने के लिए टैप करें' : 'Tap to Listen'}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>

                    <Text style={styles.frequencyTag}>{track.frequency.split(' ')[0]}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {/* Bottom Science / Vedic Sound Card */}
        <View style={styles.soundBenefitCard}>
          <Sparkles size={20} color="#7C3AED" />
          <Text style={styles.soundBenefitTitle}>
            {isHindi
              ? '432Hz नाद से शिशु को क्या लाभ होता है?'
              : 'Why 432Hz Frequencies Matter for Baby?'}
          </Text>
          <Text style={styles.soundBenefitText}>
            {isHindi
              ? '432Hz प्राकृतिक ब्रह्मांडीय आवृत्ति है जो माँ के दिल की धड़कन और सांसों को संतुलित करती है। यह संगीत गर्भ जल में सूक्ष्म शांतिदायक तरंगे उत्पन्न कर शिशु के मस्तिष्क को तनावमुक्त बनाता है।'
              : '432Hz is the natural harmonic frequency that aligns with maternal resting heartbeat. It transmits gentle acoustic micro-vibrations through the amniotic fluid, nurturing calm neural networks.'}
          </Text>
        </View>
      </ScrollView>

      {/* Complete Interactive Audio Player Modal */}
      <Modal
        visible={activeTrack !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveTrack(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.playerModalCard}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalCategory}>
                  {activeTrack
                    ? isHindi
                      ? activeTrack.categoryLabelHi
                      : activeTrack.categoryLabel
                    : ''}
                </Text>
                <Text style={styles.modalTitle} numberOfLines={2}>
                  {activeTrack
                    ? isHindi
                      ? activeTrack.titleHi
                      : activeTrack.title
                    : ''}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setActiveTrack(null)}
              >
                <X size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Player Content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {activeTrack && (
                <>
                  <Image
                    source={{ uri: activeTrack.imageUrl }}
                    style={styles.modalHeroImage}
                    resizeMode="cover"
                  />

                  {/* Player Controls Card */}
                  <View style={styles.playerControlsCard}>
                    {/* Progress Bar */}
                    <View style={styles.playerProgressRow}>
                      <Text style={styles.timerText}>{formatSeconds(playbackSeconds)}</Text>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${Math.min(100, (playbackSeconds / 300) * 100)}%` }]} />
                      </View>
                      <Text style={styles.timerText}>{activeTrack.duration}</Text>
                    </View>

                    {/* Central Play/Pause Controls */}
                    <View style={styles.mainControlsRow}>
                      <TouchableOpacity
                        style={styles.secondaryControlBtn}
                        onPress={() => setPlaybackSeconds((s) => Math.max(0, s - 15))}
                      >
                        <RotateCcw size={18} color="#64748B" />
                        <Text style={styles.skipText}>-15s</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.mainPlayBtn}
                        activeOpacity={0.88}
                        onPress={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? (
                          <Pause size={24} color="#FFFFFF" />
                        ) : (
                          <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                        )}
                      </TouchableOpacity>

                      <View style={styles.instrumentBadge}>
                        <Volume2 size={16} color="#7C3AED" />
                        <Text style={styles.instrumentText}>
                          {isHindi ? activeTrack.instrumentHi : activeTrack.instrument}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Fetal Cognitive Benefit Card */}
                  <View style={styles.benefitCard}>
                    <View style={styles.benefitHeader}>
                      <Brain size={18} color="#7C3AED" />
                      <Text style={styles.benefitTitle}>
                        {isHindi ? 'शिशु के मस्तिष्क को लाभ' : 'Fetal Auditory & Cognitive Benefit'}
                      </Text>
                    </View>
                    <Text style={styles.benefitText}>
                      {isHindi ? activeTrack.fetalBenefitHi : activeTrack.fetalBenefit}
                    </Text>
                  </View>

                  {/* Sacred Description */}
                  <Text style={styles.fullDescText}>
                    {isHindi ? activeTrack.fullDescHi : activeTrack.fullDesc}
                  </Text>
                </>
              )}
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
    backgroundColor: '#F8FAFC',
  },
  bannerHeader: {
    backgroundColor: '#7C3AED', // Deep Royal Violet matching Audio Banner
    paddingTop: 12,
    paddingBottom: 22,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  headerContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  headerTitleWrap: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 13,
    color: '#EDE9FE',
    marginTop: 4,
    fontWeight: '600',
  },
  headerIllustrationCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  categoriesBar: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  categoryPillActive: {
    backgroundColor: '#1E1B4B',
  },
  categoryText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  audioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  ribbonBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderBottomRightRadius: 10,
    zIndex: 10,
  },
  ribbonPopular: {
    backgroundColor: '#7C3AED',
  },
  ribbonMustListen: {
    backgroundColor: '#DB2777',
  },
  ribbonText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  imageDecorWrap: {
    width: 100,
    height: 100,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  trackImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  imageBackingShape: {
    position: 'absolute',
    bottom: -15,
    left: -15,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },
  durationChip: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  durationChipText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  contentCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
  },
  shortSynopsis: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tapToListenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  tapToListenBtnActive: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
  },
  tapToListenText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  frequencyTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  soundBenefitCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginTop: 8,
  },
  soundBenefitTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5B21B6',
    marginTop: 6,
    textAlign: 'center',
  },
  soundBenefitText: {
    fontSize: 12,
    color: '#6B21A8',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  playerModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 14,
    marginBottom: 12,
  },
  modalCategory: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
    textTransform: 'uppercase',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  modalHeroImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
  },
  playerControlsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  playerProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 3,
  },
  mainControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  secondaryControlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  skipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  mainPlayBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  instrumentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  instrumentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B21A8',
  },
  benefitCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: 16,
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  benefitTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#5B21B6',
  },
  benefitText: {
    fontSize: 12.5,
    color: '#6B21A8',
    lineHeight: 18,
    fontWeight: '500',
  },
  fullDescText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
    marginBottom: 16,
  },
});
