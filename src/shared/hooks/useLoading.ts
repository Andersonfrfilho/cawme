import { useCallback } from 'react';

import { useUIStore } from '../store/ui.store';

export function useLoading() {
  const isLoading = useUIStore((s) => s.isLoading);
  const setLoading = useUIStore((s) => s.setLoading);

  const showLoading = useCallback(() => setLoading(true), [setLoading]);
  const hideLoading = useCallback(() => setLoading(false), [setLoading]);

  return {
    isLoading,
    showLoading,
    hideLoading,
  };
}
