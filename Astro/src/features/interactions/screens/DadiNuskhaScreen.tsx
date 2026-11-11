import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Heart,
  Flower2,
  Clock,
  ShieldCheck,
  Leaf,
  Sun,
  Flame,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Remedy {
  id: string;
  category: 'nausea' | 'acidity' | 'cramps' | 'stretch' | 'digestion' | 'sleep';
  title: string;
  hindiTitle: string;
  symptom: string;
  ingredients: string[];
  preparation: string[];
  dosage: string;
  precautions: string;
}

const REMEDIES: Remedy[] = [
  {
    id: '1',
    category: 'nausea',
    title: 'Lemon, Roasted Cumin & Rock Salt Water',
    hindiTitle: 'नींबू, भुना जीरा व सेंधा नमक जल',
    symptom: 'Morning sickness, metallic taste & sudden vomiting sensation',
    ingredients: [
      '1 glass of lukewarm water',
      'Juice of half fresh lemon',
      '1/4 tsp roasted jeera (cumin) powder',
      'A pinch of Sendha Namak (rock salt)',
    ],
    preparation: [
      'Warm one glass of drinking water until comfortably lukewarm.',
      'Squeeze half a fresh lemon and add freshly roasted cumin powder.',
      'Add a pinch of rock salt and stir gently.',
      'Sip slowly using a teaspoon rather than gulping.',
    ],
    dosage: 'Drink first thing upon waking or whenever nausea strikes.',
    precautions: 'Do not stay on an empty stomach; nibble on 2-3 roasted almonds afterwards.',
  },
  {
    id: '2',
    category: 'acidity',
    title: 'Fennel (Saunf) & Rock Sugar Cooling Nectar',
    hindiTitle: 'सौंफ व मिश्री का शीतल अर्क',
    symptom: 'Severe chest burning, sour burps & throat burning',
    ingredients: [
      '1 tbsp organic green saunf (fennel seeds)',
      '1 tsp crushed Dhaga Mishri (unrefined rock sugar)',
      '1 glass boiled & cooled water',
      'Optional: 2 fresh mint (pudina) leaves',
    ],
    preparation: [
      'Lightly crush fennel seeds and soak in 1 glass of water for 2 hours (or overnight).',
      'Strain the fragrant cooling water into a glass.',
      'Add crushed rock sugar and stir until dissolved.',
      'Sip slowly 30 minutes after major meals.',
    ],
    dosage: '1 glass after lunch and dinner.',
    precautions: 'Avoid lying flat immediately after eating; walk gently for 100 paces.',
  },
  {
    id: '3',
    category: 'cramps',
    title: 'Warm Mustard & Garlic Foot Therapy',
    hindiTitle: 'सरसों के तेल व लहसुन की सेंक मालिश',
    symptom: 'Night calf muscle spasms, tight soles & restless legs',
    ingredients: [
      '2 tbsp pure cold-pressed mustard or sesame oil',
      '2 crushed garlic cloves',
      '1/2 tsp carom seeds (ajwain)',
      'Warm water soak bucket with Epsom/rock salt',
    ],
    preparation: [
      'Heat the oil with garlic and ajwain on low flame until fragrant, then let it cool to warm.',
      'Soak feet in lukewarm rock salt water for 10 minutes to open microcirculation.',
      'Pat dry and gently massage calves upward from heel to knee.',
      'Wear soft cotton socks to lock in warmth before sleep.',
    ],
    dosage: 'Every night before bedtime in Trimester 2 & 3.',
    precautions: 'Never apply deep pressure over the inner ankle bone during pregnancy.',
  },
  {
    id: '4',
    category: 'stretch',
    title: 'Desi Cow Ghee & Virgin Coconut Elixir',
    hindiTitle: 'देसी गौघृत व नारियल तेल पोषण',
    symptom: 'Belly itching, skin tightness & early stretch marks',
    ingredients: [
      '1 tbsp pure A2 Gir Cow Ghee',
      '1 tbsp cold-pressed extra virgin coconut oil',
      '1 drop pure lavender oil (optional, after week 16)',
    ],
    preparation: [
      'Warm the ghee and coconut oil gently between your clean palms.',
      'Massage belly in gentle, loving circular strokes in a clockwise direction.',
      'Allow the natural lipids to deeply penetrate the expanding dermal collagen.',
    ],
    dosage: 'Apply twice daily: after bathing on damp skin, and before bedtime.',
    precautions: 'Do not scratch itchy belly with fingernails; use palm strokes.',
  },
  {
    id: '5',
    category: 'digestion',
    title: 'Munakka & Warm Milk Natural Motility',
    hindiTitle: 'मुनक्का युक्त सुपाच्य दूध',
    symptom: 'Sluggish bowel movements, hard stools & bloating',
    ingredients: [
      '5-6 large seeded Munakka (black raisins)',
      '1 glass pure cow milk (or almond milk)',
      '1/4 tsp organic turmeric (haldi)',
    ],
    preparation: [
      'Slit and remove the inner seeds from munakka raisins.',
      'Boil the raisins in milk on low flame for 5 minutes until soft.',
      'Chew the warm raisins and drink the soothing milk.',
    ],
    dosage: 'Every night 45 minutes before bedtime.',
    precautions: 'Avoid chemical stimulant laxatives which can trigger uterine contractions.',
  },
  {
    id: '6',
    category: 'sleep',
    title: 'Nutmeg & Ashwagandha Night Sleep Balm',
    hindiTitle: 'जायफल व बादाम तैलम मालिश',
    symptom: 'Anxiety, fragmented sleep, racing thoughts & lower back fatigue',
    ingredients: [
      '1/8 tsp (tiny pinch) freshly grated Jaiphal (nutmeg)',
      '1 tsp warm sweet almond oil',
    ],
    preparation: [
      'Mix a tiny pinch of nutmeg in warm almond oil.',
      'Gently rub onto the soles of feet (Padabhyanga) and temples for 3 minutes.',
      'Listen to 432Hz Om Chanting or Garbh Samvad meditation.',
    ],
    dosage: 'Nightly before sleep.',
    precautions: 'Never consume nutmeg in large culinary amounts; topical sole massage is safe.',
  },
];

