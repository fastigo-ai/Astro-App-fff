import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export const TeamBanner = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  
  // Create an animated value for the bounce
  const bounceValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -8, // bounce up
          duration: 500,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(bounceValue, {
          toValue: 0, // back down
          duration: 500,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, [bounceValue]);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('GiftRedeem')}
      >
        <Image 
          source={require('~/assets/images/hero-2.png')} 
          style={styles.imagePlaceholder}
          resizeMode="cover"
        />
        <Animated.View style={[styles.bannerBanner, { transform: [{ translateY: bounceValue }] }]}>
          <Text style={styles.bannerText}>🎁 TAP TO OPEN GIFT</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16, // padding at the start and end of the scroll view
  },
  card: {
    width: CARD_WIDTH,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative',
    height: 180, 
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#EAEAEA',
  },
  bannerBanner: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#FFF9C4', 
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#F57F17',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  bannerText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F57F17', 
    letterSpacing: 1.5,
  },
});
