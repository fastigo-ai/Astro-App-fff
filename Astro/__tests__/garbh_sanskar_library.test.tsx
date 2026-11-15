import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { GarbhSanskarLibraryBanners } from '../src/features/dashboard/components/GarbhSanskarLibraryBanners';
import { GarbhSanskarLibraryScreen } from '../src/features/library/screens/GarbhSanskarLibraryScreen';
import { GarbhSanskarAudioScreen } from '../src/features/library/screens/GarbhSanskarAudioScreen';
import '~/shared/i18n';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
}));

describe('Garbh Sanskar Library & Audio Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GarbhSanskarLibraryBanners Component', () => {
    it('renders both separate boxes: Garbh Sanskar Audio and Library', async () => {
      await render(<GarbhSanskarLibraryBanners />);

      expect(screen.getByTestId('banner-garbh-audio')).toBeTruthy();
      expect(screen.getByTestId('banner-garbh-library')).toBeTruthy();
      expect(screen.getByText(/Audio|ऑडियो/)).toBeTruthy();
      expect(screen.getByText(/Library|लाइब्रेरी/)).toBeTruthy();
    });

    it('navigates to GarbhSanskarAudio when Audio banner is pressed', async () => {
      await render(<GarbhSanskarLibraryBanners />);

      const audioBanner = screen.getByTestId('banner-garbh-audio');
      await fireEvent.press(audioBanner);

      expect(mockNavigate).toHaveBeenCalledWith('GarbhSanskarAudio');
    });

    it('navigates to GarbhSanskarLibrary when Library banner is pressed', async () => {
      await render(<GarbhSanskarLibraryBanners />);

      const libraryBanner = screen.getByTestId('banner-garbh-library');
      await fireEvent.press(libraryBanner);

      expect(mockNavigate).toHaveBeenCalledWith('GarbhSanskarLibrary');
    });
  });

  describe('GarbhSanskarLibraryScreen Component', () => {
    it('renders library screen with categories and stories matching design reference', async () => {
      await render(<GarbhSanskarLibraryScreen />);

      // Screen title
      expect(screen.getByText(/Library|लाइब्रेरी/)).toBeTruthy();

      // Stories from reference image
      expect(screen.getByText(/Jamvant|जाम्बवान/)).toBeTruthy();
      expect(screen.getByText(/Bhim|भीम/)).toBeTruthy();
      expect(screen.getByText(/Devi sati|देवी सती/)).toBeTruthy();
    });

    it('opens story reader modal when Tap to Read is pressed', async () => {
      await render(<GarbhSanskarLibraryScreen />);

      const readButtons = screen.getAllByText(/Tap to Read|पढ़ने के लिए टैप करें/);
      expect(readButtons.length).toBeGreaterThan(0);

      await fireEvent.press(readButtons[0]);

      // Story modal shows sanskar moral and fetal benefit
      expect(screen.getByText(/Sanskar Virtue|संस्कार का संदेश/)).toBeTruthy();
      expect(screen.getByText(/Fetal Cognitive Benefit|शिशु के मस्तिष्क को लाभ/)).toBeTruthy();
    });
  });

  describe('GarbhSanskarAudioScreen Component', () => {
    it('renders audio screen with clean UI matching library layout', async () => {
      await render(<GarbhSanskarAudioScreen />);

      // Screen title
      expect(screen.getAllByText(/Audio|ऑडियो/).length).toBeGreaterThan(0);

      // Tracks
      expect(screen.getByText(/Raag Yaman|राग यमन/)).toBeTruthy();
      expect(screen.getByText(/Gayatri Mahamantra|गायत्री महामंत्र/)).toBeTruthy();
      expect(screen.getByText(/Kanha|कान्हा/)).toBeTruthy();
    });

    it('opens audio player modal when Tap to Listen is pressed', async () => {
      await render(<GarbhSanskarAudioScreen />);

      const listenButtons = screen.getAllByText(/Tap to Listen|सुनने के लिए टैप करें/);
      expect(listenButtons.length).toBeGreaterThan(0);

      await fireEvent.press(listenButtons[0]);

      expect(screen.getByText(/Fetal Auditory & Cognitive Benefit|शिशु के मस्तिष्क को लाभ/)).toBeTruthy();
    });
  });
});
