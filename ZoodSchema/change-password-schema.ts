import { z } from "zod";

export const changePasswordSchema = z
    .object({
        old_password: z.string().min(1, { message: "Old password is required" }),
        new_password: z.string().min(8, { message: "New password must be at least 8 characters" }),
        confirm_password: z.string().min(8, { message: "Confirmation must be at least 8 characters" }),
    })
    .refine((data) => data.new_password === data.confirm_password, {
        message: "New passwords don't match",
        path: ["confirm_password"],
    });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
