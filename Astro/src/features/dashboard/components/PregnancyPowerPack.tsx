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
  Sparkles,
  GraduationCap,
  HeartHandshake,
  BookMarked,
  X,
  Search,
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

  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [safetySearch, setSafetySearch] = useState('');
  const [showNuskhaModal, setShowNuskhaModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [currentWeight, setCurrentWeight] = useState('62');
  const [savedWeight, setSavedWeight] = useState('62 kg (Healthy Range: 60-65 kg)');

  // 6 Premium Course Tools (Unlocked with Course Purchase)
  const POWER_TOOLS = [
    {
      id: 'safety',
      title: isHindi ? 'खाद्य सुरक्षा' : 'Food Safety',
      icon: <ShieldQuestion size={26} color="#9333EA" />,
      bg: '#F3E8FF',
      action: () => navigation.navigate('PregnancySafety'),
    },
    {
      id: 'weight',
      title: isHindi ? 'वजन ट्रैकर' : 'Weight',
      icon: <Scale size={26} color="#2563EB" />,
      bg: '#EFF6FF',
      action: () => navigation.navigate('WeightTracker'),
    },
    {
      id: 'music',
      title: isHindi ? 'वैदिक संगीत' : 'Vedic Music',
      icon: <Music size={26} color="#059669" />,
      bg: '#ECFDF5',
      action: () => navigation.navigate('MoodTherapy'),
    },
    {
      id: 'nuskha',
      title: isHindi ? 'दादी के नुस्खे' : 'Dadi Nuskhe',
      icon: <Sparkles size={26} color="#D97706" />,
      bg: '#FEF3C7',
      action: () => navigation.navigate('DadiNuskha'),
    },
    {
      id: 'school',
      title: isHindi ? 'डॉक्टर कक्षाएं' : 'Doctor School',
      icon: <GraduationCap size={26} color="#BE185D" />,
      bg: '#FFF1F2',
      action: () => navigation.navigate('LiveSessions'),
    },
    {
      id: 'mamapedia',
      title: isHindi ? 'मामा गाइड' : 'Mama Guide',
      icon: <BookMarked size={26} color="#4F46E5" />,
      bg: '#EEF2FF',
      action: () => navigation.navigate('AllPrograms'),
    },
  ];

  const filteredSafety = PREGNANCY_SAFETY_DB.filter((item) =>
    item.name.toLowerCase().includes(safetySearch.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Section Header */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>
            {isHindi ? 'प्रेग्नेंसी पॉवर पैक 🌸' : 'Pregnancy Power Pack 🌸'}
          </Text>
          <Text style={styles.subtitle}>
            {isHindi
              ? 'आपकी गर्भावस्था को सहज व सुखद बनाने के साधन'
              : 'Essential Tools to Navigate Pregnancy with Ease'}
          </Text>
        </View>

        {/* 4-Column App Icon Grid with Single Text Label */}
        <View style={styles.iconGrid}>
          {POWER_TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolIconItem}
              onPress={tool.action}
              activeOpacity={0.78}
            >
              <View style={[styles.iconBox, { backgroundColor: tool.bg }]}>
                {tool.icon}
              </View>
              <Text style={styles.toolSingleText} numberOfLines={1}>
                {tool.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

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
                placeholder={
                  isHindi
                    ? 'भोजन, फल या दवा खोजें...'
                    : 'Search food, medicine or activity...'
                }
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
                      <View
                        style={[
                          styles.safetyStatusBadge,
                          isSafe && styles.statusSafe,
                          isAvoid && styles.statusAvoid,
                          !isSafe && !isAvoid && styles.statusCaution,
                        ]}
                      >
                        <Text
                          style={[
                            styles.safetyStatusText,
                            isSafe && { color: '#047857' },
                            isAvoid && { color: '#B91C1C' },
                            !isSafe && !isAvoid && { color: '#B45309' },
                          ]}
                        >
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
                  {isHindi
                    ? 'दादी माँ के आयुर्वेदिक नुस्खे'
                    : 'Dadi Home Nuskha (Ayurvedic Care)'}
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
                    ? 'नींबू की शिकंजी में 1 चुटकी भुना जीरा और सेंधा नमक मिलाकर घूंट-घूंट पिएं।'
                    : 'Sip warm water with fresh lemon, pinch of roasted cumin and rock salt.'}
                </Text>
              </View>

              <View style={styles.nuskhaCard}>
                <Text style={styles.nuskhaTitle}>🥛 Acidity & Heartburn / सीने में जलन</Text>
                <Text style={styles.nuskhaBody}>
                  {isHindi
                    ? 'भोजन के 30 मिनट बाद ठंडा दूध या सौंफ व मिश्री का पानी पिएं।'
                    : 'Drink cool milk or fennel seed infused water after meals.'}
                </Text>
              </View>

              <View style={styles.nuskhaCard}>
                <Text style={styles.nuskhaTitle}>
                  🌸 Stretch Marks / कोमल त्वचा व खुजली
                </Text>
                <Text style={styles.nuskhaBody}>
                  {isHindi
                    ? 'रात को नाभि और उदर पर शुद्ध तिल का तेल या देसी घी की हल्की मालिश करें।'
                    : 'Gently massage pure sesame oil or cow ghee over tummy before bedtime.'}
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
              <Text
                style={{
                  fontSize: 13,
                  color: '#374151',
                  marginBottom: 6,
                  fontWeight: '600',
                }}
              >
                {isHindi
                  ? 'अपना वर्तमान वजन (किलो) दर्ज करें:'
                  : 'Enter your current weight (kg):'}
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
                    Alert.alert(
                      'Saved! 🌸',
                      'Your gestational weight progression has been recorded.'
                    );
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
                  ? 'गर्भावस्था में सामान्यतः 10-14 किलो वजन की वृद्धि स्वस्थ मानी जाती है।'
                  : 'A gradual 10-14 kg weight gain over 9 months is normal and optimal.'}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: '#1D4ED8',
                  marginTop: 6,
                }}
              >
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  toolIconItem: {
    width: '30%',
    alignItems: 'center',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  toolSingleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    letterSpacing: 0.1,
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
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    padding: 0,
  },
  modalScroll: {
    maxHeight: 400,
  },
  safetyItemCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  safetyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  safetyItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  safetyStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
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
    fontWeight: '800',
  },
  safetyReasonText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
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
    marginBottom: 6,
  },
  nuskhaBody: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#451A03',
  },
  weightInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
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
    marginTop: 10,
  },
  weightInfoText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#1E40AF',
  },
});
