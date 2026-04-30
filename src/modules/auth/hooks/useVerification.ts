import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { useLoading } from "@/shared/hooks/useLoading";
import type { SendCodeParams, VerifyCodeParams, VerifyCodeResult } from "../services/types";

export function useVerification() {
  const { showLoading, hideLoading } = useLoading();

  async function sendCode(params: SendCodeParams): Promise<void> {
    showLoading();
    try {
      await KeycloakService.sendVerificationCode(params);
    } finally {
      hideLoading();
    }
  }

  async function verifyCode(params: VerifyCodeParams): Promise<VerifyCodeResult> {
    showLoading();
    try {
      return await KeycloakService.verifyCode(params);
    } finally {
      hideLoading();
    }
  }

  return { sendCode, verifyCode };
}
