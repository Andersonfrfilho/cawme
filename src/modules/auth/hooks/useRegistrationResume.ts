import { router } from "expo-router";
import { KeycloakService } from "@/modules/auth/services/keycloak.service";
import { useRegisterStore } from "@/modules/auth/store/register.store";
import type { OnboardingStep } from "@/modules/auth/services/types";

type ResumeResult =
  | { resumed: false }
  | { resumed: true; step: OnboardingStep };

export function useRegistrationResume() {
  async function checkAndResume(): Promise<ResumeResult> {
    const pending = useRegisterStore.getState().pendingRegistration;
    if (!pending) return { resumed: false };

    try {
      const status = await KeycloakService.getOnboardingStatus();

      if (status.step === "complete") {
        useRegisterStore.getState().clearPendingRegistration();
        return { resumed: false };
      }

      redirectToStep(status.step, pending);
      return { resumed: true, step: status.step };
    } catch {
      return { resumed: false };
    }
  }

  return { checkAndResume };
}

function redirectToStep(
  step: OnboardingStep,
  pending: NonNullable<ReturnType<typeof useRegisterStore.getState>["pendingRegistration"]>,
): void {
  const baseParams = {
    firstName: pending.firstName,
    lastName: pending.lastName,
    email: pending.email,
    phone: pending.phone,
    document: pending.document,
    documentType: pending.documentType,
    password: pending.password,
    keycloakId: pending.keycloakId,
  };

  switch (step) {
    case "address":
      router.replace({
        pathname: "/(auth)/address" as any,
        params: baseParams,
      });
      break;

    case "verification":
      router.replace({
        pathname: "/(auth)/verification" as any,
        params: {
          email: pending.email,
          phone: pending.phone,
          firstName: pending.firstName,
          lastName: pending.lastName,
          mode: "post-register",
        },
      });
      break;

    case "document":
      router.replace({
        pathname: "/(auth)/document-upload" as any,
        params: {
          keycloakId: pending.keycloakId,
          documentType: pending.documentType,
          mode: "post-register",
        },
      });
      break;

    default:
      break;
  }
}
