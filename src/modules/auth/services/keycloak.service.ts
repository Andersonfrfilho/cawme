import { apiClient } from '@/shared/services/api-client';
import { TokenService } from "./token.service";
import { AUTH_ENDPOINTS, HEADERS } from "../auth.constants";
import { decodeJwtPayload } from "@/shared/utils/jwt";
import type {
  LoginServiceParams,
  LoginServiceResult,
  ForgotPasswordServiceParams,
  OnboardingStatusResult,
  RegisterServiceParams,
  RegisterServiceResult,
  SaveAddressParams,
  SaveAddressResult,
  SendCodeResult,
  VerifyCodeResult,
  SelfUnlockInitiateParams,
  SelfUnlockInitiateResult,
  SelfUnlockVerifyParams,
  SelfUnlockVerifyResult,
  GetCategoriesResult,
  GetServicesResult,
  CreateCategoryParams,
  CreateCategoryResult,
  CreateServiceCatalogParams,
  CreateServiceCatalogResult,
  CreateProviderServiceParams,
  CreateProviderServiceResult,
  GetProviderServicesResult,
  UpdateProviderServiceParams,
  UpdateProviderServiceResult,
  SetProviderAvailabilityParams,
  SetProviderAvailabilityResult,
  GetProviderAvailabilityResult,
  UpdateProviderAvailabilityParams,
  UpdateProviderAvailabilityResult,
  DeleteProviderAvailabilityResult,
} from "./types";



