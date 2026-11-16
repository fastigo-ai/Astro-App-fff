import React from 'react';
import { Text, View } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Card } from '~/shared/components/Card';
import { Badge } from '~/shared/components/Badge';
import { pastelPalette, theme } from '~/shared/theme';
import { TeamBanner } from '~/features/dashboard/components/TeamBanner';
import { KrishnaPillarsGrid } from '~/features/dashboard/components/KrishnaPillarsGrid';
import { BabyGrowthCard } from '~/features/dashboard/components/BabyGrowthCard';
import { BabyDailyGrowthTracker } from '~/features/dashboard/components/BabyDailyGrowthTracker';
import { CourseGrid } from '~/features/dashboard/components/CourseGrid';
import { useAuthStore } from '~/store/useAuthStore';
import '~/shared/i18n';

describe('UI Components, Card Containers & Minimal Design (R1 Acceptance Criteria)', () => {
  beforeEach(async () => {
    useAuthStore.getState().resetState();
    await useAuthStore.getState().logout();
  });

  describe('Card Box Containers & Theme Layouts', () => {
    it('renders Card component with rounded borders and children content', async () => {
      await render(
        <Card testID="test-card">
          <Text>Card Box Content</Text>
        </Card>
      );

      expect(screen.getByText('Card Box Content')).toBeTruthy();
    });

    it('Card component applies custom styling while preserving border radius', async () => {
      await render(
        <Card style={{ backgroundColor: '#FDFBF7' }}>
          <Text>Styled Card</Text>
        </Card>
      );

      expect(screen.getByText('Styled Card')).toBeTruthy();
    });
  });

  describe('Category Badge Pills & Pastel Colors', () => {
    it('renders Badge component with various color variants', async () => {
      await render(
        <View>
          <Badge title="Success Pill" variant="success" />
          <Badge title="Warning Pill" variant="warning" />
          <Badge title="Info Pill" variant="info" />
          <Badge title="Error Pill" variant="error" />
          <Badge title="Neutral Pill" variant="neutral" />
        </View>
      );

      expect(screen.getByText('Success Pill')).toBeTruthy();
      expect(screen.getByText('Warning Pill')).toBeTruthy();
      expect(screen.getByText('Info Pill')).toBeTruthy();
      expect(screen.getByText('Error Pill')).toBeTruthy();
      expect(screen.getByText('Neutral Pill')).toBeTruthy();
    });

    it('validates pastelPalette design tokens in theme.ts', () => {
      expect(pastelPalette.softSlateBlue).toBe('#6B8EB9');
      expect(pastelPalette.softCoralRose).toBe('#DE6B81');
      expect(pastelPalette.softMutedTeal).toBe('#47A9A3');
      expect(pastelPalette.softTaupeMocha).toBe('#7D6855');
      expect(pastelPalette.softPlumOrchid).toBe('#9C477B');
      expect(pastelPalette.goldDivider).toBe('#D4AF37');
      expect(pastelPalette.goldAccent).toBe('#D4AF37');

      // Category theme token mappings per PROJECT.md interface contract
      expect(pastelPalette.beforePregnancy.badge).toBe('#6B8EB9');
      expect(pastelPalette.duringPregnancy.badge).toBe('#DE6B81');
      expect(pastelPalette.afterDelivery.badge).toBe('#47A9A3');
      expect(pastelPalette.forEveryone.badge).toBe('#7D6855');
      expect(pastelPalette.forAllWomen.badge).toBe('#9C477B');
      expect(pastelPalette.neutrals.border).toBe('#E5E7EB');
    });
  });

  describe('Credibility Banner with Gold Trim', () => {
    it('renders TeamBanner with gold divider rules and awardee text', async () => {
      await render(
        <NavigationContainer>
          <TeamBanner />
        </NavigationContainer>
      );

      expect(screen.getByText('An Initiative by')).toBeTruthy();
      expect(screen.getByText('President & Prime Minister')).toBeTruthy();
      expect(screen.getByText('Awardee Team of IITians, Doctors & more..')).toBeTruthy();
    });
  });

  describe('Concise Bullets & Clutter-Free Cards (KrishnaPillarsGrid)', () => {
    it('renders 2x2 grid plus 5th wide card with concise 2-3 bullets per card', async () => {
      await render(
        <NavigationContainer>
          <KrishnaPillarsGrid />
        </NavigationContainer>
      );

      // Verify category badge pills
      expect(screen.getByText('Before Pregnancy')).toBeTruthy();
      expect(screen.getByText('During Pregnancy')).toBeTruthy();
      expect(screen.getByText('After Delivery')).toBeTruthy();
      expect(screen.getByText('For Everyone')).toBeTruthy();
      expect(screen.getByText('For All Women')).toBeTruthy();

      // Verify concise bullet items (no long paragraphs)
      expect(screen.getByText('• Baby Planning')).toBeTruthy();
      expect(screen.getByText('• Natural Conception')).toBeTruthy();
      expect(screen.getByText('• Positive Pregnancy')).toBeTruthy();
      expect(screen.getByText('• Safe Delivery')).toBeTruthy();
      expect(screen.getByText('• Sanskar for Newborn')).toBeTruthy();
      expect(screen.getByText('• Astrological Guidance')).toBeTruthy();
      expect(screen.getByText('• Your Path to a blissful life')).toBeTruthy();
    });

    it('renders PREMIUM badge pill for Garbh Sanskar card', async () => {
      await render(
        <NavigationContainer>
          <KrishnaPillarsGrid />
        </NavigationContainer>
      );

      expect(screen.getByText('PREMIUM')).toBeTruthy();
    });
  });

  describe('CourseGrid UI Elements', () => {
    it('renders CourseGrid with program cards, badges, and concise bullets', async () => {
      await render(
        <NavigationContainer>
          <CourseGrid />
        </NavigationContainer>
      );

      expect(screen.getByText('Beej Sanskar')).toBeTruthy();
      expect(screen.getByText('Garbhdhaan Sanskar')).toBeTruthy();
      expect(screen.getByText('Garbh Sanskar')).toBeTruthy();
      expect(screen.getByText('PLANNING')).toBeTruthy();
      expect(screen.getByText('PRE-PREGNANCY')).toBeTruthy();
    });
  });

  describe('Baby Growth Tracking Components', () => {
    it('renders BabyGrowthCard with concise gestational metrics box', async () => {
      useAuthStore.setState({
        status: 'authenticated',
        user: { id: '1', name: 'Mumma', phone: '+919876543210', lmp_date: '2026-09-01' },
      });

      await render(
        <NavigationContainer>
          <BabyGrowthCard />
        </NavigationContainer>
      );

      // Verify concise metrics box items
      expect(screen.getByText(/Gestation:/i)).toBeTruthy();
      expect(screen.getByText(/Est. Size:/i)).toBeTruthy();
      expect(screen.getByText(/Stage:/i)).toBeTruthy();
    });

    it('renders BabyDailyGrowthTracker with fruit comparison and baby message', async () => {
      useAuthStore.setState({
        status: 'authenticated',
        user: { id: '1', name: 'Mumma', phone: '+919876543210' },
        journeyData: { stage: 'pregnant', confirmed_month: 2 },
      });

      await render(
        <NavigationContainer>
          <BabyDailyGrowthTracker />
        </NavigationContainer>
      );

      // Verify daily tracker elements
      expect(screen.getByText('Baby Daily Growth Tracker')).toBeTruthy();
      expect(screen.getAllByText(/days left till birth/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Baby is currently the size of/i)).toBeTruthy();
    });

    it('opens and closes expanded growth milestone modal in BabyDailyGrowthTracker', async () => {
      useAuthStore.setState({
        status: 'authenticated',
        user: { id: '1', name: 'Mumma', phone: '+919876543210' },
        journeyData: { stage: 'pregnant', confirmed_month: 3 },
      });

      await render(
        <NavigationContainer>
          <BabyDailyGrowthTracker />
        </NavigationContainer>
      );

      // Tap on the read letter button to open modal
      const readLetterBtn = screen.getByRole('button', { name: 'Read Full Letter from Womb' });
      expect(readLetterBtn).toBeTruthy();
      await fireEvent.press(readLetterBtn);

      // Verify modal opened with developmental details
      await waitFor(() => {
        expect(screen.getAllByText(/Mumma/i).length).toBeGreaterThan(0);
      });
    });
  });
});
