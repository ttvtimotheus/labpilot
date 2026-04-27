import { create } from 'zustand';

import { reviewQuizQuestion, type LearningProgressByQuestion } from '@/src/features/wissen/learning';
import type { QuizQuestion } from '@/src/features/wissen/quiz';
import { getJson, setJson } from '@/src/lib/storage/mmkv';

const learningProgressKey = 'wissen.learningProgress.v1';

interface LearningStore {
  progressByQuestion: LearningProgressByQuestion;
  recordAnswer: (question: QuizQuestion, selected: string, reviewedAt?: Date) => void;
  resetLearningProgress: () => void;
}

function readLearningProgress() {
  return getJson<LearningProgressByQuestion>(learningProgressKey, {});
}

export const useLearningStore = create<LearningStore>((set) => ({
  progressByQuestion: readLearningProgress(),
  recordAnswer: (question, selected, reviewedAt = new Date()) => {
    set((state) => {
      const progressByQuestion = {
        ...state.progressByQuestion,
        [question.id]: reviewQuizQuestion(question, selected, state.progressByQuestion[question.id], reviewedAt),
      };
      setJson(learningProgressKey, progressByQuestion);
      return { progressByQuestion };
    });
  },
  resetLearningProgress: () => {
    setJson(learningProgressKey, {});
    set({ progressByQuestion: {} });
  },
}));