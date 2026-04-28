import { useCallback, useEffect, useState } from "react";
import { AppConfigService } from "@/modules/app-config/services";
import { useAppConfigStore } from "@/modules/app-config/store";
import type { AppConfigResponse } from "@/modules/app-config/types";

export function useAppConfig() {
  const { config, isStale, setConfig } = useAppConfigStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async (): Promise<AppConfigResponse> => {
    if (!isStale() && config) return config as AppConfigResponse;

    setLoading(true);
    setError(null);
    try {
      const data = await AppConfigService.get();
      setConfig(data);
      return data;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [config, isStale, setConfig]);

  useEffect(() => {
    if (isStale()) fetch().catch(() => {});
  }, [fetch, isStale]);

  return { config, loading, error, refresh: fetch } as const;
}

export default useAppConfig;