export const KeycloakService = {
  async login({
    username,
    password,
  }: LoginServiceParams): Promise<LoginServiceResult> {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.TOKEN,
      { username, password },
      { _skipGlobalError: true, _skipRefresh: true },
    );

    await TokenService.save({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });

    const claims = decodeJwtPayload(response.data.accessToken);

    // Extrai userType do JWT: tenta grupos Keycloak, roles e atributo customizado
    const groups: string[] = claims.groups ?? [];
    const roles: string[] = claims.realm_access?.roles ?? [];
    const isProvider =
      groups.some((g: string) => g.toLowerCase().includes("provider")) ||
      roles.some((r: string) => r.toLowerCase() === "provider") ||
      claims.userType === "provider" ||
      claims.user_type === "provider";

    return {
      id: claims.sub,
      name: claims.name ?? claims.given_name ?? username,
      email: claims.email ?? username,
      type: isProvider ? "provider" : "contractor",
    };
  },

  async refresh(): Promise<void> {
    const refreshToken = await TokenService.getRefresh();
    if (!refreshToken) throw new Error("No refresh token available");

    try {
      const response = await apiClient.post(
        AUTH_ENDPOINTS.TOKEN,
        { grantType: HEADERS.GRANT_TYPE.REFRESH_TOKEN, refreshToken },
        { _skipGlobalError: true, _skipRefresh: true },
      );

      await TokenService.save({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
    } catch (error) {
      await TokenService.clear();
      throw error;
    }
  },

  async logout(): Promise<void> {
    const refreshToken = await TokenService.getRefresh();
    if (refreshToken) {
      try {
        await apiClient.post(
          AUTH_ENDPOINTS.LOGOUT,
          { refreshToken },
          { _skipGlobalError: true },
        );
      } catch {
        // logout failure is non-fatal
      }
    }
    await TokenService.clear();
  },

  async forgotPassword({ email }: ForgotPasswordServiceParams): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email }, { _skipGlobalError: true });
  },

  async register(params: RegisterServiceParams): Promise<RegisterServiceResult> {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.REGISTER,
      params,
      { _skipGlobalError: true },
    );
    return response.data;
  },

  async saveAddress(params: SaveAddressParams): Promise<SaveAddressResult> {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.ADDRESS_SAVE,
      params,
      { _skipGlobalError: true },
    );
    return response.data;
  },

  async sendVerificationCode(params: {
    type: "email" | "sms";
    destination: string;
  }): Promise<SendCodeResult> {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.VERIFICATION_SEND,
      params,
      { _skipGlobalError: true, _skipRefresh: true },
    );
    return response.data;
  },

  async verifyCode(params: {
    type: "email" | "sms";
    destination: string;
    code: string;
    keycloakId?: string;
  }): Promise<VerifyCodeResult> {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.VERIFICATION_VERIFY,
      params,
      { _skipGlobalError: true, _skipRefresh: true },
    );
    return response.data;
  },

  async getVerificationStatus(): Promise<{
    emailVerified: boolean;
    phoneVerified: boolean;
    status: string;
  }> {
    const response = await apiClient.get(AUTH_ENDPOINTS.VERIFICATION_STATUS, { _skipGlobalError: true, _skipRefresh: true });
    return response.data;
  },

  async getAppConfig(): Promise<{
    features: {
      documentPhotoVerification: boolean;
    };
  }> {
    const response = await apiClient.get(AUTH_ENDPOINTS.APP_CONFIG);
    return response.data;
  },

  async getOnboardingStatus(): Promise<OnboardingStatusResult> {
    const response = await apiClient.get(AUTH_ENDPOINTS.ONBOARDING_STATUS);
    return response.data;
  },

  async getAccountBlockStatus(): Promise<{
    blocked: boolean;
    status: string;
    reason: string | null;
    message: string | null;
    title: string | null;
    icon: string | null;
    severity: string | null;
    actions: Array<{
      type: string;
      label: string;
      url?: string;
      route?: string;
      variant?: string;
    }>;
    canRetryAt: string | null;
  }> {
    const response = await apiClient.get(AUTH_ENDPOINTS.ACCOUNT_STATUS);
    return response.data;
  },

  async initiateSelfUnlock({ blockId }: SelfUnlockInitiateParams): Promise<SelfUnlockInitiateResult> {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.SELF_UNLOCK(blockId),
      {},
      { _skipGlobalError: true },
    );
    return response.data;
  },

  async verifySelfUnlock({ blockId, code }: SelfUnlockVerifyParams): Promise<SelfUnlockVerifyResult> {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.SELF_UNLOCK_VERIFY(blockId),
      { code },
      { _skipGlobalError: true },
    );
    return response.data;
  },

  async getServices(): Promise<GetServicesResult> {
    const response = await apiClient.get(AUTH_ENDPOINTS.SERVICES, { _skipGlobalError: true });
    return response.data;
  },

  async createCategory(params: CreateCategoryParams): Promise<CreateCategoryResult> {
    const response = await apiClient.post(AUTH_ENDPOINTS.CATEGORIES_CREATE, params, { _skipGlobalError: true });
    return response.data;
  },

  async createServiceCatalog(params: CreateServiceCatalogParams): Promise<CreateServiceCatalogResult> {
    const response = await apiClient.post(AUTH_ENDPOINTS.SERVICES_CREATE, params, { _skipGlobalError: true });
    return response.data;
  },

  async getCategories(): Promise<GetCategoriesResult> {
    const response = await apiClient.get(AUTH_ENDPOINTS.CATEGORIES, { _skipGlobalError: true });
    return response.data;
  },

  async createProviderService(params: CreateProviderServiceParams): Promise<CreateProviderServiceResult> {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.PROVIDER_SERVICES,
      params,
      { _skipGlobalError: true },
    );
    return response.data;
  },

  async getProviderServices(): Promise<GetProviderServicesResult> {
    const response = await apiClient.get(AUTH_ENDPOINTS.PROVIDER_SERVICES, { _skipGlobalError: true });
    return response.data;
  },

  async updateProviderService(
    serviceId: string,
    params: UpdateProviderServiceParams,
  ): Promise<UpdateProviderServiceResult> {
    const response = await apiClient.put(
      AUTH_ENDPOINTS.PROVIDER_SERVICE_UPDATE(serviceId),
      params,
      { _skipGlobalError: true },
    );
    return response.data;
  },

  async deleteProviderService(serviceId: string): Promise<void> {
    await apiClient.delete(AUTH_ENDPOINTS.PROVIDER_SERVICE_DELETE(serviceId));
  },

  async setProviderAvailability(params: SetProviderAvailabilityParams): Promise<SetProviderAvailabilityResult> {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.PROVIDER_AVAILABILITY,
      params,
      { _skipGlobalError: true },
    );
    return response.data;
  },

  async getProviderAvailability(): Promise<GetProviderAvailabilityResult> {
    const response = await apiClient.get(AUTH_ENDPOINTS.PROVIDER_AVAILABILITY, { _skipGlobalError: true });
    return response.data;
  },

  async updateProviderAvailability(
    params: UpdateProviderAvailabilityParams,
  ): Promise<UpdateProviderAvailabilityResult> {
    const response = await apiClient.put(
      AUTH_ENDPOINTS.PROVIDER_AVAILABILITY_BY_ID(params.id),
      { startTime: params.startTime, endTime: params.endTime },
      { _skipGlobalError: true },
    );
    return response.data;
  },

  async deleteProviderAvailability(id: string): Promise<DeleteProviderAvailabilityResult> {
    const response = await apiClient.delete(
      AUTH_ENDPOINTS.PROVIDER_AVAILABILITY_BY_ID(id),
      { _skipGlobalError: true },
    );
    return response.data;
  },
};
