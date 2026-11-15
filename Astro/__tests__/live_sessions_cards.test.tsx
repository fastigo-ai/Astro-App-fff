import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { LiveSessionsScreen } from '../src/features/course/screens/LiveSessionsScreen';
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

describe('LiveSessionsScreen Themed Cards Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders live class cards with themed badges, doctor names, and action buttons', async () => {
    await render(<LiveSessionsScreen />);

    // Live Classes heading
    expect(screen.getByText(/Live Classes/)).toBeTruthy();

    // Check titles of live classes
    expect(screen.getByText(/Garbh Samvad & Fetal Brain Stimulation/)).toBeTruthy();
    expect(screen.getByText(/Easy Natural Birth & Pelvic Opening Yoga/)).toBeTruthy();

    // Check LIVE overlay badges
    const liveBadges = screen.getAllByText('LIVE');
    expect(liveBadges.length).toBeGreaterThan(0);

    // Check Doctor names
    expect(screen.getAllByText(/Dr\. Anita Joshi/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dr\. Meenakshi Sharma/).length).toBeGreaterThan(0);

    // Check Join Live Class buttons
    const joinButtons = screen.getAllByText(/Join Live Class/);
    expect(joinButtons.length).toBeGreaterThan(0);
  });

  it('switches to Recorded tab and displays recorded cards with theme badges', async () => {
    await render(<LiveSessionsScreen />);

    // Switch to Recorded tab
    const recordedTab = screen.getByText(/Recorded/);
    await fireEvent.press(recordedTab);

    // Check RECORDED overlay badges
    const recordedBadges = screen.getAllByText('RECORDED');
    expect(recordedBadges.length).toBeGreaterThan(0);

    // Check recorded class titles
    expect(screen.getByText(/Spiritual Preparation for Gentle Birth/)).toBeTruthy();
    expect(screen.getByText(/Fetal Communication & Father-Baby Bonding/)).toBeTruthy();

    // Check Watch Recording button
    const watchButtons = screen.getAllByText(/Watch Recording/);
    expect(watchButtons.length).toBeGreaterThan(0);

    // Tap Watch Recording to open modal
    await fireEvent.press(watchButtons[0]);
    expect(screen.getByText(/Tap to Play Lecture/)).toBeTruthy();
  });
});
