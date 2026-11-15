import React, { useState } from 'react';
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
  BookOpen,
  Sparkles,
  Heart,
  Brain,
  CheckCircle2,
  Bookmark,
  Share2,
  X,
  Volume2,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface StoryItem {
  id: string;
  title: string;
  titleHi: string;
  category: 'krishna' | 'shaurya' | 'shakti' | 'garbh';
  categoryLabel: string;
  categoryLabelHi: string;
  badge?: string;
  badgeHi?: string;
  imageUrl: string;
  readTime: string;
  shortDesc: string;
  shortDescHi: string;
  fullStory: string;
  fullStoryHi: string;
  sanskarMoral: string;
  sanskarMoralHi: string;
  babyBrainBenefit: string;
  babyBrainBenefitHi: string;
}

const VEDIC_STORIES: StoryItem[] = [
  {
    id: 's1',
    title: 'Jamvant or shri krishna ke bich yuddha',
    titleHi: 'जाम्बवान और श्रीकृष्ण के बीच युद्ध',
    category: 'krishna',
    categoryLabel: 'Shri Krishna Leela',
    categoryLabelHi: 'श्रीकृष्ण लीला',
    badge: 'NEW',
    badgeHi: 'नया',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    readTime: '4 min read',
    shortDesc: 'The sacred epic duel for the divine Syamantaka Mani, showcasing patience, righteousness, and humility.',
    shortDescHi: 'स्यमंतक मणि का उद्धार, जाम्बवान का प्रभु पहचानना और श्रीकृष्ण का अलौकिक धैर्य व धर्मपालन।',
    fullStory:
      'When false allegations arose regarding the Syamantaka jewel, Lord Krishna embarked on a quest of truth into the deep caves of King Jamvant. The great duel continued for 28 days with supreme martial valor and mutual respect. Finally, King Jamvant realized that the warrior facing him was none other than his beloved Lord Rama reincarnated. Filled with devotion, he offered the sacred jewel and gave his daughter Jamvanti in marriage to Krishna. This story teaches unwavering pursuit of truth and honor.',
    fullStoryHi:
      'जब स्यमंतक मणि को लेकर झूठा आरोप लगा, तो श्रीकृष्ण ने सत्य की खोज के लिए जाम्बवान की गुफा में प्रवेश किया। दोनों के बीच 28 दिनों तक निरंतर महायुद्ध चला। अंततः जाम्बवान को आभास हुआ कि उनके सामने साक्षात उनके आराध्य प्रभु श्रीराम ही श्रीकृष्ण के रूप में विद्यमान हैं। उन्होंने अश्रुपूरित नेत्रों से मणि और अपनी पुत्री जाम्बवती को श्रीकृष्ण को समर्पित किया। यह कथा सिखाती है कि सत्य और धैर्य से हर बाधा को जीता जा सकता है।',
    sanskarMoral: 'Instills truthfulness, justice, composure under false blame, and supreme valor in the womb.',
    sanskarMoralHi: 'शिशु में सत्यनिष्ठा, धैर्य, न्यायप्रियता और निडर स्वभाव का बीजारोपण करता है।',
    babyBrainBenefit: 'Listening to rhythmic narration of epic battles stimulates the fetal frontotemporal cognitive network.',
    babyBrainBenefitHi: 'माँ की भावपूर्ण स्वर-ध्वनि शिशु के मस्तिष्क में एकाग्रता और शब्दावली के न्यूरॉन्स को सक्रिय करती है।',
  },
  {
    id: 's2',
    title: 'Bhim ko kese mila ek hazar hathiyo ka bal',
    titleHi: 'भीम को कैसे मिला दस हजार हाथियों का बल',
    category: 'shaurya',
    categoryLabel: 'Mahabharata & Bravery',
    categoryLabelHi: 'महाभारत व शौर्य',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80',
    readTime: '3 min read',
    shortDesc: 'How young Bheem survived the venomous waters and received the divine rasayana of 10,000 elephants in Naglok.',
    shortDescHi: 'नागलोक में नागराज वासुकी द्वारा भीम को दस हजार हाथियों का दिव्य अमृत बल प्रदान करने का प्रसंग।',
    fullStory:
      'During childhood, when conspirators poisoned young Bheem and threw him into the depths of the Ganga, the divine snakes bit away the mortal venom. Nagraj Vasuki recognized Bheem as his great-grandson and offered him eight sacred vessels of divine nectar. Each vessel conferred the physical strength of a thousand elephants. Bheem absorbed the holy rasayana and returned back to his mother Kunti stronger than ever.',
    fullStoryHi:
      'बाल्यावस्था में जब दुर्योधन ने भीम को विषैली खीर खिलाकर गंगा में बहा दिया, तो जल में नागों ने विष को सोख लिया। नागलोक पहुंचने पर नागराज वासुकी ने अपने वंशज भीम को पहचानकर आठ घड़े दिव्य अमृत रस पिलाया। प्रत्येक घड़े से एक सहस्र हाथियों का बल मिलता था। भीम पूर्ण स्वस्थ व अपराजेय शक्ति से संपन्न होकर माता कुंती के पास लौटे।',
    sanskarMoral: 'Unshakable resilience, inner vital force (Ojas), and divine maternal protection against all adversities.',
    sanskarMoralHi: 'शिशु में अजेय आत्मबल, शारीरिक ओजस्विता और कठिन परिस्थितियों में कभी न टूटने का संस्कार।',
    babyBrainBenefit: 'Inspiring heroic themes foster strong fetal heartbeat rhythm and robust neuro-cardiac resilience.',
    babyBrainBenefitHi: 'वीर रस की कथाएं माँ के शरीर में उत्साहजनक हार्मोन्स का स्राव करती हैं जो शिशु के हृदय को दृढ़ बनाती हैं।',
  },
  {
    id: 's3',
    title: 'Devi sati ne roudra roop dharan kyon kiya',
    titleHi: 'देवी सती ने रौद्र रूप धारण क्यों किया',
    category: 'shakti',
    categoryLabel: 'Devi & Shakti',
    categoryLabelHi: 'देवी व मातृशक्ति',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80',
    readTime: '5 min read',
    shortDesc: 'The eternal awakening of Adi Shakti, defending divine dignity and the sanctity of cosmic consciousness.',
    shortDescHi: 'दक्ष प्रजापति के यज्ञ में आत्मसम्मान, सत्य और शिव-तत्व की रक्षा हेतु सती का परम तेज स्वरूप।',
    fullStory:
      'When Daksha Prajapati insulted Lord Shiva during the grand sacrificial ceremony, Devi Sati stood firm for cosmic truth and honor. Refusing to bear the disrespect toward the divine consciousness, she ignited her inner yogic fire (Yogagni) from within, transcending mortal existence and teaching the cosmos that maternal dignity and righteousness must never be compromised.',
    fullStoryHi:
      'जब दक्ष प्रजापति ने अपने यज्ञ में महादेव का निरादर किया, तो देवी सती ने आत्मसम्मान और सत्य के लिए निर्भयता से उद्घोष किया। उन्होंने अपने भीतर की योगाग्नि प्रज्वलित कर नश्वर देह का त्याग कर संपूर्ण जगत को संदेश दिया कि सत्य, धर्म और नारी शक्ति के मान से कोई समझौता नहीं हो सकता।',
    sanskarMoral: 'Self-respect, spiritual dignity, uncompromising adherence to righteousness and feminine strength.',
    sanskarMoralHi: 'आत्मसम्मान, स्वाभिमान, तेजस्विता और अन्याय के समक्ष न झुकने का दिव्य मातृ संस्कार।',
    babyBrainBenefit: 'Calm and steady maternal conviction lowers fetal cortisol, cultivating emotional stability.',
    babyBrainBenefitHi: 'माँ की मानसिक दृढ़ता गर्भस्थ शिशु में भावनात्मक स्थिरता और परिपक्वता का निर्माण करती है।',
  },
  {
    id: 's4',
    title: 'Abhimanyu ka Garbh Gyan: Chakravyuha',
    titleHi: 'अभिमन्यु का गर्भ ज्ञान: चक्रव्यूह श्रवण',
    category: 'garbh',
    categoryLabel: 'Garbh Sanskar Classic',
    categoryLabelHi: 'गर्भ संस्कार प्रमाण',
    badge: 'MUST READ',
    badgeHi: 'अनिवार्य',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    readTime: '4 min read',
    shortDesc: 'The greatest Vedic testimony that the unborn child listens, learns, and remembers from the womb.',
    shortDescHi: 'माता सुभद्रा के गर्भ में अर्जुन से चक्रव्यूह भेदने की शिक्षा ग्रहण करने का ऐतिहासिक वैदिक प्रमाण।',
    fullStory:
      'When Mata Subhadra was pregnant with Abhimanyu, Arjuna described the complex warfare geometry of entering the Chakravyuha. From the silent sanctuary of the womb, the unborn child listened intently and committed the six gates of entry into memory. This ancient Vedic episode stands as the ultimate historical proof that a child’s cognitive learning begins months before birth.',
    fullStoryHi:
      'जब माता सुभद्रा के गर्भ में अभिमन्यु थे, तब अर्जुन ने चक्रव्यूह में प्रवेश करने का गूढ़ सैन्य विज्ञान विस्तार से सुनाया। गर्भ के भीतर से शिशु अभिमन्यु ने एक-एक शब्द ध्यानपूर्वक सुना और छह द्वारों को भेदने की विद्या कंठस्थ कर ली। यह प्रसंग सिद्ध करता है कि शिशु जन्म से कई माह पूर्व ही गर्भ में सीखना आरंभ कर देता है।',
    sanskarMoral: 'Supreme focus, deep listening, early genius, and the profound power of womb education.',
    sanskarMoralHi: 'अद्वितीय एकाग्रता, श्रवण शक्ति, मेधावी बुद्धि और गर्भ से ही ज्ञान अर्जित करने का संस्कार।',
    babyBrainBenefit: 'Validates that fetal auditory pathways retain maternal speech cadence, directly aiding post-birth speech.',
    babyBrainBenefitHi: 'शिशु के मस्तिष्क की श्रवण तंत्रिकाएं माँ की भाषा शैली और ज्ञान को गर्भ में ही रिकॉर्ड कर लेती हैं।',
  },
  {
    id: 's5',
    title: 'Bhakt Prahlad aur Narad Muni ka Garbh Updesh',
    titleHi: 'भक्त प्रह्लाद और नारद मुनि का गर्भ उपदेश',
    category: 'garbh',
    categoryLabel: 'Garbh Sanskar Classic',
    categoryLabelHi: 'गर्भ संस्कार',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80',
    readTime: '4 min read',
    shortDesc: 'How Sage Narada instilled highest devotion and fearlessness in Kayadhu’s womb during troubled times.',
    shortDescHi: 'माता कयाधु के गर्भ में देवर्षि नारद द्वारा भगवान नारायण की भक्ति और निर्भयता के बीज बोने की कथा।',
    fullStory:
      'While Mata Kayadhu was pregnant, she resided at the peaceful hermitage of Maharshi Narada. Daily, Sage Narada chanted sacred hymns and imparted deep spiritual truths. Prahlad, reposing peacefully in the womb, absorbed every chant. When he was born in the demon clan of Hiranyakashipu, he was naturally radiant with divine devotion, unshakable faith, and absolute compassion.',
    fullStoryHi:
      'जब माता कयाधु गर्भवती थीं, वे देवर्षि नारद के शांत आश्रम में रहीं। नारद जी प्रतिदिन भगवद भजन और आत्म-तत्व का उपदेश देते थे। गर्भ में स्थित प्रह्लाद ने हर श्लोक और ज्ञान को आत्मसात किया। इसी कारण असुर कुल में जन्म लेने के बाद भी प्रह्लाद परम वैष्णव, दयालु और निर्भय बने।',
    sanskarMoral: 'Pure spiritual inclinations, fearless faith, and unconditional loving kindness.',
    sanskarMoralHi: 'परम सात्विकता, ईश्वर निष्ठा, दयालु स्वभाव और अधर्म के बीच भी धर्म पर टिके रहने का संस्कार।',
    babyBrainBenefit: 'Spiritual storytelling induces alpha brainwaves in the mother, deeply soothing fetal limb movements.',
    babyBrainBenefitHi: 'सात्विक श्रवण से माँ के मस्तिष्क में अल्फा तरंगे उत्पन्न होती हैं जो शिशु को गहन शांति प्रदान करती हैं।',
  },
];

