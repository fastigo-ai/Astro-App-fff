import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  Info,
  Apple,
  Pill,
  Flower2,
  Activity,
  Heart,
  Clock,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface SafetyItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'food' | 'medicine' | 'herbs' | 'activity' | 'skincare';
  status: 'safe' | 'caution' | 'avoid';
  trimesterNote: string;
  explanation: string;
  ayurvedicView?: string;
}

const SAFETY_DATABASE: SafetyItem[] = [
  {
    id: '1',
    name: 'Papaya (Ripe / Yellow)',
    hindiName: 'पका हुआ पपीता',
    category: 'food',
    status: 'safe',
    trimesterNote: 'Safe in all trimesters in moderation',
    explanation: 'Fully ripe yellow papaya is rich in vitamin C, beta-carotene, and dietary fiber that aids digestion. It does not cause uterine spasms.',
    ayurvedicView: 'पका पपीता पाचक व मधुर होता है, पर सीमित मात्रा में ही सेवन करें।',
  },
  {
    id: '2',
    name: 'Papaya (Raw / Green / Unripe)',
    hindiName: 'कच्चा पपीता',
    category: 'food',
    status: 'avoid',
    trimesterNote: 'Strictly avoid in Trimesters 1, 2, and 3',
    explanation: 'Contains concentrated latex and papain enzymes that act as prostaglandins and oxytocin, triggering premature uterine contractions.',
    ayurvedicView: 'कच्चा पपीता गर्भाशय संकोचक और उष्ण वीर्य होता है, गर्भावस्था में वर्जित है।',
  },
  {
    id: '3',
    name: 'Saffron (Kesar Milk)',
    hindiName: 'केसर युक्त दूध',
    category: 'herbs',
    status: 'safe',
    trimesterNote: 'Recommended from 4th month onward (Trimester 2 & 3)',
    explanation: '1-2 pure saffron strands soaked in warm milk aids digestion, elevates maternal mood, regulates blood pressure, and calms anxiety.',
    ayurvedicView: 'केसर सात्विक व मन को प्रसन्न करने वाला है। अत्यधिक मात्रा न लें, केवल 1-2 रेशे पर्याप्त हैं।',
  },
  {
    id: '4',
    name: 'Pineapple (Ananas)',
    hindiName: 'अनानास',
    category: 'food',
    status: 'caution',
    trimesterNote: 'Avoid large quantities in Trimester 1; safe in small portions later',
    explanation: 'Contains bromelain, an enzyme that can theoretically soften the cervix when consumed in massive quantities. A few fresh slices are harmless.',
    ayurvedicView: 'प्रथम तिमाही में अनानास से बचें, बाद में कभी-कभार थोड़ी मात्रा ले सकते हैं।',
  },
  {
    id: '5',
    name: 'Paracetamol (Crocin / Calpol)',
    hindiName: 'पैरासिटामोल',
    category: 'medicine',
    status: 'safe',
    trimesterNote: 'First-line recommended pain/fever reliever across all trimesters',
    explanation: 'Considered the safest antipyretic and mild analgesic in pregnancy when taken at normal prescribed doses (500mg-650mg). Always verify with your doctor.',
    ayurvedicView: 'बुखार होने पर पहले गिलोय या तुलसी का काढ़ा व चिकित्सक का परामर्श लें।',
  },
  {
    id: '6',
    name: 'Ibuprofen / Combiflam / Aspirin (NSAIDs)',
    hindiName: 'आइबुप्रोफेन व दर्द निवारक दवाएं',
    category: 'medicine',
    status: 'avoid',
    trimesterNote: 'Strictly avoid, especially after 20 weeks and in Trimester 3',
    explanation: 'NSAIDs can cause premature closure of the fetal ductus arteriosus (heart blood vessel) and lead to low amniotic fluid levels (oligohydramnios).',
    ayurvedicView: 'गर्भावस्था में रासायनिक पेनकिलर भ्रूण के अंगों पर प्रतिकूल प्रभाव डालते हैं।',
  },
  {
    id: '7',
    name: 'Tender Coconut Water (Nariyal Paani)',
    hindiName: 'नारियल पानी',
    category: 'food',
    status: 'safe',
    trimesterNote: 'Excellent daily drink throughout all 9 months',
    explanation: 'Natural electrolyte powerhouse rich in potassium and magnesium. Eases heartburn, treats morning dehydration, and helps maintain healthy amniotic fluid.',
    ayurvedicView: 'नारियल पानी पित्त शामक, शीतल और गर्भस्थ शिशु की कांति बढ़ाता है।',
  },
  {
    id: '8',
    name: 'Ajwain (Carom Seeds)',
    hindiName: 'अजवाइन',
    category: 'herbs',
    status: 'caution',
    trimesterNote: 'Safe in culinary moderation; avoid concentrated decoctions early on',
    explanation: 'Excellent for severe gas and bloating in late pregnancy. However, large concentrated doses can stimulate pelvic blood flow.',
    ayurvedicView: 'अजवाइन उष्ण होती है। भोजन में तड़के के रूप में सुरक्षित है, अधिक काढ़ा न पिएं।',
  },
  {
    id: '9',
    name: 'Tulsi (Holy Basil) Leaves',
    hindiName: 'तुलसी के पत्ते',
    category: 'herbs',
    status: 'caution',
    trimesterNote: 'Limit to 1-2 leaves occasionally; avoid high concentration',
    explanation: 'Contains eugenol and estragole which in large quantities might stimulate uterine contractions. Small amounts in tea are generally tolerated.',
    ayurvedicView: 'तुलसी उष्ण व तीक्ष्ण होती है, गर्भावस्था में अत्यधिक सेवन से बचें।',
  },
  {
    id: '10',
    name: 'Castor Oil (Arandi ka Tel)',
    hindiName: 'अरंडी का तेल',
    category: 'herbs',
    status: 'avoid',
    trimesterNote: 'Never consume orally during pregnancy without obstetric guidance',
    explanation: 'Causes violent intestinal cramping, severe diarrhea, and unpredictable uterine contractions. High risk of preterm labor and fetal distress.',
    ayurvedicView: 'अरंडी का तेल तीक्ष्ण विरेचक है, बिना वैद्यकीय आदेश के कभी न लें।',
  },
  {
    id: '11',
    name: 'Caffeine (Coffee & Black Tea)',
    hindiName: 'कॉफी व चाय (कैफीन)',
    category: 'food',
    status: 'caution',
    trimesterNote: 'Limit total caffeine to under 200mg per day (~1 cup)',
    explanation: 'Caffeine crosses the placenta. Excessive consumption (>300mg/day) increases risk of low birth weight and jitteriness in baby.',
    ayurvedicView: 'कैफीन वात व पित्त को प्रकुपित करता है, इसके स्थान पर दूध या हर्बल जल लें।',
  },
  {
    id: '12',
    name: 'Air Travel / Flying',
    hindiName: 'हवाई यात्रा',
    category: 'activity',
    status: 'safe',
    trimesterNote: 'Safest between weeks 14 and 34 for uncomplicated pregnancies',
    explanation: 'Commercial cabin pressure is safe for healthy fetuses. Drink plenty of water and walk down the aisle every 60-90 minutes to prevent blood clots.',
    ayurvedicView: 'मध्यम गर्भावस्था में सुखद यात्रा संभव है, पर्याप्त विश्राम व जलयोजन रखें।',
  },
  {
    id: '13',
    name: 'Hot Water Tub / Sauna',
    hindiName: 'सौना व अत्यधिक गर्म पानी का स्नान',
    category: 'activity',
    status: 'avoid',
    trimesterNote: 'Strictly avoid core body hyperthermia in early pregnancy',
    explanation: 'Raising maternal core body temperature above 101°F (38.3°C) for prolonged periods in Trimester 1 increases the risk of neural tube defects.',
    ayurvedicView: 'अति उष्ण स्वेदन गर्भ के लिए हानिकारक है। केवल गुनगुने पानी से ही स्नान करें।',
  },
  {
    id: '14',
    name: 'Retinoids & Vitamin A Skincare',
    hindiName: 'रेटिनॉल व स्किनकेयर केमिकल',
    category: 'skincare',
    status: 'avoid',
    trimesterNote: 'Avoid all oral and topical retinoids/retin-A during pregnancy',
    explanation: 'High doses of vitamin A derivatives have high teratogenic potential linked to fetal craniofacial and cardiovascular birth defects.',
    ayurvedicView: 'रासायनिक क्रीमों के स्थान पर कुमकुमादि तैलम् या नारियल तेल का उपयोग करें।',
  },
  {
    id: '15',
    name: 'Sleeping on Left Side (Left Lateral)',
    hindiName: 'बाईं करवट सोना',
    category: 'activity',
    status: 'safe',
    trimesterNote: 'The gold standard resting position from 20 weeks onward',
    explanation: 'Relieves pressure of the heavy uterus from the inferior vena cava (large vein), optimizing oxygen and nutrient blood flow to the placenta and baby.',
    ayurvedicView: 'वाम कुक्षी शयन (बाईं करवट सोना) जठराग्नि व गर्भ पोषण के लिए सर्वोत्तम है।',
  },
];

