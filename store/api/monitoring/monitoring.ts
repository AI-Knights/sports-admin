import { api } from "../baseApi";
import { AdminDashboardStats, UserEngagement, ServerHistory } from "@/lib/interface/interface.monitoring";

const monitoringApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query<AdminDashboardStats, void>({
            query: () => '/monitoring/dashboard/stats/',
        }),
        getEngagementHistory: builder.query<UserEngagement[], void>({
            query: () => '/monitoring/dashboard/history/engagement/',
        }),
        getServerHistory: builder.query<ServerHistory[], void>({
            query: () => '/monitoring/dashboard/history/server/',
        }),
    }),
});

export const {
    useGetDashboardStatsQuery,
    useGetEngagementHistoryQuery,
    useGetServerHistoryQuery
} = monitoringApi;