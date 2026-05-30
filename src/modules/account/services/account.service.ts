import { AUTH_ENDPOINTS } from "@/modules/auth/auth.constants";
import { apiClient } from "@/shared/services/api-client";
import type { DocumentType } from "@/modules/auth/services/document.service";

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

export type ContactCheckServiceParams = {
  contact: string;
};

export type ContactCheckServiceResult = {
  available: boolean;
};

export type UserAddress = {
  id: string;
  label: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postcode: string;
  latitude?: number;
  longitude?: number;
};

export type SaveAddressServiceParams = {
  id?: string;
  label: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postcode: string;
  latitude?: number;
  longitude?: number;
};

export type UploadAccountDocumentServiceParams = {
  documentType: DocumentType;
  file: { uri: string; name: string; type: string };
};

export type UploadAccountDocumentServiceResult = {
  id: string;
  documentType: DocumentType;
  status: string;
};

export const AccountService = {
  async getProfile(): Promise<UserProfileResponse> {
    const response = await apiClient.get<UserProfileResponse>(
      AUTH_ENDPOINTS.ACCOUNT_PROFILE,
    );
    return response.data;
  },

  async updateName(params: UpdateNameServiceParams): Promise<UserProfileResponse> {
    const response = await apiClient.put<UserProfileResponse>(
      AUTH_ENDPOINTS.ACCOUNT_UPDATE_NAME,
      { fullName: params.fullName },
    );
    return response.data;
  },

  async checkEmailAvailability(
    params: ContactCheckServiceParams,
  ): Promise<ContactCheckServiceResult> {
    const response = await apiClient.post<ContactCheckServiceResult>(
      AUTH_ENDPOINTS.ACCOUNT_EMAIL_CHECK,
      { contact: params.contact },
    );
    return response.data;
  },

  async checkPhoneAvailability(
    params: ContactCheckServiceParams,
  ): Promise<ContactCheckServiceResult> {
    const response = await apiClient.post<ContactCheckServiceResult>(
      AUTH_ENDPOINTS.ACCOUNT_PHONE_CHECK,
      { contact: params.contact },
    );
    return response.data;
  },

  async initiateEmailChange(
    params: InitiateContactChangeServiceParams,
  ): Promise<InitiateContactChangeServiceResult> {
    const response = await apiClient.post<InitiateContactChangeServiceResult>(
      AUTH_ENDPOINTS.ACCOUNT_EMAIL_CHANGE,
      { contact: params.contact },
    );
    return response.data;
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
    const response = await apiClient.post<InitiateContactChangeServiceResult>(
      AUTH_ENDPOINTS.ACCOUNT_PHONE_CHANGE,
      { contact: params.contact },
    );
    return response.data;
  },

  async confirmPhoneChange(params: ConfirmContactChangeServiceParams): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.ACCOUNT_PHONE_CHANGE_CONFIRM, {
      contactId: params.contactId,
      code: params.code,
    });
  },

  async listAddresses(): Promise<UserAddress[]> {
    const response = await apiClient.get<UserAddress[]>(AUTH_ENDPOINTS.ACCOUNT_ADDRESS_UPDATE);
    return response.data;
  },

  async saveAddress(params: SaveAddressServiceParams): Promise<UserAddress> {
    if (params.id) {
      const response = await apiClient.put<UserAddress>(
        `${AUTH_ENDPOINTS.ACCOUNT_ADDRESS_UPDATE}/${params.id}`,
        params,
      );
      return response.data;
    }
    const response = await apiClient.post<UserAddress>(
      AUTH_ENDPOINTS.ACCOUNT_ADDRESS_UPDATE,
      params,
    );
    return response.data;
  },

  async deleteAddress(addressId: string): Promise<void> {
    await apiClient.delete(`${AUTH_ENDPOINTS.ACCOUNT_ADDRESS_UPDATE}/${addressId}`);
  },

  async uploadDocument(
    params: UploadAccountDocumentServiceParams,
  ): Promise<UploadAccountDocumentServiceResult> {
    const formData = new FormData();
    formData.append("documentType", params.documentType);
    formData.append("file", {
      uri: params.file.uri,
      name: params.file.name,
      type: params.file.type,
    } as any);
    const response = await apiClient.post<UploadAccountDocumentServiceResult>(
      AUTH_ENDPOINTS.ACCOUNT_DOCUMENT_UPLOAD,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },
};