export const PregnancySafetyScreen = () => {
  const navigation = useNavigation();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'food' | 'medicine' | 'herbs' | 'activity' | 'skincare'
  >('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Filter items
  const filteredItems = SAFETY_DATABASE.filter(item => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      item.name.toLowerCase().includes(query) ||
      (item.hindiName && item.hindiName.includes(query)) ||
      item.explanation.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const faqs = [
    {
      q: 'Can I eat spicy or sour food while pregnant?',
      a: 'Mild to moderate spices like turmeric, coriander, and cumin are healthy and aid digestion. However, excessive red chilies and very oily sour foods aggravate acid reflux, heartburn, and gastritis. Listen to your body and keep it balanced.',
    },
    {
      q: 'Is it safe to color or dye hair during pregnancy?',
      a: 'Most doctors advise waiting until the second trimester (after week 12) when baby’s vital organs have finished initial formation. Choose ammonia-free, plant-based dyes or highlights where color doesn’t touch the scalp directly.',
    },
    {
      q: 'What should I do if I accidentally ate an unsafe food?',
      a: 'Do not panic. A single small accidental bite of raw papaya, pineapple, or unpasteurized food rarely causes harm. Drink plenty of fresh water or coconut water, monitor for any unusual cramps or spotting, and consult your doctor for peace of mind.',
    },
    {
      q: 'Can I continue dental treatments and dental X-rays?',
      a: 'Yes, dental cleanings, cavity fillings, and urgent treatments are safe. If an X-ray is required, a lead thyroid collar and abdominal apron must be worn to fully shield your belly from radiation.',
    },
    {
      q: 'Is sleeping flat on my back dangerous for baby?',
      a: 'Before 20 weeks, sleeping on your back is harmless. After 20 weeks, the weight of the growing baby compresses the inferior vena cava, which can reduce blood flow and make you feel lightheaded. Place a pillow between your knees and rest on your left side.',
    },
    {
      q: 'Are all herbal teas safe during pregnancy?',
      a: 'Not all herbs are safe. Ginger, peppermint, and chamomile in moderation are soothing. However, herbs like fenugreek tea in high amounts, sage, pennyroyal, and licorice root can stimulate uterine muscle tone and should be avoided.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeft size={26} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Is It Pregnancy Safe?</Text>
          <Text style={styles.headerSubtitle}>
            Food, Medicine, Herbs & Lifestyle Guide
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder={
              isHindi
                ? 'फल, दवा या क्रिया खोजें (उदा. Papaya, Paracetamol)...'
                : 'Search food, medicine, herb, or activity...'
            }
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <XCircle size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {[
            { id: 'all', label: 'All Items', icon: '✨' },
            { id: 'food', label: 'Food & Fruits', icon: '🍎' },
            { id: 'medicine', label: 'Medicines', icon: '💊' },
            { id: 'herbs', label: 'Herbs & Spices', icon: '🌿' },
            { id: 'activity', label: 'Activities', icon: '🏃‍♀️' },
            { id: 'skincare', label: 'Skincare', icon: '💄' },
          ].map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id as any)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 13 }}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat.id && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count & Legend */}
        <View style={styles.legendRow}>
          <Text style={styles.resultsCountText}>
            Showing {filteredItems.length} items
          </Text>
          <View style={styles.legendBadgesGroup}>
            <View style={styles.legendPill}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Safe</Text>
            </View>
            <View style={styles.legendPill}>
              <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.legendText}>Caution</Text>
            </View>
            <View style={styles.legendPill}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendText}>Avoid</Text>
            </View>
          </View>
        </View>

        {/* Items List */}
        {filteredItems.map(item => {
          const isSafe = item.status === 'safe';
          const isAvoid = item.status === 'avoid';
          const isCaution = item.status === 'caution';

          return (
            <View
              key={item.id}
              style={[
                styles.safetyCard,
                isSafe && styles.cardSafeBorder,
                isAvoid && styles.cardAvoidBorder,
                isCaution && styles.cardCautionBorder,
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  {item.hindiName ? (
                    <Text style={styles.cardHindiTitle}>{item.hindiName}</Text>
                  ) : null}
                </View>

                {/* Status Badge */}
                <View
                  style={[
                    styles.statusBadge,
                    isSafe && styles.badgeSafe,
                    isAvoid && styles.badgeAvoid,
                    isCaution && styles.badgeCaution,
                  ]}
                >
                  {isSafe && <CheckCircle2 size={13} color="#059669" />}
                  {isAvoid && <XCircle size={13} color="#DC2626" />}
                  {isCaution && <AlertTriangle size={13} color="#D97706" />}
                  <Text
                    style={[
                      styles.statusBadgeText,
                      isSafe && { color: '#059669' },
                      isAvoid && { color: '#DC2626' },
                      isCaution && { color: '#D97706' },
                    ]}
                  >
                    {isSafe ? 'SAFE' : isAvoid ? 'STRICTLY AVOID' : 'CAUTION'}
                  </Text>
                </View>
              </View>

              {/* Trimester Tag */}
              <View style={styles.trimesterTag}>
                <Clock size={12} color="#64748B" />
                <Text style={styles.trimesterTagText}>{item.trimesterNote}</Text>
              </View>

              {/* Medical Explanation */}
              <Text style={styles.explanationText}>{item.explanation}</Text>

              {/* Ayurvedic Wisdom */}
              {item.ayurvedicView ? (
                <View style={styles.ayurvedicBox}>
                  <Sparkles size={13} color="#92400E" />
                  <Text style={styles.ayurvedicText}>{item.ayurvedicView}</Text>
                </View>
              ) : null}
            </View>
          );
        })}

        {/* Safety Guidelines Cards */}
        <View style={styles.guidelinesSection}>
          <Text style={styles.guidelinesSectionTitle}>
            3 Golden Rules of Pregnancy Nutrition
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.guidelinesScroll}
          >
            <View style={styles.guidelineCard}>
              <View style={styles.guidelineIconCircle}>
                <Text style={{ fontSize: 22 }}>🥗</Text>
              </View>
              <Text style={styles.guidelineTitle}>Fresh & Well-Washed</Text>
              <Text style={styles.guidelineText}>
                Always thoroughly rinse all raw fruits, greens, and vegetables under running water to eliminate toxoplasma parasites and soil residue.
              </Text>
            </View>

            <View style={styles.guidelineCard}>
              <View style={styles.guidelineIconCircle}>
                <Text style={{ fontSize: 22 }}>🍳</Text>
              </View>
              <Text style={styles.guidelineTitle}>Thoroughly Cooked</Text>
              <Text style={styles.guidelineText}>
                Avoid runny eggs, raw sushi, unpasteurized milk, or undercooked meats. Heat eliminates listeria and salmonella bacteria completely.
              </Text>
            </View>

            <View style={styles.guidelineCard}>
              <View style={styles.guidelineIconCircle}>
                <Text style={{ fontSize: 22 }}>🥛</Text>
              </View>
              <Text style={styles.guidelineTitle}>Hydration & Moderation</Text>
              <Text style={styles.guidelineText}>
                Drink 2.5 to 3 liters of clean water and coconut water daily. Everything in moderation supports your baby's optimal development.
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* Frequently Asked Questions */}
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
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
    fontWeight: '500',
  },
  categoriesScroll: {
    gap: 8,
    paddingBottom: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#9333EA',
    borderColor: '#7E22CE',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 2,
  },
  resultsCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  legendBadgesGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  safetyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardSafeBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  cardAvoidBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  cardCautionBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardHindiTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeSafe: {
    backgroundColor: '#ECFDF5',
  },
  badgeAvoid: {
    backgroundColor: '#FEF2F2',
  },
  badgeCaution: {
    backgroundColor: '#FFFBEB',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  trimesterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  trimesterTagText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  explanationText: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
  },
  ayurvedicBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 8,
  },
  ayurvedicText: {
    fontSize: 11.5,
    color: '#92400E',
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  guidelinesSection: {
    marginTop: 14,
    marginBottom: 20,
  },
  guidelinesSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  guidelinesScroll: {
    gap: 12,
  },
  guidelineCard: {
    width: width * 0.65,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  guidelineIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  guidelineTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  guidelineText: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
  },
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
});
