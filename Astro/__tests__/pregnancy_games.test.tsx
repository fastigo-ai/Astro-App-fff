import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { PregnancyGamesScreen } from '../src/features/games/screens/PregnancyGamesScreen';
import '~/shared/i18n';

// Mock navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: jest.fn(),
  }),
}));

describe('PregnancyGamesScreen Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the game arcade header and all 4 game mode tabs', async () => {
    await render(<PregnancyGamesScreen />);
    
    // Header
    expect(screen.getByText(/Mom & Baby Fun Arcade|माँ व शिशु गेम्स/)).toBeTruthy();
    
    // Tabs
    expect(screen.getByTestId('tab-cravings')).toBeTruthy();
    expect(screen.getByTestId('tab-kicks')).toBeTruthy();
    expect(screen.getByTestId('tab-myths')).toBeTruthy();
    expect(screen.getByTestId('tab-memory')).toBeTruthy();
  });

  it('allows starting and interacting with Cravings Rush game', async () => {
    await render(<PregnancyGamesScreen />);
    
    const startBtn = screen.getByTestId('start-craving-btn');
    expect(startBtn).toBeTruthy();

    await fireEvent.press(startBtn);

    expect(screen.getByText(/TAP THE CRAVING FAST!|जल्दी टैप करें!/)).toBeTruthy();
  });

  it('switches to Kick Pop tab and shows kick reflex game', async () => {
    await render(<PregnancyGamesScreen />);
    
    const kickTab = screen.getByTestId('tab-kicks');
    await fireEvent.press(kickTab);

    expect(screen.getByText(/Baby Kick Whack & Pop!|बेबी किक रिदम पॉप!/)).toBeTruthy();
    expect(screen.getByTestId('start-kick-btn')).toBeTruthy();
  });

  it('switches to Myth Buster tab and allows answering myths', async () => {
    await render(<PregnancyGamesScreen />);
    
    const mythTab = screen.getByTestId('tab-myths');
    await fireEvent.press(mythTab);

    expect(screen.getByText(/Bust That Dadi Myth!|दादी-नानी मिथक बस्टर!/)).toBeTruthy();
    
    // Press MYTH button on statement
    const mythChoice = screen.getByTestId('myth-bust-btn');
    await fireEvent.press(mythChoice);

    expect(screen.getByText(/Correct Answer!|बिल्कुल सही जवाब!/)).toBeTruthy();
  });

  it('switches to Mom Brain Memory Match tab and renders cards', async () => {
    await render(<PregnancyGamesScreen />);
    
    const memoryTab = screen.getByTestId('tab-memory');
    await fireEvent.press(memoryTab);

    expect(screen.getByText(/Mom Brain Booster Match|मॉम ब्रेन बूस्टर/)).toBeTruthy();
  });
});
