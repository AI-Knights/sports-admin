import { api } from "../baseApi";
import { NotificationLogsResponse, CreateNotificationRequest, ScheduledNotificationsResponse } from "@/lib/interface/interface.notification";

export const notificationApi = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getNotificationLogs: builder.query<NotificationLogsResponse, { page?: number; pageSize?: number }>({
            query: ({ page = 1, pageSize = 10 }) => `/notifications/logs/?page=${page}&page_size=${pageSize}`,
            providesTags: ['Notifications'],
        }),
        getScheduledNotifications: builder.query<ScheduledNotificationsResponse, { page?: number; pageSize?: number }>({
            query: ({ page = 1, pageSize = 10 }) => `/notifications/scheduled/?page=${page}&page_size=${pageSize}`,
            providesTags: ['Notifications'],
        }),
        createNotification: builder.mutation<any, CreateNotificationRequest>({
            query: (data) => ({
                url: '/notifications/scheduled/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Notifications'],
        }),
        updateNotification: builder.mutation<any, { id: number; data: CreateNotificationRequest }>({
            query: ({ id, data }) => ({
                url: `/notifications/scheduled/${id}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Notifications'],
        }),
        deleteNotification: builder.mutation<any, number>({
            query: (id) => ({
                url: `/notifications/scheduled/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Notifications'],
        }),
    }),
});

export const { useGetNotificationLogsQuery, useGetScheduledNotificationsQuery, useCreateNotificationMutation, useUpdateNotificationMutation, useDeleteNotificationMutation } = notificationApi;

