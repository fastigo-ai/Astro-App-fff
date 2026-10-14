import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, Flower2, Mic, Camera, Sparkles } from 'lucide-react-native';
import { AppStackParamList } from '~/app/navigation/types';

export const QuickToolsSection = () => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const TOOLS = [
    {
      id: 'kick-counter',
      title: isHindi ? 'शिशु स्पंदन' : 'Kick Counter',
      subtitle: isHindi ? 'हलचल गिनें' : 'Track movements',
      badge: isHindi ? 'दैनिक' : 'DAILY',
      icon: <Heart size={24} color="#FFF" fill="#FFF" />,
      colors: ['#FDA4AF', '#E11D48'], // Maternal rose red
      bgColor: '#FFF1F2',
      route: 'KickCounter' as const,
    },
    {
      id: 'mood-therapy',
      title: isHindi ? 'मन की शांति' : 'Mood & Calm',
      subtitle: isHindi ? 'प्राणायाम व नाद' : 'Pranayama & peace',
      badge: isHindi ? 'शांति' : 'CALM',
      icon: <Flower2 size={24} color="#FFF" />,
      colors: ['#C4B5FD', '#7C3AED'], // Gentle lavender
      bgColor: '#FAF5FF',
      route: 'MoodTherapy' as const,
    },
    {
      id: 'garbh-samvad',
      title: isHindi ? 'गर्भ संवाद' : 'Garbh Samvad',
      subtitle: isHindi ? 'शिशु से बातें' : 'Womb talk & audio',
      badge: isHindi ? 'संस्कार' : 'SACRED',
      icon: <Mic size={24} color="#FFF" />,
      colors: ['#FDE68A', '#D97706'], // Warm golden saffron
      bgColor: '#FFFBEB',
      route: 'GarbhSamvad' as const,
    },
    {
      id: 'baby-bump',
      title: isHindi ? 'बेबी बम्प' : 'Baby Bump',
      subtitle: isHindi ? 'यादें संजोएं' : 'Capture memory',
      badge: isHindi ? 'फोटो' : 'PHOTO',
      icon: <Camera size={24} color="#FFF" />,
      colors: ['#F9A8D4', '#EC4899'], // Warm pink
      bgColor: '#FDF2F8',
      route: 'BabyBump' as const,
    },
  ];

  const handleToolPress = (route: keyof AppStackParamList) => {
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate(route);
    } else {
      (navigation as any).navigate(route);
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
            {isHindi ? 'दैनिक अभ्यास' : 'Daily Routine'}
          </Text>
        </View>
      </View>
      
      <View style={styles.gridContainer}>
        {TOOLS.map((tool) => (
          <TouchableOpacity 
            key={tool.id} 
            style={[styles.toolCard, { backgroundColor: tool.bgColor }]}
            activeOpacity={0.8}
            onPress={() => handleToolPress(tool.route)}
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
              <Text style={styles.title} numberOfLines={1}>{tool.title}</Text>
              <Text style={styles.subtitle} numberOfLines={1}>{tool.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3B3B6D',
    letterSpacing: 0.3,
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
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
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
    color: '#6B7280',
    fontWeight: '500',
  }
});
