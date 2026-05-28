import axios from "axios";
import { apiClient } from '@/shared/services/api-client';
import { TokenService } from "./token.service";
import { AUTH_ENDPOINTS, CLIENT, HEADERS } from "../auth.constants";
import { BASE_URL, FORM_HEADERS } from "./keycloak.constants";
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
} from "./types";



export const KeycloakService = {
  async login({
    username,
    password,
  }: LoginServiceParams): Promise<LoginServiceResult> {
    const response = await axios.post(
      `${BASE_URL}${AUTH_ENDPOINTS.TOKEN}`,
      new URLSearchParams({
        grant_type: HEADERS.GRANT_TYPE.PASSWORD,
        client_id: CLIENT.ID,
        client_secret: CLIENT.SECRET,
        username,
        password,
      }).toString(),
      { headers: FORM_HEADERS },
    );

    await TokenService.save({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    });

    const claims = decodeJwtPayload(response.data.access_token);

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
      const response = await axios.post(
        `${BASE_URL}${AUTH_ENDPOINTS.TOKEN}`,
        new URLSearchParams({
          grant_type: HEADERS.GRANT_TYPE.REFRESH_TOKEN,
          client_id: CLIENT.ID,
          client_secret: CLIENT.SECRET,
          refresh_token: refreshToken,
        }).toString(),
        { headers: FORM_HEADERS },
      );

      await TokenService.save({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
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
        await axios.post(
          `${BASE_URL}${AUTH_ENDPOINTS.LOGOUT}`,
          new URLSearchParams({
            client_id: CLIENT.ID,
            client_secret: CLIENT.SECRET,
            refresh_token: refreshToken,
          }).toString(),
          { headers: FORM_HEADERS },
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
      { _skipGlobalError: true },
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
      { _skipGlobalError: true },
    );
    return response.data;
  },

  async getVerificationStatus(): Promise<{
    emailVerified: boolean;
    phoneVerified: boolean;
    status: string;
  }> {
    const response = await apiClient.get(AUTH_ENDPOINTS.VERIFICATION_STATUS);
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

  async getCategories(): Promise<GetCategoriesResult> {
    const response = await apiClient.get(AUTH_ENDPOINTS.CATEGORIES);
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
    const response = await apiClient.get(AUTH_ENDPOINTS.PROVIDER_SERVICES);
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
    const response = await apiClient.get(AUTH_ENDPOINTS.PROVIDER_AVAILABILITY);
    return response.data;
  },

  async updateProviderAvailability(
    dayOfWeek: number,
    params: UpdateProviderAvailabilityParams,
  ): Promise<UpdateProviderAvailabilityResult> {
    const response = await apiClient.put(
      AUTH_ENDPOINTS.PROVIDER_AVAILABILITY_UPDATE(dayOfWeek),
      params,
      { _skipGlobalError: true },
    );
    return response.data;
  },
};
