import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Trophy,
  Flame,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  Brain,
  Gamepad2,
  Heart,
  Smile,
  HelpCircle,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

type GameMode = 'cravings' | 'kicks' | 'myths' | 'memory';

interface FoodItem {
  id: string;
  name: string;
  nameHi: string;
  emoji: string;
  points: number;
  isHealthy: boolean;
  tag: string;
}

const CRAVING_ITEMS: FoodItem[] = [
  { id: '1', name: 'Golgappa / Pani Puri', nameHi: 'गोलगप्पा', emoji: '🥟', points: 15, isHealthy: true, tag: 'Tangy Craving!' },
  { id: '2', name: 'Alphonso Mango', nameHi: 'मीठा आम', emoji: '🥭', points: 20, isHealthy: true, tag: 'Vitamins & Iron' },
  { id: '3', name: 'Desi Ghee Ladoo', nameHi: 'घी का लड्डू', emoji: '🍯', points: 20, isHealthy: true, tag: 'Vedic Energy' },
  { id: '4', name: 'Chilled Coconut Water', nameHi: 'नारियल पानी', emoji: '🥥', points: 25, isHealthy: true, tag: 'Hydration Gold' },
  { id: '5', name: 'Kesar Badam Kheer', nameHi: 'केसर खीर', emoji: '🥣', points: 20, isHealthy: true, tag: 'Soul Comfort' },
  { id: '6', name: 'Raw Unripe Papaya', nameHi: 'कच्चा पपीता', emoji: '🚫', points: -20, isHealthy: false, tag: 'Avoid in Pregnancy!' },
  { id: '7', name: '5x Espresso Caffeine', nameHi: 'ज्यादा कैफीन', emoji: '☕', points: -15, isHealthy: false, tag: 'Too Much Caffeine!' },
  { id: '8', name: 'Pistachio Kulfi', nameHi: 'पिस्ता कुल्फी', emoji: '🍧', points: 15, isHealthy: true, tag: 'Sweet Smile' },
  { id: '9', name: 'Roasted Almonds', nameHi: 'भुने बादाम', emoji: '🥜', points: 25, isHealthy: true, tag: 'Brain Superfood' },
];

interface MythItem {
  id: string;
  statement: string;
  statementHi: string;
  isFact: boolean;
  explanation: string;
  explanationHi: string;
}

const MYTH_ITEMS: MythItem[] = [
  {
    id: 'm1',
    statement: 'Eating Saffron (Kesar) guarantees your baby will have a fair complexion.',
    statementHi: 'केसर का दूध पीने से शिशु 100% गोरा पैदा होता है।',
    isFact: false,
    explanation: 'Genetics determine skin tone! However, pure Kesar is wonderful for maternal digestion, mood, and iron absorption.',
    explanationHi: 'शिशु का रंग माता-पिता के जीन्स पर निर्भर करता है। केसर पाचन और मानसिक शांति के लिए उत्तम है।',
  },
  {
    id: 'm2',
    statement: 'Baby can hear and recognize mother’s voice and Indian raagas from 18 weeks onward.',
    statementHi: 'शिशु गर्भ में 18वें सप्ताह से माँ की आवाज़ और राग सुन व पहचान सकता है।',
    isFact: true,
    explanation: 'Auditory cortex develops by week 18! Soulful melodies & Garbh Samvad stimulate neural connections.',
    explanationHi: 'वैज्ञानिक शोध बताते हैं कि शिशु 18वें हफ्ते से ध्वनि सुनकर याद रखने लगता है!',
  },
  {
    id: 'm3',
    statement: 'A pointed belly shape means it’s a boy, and a round belly means a girl.',
    statementHi: 'पेट का आकार देखकर लड़का या लड़की का निश्चित पता चल सकता है।',
    isFact: false,
    explanation: 'Belly shape depends strictly on maternal muscle tone, pelvic structure, and fetal position — not baby gender!',
    explanationHi: 'पेट का आकार माँ की मांसपेशियों और गर्भाशय की स्थिति पर निर्भर करता है, लिंग पर नहीं।',
  },
  {
    id: 'm4',
    statement: 'Baby drinks amniotic fluid and can actually taste what mother eats (like cardamom & spices).',
    statementHi: 'माँ जो खाती है (इलायची, मसाले), शिशु गर्भ जल में उसका स्वाद महसूस कर सकता है।',
    isFact: true,
    explanation: 'Fetal taste buds develop by week 16! Varied healthy maternal foods help babies accept diverse tastes after birth.',
    explanationHi: 'शिशु के स्वाद तंतु 16वें हफ्ते में बन जाते हैं और वह माँ के आहार का स्वाद चखता है।',
  },
  {
    id: 'm5',
    statement: 'Pregnant mothers should strictly rest in bed 24/7 and never do gentle walking or yoga.',
    statementHi: 'गर्भावस्था में बिल्कुल चलना-फिरना नहीं चाहिए, केवल आराम करना चाहिए।',
    isFact: false,
    explanation: 'Unless medically restricted, daily gentle walking and prenatal yoga improve stamina, ease labor, and boost baby oxygen!',
    explanationHi: 'हल्का टहलना और योगासन प्रसव को आसान बनाते हैं और शिशु तक रक्त संचार बढ़ाते हैं।',
  },
];

