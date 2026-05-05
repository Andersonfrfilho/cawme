import { useAuthStore } from "@/modules/auth/store/auth.store";
import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { useLoading } from "@/shared/hooks/useLoading";
import { router } from "expo-router";
import { userAction } from "@/shared/utils/logger";
import type { LoginServiceParams } from "../services/types";

export function useAuth() {
  const { setUser, logout: clearUser } = useAuthStore();
  const { showLoading, hideLoading } = useLoading();

  async function login(params: LoginServiceParams): Promise<void> {
    userAction('login.submit', 'User submitted login form', { username: params.username });
    showLoading();
    
    try {
      const { id, name, email } = await KeycloakService.login(params);
      setUser({ id, name, email, type: "contractor" });
      userAction('login.success', 'User logged in successfully', { userId: id });
      router.replace("/(app)/home");
    } catch (error) {
      userAction('login.error', 'Login failed');
      throw error;
    } finally {
      hideLoading();
    }
  }

  async function logout(): Promise<void> {
    showLoading();
    try {
      await KeycloakService.logout();
      userAction('logout.success', 'User logged out');
    } catch (error) {
      userAction('logout.error', 'Logout failed');
      throw error;
    } finally {
      clearUser();
      hideLoading();
      router.replace("/(auth)");
    }
  }

  return { login, logout };
}
