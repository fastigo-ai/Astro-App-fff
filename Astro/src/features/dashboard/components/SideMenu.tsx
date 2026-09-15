import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions, ScrollView, TouchableWithoutFeedback, PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { useAuthStore } from '~/store/useAuthStore';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { id: 'profile', icon: '👤', title: 'Your Profile' },
  { id: 'language', icon: '🅰️', title: 'Language' },
  { icon: '🔒', title: 'Change Password' },
  { id: 'notifications', icon: '🔔', title: 'Notifications' },
  { icon: '🖼️', title: 'Upload: Photos/Videos' },
  { id: 'subscription', icon: '💎', title: 'My Subscription' },
  { id: 'contact', icon: '📞', title: 'Contact Us' },
  { id: 'about', icon: 'ℹ️', title: 'About Us' },
  { icon: '📤', title: 'Share the App' },
];

export const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const logout = useAuthStore(state => state.logout);
  const [showModal, setShowModal] = useState(visible);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 15 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < 0) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50 || gestureState.vx < -0.5) {
          onClose(); // Trigger close sequence
        } else {
          // Snap back open
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      slideAnim.setValue(-DRAWER_WIDTH);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowModal(false);
      });
    }
  }, [visible, slideAnim]);

  const overlayOpacity = slideAnim.interpolate({
    inputRange: [-DRAWER_WIDTH, 0],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Modal transparent visible={showModal} onRequestClose={onClose} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.overlayBackground, { opacity: overlayOpacity }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        </Animated.View>
        
        <Animated.View 
          style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
          {...panResponder.panHandlers}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.phoneText}>8320993257</Text>
              <View style={styles.pregnancyPill}>
                <Text style={styles.pregnancyPillText}>Pregnancy Month -</Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuList}>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.menuItem}
                onPress={() => {
                  if (item.id === 'profile') {
                    onClose(); // Close the menu
                    navigation.navigate('ProfileSettings'); // Navigate to the profile page
                  } else if (item.id === 'contact') {
                    onClose();
                    navigation.navigate('Contact');
                  } else if (item.id === 'about') {
                    onClose();
                    navigation.navigate('AboutUs');
                  } else if (item.id === 'notifications') {
                    onClose();
                    navigation.navigate('Notifications');
                  } else if (item.id === 'subscription') {
                    onClose();
                    navigation.navigate('SubscriptionDetails');
                  }
                }}
              >
                <View style={styles.menuIconContainer}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer Section */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.logoutButton} onPress={() => { onClose(); logout(); }}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#1b4d75', // Solid fallback for the gradient
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#95a5a6',
    borderWidth: 3,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: '#FFF',
  },
  userInfo: {
    justifyContent: 'center',
  },
  phoneText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pregnancyPill: {
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  pregnancyPillText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  menuList: {
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuIcon: {
    fontSize: 16,
  },
  menuText: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
  },
  arrowIcon: {
    color: '#FFF',
    fontSize: 20,
    opacity: 0.7,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  logoutButton: {
    backgroundColor: '#9b59b6', // Fallback for the purple-blue gradient
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
