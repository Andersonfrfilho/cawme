import { AUTH_ENDPOINTS } from "@/modules/auth/auth.constants";
import { apiClient } from "@/shared/services/api-client";

export type UserProfileResponse = {
  id: string;
  keycloakId: string;
  fullName: string;
  status: string;
  type: string;
};

export type UpdateNameServiceParams = {
  fullName: string;
};

export type InitiateContactChangeServiceParams = {
  contact: string;
};

export type InitiateContactChangeServiceResult = {
  contactId: string;
  destination: string;
};

export type ConfirmContactChangeServiceParams = {
  contactId: string;
  code: string;
};

export const AccountService = {
  async getProfile(): Promise<UserProfileResponse> {
    const response = await apiClient.get<{ data: UserProfileResponse }>(
      AUTH_ENDPOINTS.ACCOUNT_PROFILE,
    );
    return response.data.data;
  },

  async updateName(params: UpdateNameServiceParams): Promise<UserProfileResponse> {
    const response = await apiClient.put<{ data: UserProfileResponse }>(
      AUTH_ENDPOINTS.ACCOUNT_UPDATE_NAME,
      { fullName: params.fullName },
    );
    return response.data.data;
  },

  async initiateEmailChange(
    params: InitiateContactChangeServiceParams,
  ): Promise<InitiateContactChangeServiceResult> {
    const response = await apiClient.post<{ data: InitiateContactChangeServiceResult }>(
      AUTH_ENDPOINTS.ACCOUNT_EMAIL_CHANGE,
      { contact: params.contact },
    );
    return response.data.data;
  },

  async confirmEmailChange(params: ConfirmContactChangeServiceParams): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.ACCOUNT_EMAIL_CHANGE_CONFIRM, {
      contactId: params.contactId,
      code: params.code,
    });
  },

  async initiatePhoneChange(
    params: InitiateContactChangeServiceParams,
  ): Promise<InitiateContactChangeServiceResult> {
    const response = await apiClient.post<{ data: InitiateContactChangeServiceResult }>(
      AUTH_ENDPOINTS.ACCOUNT_PHONE_CHANGE,
      { contact: params.contact },
    );
    return response.data.data;
  },

  async confirmPhoneChange(params: ConfirmContactChangeServiceParams): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.ACCOUNT_PHONE_CHANGE_CONFIRM, {
      contactId: params.contactId,
      code: params.code,
    });
  },
};
