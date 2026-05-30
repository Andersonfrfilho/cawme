import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useLoading } from "@/shared/hooks/useLoading";

import { AccountService } from "../services/account.service";
import type {
  InitiateContactChangeServiceResult,
  SaveAddressServiceParams,
  UserAddress,
  UploadAccountDocumentServiceParams,
  UploadAccountDocumentServiceResult,
} from "../services/account.service";

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

export type CheckContactAvailabilityParams = {
  contact: string;
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

  async function checkContactAvailability(
    params: CheckContactAvailabilityParams,
  ): Promise<boolean> {
    showLoading();
    try {
      const result =
        params.type === "email"
          ? await AccountService.checkEmailAvailability({ contact: params.contact })
          : await AccountService.checkPhoneAvailability({ contact: params.contact });
      return result.available;
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
        if (user) setUser({ ...user });
      } else {
        await AccountService.confirmPhoneChange({
          contactId: params.contactId,
          code: params.code,
        });
        if (user) setUser({ ...user });
      }
    } finally {
      hideLoading();
    }
  }

  async function listAddresses(): Promise<UserAddress[]> {
    showLoading();
    try {
      return await AccountService.listAddresses();
    } finally {
      hideLoading();
    }
  }

  async function saveAddress(params: SaveAddressServiceParams): Promise<UserAddress> {
    showLoading();
    try {
      return await AccountService.saveAddress(params);
    } finally {
      hideLoading();
    }
  }

  async function deleteAddress(addressId: string): Promise<void> {
    showLoading();
    try {
      await AccountService.deleteAddress(addressId);
    } finally {
      hideLoading();
    }
  }

  async function uploadDocument(
    params: UploadAccountDocumentServiceParams,
  ): Promise<UploadAccountDocumentServiceResult> {
    showLoading();
    try {
      return await AccountService.uploadDocument(params);
    } finally {
      hideLoading();
    }
  }

  return {
    updateName,
    checkContactAvailability,
    initiateContactChange,
    confirmContactChange,
    listAddresses,
    saveAddress,
    deleteAddress,
    uploadDocument,
  };
}