interface MemoryCard {
  id: number;
  pairKey: string;
  emoji: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MEMORY_CARD_TYPES = [
  { pairKey: 'flute', emoji: '🪈', label: 'Bansuri' },
  { pairKey: 'booties', emoji: '🧦', label: 'Booties' },
  { pairKey: 'lotus', emoji: '🪷', label: 'Lotus' },
  { pairKey: 'peacock', emoji: '🦚', label: 'Mayur' },
  { pairKey: 'rattle', emoji: '🪇', label: 'Rattle' },
  { pairKey: 'sun', emoji: '☀️', label: 'Surya' },
];

const GAMES_LIST: {
  id: GameMode;
  title: string;
  titleHi: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    id: 'cravings',
    title: 'Cravings',
    titleHi: 'क्रेविंग्स',
    emoji: '🥭',
    bgColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  {
    id: 'kicks',
    title: 'Kick Pop',
    titleHi: 'किक पॉप',
    emoji: '👣',
    bgColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  {
    id: 'myths',
    title: 'Myth Buster',
    titleHi: 'मिथक',
    emoji: '🔮',
    bgColor: '#FAF5FF',
    borderColor: '#DDD6FE',
  },
  {
    id: 'memory',
    title: 'Mom Brain',
    titleHi: 'मेमोरी',
    emoji: '🎴',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
];

export const PregnancyGamesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [activeTab, setActiveTab] = useState<GameMode>('cravings');
  const [totalPoints, setTotalPoints] = useState<number>(120);

  // Load points
  useEffect(() => {
    AsyncStorage.getItem('mom_game_points').then((val) => {
      if (val) setTotalPoints(parseInt(val, 10));
    });
  }, []);

  const addPoints = (pts: number) => {
    setTotalPoints((prev) => {
      const next = Math.max(0, prev + pts);
      AsyncStorage.setItem('mom_game_points', next.toString());
      return next;
    });
  };

  // -------------------------------------------------------------
  // GAME 1: CRAZY CRAVINGS RUSH
  // -------------------------------------------------------------
  const [cravingActive, setCravingActive] = useState(false);
  const [cravingScore, setCravingScore] = useState(0);
  const [cravingTimer, setCravingTimer] = useState(25);
  const [activeFoodIdx, setActiveFoodIdx] = useState<number>(0);
  const [streak, setStreak] = useState(0);
  const [wobbleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cravingActive && cravingTimer > 0) {
      interval = setInterval(() => {
        setCravingTimer((t) => t - 1);
        // Randomly shuffle active food
        setActiveFoodIdx(Math.floor(Math.random() * CRAVING_ITEMS.length));
      }, 1000);
    } else if (cravingTimer === 0 && cravingActive) {
      setCravingActive(false);
      addPoints(cravingScore);
      Alert.alert(
        isHindi ? 'वाह सुपर माँ! 👑' : 'Craving Champion! 👑',
        isHindi
          ? `आपने ${cravingScore} क्रेविंग अंक प्राप्त किए! यह खेल आपके मूड को रिफ्रेश करता है।`
          : `You scored ${cravingScore} points in Cravings Rush! A happy mom brings smiles to the baby!`
      );
    }
    return () => clearInterval(interval);
  }, [cravingActive, cravingTimer, cravingScore]);

