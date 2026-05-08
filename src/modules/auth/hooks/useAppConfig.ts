import { useState, useEffect } from "react";
import { KeycloakService } from "../services/keycloak.service";

export type AppConfig = {
  features: {
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
        setConfig(data);
      } catch (err: any) {
        setError(err?.message || "Erro ao carregar configurações");
      } finally {
        setIsLoading(false);
      }
    }

    loadConfig();
  }, []);

  return {
    config,
    isLoading,
    error,
    isDocumentPhotoVerificationEnabled: config?.features?.documentPhotoVerification ?? false,
  };
}
