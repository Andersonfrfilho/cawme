import { useUIStore } from '../store/ui.store';

export function useLoading() {
  const isLoading = useUIStore((s) => s.isLoading);
  const setLoading = useUIStore((s) => s.setLoading);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return {
    isLoading,
    showLoading,
    hideLoading,
  };
}
