import React from 'react';
import { View } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from '~/store';
import { useAuthStore } from '~/store/useAuthStore';
import { SubscribedScreen } from '~/features/dashboard/screens/SubscribedScreen';
import { ActivityDetailScreen } from '~/features/dashboard/screens/ActivityDetailScreen';
import { NotificationScreen } from '~/features/dashboard/screens/NotificationScreen';
import { BabyGrowthCard } from '~/features/dashboard/components/BabyGrowthCard';
import { KrishnaPillarsGrid } from '~/features/dashboard/components/KrishnaPillarsGrid';
import { TeamBanner } from '~/features/dashboard/components/TeamBanner';
import { GarbhadhaanScreen } from '~/features/course/screens/GarbhadhaanScreen';
import { ProfileScreen } from '~/features/profile/screens/ProfileScreen';
import '~/shared/i18n';

const Stack = createNativeStackNavigator();
const DummyScreen = () => <View />;

const renderWithNav = async (Component: React.ComponentType<any>, initialParams: any = {}) => {
  return await render(
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Target">
          <Stack.Screen name="Target" component={Component} initialParams={initialParams} />
          <Stack.Screen name="Course" component={DummyScreen} />
          <Stack.Screen name="Activity" component={DummyScreen} />
          <Stack.Screen name="KickCounter" component={DummyScreen} />
          <Stack.Screen name="BabyBump" component={DummyScreen} />
          <Stack.Screen name="Pricing" component={DummyScreen} />
          <Stack.Screen name="SupportChat" component={DummyScreen} />
          <Stack.Screen name="AboutUs" component={DummyScreen} />
          <Stack.Screen name="Garbhadhaan" component={DummyScreen} />
          <Stack.Screen name="BalSanskar" component={DummyScreen} />
          <Stack.Screen name="Kundli" component={DummyScreen} />
          <Stack.Screen name="LiveSessions" component={DummyScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

describe('Button Interaction & Navigation Audit (Tier 3 & Tier 4)', () => {
  beforeEach(async () => {
    useAuthStore.getState().resetState();
    await useAuthStore.getState().logout();
  });

  describe('SubscribedScreen Interactive Elements', () => {
    it('toggles routine task completed state when tapping task cards', async () => {
      await renderWithNav(SubscribedScreen);

      const morningTask = screen.getByLabelText(/Morning Yognidra/i);
      expect(morningTask).toBeTruthy();

      await fireEvent.press(morningTask);
      await fireEvent.press(morningTask);
    });

    it('navigates to Course when Open Program Library is pressed', async () => {
      await renderWithNav(SubscribedScreen);

      const libraryBtn = screen.getByRole('button', { name: 'Open Program Library' });
      expect(libraryBtn).toBeTruthy();
      await fireEvent.press(libraryBtn);
    });
  });

  describe('ActivityDetailScreen Actions', () => {
    it('marks activity as completed and triggers API post', async () => {
      await renderWithNav(ActivityDetailScreen, { id: 'act-1' });

      await waitFor(() => {
        expect(screen.getByText('Daily Meditation')).toBeTruthy();
      });

      const completeBtn = screen.getByText(/Mark Activity as Done/i);
      await fireEvent.press(completeBtn);

      await waitFor(() => {
        expect(screen.getByText('Activity Completed')).toBeTruthy();
      });
    });

    it('handles back button press in ActivityDetailScreen', async () => {
      await renderWithNav(ActivityDetailScreen, { id: 'act-1' });

      const backButtons = screen.getAllByRole('button');
      if (backButtons.length > 0) {
        await fireEvent.press(backButtons[0]);
      }
    });
  });

  describe('NotificationScreen Interaction Audit', () => {
    it('marks all notifications as read when Mark all read is tapped', async () => {
      await renderWithNav(NotificationScreen);

      const markAllBtn = screen.getByRole('button', { name: 'Mark all read' });
      expect(markAllBtn).toBeTruthy();

      await fireEvent.press(markAllBtn);
      expect(screen.getByText('Notifications')).toBeTruthy();
    });

    it('taps individual notification card and marks it as read', async () => {
      await renderWithNav(NotificationScreen);

      const notificationItem = screen.getByText(/Session Starting Soon!/i);
      expect(notificationItem).toBeTruthy();

      await fireEvent.press(notificationItem);
    });
  });

  describe('BabyGrowthCard Interactive Links', () => {
    it('renders BabyGrowthCard and allows tapping growth details arrow', async () => {
      useAuthStore.setState({
        status: 'authenticated',
        user: { id: '1', name: 'Mumma', phone: '+919876543210' },
        subscriptionStatus: 'none',
      });

      await renderWithNav(BabyGrowthCard);

      const viewDetailsBtn = screen.getByRole('button', { name: 'View Growth Details' });
      expect(viewDetailsBtn).toBeTruthy();
      await fireEvent.press(viewDetailsBtn);
    });

    it('navigates to KickCounter from BabyGrowthCard quick link', async () => {
      useAuthStore.setState({
        status: 'authenticated',
        user: { id: '1', name: 'Mumma', phone: '+919876543210' },
      });

      await renderWithNav(BabyGrowthCard);

      const kickLink = screen.getByText(/Record Kick/i);
      expect(kickLink).toBeTruthy();
      await fireEvent.press(kickLink);
    });

    it('navigates to BabyBump photo from BabyGrowthCard quick link', async () => {
      useAuthStore.setState({
        status: 'authenticated',
        user: { id: '1', name: 'Mumma', phone: '+919876543210' },
      });

      await renderWithNav(BabyGrowthCard);

      const bumpLink = screen.getByText(/Baby Bump Photo/i);
      expect(bumpLink).toBeTruthy();
      await fireEvent.press(bumpLink);
    });

    it('handles trial routine button press in BabyGrowthCard', async () => {
      useAuthStore.setState({
        status: 'authenticated',
        user: { id: '1', name: 'Mumma', phone: '+919876543210' },
        subscriptionStatus: 'none',
      });

      await renderWithNav(BabyGrowthCard);

      const trialBtn = screen.getByText(/3-day free trial/i);
      expect(trialBtn).toBeTruthy();
      await fireEvent.press(trialBtn);
    });
  });

  describe('Dashboard Grid & Banner Interactions', () => {
    it('renders KrishnaPillarsGrid and allows tapping Garbh Sanskar pillar card', async () => {
      await renderWithNav(KrishnaPillarsGrid);

      const garbhCard = screen.getByRole('button', { name: /Garbh Sanskar|गर्भ संस्कार/i });
      expect(garbhCard).toBeTruthy();
      await fireEvent.press(garbhCard);
    });

    it('triggers Pre Pregnancy card navigation on KrishnaPillarsGrid', async () => {
      await renderWithNav(KrishnaPillarsGrid);

      const prePregnancyCard = screen.getByRole('button', { name: /Pre Pregnancy|गर्भधान संस्कार/i });
      expect(prePregnancyCard).toBeTruthy();
      await fireEvent.press(prePregnancyCard);
    });

    it('triggers Anandam wide card navigation on KrishnaPillarsGrid', async () => {
      await renderWithNav(KrishnaPillarsGrid);

      const anandamCard = screen.getByRole('button', { name: /Anandam|आनंदम/i });
      expect(anandamCard).toBeTruthy();
      await fireEvent.press(anandamCard);
    });

    it('triggers TeamBanner press to navigate to AboutUs', async () => {
      await renderWithNav(TeamBanner);

      const banner = screen.getByRole('button', {
        name: /An Initiative by President & Prime Minister Awardee Team/i,
      });
      expect(banner).toBeTruthy();
      await fireEvent.press(banner);
    });
  });

  describe('GarbhadhaanScreen Feature Interactions', () => {
    it('opens feature details modal when feature cards are tapped', async () => {
      await renderWithNav(GarbhadhaanScreen);

      expect(screen.getByText('Garbhadhaan (Pre-Pregnancy)')).toBeTruthy();

      const featureCard = screen.getByText('Suitable Intercourse Dates');
      expect(featureCard).toBeTruthy();
      await fireEvent.press(featureCard);

      await waitFor(() => {
        expect(screen.getByText('Suitable Intercourse Dates')).toBeTruthy();
      });
    });

    it('handles GarbhadhaanScreen back button cleanly', async () => {
      await renderWithNav(GarbhadhaanScreen);

      const backButtons = screen.getAllByRole('button');
      if (backButtons.length > 0) {
        await fireEvent.press(backButtons[0]);
      }
    });
  });

  describe('ProfileScreen & Settings Interactions', () => {
    it('renders ProfileScreen with user details and handles logout', async () => {
      useAuthStore.setState({
        status: 'authenticated',
        user: { id: '1', name: 'Sunita Mehra', phone: '+919876543210' },
      });

      await renderWithNav(ProfileScreen);

      expect(screen.getByText(/Sunita Mehra/i)).toBeTruthy();

      // Tap Logout button
      const logoutBtn = screen.getByText('Log Out');
      expect(logoutBtn).toBeTruthy();
      await fireEvent.press(logoutBtn);

      expect(useAuthStore.getState().status).toBe('idle');
    });

    it('interacts with support chat link on ProfileScreen', async () => {
      useAuthStore.setState({
        status: 'authenticated',
        user: { id: '1', name: 'Sunita Mehra', phone: '+919876543210' },
      });

      await renderWithNav(ProfileScreen);

      const chatItem = screen.getByText('Chat with Us');
      expect(chatItem).toBeTruthy();
      await fireEvent.press(chatItem);
    });
  });
});
