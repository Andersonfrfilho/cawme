import { z } from "zod";

export type RegisterScreenParams = {
  userType?: "contractor" | "provider";
};

export type RegisterFormValues = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  document: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  serviceTags: string[];
};

export const registerSchema = z
  .object({
    fullName: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(10),
    password: z.string().min(8),
    passwordConfirmation: z.string(),
    document: z.string().min(11),
    cep: z.string().min(8),
    street: z.string().min(3),
    number: z.string().min(1),
    neighborhood: z.string().min(2),
    city: z.string().min(2),
    state: z.string().length(2),
    serviceTags: z.array(z.string()).default([]),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "passwordMismatch",
    path: ["passwordConfirmation"],
  });
