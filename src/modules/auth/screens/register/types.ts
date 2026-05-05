import { z } from "zod";

export type RegisterScreenParams = {
  userType?: "contractor" | "provider";
};

export type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
  passwordConfirmation: string;
};

function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
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

export const registerSchema = z
  .object({
    firstName: z.string().min(3, "registerFirstNameRequired"),
    lastName: z.string().min(3, "registerLastNameRequired"),
    email: z.string().email("registerEmailInvalid"),
    phone: z.string().min(10, "registerPhoneRequired"),
    cpf: z.string().refine(validateCPF, "registerCpfInvalid"),
    password: z.string().min(8, "registerPasswordMinLength"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "passwordMismatch",
    path: ["passwordConfirmation"],
  });
