import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, AccessibilityProps } from 'react-native';
import { theme } from '~/shared/theme';
import { useTranslation } from 'react-i18next';

interface ButtonProps extends AccessibilityProps {
  title?: string;
  tx?: string; // Translation key
  txOptions?: any;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'text' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  tx,
  txOptions,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  ...accessibilityProps
}) => {
  const { t } = useTranslation();
  const i18nText = tx && t ? (t(tx, txOptions) as unknown as string) : title;

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isText = variant === 'text';

  const getBackgroundColor = () => {
    if (disabled && !isText) return '#E2E8F0';
    if (isOutline || isText) return 'transparent';
    if (isSecondary) return theme.colors.secondary;
    return theme.colors.primary;
  };

  const getTextColor = () => {
    if (disabled) return '#A0AEC0';
    if (isOutline) return theme.colors.primary;
    if (isText) return theme.colors.textDark;
    if (isSecondary) return '#FFFFFF';
    return isPrimary ? '#FFFFFF' : theme.colors.primary;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: isLoading }}
      accessibilityLabel={i18nText || 'Button'}
      {...accessibilityProps}
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        isOutline && styles.outline,
        !disabled && !isOutline && !isText && styles.shadow,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{i18nText}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
  },
  text: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  outline: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  shadow: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
