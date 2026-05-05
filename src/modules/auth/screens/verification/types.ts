export type VerificationScreenParams = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  cpf: string;
  password: string;
};

export type VerificationTarget = "email" | "phone";
