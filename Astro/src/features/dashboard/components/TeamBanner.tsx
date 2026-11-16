import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';

export const TeamBanner = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const handlePress = () => {
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('AboutUs');
    } else {
      (navigation as any).navigate('AboutUs');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.bannerContainer}
        activeOpacity={0.85}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="An Initiative by President & Prime Minister Awardee Team of IITians, Doctors & more.."
      >
        {/* Top Gold Divider */}
        <View style={styles.goldDivider} />

        <View style={styles.content}>
          <Text style={styles.subPrefix}>An Initiative by</Text>
          <Text style={styles.mainTitle}>President & Prime Minister</Text>
          <Text style={styles.awardeeText}>Awardee Team of IITians, Doctors & more..</Text>
        </View>

        {/* Bottom Gold Divider */}
        <View style={styles.goldDivider} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  goldDivider: {
    width: '88%',
    height: 1.5,
    backgroundColor: '#D4AF37', // Gold divider rule
    borderRadius: 1,
    opacity: 0.9,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  subPrefix: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  mainTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1E1B4B',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  awardeeText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#4B5563',
    letterSpacing: 0.2,
  },
});
