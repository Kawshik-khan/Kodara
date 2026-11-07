import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Language, i18nConfig } from "./config";
import { common as bnCommon } from "./locales/bn/common";
import { navigation as bnNav } from "./locales/bn/navigation";
import { dashboard as bnDashboard } from "./locales/bn/dashboard";
import { lab as bnLab } from "./locales/bn/lab";

import { common as enCommon } from "./locales/en/common";
import { navigation as enNav } from "./locales/en/navigation";
import { dashboard as enDashboard } from "./locales/en/dashboard";
import { lab as enLab } from "./locales/en/lab";

const dictionaries = {
  bn: {
    common: bnCommon,
    navigation: bnNav,
    dashboard: bnDashboard,
    lab: bnLab,
  },
  en: {
    common: enCommon,
    navigation: enNav,
    dashboard: enDashboard,
    lab: enLab,
  },
};

export interface I18nContextType {
  language: Language;
  locale: Language;
  setLanguage: (lang: Language) => void;
  setLocale: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(i18nConfig.storageKey);
      if (stored === "bn" || stored === "en") {
        return stored;
      }
    } catch {
      // ignore
    }
    return i18nConfig.defaultLanguage;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(i18nConfig.storageKey, lang);
    } catch {
      // ignore
    }
    // Update document lang
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useMemo(() => {
    return (path: string, fallback?: string): string => {
      const keys = path.split(".");
      let current: any = dictionaries[language];

      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k];
        } else {
          // Fallback to English if missing in current
          let fallbackVal: any = dictionaries.en;
          for (const fk of keys) {
            if (fallbackVal && typeof fallbackVal === "object" && fk in fallbackVal) {
              fallbackVal = fallbackVal[fk];
            } else {
              fallbackVal = undefined;
              break;
            }
          }
          return typeof fallbackVal === "string" ? fallbackVal : fallback || path;
        }
      }

      return typeof current === "string" ? current : fallback || path;
    };
  }, [language]);

  return (
    <I18nContext.Provider
      value={{
        language,
        locale: language,
        setLanguage,
        setLocale: setLanguage,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
