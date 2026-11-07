import { Link } from "react-router-dom";
import { X, Terminal } from "lucide-react";
import { navigationConfig } from "@/config/navigation";
import { NavigationItem } from "./NavigationItem";
import { useTranslation } from "@/i18n";
import "./MobileNav.css";

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="kodara-mobile-nav" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
      {/* Backdrop */}
      <div className="kodara-mobile-nav__backdrop" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div className="kodara-mobile-nav__drawer">
        <div className="kodara-mobile-nav__header">
          <Link to="/dashboard" onClick={onClose} className="kodara-mobile-nav__brand">
            <span className="kodara-mobile-nav__logo-icon">
              <Terminal size={18} strokeWidth={2.5} />
            </span>
            <span className="kodara-mobile-nav__brand-title">KODARA</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="kodara-mobile-nav__close-btn"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="kodara-mobile-nav__content">
          {navigationConfig.map((section) => (
            <div key={section.id} className="kodara-mobile-nav__section">
              {section.titleKey && (
                <h4 className="kodara-mobile-nav__section-title">
                  {t(section.titleKey)}
                </h4>
              )}
              <div className="kodara-mobile-nav__items">
                {section.items.map((item) => (
                  <NavigationItem
                    key={item.id}
                    item={item}
                    onClick={onClose}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
