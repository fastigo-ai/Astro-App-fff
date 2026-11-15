import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, Flower2, Mic, Camera, Sparkles, Compass, Puzzle, X, Brain, CheckCircle2 } from 'lucide-react-native';
import { AppStackParamList } from '~/app/navigation/types';

export const QuickToolsSection = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [showPuzzleModal, setShowPuzzleModal] = useState(false);
  const [selectedPuzzleOption, setSelectedPuzzleOption] = useState<number | null>(null);
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  // Common Mom Support Tools for all mothers & all courses
  const TOOLS = [
    {
      id: 'kick-counter',
      title: isHindi ? 'शिशु स्पंदन' : 'Kick Counter',
      subtitle: isHindi ? 'हलचल गिनें' : 'Track movements',
      badge: isHindi ? 'दैनिक' : 'DAILY',
      icon: <Heart size={22} color="#FFF" fill="#FFF" />,
      colors: ['#FDA4AF', '#E11D48'],
      bgColor: '#FFF1F2',
      route: 'KickCounter' as const,
    },
    {
      id: 'garbh-samvad',
      title: isHindi ? 'गर्भ संवाद' : 'Garbh Samvad',
      subtitle: isHindi ? 'शिशु से बातें' : 'Womb talk & audio',
      badge: isHindi ? 'संस्कार' : 'SACRED',
      icon: <Mic size={22} color="#FFF" />,
      colors: ['#FDE68A', '#D97706'],
      bgColor: '#FFFBEB',
      route: 'GarbhSamvad' as const,
    },
    {
      id: 'baby-bump',
      title: isHindi ? 'बेबी बम्प' : 'Baby Bump',
      subtitle: isHindi ? 'यादें संजोएं' : 'Capture memory',
      badge: isHindi ? 'फोटो' : 'PHOTO',
      icon: <Camera size={22} color="#FFF" />,
      colors: ['#F9A8D4', '#EC4899'],
      bgColor: '#FDF2F8',
      route: 'BabyBump' as const,
    },
    {
      id: 'brain-puzzles',
      title: isHindi ? 'ब्रेन पहेलियां' : 'Brain Puzzles',
      subtitle: isHindi ? 'स्मृति व बुद्धिमत्ता' : 'Brain games & IQ',
      badge: isHindi ? 'गेम्स' : 'GAMES',
      icon: <Puzzle size={22} color="#FFF" />,
      colors: ['#A7F3D0', '#059669'],
      bgColor: '#F0FDF4',
      onPress: () => setShowPuzzleModal(true),
    },
    {
      id: 'mood-therapy',
      title: isHindi ? 'मन की शांति' : 'Mood & Calm',
      subtitle: isHindi ? 'प्राणायाम व नाद' : 'Pranayama & peace',
      badge: isHindi ? 'शांति' : 'CALM',
      icon: <Flower2 size={22} color="#FFF" />,
      colors: ['#C4B5FD', '#7C3AED'],
      bgColor: '#FAF5FF',
      route: 'MoodTherapy' as const,
    },
    {
      id: 'garbh-kundli',
      title: isHindi ? 'गर्भ कुंडली' : 'Garbh Kundli',
      subtitle: isHindi ? 'ग्रह व नक्षत्र' : 'Planetary chart',
      badge: isHindi ? 'ज्योतिष' : 'VEDIC',
      icon: <Compass size={22} color="#FFF" />,
      colors: ['#DDD6FE', '#8B5CF6'],
      bgColor: '#F5F3FF',
      route: 'Kundli' as const,
    },
  ];

  const handleToolPress = (tool: typeof TOOLS[0]) => {
    if (tool.onPress) {
      tool.onPress();
      return;
    }
    if (tool.route) {
      const parent = navigation.getParent();
      if (parent) {
        (parent as any).navigate(tool.route);
      } else {
        (navigation as any).navigate(tool.route);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>
          {isHindi ? 'माँ व शिशु का दैनिक जुड़ाव' : 'Maa & Baby Daily Connect'}
        </Text>
        <View style={styles.sparkleBadge}>
          <Sparkles size={12} color="#D97706" />
          <Text style={styles.sparkleBadgeText}>
            {isHindi ? 'दैनिक टूल्स' : 'Daily Routine'}
          </Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        {TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[styles.toolCard, { backgroundColor: tool.bgColor }]}
            activeOpacity={0.82}
            onPress={() => handleToolPress(tool)}
          >
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: tool.colors[1] }]}>
                {tool.icon}
              </View>
              <View style={[styles.badgePill, { backgroundColor: tool.colors[1] }]}>
                <Text style={styles.badgeText}>{tool.badge}</Text>
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {tool.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {tool.subtitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

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
              {/* Daily Riddle Box */}
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

                {/* Options */}
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
                          isSelected && { color: isCorrect ? '#065F46' : '#991B1B', fontWeight: '800' },
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

              {/* Fetal Brain Fact */}
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
    marginTop: 10,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E1B4B',
    letterSpacing: 0.2,
  },
  sparkleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  sparkleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  toolCard: {
    width: '48%',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badgePill: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
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
