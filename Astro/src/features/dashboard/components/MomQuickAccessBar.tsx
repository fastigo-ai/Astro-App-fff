import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import {
  Heart,
  Mic,
  Camera,
  Puzzle,
  Flower2,
  Compass,
  Brain,
  X,
  CheckCircle2,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const MomQuickAccessBar: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [showPuzzleModal, setShowPuzzleModal] = useState(false);
  const [selectedPuzzleOption, setSelectedPuzzleOption] = useState<number | null>(null);
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  // The 6 Common Mom Support Tools for 1-Tap Zero-Scroll Access
  const MOM_TOOLS = [
    {
      id: 'kicks',
      label: isHindi ? 'किक काउंटर' : 'Kicks',
      icon: <Heart size={22} color="#E11D48" fill="#E11D48" />,
      bg: '#FFF1F2',
      border: '#FECDD3',
      action: () => {
        const parent = navigation.getParent();
        if (parent) {
          (parent as any).navigate('KickCounter');
        } else {
          (navigation as any).navigate('KickCounter');
        }
      },
    },
    {
      id: 'samvad',
      label: isHindi ? 'गर्भ संवाद' : 'Samvad',
      icon: <Mic size={22} color="#D97706" />,
      bg: '#FFFBEB',
      border: '#FDE68A',
      action: () => {
        const parent = navigation.getParent();
        if (parent) {
          (parent as any).navigate('GarbhSamvad');
        } else {
          (navigation as any).navigate('GarbhSamvad');
        }
      },
    },
    {
      id: 'bump',
      label: isHindi ? 'बेबी बम्प' : 'Bump',
      icon: <Camera size={22} color="#EC4899" />,
      bg: '#FDF2F8',
      border: '#FBCFE8',
      action: () => {
        const parent = navigation.getParent();
        if (parent) {
          (parent as any).navigate('BabyBump');
        } else {
          (navigation as any).navigate('BabyBump');
        }
      },
    },
    {
      id: 'puzzles',
      label: isHindi ? 'पहेलियां' : 'Puzzles',
      icon: <Puzzle size={22} color="#059669" />,
      bg: '#F0FDF4',
      border: '#BBF7D0',
      action: () => setShowPuzzleModal(true),
    },
    {
      id: 'calm',
      label: isHindi ? 'मन शांत' : 'Calm',
      icon: <Flower2 size={22} color="#7C3AED" />,
      bg: '#FAF5FF',
      border: '#E9D5FF',
      action: () => {
        const parent = navigation.getParent();
        if (parent) {
          (parent as any).navigate('MoodTherapy');
        } else {
          (navigation as any).navigate('MoodTherapy');
        }
      },
    },
    {
      id: 'kundli',
      label: isHindi ? 'कुंडली' : 'Kundli',
      icon: <Compass size={22} color="#4F46E5" />,
      bg: '#EEF2FF',
      border: '#C7D2FE',
      action: () => {
        const parent = navigation.getParent();
        if (parent) {
          (parent as any).navigate('Kundli');
        } else {
          (navigation as any).navigate('Kundli');
        }
      },
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MOM_TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.toolItem}
            activeOpacity={0.78}
            onPress={tool.action}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: tool.bg, borderColor: tool.border },
              ]}
            >
              {tool.icon}
            </View>
            <Text style={styles.toolLabel} numberOfLines={1}>
              {tool.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Brainupedia & Puzzles Modal */}
      <Modal
        visible={showPuzzleModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPuzzleModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Brain size={22} color="#059669" />
                <Text style={styles.modalTitle}>
                  {isHindi ? 'दैनिक मस्तिष्क पहेली व गेम्स' : 'Daily Brain Puzzles & IQ Games'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowPuzzleModal(false)}>
                <X size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              <View style={styles.puzzleBox}>
                <View style={styles.puzzleBadgeRow}>
                  <Text style={styles.puzzleTag}>🧠 Today&apos;s Vedic Riddle</Text>
                  <Text style={styles.puzzlePoints}>+20 IQ Points</Text>
                </View>
                <Text style={styles.puzzleQuestion}>
                  {isHindi
                    ? 'मैं सदैव आगे बढ़ता हूँ, कभी पीछे नहीं लौटता। शिशु के विकास और माँ के मातृत्व का साक्षी हूँ। बताओ मैं कौन हूँ?'
                    : 'I always move forward and never turn back. I witness your baby grow and your motherhood bloom. What am I?'}
                </Text>

                {[
                  { id: 0, text: isHindi ? 'A. समय (Time)' : 'A. Time' },
                  { id: 1, text: isHindi ? 'B. हवा (Wind)' : 'B. Wind' },
                  { id: 2, text: isHindi ? 'C. नदी (River)' : 'C. River' },
                ].map((opt) => {
                  const isSelected = selectedPuzzleOption === opt.id;
                  const isCorrect = opt.id === 0;

                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.optionBtn,
                        isSelected && (isCorrect ? styles.optionCorrect : styles.optionWrong),
                      ]}
                      onPress={() => {
                        setSelectedPuzzleOption(opt.id);
                        if (isCorrect) {
                          setPuzzleSolved(true);
                          Alert.alert(
                            isHindi ? 'अद्भुत! सही उत्तर 🌟' : 'Brilliant! Correct Answer 🌟',
                            isHindi
                              ? 'आपने आज की वैदिक पहेली हल कर ली! शिशु के मस्तिष्क में सकारात्मक ऊर्जा प्रवाहित हुई।'
                              : 'You solved today’s puzzle! Stimulating maternal cognitive focus accelerates fetal neural development.'
                          );
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && {
                            color: isCorrect ? '#065F46' : '#991B1B',
                            fontWeight: '800',
                          },
                        ]}
                      >
                        {opt.text}
                      </Text>
                      {isSelected && isCorrect && <CheckCircle2 size={18} color="#059669" />}
                    </TouchableOpacity>
                  );
                })}

                {puzzleSolved && (
                  <View style={styles.solvedCard}>
                    <Text style={styles.solvedText}>
                      🎉 {isHindi ? 'पहेली पूर्ण! +20 प्वाइंट्स अर्जित।' : 'Puzzle Solved! +20 IQ Points Earned.'}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.factCard}>
                <Text style={styles.factTitle}>💡 Fetal Brain Science</Text>
                <Text style={styles.factBody}>
                  {isHindi
                    ? 'जब माँ पहेलियां और तर्कसंगत विचार हल करती है, तो मस्तिष्क में डोपामाइन और न्यूरोट्रांसमीटर सक्रिय होते हैं, जो गर्भस्थ शिशु की एकाग्रता को बढ़ावा देते हैं।'
                    : 'When mothers engage in creative puzzles, it triggers dopamine release and promotes bilateral synapse connections in the developing baby.'}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  toolItem: {
    alignItems: 'center',
    width: 58,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: 5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  modalScroll: {
    marginBottom: 10,
  },
  puzzleBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 14,
  },
  puzzleBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  puzzleTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  puzzlePoints: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  puzzleQuestion: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 14,
  },
  optionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  optionCorrect: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  optionWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  solvedCard: {
    backgroundColor: '#DCFCE7',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  solvedText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  factCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  factTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 4,
  },
  factBody: {
    fontSize: 12,
    lineHeight: 18,
    color: '#78350F',
  },
});
