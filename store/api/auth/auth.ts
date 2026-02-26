import { LoginAdminRequest, LoginAdminResponse, VerifyOtpRequest, VerifyOtpResponse, AdminProfile, PasswordResetRequest, PasswordResetVerifyOtpRequest, PasswordResetConfirmRequest, ChangePasswordRequest } from "@/lib/interface/interface.auth";
import { api } from "../baseApi";

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        loginAdmin: builder.mutation<LoginAdminResponse, LoginAdminRequest>({
            query: (data) => ({
                url: "/auth/login/admin/",
                method: "POST",
                body: data,
            }),
        }),
        verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
            query: (data) => ({
                url: "/auth/login/admin/verify/",
                method: "POST",
                body: data,
            }),
        }),
        resendOtp: builder.mutation<{ message: string }, { email: string }>({
            query: (data) => ({
                url: "/auth/password-reset-request/",
                method: "POST",
                body: data,
            }),
        }),
        passwordResetRequest: builder.mutation<{ message: string }, PasswordResetRequest>({
            query: (data) => ({
                url: "/auth/password-reset-request/",
                method: "POST",
                body: data,
            }),
        }),
        passwordResetVerifyOtp: builder.mutation<{ message: string }, PasswordResetVerifyOtpRequest>({
            query: (data) => ({
                url: "/auth/password-reset-verify-otp/",
                method: "POST",
                body: data,
            }),
        }),
        passwordResetConfirm: builder.mutation<{ message: string }, PasswordResetConfirmRequest>({
            query: (data) => ({
                url: "/auth/password-reset-confirm/",
                method: "POST",
                body: data,
            }),
        }),
        changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
            query: (data) => ({
                url: "/auth/profile/change-password/",
                method: "POST",
                body: data,
            }),
        }),
        getProfile: builder.query<AdminProfile, void>({
            query: () => "/auth/profile/",
            providesTags: ["Users"], // Using Users tag effectively creates a dependency on auth state
        }),
        updateProfile: builder.mutation<AdminProfile, FormData>({
            query: (formData) => ({
                url: "/auth/profile/",
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useResendOtpMutation,
    useLoginAdminMutation,
    useVerifyOtpMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    usePasswordResetRequestMutation,
    usePasswordResetVerifyOtpMutation,
    usePasswordResetConfirmMutation,
    useChangePasswordMutation,
} = authApi;
