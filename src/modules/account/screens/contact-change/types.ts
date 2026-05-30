import { z } from "zod";

export const contactSchema = z.object({
  contact: z.string().min(1, "Campo obrigatório"),
});

export const otpSchema = z.object({
  code: z.string().length(6, "Código deve ter 6 dígitos"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;

export type ContactChangeScreenParams = {
  type: "email" | "phone";
  currentContact: string;
};
