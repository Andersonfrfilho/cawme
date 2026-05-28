import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { useLoading } from "@/shared/hooks/useLoading";
import { userAction } from "@/shared/utils/logger";
import type { SendCodeParams, SendCodeResult, VerifyCodeParams, VerifyCodeResult } from "../services/types";

export function useVerification() {
  const { showLoading, hideLoading } = useLoading();

  async function sendCode(params: SendCodeParams): Promise<SendCodeResult> {
    userAction('verification.send', 'User requested verification code', { type: params.type });
    showLoading();

    try {
      const result = await KeycloakService.sendVerificationCode(params);
      userAction('verification.sent', 'Verification code sent successfully');
      return result;
    } catch (error) {
      userAction('verification.send_error', 'Failed to send verification code');
      throw error;
    } finally {
      hideLoading();
    }
  }

  async function verifyCode(params: VerifyCodeParams): Promise<VerifyCodeResult> {
    userAction('verification.verify', 'User entered verification code', { type: params.type });
    showLoading();
    
    try {
      const result = await KeycloakService.verifyCode(params);
      userAction('verification.result', 'Code verification completed', { verified: result.verified });
      return result;
    } catch (error) {
      userAction('verification.verify_error', 'Code verification failed');
      throw error;
    } finally {
      hideLoading();
    }
  }

  return { sendCode, verifyCode };
}
