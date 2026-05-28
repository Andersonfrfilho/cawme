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

export type VerifyCodeParams = {
  type: "email" | "sms";
  destination: string;
  code: string;
  keycloakId?: string;
};

export type VerifyCodeResult = {
  verified: boolean;
};

export type OnboardingStep = "address" | "verification" | "document" | "complete";

export type OnboardingStatusResult = {
  step: OnboardingStep;
  hasAddress: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  hasDocument: boolean;
};
