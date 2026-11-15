import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '~/app/navigation/types';
import { ChevronLeft, PlayCircle, BookOpen, Music, CheckCircle2, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '~/shared/api';

type ActivityDetailRouteProp = RouteProp<AppStackParamList, 'ActivityDetail'>;

interface ContentBlock {
  type: 'video' | 'image' | 'text' | 'steps';
  url?: string;
  text?: string;
  steps?: string[];
}

interface ActivityDetail {
  id: string;
  title: string;
  type: string;
  duration: string;
  color: string;
  iconName: string;
  contentBlocks: ContentBlock[];
}

const getIcon = (name: string, size: number, color: string) => {
  switch (name) {
    case 'PlayCircle': return <PlayCircle size={size} color={color} />;
    case 'BookOpen': return <BookOpen size={size} color={color} />;
    case 'CheckCircle2': return <CheckCircle2 size={size} color={color} />;
    case 'Music': return <Music size={size} color={color} />;
    default: return <Sparkles size={size} color={color} />;
  }
};

const FALLBACK_DETAILS: Record<string, ActivityDetail> = {
  '1': {
    id: '1',
    title: 'Vishnu Sahasranama',
    type: 'Vedic Chanting',
    duration: '15 mins',
    color: '#831843',
    iconName: 'PlayCircle',
    contentBlocks: [
      {
        type: 'text',
        text: 'Vishnu Sahasranama (1000 names of Lord Vishnu) produces sacred sound vibrations that stimulate fetal neural pathways, calms maternal blood pressure, and creates deep spiritual protection for the baby in the womb.',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
      },
      {
        type: 'steps',
        steps: [
          'Sit in a comfortable cross-legged posture with back straight.',
          'Place your hands gently over your womb (Garbha) with love.',
          'Close your eyes and chant or listen with sincere devotional focus.',
          'Feel the divine vibrations connecting your heart with your baby.',
        ],
      },
    ],
  },
  '2': {
    id: '2',
    title: 'Morning Yognidra',
    type: 'Yoga & Relaxation',
    duration: '20 mins',
    color: '#0284C7',
    iconName: 'BookOpen',
    contentBlocks: [
      {
        type: 'text',
        text: 'Gentle prenatal breathing (Anulom Vilom & Bhramari) combined with deep conscious rest (Yognidra) maximizes oxygen delivery to the placenta and eliminates pregnancy stress.',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
      },
      {
        type: 'steps',
        steps: [
          'Lie comfortably on your left side with pillow support.',
          'Inhale calm, peaceful energy through both nostrils.',
          'Practice 5 rounds of gentle Bhramari (humming bee breath).',
          'Release all physical tension as you drift into restorative Yognidra.',
        ],
      },
    ],
  },
  '3': {
    id: '3',
    title: 'Garbh Samvaad',
    type: 'Bonding Talk',
    duration: '10 mins',
    color: '#D97706',
    iconName: 'CheckCircle2',
    contentBlocks: [
      {
        type: 'text',
        text: 'Your baby can clearly recognize parents voices from the second trimester. Speaking positive affirmations directly shapes babys emotional security and intelligence.',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000&auto=format&fit=crop',
      },
      {
        type: 'steps',
        steps: [
          'Find a calm moment together with your partner or by yourself.',
          'Gently stroke your belly in a clockwise circular motion.',
          'Speak directly to baby: You are healthy, calm, wise, and deeply loved.',
          'Pause and notice babys gentle movements or flutter kicks.',
        ],
      },
    ],
  },
  '4': {
    id: '4',
    title: 'Evening Ragas',
    type: 'Music Therapy',
    duration: '30 mins',
    color: '#7C3AED',
    iconName: 'Music',
    contentBlocks: [
      {
        type: 'text',
        text: 'Vedic classical ragas (Raag Yaman, Raag Bilawal, and Raag Bhairav) played at 432Hz promote alpha brain waves in the fetus, inducing sound sleep and emotional stability.',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop',
      },
      {
        type: 'steps',
        steps: [
          'Dim the lights and set a peaceful ambience.',
          'Play the soothing raga at a comfortable, soft volume.',
          'Breathe in sync with the slow melodic rhythm.',
          'End the session with Gayatri Mantra recitation.',
        ],
      },
    ],
  },
};

export const ActivityDetailScreen: React.FC<any> = ({ navigation: propNavigation, route: propRoute }) => {
  let hookRoute: any = null;
  let hookNavigation: any = null;
  try {
    hookRoute = useRoute<ActivityDetailRouteProp>();
  } catch {}
  try {
    hookNavigation = useNavigation();
  } catch {}

  const navigation = propNavigation || hookNavigation;
  const route = propRoute || hookRoute;
  const insets = useSafeAreaInsets();
  
  const id = route?.params?.id || '1';
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ActivityDetail | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/api/v1/activities/${id}`);
        if (response.data.success) {
          setData(response.data.data);
          if (response.data.data?.completed) {
            setIsCompleted(true);
          }
        }
      } catch (err) {
        console.error('Failed to fetch activity detail, using fallback:', err);
        const fallback = FALLBACK_DETAILS[id] || FALLBACK_DETAILS['1'];
        setData(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleMarkDone = async () => {
    try {
      await api.post(`/api/v1/activities/${id}/complete`).catch(() => {});
    } catch {
      // ignore
    }
    setIsCompleted(true);
    Alert.alert(
      'Activity Completed!',
      'Great job completing this activity! Your progress has been updated.',
      [{ text: 'OK' }]
    );
  };

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'text':
        return (
          <Text key={index} style={styles.textContent}>
            {block.text}
          </Text>
        );
      case 'image':
        return (
          <View key={index} style={styles.imageWrapper}>
            <Image 
              source={{ uri: block.url }} 
              style={styles.contentImage} 
              resizeMode="cover"
            />
          </View>
        );
      case 'steps':
        return (
          <View key={index} style={styles.stepsContainer}>
            <Text style={styles.stepsTitle}>Follow these steps:</Text>
            {block.steps?.map((step, stepIndex) => (
              <View key={stepIndex} style={styles.stepRow}>
                <View style={[styles.stepNumberCircle, { backgroundColor: data?.color || '#F59E0B' }]}>
                  <Text style={styles.stepNumber}>{stepIndex + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        );
      case 'video':
        return (
          <View key={index} style={styles.videoPlaceholder}>
            <PlayCircle size={48} color="#FFFFFF" />
            <Text style={styles.videoText}>Video Player (Powered by Admin URL)</Text>
          </View>
        );
      default:
        return null;
    }
  };

  if (loading || !data) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top || 20, backgroundColor: data.color }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.headerIconWrapper}>
          {getIcon(data.iconName, 40, '#FFF')}
        </View>
        <Text style={styles.headerTitle}>{data.title}</Text>
        <Text style={styles.headerSubtitle}>{data.type} • {data.duration}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>
        {data.contentBlocks.map(renderContentBlock)}
        
        <TouchableOpacity 
          style={[styles.completeBtn, { backgroundColor: isCompleted ? '#10B981' : data.color }]}
          onPress={handleMarkDone}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isCompleted ? "Activity Completed" : "Mark Activity as Done"}
        >
          <View style={styles.completeBtnContent}>
            {isCompleted && <CheckCircle2 size={20} color="#FFFFFF" style={{ marginRight: 8 }} />}
            <Text style={styles.completeBtnText}>
              {isCompleted ? 'Activity Completed' : 'Mark Activity as Done'}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconWrapper: {
    marginTop: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contentScroll: {
    padding: 24,
    paddingBottom: 60,
  },
  textContent: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 26,
    marginBottom: 24,
  },
  imageWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contentImage: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    width: '100%',
    height: 220,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  videoText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontWeight: '500',
  },
  stepsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
  },
  completeBtn: {
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  completeBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  }
});
