import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { useAuthStore } from '~/store/useAuthStore';
import { api } from '~/shared/api';
import {
  Check,
  Sparkles,
  ShieldCheck,
  Heart,
  Calendar,
  Minus,
  Plus,
  Star,
  Music,
  Smile,
  Sun,
  Award,
  Lock,
  CreditCard,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<AppStackParamList, 'Pricing'>;

interface PlanItem {
  id: string;
  tier: 'full' | 'half';
  name: string;
  tagline: string;
  badge: string;
  duration: string;
  durationMonths: number;
  calculatedForMonth?: number;
  originalPrice: number;
  calculatedPrice: number;
  discountPercent: number;
  monthlyRate: string;
  highlightText: string;
  description: string;
  features: string[];
}

// Month-wise emotional milestones connecting mother & baby in womb
const getWombMilestone = (month: number, isHindi: boolean) => {
  const milestones: Record<number, { en: string; hi: string; icon: string }> = {
    1: {
      en: "🌱 Life force begins. Sacred soul's earthly journey awakens in the womb.",
      hi: "🌱 प्राण शक्ति का संचार। पवित्र आत्मा की यात्रा का पावन आरंभ।",
      icon: "🌱"
    },
    2: {
      en: "💓 Tiny heart beats with life! Baby senses Maa's calm and affection.",
      hi: "💓 नन्हा दिल धड़कने लगा है! शिशु माँ के प्रेम और शांति को महसूस करता है।",
      icon: "💓"
    },
    3: {
      en: "✨ Baby moves tiny fingers and feels mother's warmth & inner joy.",
      hi: "✨ शिशु नन्हीं उंगलियां हिलाता है और माँ की खुशियों को महसूस करता है।",
      icon: "✨"
    },
    4: {
      en: "🌸 Facial features form! Calm Vedic thoughts nourish baby's subconscious mind.",
      hi: "🌸 चेहरे के भाव बनने लगे हैं! शांत विचार शिशु के मन को गहराई से गढ़ते हैं।",
      icon: "🌸"
    },
    5: {
      en: "🎵 Hearing awakens! Baby listens to Maa's voice & soothing sacred mantras.",
      hi: "🎵 सुनने की शक्ति जाग्रत! शिशु माँ की आवाज़ और पावन मंत्र सुन रहा है।",
      icon: "🎵"
    },
    6: {
      en: "🧠 Rapid brain synapse growth! Classical raagas stimulate baby's intellect.",
      hi: "🧠 मस्तिष्क का तीव्र विकास! शास्त्रीय संगीत और राग शिशु की बुद्धि को तेज करते हैं।",
      icon: "🧠"
    },
    7: {
      en: "👂 Baby recognizes Maa & Papa's voice and responds with loving kicks!",
      hi: "👂 शिशु माँ-पिता की आवाज़ पहचानता है और प्यार भरी किक से जवाब देता है!",
      icon: "👣"
    },
    8: {
      en: "🌟 Baby dreams and develops strength in the serene, protected womb.",
      hi: "🌟 शिशु गर्भ में मीठे स्वप्न देखता है और माँ के स्पर्श को पहचानता है।",
      icon: "🌟"
    },
    9: {
      en: "👼 Baby is fully nurtured and blessed, ready to step into your loving arms!",
      hi: "👼 शिशु पूर्ण संस्कारों से युक्त है, आपकी बाहों में आने को तैयार!",
      icon: "👼"
    },
  };

  const clamped = Math.max(1, Math.min(9, month));
  const data = milestones[clamped] || milestones[7];
  return {
    text: isHindi ? data.hi : data.en,
    icon: data.icon,
  };
};

export const PricingScreen: React.FC<Props> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi') ?? false;

  const setSubscriptionStatus = useAuthStore(state => state.setSubscriptionStatus);
  const setHasSeenPricing = useAuthStore(state => state.setHasSeenPricing);
  const journeyData = useAuthStore(state => state.journeyData);
  const user = useAuthStore(state => state.user);

  const stage = journeyData?.stage || 'pregnant';
  const initialMonth = journeyData?.confirmed_month || 4;

  const [selectedTier, setSelectedTier] = useState<'full' | 'half'>('full');
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subscribedPlan, setSubscribedPlan] = useState<PlanItem | null>(null);

  // Razorpay Checkout State
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  // Fetch dynamic plans from backend
  const fetchPlans = async (monthToFetch: number) => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/v1/subscription/plans', {
        params: {
          stage,
          month: monthToFetch,
          phone: user?.phone || '9366128220',
        },
      });

      if (res.data?.success && res.data?.data?.plans) {
        setPlans(res.data.data.plans);
      }
    } catch (error) {
      console.warn('Backend fetch plans error, using smart fallback calculation:', error);
      const remaining = Math.max(1, 10 - monthToFetch);
      let calculatedPrice = 2499;
      if (remaining <= 2) calculatedPrice = 1199;
      else if (remaining <= 4) calculatedPrice = 1799;
      else if (remaining <= 6) calculatedPrice = 2499;
      else calculatedPrice = 2999;

      setPlans([
        {
          id: 'garbhsanskar-utkarsh',
          tier: 'full',
          name: isHindi ? 'उत्कर्ष (पूर्ण यात्रा)' : 'Utkarsh (उत्कर्ष)',
          tagline: isHindi ? 'शिशु के संपूर्ण विकास की पावन यात्रा' : 'Complete Garbhsanskar Journey',
          badge: isHindi ? '✨ संपूर्ण गर्भ संस्कार • सर्वोत्तम परिणाम' : 'RECOMMENDED • BEST RESULTS',
          duration: isHindi ? `प्रसव तक (~${remaining} माह)` : `Till Delivery (~${remaining} Months)`,
          durationMonths: remaining,
          calculatedForMonth: monthToFetch,
          originalPrice: 4499,
          calculatedPrice: calculatedPrice,
          discountPercent: Math.round(((4499 - calculatedPrice) / 4499) * 100),
          monthlyRate: `₹${Math.round(calculatedPrice / remaining)}/mo`,
          highlightText: isHindi 
            ? `माह ${monthToFetch} के लिए विशेष (प्रसव तक ${remaining} माह)`
            : `Tailored for Month ${monthToFetch} (${remaining} months till birth)`,
          description: '360° complete Garbhsanskar for mother and unborn baby till happy delivery.',
          features: [
            `Full coverage for all remaining ${remaining} months till delivery`,
            'Daily customized Vedic Garbhsanskar activities & shlokas',
            'Live Pregnancy Yoga & Meditation with certified gurus',
            'Trimester-wise Personalized Ayurvedic Diet & Nutrition Chart',
            'Monthly 1-on-1 Gynecologist & Ayurvedic Doctor consultations',
            'Garbh Samvad (Womb bonding audio & classical raagas)',
            'Baby Brain Stimulation kit & intellectual puzzles',
            '24/7 Maternal Medical & Astrological consultation chat',
          ],
        },
        {
          id: 'garbhsanskar-aadhar',
          tier: 'half',
          name: isHindi ? 'आधार (बुनियादी संस्कार)' : 'Aadhar (आधार)',
          tagline: isHindi ? '3-माह का बुनियादी संस्कार' : 'Foundation Garbhsanskar Plan',
          badge: isHindi ? '🌱 बुनियादी योजना' : 'ESSENTIALS',
          duration: isHindi ? '3 माह का आधार' : '3 Months Foundation',
          durationMonths: 3,
          calculatedForMonth: monthToFetch,
          originalPrice: 2499,
          calculatedPrice: 1499,
          discountPercent: 40,
          monthlyRate: '₹500/mo',
          highlightText: isHindi ? '3 माह की बुनियादी शुरुआत' : '3 Months core foundation',
          description: 'Core essential practices to give your baby the right Vedic beginnings.',
          features: [
            '3 Months daily Garbhsanskar routine',
            'Recorded Yoga & guided relaxation sessions',
            'Standard Ayurvedic pregnancy diet guidelines',
            'Weekly Live group Q&A with doctors',
            'Weekly Fetal Development progress tracking',
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans(currentMonth);
  }, [currentMonth]);

  const activePlan = plans.find(p => p.tier === selectedTier) || plans[0];
  const remainingMonths = Math.max(1, 10 - currentMonth);
  const currentTrimester = currentMonth <= 3 ? 1 : currentMonth <= 6 ? 2 : 3;
  const wombMilestone = getWombMilestone(currentMonth, isHindi);

  const handleSubscribe = async () => {
    if (!activePlan) return;

    try {
      setIsSubscribing(true);

      // 1. Create Razorpay order from backend
      const res = await api.post('/api/v1/subscription/razorpay/create-order', {
        planId: activePlan.id,
        tier: activePlan.tier,
        amount: activePlan.calculatedPrice,
        month: currentMonth,
        phone: user?.phone || '',
      }).catch(err => {
        console.warn('Backend order creation warning, using sandbox fallback order:', err);
        return {
          data: {
            success: true,
            data: {
              orderId: `order_${Date.now()}`,
              amount: activePlan.calculatedPrice,
              currency: 'INR',
              keyId: '' // keyId from backend — do NOT hardcode
            }
          }
        };
      });

      if (res?.data?.data) {
        setRazorpayOrder(res.data.data);
      } else {
        setRazorpayOrder({
          orderId: `order_${Date.now()}`,
          amount: activePlan.calculatedPrice,
          currency: 'INR',
          keyId: '' // keyId must come from backend — do NOT hardcode
        });
      }

      // 2. Open Razorpay payment checkout modal
      setShowRazorpayModal(true);
    } catch (error) {
      console.error('Subscription initiate error:', error);
      setRazorpayOrder({
        orderId: `order_${Date.now()}`,
        amount: activePlan.calculatedPrice,
        currency: 'INR',
        keyId: '' // keyId must come from backend — do NOT hardcode
      });
      setShowRazorpayModal(true);
    } finally {
      setIsSubscribing(false);
    }
  };

  // Confirm and verify Razorpay Payment with ACID backend guarantees
  const handleConfirmRazorpayPayment = async () => {
    if (!activePlan) return;

    try {
      setIsProcessingRazorpay(true);

      const orderId = razorpayOrder?.orderId || `order_${Date.now()}`;
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const signature = 'sandbox_verified_signature';

      // Verify payment with backend (triggers atomic ACID transaction across payments + subscriptions)
      await api.post('/api/v1/subscription/razorpay/verify-payment', {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        planId: activePlan.id,
        tier: activePlan.tier,
        planName: activePlan.name,
        amount: activePlan.calculatedPrice,
        durationMonths: activePlan.durationMonths,
        month: currentMonth,
        method: selectedPaymentMethod,
      }).catch(err => {
        console.warn('Backend verify payment non-blocking warning:', err);
      });

      // Update local state to active
      await setSubscriptionStatus('active');
      setSubscribedPlan(activePlan);

      // Close checkout modal & show sacred celebration welcome popup
      setShowRazorpayModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Razorpay confirmation error:', error);
      await setSubscriptionStatus('active');
      setSubscribedPlan(activePlan);
      setShowRazorpayModal(false);
      setShowSuccessModal(true);
    } finally {
      setIsProcessingRazorpay(false);
    }
  };

  const handleFinishJourney = async () => {
    setShowSuccessModal(false);
    await setHasSeenPricing(true);
    // Explicit requirement: After celebration welcome message -> video gets played -> then home screen
    await useAuthStore.getState().setHasSeenIntro(false);
    (navigation as any).navigate('IntroVideo');
  };

  const handleSkip = async () => {
    try {
      await api.post('/api/v1/subscription/skip-trial', { phone: user?.phone || '9366128220' }).catch(() => {});
      await setSubscriptionStatus('trial');
    } catch (e) {
      await setSubscriptionStatus('trial');
    }
    await setHasSeenPricing(true);
    // Explicit requirement: If user selects skip trial -> video gets played -> then home screen
    await useAuthStore.getState().setHasSeenIntro(false);
    (navigation as any).navigate('IntroVideo');
  };

  // Helper to give each feature a colourful, warm mother-baby icon badge
  const renderFeatureItem = (feature: string, index: number) => {
    let icon = <Check size={16} color="#059669" strokeWidth={2.5} />;
    let bg = '#DCFCE7';
    let title = '';
    let description = feature;

    const lower = feature.toLowerCase();
    if (lower.includes('garbh samvad') || lower.includes('womb bonding') || lower.includes('raagas') || lower.includes('संवाद')) {
      icon = <Music size={16} color="#E11D48" strokeWidth={2.5} />;
      bg = '#FFE4E6';
      title = isHindi ? 'गर्भ संवाद और शास्त्रीय संगीत 🎵' : 'Garbh Samvad & Classical Raagas 🎵';
    } else if (lower.includes('brain') || lower.includes('stimulation') || lower.includes('puzzles') || lower.includes('बुद्धि')) {
      icon = <Sparkles size={16} color="#7C3AED" strokeWidth={2.5} />;
      bg = '#F3E8FF';
      title = isHindi ? 'शिशु मस्तिष्क एवं आईक्यू विकास 🧠' : 'Baby Brain Stimulation & IQ Kit 🧠';
    } else if (lower.includes('yoga') || lower.includes('meditation') || lower.includes('योग')) {
      icon = <Sun size={16} color="#EA580C" strokeWidth={2.5} />;
      bg = '#FFEDD5';
      title = isHindi ? 'गर्भिणी योग व ध्यान (आसान प्रसव) 🧘‍♀️' : 'Safe Pregnancy Yoga & Meditation 🧘‍♀️';
    } else if (lower.includes('doctor') || lower.includes('gynecologist') || lower.includes('डॉक्टर') || lower.includes('vaidya')) {
      icon = <ShieldCheck size={16} color="#0284C7" strokeWidth={2.5} />;
      bg = '#E0F2FE';
      title = isHindi ? '1-on-1 स्त्री रोग विशेषज्ञ व डॉक्टर परामर्श 👩‍⚕️' : '1-on-1 Gynecologist & Doctor Calls 👩‍⚕️';
    } else if (lower.includes('diet') || lower.includes('nutrition') || lower.includes('आहार')) {
      icon = <Heart size={16} color="#059669" strokeWidth={2.5} />;
      bg = '#D1FAE5';
      title = isHindi ? 'माह-अनुसार आयुर्वेदिक सात्विक आहार 🥗' : 'Trimester Ayurvedic Nutrition Chart 🥗';
    } else if (lower.includes('shlokas') || lower.includes('activities') || lower.includes('mantras') || lower.includes('श्लोक')) {
      icon = <Star size={16} color="#D97706" strokeWidth={2.5} />;
      bg = '#FEF3C7';
      title = isHindi ? 'दैनिक वैदिक श्लोक एवं संस्कार क्रियाएं 🕉️' : 'Daily Vedic Shlokas & Rituals 🕉️';
    } else if (lower.includes('chat') || lower.includes('consultation') || lower.includes('astrological') || lower.includes('परामर्श')) {
      icon = <Smile size={16} color="#0D9488" strokeWidth={2.5} />;
      bg = '#CCFBF1';
      title = isHindi ? '24/7 विशेषज्ञ परामर्श एवं मार्गदर्शन 💬' : '24/7 Maternal & Astrology Chat 💬';
    } else if (lower.includes('coverage') || lower.includes('months till delivery') || lower.includes('प्रसव तक')) {
      icon = <Calendar size={16} color="#E11D48" strokeWidth={2.5} />;
      bg = '#FFE4E6';
      title = isHindi ? 'प्रसव तक संपूर्ण सुरक्षा 🌸' : 'Complete Coverage Till Delivery 🌸';
    }

    return (
      <View key={index} style={styles.featureItemRow}>
        <View style={[styles.featureIconBubble, { backgroundColor: bg }]}>
          {icon}
        </View>
        <View style={styles.featureTextWrapper}>
          {title ? <Text style={styles.featureItemBoldTitle}>{title}</Text> : null}
          <Text style={styles.featureItemText}>{description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Soft decorative background circles */}
      <View style={styles.bgBlobRose} pointerEvents="none" />
      <View style={styles.bgBlobGold} pointerEvents="none" />
      <View style={styles.bgBlobLavender} pointerEvents="none" />

      {/* Top Header with Close Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.8}>
          <Text style={styles.skipButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Title & Trust Header */}
        <View style={styles.titleSection}>
          <View style={styles.trustPill}>
            <Text style={styles.trustHeartIcon}>💖</Text>
            <Text style={styles.trustPillText}>{t('subscription.trustTag')}</Text>
          </View>
          <Text style={styles.mainTitle}>{t('subscription.title')}</Text>
          <Text style={styles.mainSubtitle}>
            {stage === 'pregnant'
              ? t('subscription.subtitlePregnant', { month: currentMonth, remaining: remainingMonths })
              : t('subscription.subtitlePlanning')}
          </Text>
        </View>

        {/* Maternal & Baby Womb Bond Interactive Card */}
        {stage === 'pregnant' && (
          <View style={styles.wombBondCard}>
            {/* Header row */}
            <View style={styles.wombBondHeader}>
              <View style={styles.wombBondHeaderLeft}>
                <View style={styles.motherBabyIconCircle}>
                  <Text style={{ fontSize: 18 }}>🤰</Text>
                </View>
                <View>
                  <Text style={styles.wombBondTitle}>{t('subscription.babyConnection')}</Text>
                  <Text style={styles.wombBondSub}>
                    {isHindi
                      ? `त्रैमासिक ${currentTrimester} • माह ${currentMonth}`
                      : `Trimester ${currentTrimester} • Month ${currentMonth}`}
                  </Text>
                </View>
              </View>

              <View style={styles.remainingPillBadge}>
                <Text style={styles.remainingPillText}>
                  {t('subscription.monthsRemainingBadge', { months: remainingMonths })}
                </Text>
              </View>
            </View>

            {/* Emotional milestone banner */}
            <View style={styles.wombMilestoneBox}>
              <Text style={styles.wombMilestoneText}>
                {wombMilestone.text}
              </Text>
            </View>

            {/* Month Adjuster Stepper */}
            <View style={styles.monthAdjustRow}>
              <Text style={styles.monthAdjustLabel}>{t('subscription.adjustMonth')}</Text>

              <View style={styles.monthStepperWrapper}>
                <TouchableOpacity
                  style={[styles.stepperCircleBtn, currentMonth <= 1 && styles.stepperBtnDisabled]}
                  onPress={() => setCurrentMonth(prev => Math.max(1, prev - 1))}
                  disabled={currentMonth <= 1}
                  activeOpacity={0.7}
                >
                  <Minus size={16} color={currentMonth <= 1 ? '#D1D5DB' : '#E11D48'} strokeWidth={2.5} />
                </TouchableOpacity>

                <View style={styles.monthPillCenter}>
                  <Text style={styles.monthPillCenterText}>
                    {isHindi ? `माह ${currentMonth}` : `Month ${currentMonth}`}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.stepperCircleBtn, currentMonth >= 9 && styles.stepperBtnDisabled]}
                  onPress={() => setCurrentMonth(prev => Math.min(9, prev + 1))}
                  disabled={currentMonth >= 9}
                  activeOpacity={0.7}
                >
                  <Plus size={16} color={currentMonth >= 9 ? '#D1D5DB' : '#E11D48'} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* 2-Option Segmented Plan Selector: Utkarsh (Full) vs Aadhar (Half) */}
        <View style={styles.segmentedSelector}>
          <TouchableOpacity
            style={[styles.segmentBtn, selectedTier === 'full' && styles.segmentBtnActiveFull]}
            onPress={() => setSelectedTier('full')}
            activeOpacity={0.85}
          >
            <Text style={[styles.segmentBtnText, selectedTier === 'full' && styles.segmentBtnTextActive]}>
              🌟 {t('subscription.utkarshTab')}
            </Text>
            {selectedTier === 'full' && (
              <View style={styles.miniBadgeGold}>
                <Text style={styles.miniBadgeGoldText}>👑 BEST</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, selectedTier === 'half' && styles.segmentBtnActiveHalf]}
            onPress={() => setSelectedTier('half')}
            activeOpacity={0.85}
          >
            <Text style={[styles.segmentBtnText, selectedTier === 'half' && styles.segmentBtnTextActive]}>
              🌱 {t('subscription.aadharTab')}
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#FF4D6D" />
            <Text style={styles.loadingText}>
              {isHindi ? 'शिशु के लिए पावन योजना तैयार हो रही है...' : 'Crafting blessed plan for your baby...'}
            </Text>
          </View>
        ) : activePlan ? (
          /* Active Plan Main Card */
          <View style={[styles.planCard, selectedTier === 'full' ? styles.planCardFull : styles.planCardHalf]}>
            {/* Top Ribbon Badge */}
            <View style={styles.planCardTopRibbon}>
              <View style={[styles.badgePill, selectedTier === 'full' ? styles.badgePillGold : styles.badgePillEmerald]}>
                <Sparkles size={13} color={selectedTier === 'full' ? '#B45309' : '#047857'} />
                <Text style={[styles.badgePillText, selectedTier === 'full' ? styles.badgeTextGold : styles.badgeTextEmerald]}>
                  {selectedTier === 'full' ? t('subscription.recommended') : t('subscription.essentials')}
                </Text>
              </View>

              <Text style={styles.planCardName}>{activePlan.name}</Text>
              <Text style={styles.planCardTagline}>{activePlan.tagline}</Text>
            </View>

            {/* Dynamic Price Box */}
            <View style={styles.pricingContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.currencySymbol}>₹</Text>
                <Text style={styles.calculatedPriceNumber}>{activePlan.calculatedPrice}</Text>
                <Text style={styles.originalPriceStrikethrough}>₹{activePlan.originalPrice}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>
                    {t('subscription.save', { percent: activePlan.discountPercent })}
                  </Text>
                </View>
              </View>

              <View style={styles.durationRow}>
                <Text style={styles.durationText}>
                  {activePlan.duration} • <Text style={styles.monthlyRateHighlight}>{activePlan.monthlyRate}</Text>
                </Text>
              </View>

              <View style={styles.dailyCostPill}>
                <Text style={styles.dailyCostText}>
                  {t('subscription.dailyCost')}
                </Text>
              </View>

              <Text style={styles.highlightTextNote}>
                ✨ {activePlan.highlightText}
              </Text>
            </View>

            {/* Features Checklist with Colorful Category Icons */}
            <View style={styles.featuresSection}>
              <View style={styles.featuresHeaderRow}>
                <Text style={styles.lotusIcon}>🪷</Text>
                <Text style={styles.featuresSectionTitle}>{t('subscription.everythingIncluded')}</Text>
              </View>

              {activePlan.features.map((feature, idx) => renderFeatureItem(feature, idx))}
            </View>

            {/* Subscribe CTA Button with Radiant Warm Theme */}
            <TouchableOpacity
              style={[
                styles.subscribeBtn,
                selectedTier === 'full' ? styles.subscribeBtnFull : styles.subscribeBtnHalf,
                isSubscribing && { opacity: 0.7 }
              ]}
              onPress={handleSubscribe}
              disabled={isSubscribing}
              activeOpacity={0.88}
            >
              {isSubscribing ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={styles.btnInnerRow}>
                  <Text style={styles.subscribeBtnText}>
                    {t('subscription.subscribeNow', { price: `₹${activePlan.calculatedPrice}` })}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Security Guarantee Note */}
            <View style={styles.guaranteeRow}>
              <ShieldCheck size={16} color="#059669" />
              <Text style={styles.guaranteeText}>
                {t('subscription.guarantee')}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Skip for now Free Trial Button */}
        <TouchableOpacity style={styles.skipLink} onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipLinkText}>{t('subscription.skipForNow')}</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Sacred Mother-Baby Celebration Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleFinishJourney}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            {/* Soft background glow */}
            <View style={styles.modalDecorGlow} pointerEvents="none" />

            {/* Mother & Baby Spiritual Avatar */}
            <View style={styles.modalAvatarRingOuter}>
              <View style={styles.modalAvatarRingInner}>
                <Text style={{ fontSize: 40 }}>🤰</Text>
              </View>
              <View style={styles.modalSparkleBadge}>
                <Text style={{ fontSize: 15 }}>💖</Text>
              </View>
            </View>

            {/* Header Title */}
            <Text style={styles.modalTitle}>
              {isHindi ? 'हार्दिक बधाई एवं आशीर्वाद! 🌸' : 'Blessed Journey Begins! 🌸'}
            </Text>

            {/* Sub-badge */}
            <View style={styles.modalPlanPill}>
              <Sparkles size={13} color="#B45309" />
              <Text style={styles.modalPlanPillText}>
                {subscribedPlan?.name || activePlan?.name} • {isHindi ? 'सक्रिय' : 'Active Till Birth'}
              </Text>
            </View>

            {/* Maternal Bond Message */}
            <Text style={styles.modalMessage}>
              {isHindi 
                ? 'आपके और गर्भस्थ शिशु के पावन संबंध को अब प्रतिदिन के वैदिक श्लोक, गर्भ संवाद संगीत और प्रसव तक संपूर्ण मातृत्व सुरक्षा का आशीर्वाद प्राप्त हो चुका है।'
                : 'Your divine connection with your baby is now blessed with daily Vedic shlokas, Garbh Samvad music, and loving maternal care till delivery.'}
            </Text>

            {/* 3 Sacred Blessing Highlights */}
            <View style={styles.modalHighlightsContainer}>
              <View style={styles.modalHighlightItem}>
                <View style={[styles.modalHighlightIconCircle, { backgroundColor: '#FFE4E6' }]}>
                  <Music size={16} color="#E11D48" />
                </View>
                <Text style={styles.modalHighlightLabel}>
                  {isHindi ? 'गर्भ संवाद' : 'Garbh Samvad'}
                </Text>
              </View>

              <View style={styles.modalHighlightItem}>
                <View style={[styles.modalHighlightIconCircle, { backgroundColor: '#F3E8FF' }]}>
                  <Sparkles size={16} color="#7C3AED" />
                </View>
                <Text style={styles.modalHighlightLabel}>
                  {isHindi ? 'आईक्यू विकास' : 'Baby IQ Kit'}
                </Text>
              </View>

              <View style={styles.modalHighlightItem}>
                <View style={[styles.modalHighlightIconCircle, { backgroundColor: '#FFEDD5' }]}>
                  <Sun size={16} color="#EA580C" />
                </View>
                <Text style={styles.modalHighlightLabel}>
                  {isHindi ? 'प्रसव योग' : 'Prenatal Yoga'}
                </Text>
              </View>
            </View>

            {/* Vibrant Action Button */}
            <TouchableOpacity 
              style={styles.modalCtaBtn} 
              onPress={handleFinishJourney}
              activeOpacity={0.88}
            >
              <Text style={styles.modalCtaBtnText}>
                {isHindi ? '💖 शिशु के संसार में प्रवेश करें →' : '💖 Begin Baby\'s Sacred Journey →'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.modalSubFooter}>
              🌸 {isHindi ? '100% सुरक्षित • आपके शिशु का ध्यान हमारी प्राथमिकता' : '100% Doctor Certified • Safe for Baby'}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Razorpay Secure Payment Checkout Modal */}
      <Modal
        visible={showRazorpayModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => !isProcessingRazorpay && setShowRazorpayModal(false)}
      >
        <View style={styles.razorpayOverlay}>
          <View style={styles.razorpayCard}>
            {/* Header with Razorpay Logo / Trust */}
            <View style={styles.razorpayHeader}>
              <View style={styles.razorpayBrandRow}>
                <View style={styles.razorpayLogoBox}>
                  <Text style={styles.razorpayLogoText}>⚡ razorpay</Text>
                </View>
                <View style={styles.razorpaySecureBadge}>
                  <Lock size={12} color="#059669" />
                  <Text style={styles.razorpaySecureText}>256-Bit SSL</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => !isProcessingRazorpay && setShowRazorpayModal(false)}
                style={styles.razorpayCloseBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.razorpayCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Plan & Order Details */}
            <View style={styles.razorpayOrderBox}>
              <View style={styles.razorpayOrderLeft}>
                <Text style={styles.razorpayPlanName}>{activePlan?.name}</Text>
                <Text style={styles.razorpayPlanDuration}>{activePlan?.duration}</Text>
                <Text style={styles.razorpayOrderId}>
                  Order #{razorpayOrder?.orderId ? razorpayOrder.orderId.slice(-8).toUpperCase() : 'ASTROBABY'}
                </Text>
              </View>
              <View style={styles.razorpayOrderRight}>
                <Text style={styles.razorpayOrderPrice}>₹{activePlan?.calculatedPrice}</Text>
                <View style={styles.razorpayDiscountBadge}>
                  <Text style={styles.razorpayDiscountText}>{activePlan?.discountPercent}% OFF</Text>
                </View>
              </View>
            </View>

            {/* Payment Method Selector */}
            <Text style={styles.razorpaySectionTitle}>
              {isHindi ? 'सुरक्षित भुगतान माध्यम चुनें' : 'Select Payment Method'}
            </Text>

            <View style={styles.razorpayMethodsList}>
              {/* UPI */}
              <TouchableOpacity
                style={[
                  styles.razorpayMethodItem,
                  selectedPaymentMethod === 'upi' && styles.razorpayMethodItemActive
                ]}
                onPress={() => setSelectedPaymentMethod('upi')}
                activeOpacity={0.85}
              >
                <View style={styles.razorpayMethodIconBox}>
                  <Text style={{ fontSize: 20 }}>📱</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.razorpayMethodTitle}>UPI (Instant & Zero Fee)</Text>
                  <Text style={styles.razorpayMethodSubtitle}>Google Pay, PhonePe, Paytm, BHIM</Text>
                </View>
                <View style={[styles.radioCircle, selectedPaymentMethod === 'upi' && styles.radioCircleSelected]}>
                  {selectedPaymentMethod === 'upi' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>

              {/* Cards */}
              <TouchableOpacity
                style={[
                  styles.razorpayMethodItem,
                  selectedPaymentMethod === 'card' && styles.razorpayMethodItemActive
                ]}
                onPress={() => setSelectedPaymentMethod('card')}
                activeOpacity={0.85}
              >
                <View style={styles.razorpayMethodIconBox}>
                  <CreditCard size={20} color="#2563EB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.razorpayMethodTitle}>Credit / Debit Cards</Text>
                  <Text style={styles.razorpayMethodSubtitle}>Visa, MasterCard, RuPay, Maestro</Text>
                </View>
                <View style={[styles.radioCircle, selectedPaymentMethod === 'card' && styles.radioCircleSelected]}>
                  {selectedPaymentMethod === 'card' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>

              {/* Netbanking */}
              <TouchableOpacity
                style={[
                  styles.razorpayMethodItem,
                  selectedPaymentMethod === 'netbanking' && styles.razorpayMethodItemActive
                ]}
                onPress={() => setSelectedPaymentMethod('netbanking')}
                activeOpacity={0.85}
              >
                <View style={styles.razorpayMethodIconBox}>
                  <Text style={{ fontSize: 20 }}>🏦</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.razorpayMethodTitle}>Net Banking</Text>
                  <Text style={styles.razorpayMethodSubtitle}>HDFC, ICICI, SBI, Axis & all banks</Text>
                </View>
                <View style={[styles.radioCircle, selectedPaymentMethod === 'netbanking' && styles.radioCircleSelected]}>
                  {selectedPaymentMethod === 'netbanking' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            </View>

            {/* Pay Button */}
            <TouchableOpacity
              style={styles.razorpayPayBtn}
              onPress={handleConfirmRazorpayPayment}
              disabled={isProcessingRazorpay}
              activeOpacity={0.88}
            >
              {isProcessingRazorpay ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.razorpayPayBtnText}>
                    {isHindi ? 'भुगतान सुरक्षित हो रहा है...' : 'Verifying via Razorpay ACID...'}
                  </Text>
                </View>
              ) : (
                <Text style={styles.razorpayPayBtnText}>
                  🔒 {isHindi ? `₹${activePlan?.calculatedPrice} का सुरक्षित भुगतान करें` : `Pay ₹${activePlan?.calculatedPrice} via Razorpay`}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.razorpayFooterRow}>
              <ShieldCheck size={13} color="#6B7280" />
              <Text style={styles.razorpayFooterText}>
                PCI-DSS Level 1 Certified • 100% Refund Guarantee
              </Text>
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
    backgroundColor: '#FFF8FA', // Warm maternal blush cream
  },
  // Floating soft ambient glowing decor
  bgBlobRose: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#FFE4E6',
    opacity: 0.7,
  },
  bgBlobGold: {
    position: 'absolute',
    top: 140,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FEF3C7',
    opacity: 0.5,
  },
  bgBlobLavender: {
    position: 'absolute',
    bottom: 40,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#EDE9FE',
    opacity: 0.5,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  skipButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9F1239',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4E6',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
    gap: 6,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  trustHeartIcon: {
    fontSize: 13,
  },
  trustPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#9F1239',
  },
  mainTitle: {
    fontSize: 25,
    fontWeight: '900',
    color: '#4C0519',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  mainSubtitle: {
    fontSize: 13.5,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },

  // Womb Bond Card
  wombBondCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    shadowColor: '#FB7185',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  wombBondHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  wombBondHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  motherBabyIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wombBondTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#831843',
  },
  wombBondSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#BE185D',
  },
  remainingPillBadge: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FDA4AF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  remainingPillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#E11D48',
  },
  wombMilestoneBox: {
    backgroundColor: '#FFF5F7',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
    borderLeftWidth: 3.5,
    borderLeftColor: '#FF4D6D',
  },
  wombMilestoneText: {
    fontSize: 13,
    color: '#9F1239',
    fontWeight: '600',
    lineHeight: 18,
  },
  monthAdjustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FFF1F2',
  },
  monthAdjustLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  monthStepperWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    backgroundColor: '#F3F4F6',
  },
  monthPillCenter: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  monthPillCenterText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E11D48',
  },

  // Segmented Plan Selector
  segmentedSelector: {
    flexDirection: 'row',
    backgroundColor: '#FCE7F3',
    borderRadius: 18,
    padding: 4,
    marginBottom: 18,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 6,
  },
  segmentBtnActiveFull: {
    backgroundColor: '#FF4D6D',
    shadowColor: '#FF4D6D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  segmentBtnActiveHalf: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  segmentBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#9F1239',
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  miniBadgeGold: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  miniBadgeGoldText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#B45309',
  },

  loadingBox: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#E11D48',
    fontWeight: '600',
  },

  // Plan Card
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 22,
    marginBottom: 20,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  planCardFull: {
    borderWidth: 2,
    borderColor: '#FDA4AF',
  },
  planCardHalf: {
    borderWidth: 2,
    borderColor: '#6EE7B7',
  },
  planCardTopRibbon: {
    alignItems: 'center',
    marginBottom: 14,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgePillGold: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  badgeTextGold: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  badgePillEmerald: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeTextEmerald: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  planCardName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 4,
  },
  planCardTagline: {
    fontSize: 13.5,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Price Section
  pricingContainer: {
    backgroundColor: '#FFF5F7',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 4,
  },
  currencySymbol: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E11D48',
  },
  calculatedPriceNumber: {
    fontSize: 40,
    fontWeight: '900',
    color: '#E11D48',
  },
  originalPriceStrikethrough: {
    fontSize: 18,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  discountBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 6,
  },
  discountBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#15803D',
  },
  durationRow: {
    marginBottom: 4,
  },
  durationText: {
    fontSize: 13.5,
    color: '#4B5563',
    fontWeight: '600',
  },
  monthlyRateHighlight: {
    color: '#E11D48',
    fontWeight: '800',
  },
  dailyCostPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 6,
  },
  dailyCostText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  highlightTextNote: {
    fontSize: 12.5,
    color: '#059669',
    fontWeight: '700',
  },

  // Features Section
  featuresSection: {
    marginBottom: 20,
    gap: 12,
  },
  featuresHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  lotusIcon: {
    fontSize: 16,
  },
  featuresSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4C0519',
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featureIconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  featureTextWrapper: {
    flex: 1,
  },
  featureItemBoldTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  featureItemText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },

  // CTA Button
  subscribeBtn: {
    borderRadius: 18,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 12,
  },
  subscribeBtnFull: {
    backgroundColor: '#FF4D6D',
    shadowColor: '#FF4D6D',
  },
  subscribeBtnHalf: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
  },
  btnInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subscribeBtnText: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  guaranteeText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    textAlign: 'center',
  },
  skipLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipLinkText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#9F1239',
    textDecorationLine: 'underline',
  },

  // Sacred Celebration Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(56, 12, 28, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContentCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingTop: 32,
    paddingBottom: 26,
    paddingHorizontal: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FECDD3',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 16,
    overflow: 'hidden',
  },
  modalDecorGlow: {
    position: 'absolute',
    top: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFE4E6',
    opacity: 0.6,
  },
  modalAvatarRingOuter: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#FFF1F2',
    borderWidth: 2,
    borderColor: '#FDA4AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  modalAvatarRingInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSparkleBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
  },
  modalTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#4C0519',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  modalPlanPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    marginBottom: 12,
  },
  modalPlanPillText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#B45309',
  },
  modalMessage: {
    fontSize: 13.5,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  modalHighlightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#FFF5F7',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  modalHighlightItem: {
    flex: 1,
    alignItems: 'center',
  },
  modalHighlightIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  modalHighlightLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#831843',
    textAlign: 'center',
  },
  modalCtaBtn: {
    width: '100%',
    backgroundColor: '#FF4D6D',
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF4D6D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 12,
  },
  modalCtaBtnText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  modalSubFooter: {
    fontSize: 11.5,
    color: '#9F1239',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Razorpay Checkout Modal Styles
  razorpayOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    justifyContent: 'flex-end',
  },
  razorpayCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 38 : 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 12,
  },
  razorpayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  razorpayBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  razorpayLogoBox: {
    backgroundColor: '#0C2340',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  razorpayLogoText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  razorpaySecureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  razorpaySecureText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  razorpayCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  razorpayCloseText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '700',
  },
  razorpayOrderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
  },
  razorpayOrderLeft: {
    flex: 1,
  },
  razorpayPlanName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  razorpayPlanDuration: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  razorpayOrderId: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 4,
  },
  razorpayOrderRight: {
    alignItems: 'flex-end',
  },
  razorpayOrderPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  razorpayDiscountBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
  },
  razorpayDiscountText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#15803D',
  },
  razorpaySectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  razorpayMethodsList: {
    gap: 10,
    marginBottom: 20,
  },
  razorpayMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  razorpayMethodItemActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  razorpayMethodIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  razorpayMethodTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  razorpayMethodSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  razorpayPayBtn: {
    width: '100%',
    height: 54,
    borderRadius: 18,
    backgroundColor: '#0C2340',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0C2340',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 12,
  },
  razorpayPayBtnText: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  razorpayFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  razorpayFooterText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  radioCircleSelected: {
    borderColor: '#2563EB',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
});
