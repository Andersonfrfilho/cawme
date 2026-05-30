import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useLoading } from "@/shared/hooks/useLoading";

import { AccountService } from "../services/account.service";
import type { InitiateContactChangeServiceResult } from "../services/account.service";

export type UpdateNameParams = {
  fullName: string;
};

export type InitiateContactChangeParams = {
  contact: string;
  type: "email" | "phone";
};

export type ConfirmContactChangeParams = {
  contactId: string;
  code: string;
  type: "email" | "phone";
};

export function useAccount() {
  const { user, setUser } = useAuthStore();
  const { showLoading, hideLoading } = useLoading();

  async function updateName(params: UpdateNameParams): Promise<void> {
    showLoading();
    try {
      const response = await AccountService.updateName({ fullName: params.fullName });
      if (user) {
        setUser({ ...user, name: response.fullName });
      }
    } finally {
      hideLoading();
    }
  }

  async function initiateContactChange(
    params: InitiateContactChangeParams,
  ): Promise<InitiateContactChangeServiceResult> {
    showLoading();
    try {
      if (params.type === "email") {
        return await AccountService.initiateEmailChange({ contact: params.contact });
      }
      return await AccountService.initiatePhoneChange({ contact: params.contact });
    } finally {
      hideLoading();
    }
  }

  async function confirmContactChange(params: ConfirmContactChangeParams): Promise<void> {
    showLoading();
    try {
      if (params.type === "email") {
        await AccountService.confirmEmailChange({
          contactId: params.contactId,
          code: params.code,
        });
        if (user) {
          setUser({ ...user });
        }
      } else {
        await AccountService.confirmPhoneChange({
          contactId: params.contactId,
          code: params.code,
        });
        if (user) {
          setUser({ ...user });
        }
      }
    } finally {
      hideLoading();
    }
  }

  return { updateName, initiateContactChange, confirmContactChange };
}
