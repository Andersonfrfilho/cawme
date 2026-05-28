import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useRegisterStore } from "@/modules/auth/store/register.store";
import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { useRegistrationResume } from "@/modules/auth/hooks/useRegistrationResume";
import { useLoading } from "@/shared/hooks/useLoading";
import { router } from "expo-router";
import { userAction } from "@/shared/utils/logger";
import type { LoginServiceParams } from "../services/types";

export function useAuth() {
  const { setUser, logout: clearUser } = useAuthStore();
  const { showLoading, hideLoading } = useLoading();
  const { checkAndResume } = useRegistrationResume();

  async function checkVerificationStatusAndRedirect(
    userId: string,
    name: string,
    email: string,
    userType: "contractor" | "provider",
  ) {
    try {
      const status = await KeycloakService.getVerificationStatus();
      const local = useAuthStore.getState().verificationStatus;

      // Combina API com estado local: uma vez verificado localmente, mantém como verificado
      const effectiveEmailVerified = status.emailVerified || local.emailVerified;
      const effectivePhoneVerified = status.phoneVerified || local.phoneVerified;

      // Atualiza o store apenas promovendo para true, nunca rebaixando para false
      useAuthStore.getState().setVerificationStatus({
        emailVerified: effectiveEmailVerified,
        phoneVerified: effectivePhoneVerified,
      });

      if (!effectiveEmailVerified || !effectivePhoneVerified) {
        userAction('login.verification.pending', 'User has pending verification', {
          emailVerified: effectiveEmailVerified,
          phoneVerified: effectivePhoneVerified,
        });
        const storedPhone = useAuthStore.getState().user?.phone ?? "";
        router.replace({
          pathname: "/(auth)/verification" as any,
          params: {
            email,
            phone: storedPhone,
            mode: "post-login",
            emailVerified: effectiveEmailVerified ? "true" : "false",
            phoneVerified: effectivePhoneVerified ? "true" : "false",
          },
        });
        return;
      }

      const storedPhone = useAuthStore.getState().user?.phone ?? undefined;
      setUser({ id: userId, name, email, type: userType, phone: storedPhone });
      router.replace("/(app)/home");
    } catch (error) {
      // Se falhar a checagem, usa o estado local para decidir
      const local = useAuthStore.getState().verificationStatus;
      const storedPhone = useAuthStore.getState().user?.phone ?? undefined;
      setUser({ id: userId, name, email, type: userType, phone: storedPhone });
      if (local.emailVerified && local.phoneVerified) {
        router.replace("/(app)/home");
      } else {
        router.replace({
          pathname: "/(auth)/verification" as any,
          params: { email, phone: storedPhone ?? "", mode: "post-login", emailVerified: local.emailVerified ? "true" : "false", phoneVerified: local.phoneVerified ? "true" : "false" },
        });
      }
    }
  }

  async function login(params: LoginServiceParams): Promise<void> {
    userAction('login.submit', 'User submitted login form', { username: params.username });
    showLoading();

    try {
      const { id, name, email, type } = await KeycloakService.login(params);
      userAction('login.success', 'User logged in successfully', { userId: id });
      useRegisterStore.getState().clearPendingOnboarding();

      const resumeResult = await checkAndResume();
      if (resumeResult.resumed) {
        userAction('login.registration-resume', 'Resuming pending registration', {
          step: resumeResult.step,
        });
        return;
      }

      await checkVerificationStatusAndRedirect(id, name, email, type);
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
