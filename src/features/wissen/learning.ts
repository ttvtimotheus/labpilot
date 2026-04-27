import { isCorrectAnswer, type QuizQuestion } from '@/src/features/wissen/quiz';

export interface LearningProgress {
  questionId: string;
  attempts: number;
  correctCount: number;
  correctStreak: number;
  intervalDays: number;
  dueAt: string;
  lastAnsweredAt: string;
}

export type LearningProgressByQuestion = Record<string, LearningProgress | undefined>;

export interface LearningSummary {
  practisedCount: number;
  newCount: number;
  dueCount: number;
  masteredCount: number;
  streakDays: number;
}

const dayInMs = 24 * 60 * 60 * 1000;
const masteredStreak = 3;

export function getLearningDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * dayInMs);
}

function shiftDayKey(dayKey: string, days: number) {
  const [year, month, day] = dayKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function nextCorrectInterval(previousInterval: number, nextStreak: number) {
  if (nextStreak <= 1) return 1;
  if (nextStreak === 2) return Math.max(3, previousInterval * 2);
  return Math.min(30, Math.max(7, Math.round(previousInterval * 2.2)));
}

export function reviewQuizQuestion(question: QuizQuestion, selected: string, existing?: LearningProgress, reviewedAt = new Date()): LearningProgress {
  const correct = isCorrectAnswer(question, selected);
  const correctStreak = correct ? (existing?.correctStreak ?? 0) + 1 : 0;
  const intervalDays = correct ? nextCorrectInterval(existing?.intervalDays ?? 0, correctStreak) : 0;

  return {
    questionId: question.id,
    attempts: (existing?.attempts ?? 0) + 1,
    correctCount: (existing?.correctCount ?? 0) + (correct ? 1 : 0),
    correctStreak,
    intervalDays,
    dueAt: addDays(reviewedAt, intervalDays).toISOString(),
    lastAnsweredAt: reviewedAt.toISOString(),
  };
}

export function calculateLearningStreak(answeredAtValues: string[], now = new Date()) {
  const practisedDays = new Set(
    answeredAtValues
      .map((value) => new Date(value))
      .filter((date) => Number.isFinite(date.getTime()))
      .map(getLearningDayKey),
  );
  let cursor = getLearningDayKey(now);
  let streak = 0;

  while (practisedDays.has(cursor)) {
    streak += 1;
    cursor = shiftDayKey(cursor, -1);
  }

  return streak;
}

export function summariseLearningProgress(questions: QuizQuestion[], progressByQuestion: LearningProgressByQuestion, now = new Date()): LearningSummary {
  const knownQuestionIds = new Set(questions.map((question) => question.id));
  const progressValues = Object.values(progressByQuestion).filter((progress): progress is LearningProgress => progress !== undefined && knownQuestionIds.has(progress.questionId));
  const nowTime = now.getTime();

  return {
    practisedCount: progressValues.length,
    newCount: questions.filter((question) => !progressByQuestion[question.id]).length,
    dueCount: questions.filter((question) => {
      const progress = progressByQuestion[question.id];
      return progress !== undefined && new Date(progress.dueAt).getTime() <= nowTime;
    }).length,
    masteredCount: progressValues.filter((progress) => progress.correctStreak >= masteredStreak).length,
    streakDays: calculateLearningStreak(progressValues.map((progress) => progress.lastAnsweredAt), now),
  };
}

export function selectLearningSession(questions: QuizQuestion[], progressByQuestion: LearningProgressByQuestion, now = new Date(), limit = 12) {
  const nowTime = now.getTime();
  const due = questions
    .filter((question) => {
      const progress = progressByQuestion[question.id];
      return progress !== undefined && new Date(progress.dueAt).getTime() <= nowTime;
    })
    .sort((left, right) => {
      const leftDue = progressByQuestion[left.id]?.dueAt ?? '';
      const rightDue = progressByQuestion[right.id]?.dueAt ?? '';
      return leftDue.localeCompare(rightDue) || left.id.localeCompare(right.id, 'de');
    });
  const fresh = questions.filter((question) => !progressByQuestion[question.id]).sort((left, right) => left.id.localeCompare(right.id, 'de'));
  const future = questions
    .filter((question) => {
      const progress = progressByQuestion[question.id];
      return progress !== undefined && new Date(progress.dueAt).getTime() > nowTime;
    })
    .sort((left, right) => {
      const leftDue = progressByQuestion[left.id]?.dueAt ?? '';
      const rightDue = progressByQuestion[right.id]?.dueAt ?? '';
      return leftDue.localeCompare(rightDue) || left.id.localeCompare(right.id, 'de');
    });

  return [...due, ...fresh, ...future].slice(0, limit);
}