export type ServiceRequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export type ServiceRequest = {
  id: string;
  contractorId: string;
  providerId: string;
  serviceId: string;
  addressId: string;
  status: ServiceRequestStatus;
  contractorConfirmed: boolean;
  providerConfirmed: boolean;
  description?: string;
  scheduledAt?: string;
  priceFinal?: number;
  estimatedHours?: number | null;
  createdAt: string;
  updatedAt?: string;
  paymentMethodTypeId?: string;
  service?: { id: string; name: string };
  provider?: { id: string; businessName: string; avatarUrl?: string | null };
  paymentMethodType?: { id: string; name: string; label: string };
  address?: { id: string; street: string; number: string; city: string; state: string; neighborhood: string; latitude?: string; longitude?: string };
};

export type CreateServiceRequestServiceParams = {
  providerId: string;
  serviceId: string;
  addressId: string;
  description?: string;
  scheduledAt?: string;
  priceFinal?: number;
  paymentMethodTypeId?: string;
  estimatedHours?: number;
};

export type CreateServiceRequestServiceResult = ServiceRequest;

export type ListServiceRequestsServiceParams = {
  userType?: "CUSTOMER" | "PROVIDER";
};

export type ListServiceRequestsServiceResult = ServiceRequest[];

export type UpdateServiceRequestServiceResult = ServiceRequest;
