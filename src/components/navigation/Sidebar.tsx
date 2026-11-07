import { Link } from "react-router-dom";
import clsx from "clsx";
import { PanelLeftClose, PanelLeftOpen, Code2 } from "lucide-react";
import { navigationConfig } from "@/config/navigation";
import { NavigationItem } from "./NavigationItem";
import { DotMatrixIcon } from "./NavIcons";
import { useTranslation } from "@/i18n";
import "./Sidebar.css";

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

export function Sidebar({ collapsed, onToggleCollapse, className }: SidebarProps) {
  const { t, locale } = useTranslation();

  return (
    <aside
      className={clsx(
        "kodara-sidebar",
        { "kodara-sidebar--collapsed": collapsed },
        className
      )}
      aria-label="Main Navigation"
    >
      {/* Brand Header */}
      <div className="kodara-sidebar__header">
        <Link to="/dashboard" className="kodara-sidebar__brand">
          <span className="kodara-sidebar__logo-box">
            <Code2 size={20} strokeWidth={2.5} />
          </span>
          {!collapsed && (
            <div className="kodara-sidebar__brand-text">
              <span className="kodara-sidebar__brand-title">Kodara</span>
              <span className="kodara-sidebar__brand-subtitle">
                {locale === "bn" ? "সফটওয়্যার মেকানিক্স বুঝুন।" : "Understand how software works."}
              </span>
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="kodara-sidebar__collapse-btn"
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="kodara-sidebar__nav">
        {navigationConfig.map((section) => (
          <div key={section.id} className="kodara-sidebar__section">
            {!collapsed && section.titleKey && (
              <h4 className="kodara-sidebar__section-title">
                {t(section.titleKey)}
              </h4>
            )}
            <div className="kodara-sidebar__section-items">
              {section.items.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Callout Card: Keep learning */}
      {!collapsed && (
        <div className="kodara-sidebar__callout">
          <div className="kodara-sidebar__callout-icon">
            <DotMatrixIcon size={18} />
          </div>
          <div className="kodara-sidebar__callout-text">
            <h5 className="kodara-sidebar__callout-title">
              {locale === "bn" ? "শেখা চালিয়ে যান।" : "Keep learning."}
            </h5>
            <p className="kodara-sidebar__callout-desc">
              {locale === "bn"
                ? "উন্নত ডেভেলপাররা উন্নত বিশ্ব তৈরি করে।"
                : "Better developers build a better world."}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
