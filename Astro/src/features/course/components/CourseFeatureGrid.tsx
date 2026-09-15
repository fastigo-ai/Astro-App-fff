import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export interface CourseFeature {
  id: string;
  title: string;
  icon?: string;
  description: string;
}

interface CourseFeatureGridProps {
  features: CourseFeature[];
  onReadMore: (feature: CourseFeature) => void;
}

export const CourseFeatureGrid: React.FC<CourseFeatureGridProps> = ({ features, onReadMore }) => {
  return (
    <View style={styles.gridContainer}>
      {features.map((feature) => (
        <View key={feature.id} style={styles.gridItem}>
          <View style={styles.iconContainer}>
            {/* Using a placeholder for all feature icons */}
            <Image source={require('~/assets/images/baby_cute.png')} style={styles.featureImage} />
          </View>
          <Text style={styles.title} numberOfLines={3}>
            {feature.title}
          </Text>
          <TouchableOpacity style={styles.readMoreBtn} onPress={() => onReadMore(feature)}>
            <Text style={styles.readMoreText}>More Read ⌄</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  gridItem: {
    width: '30%', // 3 items per row
    alignItems: 'center',
    marginBottom: 25,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#eee',
  },
  featureImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
    minHeight: 36, // Enough for 3 lines if needed
  },
  readMoreBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 6,
  },
  readMoreText: {
    fontSize: 10,
    color: '#777',
  },
});
