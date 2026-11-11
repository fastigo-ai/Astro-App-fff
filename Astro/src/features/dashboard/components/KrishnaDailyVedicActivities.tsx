import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { Play, CheckCircle2, Music, Sun, Sparkles, BookOpen, Heart, Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const KrishnaDailyVedicActivities = () => {
  const navigation = useNavigation<NavigationProp>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const [completedList, setCompletedList] = useState<string[]>(['act_1']);

  const ACTIVITIES = [
    {
      id: 'act_1',
      time: '07:00 AM',
      title: isHindi ? 'प्रातः स्मरण एवं शांति पाठ' : 'Pratah Smaran & Morning Shloka',
      subtitle: isHindi ? 'शिशु के साथ पावन शुरुआत' : 'Sacred sunrise Vedic chanting',
      duration: '10 min',
      icon: <Sun size={18} color="#D97706" />,
      iconBg: '#FEF3C7',
      category: isHindi ? 'दैनिक मंत्र' : 'Mantra',
    },
    {
      id: 'act_2',
      time: '10:30 AM',
      title: isHindi ? 'गर्भ संवाद (आज का पावन संवाद)' : 'Garbh Samvad: Daily Womb Talk',
      subtitle: isHindi ? 'शिशु को प्रेम व संस्कार का संदेश' : 'Deep soul-to-soul womb conversation',
      duration: '12 min',
      icon: <Heart size={18} color="#E11D48" />,
      iconBg: '#FFE4E6',
      category: isHindi ? 'गर्भ संवाद' : 'Womb Talk',
      route: 'GarbhSamvad' as const,
    },
    {
      id: 'act_3',
      time: '01:00 PM',
      title: isHindi ? 'राग यमन व 432Hz नाद चिकित्सा' : 'Raag Yaman & 432Hz Healing Music',
      subtitle: isHindi ? 'शिशु के तंत्रिका तंत्र का विकास' : 'Harmonic frequencies for fetal brain',
      duration: '15 min',
      icon: <Music size={18} color="#7C3AED" />,
      iconBg: '#F3E8FF',
      category: isHindi ? 'संगीत चिकित्सा' : 'Raaga Therapy',
      route: 'MoodTherapy' as const,
    },
    {
      id: 'act_4',
      time: '04:30 PM',
      title: isHindi ? 'गर्भिणी सूक्ष्म व्यायाम व ध्यान' : 'Pregnancy Yoga & Breathwork',
      subtitle: isHindi ? 'आसान प्रसव हेतु सुरक्षित आसन' : 'Gentle pelvic floor & relaxation',
      duration: '18 min',
      icon: <Sparkles size={18} color="#059669" />,
      iconBg: '#DCFCE7',
      category: isHindi ? 'योग व ध्यान' : 'Yoga',
    },
    {
      id: 'act_5',
      time: '08:30 PM',
      title: isHindi ? 'पंचतंत्र प्रेरणादायी प्रेरक कथा' : 'Vedic Moral Story & Wisdom',
      subtitle: isHindi ? 'शिशु के अवचेतन मन में सद्गुण' : 'Subconscious virtues & noble values',
      duration: '8 min',
      icon: <BookOpen size={18} color="#2563EB" />,
      iconBg: '#EFF6FF',
      category: isHindi ? 'कथा संस्कार' : 'Story',
    },
  ];

  const handleToggle = (id: string, route?: keyof AppStackParamList) => {
    if (completedList.includes(id)) {
      setCompletedList(prev => prev.filter(x => x !== id));
    } else {
      setCompletedList(prev => [...prev, id]);
      Alert.alert(
        isHindi ? 'संस्कार पूर्ण! 🌸' : 'Activity Completed! 🌸',
        isHindi 
          ? 'आपके शिशु को आज के पावन संस्कार का पूर्ण आशीर्वाद प्राप्त हुआ।'
          : 'You earned +20 Garbh Sanskar wellness points today.'
      );
    }
  };

  const handleOpenActivity = (route?: keyof AppStackParamList) => {
    if (!route) {
      const parent = navigation.getParent();
      if (parent) {
        (parent as any).navigate('Course');
      } else {
        (navigation as any).navigate('Course');
      }
      return;
    }
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate(route);
    } else {
      (navigation as any).navigate(route);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerBadge}>
            {isHindi ? 'दैनिक संस्कार दिनचर्या' : 'TODAY’S VEDIC ROUTINE'}
          </Text>
          <Text style={styles.headerTitle}>
            {isHindi ? 'दैनिक गर्भ संस्कार क्रियाएं' : 'Daily Sanskar Activities'}
          </Text>
        </View>
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>
            {completedList.length}/{ACTIVITIES.length} {isHindi ? 'पूर्ण' : 'Done'}
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        {ACTIVITIES.map((act) => {
          const isDone = completedList.includes(act.id);
          return (
            <TouchableOpacity
              key={act.id}
              style={[styles.itemCard, isDone && styles.itemCardDone]}
              activeOpacity={0.88}
              onPress={() => handleOpenActivity(act.route)}
            >
              <View style={[styles.iconBox, { backgroundColor: act.iconBg }]}>
                {act.icon}
              </View>

              <View style={styles.contentCol}>
                <View style={styles.timeCategoryRow}>
                  <Text style={styles.categoryBadge}>{act.category}</Text>
                  <Text style={styles.timeText}>• {act.time}</Text>
                  <Text style={styles.durationText}>⏱ {act.duration}</Text>
                </View>
                <Text style={styles.actTitle} numberOfLines={1}>
                  {act.title}
                </Text>
                <Text style={styles.actSubtitle} numberOfLines={1}>
                  {act.subtitle}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.checkBtn}
                onPress={() => handleToggle(act.id, act.route)}
              >
                <CheckCircle2
                  size={24}
                  color={isDone ? '#16A34A' : '#D1D5DB'}
                  fill={isDone ? '#DCFCE7' : 'transparent'}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  progressPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  list: {
    gap: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  itemCardDone: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCol: {
    flex: 1,
    marginLeft: 12,
  },
  timeCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  categoryBadge: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  durationText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 'auto',
  },
  actTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: 2,
  },
  actSubtitle: {
    fontSize: 11.5,
    color: '#6B7280',
  },
  checkBtn: {
    padding: 4,
    marginLeft: 8,
  },
});
