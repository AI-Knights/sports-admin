import { LoginAdminRequest, LoginAdminResponse, VerifyOtpRequest, VerifyOtpResponse } from "@/lib/interface/interface.auth";
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
        resendOtp: builder.mutation<{message : string}, { email: string }>({
            query: (data) => ({
                url: "/auth/password-reset-request/",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useResendOtpMutation,
    useLoginAdminMutation,
    useVerifyOtpMutation,
} = authApi;
