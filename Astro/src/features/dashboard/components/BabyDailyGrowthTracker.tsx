import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image as RNImage,
} from 'react-native';
import { Sparkles, Heart, X, Clock } from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';
import { useTranslation } from 'react-i18next';

interface FruitComparison {
  week: number;
  fruit: string;
  emoji: string;
  length: string;
  weight: string;
  heartbeat: string;
  trimester: {
    en: string;
    hi: string;
  };
  daysLeft: number;
  milestone: {
    en: string;
    hi: string;
  };
  babyMessage: {
    en: string;
    hi: string;
  };
}

const GROWTH_MILESTONES: Record<number, FruitComparison> = {
  8: {
    week: 8,
    fruit: 'Raspberry',
    emoji: '🍓',
    length: '1.6 cm',
    weight: '~1.0 g',
    heartbeat: '150 bpm',
    trimester: { en: '1st Trimester', hi: 'पहला ट्राइमेस्टर' },
    daysLeft: 224,
    milestone: {
      en: 'Tiny webbed fingers & taste buds are forming! Baby already feels your calm, peaceful breathing.',
      hi: 'नन्हीं उंगलियां और स्वाद ग्रंथियां आकार ले रही हैं! शिशु आपकी शांत सांसों को महसूस कर रहा है।',
    },
    babyMessage: {
      en: 'Mumma, my tiny heart is beating at 150 beats per minute! I can feel your gentle breaths and calm thoughts.',
      hi: 'माँ, मेरा नन्हा दिल प्रति मिनट 150 बार धड़क रहा है! मैं आपकी गहरी सांसों और शांत विचारों को महसूस कर रहा हूँ।',
    },
  },
  12: {
    week: 12,
    fruit: 'Plum',
    emoji: '🍑',
    length: '5.4 cm',
    weight: '~14 g',
    heartbeat: '140 bpm',
    trimester: { en: '1st Trimester', hi: 'पहला ट्राइमेस्टर' },
    daysLeft: 196,
    milestone: {
      en: 'Reflexes are developing! Baby can curl tiny toes, make soft fists, and suck thumbs.',
      hi: 'रिफ्लेक्स विकसित हो रहे हैं! शिशु अपनी नन्हीं उंगलियां मोड़ सकता है और अंगूठा चूस सकता है।',
    },
    babyMessage: {
      en: "Mumma, I'm now curling my little toes and making tiny fists. Your joy reaches me like warm sunshine!",
      hi: 'माँ, अब मैं अपनी नन्हीं उंगलियां मोड़ रहा हूँ। आपकी खुशी मुझ तक सुनहरी धूप की तरह पहुँचती है!',
    },
  },
  16: {
    week: 16,
    fruit: 'Avocado',
    emoji: '🥑',
    length: '11.6 cm',
    weight: '~100 g',
    heartbeat: '140 bpm',
    trimester: { en: '2nd Trimester', hi: 'दूसरा ट्राइमेस्टर' },
    daysLeft: 168,
    milestone: {
      en: 'Eyes perceive light filtering through the womb! Baby loves listening when you chant sacred mantras.',
      hi: 'आंखें गर्भ से छनकर आती रोशनी महसूस कर सकती हैं! शिशु को आपके पवित्र मंत्र सुनना बहुत प्रिय है।',
    },
    babyMessage: {
      en: 'Mumma, my eyes can perceive light filtering through your belly, and I love listening when you chant sacred mantras.',
      hi: 'माँ, मेरी आंखें आपके पेट से छनकर आती रोशनी महसूस कर सकती हैं, और मुझे आपके मंत्र सुनना बहुत प्रिय है।',
    },
  },
  20: {
    week: 20,
    fruit: 'Banana',
    emoji: '🍌',
    length: '25.0 cm',
    weight: '~300 g',
    heartbeat: '135 bpm',
    trimester: { en: '2nd Trimester', hi: 'दूसरा ट्राइमेस्टर' },
    daysLeft: 140,
    milestone: {
      en: 'Halfway there! Baby makes sweet flutter kicks and recognizes Mumma & Papa voices clearly.',
      hi: 'आधा सफर पूरा! शिशु अब हल्की हलचल करता है और माता-पिता की आवाज स्पष्ट पहचानता है।',
    },
    babyMessage: {
      en: 'Mumma, we are halfway there! Did you feel that flutter? That was me giving you a high-five from the womb!',
      hi: 'माँ, आधा सफर पूरा हुआ! क्या आपने वह हल्की हलचल महसूस की? मैंने आपको गर्भ से प्यार भरा इशारा किया था!',
    },
  },
  24: {
    week: 24,
    fruit: 'Corn Ear',
    emoji: '🌽',
    length: '30.0 cm',
    weight: '~600 g',
    heartbeat: '130 bpm',
    trimester: { en: '2nd Trimester', hi: 'दूसरा ट्राइमेस्टर' },
    daysLeft: 112,
    milestone: {
      en: 'Hearing is fully sharp! Classical raagas and peaceful sounds promote alpha brain waves.',
      hi: 'सुनने की शक्ति तीव्र है! शास्त्रीय संगीत व शांत ध्वनियां शिशु के मस्तिष्क में एकाग्रता लाती हैं।',
    },
    babyMessage: {
      en: 'Mumma, my hearing is fully sharp now! When Papa speaks or classical raagas play, I dance and turn around.',
      hi: 'माँ, मेरी सुनने की शक्ति तीव्र हो गई है! जब पापा बोलते हैं या शास्त्रीय संगीत बजता है, मैं खुशी से घूमता हूँ।',
    },
  },
  29: {
    week: 29,
    fruit: 'Butternut Squash',
    emoji: '🥥',
    length: '38.6 cm',
    weight: '~1.2 kg',
    heartbeat: '125 bpm',
    trimester: { en: '3rd Trimester', hi: 'तीसरा ट्राइमेस्टर' },
    daysLeft: 74,
    milestone: {
      en: 'Rapid brain synapses & REM dream cycles! White vernix keeps delicate skin baby-soft.',
      hi: 'मस्तिष्क का तीव्र विकास और मीठे सपने! वर्निक्स शिशु की त्वचा को सुरक्षित व कोमल बनाए रखता है।',
    },
    babyMessage: {
      en: "Mumma, I am coming in ~10 weeks! Do you remember the white vernix I told you about? It's keeping my skin soft as I prepare to meet you.",
      hi: 'माँ, मैं लगभग 10 हफ्तों में आ रहा हूँ! मेरी त्वचा कोमल हो रही है और मैं आपसे मिलने के लिए तैयार हो रहा हूँ।',
    },
  },
  34: {
    week: 34,
    fruit: 'Cantaloupe Melon',
    emoji: '🍈',
    length: '45.0 cm',
    weight: '~2.1 kg',
    heartbeat: '120 bpm',
    trimester: { en: '3rd Trimester', hi: 'तीसरा ट्राइमेस्टर' },
    daysLeft: 42,
    milestone: {
      en: 'Lungs mature rapidly. Baby practices breathing movements & experiences deep rest in the womb.',
      hi: 'फेफड़े परिपक्व हो रहे हैं। शिशु सांस लेने का अभ्यास करता है और शांत निद्रा में रहता है।',
    },
    babyMessage: {
      en: 'Mumma, I now have peaceful dream cycles inside your warm womb. Keep playing calm melodies for me!',
      hi: 'माँ, अब मैं आपके शांत गर्भ में मीठे सपने देखता हूँ। मेरे लिए शांतिदायक संगीत बजाते रहिएगा!',
    },
  },
  38: {
    week: 38,
    fruit: 'Sweet Watermelon',
    emoji: '🍉',
    length: '50.0 cm',
    weight: '~3.2 kg',
    heartbeat: '120 bpm',
    trimester: { en: '3rd Trimester', hi: 'तीसरा ट्राइमेस्टर' },
    daysLeft: 14,
    milestone: {
      en: 'Full term blessing! Baby is head-down, blessed with Vedic virtues and ready to meet you.',
      hi: 'शुभ आगमन का समय! शिशु सभी वैदिक संस्कारों से पोषित होकर आपकी बाहों में आने को तैयार है।',
    },
    babyMessage: {
      en: "Mumma, all my Vedic sanskars and blessings are with me. I can't wait to look into your eyes and hold your finger!",
      hi: 'माँ, मुझे आपके सभी संस्कार और आशीर्वाद मिल चुके हैं। मैं बस आपकी बाहों में आने का इंतजार कर रहा हूँ!',
    },
  },
};

