import { api } from "../baseApi";
import { User, UserListResponse, ActivityLog } from "@/lib/interface/interface.users";

const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<UserListResponse, void>({
            query: () => '/auth/admin/users/',
            providesTags: ['Users'],
        }),
        getUserDetails: builder.query<User, string>({
            query: (id) => `/auth/admin/users/${id}/`,
            providesTags: (result, error, id) => [{ type: 'Users', id }],
        }),
        deleteUser: builder.mutation<void, string>({
            query: (id) => ({
                url: `/auth/admin/users/${id}/delete/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
        resetUserPreferences: builder.mutation<void, string>({
            query: (id) => ({
                url: `/auth/admin/users/${id}/reset-preferences/`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Users', id }],
        }),
        getUserActivities: builder.query<ActivityLog[], string>({
            query: (id) => `/auth/admin/users/${id}/activities/`,
            providesTags: (result, error, id) => [{ type: 'Users', id }],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserDetailsQuery,
    useDeleteUserMutation,
    useResetUserPreferencesMutation,
    useGetUserActivitiesQuery,
} = usersApi;
