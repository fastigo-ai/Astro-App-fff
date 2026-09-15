import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { theme } from '~/shared/theme';

const BABIES = [
  { id: '1', familyName: 'Panigrahi', location: '(Bhubaneswar)' },
  { id: '2', familyName: 'Mr. & Mrs. Shekhawat', location: '(Barmer, Rajasthan)' },
  { id: '3', familyName: 'Mr. & Mrs. Sharma', location: '(Gurgaon)' },
];

export const RecentBabies = () => {
  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <View style={styles.line} />
        <Text style={styles.headerText}>RECENTLY DELIVERED ASTRO BABIES</Text>
        <View style={styles.line} />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BABIES.map(baby => (
          <View key={baby.id} style={styles.card}>
            <Image 
              source={require('~/assets/images/baby_cute.png')} 
              style={styles.imagePlaceholder}
              resizeMode="cover"
            />
            <Text style={styles.nameText}>{baby.familyName}</Text>
            <Text style={styles.locationText}>{baby.location}</Text>
          </View>
        ))}
      </ScrollView>

    </View>
  );
};


const { width } = Dimensions.get('window');
// Padding left/right (lg = 24 roughly), margin between cards (lg).
// (width - (padding left + padding right + margin between)) / 2
// Assuming padding lg is 20: (width - 20 - 20 - 20) / 2
const CARD_WIDTH = (width - 60) / 2;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingVertical: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAEAEA',
  },
  headerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.textDark,
    marginHorizontal: theme.spacing.md,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  card: {
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    width: CARD_WIDTH,
  },
  imagePlaceholder: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: CARD_WIDTH / 2, // Circular or rounded depending on design, screenshot has large rounded arch on top
    borderTopLeftRadius: CARD_WIDTH / 2,
    borderTopRightRadius: CARD_WIDTH / 2,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  imgText: {
    color: '#999',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.textDark,
    textAlign: 'center',
  },
  locationText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
