import React from "react";
import clsx from "clsx";
import "./Card.css";

export interface BentoCardProps {
  header?: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerPrefix?: React.ReactNode;
  action?: React.ReactNode;
  size?: "small" | "medium" | "large";
  withGrid?: boolean;
  highlight?: boolean;
  className?: string;
  children: React.ReactNode;
  as?: "div" | "article" | "section";
  onClick?: () => void;
}

export function BentoCard({
  header,
  title,
  subtitle,
  headerPrefix,
  action,
  size = "medium",
  withGrid = false,
  highlight = false,
  className,
  children,
  as: Component = "article",
  onClick,
}: BentoCardProps) {
  const isInteractive = Boolean(onClick);

  return (
    <Component
      onClick={onClick}
      className={clsx(
        "kodara-card",
        `kodara-card--${size}`,
        {
          "kodara-card--with-grid": withGrid,
          "kodara-card--highlight": highlight,
          "kodara-card--interactive": isInteractive,
        },
        className
      )}
    >
      {(header || title || action || headerPrefix) && (
        <header className="kodara-card__header">
          {header ? (
            header
          ) : (
            <>
              <div className="kodara-card__title-group">
                {headerPrefix && <div className="kodara-card__prefix">{headerPrefix}</div>}
                <div>
                  {title && <h3 className="kodara-card__title">{title}</h3>}
                  {subtitle && <p className="kodara-card__subtitle">{subtitle}</p>}
                </div>
              </div>
              {action && <div className="kodara-card__action">{action}</div>}
            </>
          )}
        </header>
      )}
      <div className="kodara-card__content">{children}</div>
    </Component>
  );
}

export const Card = BentoCard;
