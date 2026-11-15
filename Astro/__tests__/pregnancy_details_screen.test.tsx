import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PregnancyDetailsScreen } from '../src/features/profile/screens/PregnancyDetailsScreen';
import { ProfileScreen } from '../src/features/profile/screens/ProfileScreen';
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
      getParent: () => ({
        navigate: mockNavigate,
      }),
    }),
  };
});

describe('PregnancyDetailsScreen & Profile Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      status: 'authenticated',
      user: {
        id: '1',
        name: 'Pooja Verma',
        phone: '9876543210',
        city: 'Jaipur',
        state: 'Rajasthan',
        dob: '12/04/1995',
        doctorName: 'Dr. Anita Joshi',
        bloodGroup: 'B+',
      },
      journeyData: {
        stage: 'pregnant',
        confirmed_month: 4,
        remaining_months: 6,
        lmp_date: '10 Jan 2027',
        edd_date: '15 Oct 2027',
      },
    });
  });

  it('renders collected pregnancy details summary on ProfileScreen', async () => {
    await render(<ProfileScreen />);

    // Check that collected pregnancy details are displayed on ProfileScreen
    expect(screen.getByText(/Pregnancy Month 4|माह 4/)).toBeTruthy();
    expect(screen.getByText(/15 Oct 2027/)).toBeTruthy();
    expect(screen.getByText(/10 Jan 2027/)).toBeTruthy();

    // Tap View & Update or Pregnancy Details
    const updateLink = screen.getByText(/View & Update ✏️|विवरण देखें/);
    await fireEvent.press(updateLink);
    expect(mockNavigate).toHaveBeenCalledWith('PregnancyDetails', undefined);
  });

  it('renders all collected details and DP update options on PregnancyDetailsScreen', async () => {
    await render(<PregnancyDetailsScreen />);

    // Check heading
    expect(screen.getByText(/Pregnancy & Profile Details|गर्भावस्था एवं प्रोफ़ाइल विवरण/)).toBeTruthy();

    // Check DP options
    expect(screen.getByText(/Add New Photo as DP|Change Photo \(DP\)|फ़ोटो/)).toBeTruthy();
    expect(screen.getByText(/🌸 Lotus/)).toBeTruthy();
    expect(screen.getByText(/👶 Angel/)).toBeTruthy();

    // Check collected details
    expect(screen.getByDisplayValue('Pooja Verma')).toBeTruthy();
    expect(screen.getByText(/9876543210/)).toBeTruthy();
    expect(screen.getByText(/10 Jan 2027/)).toBeTruthy();
    expect(screen.getByText(/15 Oct 2027/)).toBeTruthy();
    expect(screen.getByDisplayValue('Dr. Anita Joshi')).toBeTruthy();

    // Tap Save button
    const saveBtn = screen.getByText(/Save & Update Details 🌸|सभी विवरण सुरक्षित करें/);
    await fireEvent.press(saveBtn);
  });
});
