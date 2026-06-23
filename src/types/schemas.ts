import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/\d/, "Password must include at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one symbol");

const egyptianPhoneRegex = /^(?:\+20|0)?1[0125]\d{8}$/;

export const RegisterSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: passwordSchema,
    rePassword: z.string(),
    phone: z
      .string()
      .regex(egyptianPhoneRegex, "Please enter a valid Egyptian phone number"),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: passwordSchema,
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const VerifyResetCodeSchema = z.object({
  resetCode: z
    .string()
    .regex(/^\d{6}$/, "Verification code must be exactly 6 digits"),
});

export const ResetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;
export type VerifyResetCodeFormValues = z.infer<typeof VerifyResetCodeSchema>;
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;
