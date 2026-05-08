import { useState } from "react";
import { DocumentService } from "../services/document.service";
import type { DocumentType, UploadDocumentPayload } from "../services/document.service";

export function useDocumentUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDocument, setUploadedDocument] = useState<{ id: string; status: string } | null>(null);

  async function uploadDocument(
    fileUri: string,
    fileName: string,
    fileType: string,
    documentType: DocumentType
  ): Promise<void> {
    setIsUploading(true);
    setError(null);

    try {
      const payload: UploadDocumentPayload = {
        file: {
          uri: fileUri,
          name: fileName,
          type: fileType,
        },
        documentType,
      };

      const result = await DocumentService.uploadDocument(payload);
      setUploadedDocument(result);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Erro ao enviar documento";
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }

  return { uploadDocument, isUploading, error, uploadedDocument };
}
