import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTranslation } from "@/i18n";

/** Shown while a lazily loaded page chunk downloads. */
export const RouteFallback: React.FC = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <div role="status" aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          {t("common.loading")}
        </span>
        <Skeleton height={36} width="45%" />
        <Skeleton height={140} />
        <Skeleton height={220} />
      </div>
    </PageContainer>
  );
};
