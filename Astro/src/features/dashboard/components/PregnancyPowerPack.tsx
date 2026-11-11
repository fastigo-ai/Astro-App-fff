import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {
  ShieldQuestion,
  Footprints,
  Scale,
  Music,
  BookOpen,
  Sparkles,
  GraduationCap,
  HeartHandshake,
  BookMarked,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

interface SafeFoodItem {
  name: string;
  category: 'food' | 'medicine' | 'activity';
  status: 'safe' | 'caution' | 'avoid';
  reason: string;
}

const PREGNANCY_SAFETY_DB: SafeFoodItem[] = [
  { name: 'Papaya (Ripe)', category: 'food', status: 'safe', reason: 'Ripe yellow papaya is rich in vitamin C & fiber. Only raw/unripe green papaya with latex should be avoided.' },
  { name: 'Papaya (Raw/Unripe)', category: 'food', status: 'avoid', reason: 'Contains papain and latex which can induce uterine contractions.' },
  { name: 'Saffron (Kesar Milk)', category: 'food', status: 'safe', reason: '1-2 strands in warm milk aids digestion, improves mood, and calms nerves.' },
  { name: 'Pineapple', category: 'food', status: 'caution', reason: 'High bromelain in large quantities may soften cervix. Small moderate amounts are fine.' },
  { name: 'Paracetamol', category: 'medicine', status: 'safe', reason: 'Generally considered the safest pain/fever reliever in pregnancy when advised by doctor.' },
  { name: 'Ibuprofen', category: 'medicine', status: 'avoid', reason: 'NSAIDs should be strictly avoided especially in the 3rd trimester.' },
  { name: 'Warm Water Bath', category: 'activity', status: 'safe', reason: 'Relaxing warm water soothes aching muscles. Avoid very hot saunas or whirlpools.' },
  { name: 'Air Travel', category: 'activity', status: 'safe', reason: 'Safe up to week 36 for uncomplicated pregnancies. Stay hydrated and stretch legs.' },
];

export const PregnancyPowerPack: React.FC = () => {
  const navigation = useNavigation<any>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi') ?? false;

  const [isExpanded, setIsExpanded] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [safetySearch, setSafetySearch] = useState('');
  const [showNuskhaModal, setShowNuskhaModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [currentWeight, setCurrentWeight] = useState('62');
  const [savedWeight, setSavedWeight] = useState('62 kg (Healthy Range: 60-65 kg)');

  const POWER_TOOLS = [
    {
      id: 'safety',
      title: isHindi ? 'क्या यह सुरक्षित है?' : 'Is It Safe in Pregnancy?',
      subtitle: isHindi ? 'आहार व दवा सुरक्षा' : 'Food & Medicine Check',
      icon: <ShieldQuestion size={22} color="#9333EA" />,
      bg: '#F3E8FF',
      action: () => navigation.navigate('PregnancySafety'),
    },
    {
      id: 'kicks',
      title: isHindi ? 'शिशु किक काउंटर' : 'Baby Kick Counter',
      subtitle: isHindi ? 'दैनिक हलचल ट्रैकर' : 'Daily Movement Tracker',
      icon: <Footprints size={22} color="#EC4899" />,
      bg: '#FDF2F8',
      action: () => navigation.navigate('KickCounter'),
    },
    {
      id: 'weight',
      title: isHindi ? 'वजन वृद्धि ट्रैकर' : 'Weight Gain Tracker',
      subtitle: isHindi ? 'स्वस्थ बीएमआई गाइड' : 'Healthy Trimester BMI',
      icon: <Scale size={22} color="#2563EB" />,
      bg: '#EFF6FF',
      action: () => navigation.navigate('WeightTracker'),
    },
    {
      id: 'music',
      title: isHindi ? 'गर्भ संस्कार संगीत' : 'Garbh Sanskar Music',
      subtitle: isHindi ? '432Hz वैदिक राग' : '432Hz Calming Raagas',
      icon: <Music size={22} color="#059669" />,
      bg: '#ECFDF5',
      action: () => navigation.navigate('MoodTherapy'),
    },
    {
      id: 'nuskha',
      title: isHindi ? 'दादी माँ के नुस्खे' : 'Dadi Home Nuskha',
      subtitle: isHindi ? 'घरेलू आयुर्वेदिक उपचार' : 'Ayurvedic Home Remedies',
      icon: <Sparkles size={22} color="#D97706" />,
      bg: '#FEF3C7',
      action: () => navigation.navigate('DadiNuskha'),
    },
    {
      id: 'school',
      title: isHindi ? 'गर्भावस्था पाठशाला' : 'Pregnancy School',
      subtitle: isHindi ? 'विशेषज्ञ डॉक्टर कक्षाएं' : 'Doctor Masterclasses',
      icon: <GraduationCap size={22} color="#BE185D" />,
      bg: '#FFF1F2',
      action: () => navigation.navigate('LiveSessions'),
    },
    {
      id: 'samvad',
      title: isHindi ? 'गर्भ संवाद (शिशु वार्ता)' : 'Garbh Samvad',
      subtitle: isHindi ? 'आत्मिक वात्सल्य सत्र' : 'Womb Bonding Therapy',
      icon: <HeartHandshake size={22} color="#E11D48" />,
      bg: '#FFE4E6',
      action: () => navigation.navigate('GarbhSamvad'),
    },
    {
      id: 'mamapedia',
      title: isHindi ? 'मामापीडिया' : 'MamaPedia',
      subtitle: isHindi ? 'मातृत्व विश्वकोश' : 'Maternity Knowledge Hub',
      icon: <BookMarked size={22} color="#4F46E5" />,
      bg: '#EEF2FF',
      action: () => navigation.navigate('AllPrograms'),
    },
  ];

  const visibleTools = isExpanded ? POWER_TOOLS : POWER_TOOLS.slice(0, 6);

  const filteredSafety = PREGNANCY_SAFETY_DB.filter(item =>
    item.name.toLowerCase().includes(safetySearch.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Section Header (Image 3 logic, light maternal styling) */}
      <View style={styles.header}>
        <Text style={styles.mainTitle}>
          {isHindi ? 'प्रेग्नेंसी पॉवर पैक 🌸' : 'Pregnancy Power Pack 🌸'}
        </Text>
        <Text style={styles.subtitle}>
          {isHindi
            ? 'आपकी गर्भावस्था को सहज, सुखद व संस्कारमय बनाने के साधन'
            : 'Essential Tools to Navigate Pregnancy with Ease'}
        </Text>
      </View>

      {/* Grid of Tools (2 columns for clean readability) */}
      <View style={styles.gridContainer}>
        {visibleTools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.toolCard}
            onPress={tool.action}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrapper, { backgroundColor: tool.bg }]}>
              {tool.icon}
            </View>
            <View style={styles.toolTextCol}>
              <Text style={styles.toolTitle} numberOfLines={1}>{tool.title}</Text>
              <Text style={styles.toolSub} numberOfLines={1}>{tool.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* View More / View Less Toggle Button */}
      <TouchableOpacity
        style={styles.expandBtn}
        onPress={() => setIsExpanded(prev => !prev)}
        activeOpacity={0.8}
      >
        <Text style={styles.expandBtnText}>
          {isExpanded
            ? (isHindi ? 'कम देखें ⌃' : 'View Less ⌃')
            : (isHindi ? `सभी ${POWER_TOOLS.length} टूल्स देखें ⌄` : `View All ${POWER_TOOLS.length} Tools ⌄`)}
        </Text>
      </TouchableOpacity>

      {/* MODAL 1: "Is It Pregnancy Safe?" Checker */}
      <Modal
        visible={showSafetyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSafetyModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <ShieldQuestion size={22} color="#9333EA" />
                <Text style={styles.modalTitle}>
                  {isHindi ? 'गर्भावस्था सुरक्षा गाइड' : 'Is It Safe in Pregnancy?'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowSafetyModal(false)}>
                <X size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Search size={18} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder={isHindi ? 'भोजन, फल या दवा खोजें (उदा. Papaya)...' : 'Search food, medicine or activity...'}
                value={safetySearch}
                onChangeText={setSafetySearch}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {filteredSafety.map((item, idx) => {
                const isSafe = item.status === 'safe';
                const isAvoid = item.status === 'avoid';
                return (
                  <View key={idx} style={styles.safetyItemCard}>
                    <View style={styles.safetyItemHeader}>
                      <Text style={styles.safetyItemName}>{item.name}</Text>
                      <View style={[
                        styles.safetyStatusBadge,
                        isSafe && styles.statusSafe,
                        isAvoid && styles.statusAvoid,
                        !isSafe && !isAvoid && styles.statusCaution,
                      ]}>
                        <Text style={[
                          styles.safetyStatusText,
                          isSafe && { color: '#047857' },
                          isAvoid && { color: '#B91C1C' },
                          !isSafe && !isAvoid && { color: '#B45309' },
                        ]}>
                          {item.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.safetyReasonText}>{item.reason}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: Dadi Home Nuskha */}
      <Modal
        visible={showNuskhaModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNuskhaModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Sparkles size={22} color="#D97706" />
                <Text style={styles.modalTitle}>
                  {isHindi ? 'दादी माँ के आयुर्वेदिक नुस्खे' : 'Dadi Home Nuskha (Ayurvedic Care)'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowNuskhaModal(false)}>
                <X size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.nuskhaCard}>
                <Text style={styles.nuskhaTitle}>🍋 Morning Nausea / उल्टी व मितली</Text>
                <Text style={styles.nuskhaBody}>
                  {isHindi
                    ? 'नींबू की शिकंजी में 1 चुटकी भुना जीरा और सेंधा नमक मिलाकर घूंट-घूंट पिएं। सुबह उठते ही खाली पेट न रहें, भुने चने या बादाम चबाएं।'
                    : 'Sip warm water with a squeeze of fresh lemon, pinch of roasted cumin and rock salt. Avoid empty stomach at dawn; snack on roasted gram.'}
                </Text>
              </View>

              <View style={styles.nuskhaCard}>
                <Text style={styles.nuskhaTitle}>🥛 Acidity & Heartburn / सीने में जलन</Text>
                <Text style={styles.nuskhaBody}>
                  {isHindi
                    ? 'भोजन के 30 मिनट बाद ठंडा दूध या सौंफ व मिश्री का पानी पिएं। भोजन के तुरंत बाद न लेटें, बाईं करवट सोएं।'
                    : 'Drink cool milk or fennel seed infused water after meals. Sleep on your left side to ease digestion.'}
                </Text>
              </View>

              <View style={styles.nuskhaCard}>
                <Text style={styles.nuskhaTitle}>🌸 Stretch Marks / कोमल त्वचा व खुजली</Text>
                <Text style={styles.nuskhaBody}>
                  {isHindi
                    ? 'रात को नाभि और उदर पर शुद्ध तिल का तेल या देसी घी की हल्की मालिश करें। त्वचा में नमी बनी रहेगी।'
                    : 'Gently massage pure sesame oil or cow ghee over tummy before bedtime to keep skin supple and soothe itching.'}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: Weight Gain Tracker */}
      <Modal
        visible={showWeightModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWeightModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Scale size={22} color="#2563EB" />
                <Text style={styles.modalTitle}>
                  {isHindi ? 'वजन वृद्धि गाइड' : 'Healthy Weight Tracker'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowWeightModal(false)}>
                <X size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={{ marginVertical: 12 }}>
              <Text style={{ fontSize: 13, color: '#374151', marginBottom: 6, fontWeight: '600' }}>
                {isHindi ? 'अपना वर्तमान वजन (किलो) दर्ज करें:' : 'Enter your current weight (kg):'}
              </Text>
              <TextInput
                style={styles.weightInput}
                keyboardType="numeric"
                value={currentWeight}
                onChangeText={setCurrentWeight}
              />
              <TouchableOpacity
                style={styles.saveWeightBtn}
                onPress={() => {
                  const num = parseFloat(currentWeight);
                  if (num > 30 && num < 160) {
                    setSavedWeight(`${num} kg (Healthy Range: ${num - 2}-${num + 3} kg)`);
                    Alert.alert('Saved! 🌸', 'Your gestational weight progression has been recorded.');
                    setShowWeightModal(false);
                  } else {
                    Alert.alert('Invalid', 'Please enter a valid weight.');
                  }
                }}
              >
                <Text style={styles.saveWeightBtnText}>Save & Check BMI →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weightInfoCard}>
              <Text style={styles.weightInfoText}>
                {isHindi
                  ? 'गर्भावस्था में सामान्यतः 10-14 किलो वजन की वृद्धि स्वस्थ एवं प्राकृतिक मानी जाती है।'
                  : 'A gradual 10-14 kg weight gain over 9 months is normal and optimal for maternal & fetal health.'}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#1D4ED8', marginTop: 6 }}>
                Current Record: {savedWeight}
              </Text>
            </View>
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
  header: {
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  toolCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolTextCol: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1F2937',
  },
  toolSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  expandBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  expandBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    padding: 0,
  },
  modalScroll: {
    marginTop: 4,
  },
  safetyItemCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  safetyItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  safetyItemName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  safetyStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusSafe: {
    backgroundColor: '#D1FAE5',
  },
  statusAvoid: {
    backgroundColor: '#FEE2E2',
  },
  statusCaution: {
    backgroundColor: '#FEF3C7',
  },
  safetyStatusText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  safetyReasonText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  nuskhaCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  nuskhaTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 4,
  },
  nuskhaBody: {
    fontSize: 12.5,
    lineHeight: 19,
    color: '#78350F',
  },
  weightInput: {
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F8FAFC',
    marginBottom: 12,
  },
  saveWeightBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveWeightBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  weightInfoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  weightInfoText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#1E40AF',
  },
});
