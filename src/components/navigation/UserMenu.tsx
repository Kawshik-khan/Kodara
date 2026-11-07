import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Award, Globe, LogOut, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "@/i18n";
import { ROUTES } from "@/config/routes";
import "./UserMenu.css";

export const UserMenu: React.FC = () => {
  const { t, locale, setLocale } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="user-menu__avatar">
          <span>JD</span>
        </div>
        <span className="user-menu__name">John Doe</span>
        <ChevronDown size={14} className={`user-menu__chevron ${isOpen ? "user-menu__chevron--open" : ""}`} />
      </button>

      {isOpen && (
        <div className="user-menu__dropdown" role="menu">
          <div className="user-menu__header">
            <p className="user-menu__header-name">John Doe</p>
            <p className="user-menu__header-email">john.doe@kodara.dev</p>
            <div className="user-menu__header-status">
              <span className="user-menu__indicator" />
              <span>{locale === "bn" ? "টানা ৭ দিন শেখার রেকর্ড 🔥" : "7-Day Streak Active 🔥"}</span>
            </div>
          </div>

          <div className="user-menu__divider" />

          <div className="user-menu__section">
            <button
              className="user-menu__item"
              role="menuitem"
              onClick={() => handleNavigate(ROUTES.PROGRESS)}
            >
              <Award size={16} />
              <span>{t("navigation.progress")}</span>
            </button>

            <button
              className="user-menu__item"
              role="menuitem"
              onClick={() => handleNavigate(ROUTES.SETTINGS)}
            >
              <Settings size={16} />
              <span>{t("navigation.settings")}</span>
            </button>
          </div>

          <div className="user-menu__divider" />

          <div className="user-menu__section">
            <div className="user-menu__lang-select">
              <div className="user-menu__lang-label">
                <Globe size={14} />
                <span>{t("common.language")}</span>
              </div>
              <div className="user-menu__lang-buttons">
                <button
                  className={`user-menu__lang-btn ${locale === "bn" ? "user-menu__lang-btn--active" : ""}`}
                  onClick={() => setLocale("bn")}
                >
                  বাংলা
                  {locale === "bn" && <Check size={12} />}
                </button>
                <button
                  className={`user-menu__lang-btn ${locale === "en" ? "user-menu__lang-btn--active" : ""}`}
                  onClick={() => setLocale("en")}
                >
                  English
                  {locale === "en" && <Check size={12} />}
                </button>
              </div>
            </div>
          </div>

          <div className="user-menu__divider" />

          <div className="user-menu__section">
            <button
              className="user-menu__item user-menu__item--danger"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                alert(locale === "bn" ? "অফলাইন মোড সক্রিয়।" : "Offline Mode active.");
              }}
            >
              <LogOut size={16} />
              <span>{t("common.signOut")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
