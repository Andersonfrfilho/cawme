export type LoginServiceParams = {
  username: string;
  password: string;
};

export type LoginServiceResult = {
  id: string;
  name: string;
  email: string;
  type: "contractor" | "provider";
};

export type ForgotPasswordServiceParams = {
  email: string;
};

export type RegisterServiceParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: "contractor" | "provider";
  cpf?: string;
  cnpj?: string;
  rg?: string;
  passport?: string;
  termsAccepted: boolean;
};

export type RegisterServiceResult = {
  userId: string;
  keycloakId: string;
};

export type SaveAddressParams = {
  keycloakId: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude?: string;
  longitude?: string;
};

export type SaveAddressResult = {
  addressId: string;
};

export type SendCodeParams = {
  type: "email" | "sms";
  destination: string;
};

export type SendCodeExpirationInfo = {
  value: number;
  unit: "minutos" | "horas" | "segundos";
};

export type SendCodeResult = {
  success: boolean;
  message: string;
  codeId: string;
  expiresIn: SendCodeExpirationInfo;
  expiresAt: string;
  destination: string;
  type: "email" | "phone";
};

export type VerifyCodeParams = {
  type: "email" | "sms";
  destination: string;
  code: string;
  keycloakId?: string;
};

export type VerifyCodeResult = {
  success: boolean;
  verified: boolean;
  message: string;
  codeId?: string;
  destination: string;
  type: "email" | "phone";
  verifiedAt?: string;
};

export type OnboardingStep = "address" | "verification" | "document" | "complete";

export type OnboardingStatusResult = {
  step: OnboardingStep;
  hasAddress: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  hasDocument: boolean;
};

export type SelfUnlockInitiateParams = {
  blockId: string;
};

export type SelfUnlockInitiateResult = {
  success: true;
  message: string;
  destination: string;
  expiresIn: number;
};

export type SelfUnlockVerifyParams = {
  blockId: string;
  code: string;
};

export type SelfUnlockVerifyResult = {
  success: boolean;
  blockResolved: boolean;
  message: string;
  canRetryAt?: string;
};

export type CategoryDto = {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
};

export type GetCategoriesResult = {
  success: boolean;
  data: CategoryDto[];
};

export type ServiceDto = {
  id: string;
  name: string;
  categoryId: string;
  description: string | null;
};

export type GetServicesResult = {
  data: ServiceDto[];
};

export type CreateCategoryParams = {
  name: string;
  slug: string;
};

export type CreateCategoryResult = {
  id: string;
  name: string;
  slug: string;
};

export type CreateServiceCatalogParams = {
  name: string;
  categoryId: string;
  description?: string;
};

export type CreateServiceCatalogResult = {
  id: string;
  name: string;
  categoryId: string;
};

export type ProviderServiceDto = {
  id: string;
  serviceId: string;
  categoryId: string;
  categoryName: string;
  serviceName: string;
  priceBase: number | null;
  priceType: string | null;
  estimatedDurationMinutes: number | null;
  pricePerHour: number | null;
  isActive: boolean;
};

export type CreateProviderServiceParams = {
  serviceId: string;
  estimatedDurationMinutes: number;
  pricePerHour: number;
  priceBase?: number;
  priceType?: string;
};

export type CreateProviderServiceResult = {
  success: boolean;
  data: ProviderServiceDto;
};

export type GetProviderServicesResult = {
  success: boolean;
  data: ProviderServiceDto[];
};

export type UpdateProviderServiceParams = {
  serviceId: string;
  estimatedDurationMinutes?: number;
  pricePerHour?: number;
  priceBase?: number;
  priceType?: string;
  isActive?: boolean;
};

export type UpdateProviderServiceResult = {
  success: boolean;
  data: ProviderServiceDto;
};

export type ProviderAvailabilityDto = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  additionalPercentage: number;
};

export type SetProviderAvailabilityParams = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  additionalPercentage?: number;
};

export type SetProviderAvailabilityResult = {
  success: boolean;
  data: ProviderAvailabilityDto;
};

export type GetProviderAvailabilityResult = {
  success: boolean;
  data: ProviderAvailabilityDto[];
};

export type UpdateProviderAvailabilityParams = {
  id: string;
  startTime: string;
  endTime: string;
  additionalPercentage?: number;
};

export type UpdateProviderAvailabilityResult = {
  success: boolean;
  data: ProviderAvailabilityDto;
};

export type DeleteProviderAvailabilityResult = {
  success: boolean;
};
