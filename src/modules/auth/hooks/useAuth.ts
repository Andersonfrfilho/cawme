import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useRegisterStore } from "@/modules/auth/store/register.store";
import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { AccountService } from "@/modules/account/services/account.service";
import { useRegistrationResume } from "@/modules/auth/hooks/useRegistrationResume";
import { PushTokenService } from "@/modules/notifications/services/push-token.service";
import { useLoading } from "@/shared/hooks/useLoading";
import { router } from "expo-router";
import { userAction } from "@/shared/utils/logger";
import type {
  LoginServiceParams,
  ForgotPasswordServiceParams,
  SelfUnlockInitiateParams,
  SelfUnlockInitiateResult,
  SelfUnlockVerifyParams,
  SelfUnlockVerifyResult,
} from "../services/types";

async function createCategory(params: Parameters<typeof KeycloakService.createCategory>[0]) {
  return KeycloakService.createCategory(params);
}

async function createServiceCatalog(params: Parameters<typeof KeycloakService.createServiceCatalog>[0]) {
  return KeycloakService.createServiceCatalog(params);
}

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

      let primaryPhone: string | undefined;
      try {
        const profile = await AccountService.getProfile();
        primaryPhone = profile.primaryPhone;
      } catch {
        primaryPhone = useAuthStore.getState().user?.phone;
      }
      setUser({ id: userId, name, email, type: userType, phone: primaryPhone });
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
      PushTokenService.registerDeviceToken().catch(() => null);
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

  async function forgotPassword({ email }: ForgotPasswordServiceParams): Promise<void> {
    showLoading();
    try {
      await KeycloakService.forgotPassword({ email });
      userAction('forgotPassword.success', 'Password recovery email sent', { email });
    } catch (error) {
      userAction('forgotPassword.error', 'Password recovery failed', { email });
      throw error;
    } finally {
      hideLoading();
    }
  }

  async function initiateSelfUnlock(
    { blockId }: SelfUnlockInitiateParams,
  ): Promise<SelfUnlockInitiateResult> {
    showLoading();
    try {
      const result = await KeycloakService.initiateSelfUnlock({ blockId });
      userAction('selfUnlock.initiate.success', 'Self-unlock initiated', { blockId });
      return result;
    } catch (error) {
      userAction('selfUnlock.initiate.error', 'Failed to initiate self-unlock', { blockId });
      throw error;
    } finally {
      hideLoading();
    }
  }

  async function verifySelfUnlock(
    { blockId, code }: SelfUnlockVerifyParams,
  ): Promise<SelfUnlockVerifyResult> {
    showLoading();
    try {
      const result = await KeycloakService.verifySelfUnlock({ blockId, code });
      userAction('selfUnlock.verify.success', 'Self-unlock verified', {
        blockId,
        blockResolved: result.blockResolved,
      });
      return result;
    } catch (error) {
      userAction('selfUnlock.verify.error', 'Failed to verify self-unlock code', { blockId });
      throw error;
    } finally {
      hideLoading();
    }
  }

  async function getCategories() {
    return KeycloakService.getCategories();
  }

  async function getServices() {
    return KeycloakService.getServices();
  }

  async function createProviderService(params: Parameters<typeof KeycloakService.createProviderService>[0]) {
    return KeycloakService.createProviderService(params);
  }

  async function getProviderServices() {
    return KeycloakService.getProviderServices();
  }

  async function updateProviderService(
    serviceId: string,
    params: Parameters<typeof KeycloakService.updateProviderService>[1],
  ) {
    return KeycloakService.updateProviderService(serviceId, params);
  }

  async function deleteProviderService(serviceId: string) {
    return KeycloakService.deleteProviderService(serviceId);
  }

  async function setProviderAvailability(params: Parameters<typeof KeycloakService.setProviderAvailability>[0]) {
    return KeycloakService.setProviderAvailability(params);
  }

  async function getProviderAvailability() {
    return KeycloakService.getProviderAvailability();
  }

  async function updateProviderAvailability(
    params: Parameters<typeof KeycloakService.updateProviderAvailability>[0],
  ) {
    return KeycloakService.updateProviderAvailability(params);
  }

  async function deleteProviderAvailability(id: string) {
    return KeycloakService.deleteProviderAvailability(id);
  }

  return {
    login,
    logout,
    forgotPassword,
    initiateSelfUnlock,
    verifySelfUnlock,
    getCategories,
    getServices,
    createCategory,
    createServiceCatalog,
    createProviderService,
    getProviderServices,
    updateProviderService,
    deleteProviderService,
    setProviderAvailability,
    getProviderAvailability,
    updateProviderAvailability,
    deleteProviderAvailability,
  };
}
