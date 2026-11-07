import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/i18n";
import { useDashboard } from "../hooks/useDashboard";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { DashboardHeader } from "../components/DashboardHeader";
import { ContinueLearningCard } from "../components/ContinueLearningCard";
import { LearningTracksGrid } from "../components/LearningTracksGrid";
import { ProgressCard } from "../components/ProgressCard";
import { RecommendationCard } from "../components/RecommendationCard";
import { LearningStreakCard } from "../components/LearningStreakCard";
import { RecentActivityCard } from "../components/RecentActivityCard";
import { ProjectsCard } from "../components/ProjectsCard";
import { SkillMapPreview } from "../components/SkillMapPreview";
import "./DashboardPage.css";

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useDashboard();

  return (
    <PageContainer>
      {isLoading && <DashboardSkeleton />}

      {error && (
        <div className="dashboard-error-banner" role="alert">
          <div className="dashboard-error-banner__icon">
            <AlertTriangle size={24} />
          </div>
          <div className="dashboard-error-banner__content">
            <h2 className="dashboard-error-banner__title">
              {t("common.errorTitle")}
            </h2>
            <p className="dashboard-error-banner__desc">
              {error.message || t("common.errorMessage")}
            </p>
          </div>
          <Button variant="outline" size="md" onClick={() => refetch()}>
            <RefreshCw size={16} />
            <span>{t("common.retry")}</span>
          </Button>
        </div>
      )}

      {data && (
        <div className="dashboard-view" data-testid="dashboard-view">
          {/* Header Greeting & Quote */}
          <DashboardHeader userName={data.userName || "John"} weekly={data.weekly} />

          {/* Row 1: Continue Learning (~58%) + Learning Tracks (~42%) */}
          <section className="dashboard-row-1">
            <div className="dashboard-col dashboard-col--hero">
              <ContinueLearningCard data={data.continueLearning} />
            </div>
            <div className="dashboard-col dashboard-col--tracks">
              <LearningTracksGrid tracks={data.tracks} />
            </div>
          </section>

          {/* Row 2: Your Progress | Recommended Next | Learning Streak */}
          <section className="dashboard-row-2">
            <div className="dashboard-col">
              <ProgressCard tracks={data.tracks} />
            </div>
            <div className="dashboard-col">
              <RecommendationCard data={data.recommendation} />
            </div>
            <div className="dashboard-col">
              <LearningStreakCard data={data.streak} />
            </div>
          </section>

          {/* Row 3: Recent Activity | Active Projects | Your Skill Map */}
          <section className="dashboard-row-3">
            <div className="dashboard-col">
              <RecentActivityCard activity={data.recentActivity} />
            </div>
            <div className="dashboard-col">
              <ProjectsCard projects={data.activeProjects} />
            </div>
            <div className="dashboard-col">
              <SkillMapPreview data={data.skillMap} />
            </div>
          </section>
        </div>
      )}
    </PageContainer>
  );
};

