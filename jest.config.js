/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Precisa incluir expo-*, @expo/* e pacotes ESM (zustand, react-native-maps, etc.)
  transformIgnorePatterns: [
    'node_modules/(?!' +
      '(jest-)?react-native' +
      '|@react-native(-community)?' +
      '|expo(-[a-z-]+)?' +       // expo, expo-router, expo-location, expo-modules-core, etc.
      '|@expo(-[a-z-]+)?/.*' +   // @expo/vector-icons, @expo-google-fonts/*, etc.
      '|@unimodules/.*' +
      '|unimodules' +
      '|react-navigation' +
      '|@react-navigation/.*' +
      '|zustand' +
      '|react-native-reanimated' +
      '|react-native-safe-area-context' +
      '|react-native-maps' +
      '|@adatechnology/.*' +
      ')',
  ],
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/*.test.[jt]s?(x)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  collectCoverageFrom: [
    'src/modules/auth/hooks/**/*.ts',
    'src/modules/auth/services/**/*.ts',
    'src/modules/auth/store/**/*.ts',
    '!src/**/__tests__/**',
    '!src/**/*.d.ts',
  ],
};
