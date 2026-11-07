import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider, useTranslation } from "@/i18n";

const TestTranslationComponent = () => {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div>
      <span data-testid="current-lang">{locale}</span>
      <span data-testid="translated-title">{t("dashboard.greeting")}</span>
      <span data-testid="continue-btn">{t("dashboard.continueLessonBtn")}</span>
      <button onClick={() => setLocale("en")}>Switch to English</button>
      <button onClick={() => setLocale("bn")}>Switch to Bangla</button>
    </div>
  );
};

describe("i18n Bilingual System", () => {
  it("defaults to Bangla ('bn') and switches smoothly to English ('en')", async () => {
    render(
      <I18nProvider>
        <TestTranslationComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId("current-lang")).toHaveTextContent("bn");
    expect(screen.getByTestId("translated-title")).toHaveTextContent("স্বাগতম");
    expect(screen.getByTestId("continue-btn")).toHaveTextContent("লেসন শুরু করুন");

    const enBtn = screen.getByRole("button", { name: /switch to english/i });
    await userEvent.click(enBtn);

    expect(screen.getByTestId("current-lang")).toHaveTextContent("en");
    expect(screen.getByTestId("translated-title")).toHaveTextContent("Welcome back");
    expect(screen.getByTestId("continue-btn")).toHaveTextContent("Continue Lesson");
  });
});
