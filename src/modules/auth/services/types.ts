export type LoginServiceParams = {
  username: string;
  password: string;
};

export type LoginServiceResult = {
  id: string;
  name: string;
  email: string;
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
  cpf: string;
};

export type RegisterServiceResult = {
  keycloakId: string;
  email: string;
  success: boolean;
  message: string;
};

export type SendCodeParams = {
  type: "email" | "sms";
  destination: string;
};

export type VerifyCodeParams = {
  type: "email" | "sms";
  destination: string;
  code: string;
};

export type VerifyCodeResult = {
  verified: boolean;
};
