import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import "./DashboardSkeleton.css";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="dashboard-skeleton" aria-label="Loading dashboard...">
      {/* Header Skeleton */}
      <div className="dashboard-skeleton__header">
        <div className="dashboard-skeleton__header-left">
          <Skeleton width="160px" height="20px" />
          <Skeleton width="280px" height="36px" />
          <Skeleton width="480px" height="20px" />
        </div>
        <div className="dashboard-skeleton__header-right">
          <Skeleton width="180px" height="60px" />
          <Skeleton width="180px" height="60px" />
        </div>
      </div>

      {/* Hero Continue Learning Skeleton */}
      <div className="dashboard-skeleton__hero">
        <Skeleton width="100%" height="240px" />
      </div>

      {/* Tracks Grid Skeleton */}
      <div className="dashboard-skeleton__tracks">
        <Skeleton width="220px" height="24px" className="mb-4" />
        <div className="dashboard-skeleton__tracks-grid">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} width="100%" height="180px" />
          ))}
        </div>
      </div>

      {/* Bento Grid Skeleton */}
      <div className="dashboard-skeleton__bento">
        <div className="dashboard-skeleton__bento-col">
          <Skeleton width="100%" height="280px" />
          <Skeleton width="100%" height="240px" />
        </div>
        <div className="dashboard-skeleton__bento-col">
          <Skeleton width="100%" height="280px" />
          <Skeleton width="100%" height="240px" />
        </div>
      </div>
    </div>
  );
};
