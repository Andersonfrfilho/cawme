import { apiClient } from "@/shared/services/api-client";

import type {
  CreateServiceRequestServiceParams,
  CreateServiceRequestServiceResult,
  ListServiceRequestsServiceParams,
  ListServiceRequestsServiceResult,
  ServiceRequest,
  UpdateServiceRequestServiceResult,
} from "../types/service-requests.types";

const BASE = "/bff/service-requests";

export const ServiceRequestsService = {
  async create(
    params: CreateServiceRequestServiceParams,
  ): Promise<CreateServiceRequestServiceResult> {
    const response = await apiClient.post<CreateServiceRequestServiceResult>(BASE, params, { _skipGlobalError: true });
    return response.data;
  },

  async list(
    params?: ListServiceRequestsServiceParams,
  ): Promise<ListServiceRequestsServiceResult> {
    const response = await apiClient.get<ListServiceRequestsServiceResult>(BASE, {
      headers: params?.userType ? { "x-user-type": params.userType } : undefined,
      _skipGlobalError: true,
    });
    return response.data;
  },

  async findById(id: string): Promise<ServiceRequest> {
    const response = await apiClient.get<ServiceRequest>(`${BASE}/${id}`, { _skipGlobalError: true });
    return response.data;
  },

  async accept(id: string): Promise<UpdateServiceRequestServiceResult> {
    const response = await apiClient.put<UpdateServiceRequestServiceResult>(
      `${BASE}/${id}/accept`,
      undefined,
      { _skipGlobalError: true },
    );
    return response.data;
  },

  async reject(id: string): Promise<UpdateServiceRequestServiceResult> {
    const response = await apiClient.put<UpdateServiceRequestServiceResult>(
      `${BASE}/${id}/reject`,
      undefined,
      { _skipGlobalError: true },
    );
    return response.data;
  },

  async complete(id: string): Promise<UpdateServiceRequestServiceResult> {
    const response = await apiClient.put<UpdateServiceRequestServiceResult>(
      `${BASE}/${id}/complete`,
      undefined,
      { _skipGlobalError: true },
    );
    return response.data;
  },

  async cancel(id: string): Promise<UpdateServiceRequestServiceResult> {
    const response = await apiClient.put<UpdateServiceRequestServiceResult>(
      `${BASE}/${id}/cancel`,
      undefined,
      { _skipGlobalError: true },
    );
    return response.data;
  },
};
