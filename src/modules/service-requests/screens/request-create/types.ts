import { z } from "zod";

export const requestCreateSchema = z.object({
  addressId: z.string().min(1),
  description: z.string().optional(),
});

export type RequestCreateFormValues = z.infer<typeof requestCreateSchema>;

export type RequestCreateScreenParams = {
  providerId: string;
  providerName: string;
};
