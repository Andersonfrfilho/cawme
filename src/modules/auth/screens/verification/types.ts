export type VerificationScreenParams = {
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  document?: string;
  documentType?: string;
  password?: string;
  mode?: "post-register" | "post-login";
  emailVerified?: string;
  phoneVerified?: string;
};

export type VerificationTarget = "email" | "phone";
