import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { RouteFallback } from "./RouteFallback";
import { ROUTES } from "@/config/routes";

// Each page is its own chunk: curriculum, lessons, traces and charts load only
// when a learn route opens, keeping them out of the initial bundle (PLAN 001 M0).
const DashboardPage = lazy(() =>
  import("@/features/dashboard/pages/DashboardPage").then((m) => ({ default: m.DashboardPage }))
);
const TrackOverviewPage = lazy(() =>
  import("@/features/tracks/TrackOverviewPage").then((m) => ({ default: m.TrackOverviewPage }))
);
const LessonPage = lazy(() =>
  import("@/features/lessons/pages/LessonPage").then((m) => ({ default: m.LessonPage }))
);
const PlaceholderPage = lazy(() =>
  import("@/features/placeholder/PlaceholderPage").then((m) => ({ default: m.PlaceholderPage }))
);

const page = (element: React.ReactElement) => (
  <Suspense fallback={<RouteFallback />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: page(<DashboardPage />),
      },
      {
        path: ROUTES.LEARN,
        element: page(<TrackOverviewPage />),
      },
      {
        path: "/learn/:trackId",
        element: page(<TrackOverviewPage />),
      },
      {
        path: "/learn/:trackId/:lessonSlug",
        element: page(<LessonPage />),
      },
      {
        path: ROUTES.PLAYGROUND,
        element: page(<PlaceholderPage />),
      },
      {
        path: ROUTES.CHALLENGES,
        element: page(<PlaceholderPage />),
      },
      {
        path: ROUTES.PROJECTS,
        element: page(<PlaceholderPage />),
      },
      {
        path: ROUTES.CONCEPTS,
        element: page(<PlaceholderPage />),
      },
      {
        path: ROUTES.SKILL_MAP,
        element: page(<PlaceholderPage />),
      },
      {
        path: ROUTES.ARCHITECTURE_LAB,
        element: page(<PlaceholderPage />),
      },
      {
        path: ROUTES.PROGRESS,
        element: page(<PlaceholderPage />),
      },
      {
        path: ROUTES.SETTINGS,
        element: page(<PlaceholderPage />),
      },
      {
        path: "*",
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
    ],
  },
]);
