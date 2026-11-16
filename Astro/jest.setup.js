/* eslint-env jest */

// Track and clean up dangling timers (e.g. splash screen delays) so tests don't leak open handles
const pendingTimeouts = new Set();
const originalSetTimeout = global.setTimeout;
const originalClearTimeout = global.clearTimeout;

const pendingIntervals = new Set();
const originalSetInterval = global.setInterval;
const originalClearInterval = global.clearInterval;

global.setTimeout = (handler, timeout, ...args) => {
  let timerId;
  const wrapped = (...cbArgs) => {
    pendingTimeouts.delete(timerId);
    return handler(...cbArgs);
  };
  timerId = originalSetTimeout(wrapped, timeout, ...args);
  pendingTimeouts.add(timerId);
  return timerId;
};

global.clearTimeout = (timerId) => {
  pendingTimeouts.delete(timerId);
  return originalClearTimeout(timerId);
};

global.setInterval = (handler, timeout, ...args) => {
  const intervalId = originalSetInterval(handler, timeout, ...args);
  pendingIntervals.add(intervalId);
  return intervalId;
};

global.clearInterval = (intervalId) => {
  pendingIntervals.delete(intervalId);
  return originalClearInterval(intervalId);
};

afterEach(() => {
  for (const timerId of pendingTimeouts) {
    originalClearTimeout(timerId);
  }
  pendingTimeouts.clear();
  for (const intervalId of pendingIntervals) {
    originalClearInterval(intervalId);
  }
  pendingIntervals.clear();
});

// 1. Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => {
  try {
    return require('@react-native-async-storage/async-storage/jest');
  } catch (e) {
    return require('@react-native-async-storage/async-storage/jest/async-storage-mock');
  }
});

// 2. Mock react-native-screens
jest.mock('react-native-screens', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    enableScreens: jest.fn(),
    screensEnabled: jest.fn(() => false),
    ScreenContainer: View,
    Screen: View,
    NativeScreen: View,
    NativeScreenContainer: View,
    ScreenStack: View,
    ScreenStackHeaderConfig: View,
    ScreenStackHeaderSubview: View,
    SearchBar: View,
    FullWindowOverlay: View,
  };
});

// 3. Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaView: ({ children, ...props }) => React.createElement('SafeAreaView', props, children),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => frame,
    SafeAreaInsetsContext: React.createContext(inset),
    SafeAreaFrameContext: React.createContext(frame),
    initialWindowMetrics: {
      insets: inset,
      frame: frame,
    },
  };
});

// 4. Mock react-native-sms-retriever
jest.mock('react-native-sms-retriever', () => ({
  startSmsRetriever: jest.fn().mockResolvedValue(true),
  addSmsListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  removeSmsListener: jest.fn(),
  requestPhoneNumber: jest.fn().mockResolvedValue('+919876543210'),
}));

// 5. Mock react-native-video
jest.mock('react-native-video', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockVideo = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      seek: jest.fn(),
      presentFullscreenPlayer: jest.fn(),
      dismissFullscreenPlayer: jest.fn(),
    }));
    return React.createElement(View, { testID: 'mock-video-player', ...props });
  });
  return MockVideo;
});

// 6. Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn().mockResolvedValue(true),
  getGenericPassword: jest.fn().mockResolvedValue(false),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
  hasInternetCredentials: jest.fn().mockResolvedValue(false),
  setInternetCredentials: jest.fn().mockResolvedValue(true),
  getInternetCredentials: jest.fn().mockResolvedValue(false),
  resetInternetCredentials: jest.fn().mockResolvedValue(true),
  ACCESS_CONTROL: {},
  ACCESSIBLE: {},
  AUTHENTICATION_TYPE: {},
  SECURITY_LEVEL: {},
}));

// 7. Mock react-native-image-crop-picker
jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn().mockResolvedValue({
    path: 'mock/path/image.jpg',
    width: 300,
    height: 300,
    mime: 'image/jpeg',
  }),
  openCamera: jest.fn().mockResolvedValue({
    path: 'mock/path/camera.jpg',
    width: 300,
    height: 300,
    mime: 'image/jpeg',
  }),
  openCropper: jest.fn().mockResolvedValue({
    path: 'mock/path/cropped.jpg',
    width: 300,
    height: 300,
    mime: 'image/jpeg',
  }),
  clean: jest.fn().mockResolvedValue(true),
  cleanSingle: jest.fn().mockResolvedValue(true),
}));

// 8. Mock lucide-react-native
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        if (prop === '__esModule') return true;
        const Icon = (props) =>
          React.createElement(View, {
            testID: `lucide-icon-${String(prop)}`,
            ...props,
          });
        Icon.displayName = `Lucide${String(prop)}`;
        return Icon;
      },
    }
  );
});

// 9. Mock @react-native-community/datetimepicker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View } = require('react-native');
  return (props) => React.createElement(View, { testID: 'mock-datetimepicker', ...props });
});

// 11. Mock ~/shared/api
jest.mock('~/shared/api', () => ({
  PRODUCTION_URL: 'https://astrobaby-pj0t.onrender.com',
  LAN_DEV_URL: 'http://10.101.231.1:8000',
  EMULATOR_DEV_URL: 'http://localhost:8000',
  baseURL: 'http://localhost:8000',
  api: {
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn().mockImplementation((url) => {
      if (url && url.includes('activities/daily')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              days: [
                { day: 28, status: 'unlocked', label: 'Day 28' }
              ],
              activities: [
                { id: 'act-1', title: 'Daily Meditation', duration: '15 mins', completed: false, type: 'meditation' }
              ],
              streak: 3,
              selectedDay: 28,
            },
          },
        });
      }
      return Promise.resolve({
        data: {
          success: true,
          data: {
            id: 'act-1',
            title: 'Daily Meditation',
            type: 'meditation',
            duration: '15 mins',
            color: '#F59E0B',
            iconName: 'Sparkles',
            completed: false,
            contentBlocks: [{ type: 'text', text: 'Peaceful breathing exercise' }],
          },
        },
      });
    }),
    post: jest.fn().mockImplementation((url) => {
      if (url && url.includes('send-otp')) {
        return Promise.resolve({ data: { success: true } });
      }
      if (url && url.includes('verify-otp')) {
        return Promise.resolve({
          data: {
            success: true,
            data: { accessToken: 'mock-jwt-token', refreshToken: 'mock-refresh-token' },
          },
        });
      }
      return Promise.resolve({ data: { success: true, data: {} } });
    }),
    put: jest.fn().mockResolvedValue({ data: { success: true, data: {} } }),
    delete: jest.fn().mockResolvedValue({ data: { success: true, data: {} } }),
  },
}));

