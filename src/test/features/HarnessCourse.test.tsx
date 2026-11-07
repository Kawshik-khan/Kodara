import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@/i18n";
import { LessonPage } from "@/features/lessons/pages/LessonPage";
import { TrackOverviewPage } from "@/features/tracks/TrackOverviewPage";
import { getLesson, getNextLesson, getPreviousLesson } from "@/content/curriculum/curriculumRegistry";
import { HARNESS_COURSE_PARTS, HARNESS_COURSE_SLUGS } from "@/content/courses/harness-playbook/course";
import { HARNESS_COURSE_LESSONS } from "@/content/courses/harness-playbook/lessons";
import { defaultVisualizationRegistry } from "@/features/visualization/core/registry";
import { defaultChartRegistry } from "@/features/charts/core/registry";
import { defaultTraceRegistry } from "@/features/code-trace/core/registry";

const SLUG = "harness-02-tool-calls-to-safe-actions";
const CH00 = "harness-00-why-harness-engineering";
const CH01 = "harness-01-where-operational-truth-lives";
const CH03 = "harness-03-building-the-right-briefing";
const CH04 = "harness-04-knowing-when-to-continue-wait-or-stop";
const CH05 = "harness-05-testing-that-earns-trust";
const CH20 = "harness-20-turning-procedures-into-reliable-agent-skills";

const renderAt = (entry: string) =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <I18nProvider>
        <MemoryRouter initialEntries={[entry]}>
          <Routes>
            <Route path="/learn/:trackId" element={<TrackOverviewPage />} />
            <Route path="/learn/:trackId/:lessonSlug" element={<LessonPage />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    </QueryClientProvider>
  );

describe("Harness Engineering Playbook course content", () => {
  it("lists all 24 book units (intro, chapters 00–20, field case, appendices) and registers the authored lessons", () => {
    expect(HARNESS_COURSE_PARTS.flatMap((p) => p.chapters)).toHaveLength(24);
    expect(HARNESS_COURSE_LESSONS.map((l) => l.slug)).toContain(SLUG);
    expect(getLesson("ai-engineering", SLUG)?.titleEn).toBe("From Tool Calls to Safe Actions");
    expect(HARNESS_COURSE_LESSONS.map((l) => l.slug)).toEqual([CH00, CH01, SLUG, CH03, CH04, CH05, CH20]);
    // the outline and the lesson content agree on which chapters are authored
    expect(HARNESS_COURSE_SLUGS).toEqual(HARNESS_COURSE_LESSONS.map((l) => l.slug));
    expect(getNextLesson("ai-engineering", CH00)?.url).toBe(`/learn/ai-engineering/${CH01}`);
    expect(getNextLesson("ai-engineering", CH01)?.url).toBe(`/learn/ai-engineering/${SLUG}`);
    expect(getNextLesson("ai-engineering", SLUG)?.url).toBe(`/learn/ai-engineering/${CH03}`);
    expect(getNextLesson("ai-engineering", CH03)?.url).toBe(`/learn/ai-engineering/${CH04}`);
    expect(getNextLesson("ai-engineering", CH04)?.url).toBe(`/learn/ai-engineering/${CH05}`);
    expect(getNextLesson("ai-engineering", CH05)?.url).toBe(`/learn/ai-engineering/${CH20}`);
    expect(getPreviousLesson("ai-engineering", CH20)?.url).toBe(`/learn/ai-engineering/${CH05}`);
    expect(getNextLesson("ai-engineering", CH20)).toBeNull();
  });

  it("references only registered visualizations, charts and traces", () => {
    for (const lesson of HARNESS_COURSE_LESSONS) {
      for (const block of lesson.sections.flatMap((s) => s.blocks)) {
        if (block.type === "visualization") expect(defaultVisualizationRegistry.get(block.visualizationId), block.id).toBeDefined();
        if (block.type === "chart") expect(defaultChartRegistry.get(block.chartId), block.id).toBeDefined();
        if (block.type === "code-trace") expect(defaultTraceRegistry.get(block.traceId), block.id).toBeDefined();
      }
    }
  });

  it("gives every lesson the four parts: theory, visual, practical and Q&A", () => {
    for (const lesson of HARNESS_COURSE_LESSONS) {
      const types = lesson.sections.map((s) => new Set(s.blocks.map((b) => b.type)));
      expect(lesson.sections).toHaveLength(4);
      expect(types[1].has("visualization") || types[1].has("chart")).toBe(true);
      expect(types[2].has("code-trace")).toBe(true);
      expect(types[3].has("practice")).toBe(true);
      expect(types[3].has("faq")).toBe(true);
    }
  });

  it("labels the hand-authored flow visualizations as modeled", () => {
    for (const id of [
      "ai-engineering.harness.control-loop",
      "ai-engineering.harness.event-log-resume",
      "ai-engineering.harness.aci-refund.ack-lost",
      "ai-engineering.harness.aci-refund.naive-retry",
      "ai-engineering.harness.context-compiler",
      "ai-engineering.harness.budgeted-controller",
      "ai-engineering.harness.evaluation-control-plane",
      "ai-engineering.harness.skill-lifecycle",
    ]) {
      const def = defaultVisualizationRegistry.get(id)!;
      expect(def.subtitleEn).toMatch(/^Modeled/);
      expect(def.subtitleBn).toMatch(/^মডেল করা/);
      def.steps.forEach((s) => expect(s.whyEn && s.whyBn, `${id} ${s.id}`).toBeTruthy());
    }
  });
});

