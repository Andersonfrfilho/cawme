import { useState, useEffect, useCallback } from "react";
import { KeycloakService } from "../services/keycloak.service";
import { DocumentService, type DocumentStatus } from "../services/document.service";
import { useAuthStore } from "../store/auth.store";

export type PendingVerificationStatus = {
  emailVerified: boolean;
  phoneVerified: boolean;
  documentVerified: boolean;
  pendingCount: number;
  isLoading: boolean;
};

const DOCUMENT_PENDING_STATUSES: DocumentStatus[] = ["PENDING", "REJECTED"];

export function usePendingVerification() {
  const [status, setStatus] = useState<PendingVerificationStatus>({
    emailVerified: true,
    phoneVerified: true,
    documentVerified: true,
    pendingCount: 0,
    isLoading: true,
  });

  const checkStatus = useCallback(async () => {
    // Lê o estado local no momento da execução para evitar stale closure
    const local = useAuthStore.getState().verificationStatus;
    let emailVerified = local.emailVerified;
    let phoneVerified = local.phoneVerified;
    let documentVerified = true;

    try {
      const verificationData = await KeycloakService.getVerificationStatus();
      // Verificação local sobrescreve a API quando o BFF ainda não sincronizou com o Keycloak
      emailVerified = verificationData.emailVerified || local.emailVerified;
      phoneVerified = verificationData.phoneVerified || local.phoneVerified;
    } catch {
      // Se falhar, mantém o estado local
    }

    try {
      const documents = await DocumentService.listDocuments();
      // Sem documentos = usuário ainda não enviou nenhum → pendente
      documentVerified =
        documents.length > 0 &&
        !documents.some((doc) => DOCUMENT_PENDING_STATUSES.includes(doc.status));
    } catch {
      documentVerified = false;
    }

    const pendingCount =
      (emailVerified ? 0 : 1) +
      (phoneVerified ? 0 : 1) +
      (documentVerified ? 0 : 1);

    setStatus({
      emailVerified,
      phoneVerified,
      documentVerified,
      pendingCount,
      isLoading: false,
    });
  }, []);

  const localVerification = useAuthStore((state) => state.verificationStatus);

  useEffect(() => {
    checkStatus();
  }, [checkStatus, localVerification]);

  const pendingItems = [
    !status.emailVerified && "email",
    !status.phoneVerified && "phone",
    !status.documentVerified && "document",
  ].filter(Boolean) as string[];

  return { ...status, pendingItems, refresh: checkStatus };
}
