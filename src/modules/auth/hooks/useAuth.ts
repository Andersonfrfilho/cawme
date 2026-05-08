import { useAuthStore } from "@/modules/auth/store/auth.store";
import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { useLoading } from "@/shared/hooks/useLoading";
import { router } from "expo-router";
import { userAction } from "@/shared/utils/logger";
import type { LoginServiceParams } from "../services/types";

export function useAuth() {
  const { setUser, logout: clearUser } = useAuthStore();
  const { showLoading, hideLoading } = useLoading();

  async function checkVerificationStatusAndRedirect(userId: string, name: string, email: string) {
    try {
      const status = await KeycloakService.getVerificationStatus();
      
      if (!status.emailVerified || !status.phoneVerified) {
        userAction('login.verification.pending', 'User has pending verification', { 
          emailVerified: status.emailVerified, 
          phoneVerified: status.phoneVerified 
        });
        router.replace({
          pathname: "/verification" as any,
          params: {
            email,
            phone: "", // Will be fetched by the verification screen or passed if available
            mode: "post-login",
            emailVerified: status.emailVerified ? "true" : "false",
            phoneVerified: status.phoneVerified ? "true" : "false",
          },
        });
        return;
      }
      
      setUser({ id: userId, name, email, type: "contractor" });
      router.replace("/(app)/home");
    } catch (error) {
      // If verification status check fails, still allow login but default to home
      setUser({ id: userId, name, email, type: "contractor" });
      router.replace("/(app)/home");
    }
  }

  async function login(params: LoginServiceParams): Promise<void> {
    userAction('login.submit', 'User submitted login form', { username: params.username });
    showLoading();
    
    try {
      const { id, name, email } = await KeycloakService.login(params);
      userAction('login.success', 'User logged in successfully', { userId: id });
      await checkVerificationStatusAndRedirect(id, name, email);
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
