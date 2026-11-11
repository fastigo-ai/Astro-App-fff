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
import { Sparkles, Heart, ChevronRight, X, Clock, Calendar } from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';
import { useTranslation } from 'react-i18next';

interface FruitComparison {
  week: number;
  fruit: string;
  emoji: string;
  daysLeft: number;
  sizeDesc: string;
  babyMessage: {
    en: string;
    hi: string;
  };
}

const GROWTH_MILESTONES: Record<number, FruitComparison> = {
  8: {
    week: 8,
    fruit: 'Raspberry',
    emoji: '🫐',
    daysLeft: 224,
    sizeDesc: '1.6 cm • Tiny webbed fingers forming',
    babyMessage: {
      en: "Mumma, my tiny heart is beating at 150 beats per minute! I can feel your gentle breaths and calm thoughts.",
      hi: "माँ, मेरा नन्हा दिल प्रति मिनट 150 बार धड़क रहा है! मैं आपकी गहरी सांसों और शांत विचारों को महसूस कर रहा हूँ।",
    },
  },
  12: {
    week: 12,
    fruit: 'Plum',
    emoji: '🍑',
    daysLeft: 196,
    sizeDesc: '5.4 cm • Reflexes and tiny fingernails',
    babyMessage: {
      en: "Mumma, I'm now curling my little toes and making tiny fists. Your joy reaches me like warm sunshine!",
      hi: "माँ, अब मैं अपनी नन्हीं उंगलियां मोड़ रहा हूँ। आपकी खुशी मुझ तक सुनहरी धूप की तरह पहुँचती है!",
    },
  },
  16: {
    week: 16,
    fruit: 'Avocado',
    emoji: '🥑',
    daysLeft: 168,
    sizeDesc: '11.6 cm • Facial expressions starting',
    babyMessage: {
      en: "Mumma, my eyes can perceive light filtering through your belly, and I love listening when you chant sacred mantras.",
      hi: "माँ, मेरी आंखें आपके पेट से छनकर आती रोशनी महसूस कर सकती हैं, और मुझे आपके मंत्र सुनना बहुत प्रिय है।",
    },
  },
  20: {
    week: 20,
    fruit: 'Banana',
    emoji: '🍌',
    daysLeft: 140,
    sizeDesc: '25 cm • Halfway there! First fluttering kicks',
    babyMessage: {
      en: "Mumma, we are halfway there! Did you feel that flutter? That was me giving you a high-five from the womb!",
      hi: "माँ, आधा सफर पूरा हुआ! क्या आपने वह हल्की हलचल महसूस की? मैंने आपको गर्भ से प्यार भरा इशारा किया था!",
    },
  },
  24: {
    week: 24,
    fruit: 'Corn Ear',
    emoji: '🌽',
    daysLeft: 112,
    sizeDesc: '30 cm • Hearing inner voices & classical raagas',
    babyMessage: {
      en: "Mumma, my hearing is fully sharp now! When Papa speaks or classical raagas play, I dance and turn around.",
      hi: "माँ, मेरी सुनने की शक्ति तीव्र हो गई है! जब पापा बोलते हैं या शास्त्रीय संगीत बजता है, मैं खुशी से घूमता हूँ।",
    },
  },
  29: {
    week: 29,
    fruit: 'Butternut Squash',
    emoji: '🥥',
    daysLeft: 74,
    sizeDesc: '40 cm • Rapid brain synapse development',
    babyMessage: {
      en: "Mumma, I am coming in ~10 weeks! Do you remember the white vernix I told you about? It's keeping my skin soft as I prepare to meet you.",
      hi: "माँ, मैं लगभग 10 हफ्तों में आ रहा हूँ! मेरी त्वचा कोमल हो रही है और मैं आपसे मिलने के लिए तैयार हो रहा हूँ।",
    },
  },
  34: {
    week: 34,
    fruit: 'Cantaloupe Melon',
    emoji: '🍈',
    daysLeft: 42,
    sizeDesc: '45 cm • Healthy lungs & strong sleep cycles',
    babyMessage: {
      en: "Mumma, I now have peaceful dream cycles inside your warm womb. Keep playing calm melodies for me!",
      hi: "माँ, अब मैं आपके शांत गर्भ में मीठे सपने देखता हूँ। मेरे लिए शांतिदायक संगीत बजाते रहिएगा!",
    },
  },
  38: {
    week: 38,
    fruit: 'Sweet Watermelon',
    emoji: '🍉',
    daysLeft: 14,
    sizeDesc: '50 cm • Full term blessings & ready to arrive',
    babyMessage: {
      en: "Mumma, all my Vedic sanskars and blessings are with me. I can't wait to look into your eyes and hold your finger!",
      hi: "माँ, मुझे आपके सभी संस्कार और आशीर्वाद मिल चुके हैं। मैं बस आपकी बाहों में आने का इंतजार कर रहा हूँ!",
    },
  },
};

