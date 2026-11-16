import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from '~/store';
import { useAuthStore } from '~/store/useAuthStore';
import { AuthNavigator } from '~/app/navigation/AuthNavigator';
import { MainTabNavigator } from '~/app/navigation/MainTabNavigator';
import { PhoneEntryScreen } from '~/features/auth/screens/PhoneEntryScreen';
import { OtpVerificationScreen } from '~/features/auth/screens/OtpVerificationScreen';
import { LanguageSelectScreen } from '~/features/auth/screens/LanguageSelectScreen';
import { ProfileSetupScreen } from '~/features/auth/screens/ProfileSetupScreen';
import { LifeStageScreen } from '~/features/auth/screens/LifeStageScreen';
import { WelcomeCourseSelectionScreen } from '~/features/onboarding/screens/WelcomeCourseSelectionScreen';
import '~/shared/i18n';

describe('Navigation Flows & Authentication Routing (Tier 1 & Tier 2)', () => {
  beforeEach(async () => {
    useAuthStore.getState().resetState();
    await useAuthStore.getState().logout();
  });

  describe('Auth Switching & Phone Entry Flow', () => {
    it('renders PhoneEntryScreen with input fields and country code', async () => {
      const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
      } as any;

      await render(
        <Provider store={store}>
          <NavigationContainer>
            <PhoneEntryScreen navigation={mockNavigation} route={{} as any} />
          </NavigationContainer>
        </Provider>
      );

      expect(screen.getByPlaceholderText('Mobile number')).toBeTruthy();
      expect(screen.getByText('Continue')).toBeTruthy();
      expect(screen.getByText('+91')).toBeTruthy();
      expect(screen.getByText('Welcome to Astro Baby')).toBeTruthy();
    });

    it('updates phone state on user typing in PhoneEntryScreen', async () => {
      const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
      } as any;

      await render(
        <Provider store={store}>
          <NavigationContainer>
            <PhoneEntryScreen navigation={mockNavigation} route={{} as any} />
          </NavigationContainer>
        </Provider>
      );

      const phoneInput = screen.getByPlaceholderText('Mobile number');
      await fireEvent.changeText(phoneInput, '9876543210');

      expect(screen.getByPlaceholderText('Mobile number').props.value).toBe('9876543210');
    });

    it('sends OTP and navigates to OtpVerification on Continue press', async () => {
      const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
      } as any;

      await render(
        <Provider store={store}>
          <NavigationContainer>
            <PhoneEntryScreen navigation={mockNavigation} route={{} as any} />
          </NavigationContainer>
        </Provider>
      );

      const phoneInput = screen.getByPlaceholderText('Mobile number');
      await fireEvent.changeText(phoneInput, '9876543210');

      const continueButton = screen.getByRole('button', { name: 'Continue' });
      await fireEvent.press(continueButton);

      await waitFor(() => {
        expect(mockNavigation.navigate).toHaveBeenCalledWith('OtpVerification');
      });
    });

    it('renders OtpVerificationScreen and displays phone verification elements', async () => {
      const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
      } as any;

      useAuthStore.setState({ phoneNumber: '+919876543210', status: 'otp_sent' });

      await render(
        <Provider store={store}>
          <NavigationContainer>
            <OtpVerificationScreen navigation={mockNavigation} route={{} as any} />
          </NavigationContainer>
        </Provider>
      );

      expect(screen.getByText('Verify Phone')).toBeTruthy();
      expect(screen.getByText(/Didn't receive the code\?/i)).toBeTruthy();
      expect(screen.getByText('Verify & Proceed')).toBeTruthy();

      await useAuthStore.getState().verifyOtp('1234');
      expect(useAuthStore.getState().status).toBe('authenticated');
    });

    it('handles OtpVerification back navigation correctly', async () => {
      const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
      } as any;

      await render(
        <Provider store={store}>
          <NavigationContainer>
            <OtpVerificationScreen navigation={mockNavigation} route={{} as any} />
          </NavigationContainer>
        </Provider>
      );

      const backBtn = screen.getByText('←');
      await fireEvent.press(backBtn);

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });

    it('mounts AuthNavigator stack and defaults to PhoneEntry', async () => {
      await render(
        <Provider store={store}>
          <NavigationContainer>
            <AuthNavigator />
          </NavigationContainer>
        </Provider>
      );

      expect(screen.getByPlaceholderText('Mobile number')).toBeTruthy();
    });
  });

  describe('Onboarding Flow Progression', () => {
    it('renders LanguageSelectScreen and enables progression on language selection', async () => {
      const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
      } as any;

      await render(
        <NavigationContainer>
          <LanguageSelectScreen navigation={mockNavigation} route={{} as any} />
        </NavigationContainer>
      );

      expect(screen.getByText('English')).toBeTruthy();
      expect(screen.getByText('हिन्दी')).toBeTruthy();

      const englishBtn = screen.getByText('English');
      await fireEvent.press(englishBtn);

      const continueBtn = screen.getByText(/Continue/i);
      await fireEvent.press(continueBtn);

      expect(useAuthStore.getState().hasLanguage).toBe(true);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('ProfileSetup');
    });

    it('renders ProfileSetupScreen and saves mother profile data', async () => {
      const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
      } as any;

      await render(
        <NavigationContainer>
          <ProfileSetupScreen navigation={mockNavigation} route={{} as any} />
        </NavigationContainer>
      );

      expect(screen.getByText(/Tell us about yourself/i)).toBeTruthy();

      const nameInput = screen.getByPlaceholderText('Jane Doe');
      await fireEvent.changeText(nameInput, 'Priya Sharma');

      const submitBtn = screen.getByRole('button', { name: /Next Step/i });
      await fireEvent.press(submitBtn);

      expect(useAuthStore.getState().hasProfile).toBe(true);
      expect(useAuthStore.getState().user?.name).toBe('Priya Sharma');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('WelcomeCourseSelection');
    });

    it('renders WelcomeCourseSelectionScreen and offers course options', async () => {
      const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
      } as any;

      await render(
        <NavigationContainer>
          <WelcomeCourseSelectionScreen navigation={mockNavigation} route={{} as any} />
        </NavigationContainer>
      );

      expect(screen.getByText('Garbhadhaan')).toBeTruthy();
      expect(screen.getByText('Garbh Sanskar')).toBeTruthy();
      expect(screen.getByText('Bal Sanskar')).toBeTruthy();
    });

    it('renders LifeStageScreen and toggles between pregnant and planning stages', async () => {
      const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
        canGoBack: jest.fn().mockReturnValue(true),
      } as any;

      await render(
        <NavigationContainer>
          <LifeStageScreen navigation={mockNavigation} route={{} as any} />
        </NavigationContainer>
      );

      expect(screen.getByText(/Yes, I am Pregnant/i)).toBeTruthy();
      expect(screen.getByText(/No, I am Planning for Baby/i)).toBeTruthy();

      const pregnantCard = screen.getByText(/Yes, I am Pregnant/i);
      await fireEvent.press(pregnantCard);

      const continueBtn = screen.getByText(/Continue to Details/i);
      await fireEvent.press(continueBtn);

      expect(screen.getByText(/Month & Period Details/i)).toBeTruthy();
    });

    it('advances through LifeStageScreen pregnant flow and updates store', async () => {
      await useAuthStore.getState().setHasLifeStage(true, 'pregnant', {
        confirmed_month: 3,
        remaining_months: 7,
      });

      expect(useAuthStore.getState().hasLifeStage).toBe(true);
      expect(useAuthStore.getState().journeyData?.stage).toBe('pregnant');
      expect(useAuthStore.getState().journeyData?.confirmed_month).toBe(3);
    });
  });

  describe('MainTabNavigator Switching', () => {
    it('renders MainTabNavigator and allows switching across bottom tabs', async () => {
      useAuthStore.setState({
        status: 'authenticated',
        user: { id: '1', name: 'Mumma', phone: '+919876543210' },
        hasLanguage: true,
        hasProfile: true,
        hasLifeStage: true,
        hasSeenPricing: true,
        hasSeenIntro: true,
        subscriptionStatus: 'active',
      });

      await render(
        <Provider store={store}>
          <NavigationContainer>
            <MainTabNavigator />
          </NavigationContainer>
        </Provider>
      );

      const tabButtons = screen.getAllByRole('button');
      expect(tabButtons.length).toBeGreaterThanOrEqual(5);

      // Press Subscribed (Program) tab
      await fireEvent.press(screen.getByLabelText('Program'));

      // Press Activity tab
      await fireEvent.press(screen.getByLabelText('Activity'));

      // Press InProgress (Classes) tab
      await fireEvent.press(screen.getByLabelText('Classes'));

      // Press Profile tab
      await fireEvent.press(screen.getByLabelText('Profile'));

      // Return to Dashboard tab
      await fireEvent.press(screen.getByLabelText('Home'));
    });
  });

  describe('Session Restoration & State Management', () => {
    it('restoreSession restores unauthenticated session by default', async () => {
      await useAuthStore.getState().restoreSession();
      expect(useAuthStore.getState().status).toBe('idle');
    });

    it('logout clears authentication and resets all onboarding flags', async () => {
      useAuthStore.setState({
        status: 'authenticated',
        user: { id: '1', name: 'Test Mother', phone: '+919876543210' },
        hasLanguage: true,
        hasProfile: true,
        hasLifeStage: true,
        hasSeenPricing: true,
        hasSeenIntro: true,
      });

      await useAuthStore.getState().logout();

      expect(useAuthStore.getState().status).toBe('idle');
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().hasLanguage).toBe(false);
      expect(useAuthStore.getState().hasProfile).toBe(false);
      expect(useAuthStore.getState().hasLifeStage).toBe(false);
    });

    it('activateDemo sets active trial and configures journeyData correctly', async () => {
      await useAuthStore.getState().activateDemo(4);

      const state = useAuthStore.getState();
      expect(state.isDemoActive).toBe(true);
      expect(state.subscriptionStatus).toBe('trial');
      expect(state.journeyData?.confirmed_month).toBe(4);
      expect(state.journeyData?.remaining_months).toBe(6);
      expect(state.hasSeenPricing).toBe(true);
      expect(state.hasSeenIntro).toBe(true);
    });
  });
});
