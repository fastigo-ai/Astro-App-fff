import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
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

export const ActivityDetailScreen = () => {
  const route = useRoute<ActivityDetailRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ActivityDetail | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/api/v1/activities/${id}`);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch activity detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

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
        
        <TouchableOpacity style={[styles.completeBtn, { backgroundColor: data.color }]}>
          <Text style={styles.completeBtnText}>Mark Activity as Done</Text>
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
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  }
});
