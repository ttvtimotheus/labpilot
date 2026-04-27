import { describe, expect, it } from 'vitest';

import { calculateLearningStreak, reviewQuizQuestion, selectLearningSession, summariseLearningProgress } from '@/src/features/wissen/learning';
import type { QuizQuestion } from '@/src/features/wissen/quiz';

const questions: QuizQuestion[] = [
  {
    id: 'q-1',
    kind: 'normalwert-value',
    prompt: 'Frage 1',
    answer: 'A',
    options: ['A', 'B'],
    explanation: 'Erklaerung 1',
    sourceLabel: 'Quelle 1',
  },
  {
    id: 'q-2',
    kind: 'naehrmedium-use',
    prompt: 'Frage 2',
    answer: 'C',
    options: ['C', 'D'],
    explanation: 'Erklaerung 2',
    sourceLabel: 'Quelle 2',
  },
  {
    id: 'q-3',
    kind: 'naehrmedium-indicator',
    prompt: 'Frage 3',
    answer: 'E',
    options: ['E', 'F'],
    explanation: 'Erklaerung 3',
    sourceLabel: 'Quelle 3',
  },
];

describe('wissen learning', () => {
  it('schedules correct and wrong answers for spaced repetition', () => {
    const firstReviewAt = new Date('2026-04-28T10:00:00.000Z');
    const firstProgress = reviewQuizQuestion(questions[0], 'A', undefined, firstReviewAt);

    expect(firstProgress.attempts).toBe(1);
    expect(firstProgress.correctStreak).toBe(1);
    expect(firstProgress.intervalDays).toBe(1);
    expect(firstProgress.dueAt).toBe('2026-04-29T10:00:00.000Z');

    const secondProgress = reviewQuizQuestion(questions[0], 'A', firstProgress, new Date('2026-04-29T10:00:00.000Z'));
    expect(secondProgress.correctStreak).toBe(2);
    expect(secondProgress.intervalDays).toBe(3);

    const wrongProgress = reviewQuizQuestion(questions[0], 'B', secondProgress, new Date('2026-04-30T10:00:00.000Z'));
    expect(wrongProgress.correctStreak).toBe(0);
    expect(wrongProgress.intervalDays).toBe(0);
    expect(wrongProgress.correctCount).toBe(2);
  });

  it('selects due cards before new cards and summarises progress', () => {
    const now = new Date('2026-04-28T10:00:00.000Z');
    const progressByQuestion = {
      'q-1': {
        questionId: 'q-1',
        attempts: 1,
        correctCount: 1,
        correctStreak: 3,
        intervalDays: 0,
        dueAt: '2026-04-27T10:00:00.000Z',
        lastAnsweredAt: '2026-04-28T09:00:00.000Z',
      },
      'q-2': {
        questionId: 'q-2',
        attempts: 1,
        correctCount: 1,
        correctStreak: 1,
        intervalDays: 7,
        dueAt: '2026-05-05T10:00:00.000Z',
        lastAnsweredAt: '2026-04-28T09:30:00.000Z',
      },
    };

    expect(selectLearningSession(questions, progressByQuestion, now, 2).map((question) => question.id)).toEqual(['q-1', 'q-3']);
    expect(summariseLearningProgress(questions, progressByQuestion, now)).toEqual({
      practisedCount: 2,
      newCount: 1,
      dueCount: 1,
      masteredCount: 1,
      streakDays: 1,
    });
  });

  it('counts only consecutive practice days ending today', () => {
    expect(calculateLearningStreak([
      '2026-04-26T08:00:00.000Z',
      '2026-04-27T08:00:00.000Z',
      '2026-04-28T08:00:00.000Z',
    ], new Date('2026-04-28T10:00:00.000Z'))).toBe(3);

    expect(calculateLearningStreak([
      '2026-04-26T08:00:00.000Z',
      '2026-04-27T08:00:00.000Z',
    ], new Date('2026-04-28T10:00:00.000Z'))).toBe(0);
  });
});