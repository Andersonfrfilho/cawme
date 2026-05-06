import { z } from "zod";

export type DocumentType = "cpf" | "cnpj" | "rg" | "passport";

export type RegisterScreenParams = {
  userType?: "contractor" | "provider";
};

export type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: DocumentType;
  document: string;
  password: string;
  passwordConfirmation: string;
};

function validateCPF(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let firstDigit = 11 - (sum % 11);
  if (firstDigit > 9) firstDigit = 0;
  if (parseInt(digits[9]) !== firstDigit) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  let secondDigit = 11 - (sum % 11);
  if (secondDigit > 9) secondDigit = 0;
  if (parseInt(digits[10]) !== secondDigit) return false;

  return true;
}

function validateCNPJ(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  let sizes = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * sizes[i];
  }
  let firstDigit = 11 - (sum % 11);
  if (firstDigit > 9) firstDigit = 0;
  if (parseInt(digits[12]) !== firstDigit) return false;

  sizes = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i]) * sizes[i];
  }
  let secondDigit = 11 - (sum % 11);
  if (secondDigit > 9) secondDigit = 0;
  if (parseInt(digits[13]) !== secondDigit) return false;

  return true;
}

function validateRG(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 12;
}

function validatePassport(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 9;
}

export const registerSchema = z
  .object({
    firstName: z.string().min(3, "registerFirstNameRequired"),
    lastName: z.string().min(3, "registerLastNameRequired"),
    email: z.string().email("registerEmailInvalid"),
    phone: z.string().min(10, "registerPhoneRequired"),
    documentType: z.enum(["cpf", "cnpj", "rg", "passport"]),
    document: z.string().refine((val) => val.length >= 6, "registerDocumentRequired"),
    password: z.string().min(8, "registerPasswordMinLength"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => {
    if (data.documentType === "cpf") return validateCPF(data.document);
    if (data.documentType === "cnpj") return validateCNPJ(data.document);
    if (data.documentType === "rg") return validateRG(data.document);
    if (data.documentType === "passport") return validatePassport(data.document);
    return false;
  }, "registerDocumentInvalid")
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "passwordMismatch",
    path: ["passwordConfirmation"],
  });
