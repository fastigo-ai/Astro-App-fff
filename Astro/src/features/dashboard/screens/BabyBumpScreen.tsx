import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Alert, ActivityIndicator, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Camera, Sparkles, Image as ImageIcon, Plus } from 'lucide-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { api } from '~/shared/api';
import { useAuthStore } from '~/store/useAuthStore';

const { width } = Dimensions.get('window');
const FRAME_WIDTH = width * 0.4;

const FRAMES = [
  { id: 'floral', name: 'Floral Dreams', bgImage: require('~/assets/images/frame_floral.jpg') },
  { id: 'astro', name: 'Astro Night', bgImage: require('~/assets/images/frame_astro.jpg') },
  { id: 'minimal', name: 'Minimalist White', style: { borderColor: '#FFFFFF', borderWidth: 8, backgroundColor: '#FFFFFF' } },
  { id: 'polaroid', name: 'Vintage Polaroid', style: { borderTopWidth: 8, borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 30, borderColor: '#FFFFFF', backgroundColor: '#FFFFFF' } },
];

export const BabyBumpScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore(state => state.user);

  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0]);
  const [journey, setJourney] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    fetchJourney();
  }, []);

  const fetchJourney = async () => {
    try {
      const res = await api.get('/api/v1/bump/journey');
      if (res.data.success) {
        setJourney(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonth = () => {
    if (!user?.lmp_date) return 1;
    const lmp = new Date(user.lmp_date);
    const diffTime = new Date().getTime() - lmp.getTime();
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const month = Math.ceil(days / 30.44);
    return month > 9 ? 9 : month;
  };

  const handleCapture = () => {
    setShowPermissionModal(true);
  };

  const handleAllowCamera = async () => {
    setShowPermissionModal(false);
    
    try {
      // 1. OPEN REAL CAMERA
      const image = await ImagePicker.openCamera({
        width: 800,
        height: 1000,
        cropping: true,
        includeBase64: true,
        compressImageQuality: 0.8,
      });

      if (!image || !image.data) return;

      // 2. START UPLOADING
      setIsUploading(true);
      
      const res = await api.post('/api/v1/bump/upload', {
        imageBase64: `data:${image.mime};base64,${image.data}`,
        frameType: selectedFrame.id,
        month: calculateMonth(),
        notes: 'Just captured my beautiful bump today! ✨'
      });

      if (res.data.success) {
        setJourney([res.data.data, ...journey]);
        Alert.alert("Beautiful! 📸", "Your memory has been safely stored in your AstroBaby vault!");
      }
    } catch (err: any) {
      if (err.message !== 'User cancelled image selection') {
        Alert.alert("Error", "Could not upload photo. " + (err.message || ''));
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top || 40 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#374151" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bump Diary</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <View style={styles.badgeContainer}>
            <Sparkles size={16} color="#D97706" />
            <Text style={styles.badgeText}>Capture the Magic</Text>
          </View>
          <Text style={styles.heroSubtitle}>Store your beautiful journey safely on our secure cloud. Watch your miracle grow.</Text>
        </View>

        {/* FRAME SELECTION */}
        <Text style={styles.sectionTitle}>1. Choose a Frame Style</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.framesScroll}
          snapToInterval={FRAME_WIDTH + 16} // 16 is the gap
          decelerationRate="fast"
          snapToAlignment="start"
        >
          {FRAMES.map(frame => (
            <TouchableOpacity 
              key={frame.id} 
              activeOpacity={0.8}
              onPress={() => setSelectedFrame(frame)}
              style={[
                styles.frameCard, 
                selectedFrame.id === frame.id && styles.frameCardSelected
              ]}
            >
              {frame.bgImage ? (
                <Image 
                  source={frame.bgImage} 
                  style={[styles.framePreview]} 
                  resizeMode="cover" 
                />
              ) : (
                <View style={[styles.framePreview, frame.style]}>
                  <ImageIcon size={24} color="#D1D5DB" />
                </View>
              )}
              <Text style={[styles.frameName, selectedFrame.id === frame.id && styles.frameNameSelected]}>
                {frame.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* CAPTURE BUTTON */}
        <TouchableOpacity 
          style={styles.captureBtn} 
          activeOpacity={0.8}
          onPress={handleCapture}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Camera size={24} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.captureBtnText}>Capture Photo</Text>
            </>
          )}
        </TouchableOpacity>

        {/* TIMELINE SECTION */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Your Journey So Far</Text>
        
        {loading ? (
          <ActivityIndicator color="#EC4899" style={{ marginTop: 40 }} />
        ) : journey.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No memories yet. Take your first photo today!</Text>
          </View>
        ) : (
          <View style={styles.timeline}>
            {journey.map((item, index) => (
              <View key={item._id} style={styles.timelineItem}>
                {/* Vertical Line */}
                {index !== journey.length - 1 && <View style={styles.timelineLine} />}
                
                {/* Month Dot */}
                <View style={styles.timelineDot}>
                  <Text style={styles.timelineMonth}>M{item.month}</Text>
                </View>

                {/* Photo Card */}
                <View style={styles.timelineContent}>
                  {/* Custom Frame Wrapper */}
                  {(() => {
                    const frameDef = FRAMES.find(f => f.id === item.frameType);
                    
                    if (frameDef?.bgImage) {
                      // Image background frame
                      return (
                        <View style={styles.timelinePhotoWrapper}>
                          <Image source={frameDef.bgImage} style={styles.frameBgImage} />
                          <View style={styles.innerPhotoBox}>
                            <Image source={{ uri: item.imageUrl }} style={styles.timelineImage} resizeMode="cover" />
                          </View>
                        </View>
                      );
                    } else {
                      // CSS style frame
                      return (
                        <View style={[
                          styles.timelinePhotoWrapper, 
                          frameDef?.style
                        ]}>
                          <Image source={{ uri: item.imageUrl }} style={styles.timelineImage} resizeMode="cover" />
                        </View>
                      );
                    }
                  })()}
                  <View style={styles.timelineTextWrapper}>
                    <Text style={styles.timelineDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                    <Text style={styles.timelineNotes}>{item.notes}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      {/* CUSTOM PERMISSION MODAL */}
      <Modal
        visible={showPermissionModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <Camera size={32} color="#EC4899" />
            </View>
            <Text style={styles.modalTitle}>Allow 'AstroBaby' to access your camera?</Text>
            <Text style={styles.modalSubtitle}>
              AstroBaby needs camera access so you can capture beautiful memories of your baby bump journey.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => setShowPermissionModal(false)}
              >
                <Text style={styles.modalBtnCancelText}>Don't Allow</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnAllow]} 
                onPress={handleAllowCamera}
              >
                <Text style={styles.modalBtnAllowText}>Allow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FEF3C7',
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4B5563',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    color: '#B45309',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  framesScroll: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  frameCard: {
    width: FRAME_WIDTH,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  frameCardSelected: {
    borderColor: '#EC4899',
  },
  framePreview: {
    width: FRAME_WIDTH - 24,
    height: (FRAME_WIDTH - 24) * 1.2,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  frameName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  frameNameSelected: {
    color: '#EC4899',
    fontWeight: '800',
  },
  captureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EC4899',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  captureBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  timeline: {
    paddingHorizontal: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 32,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 19,
    top: 40,
    bottom: -40,
    width: 2,
    backgroundColor: '#FCE7F3', // Soft pink line
    zIndex: -1,
  },
  timelineDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EC4899',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  timelineMonth: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  timelinePhotoWrapper: {
    width: '100%',
    aspectRatio: 3/4,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
    overflow: 'hidden', // to keep image inside border if any
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  frameBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  innerPhotoBox: {
    position: 'absolute',
    top: '12%',
    bottom: '12%',
    left: '12%',
    right: '12%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  timelineImage: {
    width: '100%',
    height: '100%',
  },
  timelineTextWrapper: {
    paddingHorizontal: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timelineNotes: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconBox: {
    width: 64,
    height: 64,
    backgroundColor: '#FDF2F8',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalBtnCancelText: {
    color: '#4B5563',
    fontSize: 15,
    fontWeight: '700',
  },
  modalBtnAllow: {
    backgroundColor: '#EC4899',
  },
  modalBtnAllowText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  }
});
