import { apiClient } from "@/shared/services/api-client";

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

export type CompanyListItem = {
  id: string;
  companyName: string;
  tradeName: string | null;
  document: string;
  status: string;
};

export type CompanyMember = {
  id: string;
  userId: string;
  role: string;
  status: string;
};

export type CompanyProvider = {
  id: string;
  providerId: string;
  role: string | null;
  status: string;
};

export type CompanyDetails = {
  id: string;
  document: string;
  companyName: string;
  tradeName: string | null;
  status: string;
  emails: Array<{ id: string; email: string; isDefault: boolean }>;
  phones: Array<{ id: string; phone: string; isDefault: boolean }>;
  addresses: Array<{ id: string; street: string; city: string; state: string; isDefault: boolean }>;
  members: CompanyMember[];
  providers: CompanyProvider[];
};

export type AddCompanyProviderParams = {
  companyId: string;
  providerId: string;
  role?: string;
};

export const CompanyService = {
  async createCompany(payload: CreateCompanyPayload): Promise<CreateCompanyResult> {
    const response = await apiClient.post("/bff/companies", payload);
    return response.data;
  },

  async listMyCompanies(): Promise<CompanyListItem[]> {
    const response = await apiClient.get<CompanyListItem[]>("/bff/companies/me");
    return response.data;
  },

  async getCompanyDetails(id: string): Promise<CompanyDetails> {
    const response = await apiClient.get<CompanyDetails>(`/bff/companies/${id}`);
    return response.data;
  },

  async addCompanyProvider(params: AddCompanyProviderParams): Promise<void> {
    await apiClient.post(`/bff/companies/${params.companyId}/providers`, {
      providerId: params.providerId,
      role: params.role,
    });
  },
};
