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
