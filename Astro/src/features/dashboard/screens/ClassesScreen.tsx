import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LiveSessionsScreen } from '~/features/course/screens/LiveSessionsScreen';

export const ClassesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <LiveSessionsScreen isTabMode={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
