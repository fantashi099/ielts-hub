'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useProgress } from '@/components/ProgressProvider';
import { LevelBadge } from '@/components/RichText';
import type { LessonIndexItem } from '@/lib/content';
import { TOPIC_LABEL } from '@/lib/labels';

const LEVELS = ['all', 'B1', 'B2', 'C1'] as const;

export function GrammarBrowser({ lessons }: { lessons: LessonIndexItem[] }) {
  const { state, ready } = useProgress();
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('all');
  const [topic, setTopic] = useState('all');
  const [query, setQuery] = useState('');

  const topics = useMemo(() => {
    const seen: string[] = [];
    for (const lesson of lessons) if (!seen.includes(lesson.topic)) seen.push(lesson.topic);
    return seen;
  }, [lessons]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lessons.filter((lesson) => {
      if (level !== 'all' && lesson.level !== level) return false;
      if (topic !== 'all' && lesson.topic !== topic) return false;
      if (!q) return true;
      return (
        lesson.title.toLowerCase().includes(q) ||
        lesson.titleVi.toLowerCase().includes(q) ||
        TOPIC_LABEL[lesson.topic]?.toLowerCase().includes(q)
      );
    });
  }, [lessons, level, topic, query]);

  const done = ready ? Object.keys(state.lessons).length : 0;

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-ink-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            Trình độ
          </span>
          {LEVELS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLevel(item)}
              className={`chip ${level === item ? 'chip-active' : ''}`}
            >
              {item === 'all' ? 'Tất cả' : item}
            </button>
          ))}
          <span className="ml-auto rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-600 dark:bg-white/10 dark:text-ink-200">
            Đã học {done}/{lessons.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="relative flex-1 sm:max-w-xs">
            <span className="sr-only">Tìm bài học</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo tên bài hoặc chủ đề…"
              className="w-full rounded-full border border-ink-200 bg-white px-4 py-2 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none dark:border-white/15 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-ink-400"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="sr-only">Chủ đề</span>
            <select
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="rounded-full border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 focus:border-brand-400 focus:outline-none dark:border-white/15 dark:bg-white/[0.05] dark:text-ink-100"
            >
              <option value="all">Mọi chủ đề</option>
              {topics.map((item) => (
                <option key={item} value={item}>
                  {TOPIC_LABEL[item] ?? item}
                </option>
              ))}
            </select>
          </label>
          <span className="text-xs text-ink-500 dark:text-ink-400">{filtered.length} bài</span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((lesson) => {
          const entry = state.lessons[lesson.slug];
          const body = (
            <>
              <div className="flex items-center gap-2">
                <LevelBadge level={lesson.level} />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                  {TOPIC_LABEL[lesson.topic] ?? lesson.topic}
                </span>
                {entry ? (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <CheckIcon /> {entry.score}/{entry.total}
                  </span>
                ) : lesson.ready ? null : (
                  <span className="ml-auto badge bg-ink-100 text-ink-500 dark:bg-white/10 dark:text-ink-400">
                    Đang soạn
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-display text-base font-semibold leading-snug text-ink-900 dark:text-white">
                {lesson.titleVi}
              </h3>
              <p className="mt-1 text-[13px] text-ink-500 dark:text-ink-400">{lesson.title}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-500 dark:text-ink-400">
                <span>Unit {lesson.bookUnits.join(', ')}</span>
                <span className="h-1 w-1 rounded-full bg-ink-300 dark:bg-white/25" />
                <span>Band {lesson.bandFocus}</span>
              </div>
            </>
          );

          return lesson.ready ? (
            <Link
              key={lesson.slug}
              href={`/grammar/${lesson.slug}`}
              className="card card-link flex flex-col p-5"
            >
              {body}
            </Link>
          ) : (
            <div key={lesson.slug} className="card flex flex-col p-5 opacity-60">
              {body}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink-500 dark:text-ink-400">
          Không tìm thấy bài nào khớp bộ lọc. Thử xoá từ khoá hoặc chọn “Tất cả”.
        </p>
      ) : null}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}
