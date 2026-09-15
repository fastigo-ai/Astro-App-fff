import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '~/shared/theme';
import { useNavigation } from '@react-navigation/native';

export const VideoBanner = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>All Videos of</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.card}>
        <View style={styles.content}>
          <View style={styles.nameTag}>
            <Text style={styles.nameText}>Prof. Vipin Joshi</Text>
          </View>

          <View style={styles.points}>
            <Text style={styles.pointText}>• 5 IIT-JEE Zone Toppers</Text>
            <Text style={styles.pointText}>• 2 IIT-JEE All India Toppers</Text>
            <Text style={styles.pointText}>• Mentor to thousands of Pregnant Ladies across the world</Text>
          </View>

          <TouchableOpacity 
            style={styles.watchLink}
            onPress={() => navigation.navigate('Course')}
          >
            <Text style={styles.watchText}>Watch now ⟶</Text>
          </TouchableOpacity>
        </View>

        <Image 
          source={require('~/assets/images/mentor_prof.png')} 
          style={styles.imagePlaceholder}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerText: {
    fontSize: 16,
    color: theme.colors.textDark,
    marginRight: theme.spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 160,
  },
  content: {
    padding: theme.spacing.lg,
    justifyContent: 'center',
    paddingRight: 150, // Leave space for the absolute image
  },
  nameTag: {
    backgroundColor: '#C2185B', // Deep pink
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: theme.spacing.md,
  },
  nameText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  points: {
    marginBottom: theme.spacing.md,
  },
  pointText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    lineHeight: 14,
  },
  watchLink: {
    marginTop: theme.spacing.sm,
  },
  watchText: {
    color: '#C2185B',
    fontWeight: 'bold',
    fontSize: 12,
  },
  imagePlaceholder: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 140,
    height: '100%',
    backgroundColor: '#FFF0F5',
  },
});
