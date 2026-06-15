import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useLoading } from "@/shared/hooks/useLoading";

import { ServiceRequestsService } from "../services/service-requests.service";
import type {
  CreateServiceRequestServiceParams,
  ServiceRequest,
} from "../types/service-requests.types";

export type CreateServiceRequestParams = CreateServiceRequestServiceParams;

export function useServiceRequests() {
  const user = useAuthStore((state) => state.user);
  const { showLoading, hideLoading } = useLoading();

  async function createServiceRequest(
    params: CreateServiceRequestParams,
  ): Promise<ServiceRequest> {
    showLoading();
    try {
      return await ServiceRequestsService.create(params);
    } finally {
      hideLoading();
    }
  }

  async function listMyRequests(): Promise<ServiceRequest[]> {
    showLoading();
    try {
      const userType = user?.type === "provider" ? "PROVIDER" : "CUSTOMER";
      return await ServiceRequestsService.list({ userType });
    } finally {
      hideLoading();
    }
  }

  async function cancelRequest(id: string): Promise<ServiceRequest> {
    showLoading();
    try {
      return await ServiceRequestsService.cancel(id);
    } finally {
      hideLoading();
    }
  }

  async function acceptRequest(id: string): Promise<ServiceRequest> {
    showLoading();
    try {
      return await ServiceRequestsService.accept(id);
    } finally {
      hideLoading();
    }
  }

  async function rejectRequest(id: string): Promise<ServiceRequest> {
    showLoading();
    try {
      return await ServiceRequestsService.reject(id);
    } finally {
      hideLoading();
    }
  }

  async function completeRequest(id: string): Promise<ServiceRequest> {
    showLoading();
    try {
      return await ServiceRequestsService.complete(id);
    } finally {
      hideLoading();
    }
  }

  return {
    createServiceRequest,
    listMyRequests,
    cancelRequest,
    acceptRequest,
    rejectRequest,
    completeRequest,
  };
}
