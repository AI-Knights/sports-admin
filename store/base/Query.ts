import { toast } from "@/components/ui/toast";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
});

export const baseQueryWithErrorHandling: typeof baseQuery = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error) {
      
        if (result.error?.data) {
            const data = result.error.data as any;

            
            if (typeof data === "object") {
                for (const key in data) {
                    toast({
                        title: `Error in ${key}`,
                        description: Array.isArray(data[key]) ? data[key].join(", ") : data[key],
                        variant: "destructive",
                    });
                }
            } else {
                toast({
                    title: "Error",
                    description: result.error.status + " " + result.error.data,
                    variant: "destructive",
                });
            }
        } else {
            toast({
                title: "Error",
                description: result.error?.status + " " + result.error?.data,
                variant: "destructive",
            });
        }
    }

    return result;
};
