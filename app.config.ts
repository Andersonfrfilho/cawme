import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Cawme',
  slug: 'cawme',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'cawme',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.andersonfilho.cawme',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.andersonfilho.cawme',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-notifications',
      {
        icon: './assets/images/notification-icon.png',
        color: '#ffffff',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
