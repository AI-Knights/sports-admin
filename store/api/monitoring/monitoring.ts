import { api } from "../baseApi";

const monitoringApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getMonitoringData: builder.query<{ endpoint: string, avg_time: number }, void>({
            query: () => '/monitoring/dashboard/charts/api/',
        }),
        chartEngagement: builder.query<{ date: string, active_users: number, avg_session_min: number }[], void>({
            query: () => '/monitoring/dashboard/charts/engagement/',
        }),
        resoursUse: builder.query<{ memory_usage: number, cpu_usage: number, time: string }[], void>({
            query: () => '/monitoring/dashboard/charts/server/',
        }),
        errorsData: builder.query<{ id: number; level: string; message: string; path: string; count: number; time_ago: string }[], void>({
            query: () => '/monitoring/dashboard/errors/',
        }),
        summaryData: builder.query<{ cache_hit_rate: number; live_users: number; response_time: number; server_load: number }, void>({
            query: () => '/monitoring/dashboard/summary/',
        }),
    }),
});

export const { useGetMonitoringDataQuery, useChartEngagementQuery, useResoursUseQuery, useErrorsDataQuery, useSummaryDataQuery } = monitoringApi;