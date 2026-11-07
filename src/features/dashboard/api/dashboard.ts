import { DashboardData } from "../types/dashboard.types";
import { MOCK_DASHBOARD_DATA } from "../mock/dashboard.fixture";

export interface FetchDashboardOptions {
  latencyMs?: number;
  shouldFail?: boolean;
}

/**
 * Fetch dashboard data with simulated network latency.
 * Easily swappable for real backend API integration in production.
 */
export async function fetchDashboardData(
  options: FetchDashboardOptions = {}
): Promise<DashboardData> {
  const { latencyMs = 200, shouldFail = false } = options;

  if (latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, latencyMs));
  }

  if (shouldFail) {
    throw new Error("Failed to fetch dashboard data from server.");
  }

  return MOCK_DASHBOARD_DATA;
}