export const BabyDailyGrowthTracker: React.FC = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi') ?? false;

  const journeyData = useAuthStore((state) => state.journeyData);
  const user = useAuthStore((state) => state.user);

  // Compute current pregnancy week (default to week 29)
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
    return 29; // Representative week matching user's Image 2
  };

  const currentWeek = calculateCurrentWeek();
  const currentDay = 4; // Day 4 of the running week

  // Find nearest milestone
  const milestoneKeys = [8, 12, 16, 20, 24, 29, 34, 38];
  const closestWeekKey = milestoneKeys.reduce((prev, curr) =>
    Math.abs(curr - currentWeek) < Math.abs(prev - currentWeek) ? curr : prev
  );

  const data = GROWTH_MILESTONES[closestWeekKey] || GROWTH_MILESTONES[29];
  const [showLetterModal, setShowLetterModal] = useState(false);

  return (
    <View style={styles.container}>
      {/* Outer Card with Soft Maternal Styling (Image 2 logic, light theme) */}
      <View style={styles.card}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.weekBadge}>
              <Text style={styles.weekBadgeText}>Week {currentWeek}</Text>
            </View>
            <View>
              <Text style={styles.growthTrackerTitle}>
                {isHindi ? 'शिशु का दैनिक विकास ट्रैकर' : 'Baby Daily Growth Tracker'}
              </Text>
              <Text style={styles.growthTrackerSub}>
                {isHindi ? 'आपका नन्हा शिशु आज' : 'Your Baby Today'}
              </Text>
            </View>
          </View>

          <View style={styles.dayWeekPill}>
            <Text style={styles.dayWeekPillText}>Day {currentDay}, Week {currentWeek}</Text>
          </View>
        </View>

        {/* Comparison Visual: Fetus Visual <-> Fruit Comparison */}
        <View style={styles.comparisonVisualRow}>
          <View style={styles.avatarCircle}>
            <RNImage
              source={require('../../../assets/images/baby_cute.png')}
              style={styles.fetusImg}
              resizeMode="contain"
            />
          </View>

          <View style={styles.swapArrowBox}>
            <Text style={styles.swapArrowText}>⇄</Text>
          </View>

          <View style={[styles.avatarCircle, styles.fruitCircle]}>
            <Text style={styles.fruitEmoji}>{data.emoji}</Text>
          </View>
        </View>

        {/* Days Left & Fruit Tag */}
        <View style={styles.countdownBox}>
          <Text style={styles.daysLeftText}>
            {isHindi ? `प्रसव में ~${data.daysLeft} दिन शेष` : `${data.daysLeft} days left till birth`}
          </Text>
          <Text style={styles.sizeComparisonText}>
            {isHindi
              ? `शिशु वर्तमान में ${data.fruit} के आकार का है (${data.sizeDesc})`
              : `Baby is currently the size of a ${data.fruit} (${data.sizeDesc})`}
          </Text>
        </View>

        {/* "Baby Says" Heartfelt Letter from Womb (Image 2) */}
        <View style={styles.babySaysCard}>
          <View style={styles.babySaysTop}>
            <View style={styles.babySaysTagRow}>
              <Text style={styles.babySaysIcon}>💌</Text>
              <Text style={styles.babySaysTitle}>
                {isHindi ? 'शिशु का संदेश' : 'Baby Says'}
              </Text>
            </View>
            <Text style={styles.babySaysArrivalNotice}>
              {isHindi
                ? `माँ, मैं ~${Math.ceil(data.daysLeft / 7)} हफ़्तों में आ रहा हूँ`
                : `Mumma, I am coming in ~${Math.ceil(data.daysLeft / 7)} Weeks`}
            </Text>
          </View>

          <Text style={styles.babySaysBody} numberOfLines={3}>
            {isHindi ? data.babyMessage.hi : data.babyMessage.en}
          </Text>

          <TouchableOpacity
            style={styles.readMoreBtn}
            onPress={() => setShowLetterModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.readMoreBtnText}>
              {isHindi ? 'पूरा पत्र पढ़ें >' : 'Read Full Letter from Womb >'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Next Daily Tip Countdown Bar */}
        <View style={styles.dailyTipTimerBar}>
          <Clock size={13} color="#9D174D" />
          <Text style={styles.dailyTipTimerText}>
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
    marginVertical: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FCE7F3', // Soft rose blush border
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weekBadge: {
    backgroundColor: '#FDF2F8',
    borderWidth: 1,
    borderColor: '#FBCFE8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  weekBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#BE185D',
  },
  growthTrackerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  growthTrackerSub: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  dayWeekPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dayWeekPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#92400E',
  },
  comparisonVisualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 10,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FCE7F3',
  },
  fetusImg: {
    width: 48,
    height: 48,
  },
  swapArrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapArrowText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '900',
  },
  fruitCircle: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  fruitEmoji: {
    fontSize: 32,
  },
  countdownBox: {
    alignItems: 'center',
    marginBottom: 12,
  },
  daysLeftText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#BE123C',
    letterSpacing: -0.2,
  },
  sizeComparisonText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
    marginTop: 2,
  },
  babySaysCard: {
    backgroundColor: '#FFF8FA',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    marginBottom: 10,
  },
  babySaysTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  babySaysTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  babySaysIcon: {
    fontSize: 14,
  },
  babySaysTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#9F1239',
  },
  babySaysArrivalNotice: {
    fontSize: 11,
    color: '#BE185D',
    fontWeight: '700',
  },
  babySaysBody: {
    fontSize: 12,
    lineHeight: 18,
    color: '#374151',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  readMoreBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  readMoreBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#E11D48',
  },
  dailyTipTimerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FDF2F8',
    paddingVertical: 6,
    borderRadius: 10,
  },
  dailyTipTimerText: {
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
