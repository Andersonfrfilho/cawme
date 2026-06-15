import { z } from "zod";

export const emailContactSchema = z.object({
  contact: z.string().min(1, "Campo obrigatório"),
});

export const phoneContactSchema = z.object({
  contact: z.string().regex(/^\d{10,11}$/, "Telefone inválido"),
});

export type ContactFormValues = { contact: string };

export type OtpFormValues = {
  code: string;
};

export type ContactChangeScreenParams = {
  type: "email" | "phone";
  currentContact: string;
};
