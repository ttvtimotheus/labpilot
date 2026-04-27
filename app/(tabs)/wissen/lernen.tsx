import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { selectLearningSession, summariseLearningProgress } from '@/src/features/wissen/learning';
import { useLearningStore } from '@/src/features/wissen/learning.store';
import { buildReferenceQuiz, isCorrectAnswer, scoreQuiz, type QuizQuestion } from '@/src/features/wissen/quiz';
import { radius, spacing, useAppTheme } from '@/src/lib/theme/tokens';

const questionLimit = 12;

export default function LernkartenScreen() {
  const theme = useAppTheme();
  const allQuestions = useMemo(() => buildReferenceQuiz(80), []);
  const progressByQuestion = useLearningStore((state) => state.progressByQuestion);
  const recordAnswer = useLearningStore((state) => state.recordAnswer);
  const resetLearningProgress = useLearningStore((state) => state.resetLearningProgress);
  const [sessionQuestionIds, setSessionQuestionIds] = useState(() => selectLearningSession(allQuestions, useLearningStore.getState().progressByQuestion, new Date(), questionLimit).map((question) => question.id));
  const questions = useMemo(
    () => sessionQuestionIds.map((questionId) => allQuestions.find((question) => question.id === questionId)).filter((question): question is QuizQuestion => Boolean(question)),
    [allQuestions, sessionQuestionIds],
  );
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const current = questions[index];
  const selected = current ? answers[current.id] ?? null : null;
  const answeredCount = questions.filter((question) => answers[question.id]).length;
  const score = scoreQuiz(questions, answers);
  const isFinished = questions.length > 0 && answeredCount === questions.length;
  const summary = useMemo(() => summariseLearningProgress(allQuestions, progressByQuestion, new Date()), [allQuestions, progressByQuestion]);

  function startSession() {
    setSessionQuestionIds(selectLearningSession(allQuestions, useLearningStore.getState().progressByQuestion, new Date(), questionLimit).map((question) => question.id));
    setAnswers({});
    setIndex(0);
  }

  function resetProgress() {
    resetLearningProgress();
    setSessionQuestionIds(selectLearningSession(allQuestions, {}, new Date(), questionLimit).map((question) => question.id));
    setAnswers({});
    setIndex(0);
  }

  function selectAnswer(answer: string) {
    if (!current || selected) return;
    recordAnswer(current, answer);
    setAnswers((state) => ({ ...state, [current.id]: answer }));
  }

  if (!allQuestions.length || !current) {
    return (
      <Screen>
        <EmptyState icon="quiz" title="Keine Lernkarten" description="Die lokalen Referenzen enthalten noch nicht genug Daten fuer ein Training." />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Lernkarten</AppText>
        <AppText variant="callout" muted>Kurze Wiederholung aus Normalwerten und Nährmedien.</AppText>
      </View>

      <Card bereich="learn" style={styles.statsCard}>
        <View style={styles.statsGrid}>
          <LearningStat value={summary.dueCount} label="fällig" />
          <LearningStat value={summary.newCount} label="neu" />
          <LearningStat value={summary.masteredCount} label="sicher" />
          <LearningStat value={summary.streakDays} label="Tage Serie" />
        </View>
      </Card>

      <Card bereich="learn" style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <AppText variant="bodyEmph">{index + 1} / {questions.length}</AppText>
          <AppText variant="bodyEmph" style={{ color: theme.success }}>{score} richtig</AppText>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: theme.backgroundSunk }]}>
          <View style={[styles.progressFill, { width: `${Math.max(8, ((index + 1) / questions.length) * 100)}%`, backgroundColor: theme.area.learn }]} />
        </View>
      </Card>

      <QuestionCard question={current} selected={selected} onSelect={selectAnswer} />

      <View style={styles.actions}>
        <Button label="Zurueck" icon="chevron-left" variant="secondary" disabled={index === 0} onPress={() => setIndex((value) => Math.max(0, value - 1))} />
        <Button
          label={index === questions.length - 1 ? 'Auswertung' : 'Weiter'}
          icon="chevron-right"
          disabled={!selected || index === questions.length - 1}
          onPress={() => setIndex((value) => Math.min(questions.length - 1, value + 1))}
        />
      </View>

      {isFinished ? (
        <Card style={{ borderColor: theme.success }}>
          <AppText variant="bodyEmph" style={{ color: theme.success }}>Training abgeschlossen</AppText>
          <AppText muted>{score} von {questions.length} richtig beantwortet.</AppText>
          <Button label="Neue Session" icon="refresh" variant="secondary" onPress={startSession} />
        </Card>
      ) : null}

      {summary.practisedCount > 0 ? (
        <Button label="Fortschritt zurücksetzen" icon="delete" variant="ghost" onPress={resetProgress} />
      ) : null}
    </Screen>
  );
}

function LearningStat({ value, label }: { value: number; label: string }) {
  const theme = useAppTheme();

  return (
    <View style={[styles.stat, { backgroundColor: theme.backgroundSunk, borderColor: theme.borderStrong }]}>
      <AppText variant="h3">{value}</AppText>
      <AppText variant="caption" muted>{label}</AppText>
    </View>
  );
}

function QuestionCard({ question, selected, onSelect }: { question: QuizQuestion; selected: string | null; onSelect: (answer: string) => void }) {
  return (
    <Card elevated style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <AppText variant="caption" muted>{question.sourceLabel}</AppText>
        <AppText variant="h2">{question.prompt}</AppText>
      </View>
      <View style={styles.options}>
        {question.options.map((option) => (
          <AnswerOption key={option} option={option} question={question} selected={selected} onPress={() => onSelect(option)} />
        ))}
      </View>
      {selected ? (
        <Card bereich={isCorrectAnswer(question, selected) ? 'mibi' : 'haema'} style={styles.feedbackCard}>
          <AppText variant="bodyEmph">{isCorrectAnswer(question, selected) ? 'Richtig' : `Richtig waere: ${question.answer}`}</AppText>
          <AppText muted>{question.explanation}</AppText>
        </Card>
      ) : null}
    </Card>
  );
}

function AnswerOption({ option, question, selected, onPress }: { option: string; question: QuizQuestion; selected: string | null; onPress: () => void }) {
  const theme = useAppTheme();
  const isSelected = selected === option;
  const isCorrect = selected ? option === question.answer : false;
  const borderColor = isSelected ? (isCorrect ? theme.success : theme.danger) : theme.borderStrong;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: Boolean(selected) }}
      accessibilityLabel={option}
      disabled={Boolean(selected)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.answerOption,
        {
          borderColor,
          backgroundColor: isSelected ? theme.backgroundSunk : theme.backgroundElev,
          opacity: pressed ? 0.78 : 1,
        },
      ]}>
      <AppText variant="bodyEmph">{option}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  statsCard: {
    gap: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stat: {
    minWidth: 88,
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  progressCard: {
    gap: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  progressTrack: {
    height: 8,
    overflow: 'hidden',
    borderRadius: radius.full,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  questionCard: {
    gap: spacing.lg,
  },
  questionHeader: {
    gap: spacing.xs,
  },
  options: {
    gap: spacing.sm,
  },
  answerOption: {
    minHeight: 52,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  feedbackCard: {
    borderRadius: radius.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});