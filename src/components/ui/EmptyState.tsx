import React from "react";
import clsx from "clsx";
import "./EmptyState.css";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={clsx("kodara-empty-state", className)}>
      {icon && <div className="kodara-empty-state__icon">{icon}</div>}
      <h3 className="kodara-empty-state__title">{title}</h3>
      {description && (
        <p className="kodara-empty-state__description">{description}</p>
      )}
      {action && <div className="kodara-empty-state__action">{action}</div>}
    </div>
  );
}
