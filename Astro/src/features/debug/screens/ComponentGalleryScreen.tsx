import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '~/shared/theme';

import { Button } from '~/shared/components/Button';
import { Input } from '~/shared/components/Input';
import { Card } from '~/shared/components/Card';
import { Badge } from '~/shared/components/Badge';
import { Modal } from '~/shared/components/Modal';
import { EmptyState } from '~/shared/components/EmptyState';
import { LoadingSpinner } from '~/shared/components/LoadingSpinner';

export const ComponentGalleryScreen = () => {
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const Section = ({ titleTx, children }: { titleTx: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t(titleTx)}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.title}>{t('gallery.title')}</Text>
          <Button 
            tx="gallery.switchLang" 
            variant="outline" 
            onPress={toggleLanguage} 
          />
        </View>

        <Section titleTx="gallery.buttons">
          <Button tx="components.primaryBtn" onPress={() => {}} style={styles.mb} />
          <Button tx="components.secondaryBtn" variant="secondary" onPress={() => {}} style={styles.mb} />
          <Button tx="components.textBtn" variant="text" onPress={() => {}} style={styles.mb} />
          <Button tx="components.loadingBtn" isLoading onPress={() => {}} style={styles.mb} />
        </Section>

        <Section titleTx="gallery.inputs">
          <Input labelTx="auth.email" placeholder="mom@example.com" keyboardType="email-address" />
          <Input labelTx="auth.password" errorTx="common.error" secureTextEntry value="wrongpass" />
        </Section>

        <Section titleTx="gallery.cards">
          <Card>
            <Text style={styles.cardText}>This is a basic card component from our design system.</Text>
          </Card>
        </Section>

        <Section titleTx="gallery.badges">
          <View style={styles.row}>
            <Badge tx="components.activeSubscription" variant="success" style={styles.mr} />
            <Badge tx="components.expiredSubscription" variant="error" style={styles.mr} />
            <Badge tx="components.liveNow" variant="info" />
          </View>
        </Section>

        <Section titleTx="gallery.modals">
          <Button tx="components.openModal" onPress={() => setModalVisible(true)} />
          <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title={t('components.modalTitle')}>
            <Text style={styles.modalText}>{t('components.modalDesc')}</Text>
            <Button tx="common.ok" onPress={() => setModalVisible(false)} />
          </Modal>
        </Section>

        <Section titleTx="gallery.emptyStates">
          <Card>
            <EmptyState 
              titleTx="components.emptyTitle" 
              descTx="components.emptyDesc" 
              actionTx="components.emptyAction" 
              onAction={() => {}} 
            />
          </Card>
        </Section>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loading Spinner</Text>
          <View style={styles.spinnerContainer}>
            <LoadingSpinner />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.lg,
    paddingBottom: 100, // Extra padding for tab bar
  },
  header: {
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  mb: {
    marginBottom: theme.spacing.md,
  },
  mr: {
    marginRight: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardText: {
    color: theme.colors.text,
    lineHeight: 22,
  },
  modalText: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    lineHeight: 22,
  },
  spinnerContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
});
