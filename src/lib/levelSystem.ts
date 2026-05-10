export interface LevelDef {
  level: number;
  xpRequired: number;
  title: string;
}

export const LEVELS: LevelDef[] = [
  { level: 1, xpRequired: 0, title: "Rookie" },
  { level: 2, xpRequired: 100, title: "Lehrling" },
  { level: 3, xpRequired: 280, title: "Analyst" },
  { level: 4, xpRequired: 550, title: "Entwickler" },
  { level: 5, xpRequired: 950, title: "Spezialist" },
  { level: 6, xpRequired: 1500, title: "Architekt" },
  { level: 7, xpRequired: 2300, title: "Senior" },
  { level: 8, xpRequired: 3400, title: "Expert" },
  { level: 9, xpRequired: 4800, title: "Elite" },
  { level: 10, xpRequired: 6000, title: "Meister" },
];

export interface LevelInfo {
  level: number;
  title: string;
  xp: number;
  xpRequired: number;
  xpNext: number | null;
  progress: number;
}

export function getLevel(xp: number): LevelInfo {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.xpRequired) current = l;
    else break;
  }
  const idx = LEVELS.findIndex((l) => l.level === current.level);
  const next = LEVELS[idx + 1] ?? null;
  const xpInLevel = xp - current.xpRequired;
  const xpNeeded = next ? next.xpRequired - current.xpRequired : 1;
  return {
    level: current.level,
    title: current.title,
    xp,
    xpRequired: current.xpRequired,
    xpNext: next?.xpRequired ?? null,
    progress: next ? Math.min(1, xpInLevel / xpNeeded) : 1,
  };
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_solve",     name: "Erste Lösung",        description: "Erste Aufgabe erfolgreich gelöst",          icon: "🎯" },
  { id: "streak_3",        name: "Auf Kurs",             description: "3 Tage in Folge gelernt",                   icon: "🔥" },
  { id: "streak_7",        name: "Wochensträhne",        description: "7 Tage am Stück aktiv gewesen",             icon: "⚡" },
  { id: "streak_30",       name: "Unaufhaltbar",         description: "30 Tage ohne Unterbrechung",                icon: "💪" },
  { id: "exercises_10",    name: "Fleißig",              description: "10 Aufgaben gelöst",                        icon: "📚" },
  { id: "exercises_50",    name: "Erfahren",             description: "50 Aufgaben gelöst",                        icon: "🎓" },
  { id: "exercises_100",   name: "Hundert Prozent",      description: "100 Aufgaben gelöst",                       icon: "💯" },
  { id: "exercises_250",   name: "Maschinenraum",        description: "250 Aufgaben gelöst",                       icon: "🤖" },
  { id: "story_first",     name: "Ermittler",            description: "Ersten Story-Fall abgeschlossen",           icon: "🕵️" },
  { id: "story_all",       name: "Meisterermittler",     description: "Alle Story-Fälle gelöst",                   icon: "👑" },
  { id: "lesson_complete", name: "Lektionsmeister",      description: "Eine Lektion zu 100 % abgeschlossen",       icon: "✅" },
  { id: "debug_10",        name: "Debugger",             description: "10 Debug-Aufgaben gefixed",                 icon: "🐛" },
  { id: "interview_10",    name: "Gesprächsbereit",      description: "10 Interview-Aufgaben gelöst",              icon: "💼" },
  { id: "level_5",         name: "Aufsteiger",           description: "Level 5 erreicht",                          icon: "⭐" },
  { id: "level_10",        name: "Meister der Abfragen", description: "Level 10 erreicht – du bist ein SQL-Profi", icon: "🏆" },
  { id: "all_lessons",     name: "Vollständig",          description: "Alle Lektionen zu 100 % abgeschlossen",     icon: "🌟" },
];

interface ExerciseRecord {
  completed: boolean;
  exerciseType?: string;
  difficulty?: string;
}

interface ProgressSnapshot {
  exercises: Record<string, ExerciseRecord>;
  totalPoints: number;
  streak: number;
  achievements: string[];
}

export interface AchievementTotals {
  storyCount: number;
  lessonExerciseIds: Record<string, string[]>;
}

export function checkAchievements(
  prev: ProgressSnapshot,
  next: ProgressSnapshot,
  totals: AchievementTotals
): string[] {
  const newOnes: string[] = [];
  const already = new Set([...prev.achievements, ...next.achievements]);

  const push = (id: string, condition: boolean) => {
    if (condition && !already.has(id)) {
      newOnes.push(id);
      already.add(id);
    }
  };

  const completed = Object.entries(next.exercises).filter(([, e]) => e.completed);
  const total = completed.length;
  const debugSolved = completed.filter(([, e]) => e.exerciseType === "debug").length;
  const interviewSolved = completed.filter(([, e]) => e.difficulty === "interview").length;
  const storySolved = completed.filter(([, e]) => e.exerciseType === "story").length;

  const levelInfo = getLevel(next.totalPoints);
  const solvedSet = new Set(completed.map(([id]) => id));

  const anyLessonComplete = Object.values(totals.lessonExerciseIds).some(
    (ids) => ids.length > 0 && ids.every((id) => solvedSet.has(id))
  );
  const allLessonsComplete = Object.keys(totals.lessonExerciseIds).length > 0 &&
    Object.values(totals.lessonExerciseIds).every(
      (ids) => ids.length > 0 && ids.every((id) => solvedSet.has(id))
    );

  push("first_solve",     total >= 1);
  push("streak_3",        next.streak >= 3);
  push("streak_7",        next.streak >= 7);
  push("streak_30",       next.streak >= 30);
  push("exercises_10",    total >= 10);
  push("exercises_50",    total >= 50);
  push("exercises_100",   total >= 100);
  push("exercises_250",   total >= 250);
  push("story_first",     storySolved >= 1);
  push("story_all",       totals.storyCount > 0 && storySolved >= totals.storyCount);
  push("lesson_complete", anyLessonComplete);
  push("debug_10",        debugSolved >= 10);
  push("interview_10",    interviewSolved >= 10);
  push("level_5",         levelInfo.level >= 5);
  push("level_10",        levelInfo.level >= 10);
  push("all_lessons",     allLessonsComplete);

  return newOnes;
}
