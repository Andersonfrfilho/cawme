import { useState, useEffect, useCallback } from "react";
import { KeycloakService } from "../services/keycloak.service";

export type PendingVerificationStatus = {
  emailVerified: boolean;
  phoneVerified: boolean;
  pendingCount: number;
  isLoading: boolean;
};

export function usePendingVerification() {
  const [status, setStatus] = useState<PendingVerificationStatus>({
    emailVerified: true,
    phoneVerified: true,
    pendingCount: 0,
    isLoading: true,
  });

  const checkStatus = useCallback(async () => {
    try {
      const data = await KeycloakService.getVerificationStatus();
      const pendingCount = (data.emailVerified ? 0 : 1) + (data.phoneVerified ? 0 : 1);

      setStatus({
        emailVerified: data.emailVerified,
        phoneVerified: data.phoneVerified,
        pendingCount,
        isLoading: false,
      });
    } catch {
      // Se falhar, assume tudo OK para não bloquear o usuário
      setStatus({
        emailVerified: true,
        phoneVerified: true,
        pendingCount: 0,
        isLoading: false,
      });
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return { ...status, refresh: checkStatus };
}
