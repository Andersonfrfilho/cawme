import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { ComponentAction } from '@/types/bff/sdui.types';

export function resolveSduiAction(action: ComponentAction | null, item?: Record<string, any>) {
  if (!action || action.type === 'none') return;

  const interpolate = (tpl: string) =>
    tpl.replace(/\{(\w+)\}/g, (_, key) => String(item?.[key] ?? ''));

  switch (action.type) {
    case 'navigate':
      if (action.route) {
        router.push(interpolate(action.route) as any);
      }
      break;
    case 'open_modal':
      if (action.route) {
        router.push({
          pathname: interpolate(action.route) as any,
          params: action.params,
        });
      }
      break;
    case 'external_link':
      if (action.url) {
        Linking.openURL(interpolate(action.url));
      }
      break;
  }
}
