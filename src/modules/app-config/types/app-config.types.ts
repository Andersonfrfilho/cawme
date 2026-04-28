export interface AppConfigResponse {
  version: {
    latest: string;
    minRequired: string;
    forceUpdate: boolean;
  };
  navigation: {
    tabBar: {
      items: Array<{
        id: string;
        label: string;
        icon: string;
        visible: boolean;
        badge?: number;
      }>;
    };
  };
  features: Record<string, boolean>;
}

export type GetAppConfigResult = Promise<AppConfigResponse>;

export interface AppConfigStore {
  config: AppConfigResponse | null;
  fetchedAt: number | null;
  setConfig: (config: AppConfigResponse) => void;
  isStale: () => boolean;
}
