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
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.andersonfilho.cawme',
    infoPlist: {
      NSLocationWhenInUseUsageDescription: 'O Cawme precisa da sua localização para selecionar seu endereço e encontrar profissionais próximos.',
      NSLocationAlwaysAndWhenInUseUsageDescription: 'O Cawme precisa da sua localização para selecionar seu endereço e encontrar profissionais próximos.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#1A45E8',
    },
    package: 'com.andersonfilho.cawme',
    permissions: [
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
    ],
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
      'expo-location',
      {
        locationWhenInUsePermission: 'O Cawme precisa da sua localização para selecionar seu endereço e encontrar profissionais próximos.',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/images/notification-icon.png',
        color: '#ffffff',
      },
    ],
    [
      'react-native-maps',
      {
        // Para usar Google Maps no iOS, adicione a chave abaixo:
        // GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
