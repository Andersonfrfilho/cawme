export type VerificationScreenParams = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  document: string;
  documentType: string;
  password: string;
};

export type VerificationTarget = "email" | "phone";
