import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { theme } from '~/shared/theme';
import { api } from '~/shared/api';
import {
  Heart,
  ArrowLeft,
  Sparkles,
  Smile,
  Music,
  CheckCircle2,
  ChevronRight,
  BookOpen,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<AppStackParamList, 'BalSanskar'>;

interface Activity {
  id: string;
  month: number;
  title: string;
  duration: string;
  category: string;
}

export const BalSanskarScreen: React.FC<Props> = ({ navigation }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBalSanskar();
  }, []);

  const fetchBalSanskar = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/v1/krishna/bal-sanskar/details');
      if (res.data?.success && res.data?.activities) {
        setActivities(res.data.activities);
      }
    } catch (e) {
      setActivities([
        { id: 'bs_1', month: 1, title: 'Pratham Sparsh (Sacred Touch & Oil Massage)', duration: '15 mins', category: 'Physical' },
        { id: 'bs_2', month: 2, title: 'Karna Bodh (Gentle Sanskrit Lullabies & Chants)', duration: '12 mins', category: 'Sensory' },
        { id: 'bs_3', month: 3, title: 'Drishti Vikas (High Contrast Visual Tracking)', duration: '10 mins', category: 'Cognitive' },
        { id: 'bs_4', month: 6, title: 'Annaprashan Vidhi & Sattvic Weaning Diet', duration: '20 mins', category: 'Ayurveda' },
        { id: 'bs_5', month: 12, title: 'Bhasha Vikas (Vedic Rhymes & Panchatantra Tales)', duration: '15 mins', category: 'Speech' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = (id: string) => {
    setCompletedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('WelcomeCourseSelection');
            }
          }}
        >
          <ArrowLeft size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bal Sanskar (0 - 2 Years)</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.badgeRow}>
            <Heart size={16} color={theme.colors.primary} />
            <Text style={styles.badgeText}>POSTNATAL NURTURING</Text>
          </View>
          <Text style={styles.bannerTitle}>Infant Vedic Sanskars & Brain Care</Text>
          <Text style={styles.bannerText}>
            Nurture your newborn's physical vitality, emotional security, and sensory intelligence from birth to 24 months.
          </Text>
        </View>

        {/* Milestone Month Picker */}
        <Text style={styles.sectionTitle}>Select Baby's Age (Months)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
          {[1, 2, 3, 4, 6, 9, 12, 18, 24].map(m => (
            <TouchableOpacity
              key={m}
              style={[
                styles.monthChip,
                selectedMonth === m && styles.monthChipActive,
              ]}
              onPress={() => setSelectedMonth(m)}
            >
              <Text
                style={[
                  styles.monthChipText,
                  selectedMonth === m && styles.monthChipTextActive,
                ]}
              >
                {m} {m === 1 ? 'Month' : 'Months'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Daily Activities List */}
        <Text style={styles.sectionTitle}>Daily Infant Milestones & Activities</Text>
        {activities.map((item, idx) => {
          const isDone = completedIds.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.activityCard, isDone && styles.activityCardDone]}
              onPress={() => toggleComplete(item.id)}
            >
              <View style={styles.iconCircle}>
                {idx % 2 === 0 ? (
                  <Music size={20} color={theme.colors.primary} />
                ) : (
                  <Sparkles size={20} color={theme.colors.secondary} />
                )}
              </View>

              <View style={styles.activityInfo}>
                <View style={styles.tagRow}>
                  <Text style={styles.categoryTag}>{item.category}</Text>
                  <Text style={styles.durationTag}>⏱ {item.duration}</Text>
                </View>
                <Text style={styles.activityTitle}>{item.title}</Text>
              </View>

              <TouchableOpacity
                style={styles.checkButton}
                onPress={() => toggleComplete(item.id)}
              >
                <CheckCircle2
                  size={24}
                  color={isDone ? theme.colors.success : '#CBD5E1'}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

        {/* Traditional Vedic Sanskars Section */}
        <View style={styles.sanskarGuideCard}>
          <BookOpen size={22} color={theme.colors.secondary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.guideTitle}>Traditional 16 Sanskars</Text>
            <Text style={styles.guideText}>
              Includes guidance for Jatakarma, Namkaran, Nishkramana, Annaprashan, and Chudakarana ceremonies.
            </Text>
          </View>
          <ChevronRight size={20} color={theme.colors.textSecondary} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.secondary,
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 6,
  },
  bannerText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
    marginTop: 4,
  },
  monthScroll: {
    marginBottom: 20,
  },
  monthChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  monthChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  monthChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  monthChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  activityCardDone: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF5F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.secondary,
    textTransform: 'uppercase',
  },
  durationTag: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  checkButton: {
    padding: 4,
  },
  sanskarGuideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 3,
  },
  guideText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },
});

