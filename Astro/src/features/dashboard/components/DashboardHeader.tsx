import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '~/shared/theme';

interface DashboardHeaderProps {
  onOpenMenu?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenMenu }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={onOpenMenu}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      <View style={styles.centerContainer}>
        <Image 
          source={require('~/assets/images/logo.png')} 
          style={styles.logoImage} 
          resizeMode="contain" 
        />
        <Text style={styles.logoSubtitle}>India's Most Trusted Garbh Sanskar App.</Text>
      </View>

      {/* Invisible spacer to keep logo centered */}
      <View style={{ width: 40 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: '#FFFFFF', // Changed to white to seamlessly blend with the logo's white background
  },
  menuButton: {
    padding: theme.spacing.sm,
  },
  menuIcon: {
    fontSize: 24,
    color: theme.colors.textDark,
  },
  centerContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 160,
    height: 40,
  },
  logoSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#34495E',
    marginTop: 2,
  },
});
