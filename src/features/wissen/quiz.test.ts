import { describe, expect, it } from 'vitest';

import { buildReferenceQuiz, isCorrectAnswer, scoreQuiz } from '@/src/features/wissen/quiz';

describe('wissen quiz', () => {
  it('builds deterministic reference questions with valid options', () => {
    const questions = buildReferenceQuiz(8);

    expect(questions).toHaveLength(8);
    expect(questions.every((question) => question.options.includes(question.answer))).toBe(true);
    expect(questions.every((question) => new Set(question.options).size === question.options.length)).toBe(true);
  });

  it('scores selected answers', () => {
    const [first, second] = buildReferenceQuiz(2);
    const answers = {
      [first.id]: first.answer,
      [second.id]: second.options.find((option) => option !== second.answer) ?? null,
    };

    expect(isCorrectAnswer(first, answers[first.id])).toBe(true);
    expect(scoreQuiz([first, second], answers)).toBe(1);
  });
});