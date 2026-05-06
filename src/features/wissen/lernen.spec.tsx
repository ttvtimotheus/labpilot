import { beforeEach, describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import LernkartenScreen from '@/app/(tabs)/wissen/lernen';
import { useLearningStore } from '@/src/features/wissen/learning.store';
import { buildReferenceQuiz } from '@/src/features/wissen/quiz';

describe('LernkartenScreen', () => {
  beforeEach(() => {
    useLearningStore.getState().resetLearningProgress();
  });

  it('shows the first generated question and evaluates a correct answer', () => {
    const [firstQuestion, secondQuestion] = buildReferenceQuiz(12);

    render(<LernkartenScreen />);

    expect(screen.getByText(firstQuestion.prompt)).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: firstQuestion.answer }));

    expect(screen.getByText('Richtig')).toBeTruthy();
    expect(screen.getByText('1 richtig')).toBeTruthy();
    expect(useLearningStore.getState().progressByQuestion[firstQuestion.id]?.correctStreak).toBe(1);

    fireEvent.press(screen.getByRole('button', { name: 'Weiter' }));

    expect(screen.getByText(secondQuestion.prompt)).toBeTruthy();
  });

  it('shows the correct answer after a wrong selection', () => {
    const [firstQuestion] = buildReferenceQuiz(12);
    const wrongAnswer = firstQuestion.options.find((option) => option !== firstQuestion.answer);

    render(<LernkartenScreen />);
    fireEvent.press(screen.getByRole('button', { name: wrongAnswer }));

    expect(screen.getByText(`Richtig waere: ${firstQuestion.answer}`)).toBeTruthy();
    expect(screen.getByText('0 richtig')).toBeTruthy();
  });
});