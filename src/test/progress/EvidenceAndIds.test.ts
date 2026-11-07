import { describe, it, expect, afterEach } from 'vitest';
import { normalizeEvent } from '@/features/progress/engines/EvidenceNormalizer';
import { computeConceptMastery } from '@/features/progress/engines/MasteryEngine';
import { practiceService } from '@/features/assessment/services/PracticeService';
import { assessmentEventService } from '@/features/assessment/services/AssessmentEventService';
import type { AssessmentEvent } from '@/features/assessment/types/events.types';
import type { MultipleChoiceQuestion } from '@/features/assessment/types/practice.types';
import { isUuidV7, newEventIdentity, uuidv7TimestampMs } from '@/lib/ids';

const prediction = (isCorrect: boolean): AssessmentEvent => ({
  ...newEventIdentity(),
  type: 'prediction.made',
  predictionId: 'pred.event-loop.order-1',
  kind: 'order',
  conceptIds: ['concept.microtask', 'concept.event-loop'],
  isCorrect,
  attemptNumber: 1,
  difficulty: 3,
  timeSpentSeconds: 40,
});

const breakIt: AssessmentEvent = {
  ...newEventIdentity(),
  type: 'breakIt.resolved',
  scenarioId: 'break.closure.var-loop',
  conceptIds: ['concept.closure'],
  difficulty: 3,
  timeToDiagnoseSeconds: 95,
  attempts: 2,
  hintsUsedCount: 1,
};

describe('prediction and break-it evidence', () => {
  it('maps a prediction to one record per concept with the right signal', () => {
    const correct = normalizeEvent(prediction(true)).records;
    expect(correct).toHaveLength(2);
    expect(correct.every((r) => r.signal === 'prediction_correct' && r.source === 'prediction')).toBe(true);

    const wrong = normalizeEvent(prediction(false)).records;
    expect(wrong.every((r) => r.signal === 'prediction_incorrect' && !r.isCorrect)).toBe(true);
  });

  it('maps a resolved break-it to break_it_resolved, with diagnosis time as time spent', () => {
    const [record] = normalizeEvent(breakIt).records;
    expect(record.signal).toBe('break_it_resolved');
    expect(record.source).toBe('break_it');
    expect(record.timeSpentSeconds).toBe(95);
    expect(record.hintsUsed).toBe(1);
  });

  it('gives evidence deterministic ids, so normalizing an event twice cannot duplicate it', () => {
    const event = prediction(true);
    const first = normalizeEvent(event).records.map((r) => r.id);
    const second = normalizeEvent(event).records.map((r) => r.id);
    expect(second).toEqual(first);
    expect(first).toEqual([`${event.id}:concept.microtask`, `${event.id}:concept.event-loop`]);
  });

  it('counts predictions toward practice accuracy and break-its toward challenge completion', () => {
    const evidence = [
      ...normalizeEvent(prediction(true)).records,
      ...normalizeEvent(prediction(false)).records,
    ];
    const mastery = computeConceptMastery('concept.microtask', evidence);
    expect(mastery.dimensions.practiceAccuracy).toBeCloseTo(0.5);
    expect(mastery.evidenceCount).toBe(2);

    const closure = computeConceptMastery('concept.closure', normalizeEvent(breakIt).records);
    expect(closure.dimensions.challengeCompletion).toBe(1);
  });
});

describe('UUIDv7 ids for assessment facts', () => {
  afterEach(() => assessmentEventService.clearHistory());

  const question: MultipleChoiceQuestion = {
    id: 'q.closure.1',
    conceptIds: ['concept.closure'],
    type: 'multiple-choice',
    difficulty: 2,
    estimatedSeconds: 30,
    promptEn: 'p', promptBn: 'p', explanationEn: 'e', explanationBn: 'e',
    options: [
      { id: 'a', textEn: 'A', textBn: 'A', isCorrect: true },
      { id: 'b', textEn: 'B', textBn: 'B', isCorrect: false },
    ],
  };

  it('emits events whose timestamp equals the time inside the id, with unique ids', () => {
    const emitted: AssessmentEvent[] = [];
    const unsubscribe = assessmentEventService.subscribe((e) => emitted.push(e));

    // Answers in the same millisecond used to collide (`evt_${Date.now()}`)
    // and the ingestion dedupe silently dropped the second one.
    let session = practiceService.createSession('lesson', 'js.closures', [question, { ...question, id: 'q.closure.2' }], undefined, 2);
    session = practiceService.submitAnswer(session, 'a', 10).session;
    const { attempt } = practiceService.submitAnswer(session, 'b', 12);
    unsubscribe();

    expect(isUuidV7(session.sessionId)).toBe(true);
    expect(isUuidV7(attempt.id)).toBe(true);
    expect(emitted.length).toBeGreaterThanOrEqual(3);   // 2 answers + session completed
    for (const event of emitted) {
      expect(isUuidV7(event.id)).toBe(true);
      expect(new Date(event.timestamp).getTime()).toBe(uuidv7TimestampMs(event.id));
    }
    expect(new Set(emitted.map((e) => e.id)).size).toBe(emitted.length);
  });
});
