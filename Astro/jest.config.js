module.exports = {
  preset: '@react-native/jest-preset',
  watchman: false,
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/node_modules/react-native/Libraries/Image/RelativeImageStub.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-redux|@reduxjs|immer|lucide-react-native|react-native-sms-retriever|@react-native-async-storage|react-native-screens|react-native-safe-area-context|react-native-svg|react-native-video|react-native-keychain|react-native-image-crop-picker)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
