import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { theme } from '~/shared/theme';

const { width } = Dimensions.get('window');
// Screen width minus padding on left (20), right (20), and gap (16)
const CARD_WIDTH = (width - 56) / 2;

export const Dignitaries = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.line} />
        <Text style={styles.headerText}>APPRECIATED BY DIGNITARIES</Text>
        <View style={styles.line} />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.card, { backgroundColor: '#F0FBFC' }]}>
          <Text style={styles.title}>Hon. Prime Minister</Text>
          <View style={styles.imagePlaceholder}>
             <Text style={styles.imgText}>[ PM Photo ]</Text>
          </View>
          <View style={styles.bannerBottom}>
            <Text style={styles.bannerText}>Shri. Narendra Modi</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: '#FFF9F0' }]}>
          <Text style={styles.title}>Hon. RSS Chief</Text>
          <View style={styles.imagePlaceholder}>
             <Text style={styles.imgText}>[ RSS Photo ]</Text>
          </View>
          <View style={styles.bannerBottom}>
            <Text style={styles.bannerText}>Shri. Mohan Bhagwat</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.xl,
    backgroundColor: '#FFF',
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
    fontSize: 12,
    color: '#888',
    marginHorizontal: theme.spacing.md,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  card: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 24,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    position: 'absolute',
    top: 16,
    left: 8,
    right: 8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    color: '#333',
    zIndex: 10,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, // space for the title
    marginBottom: 40, // space for the bottom pill
  },
  imgText: {
    color: '#A0AAB5',
    fontSize: 12,
    fontWeight: '600',
  },
  bannerBottom: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  bannerText: {
    color: '#D32F2F', // Red text for name
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