export const BabyDailyGrowthTracker: React.FC = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi') ?? false;

  const journeyData = useAuthStore((state) => state.journeyData);
  const user = useAuthStore((state) => state.user);

  // Compute current pregnancy week (default to week 8 or calculated)
  const calculateCurrentWeek = () => {
    if (journeyData?.confirmed_month) {
      return Math.min(39, Math.max(8, (journeyData.confirmed_month - 1) * 4 + 3));
    }
    if (user?.lmp_date) {
      const lmp = new Date(user.lmp_date);
      const diffMs = Date.now() - lmp.getTime();
      const weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
      if (weeks >= 4 && weeks <= 42) return weeks;
    }
    return 8; // Default week 8
  };

  const currentWeek = calculateCurrentWeek();
  const currentDay = 4; // Day 4 of the running week

  // Find nearest milestone
  const milestoneKeys = [8, 12, 16, 20, 24, 29, 34, 38];
  const closestWeekKey = milestoneKeys.reduce((prev, curr) =>
    Math.abs(curr - currentWeek) < Math.abs(prev - currentWeek) ? curr : prev
  );

  const data = GROWTH_MILESTONES[closestWeekKey] || GROWTH_MILESTONES[8];
  const [showLetterModal, setShowLetterModal] = useState(false);

  // Calculate pregnancy progress percentage
  const journeyPercent = Math.min(100, Math.max(5, Math.round((currentWeek / 40) * 100)));

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Top Header Row with Badges */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.weekPill}>
              <Text style={styles.weekPillText}>🌸 Week {currentWeek}</Text>
            </View>
            <View>
              <Text style={styles.growthTrackerTitle}>
                {isHindi ? 'शिशु का दैनिक विकास ट्रैकर' : 'Baby Daily Growth Tracker'}
              </Text>
              <Text style={styles.growthTrackerSub}>
                {isHindi ? 'आज आपका नन्हा शिशु' : 'Your Baby Today'}
              </Text>
            </View>
          </View>

          <View style={styles.trimesterPill}>
            <Text style={styles.trimesterPillText}>
              Day {currentDay} • {isHindi ? data.trimester.hi : data.trimester.en}
            </Text>
          </View>
        </View>

        {/* Hero Visual Card: Fetus <-> Fruit Comparison */}
        <View style={styles.heroVisualCard}>
          <View style={styles.visualCirclesRow}>
            {/* Baby Fetus Avatar */}
            <View style={styles.babyAvatarRing}>
              <RNImage
                source={require('../../../assets/images/baby_cute.png')}
                style={styles.babyAvatarImg}
                resizeMode="contain"
              />
            </View>

            {/* Comparison Indicator */}
            <View style={styles.compareSymbolBox}>
              <Text style={styles.compareSymbolText}>↔</Text>
            </View>

            {/* Accurate Fruit Avatar */}
            <View style={styles.fruitAvatarRing}>
              <Text style={styles.fruitAvatarEmoji}>{data.emoji}</Text>
            </View>
          </View>

          {/* Size Metaphor Headline */}
          <Text style={styles.sizeHeadline}>
            {isHindi
              ? `शिशु वर्तमान में ${data.fruit} के आकार का है`
              : `Baby is currently the size of a ${data.fruit}`}
          </Text>
          <Text style={styles.sizeSubHeadline}>
            {isHindi
              ? `सप्ताह ${currentWeek}, दिन ${currentDay} • प्रसव में ~${data.daysLeft} दिन शेष`
              : `Day ${currentDay} of Week ${currentWeek} • ${data.daysLeft} days left till birth`}
          </Text>
        </View>

        {/* Bento Vital Stats Row (3 Clean Metric Chips) */}
        <View style={styles.bentoRow}>
          {/* Length */}
          <View style={[styles.bentoChip, styles.bentoGreen]}>
            <Text style={styles.bentoIcon}>📏</Text>
            <Text style={styles.bentoLabel}>{isHindi ? 'लंबाई' : 'Length'}</Text>
            <Text style={styles.bentoValue}>{data.length}</Text>
          </View>

          {/* Weight */}
          <View style={[styles.bentoChip, styles.bentoBlue]}>
            <Text style={styles.bentoIcon}>⚖️</Text>
            <Text style={styles.bentoLabel}>{isHindi ? 'वजन' : 'Weight'}</Text>
            <Text style={styles.bentoValue}>{data.weight}</Text>
          </View>

          {/* Fetal Heartbeat */}
          <View style={[styles.bentoChip, styles.bentoRose]}>
            <Text style={styles.bentoIcon}>💓</Text>
            <Text style={styles.bentoLabel}>{isHindi ? 'धड़कन' : 'Heartbeat'}</Text>
            <Text style={styles.bentoValue}>{data.heartbeat}</Text>
          </View>
        </View>

        {/* Today's Miracle Milestone Card */}
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneHeaderRow}>
            <Sparkles size={14} color="#D97706" />
            <Text style={styles.milestoneHeaderTitle}>
              {isHindi ? 'आज का दिव्य विकास' : "Today's Miracle Milestone"}
            </Text>
          </View>
          <Text style={styles.milestoneText}>
            {isHindi ? data.milestone.hi : data.milestone.en}
          </Text>
        </View>

        {/* Journey Progress Bar & Letter CTA */}
        <View style={styles.journeySection}>
          <View style={styles.journeyTopRow}>
            <Text style={styles.daysLeftPillText}>
              ⏳ {data.daysLeft} {isHindi ? 'दिन शेष' : 'Days Left'}
            </Text>
            <TouchableOpacity
              onPress={() => setShowLetterModal(true)}
              activeOpacity={0.7}
              style={styles.letterCtaRow}
              accessibilityRole="button"
              accessibilityLabel="Read Full Letter from Womb"
            >
              <Text style={styles.letterCtaText}>
                {isHindi ? '💌 गर्भ से पूरा पत्र पढ़ें >' : '💌 Read Full Letter from Womb >'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Visual Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${journeyPercent}%` }]} />
          </View>

          <Text style={styles.progressPercentSubtext}>
            {journeyPercent}% {isHindi ? 'सफर पूर्ण' : 'Journey Completed'} • Week {currentWeek} of 40
          </Text>
        </View>

        {/* Next Daily Guidance Countdown Pill */}
        <View style={styles.timerPill}>
          <Clock size={12} color="#9D174D" />
          <Text style={styles.timerPillText}>
            {isHindi ? 'अगला वैदिक परामर्श 18 घंटे में' : 'Next Daily Guidance In: 18h 56m'}
          </Text>
        </View>
      </View>

      {/* Full Letter from Womb Modal */}
      <Modal
        visible={showLetterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLetterModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.letterModalCard}>
            <View style={styles.letterModalHeader}>
              <View style={styles.letterHeaderTitleCol}>
                <Text style={styles.letterHeaderHeart}>💖</Text>
                <Text style={styles.letterHeaderTitle}>
                  {isHindi ? 'गर्भ से माँ के नाम पावन पत्र' : 'A Letter from the Womb to Mumma'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowLetterModal(false)} style={styles.closeBtn}>
                <X size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.letterModalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.letterContentCard}>
                <Text style={styles.letterSalutation}>
                  {isHindi ? 'मेरी प्यारी माँ,' : 'Dearest Mumma,'}
                </Text>
                <Text style={styles.letterBodyParagraph}>
                  {isHindi ? data.babyMessage.hi : data.babyMessage.en}
                </Text>
                <Text style={styles.letterBodyParagraph}>
                  {isHindi
                    ? 'जब आप शांत मन से ध्यान करती हैं और शास्त्रीय राग सुनती हैं, तो मेरी चेतना को अद्भुत ऊर्जा मिलती है। आपका हर विचार मेरे मन और संस्कारों को संवार रहा है।'
                    : 'Whenever you breathe calmly, practice Garbhsanskar, and listen to sacred raagas, a wave of warmth envelops me in the womb. Every peaceful thought of yours is shaping my future intelligence and virtues.'}
                </Text>
                <Text style={styles.letterSignOff}>
                  {isHindi ? 'सदा आपका नन्हा फरिश्ता 🌸' : 'Forever your blessed little angel 🌸'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeLetterModalBtn}
                onPress={() => setShowLetterModal(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.closeLetterModalBtnText}>
                  {isHindi ? 'सप्रेम आशीर्वाद सहित बंद करें' : 'Send Love to Baby & Close'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#F3E8FF',
    shadowColor: '#BE185D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weekPill: {
    backgroundColor: '#FDF2F8',
    borderWidth: 1,
    borderColor: '#FCE7F3',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
  },
  weekPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#BE185D',
  },
  growthTrackerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  growthTrackerSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  trimesterPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  trimesterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  heroVisualCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEF08A',
    marginBottom: 12,
  },
  visualCirclesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 10,
  },
  babyAvatarRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FBCFE8',
    shadowColor: '#BE185D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  babyAvatarImg: {
    width: 46,
    height: 46,
  },
  compareSymbolBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareSymbolText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '800',
  },
  fruitAvatarRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#FEF9C3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FDE047',
    shadowColor: '#CA8A04',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  fruitAvatarEmoji: {
    fontSize: 32,
  },
  sizeHeadline: {
    fontSize: 15,
    fontWeight: '800',
    color: '#831843',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  sizeSubHeadline: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 3,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  bentoChip: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
  },
  bentoGreen: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  bentoBlue: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  bentoRose: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FFE4E6',
  },
  bentoIcon: {
    fontSize: 14,
    marginBottom: 2,
  },
  bentoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  bentoValue: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 1,
  },
  milestoneCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  milestoneHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  milestoneHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  milestoneText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#451A03',
    fontWeight: '500',
  },
  journeySection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  journeyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  daysLeftPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
  },
  letterCtaRow: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  letterCtaText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#BE185D',
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#BE185D',
    borderRadius: 4,
  },
  progressPercentSubtext: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FDF2F8',
    paddingVertical: 6,
    borderRadius: 12,
  },
  timerPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9D174D',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  letterModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  letterModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  letterHeaderTitleCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  letterHeaderHeart: {
    fontSize: 20,
  },
  letterHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  letterModalScroll: {
    marginTop: 4,
  },
  letterContentCard: {
    backgroundColor: '#FFF9FA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  letterSalutation: {
    fontSize: 15,
    fontWeight: '800',
    color: '#9F1239',
    marginBottom: 8,
  },
  letterBodyParagraph: {
    fontSize: 13,
    lineHeight: 20,
    color: '#374151',
    marginBottom: 10,
  },
  letterSignOff: {
    fontSize: 13,
    fontWeight: '700',
    color: '#BE185D',
    marginTop: 6,
    fontStyle: 'italic',
  },
  closeLetterModalBtn: {
    backgroundColor: '#EC4899',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  closeLetterModalBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
