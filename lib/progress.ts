export type WordStatus = 'known' | 'learning';

export interface LessonProgress {
  score: number;
  total: number;
  completedAt: string;
  attempts: number;
}

export interface WritingProgress {
  readAt?: string;
  practicedAt?: string;
}

export interface ProgressState {
  version: 1;
  lessons: Record<string, LessonProgress>;
  words: Record<string, WordStatus>;
  writing: Record<string, WritingProgress>;
  streak: { last: string; days: number };
  updatedAt: string;
}

export const STORAGE_KEY = 'ielts-hub-progress-v1';

export const EMPTY_PROGRESS: ProgressState = {
  version: 1,
  lessons: {},
  words: {},
  writing: {},
  streak: { last: '', days: 0 },
  updatedAt: '',
};

const todayKey = () => new Date().toISOString().slice(0, 10);

export const wordKey = (setSlug: string, word: string) => `${setSlug}:${word}`;

/** Days between two ISO dates (yesterday → 1, same day → 0). */
function dayDiff(a: string, b: string): number {
  const ms = new Date(`${b}T00:00:00Z`).getTime() - new Date(`${a}T00:00:00Z`).getTime();
  return Math.round(ms / 86_400_000);
}

export function touchStreak(state: ProgressState): ProgressState {
  const today = todayKey();
  if (state.streak.last === today) return state;
  const gap = state.streak.last ? dayDiff(state.streak.last, today) : 0;
  const days = gap === 1 ? state.streak.days + 1 : 1;
  return { ...state, streak: { last: today, days } };
}

export function readProgress(): ProgressState {
  if (typeof window === 'undefined') return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as ProgressState;
    if (!parsed || parsed.version !== 1) return EMPTY_PROGRESS;
    return {
      ...EMPTY_PROGRESS,
      ...parsed,
      lessons: parsed.lessons ?? {},
      words: parsed.words ?? {},
      writing: parsed.writing ?? {},
      streak: parsed.streak ?? { last: '', days: 0 },
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function writeProgress(state: ProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('ielts-progress', { detail: state }));
  } catch {
    /* storage full or blocked — progress simply is not persisted */
  }
}

export interface ProgressSummary {
  lessonsDone: number;
  lessonsTotal: number;
  wordsKnown: number;
  wordsLearning: number;
  wordsTotal: number;
  writingRead: number;
  writingTotal: number;
  streak: number;
  averageScore: number | null;
  percent: number;
}

export function summarise(
  state: ProgressState,
  totals: { lessons: number; words: number; writing: number },
): ProgressSummary {
  const lessonsDone = Object.keys(state.lessons).length;
  const known = Object.values(state.words).filter((s) => s === 'known').length;
  const learning = Object.values(state.words).filter((s) => s === 'learning').length;
  const writingRead = Object.values(state.writing).filter((w) => w.readAt).length;
  const scores = Object.values(state.lessons);
  const averageScore =
    scores.length === 0
      ? null
      : Math.round(
          (scores.reduce((n, l) => n + (l.total ? l.score / l.total : 0), 0) / scores.length) * 100,
        );

  const weight = [
    totals.lessons ? lessonsDone / totals.lessons : 0,
    totals.words ? known / totals.words : 0,
    totals.writing ? writingRead / totals.writing : 0,
  ];
  const percent = Math.round(((weight[0] + weight[1] + weight[2]) / 3) * 100);

  return {
    lessonsDone,
    lessonsTotal: totals.lessons,
    wordsKnown: known,
    wordsLearning: learning,
    wordsTotal: totals.words,
    writingRead,
    writingTotal: totals.writing,
    streak: state.streak.days,
    averageScore,
    percent: Number.isFinite(percent) ? percent : 0,
  };
}
