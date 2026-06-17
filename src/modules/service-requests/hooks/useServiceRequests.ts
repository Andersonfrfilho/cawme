import { useCallback } from "react";

import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useLoading } from "@/shared/hooks/useLoading";

import { ServiceRequestsService } from "../services/service-requests.service";
import type {
  CreateServiceRequestServiceParams,
  ServiceRequest,
} from "../types/service-requests.types";

export type CreateServiceRequestParams = CreateServiceRequestServiceParams;

export function useServiceRequests() {
  const userType = useAuthStore((state) => state.user?.type === "provider" ? "PROVIDER" : "CUSTOMER");
  const { showLoading, hideLoading } = useLoading();

  const listMyRequests = useCallback(
    (): Promise<ServiceRequest[]> => ServiceRequestsService.list({ userType }),
    [userType],
  );

  const createServiceRequest = useCallback(
    async (params: CreateServiceRequestParams): Promise<ServiceRequest> => {
      showLoading();
      try {
        return await ServiceRequestsService.create(params);
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading],
  );

  const cancelRequest = useCallback(
    async (id: string): Promise<ServiceRequest> => {
      showLoading();
      try {
        return await ServiceRequestsService.cancel(id);
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading],
  );

  const acceptRequest = useCallback(
    async (id: string): Promise<ServiceRequest> => {
      showLoading();
      try {
        return await ServiceRequestsService.accept(id);
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading],
  );

  const rejectRequest = useCallback(
    async (id: string): Promise<ServiceRequest> => {
      showLoading();
      try {
        return await ServiceRequestsService.reject(id);
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading],
  );

  const completeRequest = useCallback(
    async (id: string): Promise<ServiceRequest> => {
      showLoading();
      try {
        return await ServiceRequestsService.complete(id);
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading],
  );

  return {
    createServiceRequest,
    listMyRequests,
    cancelRequest,
    acceptRequest,
    rejectRequest,
    completeRequest,
  };
}
