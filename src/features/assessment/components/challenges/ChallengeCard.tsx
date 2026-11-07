import React from "react";
import { Challenge } from "../../types/challenge.types";
import { Code2, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n";
import "./ChallengeCard.css";

export interface ChallengeCardProps {
  challenge: Challenge;
  isCompleted?: boolean;
  onStartChallenge: (challengeId: string) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  isCompleted = false,
  onStartChallenge,
}) => {
  const { locale } = useTranslation();

  return (
    <div className="kodara-challenge-card" data-testid="challenge-card">
      <div className="kodara-challenge-card__top">
        <div className="kodara-challenge-card__tag">
          <Code2 size={15} />
          <span>{locale === "bn" ? "ইঞ্জিনিয়ারিং চ্যালেঞ্জ" : "ENGINEERING CHALLENGE"}</span>
        </div>

        {isCompleted && (
          <div className="kodara-challenge-card__passed">
            <CheckCircle2 size={15} />
            <span>{locale === "bn" ? "পাস করেছে" : "Passed"}</span>
          </div>
        )}
      </div>

      <h3 className="kodara-challenge-card__title">
        {locale === "bn" ? challenge.titleBn : challenge.titleEn}
      </h3>

      <p className="kodara-challenge-card__desc">
        {locale === "bn" ? challenge.descriptionBn : challenge.descriptionEn}
      </p>

      <div className="kodara-challenge-card__meta">
        <span className="kodara-challenge-card__diff-pill">
          {challenge.difficulty}
        </span>

        <span className="kodara-challenge-card__time">
          <Clock size={14} />
          <span>
            ~{challenge.estimatedMinutes} {locale === "bn" ? "মি" : "min"}
          </span>
        </span>
      </div>

      <div className="kodara-challenge-card__concepts">
        {challenge.conceptIds.map((cid) => (
          <span key={cid} className="kodara-challenge-card__concept">
            {cid}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="kodara-challenge-card__btn"
        onClick={() => onStartChallenge(challenge.id)}
      >
        <span>
          {isCompleted
            ? locale === "bn"
              ? "পুনরায় কোড এডিটর খুলুন"
              : "Re-open Challenge"
            : locale === "bn"
            ? "চ্যালেঞ্জ শুরু করুন"
            : "Start Challenge"}
        </span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};
