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
    const getEmoji = () => {
      if (percentage >= 90) return "🏆";
      if (percentage >= 70) return "🎉";
      if (percentage >= 50) return "📚";
      return "💪";
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
          <div className="text-6xl">{getEmoji()}</div>
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
                      className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
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