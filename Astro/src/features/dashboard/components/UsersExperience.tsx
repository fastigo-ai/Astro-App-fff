import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '~/shared/theme';
import { useNavigation } from '@react-navigation/native';

export const UsersExperience = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <Image 
        source={require('~/assets/images/family_collage.png')} 
        style={styles.collagePlaceholder}
        resizeMode="cover"
      />

      <View style={styles.bannerOverlay}>
        <Text style={styles.title}>USERS EXPERIENCE</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Changed their lives</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.tapBtn} 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Reviews')}
      >
        <Text style={styles.tapBtnText}>TAP HERE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  collagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  collageText: {
    color: '#999',
    fontWeight: 'bold',
  },
  bannerOverlay: {
    marginTop: -40, // overlap the collage
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#3B3B6D', // Dark purplish blue from screenshot
    letterSpacing: 1,
  },
  pill: {
    marginTop: -8, // slight overlap
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  pillText: {
    fontSize: 10,
    color: '#666',
  },
  tapBtn: {
    marginTop: theme.spacing.xl,
    backgroundColor: '#FF8C00', // Orange gradient start
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tapBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
});
