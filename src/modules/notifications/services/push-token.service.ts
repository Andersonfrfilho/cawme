import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { apiClient } from '@/shared/services/api-client';

async function requestPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export const PushTokenService = {
  async registerDeviceToken(): Promise<void> {
    const granted = await requestPermission();
    if (!granted) return;

    const { data: token } = await Notifications.getDevicePushTokenAsync();
    if (!token) return;

    const platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'unknown';

    await apiClient.post('/bff/device-tokens', { token, platform });
  },
};
