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
  fullName: string;
  email: string;
  phone: string;
  password: string;
  userType: "contractor" | "provider";
};

export type RegisterServiceResult = {
  message: string;
};

export type SendCodeParams = {
  type: "email" | "phone";
  target: string;
};

export type VerifyCodeParams = {
  type: "email" | "phone";
  target: string;
  code: string;
};

export type VerifyCodeResult = {
  verified: boolean;
};
