import React from "react";
import clsx from "clsx";
import "./PageContainer.css";

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  fluid = false,
}) => {
  return (
    <div
      className={clsx(
        "page-container",
        fluid ? "page-container--fluid" : "page-container--constrained",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  className,
}) => {
  return (
    <header className={clsx("page-header", className)}>
      {breadcrumbs && <div className="page-header__breadcrumbs">{breadcrumbs}</div>}
      <div className="page-header__main">
        <div className="page-header__title-group">
          <h1 className="page-header__title">{title}</h1>
          {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="page-header__actions">{actions}</div>}
      </div>
    </header>
  );
};

export interface PageSectionProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PageSection: React.FC<PageSectionProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
}) => {
  return (
    <section className={clsx("page-section", className)}>
      {(title || action) && (
        <div className="page-section__header">
          <div>
            {title && <h2 className="page-section__title">{title}</h2>}
            {subtitle && <p className="page-section__subtitle">{subtitle}</p>}
          </div>
          {action && <div className="page-section__action">{action}</div>}
        </div>
      )}
      <div className="page-section__content">{children}</div>
    </section>
  );
};
