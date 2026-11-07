import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useTranslation } from "@/i18n";
import { NavItemConfig } from "@/config/navigation";
import "./NavigationItem.css";

export interface NavigationItemProps {
  item: NavItemConfig;
  collapsed?: boolean;
  onClick?: () => void;
}

export function NavigationItem({ item, collapsed = false, onClick }: NavigationItemProps) {
  const location = useLocation();
  const { t } = useTranslation();
  const Icon = item.icon;

  const isActive = location.pathname === item.href || (item.href !== "/" && item.href !== "/dashboard" && location.pathname.startsWith(item.href));
  const label = t(item.labelKey);

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={clsx("kodara-nav-item", {
        "kodara-nav-item--active": isActive,
        "kodara-nav-item--collapsed": collapsed,
      })}
      title={collapsed ? label : undefined}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="kodara-nav-item__icon">
        <Icon size={18} />
      </span>
      {!collapsed && (
        <>
          <span className="kodara-nav-item__label">{label}</span>
          {item.badge && <span className="kodara-nav-item__badge">{item.badge}</span>}
        </>
      )}
    </Link>
  );
}
