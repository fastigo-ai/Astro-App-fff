import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '~/shared/theme';
import { useTranslation } from 'react-i18next';

interface BadgeProps {
  title?: string;
  tx?: string;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ title, tx, variant = 'neutral', style }) => {
  const { t } = useTranslation();
  const label = tx ? t(tx) : title;

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { bg: '#C6F6D5', text: '#22543D' };
      case 'error':
        return { bg: '#FED7D7', text: '#822727' };
      case 'warning':
        return { bg: '#FEEBC8', text: '#7B341E' };
      case 'info':
        return { bg: '#BEE3F8', text: '#2A4365' };
      case 'neutral':
      default:
        return { bg: '#E2E8F0', text: '#4A5568' };
    }
  };

  const colors = getVariantStyles();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }, style]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
