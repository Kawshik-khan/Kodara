import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData, FetchDashboardOptions } from "../api/dashboard";
import { DashboardData } from "../types/dashboard.types";

export const DASHBOARD_QUERY_KEY = ["dashboard"] as const;

export function useDashboard(options?: FetchDashboardOptions) {
  return useQuery<DashboardData, Error>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => fetchDashboardData(options),
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    retry: 1,
  });
}
