import { apiClient } from "@/shared/services/api-client";
import { AUTH_ENDPOINTS } from "../auth.constants";
import { useRegisterStore } from "../store/register.store";
import { useAuthStore } from "../store";

export type DocumentType = "RG" | "CNH" | "CPF" | "CNPJ" | "PASSPORT";

export type UploadDocumentPayload = {
  file: {
    uri: string;
    name: string;
    type: string;
  };
  documentType: DocumentType;
  documentNumber?: string;
};

export type DocumentStatus = "PENDING" | "VERIFIED" | "APPROVED" | "REJECTED";

export type UserDocument = {
  id: string;
  documentType: DocumentType;
  status: DocumentStatus;
  uploadedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
  fileUrl?: string;
};

export const DocumentService = {
  async uploadDocument(payload: UploadDocumentPayload): Promise<{ id: string; status: DocumentStatus }> {
    const keycloakId =
      useRegisterStore.getState().keycloakId ??
      useAuthStore.getState().user?.id ??
      null;

    if (!keycloakId) {
      const error = new Error("Usuário não identificado. Faça login e tente novamente.");
      (error as any).code = "KEYCLOAK_ID_MISSING";
      throw error;
    }

    const formData = new FormData();
    
    // @ts-ignore — React Native FormData aceita objetos com uri
    formData.append("file", {
      uri: payload.file.uri,
      name: payload.file.name,
      type: payload.file.type,
    });
    formData.append("documentType", payload.documentType);
    if (payload.documentNumber) {
      formData.append("documentNumber", payload.documentNumber);
    }

    const response = await apiClient.post(
      AUTH_ENDPOINTS.DOCUMENT_UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-User-Id": keycloakId,
        },
      }
    );

    return response.data;
  },

  async listDocuments(): Promise<UserDocument[]> {
    const response = await apiClient.get("/bff/auth/documents");
    return response.data || [];
  },
};