export const DadiNuskhaScreen = () => {
  const navigation = useNavigation();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [activeCategory, setActiveCategory] = useState<
    'nausea' | 'acidity' | 'cramps' | 'stretch' | 'digestion' | 'sleep'
  >('nausea');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { id: 'nausea', label: 'Morning Sickness', icon: '🍋' },
    { id: 'acidity', label: 'Heartburn & Acidity', icon: '🥛' },
    { id: 'cramps', label: 'Leg Cramps', icon: '🦶' },
    { id: 'stretch', label: 'Stretch Marks', icon: '🌸' },
    { id: 'digestion', label: 'Constipation', icon: '🌿' },
    { id: 'sleep', label: 'Backache & Sleep', icon: '🌙' },
  ];

  const currentRemedy = REMEDIES.find(r => r.category === activeCategory) || REMEDIES[0];

  const faqs = [
    {
      q: 'Are all Ayurvedic home remedies safe in the first trimester?',
      a: 'Gentle, cooling satvik remedies like lemon water, coconut water, saunf, and soaked raisins are completely safe. However, strong heating spices (like large amounts of fenugreek, raw ginger concentrate, or castor oil) must be avoided in early pregnancy.',
    },
    {
      q: 'Can ginger cause excessive internal heat or complications?',
      a: 'A small thin slice of fresh ginger boiled in hot water or tea is clinically safe and relieves nausea. What should be avoided is dry ginger powder (Saunth) in high amounts, which has intense heating (ushna) potency.',
    },
    {
      q: 'Which oil is scientifically best for belly stretch marks?',
      a: 'Pure virgin coconut oil, sweet almond oil, and desi cow ghee are rich in vitamin E, fatty acids, and squalene. Applying on damp skin after bathing locks in hydration and boosts skin elasticity as your bump expands.',
    },
    {
      q: 'How to relieve pregnancy constipation without chemical laxatives?',
      a: 'Drink at least 3 liters of water, eat 4-5 soaked prunes or munakkas daily, include dietary fiber from oats and green vegetables, and take a 20-minute gentle prenatal walk after breakfast.',
    },
    {
      q: 'Can I drink Golden Turmeric Milk (Haldi Doodh) while pregnant?',
      a: 'Yes, 1/4 teaspoon of organic turmeric in warm milk with a pinch of black pepper supports maternal immunity and joint ease. High-potency turmeric supplements should be avoided.',
    },
    {
      q: 'When should I stop home remedies and consult my doctor?',
      a: 'If vomiting is so severe that you cannot keep fluids down for 12 hours (hyperemesis), if heartburn is accompanied by right upper abdominal pain, or if leg swelling is sudden and asymmetrical, consult your doctor immediately.',
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
          <Text style={styles.headerTitle}>Dadi Home Nuskha</Text>
          <Text style={styles.headerSubtitle}>
            Ayurvedic Home Remedies for Pregnancy
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Selector Tabs */}
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
                activeCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(cat.id as any)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 14 }}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryChipText,
                  activeCategory === cat.id && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selected Remedy Detailed Card */}
        <View style={styles.remedyMainCard}>
          <View style={styles.remedyHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.remedyTitle}>{currentRemedy.title}</Text>
              <Text style={styles.remedyHindiTitle}>{currentRemedy.hindiTitle}</Text>
            </View>
            <View style={styles.sparkleBadge}>
              <Sparkles size={16} color="#D97706" />
            </View>
          </View>

          <View style={styles.symptomPill}>
            <Text style={styles.symptomPillLabel}>Best For: </Text>
            <Text style={styles.symptomPillText}>{currentRemedy.symptom}</Text>
          </View>

          {/* Ingredients */}
          <Text style={styles.subHeadingTitle}>🌿 Natural Ingredients Required:</Text>
          <View style={styles.ingredientsBox}>
            {currentRemedy.ingredients.map((ing, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={styles.greenCheckDot} />
                <Text style={styles.ingredientText}>{ing}</Text>
              </View>
            ))}
          </View>

          {/* Preparation Method */}
          <Text style={styles.subHeadingTitle}>👩‍🍳 How to Prepare:</Text>
          <View style={styles.stepsBox}>
            {currentRemedy.preparation.map((step, i) => (
              <View key={i} style={styles.stepItemRow}>
                <View style={styles.stepNumberCircle}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Dosage & Timing */}
          <View style={styles.dosageCard}>
            <Clock size={16} color="#0284C7" />
            <View style={{ flex: 1 }}>
              <Text style={styles.dosageCardTitle}>When & How to Take:</Text>
              <Text style={styles.dosageCardText}>{currentRemedy.dosage}</Text>
            </View>
          </View>

          {/* Precautions */}
          <View style={styles.precautionCard}>
            <AlertCircle size={16} color="#B45309" />
            <View style={{ flex: 1 }}>
              <Text style={styles.precautionCardTitle}>Dadi's Caution:</Text>
              <Text style={styles.precautionCardText}>{currentRemedy.precautions}</Text>
            </View>
          </View>
        </View>

        {/* 3 Golden Sutras of Garbha Ayurveda */}
        <View style={styles.sutrasSection}>
          <Text style={styles.sutrasSectionTitle}>Dadi's 3 Golden Maternal Sutras</Text>

          <View style={styles.sutraCard}>
            <View style={styles.sutraLeftBadge}>
              <Text style={{ fontSize: 22 }}>🍚</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sutraTitle}>Mridu & Laghu (Light Satvik Diet)</Text>
              <Text style={styles.sutraBody}>
                Eat small meals every 2-3 hours. Freshly cooked moong dal, ghee, and seasonal fruits maintain high maternal vitality without causing stomach distress.
              </Text>
            </View>
          </View>

          <View style={styles.sutraCard}>
            <View style={styles.sutraLeftBadge}>
              <Text style={{ fontSize: 22 }}>🧘‍♀️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sutraTitle}>Prasanna Aatma (Joyful Maternal Mind)</Text>
              <Text style={styles.sutraBody}>
                Your emotions directly program your baby's endocrine hormones. Avoid disturbing news, listen to Vedic chants, and stay cheerful.
              </Text>
            </View>
          </View>

          <View style={styles.sutraCard}>
            <View style={styles.sutraLeftBadge}>
              <Text style={{ fontSize: 22 }}>💧</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sutraTitle}>Sheetal Jal (Cooling Hydration)</Text>
              <Text style={styles.sutraBody}>
                Sip water stored in earthen pots (Matka) or boiled with fennel. Keeps body heat (Pitta) low and ensures abundant amniotic fluid.
              </Text>
            </View>
          </View>
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
  categoriesScroll: {
    gap: 8,
    paddingBottom: 14,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#B45309',
    fontWeight: '900',
  },
  remedyMainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  remedyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  remedyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  remedyHindiTitle: {
    fontSize: 12.5,
    color: '#854D0E',
    marginTop: 2,
    fontWeight: '600',
  },
  sparkleBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symptomPill: {
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  symptomPillLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#92400E',
  },
  symptomPillText: {
    fontSize: 11.5,
    color: '#475569',
    flex: 1,
  },
  subHeadingTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
    marginBottom: 8,
  },
  ingredientsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    gap: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greenCheckDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  ingredientText: {
    fontSize: 12.5,
    color: '#334155',
    flex: 1,
  },
  stepsBox: {
    gap: 8,
    marginBottom: 14,
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepNumberCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#B45309',
  },
  stepText: {
    fontSize: 12.5,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
  dosageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  dosageCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },
  dosageCardText: {
    fontSize: 12,
    color: '#0F172A',
    marginTop: 1,
  },
  precautionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  precautionCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  precautionCardText: {
    fontSize: 12,
    color: '#78350F',
    marginTop: 1,
  },
  sutrasSection: {
    marginBottom: 20,
  },
  sutrasSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  sutraCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sutraLeftBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sutraTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  sutraBody: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
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
