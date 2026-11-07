/**
 * Kodara Assessment Subsystem - Local Attempt Repository
 * Manages local persistence for practice attempts and challenge code drafts.
 */

import { PracticeAttempt } from "../types/practice.types";
import { ChallengeAttempt } from "../types/challenge.types";

const PRACTICE_ATTEMPTS_KEY = "kodara_practice_attempts_v1";
const CHALLENGE_ATTEMPTS_KEY = "kodara_challenge_attempts_v1";
const CHALLENGE_DRAFTS_KEY = "kodara_challenge_drafts_v1";

export class LocalAttemptRepository {
  public savePracticeAttempt(attempt: PracticeAttempt): void {
    try {
      const attempts = this.getPracticeAttempts();
      attempts.push(attempt);
      localStorage.setItem(PRACTICE_ATTEMPTS_KEY, JSON.stringify(attempts));
    } catch (e) {
      console.warn("Failed to persist practice attempt in localStorage", e);
    }
  }

  public getPracticeAttempts(): PracticeAttempt[] {
    try {
      const raw = localStorage.getItem(PRACTICE_ATTEMPTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public saveChallengeAttempt(attempt: ChallengeAttempt): void {
    try {
      const attempts = this.getChallengeAttempts();
      attempts.push(attempt);
      localStorage.setItem(CHALLENGE_ATTEMPTS_KEY, JSON.stringify(attempts));
    } catch (e) {
      console.warn("Failed to persist challenge attempt in localStorage", e);
    }
  }

  public getChallengeAttempts(): ChallengeAttempt[] {
    try {
      const raw = localStorage.getItem(CHALLENGE_ATTEMPTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public saveChallengeDraft(challengeId: string, code: string): void {
    try {
      const drafts = this.getChallengeDrafts();
      drafts[challengeId] = code;
      localStorage.setItem(CHALLENGE_DRAFTS_KEY, JSON.stringify(drafts));
    } catch (e) {
      console.warn("Failed to persist challenge draft", e);
    }
  }

  public getChallengeDraft(challengeId: string): string | undefined {
    return this.getChallengeDrafts()[challengeId];
  }

  private getChallengeDrafts(): Record<string, string> {
    try {
      const raw = localStorage.getItem(CHALLENGE_DRAFTS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
}

export const localAttemptRepository = new LocalAttemptRepository();
