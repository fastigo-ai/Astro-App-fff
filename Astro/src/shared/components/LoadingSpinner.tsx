import React from 'react';
import { View, StyleSheet, ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import { theme } from '~/shared/theme';

interface LoadingSpinnerProps extends ActivityIndicatorProps {
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen, size = 'large', color = theme.colors.primary, ...props }) => {
  const content = <ActivityIndicator size={size} color={color} {...props} />;

  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer} accessibilityRole="progressbar" accessibilityLabel="Loading">
        {content}
      </View>
    );
  }

  return <View accessibilityRole="progressbar" accessibilityLabel="Loading">{content}</View>;
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
