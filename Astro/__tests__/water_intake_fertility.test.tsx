import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { WaterIntakeScreen } from '../src/features/interactions/screens/WaterIntakeScreen';
import { FertilityTrackerScreen } from '../src/features/interactions/screens/FertilityTrackerScreen';
import { useAuthStore } from '../src/store/useAuthStore';
import '~/shared/i18n';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
      canGoBack: () => true,
    }),
  };
});

describe('Water Intake & Fertility Tracker Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('WaterIntakeScreen', () => {
    it('renders hydration tracker with goal and quick log buttons', async () => {
      await render(<WaterIntakeScreen />);

      // Title & target
      expect(screen.getByText(/Water Intake & Hydration Tracker|जल सेवन/)).toBeTruthy();
      expect(screen.getByText(/2500 ml/)).toBeTruthy();

      // Quick log buttons
      expect(screen.getByText('+250 ml')).toBeTruthy();
      expect(screen.getByText('+500 ml')).toBeTruthy();

      // Tap +250 ml
      const add250Btn = screen.getByText('+250 ml');
      await fireEvent.press(add250Btn);

      // Benefits section
      expect(screen.getByText(/Replenishes Amniotic Fluid|एम्नियोटिक द्रव/)).toBeTruthy();
      expect(screen.getByText(/Prevents False Contractions|ब्रेक्सटन हिक्स/)).toBeTruthy();
    });
  });

  describe('FertilityTrackerScreen (Beej Sanskar Exclusive)', () => {
    it('shows Beej Sanskar lock banner for non-subscribed users', async () => {
      useAuthStore.setState({
        status: 'authenticated',
        subscribedPrograms: ['garbh_sanskar'],
        activeSubscriptions: {},
      });

      await render(<FertilityTrackerScreen />);

      // Locked paywall banner
      expect(screen.getByText(/Exclusive to Beej Sanskar Subscribers|बीज संस्कार/)).toBeTruthy();
      expect(screen.getByText(/Unlock Beej Sanskar Course →|अनलॉक करें/)).toBeTruthy();
    });

    it('renders 28-day cycle wheel and bottom cards when subscribed or demo active', async () => {
      useAuthStore.setState({
        status: 'authenticated',
        subscribedPrograms: ['garbhadhaan'],
        activeSubscriptions: {
          garbhadhaan: { planName: 'Beej Sanskar', status: 'active' },
        },
      });

      await render(<FertilityTrackerScreen />);

      // Cycle wheel title
      expect(screen.getByText(/28-Day Conception & Ovulation Wheel|ऋतु चक्र/)).toBeTruthy();

      // 4 Phases on the wheel
      expect(screen.getByText(/Menstrual/)).toBeTruthy();
      expect(screen.getByText(/Follicular/)).toBeTruthy();
      expect(screen.getAllByText(/Ovulation/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Luteal Phase/).length).toBeGreaterThan(0);

      // 3 Bottom summary cards
      expect(screen.getByText(/Next Period Expected On|आगामी मासिक धर्म/)).toBeTruthy();
      expect(screen.getByText(/Likely Ovulation|संभावित अंडोत्सर्ग/)).toBeTruthy();
      expect(screen.getByText(/Most Fertile Period|सर्वाधिक उर्वर काल/)).toBeTruthy();
    });
  });
});
