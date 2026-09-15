import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import { theme } from '~/shared/theme';

interface CourseFeatureModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
  icon?: string; // Placeholder for icon URL or identifier
}

export const CourseFeatureModal: React.FC<CourseFeatureModalProps> = ({
  visible,
  onClose,
  title,
  content,
  icon,
}) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        {/* Top overlapping icon */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Image source={require('~/assets/images/baby_cute.png')} style={styles.modalIconImage} />
          </View>
        </View>

        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.separator} />
          
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.bodyText}>{content}</Text>
          </ScrollView>
        </View>
      </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    minHeight: '70%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#9b59b6', // Purple border from screenshot
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  iconWrapper: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#9b59b6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  modalIconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closeButton: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  closeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    width: '100%',
    flexShrink: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCC',
    width: '100%',
    marginBottom: 15,
  },
  scrollView: {
    flexShrink: 1,
  },
  bodyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    textAlign: 'justify',
    paddingBottom: 20,
  },
});
