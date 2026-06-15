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
    const response = await apiClient.post<CreateServiceRequestServiceResult>(BASE, params);
    return response.data;
  },

  async list(
    params?: ListServiceRequestsServiceParams,
  ): Promise<ListServiceRequestsServiceResult> {
    const headers = params?.userType ? { "x-user-type": params.userType } : undefined;
    const response = await apiClient.get<ListServiceRequestsServiceResult>(BASE, { headers });
    return response.data;
  },

  async findById(id: string): Promise<ServiceRequest> {
    const response = await apiClient.get<ServiceRequest>(`${BASE}/${id}`);
    return response.data;
  },

  async accept(id: string): Promise<UpdateServiceRequestServiceResult> {
    const response = await apiClient.put<UpdateServiceRequestServiceResult>(
      `${BASE}/${id}/accept`,
    );
    return response.data;
  },

  async reject(id: string): Promise<UpdateServiceRequestServiceResult> {
    const response = await apiClient.put<UpdateServiceRequestServiceResult>(
      `${BASE}/${id}/reject`,
    );
    return response.data;
  },

  async complete(id: string): Promise<UpdateServiceRequestServiceResult> {
    const response = await apiClient.put<UpdateServiceRequestServiceResult>(
      `${BASE}/${id}/complete`,
    );
    return response.data;
  },

  async cancel(id: string): Promise<UpdateServiceRequestServiceResult> {
    const response = await apiClient.put<UpdateServiceRequestServiceResult>(
      `${BASE}/${id}/cancel`,
    );
    return response.data;
  },
};
