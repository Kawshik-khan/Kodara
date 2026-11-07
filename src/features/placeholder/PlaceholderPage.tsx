import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Terminal, Construction, ArrowLeft, GitBranch, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/i18n";
import { ROUTES } from "@/config/routes";
import "./PlaceholderPage.css";

interface PlaceholderMetadata {
  titleEn: string;
  titleBn: string;
  phaseEn: string;
  phaseBn: string;
  descriptionEn: string;
  descriptionBn: string;
}

const ROUTE_METADATA: Record<string, PlaceholderMetadata> = {
  [ROUTES.PLAYGROUND]: {
    titleEn: "Technical Playground & Execution Sandbox",
    titleBn: "টেকনিক্যাল প্লেগ্রাউন্ড এবং কোড স্যান্ডবক্স",
    phaseEn: "Phase 1: Code Execution & Sandboxing",
    phaseBn: "ফেজ ১: কোড এক্সিকিউশন ও স্যান্ডবক্সিং",
    descriptionEn: "Interactive sandbox with multi-language execution engine, memory inspector, and AST visualizer.",
    descriptionBn: "মাল্টি-ল্যাঙ্গুয়েজ এক্সিকিউশন ইঞ্জিন, মেমোরি ইন্সপেক্টর এবং AST ভিজ্যুয়ালাইজার সহ ইন্টারঅ্যাক্টিভ কোড স্যান্ডবক্স।",
  },
  [ROUTES.CHALLENGES]: {
    titleEn: "Output Prediction & Debugging Challenges",
    titleBn: "আউটপুট প্রেডিকশন এবং ডিবাগিং চ্যালেঞ্জ",
    phaseEn: "Phase 2: Challenge Lab Engine",
    phaseBn: "ফেজ ২: চ্যালেঞ্জ ল্যাব ইঞ্জিন",
    descriptionEn: "Step-by-step code prediction, bug localization, and automated verification suites.",
    descriptionBn: "স্টেপ-বাই-স্টেপ কোড প্রেডিকশন, বাগ শনাক্তকরণ এবং স্বয়ংক্রিয় ভেরিফিকেশন টেস্ট ল্যাব।",
  },
  [ROUTES.PROJECTS]: {
    titleEn: "Engineering Capstone Projects",
    titleBn: "ইঞ্জিনিয়ারিং ক্যাপস্টোন প্রজেক্টস",
    phaseEn: "Phase 3: Production Project Lab",
    phaseBn: "ফেজ ৩: প্রোডাকশন প্রজেক্ট ল্যাব",
    descriptionEn: "Multi-file projects with real git branching, automated linter feedback, and architectural test assertions.",
    descriptionBn: "মাল্টি-ফাইল আর্কিটেকচার, গিট ব্রাঞ্চিং এবং অটোমেটেড আর্কিটেকচারাল টেস্ট সহ পূর্ণাঙ্গ প্রজেক্ট।",
  },
  [ROUTES.CONCEPTS]: {
    titleEn: "Deep Concept Encyclopedia",
    titleBn: "ডিপ কনসেপ্ট এনসাইক্লোপিডিয়া",
    phaseEn: "Phase 1: Conceptual Knowledge Graph",
    phaseBn: "ফেজ ১: কনসেপচুয়াল নলেজ গ্রাফ",
    descriptionEn: "Atomic engineering concepts explained with interactive memory diagrams and execution traces.",
    descriptionBn: "ইন্টারঅ্যাক্টিভ মেমোরি ডায়াগ্রাম এবং এক্সিকিউশন ট্রেস সহ সফটওয়্যার ইঞ্জিনিয়ারিং কনসেপ্ট।",
  },
  [ROUTES.SKILL_MAP]: {
    titleEn: "Knowledge Graph & Skill Map",
    titleBn: "নলেজ গ্রাফ এবং স্কিল ম্যাপ",
    phaseEn: "Phase 2: Mastery DAG Visualizer",
    phaseBn: "ফেজ ২: মাস্টারি ডিরেক্টেড অ্যাসাইক্লিক গ্রাফ (DAG)",
    descriptionEn: "Interactive acyclic graph displaying concept dependencies, mastery heatmaps, and personalized review queues.",
    descriptionBn: "কনসেপ্ট নির্ভরতা, প্ররিকুইজিট পাথ এবং পার্সোনালাইজড রিভিউ কিউ সমন্বিত ইন্টারঅ্যাক্টিভ গ্রাফ।",
  },
  [ROUTES.ARCHITECTURE_LAB]: {
    titleEn: "Distributed System Design Lab",
    titleBn: "ডিস্ট্রিবিউটেড সিস্টেম ডিজাইন ল্যাব",
    phaseEn: "Phase 3: React Flow Distributed Simulator",
    phaseBn: "ফেজ ৩: রিঅ্যাক্ট ফ্লো ডিস্ট্রিবিউটেড সিমুলেটর",
    descriptionEn: "Interactive canvas simulating load balancers, caching layers, message brokers, and failure cascades under high concurrency.",
    descriptionBn: "হাই কনকারেন্সি ও ফেইলিউর ক্যাসকেড সিমুলেশন সহ লোড ব্যালেন্সার, ক্যাশিং এবং মেসেজ ব্রোকার ল্যাব।",
  },
  [ROUTES.PROGRESS]: {
    titleEn: "Engineering Mastery & Progress",
    titleBn: "ইঞ্জিনিয়ারিং মাস্টারি ও অগ্রগতি",
    phaseEn: "Phase 1: Multi-Signal Mastery Tracker",
    phaseBn: "ফেজ ১: মাল্টি-সিগন্যাল মাস্টারি ট্র্যাকার",
    descriptionEn: "Comprehensive analytics covering concept retention, challenge velocity, and spaced repetition intervals.",
    descriptionBn: "কনসেপ্ট রিটেনশন, চ্যালেঞ্জ সমাধানের গতি এবং স্পেসড রিপিটিশন অ্যানালিটিক্স।",
  },
  [ROUTES.SETTINGS]: {
    titleEn: "Platform Settings & Workspace Preferences",
    titleBn: "প্ল্যাটফর্ম সেটিংস ও ওয়ার্কস্পেস পছন্দ",
    phaseEn: "Phase 0: Workspace Configuration",
    phaseBn: "ফেজ ০: ওয়ার্কস্পেস কনফিগারেশন",
    descriptionEn: "Manage bilingual language preferences, theme defaults, keyboard shortcut maps, and local offline cache.",
    descriptionBn: "দ্বিভাষিক ভাষা পছন্দ, থিম, কীবোর্ড শর্টকাট এবং লোকাল অফলাইন ক্যাশ ম্যানেজমেন্ট।",
  },
};

