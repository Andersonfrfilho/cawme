import { useEffect } from 'react';
import { router } from 'expo-router';
import { useErrorStore } from '@/shared/store/error.store';
import { ErrorScreen } from '@/shared/components/error-screen';

export default function ErrorRoute() {
  const { error, clearError } = useErrorStore();

  useEffect(() => {
    if (!error) router.back();
  }, [error]);

  if (!error) return null;

  const wrap = (fn?: () => void) =>
    fn
      ? () => {
          clearError();
          fn();
        }
      : undefined;

  const handleBack = wrap(error.onBack) ?? (() => { clearError(); router.back(); });

  return (
    <ErrorScreen
      variant={error.variant}
      title={error.title}
      message={error.message}
      onRetry={wrap(error.onRetry)}
      onBack={handleBack}
      onOther={wrap(error.onOther)}
      otherLabel={error.otherLabel}
    />
  );
}
