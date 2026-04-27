import { naehrmedien, normalwerte, type NaehrmediumReference, type NormalwertReference } from '@/src/features/wissen/references';

export type QuizQuestionKind = 'normalwert-value' | 'naehrmedium-use' | 'naehrmedium-indicator';

export interface QuizQuestion {
  id: string;
  kind: QuizQuestionKind;
  prompt: string;
  answer: string;
  options: string[];
  explanation: string;
  sourceLabel: string;
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.trim())));
}

function rotateOptions(correct: string, distractors: string[], seed: string) {
  const options = unique([correct, ...distractors]).slice(0, 4);
  if (options.length < 2) return options;
  const correctIndex = options.indexOf(correct);
  const targetIndex = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % options.length;
  const next = [...options];
  next[correctIndex] = next[targetIndex];
  next[targetIndex] = correct;
  return next;
}

function normalwertQuestion(entry: NormalwertReference, pool: NormalwertReference[]): QuizQuestion | null {
  const distractors = pool
    .filter((candidate) => candidate.id !== entry.id && candidate.category === entry.category)
    .map((candidate) => candidate.value);
  const fallbackDistractors = pool.filter((candidate) => candidate.id !== entry.id).map((candidate) => candidate.value);
  const options = rotateOptions(entry.value, distractors.length >= 3 ? distractors : fallbackDistractors, entry.id);
  if (options.length < 2) return null;

  return {
    id: `normalwert-value:${entry.id}`,
    kind: 'normalwert-value',
    prompt: `Welcher Referenzbereich gehoert zu ${entry.label}?`,
    answer: entry.value,
    options,
    explanation: [entry.si_value, entry.conventional_value, entry.specimen, entry.note].filter(Boolean).join(' · ') || 'Referenzbereiche sind methoden- und laborabhaengig.',
    sourceLabel: entry.label,
  };
}

function naehrmediumUseQuestion(entry: NaehrmediumReference, pool: NaehrmediumReference[]): QuizQuestion | null {
  const distractors = pool.filter((candidate) => candidate.id !== entry.id).map((candidate) => candidate.name);
  const options = rotateOptions(entry.name, distractors, entry.id);
  if (options.length < 2) return null;

  return {
    id: `naehrmedium-use:${entry.id}`,
    kind: 'naehrmedium-use',
    prompt: `Welches Medium passt zu: ${entry.use}?`,
    answer: entry.name,
    options,
    explanation: [entry.selectivity, entry.incubation, entry.tipps].filter(Boolean).join(' · ') || 'Naehrmedien immer im Kontext der Probe und Fragestellung waehlen.',
    sourceLabel: entry.name,
  };
}

function naehrmediumIndicatorQuestion(entry: NaehrmediumReference, pool: NaehrmediumReference[]): QuizQuestion | null {
  if (!entry.indicator || entry.indicator === 'keiner') return null;
  const distractors = pool
    .filter((candidate) => candidate.id !== entry.id && candidate.indicator && candidate.indicator !== 'keiner')
    .map((candidate) => candidate.indicator as string);
  const options = rotateOptions(entry.indicator, distractors, `${entry.id}:indicator`);
  if (options.length < 2) return null;

  return {
    id: `naehrmedium-indicator:${entry.id}`,
    kind: 'naehrmedium-indicator',
    prompt: `Welcher Indikator gehoert zu ${entry.name}?`,
    answer: entry.indicator,
    options,
    explanation: [entry.key_reactions?.join(' · '), entry.color].filter(Boolean).join(' · ') || 'Indikatoren erleichtern die Differenzierung typischer Reaktionen.',
    sourceLabel: entry.name,
  };
}

export function buildReferenceQuiz(limit = 12) {
  const normalwertQuestions = normalwerte.map((entry) => normalwertQuestion(entry, normalwerte));
  const naehrmediumQuestions = naehrmedien.flatMap((entry) => [naehrmediumUseQuestion(entry, naehrmedien), naehrmediumIndicatorQuestion(entry, naehrmedien)]);

  return [...normalwertQuestions, ...naehrmediumQuestions]
    .filter((question): question is QuizQuestion => Boolean(question))
    .sort((left, right) => left.id.localeCompare(right.id, 'de'))
    .slice(0, limit);
}

export function isCorrectAnswer(question: QuizQuestion, selected: string | null) {
  return Boolean(selected) && selected === question.answer;
}

export function scoreQuiz(questions: QuizQuestion[], answers: Record<string, string | null>) {
  return questions.reduce((score, question) => score + (isCorrectAnswer(question, answers[question.id]) ? 1 : 0), 0);
}