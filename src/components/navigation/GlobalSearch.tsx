import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Layers, Terminal, Cpu, ArrowRight, X } from "lucide-react";
import { useTranslation } from "@/i18n";
import { ROUTES } from "@/config/routes";
import { Badge } from "@/components/ui/Badge";
import "./GlobalSearch.css";

interface SearchItem {
  id: string;
  titleEn: string;
  titleBn: string;
  category: "track" | "lesson" | "tool" | "concept";
  route: string;
  badge?: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: "track-ts",
    titleEn: "TypeScript: Deep Language Mechanics",
    titleBn: "TypeScript: গভীর ল্যাঙ্গুয়েজ মেকানিক্স",
    category: "track",
    route: ROUTES.TRACK_TYPESCRIPT,
    badge: "Track",
  },
  {
    id: "track-py",
    titleEn: "Python: Internals & Memory Model",
    titleBn: "Python: ইন্টারনালস এবং মেমোরি মডেল",
    category: "track",
    route: ROUTES.TRACK_PYTHON,
    badge: "Track",
  },
  {
    id: "track-react",
    titleEn: "React: Fiber Architecture & State",
    titleBn: "React: ফাইবার আর্কিটেকচার এবং স্টেট",
    category: "track",
    route: ROUTES.TRACK_REACT,
    badge: "Track",
  },
  {
    id: "track-sys",
    titleEn: "System Design: Distributed Architectures",
    titleBn: "System Design: ডিস্ট্রিবিউটেড সিস্টেম আর্কিটেকচার",
    category: "track",
    route: ROUTES.TRACK_SYSTEM_DESIGN,
    badge: "Track",
  },
  {
    id: "track-ai",
    titleEn: "AI Engineering: Embeddings, RAG & LLMs",
    titleBn: "AI Engineering: এমবেডিংস, RAG এবং LLM",
    category: "track",
    route: ROUTES.TRACK_AI_ENGINEERING,
    badge: "Track",
  },
  {
    id: "lesson-ts-var",
    titleEn: "Variables, Scopes & Memory Allocation in TypeScript",
    titleBn: "TypeScript এ ভেরিয়েবল, স্কোপ এবং মেমোরি অ্যালোকেশন",
    category: "lesson",
    route: `${ROUTES.TRACK_TYPESCRIPT}/lesson-01`,
    badge: "Lesson",
  },
  {
    id: "concept-event-loop",
    titleEn: "The JavaScript Event Loop & Microtask Queue",
    titleBn: "জাভাস্ক্রিপ্ট ইভেন্ট লুপ এবং মাইক্রোটাস্ক কিউ",
    category: "concept",
    route: ROUTES.CONCEPTS,
    badge: "Concept",
  },
  {
    id: "concept-caching",
    titleEn: "Distributed Caching: Redis & Cache Eviction Strategies",
    titleBn: "ডিস্ট্রিবিউটেড ক্যাশিং: Redis এবং ক্যাশ এভিকশন কৌশল",
    category: "concept",
    route: ROUTES.ARCHITECTURE_LAB,
    badge: "Architecture",
  },
  {
    id: "tool-playground",
    titleEn: "Technical Playground & Execution Sandbox",
    titleBn: "টেকনিক্যাল প্লেগ্রাউন্ড এবং কোড স্যান্ডবক্স",
    category: "tool",
    route: ROUTES.PLAYGROUND,
    badge: "Sandbox",
  },
  {
    id: "tool-challenges",
    titleEn: "Output Prediction & Debugging Challenges",
    titleBn: "আউটপুট প্রেডিকশন এবং ডিবাগিং চ্যালেঞ্জ",
    category: "tool",
    route: ROUTES.CHALLENGES,
    badge: "Challenges",
  },
  {
    id: "tool-skill-map",
    titleEn: "Mastery Graph & Interactive Skill Map",
    titleBn: "মাস্টারি গ্রাফ এবং ইন্টারঅ্যাক্টিভ স্কিল ম্যাপ",
    category: "tool",
    route: ROUTES.SKILL_MAP,
    badge: "Graph",
  },
];

export interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredItems = SEARCH_ITEMS.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.titleEn.toLowerCase().includes(q) ||
      item.titleBn.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.badge?.toLowerCase().includes(q)
    );
  });

  const handleSelect = (route: string) => {
    navigate(route);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? filteredItems.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex].route);
    }
  };

  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "track":
        return <BookOpen size={16} className="search-result__icon--orange" />;
      case "lesson":
        return <Terminal size={16} className="search-result__icon--orange" />;
      case "tool":
        return <Cpu size={16} className="search-result__icon--orange" />;
      case "concept":
        return <Layers size={16} className="search-result__icon--orange" />;
      default:
        return <Search size={16} className="search-result__icon--orange" />;
    }
  };

  return (
    <div className="global-search-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="global-search-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="global-search-header">
          <Search size={18} className="global-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="global-search-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={t("common.searchPlaceholder")}
            aria-label="Search"
          />
          {query ? (
            <button
              className="global-search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear query"
            >
              <X size={16} />
            </button>
          ) : (
            <kbd className="global-search-kbd">ESC</kbd>
          )}
        </div>

        <div className="global-search-body">
          {filteredItems.length === 0 ? (
            <div className="global-search-empty">
              <p>{t("common.searchEmpty")}</p>
            </div>
          ) : (
            <ul className="global-search-list" role="listbox">
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const title = locale === "bn" ? item.titleBn : item.titleEn;

                return (
                  <li
                    key={item.id}
                    id={`search-item-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    className={`global-search-item ${isSelected ? "global-search-item--selected" : ""}`}
                    onClick={() => handleSelect(item.route)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="global-search-item__icon">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="global-search-item__content">
                      <span className="global-search-item__title">{title}</span>
                      <span className="global-search-item__route">{item.route}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="outline" size="sm">
                        {item.badge}
                      </Badge>
                    )}
                    <ArrowRight size={14} className="global-search-item__arrow" />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="global-search-footer">
          <div className="global-search-footer__hint">
            <span><kbd>↑</kbd><kbd>↓</kbd> নেভিগেট</span>
            <span><kbd>↵</kbd> নির্বাচন</span>
            <span><kbd>ESC</kbd> বন্ধ</span>
          </div>
          <span className="global-search-footer__brand">Kodara Index</span>
        </div>
      </div>
    </div>
  );
};