  const startCravingGame = () => {
    setCravingScore(0);
    setCravingTimer(25);
    setStreak(0);
    setCravingActive(true);
    setActiveFoodIdx(Math.floor(Math.random() * CRAVING_ITEMS.length));
  };

  const handleCatchFood = (food: FoodItem) => {
    if (!cravingActive) return;

    if (food.isHealthy) {
      const multiplier = streak >= 3 ? 2 : 1;
      const pts = food.points * multiplier;
      setCravingScore((s) => s + pts);
      setStreak((st) => st + 1);
    } else {
      // Forbidden food tapped
      setCravingScore((s) => Math.max(0, s + food.points));
      setStreak(0);
      // Wobble animation
      Animated.sequence([
        Animated.timing(wobbleAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(wobbleAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(wobbleAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
    // Next food
    setActiveFoodIdx(Math.floor(Math.random() * CRAVING_ITEMS.length));
  };

  // -------------------------------------------------------------
  // GAME 2: BABY KICK POP
  // -------------------------------------------------------------
  const [kickActive, setKickActive] = useState(false);
  const [kickScore, setKickScore] = useState(0);
  const [kickTimer, setKickTimer] = useState(20);
  const [activeKickSpot, setActiveKickSpot] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (kickActive && kickTimer > 0) {
      interval = setInterval(() => {
        setKickTimer((t) => t - 1);
        setActiveKickSpot(Math.floor(Math.random() * 6));
      }, 900);
    } else if (kickTimer === 0 && kickActive) {
      setKickActive(false);
      setActiveKickSpot(null);
      addPoints(kickScore);
      Alert.alert(
        isHindi ? 'शानदार रिफ्लेक्स! 👣' : 'Baby Rhythm Master! 👣',
        isHindi
          ? `शिशु ने आपकी हर धड़कन महसूस की! कुल स्कोर: ${kickScore} अंक।`
          : `Baby felt all your taps and love! Total score: ${kickScore} points.`
      );
    }
    return () => clearInterval(interval);
  }, [kickActive, kickTimer, kickScore]);

  const startKickGame = () => {
    setKickScore(0);
    setKickTimer(20);
    setKickActive(true);
    setActiveKickSpot(Math.floor(Math.random() * 6));
  };

  const handleTapKickSpot = (spotIdx: number) => {
    if (!kickActive) return;
    if (activeKickSpot === spotIdx) {
      setKickScore((s) => s + 20);
      setActiveKickSpot(null);
    }
  };

  // -------------------------------------------------------------
  // GAME 3: MYTH VS FACT SPEED BUSTER
  // -------------------------------------------------------------
  const [mythIdx, setMythIdx] = useState(0);
  const [mythScore, setMythScore] = useState(0);
  const [answeredMyth, setAnsweredMyth] = useState<boolean | null>(null);

  const currentMyth = MYTH_ITEMS[mythIdx];

  const handleMythAnswer = (guessedFact: boolean) => {
    if (answeredMyth !== null) return;
    const isCorrect = guessedFact === currentMyth.isFact;
    setAnsweredMyth(isCorrect);
    if (isCorrect) {
      setMythScore((s) => s + 25);
      addPoints(25);
    }
  };

  const nextMyth = () => {
    setAnsweredMyth(null);
    if (mythIdx + 1 < MYTH_ITEMS.length) {
      setMythIdx((i) => i + 1);
    } else {
      Alert.alert(
        isHindi ? 'मिथक बस्टर चैम्पियन! 🔮' : 'Doctor-Verified Smart Maa! 🔮',
        isHindi
          ? `आपने सभी मिथक सुलझा लिए! कुल मिथक स्कोर: ${mythScore} अंक।`
          : `You mastered the pregnancy science quiz! Total Score: ${mythScore} points.`
      );
      setMythIdx(0);
      setMythScore(0);
    }
  };

  // -------------------------------------------------------------
  // GAME 4: MOM BRAIN MEMORY MATCH
  // -------------------------------------------------------------
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);

  const initMemoryGame = () => {
    const deck: MemoryCard[] = [];
    const chosenTypes = MEMORY_CARD_TYPES.slice(0, 4); // 4 pairs = 8 cards
    chosenTypes.forEach((type, idx) => {
      deck.push({
        id: idx * 2,
        pairKey: type.pairKey,
        emoji: type.emoji,
        label: type.label,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: idx * 2 + 1,
        pairKey: type.pairKey,
        emoji: type.emoji,
        label: type.label,
        isFlipped: false,
        isMatched: false,
      });
    });
    // Shuffle
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlippedIndices([]);
    setMemoryMoves(0);
    setMatchedPairs(0);
  };

  useEffect(() => {
    if (activeTab === 'memory') {
      initMemoryGame();
    }
  }, [activeTab]);

  const handleFlipCard = (index: number) => {
    if (flippedIndices.length === 2) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (newCards[first].pairKey === newCards[second].pairKey) {
        // Matched!
        setTimeout(() => {
          newCards[first].isMatched = true;
          newCards[second].isMatched = true;
          setCards([...newCards]);
          setFlippedIndices([]);
          setMatchedPairs((mp) => {
            const next = mp + 1;
            if (next === 4) {
              addPoints(50);
              Alert.alert(
                isHindi ? 'याददाश्त की रानी! ⭐' : 'Pregnancy Brain Fog Beaten! ⭐',
                isHindi
                  ? `आपने सभी कार्ड केवल ${memoryMoves + 1} चालों में मिला दिए! +50 अंक!`
                  : `All pairs matched in ${memoryMoves + 1} moves! +50 Mom IQ points!`
              );
            }
            return next;
          });
        }, 400);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>
            {isHindi ? 'माँ व शिशु गेम्स आर्केड 🎮' : 'Mom & Baby Fun Arcade 🎮'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isHindi ? 'तनाव मुक्त व मस्तिष्क विकास' : 'Mood booster & prenatal IQ games'}
          </Text>
        </View>

        {/* Total Points Pill */}
        <View style={styles.pointsBadge}>
          <Trophy size={14} color="#D97706" />
          <Text style={styles.pointsText}>{totalPoints}</Text>
        </View>
      </View>

      {/* Games Selection as Clean Circle Icons (Centered, Never Scrolled) */}
      <View style={styles.circleGamesRow}>
        {GAMES_LIST.map((game) => {
          const isSelected = activeTab === game.id;
          return (
            <TouchableOpacity
              key={game.id}
              testID={`tab-${game.id}`}
              style={styles.circleGameItem}
              activeOpacity={0.82}
              onPress={() => setActiveTab(game.id)}
            >
              <View
                style={[
                  styles.gameCircle,
                  {
                    backgroundColor: game.bgColor,
                    borderColor: isSelected ? '#1E1B4B' : game.borderColor,
                  },
                  isSelected && styles.gameCircleSelected,
                ]}
              >
                <Text style={styles.gameCircleEmoji}>{game.emoji}</Text>
                {isSelected && <View style={styles.selectedPillDot} />}
              </View>
              <Text
                style={[
                  styles.gameCircleLabel,
                  isSelected && styles.gameCircleLabelSelected,
                ]}
                numberOfLines={1}
              >
                {isHindi ? game.titleHi : game.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ========================================================= */}
        {/* TAB 1: CRAVINGS RUSH */}
        {/* ========================================================= */}
        {activeTab === 'cravings' && (
          <View style={styles.gameContainer}>
            <View style={styles.introCard}>
              <View style={styles.introHeader}>
                <View style={styles.introIcon}>
                  <Zap size={20} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.introTitle}>
                    {isHindi ? 'क्रेज़ी क्रेविंग्स रश!' : 'Crazy Cravings Frenzy!'}
                  </Text>
                  <Text style={styles.introDesc}>
                    {isHindi
                      ? 'स्वादिष्ट खाद्य पदार्थों पर टैप करें और अंक कमाएं! लेकिन हानिकारक खाद्य पदार्थों से बचें!'
                      : 'Tap delicious cravings before time runs out! Avoid harmful ingredients!'}
                  </Text>
                </View>
              </View>

              {/* Game Stats Bar */}
              <View style={styles.gameStatsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{isHindi ? 'स्कोर' : 'Score'}</Text>
                  <Text style={styles.statValue}>{cravingScore}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{isHindi ? 'समय' : 'Timer'}</Text>
                  <Text style={[styles.statValue, cravingTimer <= 5 && { color: '#DC2626' }]}>
                    {cravingTimer}s
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{isHindi ? 'कॉम्बो' : 'Streak'}</Text>
                  <Text style={styles.statValue}>
                    {streak > 2 ? `🔥 ${streak}x` : streak}
                  </Text>
                </View>
              </View>

              {/* Play / Action Area */}
              {!cravingActive ? (
                <TouchableOpacity
                  testID="start-craving-btn"
                  style={styles.startBtn}
                  activeOpacity={0.85}
                  onPress={startCravingGame}
                >
                  <Gamepad2 size={18} color="#FFF" />
                  <Text style={styles.startBtnText}>
                    {cravingTimer === 25
                      ? isHindi
                        ? 'खेल शुरू करें (Start Game)'
                        : 'Start Craving Rush!'
                      : isHindi
                      ? 'दोबारा खेलें (Play Again)'
                      : 'Play Again'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Animated.View
                  style={[
                    styles.cravingBoard,
                    { transform: [{ translateX: wobbleAnim }] },
                  ]}
                >
                  <Text style={styles.boardInstruction}>
                    {isHindi ? 'जल्दी टैप करें!' : 'TAP THE CRAVING FAST!'}
                  </Text>

                  <View style={styles.foodGrid}>
                    {CRAVING_ITEMS.map((item, idx) => {
                      const isHighlighted = idx === activeFoodIdx;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.foodCard,
                            isHighlighted && styles.foodCardActive,
                          ]}
                          activeOpacity={0.7}
                          onPress={() => handleCatchFood(item)}
                        >
                          <Text style={styles.foodEmoji}>{item.emoji}</Text>
                          <Text
                            style={[
                              styles.foodName,
                              isHighlighted && { fontWeight: '700', color: '#0F172A' },
                            ]}
                            numberOfLines={1}
                          >
                            {isHindi ? item.nameHi : item.name}
                          </Text>
                          <Text
                            style={[
                              styles.foodPoints,
                              item.isHealthy ? styles.ptsGreen : styles.ptsRed,
                            ]}
                          >
                            {item.points > 0 ? `+${item.points}` : item.points}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </Animated.View>
              )}
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* TAB 2: BABY KICK POP */}
        {/* ========================================================= */}
        {activeTab === 'kicks' && (
          <View style={styles.gameContainer}>
            <View style={styles.introCard}>
              <View style={styles.introHeader}>
                <View style={[styles.introIcon, { backgroundColor: '#FEF2F2' }]}>
                  <Flame size={20} color="#E11D48" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.introTitle}>
                    {isHindi ? 'बेबी किक रिदम पॉप!' : 'Baby Kick Whack & Pop!'}
                  </Text>
                  <Text style={styles.introDesc}>
                    {isHindi
                      ? 'शिशु गर्भ में घूम रहा है! जिस जोन में किक दिखे, उस पर तुरंत प्यार से टैप करें!'
                      : 'Baby is dancing in the womb! Tap the kick zone before baby wiggles away!'}
                  </Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.gameStatsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{isHindi ? 'अंक' : 'Kicks'}</Text>
                  <Text style={styles.statValue}>{kickScore}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{isHindi ? 'समय' : 'Timer'}</Text>
                  <Text style={[styles.statValue, kickTimer <= 5 && { color: '#DC2626' }]}>
                    {kickTimer}s
                  </Text>
                </View>
              </View>

              {!kickActive ? (
                <TouchableOpacity
                  testID="start-kick-btn"
                  style={[styles.startBtn, { backgroundColor: '#E11D48' }]}
                  activeOpacity={0.85}
                  onPress={startKickGame}
                >
                  <Heart size={18} color="#FFF" />
                  <Text style={styles.startBtnText}>
                    {kickTimer === 20
                      ? isHindi
                        ? 'किक गेम शुरू करें'
                        : 'Start Kick Whack!'
                      : isHindi
                      ? 'दोबारा खेलें'
                      : 'Play Again'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.bellyContainer}>
                  <Text style={styles.bellySubtext}>
                    {isHindi ? 'शिशु की हलचल पर टैप करें:' : 'Catch baby kicks on the bump:'}
                  </Text>
                  <View style={styles.bellyGrid}>
                    <View style={styles.bellyRow}>
                      {[0, 1, 2].map((spotIdx) => {
                        const isPopping = activeKickSpot === spotIdx;
                        return (
                          <TouchableOpacity
                            key={spotIdx}
                            style={[
                              styles.bumpZone,
                              isPopping && styles.bumpZoneActive,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => handleTapKickSpot(spotIdx)}
                          >
                            {isPopping ? (
                              <View style={styles.kickEmojiWrap}>
                                <Text style={styles.kickEmoji}>👣</Text>
                                <Text style={styles.kickPopupText}>+20</Text>
                              </View>
                            ) : (
                              <View style={styles.emptySpotDot} />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <View style={styles.bellyRow}>
                      {[3, 4, 5].map((spotIdx) => {
                        const isPopping = activeKickSpot === spotIdx;
                        return (
                          <TouchableOpacity
                            key={spotIdx}
                            style={[
                              styles.bumpZone,
                              isPopping && styles.bumpZoneActive,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => handleTapKickSpot(spotIdx)}
                          >
                            {isPopping ? (
                              <View style={styles.kickEmojiWrap}>
                                <Text style={styles.kickEmoji}>👣</Text>
                                <Text style={styles.kickPopupText}>+20</Text>
                              </View>
                            ) : (
                              <View style={styles.emptySpotDot} />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MYTH VS FACT */}
        {/* ========================================================= */}
        {activeTab === 'myths' && (
          <View style={styles.gameContainer}>
            <View style={styles.introCard}>
              <View style={styles.introHeader}>
                <View style={[styles.introIcon, { backgroundColor: '#FAF5FF' }]}>
                  <HelpCircle size={20} color="#7C3AED" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.introTitle}>
                    {isHindi ? 'दादी-नानी मिथक बस्टर!' : 'Bust That Dadi Myth!'}
                  </Text>
                  <Text style={styles.introDesc}>
                    {isHindi
                      ? 'क्या यह सच है या केवल पुराना अंधविश्वास? सही पहचानें और वैदिक विज्ञान जानें!'
                      : 'Is it medical fact or wild superstition? Tap True or False!'}
                  </Text>
                </View>
              </View>

              {/* Myth Question Card */}
              <View style={styles.mythCard}>
                <View style={styles.mythBadgeRow}>
                  <Text style={styles.mythBadge}>
                    Question {mythIdx + 1} of {MYTH_ITEMS.length}
                  </Text>
                  <Text style={styles.mythPointsBadge}>+25 IQ Pts</Text>
                </View>

                <Text style={styles.mythStatement}>
                  &ldquo;{isHindi ? currentMyth.statementHi : currentMyth.statement}&rdquo;
                </Text>

                {answeredMyth === null ? (
                  <View style={styles.mythBtnRow}>
                    <TouchableOpacity
                      testID="myth-bust-btn"
                      style={[styles.mythChoiceBtn, styles.mythBustBtn]}
                      activeOpacity={0.8}
                      onPress={() => handleMythAnswer(false)}
                    >
                      <XCircle size={18} color="#DC2626" />
                      <Text style={styles.mythBustBtnText}>
                        {isHindi ? 'झूठ (MYTH)' : 'MYTH ❌'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      testID="myth-fact-btn"
                      style={[styles.mythChoiceBtn, styles.mythFactBtn]}
                      activeOpacity={0.8}
                      onPress={() => handleMythAnswer(true)}
                    >
                      <CheckCircle2 size={18} color="#059669" />
                      <Text style={styles.mythFactBtnText}>
                        {isHindi ? 'सच (FACT)' : 'FACT ✅'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.explanationBox,
                      answeredMyth ? styles.expSuccess : styles.expIncorrect,
                    ]}
                  >
                    <View style={styles.expHeader}>
                      {answeredMyth ? (
                        <CheckCircle2 size={20} color="#059669" />
                      ) : (
                        <XCircle size={20} color="#DC2626" />
                      )}
                      <Text
                        style={[
                          styles.expTitle,
                          { color: answeredMyth ? '#059669' : '#DC2626' },
                        ]}
                      >
                        {answeredMyth
                          ? isHindi
                            ? 'बिल्कुल सही जवाब! 🎉'
                            : 'Correct Answer! 🎉'
                          : isHindi
                          ? 'ओह! सही उत्तर देखें 👇'
                          : 'Not quite! Here is the science 👇'}
                      </Text>
                    </View>

                    <Text style={styles.expBody}>
                      {isHindi ? currentMyth.explanationHi : currentMyth.explanation}
                    </Text>

                    <TouchableOpacity
                      style={styles.nextMythBtn}
                      activeOpacity={0.85}
                      onPress={nextMyth}
                    >
                      <Text style={styles.nextMythBtnText}>
                        {isHindi ? 'अगला सवाल देखें ➔' : 'Next Myth ➔'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* TAB 4: MOM BRAIN MEMORY MATCH */}
        {/* ========================================================= */}
        {activeTab === 'memory' && (
          <View style={styles.gameContainer}>
            <View style={styles.introCard}>
              <View style={styles.introHeader}>
                <View style={[styles.introIcon, { backgroundColor: '#ECFDF5' }]}>
                  <Brain size={20} color="#059669" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.introTitle}>
                    {isHindi ? 'मॉम ब्रेन बूस्टर' : 'Mom Brain Booster Match'}
                  </Text>
                  <Text style={styles.introDesc}>
                    {isHindi
                      ? 'प्रेग्नेंसी ब्रेन फॉग को हराएं! कार्ड्स पलटकर समान जोड़ी ढूंढें।'
                      : 'Beat pregnancy forgetfulness! Match matching pairs of baby icons.'}
                  </Text>
                </View>
              </View>

              {/* Memory Stats */}
              <View style={styles.gameStatsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{isHindi ? 'चालें' : 'Moves'}</Text>
                  <Text style={styles.statValue}>{memoryMoves}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{isHindi ? 'जोड़ियां' : 'Pairs'}</Text>
                  <Text style={styles.statValue}>{matchedPairs} / 4</Text>
                </View>
                <TouchableOpacity
                  style={[styles.statBox, { backgroundColor: '#F1F5F9' }]}
                  onPress={initMemoryGame}
                >
                  <RotateCcw size={16} color="#0F172A" />
                  <Text style={[styles.statLabel, { marginTop: 4 }]}>
                    {isHindi ? 'रीसेट' : 'Restart'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Cards Grid */}
              <View style={styles.memoryGrid}>
                {cards.map((card, index) => {
                  const showFront = card.isFlipped || card.isMatched;
                  return (
                    <TouchableOpacity
                      key={card.id}
                      style={[
                        styles.memoryCard,
                        showFront && styles.memoryCardFlipped,
                        card.isMatched && styles.memoryCardMatched,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => handleFlipCard(index)}
                    >
                      {showFront ? (
                        <View style={styles.cardFrontContent}>
                          <Text style={styles.memoryEmoji}>{card.emoji}</Text>
                          <Text style={styles.memoryLabel}>{card.label}</Text>
                        </View>
                      ) : (
                        <View style={styles.cardBackContent}>
                          <Sparkles size={18} color="#94A3B8" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Science & Joy Benefit Banner */}
        <View style={styles.scienceBanner}>
          <View style={styles.scienceIconBox}>
            <Smile size={24} color="#059669" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.scienceTitle}>
              {isHindi ? 'शिशु को क्या लाभ होता है?' : 'How Does Baby Benefit?'}
            </Text>
            <Text style={styles.scienceText}>
              {isHindi
                ? 'जब माँ हंसती और खेलती है, तो शरीर में डोपामाइन और एंडोर्फिन उत्पन्न होते हैं जो प्लेसेंटा के माध्यम से 15 सेकंड में शिशु तक पहुंचकर उसकी तंत्रिका प्रणाली को खुशहाल बनाते हैं।'
                : 'When mother plays and laughs, endorphins cross the placenta within 15 seconds, creating a calm, high-intelligence environment for fetal brain synapses!'}
            </Text>
          </View>
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pointsText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  circleGamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  circleGameItem: {
    alignItems: 'center',
    flex: 1,
  },
  gameCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  gameCircleSelected: {
    borderWidth: 2.5,
    borderColor: '#1E1B4B',
    transform: [{ scale: 1.08 }],
    shadowOpacity: 0.16,
  },
  gameCircleEmoji: {
    fontSize: 22,
  },
  selectedPillDot: {
    position: 'absolute',
    bottom: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1E1B4B',
  },
  gameCircleLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },
  gameCircleLabelSelected: {
    color: '#1E1B4B',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  gameContainer: {
    marginBottom: 16,
  },
  introCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  introIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  introDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  gameStatsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    gap: 8,
    marginBottom: 18,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  startBtn: {
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
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  cravingBoard: {
    alignItems: 'center',
  },
  boardInstruction: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  foodCard: {
    width: (width - 76) / 3,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  foodCardActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    transform: [{ scale: 1.05 }],
  },
  foodEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  foodName: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  foodPoints: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },
  ptsGreen: {
    color: '#059669',
  },
  ptsRed: {
    color: '#DC2626',
  },
  bellyContainer: {
    alignItems: 'center',
    marginTop: 4,
    width: '100%',
  },
  bellySubtext: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 12,
    fontWeight: '600',
  },
  bellyGrid: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#FFF1F2',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#FECDD3',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 6,
  },
  bumpZone: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
  },
  bumpZoneActive: {
    backgroundColor: '#FDA4AF',
    transform: [{ scale: 1.08 }],
    borderWidth: 2,
    borderColor: '#E11D48',
  },
  kickEmojiWrap: {
    alignItems: 'center',
  },
  kickEmoji: {
    fontSize: 24,
  },
  kickPopupText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E11D48',
  },
  emptySpotDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FECDD3',
  },
  mythCard: {
    marginTop: 6,
  },
  mythBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mythBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  mythPointsBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7C3AED',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  mythStatement: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 24,
    textAlign: 'center',
    marginVertical: 14,
  },
  mythBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  mythChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mythBustBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  mythBustBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DC2626',
  },
  mythFactBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  mythFactBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  explanationBox: {
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
  },
  expSuccess: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  expIncorrect: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  expHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  expTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  expBody: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    marginBottom: 12,
  },
  nextMythBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  nextMythBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  memoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 8,
  },
  memoryCard: {
    width: (width - 76) / 4,
    height: 76,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  memoryCardFlipped: {
    backgroundColor: '#FFFFFF',
    borderColor: '#3B82F6',
  },
  memoryCardMatched: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  cardFrontContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBackContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoryEmoji: {
    fontSize: 26,
  },
  memoryLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#475569',
    marginTop: 2,
  },
  scienceBanner: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 14,
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  scienceIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scienceTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#065F46',
  },
  scienceText: {
    fontSize: 12,
    color: '#047857',
    marginTop: 4,
    lineHeight: 17,
    fontWeight: '500',
  },
});