export const PlaceholderPage: React.FC = () => {
  const { t, locale } = useTranslation();
  const location = useLocation();

  const meta = ROUTE_METADATA[location.pathname] || {
    titleEn: "Upcoming Feature",
    titleBn: "আসন্ন ফিচার",
    phaseEn: "Roadmap Milestone",
    phaseBn: "রোডম্যাপ মাইলস্টোন",
    descriptionEn: "This module is planned in the Kodara engineering roadmap and will be released in an upcoming milestone.",
    descriptionBn: "এই মডিউলটি কোদারা ইঞ্জিনিয়ারিং রোডম্যাপে পরিকল্পিত এবং পরবর্তী মাইলস্টোনে যুক্ত করা হবে।",
  };

  const title = locale === "bn" ? meta.titleBn : meta.titleEn;
  const phase = locale === "bn" ? meta.phaseBn : meta.phaseEn;
  const description = locale === "bn" ? meta.descriptionBn : meta.descriptionEn;

  return (
    <PageContainer>
      <div className="placeholder-card">
        <div className="placeholder-card__header">
          <Badge variant="warning" size="md">
            <Construction size={14} />
            <span>{phase}</span>
          </Badge>
          <span className="placeholder-card__path">{location.pathname}</span>
        </div>

        <div className="placeholder-card__body">
          <div className="placeholder-card__icon-wrapper">
            <Terminal size={36} className="placeholder-card__icon" />
          </div>

          <h1 className="placeholder-card__title">{title}</h1>
          <p className="placeholder-card__description">{description}</p>

          <div className="placeholder-card__callout">
            <div className="placeholder-card__callout-title">
              <Sparkles size={16} />
              <span>
                {locale === "bn"
                  ? "কোদারা ফিলোসফি: গভীর মেকানিক্স বুঝুন"
                  : "Kodara Core Philosophy: Understand How Software Works"}
              </span>
            </div>
            <p className="placeholder-card__callout-text">
              {locale === "bn"
                ? "আমরা শুধু সারফেস-লেভেল সিনট্যাক্স শেখাই না। প্রতিটি ল্যাব নিখুঁত এক্সিকিউশন স্যান্ডবক্স ও মেমোরি ট্রেসিং সহ রিলিজ করা হবে।"
                : "We do not ship shallow syntax exercises. Every lab is calibrated with real sandboxed runtime tracing and memory model verification."}
            </p>
          </div>

          <div className="placeholder-card__actions">
            <Link to={ROUTES.DASHBOARD}>
              <Button variant="solid" size="md">
                <ArrowLeft size={16} />
                <span>{t("common.backToDashboard")}</span>
              </Button>
            </Link>

            <Link to={ROUTES.TRACK_TYPESCRIPT}>
              <Button variant="outline" size="md">
                <GitBranch size={16} />
                <span>{locale === "bn" ? "TypeScript ট্র্যাক এক্সপ্লোর করুন" : "Explore TypeScript Track"}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
