import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, Music, Gamepad2 } from 'lucide-react-native';
import { AppStackParamList } from '~/app/navigation/types';

export const QuickToolsSection = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const TOOLS = [
    {
      id: 'baby-bump',
      title: t('dashboard.babyBump'),
      subtitle: t('dashboard.babyBumpSub'),
      icon: <Camera size={24} color="#FFF" />,
      colors: ['#F9A8D4', '#EC4899'], // Pink gradient-ish
      bgColor: '#FDF2F8'
    },
    {
      id: 'om-chanter',
      title: t('dashboard.omChanter'),
      subtitle: t('dashboard.omChanterSub'),
      icon: <Music size={24} color="#FFF" />,
      colors: ['#FDE047', '#D97706'], // Gold/Amber
      bgColor: '#FFFBEB'
    },
    {
      id: 'mind-games',
      title: t('dashboard.mindGames'),
      subtitle: t('dashboard.mindGamesSub'),
      icon: <Gamepad2 size={24} color="#FFF" />,
      colors: ['#A78BFA', '#7C3AED'], // Purple
      bgColor: '#F5F3FF'
    }
  ];

  const handleToolPress = (id: string) => {
    if (id === 'baby-bump') {
      navigation.navigate('BabyBump');
    } else {
      Alert.alert('Coming Soon!', 'This feature is being developed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('dashboard.dailyEssentials')}</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TOOLS.map((tool) => (
          <TouchableOpacity 
            key={tool.id} 
            style={[styles.toolCard, { backgroundColor: tool.bgColor }]}
            activeOpacity={0.8}
            onPress={() => handleToolPress(tool.id)}
          >
            <View style={[styles.iconBox, { backgroundColor: tool.colors[1] }]}>
              {tool.icon}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{tool.title}</Text>
              <Text style={styles.subtitle}>{tool.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3B3B6D',
    paddingHorizontal: 20,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  toolCard: {
    width: 140,
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  }
});
