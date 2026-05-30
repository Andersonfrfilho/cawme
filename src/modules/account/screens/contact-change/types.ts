import { z } from "zod";

export const contactSchema = z.object({
  contact: z.string().min(1, "Campo obrigatório"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export type OtpFormValues = {
  code: string;
};

export type ContactChangeScreenParams = {
  type: "email" | "phone";
  currentContact: string;
};