describe("AI Engineering track and lesson pages", () => {
  beforeEach(() => localStorage.clear());

  it("shows the course outline with planned chapters and opens Chapter 02", () => {
    renderAt("/learn/ai-engineering");
    expect(screen.getAllByText("Tool Call থেকে নিরাপদ Action").length).toBeGreaterThan(0);
    expect(screen.getAllByText("পরিকল্পিত")).toHaveLength(17);

    fireEvent.click(screen.getByText("Tool Call থেকে নিরাপদ Action"));
    expect(screen.getByTestId("code-trace-player")).toBeInTheDocument();
  });

  it("renders theory, both flow visualizations, the chart, the trace and the FAQ", () => {
    renderAt(`/learn/ai-engineering/${SLUG}`);
    expect(screen.getAllByText("১. তত্ত্ব").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("visualization-engine")).toHaveLength(2);
    expect(screen.getByTestId("parametric-chart")).toBeInTheDocument();
    expect(screen.getByTestId("code-trace-player")).toBeInTheDocument();
    expect(screen.getByTestId("faq-block")).toBeInTheDocument();
  });

  it("renders Chapter 00 with its flow, budget chart, trace and FAQ", () => {
    renderAt(`/learn/ai-engineering/${CH00}`);
    expect(screen.getAllByText("Harness Engineering কেন জরুরি").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("visualization-engine")).toHaveLength(1);
    expect(screen.getByTestId("parametric-chart")).toHaveTextContent("Verification-এর জন্য budget রাখো");
    expect(screen.getByTestId("code-trace-player")).toHaveTextContent("harness/ch00/control_loop.py");
    expect(screen.getByTestId("faq-block")).toBeInTheDocument();
  });

  it("renders Chapter 01 with its flow, silent-failure chart, trace and FAQ", () => {
    renderAt(`/learn/ai-engineering/${CH01}`);
    expect(screen.getAllByText("কাজের আসল সত্য কোথায় থাকে").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("visualization-engine")).toHaveLength(1);
    expect(screen.getByTestId("parametric-chart")).toHaveTextContent("নীরব ব্যর্থতাকে দৃশ্যমান করা");
    expect(screen.getByTestId("code-trace-player")).toHaveTextContent("harness/ch01/event_log.py");
    expect(screen.getByTestId("faq-block")).toBeInTheDocument();
  });

  it("renders Chapter 03 with its flow, post-filter recall chart, trace and FAQ", () => {
    renderAt(`/learn/ai-engineering/${CH03}`);
    expect(screen.getAllByText("সঠিক briefing তৈরি").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("visualization-engine")).toHaveLength(1);
    expect(screen.getByTestId("parametric-chart")).toHaveTextContent("Scope-first compilation বনাম post-filter করা top-k");
    expect(screen.getByTestId("code-trace-player")).toHaveTextContent("harness/ch03/context_compiler.py");
    expect(screen.getByTestId("faq-block")).toBeInTheDocument();
  });

  it("renders Chapter 04 with its flow, retry amplification chart, trace and FAQ", () => {
    renderAt(`/learn/ai-engineering/${CH04}`);
    expect(screen.getAllByText("কখন চালিয়ে যাবে, অপেক্ষা করবে, না থামবে").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("visualization-engine")).toHaveLength(1);
    expect(screen.getByTestId("parametric-chart")).toHaveTextContent("Budget laundering এবং বহু-স্তরের retry গুণন");
    expect(screen.getByTestId("code-trace-player")).toHaveTextContent("harness/ch04/budgeted_controller.py");
    expect(screen.getByTestId("faq-block")).toBeInTheDocument();
  });

  it("renders Chapter 05 with its flow, pass^k chart, trace and FAQ", () => {
    renderAt(`/learn/ai-engineering/${CH05}`);
    expect(screen.getAllByText("যে testing আস্থা অর্জন করে").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("visualization-engine")).toHaveLength(1);
    expect(screen.getByTestId("parametric-chart")).toHaveTextContent("pass@k বনাম pass^k এবং Missing-Output হরের বিকৃতি");
    expect(screen.getByTestId("code-trace-player")).toHaveTextContent("harness/ch05/qualification_gate.py");
    expect(screen.getByTestId("faq-block")).toBeInTheDocument();
  });

  it("renders Chapter 20 with its flow, skill activation precision chart, trace and FAQ", () => {
    renderAt(`/learn/ai-engineering/${CH20}`);
    expect(screen.getAllByText("Procedure থেকে নির্ভরযোগ্য agent skill").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("visualization-engine")).toHaveLength(1);
    expect(screen.getByTestId("parametric-chart")).toHaveTextContent(
      "Skill Activation Precision এবং ক্যাটালগের ওভারল্যাপ (v4.2.0 বনাম v4.2.1)"
    );
    expect(screen.getByTestId("code-trace-player")).toHaveTextContent("harness/ch20/skill_linker.py");
    expect(screen.getByTestId("faq-block")).toBeInTheDocument();
  });
});
