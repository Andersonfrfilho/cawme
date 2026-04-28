import { useAuthStore } from "@/modules/auth/store/auth.store";
import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { useLoading } from "@/shared/hooks/useLoading";
import { router } from "expo-router";
import axios from "axios";
import type { LoginServiceParams } from "../services/types";

export function useAuth() {
  const { setUser, logout: clearUser } = useAuthStore();
  const { showLoading, hideLoading } = useLoading();

  async function login(params: LoginServiceParams): Promise<void> {
    showLoading();
    try {
      const { id, name, email } = await KeycloakService.login(params);
      setUser({ id, name, email, type: "contractor" });
      router.replace("/(app)/home");
    } catch (error) {
      if (__DEV__) {
        if (axios.isAxiosError(error)) {
          console.error("[auth/login] request failed", {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            method: error.config?.method,
            responseData: error.response?.data,
          });
        } else {
          console.error("[auth/login] unexpected error", error);
        }
      }
      throw error;
    } finally {
      hideLoading();
    }
  }

  async function logout(): Promise<void> {
    showLoading();
    try {
      await KeycloakService.logout();
    } finally {
      clearUser();
      hideLoading();
      router.replace("/(auth)");
    }
  }

  return { login, logout };
}
