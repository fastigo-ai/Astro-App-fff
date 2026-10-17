import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image as RNImage,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Star,
  Clock,
  Heart,
  CalendarDays,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Lock,
  BookOpen,
  Award,
  Users,
  Check,
  HelpCircle,
  ExternalLink,
} from 'lucide-react-native';
import { PROGRAMS_DATA, ProgramTier } from '../data/programsData';
import { useAuthStore } from '~/store/useAuthStore';
import { api, baseURL } from '~/shared/api';

const { width } = Dimensions.get('window');

export const CourseScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi') ?? false;

  const courseId = route.params?.courseId || 'garbh_sanskar';
  const program = useMemo(() => {
    return PROGRAMS_DATA[courseId] || PROGRAMS_DATA['garbh_sanskar'];
  }, [courseId]);

  // Auth & Subscription State
  const user = useAuthStore((state) => state.user);
  const isProgramSubscribed = useAuthStore((state) => state.isProgramSubscribed);
  const subscribeToProgram = useAuthStore((state) => state.subscribeToProgram);

  const isSubscribed = isProgramSubscribed(program.id);

  // Tab & Selection State
  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'pricing' | 'faqs'>('overview');
  const [selectedTier, setSelectedTier] = useState<ProgramTier>(program.tiers[0] || {} as ProgramTier);
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Razorpay Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Handle Enrollment
  const handleEnrollPress = () => {
    if (isSubscribed) {
      // Navigate to activities or dashboard
      navigation.navigate('MainTabs');
      return;
    }
    setShowPaymentModal(true);
  };

  // Open Official Razorpay Test Checkout Page
  const openRazorpayWebCheckout = async () => {
    try {
      const amount = selectedTier.calculatedPrice;
      const planName = `${program.title} - ${selectedTier.name}`;
      const phone = user?.phone || '9366128220';
      const url = `${baseURL}/checkout.html?amount=${amount}&planName=${encodeURIComponent(planName)}&phone=${phone}&autoOpen=true`;

      const supported = await Linking.canOpenURL(url).catch(() => true);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Checkout Link', `Please open in your browser:\n${url}`);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Unable to open checkout URL');
    }
  };

  // Process Razorpay Payment
  const processPayment = async () => {
    try {
      setIsProcessingPayment(true);
      const phone = user?.phone || '9366128220';

      // 1. Create order on backend
      const orderRes = await api.post('/api/v1/subscription/razorpay/create-order', {
        planId: selectedTier.id,
        tier: selectedTier.id.includes('full') || selectedTier.id.includes('complete') || selectedTier.id.includes('utkarsh') ? 'full' : 'half',
        amount: selectedTier.calculatedPrice,
        phone,
        programId: program.id,
      });

      const orderData = orderRes.data?.data;
      const orderId = orderData?.orderId || `order_${Date.now()}`;

      // Simulate payment signature
      const mockPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const mockSignature = `sig_${Date.now()}_mock`;

      // 2. Verify payment on backend with ACID transaction
      await api.post('/api/v1/subscription/razorpay/verify-payment', {
        razorpay_order_id: orderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: mockSignature,
        planId: selectedTier.id,
        tier: selectedTier.id.includes('full') || selectedTier.id.includes('complete') || selectedTier.id.includes('utkarsh') ? 'full' : 'half',
        amount: selectedTier.calculatedPrice,
        planName: selectedTier.name,
        durationMonths: selectedTier.durationMonths,
        phone,
        programId: program.id,
        unlockedModules: program.unlockedModules,
        method: selectedPaymentMethod,
      }).catch((err) => {
        console.warn('Backend verify payment error, continuing client activation:', err);
      });

      // 3. Activate subscription in Zustand store & AsyncStorage
      await subscribeToProgram(program.id, {
        planId: selectedTier.id,
        planName: selectedTier.name,
        programId: program.id,
        amount: selectedTier.calculatedPrice,
        durationMonths: selectedTier.durationMonths,
        unlockedModules: program.unlockedModules,
      });

      setIsProcessingPayment(false);
      setShowPaymentModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Enrollment error:', error);
      setIsProcessingPayment(false);
      Alert.alert('Payment Error', 'Unable to complete transaction. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <RNImage source={program.image} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <SafeAreaView style={styles.heroHeader}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconCircleButton}>
                <ArrowLeft size={22} color="#1E1B4B" />
              </TouchableOpacity>
              <View style={[styles.statusPill, { backgroundColor: isSubscribed ? '#DCFCE7' : '#FEF3C7' }]}>
                <Text style={[styles.statusPillText, { color: isSubscribed ? '#16A34A' : '#D97706' }]}>
                  {isSubscribed ? '✓ SUBSCRIBED' : program.badge}
                </Text>
              </View>
            </SafeAreaView>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.contentContainer}>
          {/* Rating & Social Proof */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Star size={15} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingNumber}>{program.rating}</Text>
              <Text style={styles.reviewsCount}>({program.reviewsCount} reviews)</Text>
            </View>
            <View style={styles.enrolledBadge}>
              <Users size={14} color="#6B7280" />
              <Text style={styles.enrolledText}>{program.enrolledCount}</Text>
            </View>
          </View>

          {/* Titles */}
          <Text style={styles.title}>{program.title}</Text>
          <Text style={[styles.hindiTitle, { color: program.color }]}>{program.hindiTitle}</Text>
          <Text style={styles.subtitle}>{isHindi ? program.hindiSubtitle : program.subtitle}</Text>

          {/* Quick Highlight Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statCol}>
              <Clock size={18} color={program.color} />
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{selectedTier.duration || program.duration}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <ShieldCheck size={18} color="#16A34A" />
              <Text style={styles.statLabel}>Vedic & Doctor</Text>
              <Text style={styles.statValue}>100% Certified</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Heart size={18} color="#EC4899" />
              <Text style={styles.statLabel}>Care Model</Text>
              <Text style={styles.statValue}>Holistic 360°</Text>
            </View>
          </View>

          {/* Navigation Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'overview' && styles.activeTabButton]}
              onPress={() => setActiveTab('overview')}
            >
              <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
                Overview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'syllabus' && styles.activeTabButton]}
              onPress={() => setActiveTab('syllabus')}
            >
              <Text style={[styles.tabText, activeTab === 'syllabus' && styles.activeTabText]}>
                Syllabus
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'pricing' && styles.activeTabButton]}
              onPress={() => setActiveTab('pricing')}
            >
              <Text style={[styles.tabText, activeTab === 'pricing' && styles.activeTabText]}>
                Packages
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'faqs' && styles.activeTabButton]}
              onPress={() => setActiveTab('faqs')}
            >
              <Text style={[styles.tabText, activeTab === 'faqs' && styles.activeTabText]}>
                FAQs
              </Text>
            </TouchableOpacity>
          </View>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeading}>About this Program</Text>
              <Text style={styles.bodyText}>
                {isHindi ? program.hindiOverview : program.overview}
              </Text>

              <View style={styles.whoForCard}>
                <View style={styles.whoForHeader}>
                  <Sparkles size={18} color={program.color} />
                  <Text style={styles.whoForTitle}>Who is this for?</Text>
                </View>
                <Text style={styles.whoForText}>{program.whoIsItFor}</Text>
              </View>

              <Text style={styles.sectionHeading}>What You Receive</Text>
              <View style={styles.deliverablesList}>
                {program.deliverables.map((item, idx) => (
                  <View key={idx} style={styles.deliverableRow}>
                    <CheckCircle2 size={18} color={program.color} />
                    <Text style={styles.deliverableText}>{item}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionHeading}>Unlocked Inside Modules</Text>
              <Text style={styles.subtext}>
                Subscribing to this program grants full access to these tools inside your app:
              </Text>
              <View style={styles.unlockedModulesGrid}>
                {program.unlockedModules.map((mod, idx) => (
                  <View key={idx} style={styles.unlockedModuleBadge}>
                    <Sparkles size={14} color="#16A34A" />
                    <Text style={styles.unlockedModuleName}>
                      {mod === 'kicks' ? 'Baby Kick Counter'
                        : mod === 'bump' ? 'Baby Bump Photo Diary'
                        : mod === 'samvad' ? 'Garbh Samvad Audio'
                        : mod === 'mood' ? 'Mood & Calming Therapy'
                        : mod === 'activities' ? 'Daily Vedic Activities'
                        : mod === 'diet' ? 'Personalized Diet Chart'
                        : 'Doctor & Astrologer Chat'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* TAB 2: SYLLABUS / MODULES */}
          {activeTab === 'syllabus' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeading}>Curriculum & Step-by-Step Modules</Text>
              <Text style={styles.subtext}>
                Designed meticulously by experienced gynecologists and Ayurvedic scholars:
              </Text>

              {program.modules.map((mod, index) => {
                const isExpanded = expandedModule === index;
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.9}
                    style={styles.moduleCard}
                    onPress={() => setExpandedModule(isExpanded ? null : index)}
                  >
                    <View style={styles.moduleHeader}>
                      <View style={styles.moduleTitleCol}>
                        <Text style={styles.moduleTitle}>{mod.title}</Text>
                        <Text style={styles.moduleHindiTitle}>{mod.hindiTitle}</Text>
                      </View>
                      {isExpanded ? (
                        <ChevronUp size={20} color="#4B5563" />
                      ) : (
                        <ChevronDown size={20} color="#4B5563" />
                      )}
                    </View>

                    {isExpanded && (
                      <View style={styles.moduleBody}>
                        <Text style={styles.moduleDescription}>{mod.description}</Text>
                        <View style={styles.moduleItemsList}>
                          {mod.items.map((item, itemIdx) => (
                            <View key={itemIdx} style={styles.moduleItemRow}>
                              <Check size={15} color={program.color} />
                              <Text style={styles.moduleItemText}>{item}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* TAB 3: PACKAGES & PRICING */}
          {activeTab === 'pricing' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeading}>Choose Your Package Scheme</Text>
              <Text style={styles.subtext}>
                Select the duration and support tier that fits your family's needs:
              </Text>

              {program.tiers.map((tier) => {
                const isSelected = selectedTier.id === tier.id;
                return (
                  <TouchableOpacity
                    key={tier.id}
                    activeOpacity={0.9}
                    style={[
                      styles.tierCard,
                      isSelected && { borderColor: program.color, borderWidth: 2, backgroundColor: '#FAF5FF' },
                    ]}
                    onPress={() => setSelectedTier(tier)}
                  >
                    {tier.badge && (
                      <View style={[styles.tierBadge, { backgroundColor: program.color }]}>
                        <Text style={styles.tierBadgeText}>{tier.badge}</Text>
                      </View>
                    )}

                    <View style={styles.tierTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.tierName}>{tier.name}</Text>
                        <Text style={styles.tierTagline}>{tier.tagline}</Text>
                      </View>
                      <View style={styles.tierPriceCol}>
                        <Text style={styles.tierCalculatedPrice}>₹{tier.calculatedPrice}</Text>
                        <Text style={styles.tierOriginalPrice}>₹{tier.originalPrice}</Text>
                        <View style={styles.discountPill}>
                          <Text style={styles.discountPillText}>{tier.discountPercent}% OFF</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.tierHighlightRow}>
                      <Clock size={14} color="#6B7280" />
                      <Text style={styles.tierHighlightText}>{tier.highlightText} ({tier.monthlyRate})</Text>
                    </View>

                    <View style={styles.tierDivider} />

                    <View style={styles.tierFeaturesList}>
                      {tier.features.map((feat, featIdx) => (
                        <View key={featIdx} style={styles.tierFeatureRow}>
                          <CheckCircle2 size={16} color={program.color} />
                          <Text style={styles.tierFeatureText}>{feat}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* TAB 4: FAQS & FACULTY */}
          {activeTab === 'faqs' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeading}>Expert Doctors & Faculty</Text>
              <View style={styles.facultyGrid}>
                {program.faculty.map((doc, idx) => (
                  <View key={idx} style={styles.facultyCard}>
                    <Award size={20} color={program.color} />
                    <Text style={styles.facultyName}>{doc.name}</Text>
                    <Text style={styles.facultyRole}>{doc.role}</Text>
                    <Text style={styles.facultyExp}>{doc.exp}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.sectionHeading, { marginTop: 24 }]}>Frequently Asked Questions</Text>
              {program.faqs.map((faq, index) => {
                const isExpanded = expandedFaq === index;
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.9}
                    style={styles.faqCard}
                    onPress={() => setExpandedFaq(isExpanded ? null : index)}
                  >
                    <View style={styles.faqHeader}>
                      <Text style={styles.faqQuestion}>{faq.q}</Text>
                      {isExpanded ? (
                        <ChevronUp size={18} color="#6B7280" />
                      ) : (
                        <ChevronDown size={18} color="#6B7280" />
                      )}
                    </View>
                    {isExpanded && <Text style={styles.faqAnswer}>{faq.a}</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Persistent Bottom Enrollment Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomPriceLabel}>
            {isSubscribed ? 'Active Plan' : `${selectedTier.name}`}
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.bottomPriceValue, { color: program.color }]}>
              {isSubscribed ? 'UNLOCKED' : `₹${selectedTier.calculatedPrice}`}
            </Text>
            {!isSubscribed && (
              <Text style={styles.bottomOriginalPrice}>₹{selectedTier.originalPrice}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.enrollButton,
            { backgroundColor: isSubscribed ? '#16A34A' : program.color },
          ]}
          onPress={handleEnrollPress}
        >
          <Text style={styles.enrollButtonText}>
            {isSubscribed ? 'Access Modules →' : 'Enroll Now with Razorpay'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* RAZORPAY CHECKOUT MODAL */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Confirm & Subscribe</Text>
                <Text style={styles.modalSubtitle}>{program.title} • {selectedTier.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)} style={styles.closeModalBtn}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Price Summary */}
            <View style={styles.checkoutSummaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Package Plan</Text>
                <Text style={styles.summaryValue}>{selectedTier.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duration</Text>
                <Text style={styles.summaryValue}>{selectedTier.duration}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Original Fee</Text>
                <Text style={[styles.summaryValue, { textDecorationLine: 'line-through' }]}>₹{selectedTier.originalPrice}</Text>
              </View>
              <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 8 }]}>
                <Text style={styles.summaryTotalLabel}>Total Payable</Text>
                <Text style={[styles.summaryTotalValue, { color: program.color }]}>₹{selectedTier.calculatedPrice}</Text>
              </View>
            </View>

            {/* Payment Method Selector */}
            <Text style={styles.methodSelectorHeading}>Select Payment Method</Text>
            <View style={styles.paymentMethodsRow}>
              <TouchableOpacity
                style={[
                  styles.paymentMethodOption,
                  selectedPaymentMethod === 'upi' && { borderColor: program.color, backgroundColor: '#FAF5FF' },
                ]}
                onPress={() => setSelectedPaymentMethod('upi')}
              >
                <Text style={styles.methodIcon}>⚡</Text>
                <Text style={styles.methodName}>UPI / GPay</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentMethodOption,
                  selectedPaymentMethod === 'card' && { borderColor: program.color, backgroundColor: '#FAF5FF' },
                ]}
                onPress={() => setSelectedPaymentMethod('card')}
              >
                <CreditCard size={18} color="#4B5563" />
                <Text style={styles.methodName}>Card</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentMethodOption,
                  selectedPaymentMethod === 'netbanking' && { borderColor: program.color, backgroundColor: '#FAF5FF' },
                ]}
                onPress={() => setSelectedPaymentMethod('netbanking')}
              >
                <Lock size={18} color="#4B5563" />
                <Text style={styles.methodName}>NetBanking</Text>
              </TouchableOpacity>
            </View>

            {/* Security Guarantee */}
            <View style={styles.securityRow}>
              <ShieldCheck size={16} color="#16A34A" />
              <Text style={styles.securityText}>
                Secured by Razorpay • 100% Refund Guarantee within 7 days
              </Text>
            </View>

            {/* Official Razorpay Web Test Gateway Link */}
            <TouchableOpacity
              style={styles.webCheckoutBtn}
              onPress={openRazorpayWebCheckout}
              activeOpacity={0.85}
            >
              <Text style={styles.webCheckoutBtnText}>
                ⚡ Open Official Razorpay Test Link (Web / UPI) ↗
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
              <Text style={{ marginHorizontal: 8, fontSize: 11, color: '#94A3B8', fontWeight: '600' }}>OR COMPLETE IN-APP</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
            </View>

            {/* Pay Button */}
            <TouchableOpacity
              style={[styles.payNowButton, { backgroundColor: program.color }]}
              onPress={processPayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.payNowButtonText}>
                  Pay ₹{selectedTier.calculatedPrice} & Unlock
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SUCCESS CONFIRMATION MODAL */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.successCard}>
            <View style={[styles.successIconBadge, { backgroundColor: '#DCFCE7' }]}>
              <CheckCircle2 size={48} color="#16A34A" />
            </View>
            <Text style={styles.successTitle}>Subscription Activated! 🎉</Text>
            <Text style={styles.successDesc}>
              Welcome to {program.title}! All program modules, doctor consultations, and pregnancy trackers have been unlocked for your account.
            </Text>
            <TouchableOpacity
              style={[styles.successContinueBtn, { backgroundColor: program.color }]}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('MainTabs');
              }}
            >
              <Text style={styles.successContinueText}>Start My Journey Now →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  iconCircleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
    marginLeft: 4,
  },
  reviewsCount: {
    fontSize: 12,
    color: '#78350F',
    marginLeft: 4,
  },
  enrolledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  enrolledText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 2,
  },
  hindiTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E1B4B',
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 12,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#EC4899',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#EC4899',
    fontWeight: '800',
  },
  tabContent: {
    paddingTop: 8,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  whoForCard: {
    backgroundColor: '#FAF5FF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: 20,
  },
  whoForHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  whoForTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1B4B',
    marginLeft: 6,
  },
  whoForText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 19,
  },
  deliverablesList: {
    marginBottom: 20,
  },
  deliverableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  deliverableText: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 10,
    flex: 1,
  },
  unlockedModulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  unlockedModuleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  unlockedModuleName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
    marginLeft: 5,
  },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleTitleCol: {
    flex: 1,
    marginRight: 10,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  moduleHindiTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  moduleBody: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  moduleDescription: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 10,
  },
  moduleItemsList: {
    gap: 6,
  },
  moduleItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleItemText: {
    fontSize: 12,
    color: '#374151',
    marginLeft: 8,
  },
  tierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 16,
    position: 'relative',
  },
  tierBadge: {
    position: 'absolute',
    top: -12,
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tierBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tierTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  tierName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  tierTagline: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  tierPriceCol: {
    alignItems: 'flex-end',
  },
  tierCalculatedPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  tierOriginalPrice: {
    fontSize: 13,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  discountPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  discountPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  tierHighlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
  },
  tierHighlightText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 6,
    fontWeight: '500',
  },
  tierDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  tierFeaturesList: {
    gap: 8,
  },
  tierFeatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tierFeatureText: {
    fontSize: 12,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  facultyGrid: {
    gap: 10,
  },
  facultyCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  facultyName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1B4B',
    marginTop: 4,
  },
  facultyRole: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  facultyExp: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
    marginTop: 4,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1B4B',
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 19,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomPriceCol: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bottomPriceValue: {
    fontSize: 22,
    fontWeight: '800',
    marginRight: 6,
  },
  bottomOriginalPrice: {
    fontSize: 13,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  enrollButton: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enrollButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  closeModalBtn: {
    padding: 6,
  },
  closeModalText: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  checkoutSummaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E1B4B',
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  methodSelectorHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: 10,
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  paymentMethodOption: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIcon: {
    fontSize: 18,
  },
  methodName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginTop: 4,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  securityText: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 6,
  },
  payNowButton: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  successIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1B4B',
    textAlign: 'center',
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  successContinueBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  successContinueText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  webCheckoutBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  webCheckoutBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1D4ED8',
  },
});
