import { AUTH_ENDPOINTS } from "@/modules/auth/auth.constants";
import { apiClient } from "@/shared/services/api-client";
import type { DocumentType } from "@/modules/auth/services/document.service";

export type UserProfileResponse = {
  id: string;
  keycloakId: string;
  fullName: string;
  status: string;
  type: string;
  primaryPhone?: string;
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
  isPrimary: boolean;
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
  isPrimary?: boolean;
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
  documentNumber?: string;
  file: { uri: string; name: string; type: string };
};

export type UploadAccountDocumentServiceResult = {
  id: string;
  documentType: DocumentType;
  status: string;
};

export type AccountDocumentItem = {
  id: string;
  documentType: string;
  documentNumber?: string;
  status: string;
  uploadedAt: string;
  verifiedAt?: string | null;
};

export type ProviderServiceSummaryItem = {
  id: string;
  categoryName: string;
  serviceName: string;
  isActive: boolean;
};

export type ProviderAvailabilitySummaryItem = {
  id: string;
  dayOfWeek: number;
  isActive: boolean;
};

export type PaymentMethodType = {
  id: string;
  name: string;
  label: string;
  icon: string | null;
};

export type PixKeyType = "cpf" | "cnpj" | "email" | "phone" | "random";

export type PixDetails = {
  pixKeyType: PixKeyType;
  pixKey: string;
};

export type BankTransferDetails = {
  bank: string;
  agency: string;
  account: string;
  accountType: "checking" | "savings";
};

export type CardBrand = "visa" | "mastercard" | "elo" | "hipercard" | "amex";

export type CardDetails = {
  acceptedBrands: CardBrand[];
};

export type PaymentMethodDetails = PixDetails | BankTransferDetails | CardDetails;

export type SetProviderPaymentMethodEntry = {
  paymentMethodTypeId: string;
  details: PaymentMethodDetails | null;
};

export type ProviderPaymentMethod = {
  id: string;
  paymentMethodTypeId: string;
  name: string;
  label: string;
  icon: string | null;
  isEnabled: boolean;
  details: PaymentMethodDetails | null;
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
    try {
      const response = await apiClient.post<ContactCheckServiceResult>(
        AUTH_ENDPOINTS.ACCOUNT_EMAIL_CHECK,
        { contact: params.contact },
        { _skipGlobalError: true },
      );
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 409) return { available: false };
      throw error;
    }
  },

  async checkPhoneAvailability(
    params: ContactCheckServiceParams,
  ): Promise<ContactCheckServiceResult> {
    try {
      const response = await apiClient.post<ContactCheckServiceResult>(
        AUTH_ENDPOINTS.ACCOUNT_PHONE_CHECK,
        { contact: params.contact },
        { _skipGlobalError: true },
      );
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 409) return { available: false };
      throw error;
    }
  },

  async initiateEmailChange(
    params: InitiateContactChangeServiceParams,
  ): Promise<InitiateContactChangeServiceResult> {
    const response = await apiClient.post<InitiateContactChangeServiceResult>(
      AUTH_ENDPOINTS.ACCOUNT_EMAIL_CHANGE,
      { contact: params.contact },
      { _skipGlobalError: true },
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
      { _skipGlobalError: true },
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
    if (params.documentNumber) formData.append("documentNumber", params.documentNumber);
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

  async deleteDocument(documentId: string): Promise<void> {
    await apiClient.delete(AUTH_ENDPOINTS.ACCOUNT_DOCUMENT_DELETE(documentId));
  },

  async listAccountDocuments(): Promise<AccountDocumentItem[]> {
    const response = await apiClient.get<AccountDocumentItem[]>(
      AUTH_ENDPOINTS.ACCOUNT_DOCUMENTS_LIST,
    );
    return response.data;
  },

  async listProviderServices(): Promise<ProviderServiceSummaryItem[]> {
    const response = await apiClient.get<{ success: boolean; data: ProviderServiceSummaryItem[] }>(
      AUTH_ENDPOINTS.PROVIDER_SERVICES,
      { _skipGlobalError: true },
    );
    return response.data.data;
  },

  async listProviderAvailability(): Promise<ProviderAvailabilitySummaryItem[]> {
    const response = await apiClient.get<{ success: boolean; data: ProviderAvailabilitySummaryItem[] }>(
      AUTH_ENDPOINTS.PROVIDER_AVAILABILITY,
      { _skipGlobalError: true },
    );
    return response.data.data;
  },

  async listPaymentMethodTypes(): Promise<PaymentMethodType[]> {
    const response = await apiClient.get<{ success: boolean; data: PaymentMethodType[] }>(
      AUTH_ENDPOINTS.PAYMENT_METHOD_TYPES,
      { _skipGlobalError: true },
    );
    return response.data.data;
  },

  async listProviderPaymentMethods(): Promise<ProviderPaymentMethod[]> {
    const response = await apiClient.get<{ success: boolean; data: ProviderPaymentMethod[] }>(
      AUTH_ENDPOINTS.PROVIDER_PAYMENT_METHODS,
      { _skipGlobalError: true },
    );
    return response.data.data;
  },

  async setProviderPaymentMethods(methods: SetProviderPaymentMethodEntry[]): Promise<void> {
    await apiClient.put(AUTH_ENDPOINTS.PROVIDER_PAYMENT_METHODS, { methods }, { _skipGlobalError: true });
  },

  async checkPixKeyAvailability(pixKey: string): Promise<{ available: boolean }> {
    const response = await apiClient.get<{ available: boolean }>(
      `${AUTH_ENDPOINTS.PROVIDER_PIX_KEY_CHECK}?key=${encodeURIComponent(pixKey)}`,
      { _skipGlobalError: true },
    );
    return response.data;
  },

  async getDocumentUrl(documentId: string): Promise<{ url: string; expiresIn: number }> {
    const response = await apiClient.get<{ url: string; expiresIn: number }>(
      AUTH_ENDPOINTS.ACCOUNT_DOCUMENT_URL(documentId),
    );
    return response.data;
  },
};
