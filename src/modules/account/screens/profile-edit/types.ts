import { z } from "zod";

export const profileEditSchema = z.object({
  fullName: z.string().min(1, "Nome obrigatório"),
});

export type ProfileEditFormValues = z.infer<typeof profileEditSchema>;

export type ProfileEditScreenParams = Record<string, never>;
