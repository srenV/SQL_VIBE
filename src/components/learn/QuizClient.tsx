/**
 * QuizClient – Interaktive Multiple-Choice-Quiz-Komponente fuer den Testen-Tab.
 *
 * Zeigt Fragen mit Antwortoptionen an, wertet die Auswahl aus und
 * verfolgt den Fortschritt. Nach dem Beantworten wird die Erklaerung angezeigt.
 *
 * English: Interactive multiple-choice quiz component for the Test tab.
 * Shows questions with answer options, evaluates selections, and tracks progress.
 * Explanations are shown after answering.
 */
"use client";

import React from "react";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { FadeIn } from "@/components/animations";
import type { QuizQuestion } from "@/types/sandbox";

interface QuizClientProps {
  questions: QuizQuestion[];
  moduleTitle: string;
  onComplete?: (score: number, total: number) => void;
}

type AnswerState = {
  selectedId: string | null;
  submitted: boolean;
  isCorrect: boolean;
};

export const QuizClient: React.FC<QuizClientProps> = ({ questions, moduleTitle, onComplete }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<AnswerState[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);

  const question = questions[currentIndex];
  const totalQuestions = questions.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const progress = ((currentIndex + (submitted ? 1 : 0)) / totalQuestions) * 100;

  const handleSubmit = () => {
    if (!selectedId) return;
    const correctOption = question.options.find((o) => o.isCorrect);
    const isCorrect = selectedId === correctOption?.id;
    setSubmitted(true);
    setAnswers((prev) => [
      ...prev,
      { selectedId, submitted: true, isCorrect },
    ]);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedId(null);
      setSubmitted(false);
    } else {
      setShowResults(true);
      onComplete?.(correctCount + (submitted ? 0 : 0), totalQuestions);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedId(null);
    setSubmitted(false);
    setShowResults(false);
  };

  // Results screen
  if (showResults) {
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const getIcon = () => {
      if (percentage >= 90) return (
        <svg className="w-16 h-16 text-amber-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
        </svg>
      );
      if (percentage >= 70) return (
        <svg className="w-16 h-16 text-success mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        </svg>
      );
      if (percentage >= 50) return (
        <svg className="w-16 h-16 text-primary-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      );
      return (
        <svg className="w-16 h-16 text-warning mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 1 9 9.6a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 1 3 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.228 5.228 0 0 0-1.696-3.396 3.75 3.75 0 0 0-1.14 4.593A3.75 3.75 0 0 0 12 18z" />
        </svg>
      );
    };
    const getMessage = () => {
      if (percentage >= 90) return "Hervorragend! Du beherrschst dieses Thema!";
      if (percentage >= 70) return "Gut gemacht! Noch ein bisschen Übung und du bist perfekt.";
      if (percentage >= 50) return "Solide Grundlage! Wiederhole die Themen, bei denen du unsicher warst.";
      return "Weiter üben! Jeder Versuch bringt dich weiter.";
    };

    return (
      <FadeIn>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div>{getIcon()}</div>
          <h2 className="text-2xl font-bold text-ink">Quiz abgeschlossen!</h2>
          <p className="text-lg text-ink-muted">{getMessage()}</p>

          <div className="bg-surface-dim dark:bg-dark-dim rounded-xl p-6 space-y-3">
            <div className="text-4xl font-bold text-accent">
              {correctCount} / {totalQuestions}
            </div>
            <div className="text-sm text-ink-muted">{percentage}% richtig</div>

            {/* Progress bar */}
            <div className="w-full bg-surface-dim dark:bg-dark-dim rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-accent"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Question review */}
          <div className="space-y-3 text-left">
            {questions.map((q, idx) => {
              const answer = answers[idx];
              const isCorrect = answer?.isCorrect;
              return (
                <div
                  key={q.id}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm ${
                    isCorrect
                      ? "bg-success/10 text-success"
                      : "bg-error/10 text-error"
                  }`}
                >
                  <span className="text-lg">{isCorrect ? "✓" : "✗"}</span>
                  <span className="flex-1 truncate">{q.question}</span>
                </div>
              );
            })}
          </div>

          <Button variant="primary" onClick={handleRestart} className="mt-6">
            Nochmal versuchen
          </Button>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-ink-muted">
          <span>{moduleTitle}</span>
          <span>
            Frage {currentIndex + 1} von {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-surface-dim dark:bg-dark-dim rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 bg-accent"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <FadeIn key={question.id}>
        <Card variant="default" className="p-6 space-y-6">
          {/* Difficulty badge */}
          {question.difficulty && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  question.difficulty === "easy"
                    ? "bg-success/10 text-success"
                    : question.difficulty === "medium"
                    ? "bg-warning/10 text-warning"
                    : "bg-error/10 text-error"
                }`}
              >
                {question.difficulty === "easy"
                  ? "Leicht"
                  : question.difficulty === "medium"
                  ? "Mittel"
                  : "Schwer"}
              </span>
            </div>
          )}

          {/* Question text */}
          <h3 className="text-lg font-semibold text-ink leading-relaxed">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = selectedId === option.id;
              const isSubmittedOption = submitted && option.id === selectedId;
              const isCorrectOption = submitted && option.isCorrect;

              let optionClasses =
                "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer";

              if (submitted) {
                if (isCorrectOption) {
                  optionClasses +=
                    " border-success bg-success/10 text-success";
                } else if (isSubmittedOption && !option.isCorrect) {
                  optionClasses +=
                    " border-error bg-error/10 text-error";
                } else {
                  optionClasses +=
                    " border-surface-dim dark:border-dark-dim text-ink-muted opacity-50";
                }
              } else if (isSelected) {
                optionClasses +=
                  " border-accent bg-accent/10 text-ink";
              } else {
                optionClasses +=
                  " border-surface-dim dark:border-dark-dim text-ink hover:border-accent/50 hover:bg-accent/5";
              }

              return (
                <button
                  key={option.id}
                  className={optionClasses}
                  onClick={() => !submitted && setSelectedId(option.id)}
                  disabled={submitted}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                        submitted && option.isCorrect
                          ? "border-success bg-success text-white"
                          : submitted && isSubmittedOption && !option.isCorrect
                          ? "border-error bg-error text-white"
                          : isSelected
                          ? "border-accent bg-accent text-white"
                          : "border-surface-dim dark:border-dark-dim text-ink-muted"
                      }`}
                    >
                      {option.id.toUpperCase()}
                    </span>
                    <span className="flex-1">{option.text}</span>
                    {submitted && option.isCorrect && (
                      <span className="text-success text-lg">✓</span>
                    )}
                    {submitted && isSubmittedOption && !option.isCorrect && (
                      <span className="text-error text-lg">✗</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation (shown after submit) */}
          {submitted && (
            <FadeIn>
              <div
                className={`p-4 rounded-lg border-l-4 ${
                  answers[currentIndex]?.isCorrect
                    ? "border-success bg-success/5"
                    : "border-error bg-error/5"
                }`}
              >
                <p className="text-sm font-semibold text-ink mb-1">
                  {answers[currentIndex]?.isCorrect
                    ? "✓ Richtig!"
                    : "✗ Nicht richtig"}
                </p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </FadeIn>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            {!submitted ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!selectedId}
              >
                Antwort prüfen
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNext}>
                {currentIndex < totalQuestions - 1
                  ? "Nächste Frage"
                  : "Ergebnis anzeigen"}
              </Button>
            )}
          </div>
        </Card>
      </FadeIn>
    </div>
  );
};