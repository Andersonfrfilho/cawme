import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { getErrorDetails } from "@/modules/auth/services/error-mapper";
import { useLoading } from "@/shared/hooks/useLoading";
import { userAction } from "@/shared/utils/logger";
import type { RegisterServiceParams } from "../services/types";

export function useRegister() {
  const { showLoading, hideLoading } = useLoading();

  async function register(params: RegisterServiceParams): Promise<{ userId: string; keycloakId: string }> {
    userAction('register.init', 'User started registration', { email: params.email, phone: params.phone });
    showLoading();
    
    try {
      const result = await KeycloakService.register(params);
      userAction('register.success', 'User completed registration', { email: params.email, userId: result.userId });
      return result;
    } catch (error: any) {
      const details = getErrorDetails(error);
      userAction('register.error', 'Registration failed', { 
        statusCode: details.statusCode, 
        field: details.field,
        error: details.message,
      });
      hideLoading();
      throw error;
    } finally {
      hideLoading();
    }
  }

  return { register };
}
