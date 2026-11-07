/**
 * Kodara Assessment Subsystem - Assessment Event Dispatcher Service
 * Decoupled event bus emitting assessment events to progress and analytics listeners.
 */

import { AssessmentEvent } from "../types/events.types";

export type AssessmentEventListener = (event: AssessmentEvent) => void;

export class AssessmentEventService {
  private static instance: AssessmentEventService;
  private listeners: Set<AssessmentEventListener> = new Set();
  private eventHistory: AssessmentEvent[] = [];

  public static getInstance(): AssessmentEventService {
    if (!AssessmentEventService.instance) {
      AssessmentEventService.instance = new AssessmentEventService();
    }
    return AssessmentEventService.instance;
  }

  public subscribe(listener: AssessmentEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emit(event: AssessmentEvent): void {
    this.eventHistory.push(event);
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error("Error in AssessmentEvent listener:", err);
      }
    });
  }

  public getHistory(): AssessmentEvent[] {
    return [...this.eventHistory];
  }

  public clearHistory(): void {
    this.eventHistory = [];
  }
}

export const assessmentEventService = AssessmentEventService.getInstance();
