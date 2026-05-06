import { apiClient } from "@/shared/services/api-client";
import type { CompanyFormValues } from "../screens/create-company/types";

export type CreateCompanyPayload = {
  document: string;
  companyName: string;
  tradeName?: string;
  email: string;
  phone: string;
  stateRegistration?: string;
  municipalRegistration?: string;
  address: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    type: "headquarters";
    isDefault: true;
  };
  businessHours?: Array<{
    dayOfWeek: number;
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
  }>;
};

export type CreateCompanyResult = {
  id: string;
  companyName: string;
  tradeName?: string;
  document: string;
  status: string;
};

export const CompanyService = {
  async createCompany(payload: CreateCompanyPayload): Promise<CreateCompanyResult> {
    const response = await apiClient.post("/bff/companies", payload);
    return response.data;
  },
};
