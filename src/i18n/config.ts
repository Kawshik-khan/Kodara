export type Language = "bn" | "en";

export interface I18nConfig {
  defaultLanguage: Language;
  supportedLanguages: Language[];
  storageKey: string;
}

export const i18nConfig: I18nConfig = {
  defaultLanguage: "bn",
  supportedLanguages: ["bn", "en"],
  storageKey: "kodara_language",
};
