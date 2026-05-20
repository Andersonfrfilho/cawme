import '@testing-library/react-native/matchers';

// ── expo-router ──────────────────────────────────────────────────────────────
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({})),
  useNavigation: jest.fn(() => ({ setOptions: jest.fn(), canGoBack: jest.fn(() => false) })),
}));

// ── MMKV / cache provider ────────────────────────────────────────────────────
jest.mock('@/shared/providers/cache', () => ({
  mmkvStorage: {
    asStateStorage: () => ({
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    }),
  },
}));

// ── react-native-maps ────────────────────────────────────────────────────────
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MapView = (props: any) => React.createElement(View, props);
  MapView.Marker = (props: any) => React.createElement(View, props);
  return { __esModule: true, default: MapView, Marker: MapView.Marker };
});

// ── expo-location ────────────────────────────────────────────────────────────
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({ coords: { latitude: -23.5505, longitude: -46.6333 } }),
  ),
}));

// ── shared utils (logger, etc.) ───────────────────────────────────────────────
jest.mock('@/shared/utils/logger', () => ({
  userAction: jest.fn(),
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn(), screenEvent: jest.fn() },
}));

// ── useLoading ────────────────────────────────────────────────────────────────
jest.mock('@/shared/hooks/useLoading', () => ({
  useLoading: () => ({
    showLoading: jest.fn(),
    hideLoading: jest.fn(),
  }),
}));
