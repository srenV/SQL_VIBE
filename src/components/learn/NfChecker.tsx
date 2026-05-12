"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { SuccessCelebration } from "@/components/successCelebration";

/**
 * NfChecker – Interaktiver Normalform-Checker.
 *
 * Zeigt eine Tabelle und fragt: "Welche Normalform ist verletzt?"
 * Multiple-Choice-Antwort mit Erklaerung nach der Auswahl.
 *
 * English: Interactive normal form checker widget.
 * Shows a table and asks which normal form is violated.
 * Multiple-choice answer with explanation after selection.
 */

export interface NfCheckerQuestion {
  /** Tabellenname. */
  tableName: string;
  /** Spalten der Tabelle. */
  columns: NfCheckerColumn[];
  /** Zeilen der Tabelle (Beispieldaten). */
  rows: Record<string, string>[];
  /** Die korrekte Antwort. */
  correctAnswer: "1NF" | "2NF" | "3NF" | "BCNF" | "keine";
  /** Erklaerung, warum diese Antwort korrekt ist. */
  explanation: string;
}

export interface NfCheckerColumn {
  name: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

export interface NfCheckerData {
  question: NfCheckerQuestion;
}

export interface NfCheckerProps {
  data: NfCheckerData;
  className?: string;
}

const NF_OPTIONS = [
  { value: "1NF" as const, labelKey: "nf1Violated", descriptionKey: "nf1Desc" },
  { value: "2NF" as const, labelKey: "nf2Violated", descriptionKey: "nf2Desc" },
  { value: "3NF" as const, labelKey: "nf3Violated", descriptionKey: "nf3Desc" },
  { value: "BCNF" as const, labelKey: "bcnfViolated", descriptionKey: "bcnfDesc" },
  { value: "keine" as const, labelKey: "noNfViolated", descriptionKey: "noNfDesc" },
];

export function NfChecker({ data, className }: NfCheckerProps) {
  const { question } = data;
  const t = useTranslations("learn");
  const [selectedAnswer, setSelectedAnswer] = useState<"1NF" | "2NF" | "3NF" | "BCNF" | "keine" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleSubmit = () => {
    if (selectedAnswer) setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setSubmitted(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Question header */}
      <div className="flex items-start gap-2">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 text-xs font-bold">
          ?
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">
            {t("nfQuestion")}
          </p>
          <p className="text-xs text-ink-muted mt-0.5">
            {t("nfQuestionHint")}
          </p>
        </div>
      </div>

      {/* Table display */}
      <div className="overflow-x-auto rounded-lg border border-surface-dim dark:border-dark-dim">
        <p className="px-3 py-2 text-xs font-semibold text-ink bg-surface-dim/50 dark:bg-dark-dim/50 border-b border-surface-dim dark:border-dark-dim flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.171a48.584 48.584 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .12.154.29.74.598a4.483 4.483 0 012.14 2.613c.462 1.527.09 3.2-.932 4.39a5.418 5.418 0 01-4.19 1.856 5.418 5.418 0 01-4.19-1.856c-1.022-1.19-1.394-2.863-.932-4.39a4.483 4.483 0 012.14-2.613c.586-.308.74-.478.74-.598 0-.231-.035-.454-.1-.664m-.801 0H5.25A2.25 2.25 0 003 6.108v8.642A2.25 2.25 0 005.25 17.25h1.372" />
          </svg>
          {question.tableName}
        </p>
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-surface-dim dark:border-dark-dim">
              {question.columns.map((col) => (
                <th
                  key={col.name}
                  className={cn(
                    "px-3 py-2 text-left font-semibold whitespace-nowrap",
                    col.isPrimaryKey
                      ? "text-primary-600 dark:text-primary-400"
                      : col.isForeignKey
                        ? "text-accent-600 dark:text-accent-400"
                        : "text-ink-muted"
                  )}
                >
                  {col.isPrimaryKey && <span className="inline-flex items-center gap-0.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg> </span>}
                  {col.isForeignKey && <span className="inline-flex items-center gap-0.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.342" /></svg> </span>}
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.rows.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-surface-dim/60 dark:border-dark-dim/60 hover:bg-surface-dim/30 dark:hover:bg-dark-dim/30"
              >
                {question.columns.map((col) => (
                  <td key={col.name} className="px-3 py-1.5 text-ink whitespace-nowrap">
                    {row[col.name] ?? (
                      <span className="text-ink-muted italic">NULL</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Answer options */}
      <div className="space-y-2">
        {NF_OPTIONS.map((option) => {
          const isSelected = selectedAnswer === option.value;
          const showResult = submitted;

          let optionClass = "border-surface-dim dark:border-dark-dim bg-surface dark:bg-dark-dim hover:border-primary-300 dark:hover:border-primary-600";
          if (showResult && option.value === question.correctAnswer) {
            optionClass = "border-success bg-success/5 dark:bg-success/10";
          } else if (showResult && isSelected && option.value !== question.correctAnswer) {
            optionClass = "border-error bg-error/5 dark:bg-error/10";
          } else if (isSelected) {
            optionClass = "border-primary-500 bg-primary-50 dark:bg-primary-900/20";
          }

          return (
            <button
              key={option.value}
              onClick={() => {
                if (!submitted) setSelectedAnswer(option.value);
              }}
              disabled={submitted}
              className={cn(
                "w-full text-left rounded-lg border-2 p-3 transition-all duration-150",
                optionClass,
                submitted && "cursor-default"
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn(
                  "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                  isSelected
                    ? "border-primary-500 bg-primary-500 text-white"
                    : "border-surface-dim dark:border-dark-dim text-ink-muted"
                )}>
                  {isSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{t(option.labelKey)}</p>
                  <p className="text-xs text-ink-muted">{t(option.descriptionKey)}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Submit / Reset buttons */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            selectedAnswer
              ? "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
              : "bg-surface-dim text-ink-muted cursor-not-allowed dark:bg-dark-dim"
          )}
        >
          {t("checkAnswer")}
        </button>
      ) : (
        <div className="space-y-3">
          {isCorrect && <SuccessCelebration message={t("correctExclamation")} submessage={question.explanation} />}
          {!isCorrect && (
            <div className="p-3 rounded-lg bg-error/10 border border-error/30">
              <p className="text-sm font-semibold text-error">{t("notQuiteRight")}</p>
              <p className="text-xs text-ink mt-1">{question.explanation}</p>
            </div>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-surface-dim dark:bg-dark-dim text-ink hover:bg-surface-dim/80 dark:hover:bg-dark-dim/80 transition-colors"
          >
            {t("tryAgain")}
          </button>
        </div>
      )}
    </div>
  );
}