import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import Video from 'react-native-video';
import { useAuthStore } from '~/store/useAuthStore';
import { theme } from '~/shared/theme';

import { useNavigation } from '@react-navigation/native';

export const IntroVideoScreen = () => {
  const setHasSeenIntro = useAuthStore(state => state.setHasSeenIntro);
  const navigation = useNavigation<any>();
  const videoRef = useRef<any>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Delay rendering the video by a tick to prevent Bridgeless React Native crash
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = async () => {
    await setHasSeenIntro(true);
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  const handleSkip = async () => {
    await setHasSeenIntro(true);
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {isReady && (
        <Video
          ref={videoRef}
          // NOTE TO USER: 
          // I am using a sample remote video for testing so the app compiles immediately.
          // Once you have your video, put it in src/assets/videos/intro.mp4 and change the source to:
          // source={require('~/assets/videos/intro.mp4')}
          source={require('~/assets/videos/intro.mp4')}
          style={styles.video}
          resizeMode="cover" // Switched back to cover for their actual video
          onEnd={handleVideoEnd}
          // Play automatically
          paused={false}
        />
      )}

      {/* Skip Button floating in the top right */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skipText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
