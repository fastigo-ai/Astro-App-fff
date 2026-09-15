import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, Animated } from 'react-native';
import { theme } from '~/shared/theme';
import { useTranslation } from 'react-i18next';

interface InputProps extends TextInputProps {
  label?: string;
  labelTx?: string;
  error?: string;
  errorTx?: string;
}

export const Input: React.FC<InputProps> = ({ label, labelTx, error, errorTx, ...props }) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = React.useRef(new Animated.Value(0)).current;

  const actualLabel = labelTx ? t(labelTx) : label;
  const actualError = errorTx ? t(errorTx) : error;

  React.useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused || !!props.value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, props.value]);

  const labelStyle = {
    top: focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -10],
    }),
    fontSize: focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.textSecondary, theme.colors.primary],
    }),
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, isFocused && styles.inputFocused, !!actualError && styles.inputError]}>
        {actualLabel && <Animated.Text style={[styles.label, labelStyle]}>{actualLabel}</Animated.Text>}
        <TextInput
          style={styles.input}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor="transparent"
          accessibilityLabel={actualLabel || 'Text Input'}
          {...props}
        />
      </View>
      {actualError ? <Text style={styles.errorText} accessibilityRole="alert">{actualError}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    height: 60,
    borderWidth: 1.5,
    borderColor: theme.colors.border || '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
    paddingTop: 12,
  },
  label: {
    position: 'absolute',
    left: theme.spacing.md,
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.sm,
    marginTop: 4,
    marginLeft: 4,
  },
});
