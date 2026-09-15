import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '~/shared/theme';

export const TrustSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titlePrimary}>Purely Scientific</Text>
        <Text style={styles.titleSecondary}>Proudly Sanatan</Text>
        {/* Placeholder for the saffron flag icon */}
        <View style={styles.flagPlaceholder}>
          <Text style={styles.flagText}>🚩</Text>
        </View>
      </View>

      <Text style={styles.paragraph}>
        Astro Baby Garbh Sanskar is proud of its Authentic Vedic Garbh Sanskar Processes that are carried under the guidance of 'Tapasvi Ved Paathi Brahamins'. It cannot be compared to other fabricated & diluted entertainment activities under the pretense of Garbh Sanskar commonly found on the internet.
      </Text>

      <Text style={styles.paragraph}>
        We are proud of our heritage and the efforts to unify modern medical science with ancient Indian Science.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    position: 'relative',
  },
  titlePrimary: {
    fontSize: 26,
    fontWeight: '900',
    color: '#3B3B6D', // Dark Blue
    fontStyle: 'italic',
  },
  titleSecondary: {
    fontSize: 28,
    fontWeight: '900',
    color: '#E67E22', // Orange/Saffron
    fontStyle: 'italic',
  },
  flagPlaceholder: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  flagText: {
    fontSize: 32,
  },
  paragraph: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
});
