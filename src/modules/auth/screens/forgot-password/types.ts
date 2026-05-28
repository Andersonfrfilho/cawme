import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1)
    .refine((v) => /\S+@\S+\.\S+/.test(v), { message: 'Invalid email' }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export interface ForgotPasswordScreenParams {
  // Navigation params (none for this screen)
}
