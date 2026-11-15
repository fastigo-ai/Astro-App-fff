import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { GarbhSanskarLibraryBanners } from '../src/features/dashboard/components/GarbhSanskarLibraryBanners';
import { GarbhSanskarLibraryScreen } from '../src/features/library/screens/GarbhSanskarLibraryScreen';
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

describe('Garbh Sanskar Library & Banners Tests', () => {
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

    it('navigates to MoodTherapy when Audio banner is pressed', async () => {
      await render(<GarbhSanskarLibraryBanners />);

      const audioBanner = screen.getByTestId('banner-garbh-audio');
      await fireEvent.press(audioBanner);

      expect(mockNavigate).toHaveBeenCalledWith('MoodTherapy');
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
});
