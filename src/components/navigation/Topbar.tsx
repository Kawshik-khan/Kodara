import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Globe, Menu, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/i18n";
import { GlobalSearch } from "./GlobalSearch";
import { UserMenu } from "./UserMenu";
import "./Topbar.css";

export interface TopbarProps {
  onMenuToggle: () => void;
  showMenuButton?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuToggle, showMenuButton = false }) => {
  const { locale, setLocale } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Global key listener for Ctrl+K / Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleLanguage = () => {
    setLocale(locale === "bn" ? "en" : "bn");
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <button
            className={`topbar__mobile-btn ${showMenuButton ? "topbar__mobile-btn--visible" : ""}`}
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
            title={locale === "bn" ? "মেনু" : "Menu"}
          >
            <Menu size={20} />
          </button>

          {showMenuButton && (
            <button
              className="topbar__back-btn"
              onClick={() => navigate(-1)}
              title={locale === "bn" ? "পূর্ববর্তী পৃষ্ঠায় ফিরুন" : "Go back"}
              aria-label="Go back"
            >
              <ArrowLeft size={16} />
              <span className="topbar__back-btn-text">
                {locale === "bn" ? "প্রস্থান" : "Exit"}
              </span>
            </button>
          )}

          {/* Search bar matching mockup */}
          <button
            className="topbar__search-box"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search dialog"
          >
            <Search size={16} className="topbar__search-icon" />
            <span className="topbar__search-text">
              {locale === "bn"
                ? "লেসন, কনসেপ্ট, চ্যালেঞ্জ খুঁজুন..."
                : "Search lessons, concepts, challenges..."}
            </span>
            <span className="topbar__search-shortcut">⌘ K</span>
          </button>
        </div>

        <div className="topbar__right">
          {/* Quick Language Toggle */}
          <button
            className="topbar__lang-btn"
            onClick={toggleLanguage}
            title={locale === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
            aria-label="Toggle language"
          >
            <Globe size={14} />
            <span>{locale === "bn" ? "বাংলা" : "EN"}</span>
          </button>

          {/* Notification Bell */}
          <button className="topbar__icon-btn" aria-label="Notifications">
            <Bell size={18} />
          </button>

          <div className="topbar__divider" />

          {/* User Profile (JD / John Doe) */}
          <UserMenu />
        </div>
      </header>

      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
