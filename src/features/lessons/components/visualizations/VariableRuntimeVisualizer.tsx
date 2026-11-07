import React, { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Sliders, AlertCircle } from "lucide-react";
import { useTranslation } from "@/i18n";
import "./VariableRuntimeVisualizer.css";

export const VariableRuntimeVisualizer: React.FC = () => {
  const { locale } = useTranslation();

  const [mode, setMode] = useState<"let" | "const">("let");
  const [step, setStep] = useState<number>(1);
  const [customValue, setCustomValue] = useState<number>(10);

  // Compute current value based on step and mode
  let displayValue: number | string = 10;
  let sourceSnippet = `${mode} count = 10;`;
  let isReassignmentError = false;

  if (step === 1) {
    displayValue = 10;
    sourceSnippet = `${mode} count = 10;`;
  } else if (step === 2) {
    if (mode === "const") {
      isReassignmentError = true;
      displayValue = 10;
      sourceSnippet = `count = 20; // FAILS!`;
    } else {
      displayValue = 20;
      sourceSnippet = `count = 20;`;
    }
  } else if (step === 3) {
    if (mode === "const") {
      isReassignmentError = true;
      displayValue = 10;
      sourceSnippet = `count = count + 5; // FAILS!`;
    } else {
      displayValue = 25;
      sourceSnippet = `count = count + 5;`;
    }
  } else if (step === 4) {
    if (mode === "const") {
      isReassignmentError = true;
      displayValue = 10;
      sourceSnippet = `count = ${customValue}; // FAILS!`;
    } else {
      displayValue = customValue;
      sourceSnippet = `count = ${customValue};`;
    }
  }

  const handleNext = () => {
    if (step < 4) setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setStep(1);
    setCustomValue(10);
  };

  const getExplanation = () => {
    if (isReassignmentError) {
      return locale === "bn"
        ? "ত্রুটি: 'const' দিয়ে ডিক্লেয়ার করা ভেরিয়েবল অপরিবর্তনীয় বাইন্ডিং তৈরি করে। রানটাইমে এতে নতুন মান রি-অ্যাসাইন করা অসম্ভব!"
        : "TypeError: Assignment to constant variable. In const mode, the binding slot is permanently locked to its initial reference!";
    }

    switch (step) {
      case 1:
        return locale === "bn"
          ? "ধাপ ১: 'count' নামক আইডেন্টিফায়ার তৈরি হয়েছে এবং মেমোরিতে ১০ মান ধারণকারী স্লটের সাথে যুক্ত হয়েছে।"
          : "Step 1: Declaration allocated a binding slot 'count' in the Environment Record and initialized it with 10.";
      case 2:
        return locale === "bn"
          ? "ধাপ ২: রি-অ্যাসাইনমেন্টের মাধ্যমে বিদ্যমান 'count' বাইন্ডিংটিকে নতুন মান ২০ এ নির্দেশ করানো হলো।"
          : "Step 2: Reassignment overwrote the memory slot for 'count' with 20. The binding identifier remains identical.";
      case 3:
        return locale === "bn"
          ? "ধাপ ৩: এক্সপ্রেশন হিসাব করে মান ২৫ এ আপডেট করা হলো।"
          : "Step 3: Computed (count + 5) and updated the slot to 25.";
      case 4:
        return locale === "bn"
          ? `ধাপ ৪: স্লাইডার নাড়িয়ে সরাসরি মেমোরি স্লট আপডেট করুন। বর্তমান মান: ${displayValue}।`
          : `Step 4: Interactive scrub mode. Drag the slider to update the memory slot directly. Current value: ${displayValue}.`;
      default:
        return "";
    }
  };

  return (
    <div className="kodara-var-vis" data-testid="variable-runtime-visualizer">
      <div className="kodara-var-vis__header">
        <div className="kodara-var-vis__title">
          <Sliders size={16} style={{ color: "#FF5E1E" }} />
          <span>
            {locale === "bn"
              ? "ইন্টারঅ্যাক্টিভ রানটাইম ল্যাবরেটরি"
              : "Interactive Runtime Laboratory"}
          </span>
        </div>

        <div className="kodara-var-vis__mode-toggle">
          <span style={{ fontSize: 11, color: "#777", padding: "0 6px" }}>
            {locale === "bn" ? "মোড:" : "Mode:"}
          </span>
          <button
            type="button"
            className={`kodara-var-vis__mode-btn ${
              mode === "let" ? "kodara-var-vis__mode-btn--active" : ""
            }`}
            onClick={() => setMode("let")}
          >
            let (mutable)
          </button>
          <button
            type="button"
            className={`kodara-var-vis__mode-btn ${
              mode === "const" ? "kodara-var-vis__mode-btn--active" : ""
            }`}
            onClick={() => setMode("const")}
          >
            const (immutable)
          </button>
        </div>
      </div>

      <div className="kodara-var-vis__canvas-area">
        <div className="kodara-var-vis__diagram-row">
          {/* Source Code Box */}
          <div className="kodara-var-vis__box kodara-var-vis__box--source">
            <span className="kodara-var-vis__box-label">
              {locale === "bn" ? "সোর্স কোড" : "Source Code"}
            </span>
            <span className="kodara-var-vis__box-content">{sourceSnippet}</span>
          </div>

          <div className="kodara-var-vis__connector">
            <span>Evaluates</span>
            <span>→</span>
          </div>

          {/* Lexical Environment Record (Binding) */}
          <div className="kodara-var-vis__box kodara-var-vis__box--binding">
            <span className="kodara-var-vis__box-label">
              {locale === "bn" ? "এনভায়রনমেন্ট বাইন্ডিং" : "Environment Binding"}
            </span>
            <span
              className="kodara-var-vis__box-content"
              style={{ color: "#FF5E1E" }}
            >
              count {mode === "const" ? "🔒 (const)" : "🔓 (let)"}
            </span>
          </div>

          <div className="kodara-var-vis__connector">
            <span>Points to</span>
            <span>→</span>
          </div>

          {/* Memory Value Slot */}
          <div className="kodara-var-vis__box kodara-var-vis__box--value">
            <span className="kodara-var-vis__box-label">
              {locale === "bn" ? "মেমোরি ভ্যালু" : "Memory Value"}
            </span>
            <span
              className="kodara-var-vis__box-content"
              style={{
                color: isReassignmentError ? "#DC2626" : "#16A34A",
                fontSize: 18,
              }}
            >
              {displayValue}
            </span>
          </div>
        </div>

        {isReassignmentError && (
          <div className="kodara-var-vis__error-toast">
            <AlertCircle size={16} />
            <span>
              TypeError: Assignment to constant variable. Reassignment blocked!
            </span>
          </div>
        )}
      </div>

      <div className="kodara-var-vis__explanation-bar">{getExplanation()}</div>

      <div className="kodara-var-vis__controls">
        <div className="kodara-var-vis__stepper">
          <button
            type="button"
            className="kodara-var-vis__btn"
            onClick={handlePrev}
            disabled={step === 1}
          >
            <ChevronLeft size={14} />
            <span>{locale === "bn" ? "পূর্ববর্তী" : "Prev"}</span>
          </button>

          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 600,
              padding: "0 6px",
            }}
          >
            {locale === "bn" ? `ধাপ ${step} / ৪` : `Step ${step} / 4`}
          </span>

          <button
            type="button"
            className="kodara-var-vis__btn"
            onClick={handleNext}
            disabled={step === 4}
          >
            <span>{locale === "bn" ? "পরবর্তী" : "Next"}</span>
            <ChevronRight size={14} />
          </button>

          <button
            type="button"
            className="kodara-var-vis__btn"
            onClick={handleReset}
            title="Reset"
          >
            <RotateCcw size={13} />
            <span>{locale === "bn" ? "রিসেট" : "Reset"}</span>
          </button>
        </div>

        {step === 4 && mode === "let" && (
          <div className="kodara-var-vis__slider-group">
            <span>{locale === "bn" ? "মান পরিবর্তন করুন:" : "Scrub Value:"}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={customValue}
              onChange={(e) => setCustomValue(Number(e.target.value))}
              className="kodara-var-vis__slider"
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                minWidth: 24,
              }}
            >
              {customValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
