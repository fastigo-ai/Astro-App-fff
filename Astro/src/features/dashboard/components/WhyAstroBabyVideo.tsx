import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Video from 'react-native-video';
import { PlayCircle } from 'lucide-react-native';
import { useScrollStore } from '~/store/useScrollStore';

const { width, height: windowHeight } = Dimensions.get('window');

export const WhyAstroBabyVideo = () => {
  const [isPaused, setIsPaused] = useState(true);
  const [componentY, setComponentY] = useState(0);
  const videoRef = useRef<Video>(null);
  
  const scrollY = useScrollStore(state => state.scrollY);

  useEffect(() => {
    // If we haven't measured the component yet, do nothing
    if (componentY === 0) return;

    // Calculate if component is in the viewport (with a 200px buffer)
    const isInView = 
      scrollY + windowHeight > componentY + 200 && 
      scrollY < componentY + 200;

    // Auto-play if in view, pause if out of view
    setIsPaused(!isInView);
  }, [scrollY, componentY]);

  const togglePlay = () => {
    setIsPaused(!isPaused);
  };

  return (
    <View 
      style={styles.container}
      onLayout={(e) => setComponentY(e.nativeEvent.layout.y)}
    >
      <Text style={styles.title}>Why Choose AstroBaby?</Text>
      <Text style={styles.subtitle}>Discover the science and soul behind our approach.</Text>

      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={togglePlay}
        style={styles.videoContainer}
      >
        <Video
          ref={videoRef}
          source={require('~/assets/videos/why.mp4')}
          style={styles.video}
          resizeMode="cover"
          paused={isPaused}
          repeat={true}
        />
        
        {isPaused && (
          <View style={styles.overlay}>
            <PlayCircle size={64} color="#FFF" strokeWidth={1.5} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: '#FAF9F6',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#3B3B6D',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  videoContainer: {
    width: width - 40,
    height: (width - 40) * (9 / 16), // 16:9 aspect ratio
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