export const GarbhSanskarLibraryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [readStories, setReadStories] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: isHindi ? 'सभी कथाएं' : 'All Stories' },
    { id: 'krishna', label: isHindi ? 'श्रीकृष्ण' : 'Shri Krishna' },
    { id: 'shaurya', label: isHindi ? 'शौर्य' : 'Bravery & Epic' },
    { id: 'shakti', label: isHindi ? 'शक्ति' : 'Devi Shakti' },
    { id: 'garbh', label: isHindi ? 'गर्भ संस्कार' : 'Garbh Classics' },
  ];

  const filteredStories =
    selectedCategory === 'all'
      ? VEDIC_STORIES
      : VEDIC_STORIES.filter((s) => s.category === selectedCategory);

  const handleMarkAsRead = (id: string) => {
    setReadStories((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Curved Coral/Peach Header (Matching uploaded design) */}
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
            <Text style={styles.screenTitle}>{isHindi ? 'लाइब्रेरी' : 'Library'}</Text>
            <Text style={styles.screenSubtitle}>
              {isHindi
                ? 'गर्भ संस्कार पौराणिक व वैदिक ज्ञान'
                : 'Sacred Garbh Sanskar Stories & Wisdom'}
            </Text>
          </View>

          {/* Ethereal illustration badge */}
          <View style={styles.headerIllustrationCircle}>
            <BookOpen size={30} color="#EA580C" />
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

      {/* Stories List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredStories.map((story) => {
          const isRead = readStories[story.id];

          return (
            <View key={story.id} style={styles.storyCard}>
              {/* Optional NEW / MUST READ Badge */}
              {story.badge && (
                <View
                  style={[
                    styles.ribbonBadge,
                    story.badge === 'NEW'
                      ? styles.ribbonNew
                      : styles.ribbonMustRead,
                  ]}
                >
                  <Text style={styles.ribbonText}>
                    {isHindi ? story.badgeHi || story.badge : story.badge}
                  </Text>
                </View>
              )}

              <View style={styles.cardMainRow}>
                {/* Left Story Image with curved decorative background */}
                <View style={styles.imageDecorWrap}>
                  <Image
                    source={{ uri: story.imageUrl }}
                    style={styles.storyImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageBackingShape} />
                </View>

                {/* Right Content */}
                <View style={styles.contentCol}>
                  <Text style={styles.storyTitle} numberOfLines={2}>
                    {isHindi ? story.titleHi : story.title}
                  </Text>

                  <Text style={styles.shortSynopsis} numberOfLines={2}>
                    {isHindi ? story.shortDescHi : story.shortDesc}
                  </Text>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.tapToReadBtn}
                      activeOpacity={0.85}
                      onPress={() => setActiveStory(story)}
                    >
                      <Text style={styles.tapToReadText}>
                        {isHindi ? 'पढ़ने के लिए टैप करें' : 'Tap to Read'}
                      </Text>
                    </TouchableOpacity>

                    {isRead && (
                      <View style={styles.readCheckPill}>
                        <CheckCircle2 size={14} color="#059669" />
                        <Text style={styles.readCheckText}>
                          {isHindi ? 'पढ़ा हुआ' : 'Read'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {/* Bottom Sanskrit Subhashita Card */}
        <View style={styles.subhashitaCard}>
          <Sparkles size={20} color="#D97706" />
          <Text style={styles.subhashitaShloka}>
            &ldquo;माता प्रथमा गुरुः, गर्भस्थे ज्ञानेन वर्धते।&rdquo;
          </Text>
          <Text style={styles.subhashitaMeaning}>
            {isHindi
              ? 'माँ प्रथम गुरु है; गर्भ में दिया गया ज्ञान शिशु के जीवन भर प्रकाश देता है।'
              : 'Mother is the foremost Guru; wisdom nurtured in the womb guides the child for an entire lifetime.'}
          </Text>
        </View>
      </ScrollView>

      {/* Complete Story Reader Modal */}
      <Modal
        visible={activeStory !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveStory(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.readerModalCard}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalCategory}>
                  {activeStory
                    ? isHindi
                      ? activeStory.categoryLabelHi
                      : activeStory.categoryLabel
                    : ''}
                </Text>
                <Text style={styles.modalTitle} numberOfLines={2}>
                  {activeStory
                    ? isHindi
                      ? activeStory.titleHi
                      : activeStory.title
                    : ''}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setActiveStory(null)}
              >
                <X size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Story Content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.modalScroll}
              contentContainerStyle={{ paddingBottom: 30 }}
            >
              {activeStory && (
                <>
                  <Image
                    source={{ uri: activeStory.imageUrl }}
                    style={styles.modalHeroImage}
                    resizeMode="cover"
                  />

                  {/* Moral / Virtue Banner */}
                  <View style={styles.moralCard}>
                    <View style={styles.moralHeader}>
                      <Heart size={18} color="#EA580C" />
                      <Text style={styles.moralTitle}>
                        {isHindi ? 'संस्कार का संदेश (Sanskar Moral)' : 'Sanskar Virtue for Baby'}
                      </Text>
                    </View>
                    <Text style={styles.moralText}>
                      {isHindi ? activeStory.sanskarMoralHi : activeStory.sanskarMoral}
                    </Text>
                  </View>

                  {/* Full Story Paragraph */}
                  <Text style={styles.fullStoryText}>
                    {isHindi ? activeStory.fullStoryHi : activeStory.fullStory}
                  </Text>

                  {/* Neuro & Womb Benefit */}
                  <View style={styles.benefitCard}>
                    <View style={styles.moralHeader}>
                      <Brain size={18} color="#059669" />
                      <Text style={[styles.moralTitle, { color: '#065F46' }]}>
                        {isHindi ? 'शिशु के मस्तिष्क को लाभ' : 'Fetal Cognitive Benefit'}
                      </Text>
                    </View>
                    <Text style={styles.benefitText}>
                      {isHindi
                        ? activeStory.babyBrainBenefitHi
                        : activeStory.babyBrainBenefit}
                    </Text>
                  </View>

                  {/* Complete Button */}
                  <TouchableOpacity
                    style={styles.markReadBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      if (activeStory) handleMarkAsRead(activeStory.id);
                      setActiveStory(null);
                    }}
                  >
                    <CheckCircle2 size={18} color="#FFFFFF" />
                    <Text style={styles.markReadBtnText}>
                      {isHindi ? 'कथा पूर्ण हुई (Mark as Completed)' : 'Mark as Read'}
                    </Text>
                  </TouchableOpacity>
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
    backgroundColor: '#F97316', // Coral/Peach gradient tone matching reference
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
    color: '#FFEDD5',
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
  storyCard: {
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
  ribbonNew: {
    backgroundColor: '#EA580C',
  },
  ribbonMustRead: {
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
  storyImage: {
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
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
  },
  contentCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  storyTitle: {
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
  tapToReadBtn: {
    backgroundColor: '#F97316', // Orange coral matching screenshot
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  tapToReadText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  readCheckPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  readCheckText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  subhashitaCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: 8,
  },
  subhashitaShloka: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#92400E',
    marginTop: 6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  subhashitaMeaning: {
    fontSize: 12,
    color: '#78350F',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 17,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  readerModalCard: {
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
    color: '#EA580C',
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
  modalScroll: {
    marginTop: 6,
  },
  modalHeroImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
  },
  moralCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
    marginBottom: 16,
  },
  moralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  moralTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#C2410C',
  },
  moralText: {
    fontSize: 13,
    color: '#7C2D12',
    lineHeight: 18,
    fontWeight: '600',
  },
  fullStoryText: {
    fontSize: 14.5,
    lineHeight: 23,
    color: '#1E293B',
    marginBottom: 18,
    fontWeight: '400',
  },
  benefitCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 20,
  },
  benefitText: {
    fontSize: 12.5,
    color: '#047857',
    lineHeight: 18,
    fontWeight: '500',
  },
  markReadBtn: {
    flexDirection: 'row',
    backgroundColor: '#1E1B4B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  markReadBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
});
