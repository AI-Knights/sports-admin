import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access');

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  // Check if the current request is for a login-related endpoint
  const url = typeof args === 'string' ? args : args.url;
  const isLoginRequest = url?.includes('/auth/login/admin/');

  if (result.error && result.error.status === 401 && !isLoginRequest) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refresh = localStorage.getItem('refresh');
        if (refresh) {
          const refreshResult = await baseQuery(
            {
              url: '/auth/token/refresh/',
              method: 'POST',
              body: { refresh },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const { access, refresh: newRefresh } = refreshResult.data as { access: string, refresh: string };
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', newRefresh);

            // Retry the initial query
            result = await baseQuery(args, api, extraOptions);
          } else {
            // Refresh failed
            localStorage.clear();
            window.location.href = '/sign-in';
          }
        } else {
          localStorage.clear();
          window.location.href = '/sign-in';
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users", "News", "Notifications"],
  endpoints: () => ({}),
});
