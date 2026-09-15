import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '~/shared/theme';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

interface EmptyStateProps {
  titleTx?: string;
  descTx?: string;
  actionTx?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  titleTx = 'components.emptyTitle', 
  descTx = 'components.emptyDesc', 
  actionTx, 
  onAction 
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.iconPlaceholder}>
        <Text style={styles.icon}>📭</Text>
      </View>
      <Text style={styles.title}>{t(titleTx)}</Text>
      <Text style={styles.desc}>{t(descTx)}</Text>
      
      {actionTx && onAction && (
        <Button 
          tx={actionTx} 
          onPress={onAction} 
          variant="outline" 
          style={styles.actionBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  iconPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  desc: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  actionBtn: {
    minWidth: 160,
  },
});
