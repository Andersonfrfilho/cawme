import { useCallback } from 'react';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import { useErrorStore } from '@/shared/store/error.store';
import type { ErrorVariant } from '@/shared/components/error-screen';
import type { ErrorState } from '@/shared/store/error.store';

export type HandleErrorOptions = Omit<ErrorState, 'variant'> & {
  variant?: ErrorVariant;
};

function mapToVariant(error: unknown): ErrorVariant {
  if (isAxiosError(error)) {
    if (!error.response) return 'network';
    const { status } = error.response;
    if (status === 404) return '404';
    if (status === 409) return '409';
    if (status >= 500) return '500';
    return 'generic';
  }
  if (typeof error === 'number') {
    if (error === 404) return '404';
    if (error === 409) return '409';
    if (error >= 500) return '500';
  }
  return 'generic';
}

export function useErrorHandler() {
  const setError = useErrorStore((s) => s.setError);

  const handleError = useCallback(
    (error: unknown, options?: HandleErrorOptions) => {
      const variant = options?.variant ?? mapToVariant(error);
      setError({ variant, ...options });
      router.navigate('/error');
    },
    [setError],
  );

  return { handleError };
}
