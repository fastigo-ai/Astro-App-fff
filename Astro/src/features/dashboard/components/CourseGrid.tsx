import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image as RNImage } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '~/shared/theme';

const COURSES = [
  {
    id: 'garbhadhaan',
    title: 'Garbhadhaan',
    tag: 'Before Pregnancy',
    points: ['Baby Planning', 'Natural Conception'],
    color: '#4A90E2', // Blue
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=200&fit=crop',
  },
  {
    id: 'garbhsanskar',
    title: 'Garbh Sanskar',
    tag: 'During Pregnancy',
    points: ['Positive Pregnancy', 'Safe Delivery', 'Great Child'],
    color: '#F06292', // Pink
    image: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=200&h=200&fit=crop',
  },
  {
    id: 'balsanskar',
    title: 'Bal Sanskar',
    tag: 'After Delivery',
    points: ['Sanskar for Newborn'],
    color: '#00BCD4', // Teal
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200&h=200&fit=crop',
  },
  {
    id: 'bhavitavyam',
    title: 'Bhavitavyam',
    tag: 'For Everyone',
    points: ['Astrological Guidance', 'Unparalleled'],
    color: '#8D6E63', // Brown
    image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=200&h=200&fit=crop',
  },
];

export const CourseGrid = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      

      <Text style={styles.selectText}>Select Course as Required</Text>

      <View style={styles.grid}>
        {COURSES.map(course => (
          <TouchableOpacity 
            key={course.id} 
            style={styles.card} 
            activeOpacity={0.9}
            onPress={() => {
              if (course.id === 'garbhadhaan') {
                navigation.navigate('Garbhadhaan');
              } else {
                navigation.navigate('Course');
              }
            }}
          >
            <View style={[styles.cardHeader, { backgroundColor: course.color }]}>
              <Text style={styles.cardTag}>{course.tag}</Text>
            </View>
            
            <View style={styles.cardBody}>
              <Text style={[styles.courseTitle, { color: course.color }]}>{course.title}</Text>
              
              <View style={styles.pointsList}>
                {course.points.map((pt, i) => (
                  <Text key={i} style={styles.pointText}>• {pt}</Text>
                ))}
              </View>

              {/* Arrow and Image Placeholder */}
              <View style={styles.cardBottom}>
                <View style={[styles.arrowCircle, { borderColor: course.color }]}>
                  <Text style={[styles.arrowText, { color: course.color }]}>→</Text>
                </View>
              </View>

              <RNImage 
                source={{ uri: course.image }} 
                style={styles.imagePlaceholder} 
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  goldLine: {
    width: '80%',
    height: 1,
    backgroundColor: '#D4AF37', // Gold
    marginVertical: theme.spacing.sm,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textDark,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#333',
    marginVertical: 4,
  },
  headerSubtitle2: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  selectText: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    height: 220,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    position: 'relative',
  },
  cardHeader: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cardTag: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 12,
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  pointsList: {
    minHeight: 50,
    zIndex: 10,
    paddingRight: 45, // Prevent text from overlapping the image
  },
  pointText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  cardBottom: {
    marginTop: 'auto',
    zIndex: 10,
  },
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#CCC',
    fontSize: 12,
  },
  imagePlaceholder: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 90,
    height: 90,
    borderRadius: 16,
    borderTopLeftRadius: 40, // Stylistic curve for solid images
  },
});
