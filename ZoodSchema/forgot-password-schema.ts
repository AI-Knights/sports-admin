import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const otpSchema = z.object({
    otp: z.string().min(6, { message: "OTP must be at least 6 characters" }),
});

export type OtpFormData = z.infer<typeof otpSchema>;

export const resetPasswordSchema = z
    .object({
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        confirm_password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match",
        path: ["confirm_password"],
    });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
