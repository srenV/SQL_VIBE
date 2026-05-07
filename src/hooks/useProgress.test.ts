/**
 * Unit-Tests fuer den useProgress-Hook.
 *
 * Testet den Local-Storage-basierten Fortschrittsmechanismus:
 * - Initialisierung ohne gespeicherte Daten
 * - markExerciseCompleted: Uebung als geloest markieren
 * - recordAttempt: Versuchszaehler erhoehen
 * - unlockAchievement: Achievement freischalten
 * - resetProgress: Fortschritt zuruecksetzen
 * - getExerciseProgress: Fortschritt einer einzelnen Uebung
 * - getLessonProgress: Fortschritt einer ganzen Lektion
 * - Streak-Berechnung
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useProgress } from "./useProgress";

const STORAGE_KEY = "sql-trainer-progress";

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useProgress", () => {
  describe("Initialisierung", () => {
    it("liefert leeren Anfangsfortschritt wenn nichts gespeichert ist", () => {
      const { result } = renderHook(() => useProgress());
      const { progress } = result.current;
      expect(progress.exercises).toEqual({});
      expect(progress.totalPoints).toBe(0);
      expect(progress.streak).toBe(0);
      expect(progress.lastActiveDate).toBeNull();
      expect(progress.achievements).toEqual([]);
    });

    it("laedt Fortschritt aus dem Local Storage", () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          exercises: { ex1: { completed: true, bestAttempts: 2, pointsEarned: 10, completedAt: "2025-01-01" } },
          totalPoints: 10,
          streak: 3,
          lastActiveDate: "2025-01-01",
          achievements: ["first_exercise"],
        })
      );
      const { result } = renderHook(() => useProgress());
      expect(result.current.progress.totalPoints).toBe(10);
      expect(result.current.progress.exercises["ex1"].completed).toBe(true);
      expect(result.current.progress.achievements).toEqual(["first_exercise"]);
    });
  });

  describe("markExerciseCompleted", () => {
    it("markiert eine Uebung als geloest und aktualisiert Punkte", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.markExerciseCompleted("ex1", 3, 15);
      });
      expect(result.current.progress.exercises["ex1"].completed).toBe(true);
      expect(result.current.progress.exercises["ex1"].bestAttempts).toBe(3);
      expect(result.current.progress.exercises["ex1"].pointsEarned).toBe(15);
      expect(result.current.progress.totalPoints).toBe(15);
    });

    it("ueberschreibt keine bereits geloeste Uebung", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.markExerciseCompleted("ex1", 2, 10);
      });
      expect(result.current.progress.totalPoints).toBe(10);
      act(() => {
        result.current.markExerciseCompleted("ex1", 5, 20);
      });
      expect(result.current.progress.totalPoints).toBe(10);
      expect(result.current.progress.exercises["ex1"].bestAttempts).toBe(2);
    });

    it("speichert im Local Storage", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.markExerciseCompleted("ex1", 1, 5);
      });
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.exercises.ex1.completed).toBe(true);
      expect(stored.totalPoints).toBe(5);
    });

    it("setzt completedAt auf ein ISO-Datum", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.markExerciseCompleted("ex1", 1, 5);
      });
      const completedAt = result.current.progress.exercises["ex1"].completedAt;
      expect(completedAt).not.toBeNull();
      expect(typeof completedAt).toBe("string");
    });
  });

  describe("recordAttempt", () => {
    it("erhoeht den Versuchszaehler fuer eine neue Uebung", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.recordAttempt("ex1");
      });
      expect(result.current.progress.exercises["ex1"].bestAttempts).toBe(1);
      expect(result.current.progress.exercises["ex1"].completed).toBe(false);
    });

    it("erhoeht den Versuchszaehler fuer eine bestehende Uebung", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.recordAttempt("ex1");
        result.current.recordAttempt("ex1");
        result.current.recordAttempt("ex1");
      });
      expect(result.current.progress.exercises["ex1"].bestAttempts).toBe(3);
    });

    it("aktualisiert lastActiveDate", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.recordAttempt("ex1");
      });
      expect(result.current.progress.lastActiveDate).not.toBeNull();
    });
  });

  describe("unlockAchievement", () => {
    it("schaltet ein Achievement frei", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.unlockAchievement("first_exercise");
      });
      expect(result.current.progress.achievements).toContain("first_exercise");
    });

    it("verhindert doppelte Achievements", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.unlockAchievement("first_exercise");
        result.current.unlockAchievement("first_exercise");
      });
      expect(result.current.progress.achievements).toEqual(["first_exercise"]);
    });
  });

  describe("resetProgress", () => {
    it("setzt den gesamten Fortschritt zurueck", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.markExerciseCompleted("ex1", 2, 10);
        result.current.unlockAchievement("first_exercise");
      });
      expect(result.current.progress.totalPoints).toBe(10);
      act(() => {
        result.current.resetProgress();
      });
      expect(result.current.progress.exercises).toEqual({});
      expect(result.current.progress.totalPoints).toBe(0);
      expect(result.current.progress.achievements).toEqual([]);
      expect(result.current.progress.streak).toBe(0);
    });

    it("loescht den Local Storage", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.markExerciseCompleted("ex1", 1, 5);
      });
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
      act(() => {
        result.current.resetProgress();
      });
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.totalPoints).toBe(0);
      expect(stored.exercises).toEqual({});
    });
  });

  describe("getExerciseProgress", () => {
    it("liefert undefined fuer unbekannte Uebung", () => {
      const { result } = renderHook(() => useProgress());
      expect(result.current.getExerciseProgress("unknown")).toBeUndefined();
    });

    it("liefert den Fortschritt fuer eine geloeste Uebung", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.markExerciseCompleted("ex1", 3, 10);
      });
      const progress = result.current.getExerciseProgress("ex1");
      expect(progress?.completed).toBe(true);
      expect(progress?.bestAttempts).toBe(3);
      expect(progress?.pointsEarned).toBe(10);
    });
  });

  describe("getLessonProgress", () => {
    it("liefert korrekten Fortschritt fuer eine Lektion", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.markExerciseCompleted("ex1", 1, 10);
        result.current.markExerciseCompleted("ex2", 2, 15);
      });
      const lessonProgress = result.current.getLessonProgress(["ex1", "ex2", "ex3"]);
      expect(lessonProgress.completed).toBe(2);
      expect(lessonProgress.total).toBe(3);
    });

    it("liefert 0/0 fuer leere Liste", () => {
      const { result } = renderHook(() => useProgress());
      const lessonProgress = result.current.getLessonProgress([]);
      expect(lessonProgress.completed).toBe(0);
      expect(lessonProgress.total).toBe(0);
    });
  });

  describe("Streak-Berechnung", () => {
    it("startet Streak bei 1 nach erstemCompletion", () => {
      const { result } = renderHook(() => useProgress());
      act(() => {
        result.current.markExerciseCompleted("ex1", 1, 5);
      });
      expect(result.current.progress.streak).toBe(1);
    });
  });
});