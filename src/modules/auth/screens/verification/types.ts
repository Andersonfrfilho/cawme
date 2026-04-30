export type VerificationScreenParams = {
  email: string;
  phone: string;
  userType: "contractor" | "provider";
};

export type VerificationTarget = "email" | "phone";
