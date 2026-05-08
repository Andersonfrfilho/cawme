import { useState, useEffect } from "react";
import { KeycloakService } from "../services/keycloak.service";

export type AppConfig = {
  features: {
    chatEnabled: boolean;
    notificationsEnabled: boolean;
    reviewsEnabled: boolean;
    providerSearchEnabled: boolean;
    documentPhotoVerification: boolean;
  };
};

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await KeycloakService.getAppConfig();
        setConfig(data as AppConfig);
      } catch (err: any) {
        setError(err?.message || "Erro ao carregar configurações");
      } finally {
        setIsLoading(false);
      }
    }

    loadConfig();
  }, []);

  const features = config?.features;

  return {
    config,
    isLoading,
    error,
    // Individual flags
    isChatEnabled: features?.chatEnabled ?? true,
    isNotificationsEnabled: features?.notificationsEnabled ?? true,
    isReviewsEnabled: features?.reviewsEnabled ?? true,
    isProviderSearchEnabled: features?.providerSearchEnabled ?? true,
    isDocumentPhotoVerificationEnabled: features?.documentPhotoVerification ?? false,
  };
}
