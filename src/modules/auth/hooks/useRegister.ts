import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { useLoading } from "@/shared/hooks/useLoading";
import type { RegisterServiceParams } from "../services/types";

export function useRegister() {
  const { showLoading, hideLoading } = useLoading();

  async function register(params: RegisterServiceParams): Promise<void> {
    showLoading();
    try {
      await KeycloakService.register(params);
    } finally {
      hideLoading();
    }
  }

  return { register };
}
