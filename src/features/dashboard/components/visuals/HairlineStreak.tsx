import React from "react";
import clsx from "clsx";
import { useTranslation } from "@/i18n";
import { StreakDay } from "../../types/dashboard.types";
import "@/components/visual/hairline/hairline.css";
import "./HairlineStreak.css";

export interface HairlineStreakProps {
  days: StreakDay[];
}

/**
 * HairlineStreak: the week as a hairline track — completed days are ringed
 * nodes, consecutive completions are joined by an ink line.
 */
export const HairlineStreak: React.FC<HairlineStreakProps> = ({ days }) => {
  const { locale } = useTranslation();

  return (
    <div className="hl-streak">
      {days.map((item, i) => {
        const dayLabel = locale === "bn" ? item.dayBn : item.dayEn;
        const linked = i > 0 && days[i - 1].completed && item.completed;
        return (
          <div key={item.dayEn} className="hl-streak__day">
            {i > 0 && (
              <span className={clsx("hl-streak__link", linked && "hl-streak__link--on")} />
            )}
            <span
              className={clsx(
                "hl-streak__node",
                item.completed ? "hl-streak__node--done" : "hl-streak__node--pending"
              )}
              title={`${dayLabel}: ${item.completed ? "Completed" : "Pending"}`}
            />
            <span className="hl-streak__label">{dayLabel}</span>
          </div>
        );
      })}
    </div>
  );
};
