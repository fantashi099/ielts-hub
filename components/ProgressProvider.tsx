'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  EMPTY_PROGRESS,
  readProgress,
  summarise,
  touchStreak,
  wordKey,
  writeProgress,
  type ProgressState,
  type ProgressSummary,
  type WordStatus,
} from '@/lib/progress';

export interface ProgressTotals {
  lessons: number;
  words: number;
  writing: number;
}

interface ProgressContextValue {
  state: ProgressState;
  summary: ProgressSummary;
  ready: boolean;
  recordLesson: (slug: string, score: number, total: number) => void;
  setWord: (setSlug: string, word: string, status: WordStatus | null) => void;
  markWriting: (key: string, kind: 'read' | 'practiced') => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({
  totals,
  children,
}: {
  totals: ProgressTotals;
  children: ReactNode;
}) {
  const [state, setState] = useState<ProgressState>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Reading progress must not count as study activity: the streak only moves
    // when the learner actually answers, marks a word or opens a writing note.
    setState(readProgress());
    setReady(true);

    const sync = () => setState(readProgress());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const commit = useCallback((updater: (prev: ProgressState) => ProgressState) => {
    setState((prev) => {
      const next = touchStreak(updater(prev));
      const stamped = { ...next, updatedAt: new Date().toISOString() };
      writeProgress(stamped);
      return stamped;
    });
  }, []);

  const recordLesson = useCallback(
    (slug: string, score: number, total: number) => {
      commit((prev) => {
        const existing = prev.lessons[slug];
        return {
          ...prev,
          lessons: {
            ...prev.lessons,
            [slug]: {
              score: Math.max(score, existing?.score ?? 0),
              total,
              completedAt: new Date().toISOString(),
              attempts: (existing?.attempts ?? 0) + 1,
            },
          },
        };
      });
    },
    [commit],
  );

  const setWord = useCallback(
    (setSlug: string, word: string, status: WordStatus | null) => {
      commit((prev) => {
        const words = { ...prev.words };
        const key = wordKey(setSlug, word);
        if (status === null) delete words[key];
        else words[key] = status;
        return { ...prev, words };
      });
    },
    [commit],
  );

  const markWriting = useCallback(
    (key: string, kind: 'read' | 'practiced') => {
      commit((prev) => ({
        ...prev,
        writing: {
          ...prev.writing,
          [key]: {
            ...prev.writing[key],
            ...(kind === 'read'
              ? { readAt: new Date().toISOString() }
              : { practicedAt: new Date().toISOString() }),
          },
        },
      }));
    },
    [commit],
  );

  const reset = useCallback(() => {
    commit(() => ({ ...EMPTY_PROGRESS }));
  }, [commit]);

  const summary = useMemo(() => summarise(state, totals), [state, totals]);

  const value = useMemo<ProgressContextValue>(
    () => ({ state, summary, ready, recordLesson, setWord, markWriting, reset }),
    [state, summary, ready, recordLesson, setWord, markWriting, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
