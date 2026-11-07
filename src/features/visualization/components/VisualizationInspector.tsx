import React from "react";
import { X, Cpu } from "lucide-react";
import { InspectorItemDetails } from "../types/visualization.types";
import { useTranslation } from "@/i18n";
import "./VisualizationInspector.css";

export interface VisualizationInspectorProps {
  selectedNodeId: string;
  details?: InspectorItemDetails;
  onClose: () => void;
}

export const VisualizationInspector: React.FC<VisualizationInspectorProps> = ({
  selectedNodeId,
  details,
  onClose,
}) => {
  const { locale } = useTranslation();

  const title = details
    ? locale === "bn"
      ? details.titleBn
      : details.titleEn
    : selectedNodeId;

  const desc = details
    ? locale === "bn"
      ? details.detailsBn
      : details.detailsEn
    : locale === "bn"
    ? "কোনো অতিরিক্ত বিবরণ সংজ্ঞায়িত করা হয়নি।"
    : "No additional diagnostics defined for this element.";

  return (
    <aside
      className="kodara-vis-inspector"
      data-testid="visualization-inspector"
      aria-label="Node Inspector"
    >
      <div className="kodara-vis-inspector__header">
        <div className="kodara-vis-inspector__title">
          <Cpu size={14} style={{ color: "var(--accent-primary, #FF5E1E)" }} />
          <span>{locale === "bn" ? "এলিমেন্ট ইন্সপেক্টর" : "Element Inspector"}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="kodara-vis-inspector__close-btn"
          aria-label="Close Inspector"
        >
          <X size={14} />
        </button>
      </div>

      <div className="kodara-vis-inspector__body">
        <div className="kodara-vis-inspector__item-title">{title}</div>

        {details?.kind && (
          <div className="kodara-vis-inspector__row">
            <span className="kodara-vis-inspector__label">
              {locale === "bn" ? "ধরন / প্রকার" : "Kind / Type"}:
            </span>
            <span className="kodara-vis-inspector__badge">{details.kind}</span>
          </div>
        )}

        {details?.memoryAddress && (
          <div className="kodara-vis-inspector__row">
            <span className="kodara-vis-inspector__label">
              {locale === "bn" ? "মেমোরি ঠিকানা" : "Memory Address"}:
            </span>
            <span className="kodara-vis-inspector__addr">
              {details.memoryAddress}
            </span>
          </div>
        )}

        {details?.scope && (
          <div className="kodara-vis-inspector__row">
            <span className="kodara-vis-inspector__label">
              {locale === "bn" ? "স্কোপ" : "Scope"}:
            </span>
            <span className="kodara-vis-inspector__val">{details.scope}</span>
          </div>
        )}

        {details?.value !== undefined && (
          <div className="kodara-vis-inspector__row">
            <span className="kodara-vis-inspector__label">
              {locale === "bn" ? "বর্তমান মান" : "Value"}:
            </span>
            <span className="kodara-vis-inspector__val kodara-vis-inspector__val--code">
              {details.value}
            </span>
          </div>
        )}

        <div className="kodara-vis-inspector__desc">{desc}</div>
      </div>
    </aside>
  );
};
