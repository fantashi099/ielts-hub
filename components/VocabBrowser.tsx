'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/components/ProgressProvider';
import type { VocabSetIndexItem } from '@/lib/content';
import { TOPIC_LABEL } from '@/lib/labels';

export function VocabBrowser({ sets }: { sets: VocabSetIndexItem[] }) {
  const { state, ready } = useProgress();
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('all');

  const topics = useMemo(() => {
    const map = new Map<string, number>();
    for (const set of sets) map.set(set.topic, (map.get(set.topic) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => (TOPIC_LABEL[a[0]] ?? a[0]).localeCompare(TOPIC_LABEL[b[0]] ?? b[0], 'vi'));
  }, [sets]);

  const knownIn = (setSlug: string) => {
    const prefix = `${setSlug}:`;
    let known = 0;
    for (const [key, value] of Object.entries(state.words)) {
      if (value === 'known' && key.startsWith(prefix)) known += 1;
    }
    return known;
  };

  const filtered = sets.filter((set) => {
    if (topic !== 'all' && set.topic !== topic) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      set.title.toLowerCase().includes(q) ||
      set.titleVi.toLowerCase().includes(q) ||
      (TOPIC_LABEL[set.topic] ?? '').toLowerCase().includes(q)
    );
  });

  const totalWords = sets.reduce((n, s) => n + s.wordCount, 0);
  const knownTotal = ready ? sets.reduce((n, s) => n + knownIn(s.slug), 0) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bộ từ: environment, education, technology…"
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-white/15 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-ink-500 dark:focus:ring-brand-500/20"
          />
        </div>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-800 focus:border-brand-400 focus:outline-none dark:border-white/15 dark:bg-ink-900 dark:text-ink-100"
        >
          <option value="all">Mọi chủ đề</option>
          {topics.map(([slug]) => (
            <option key={slug} value={slug}>
              {TOPIC_LABEL[slug] ?? slug}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-ink-600 dark:text-ink-300">
        {ready ? (
          <>
            Đã thuộc <strong className="font-semibold text-emerald-600 dark:text-emerald-400">{knownTotal}</strong> /{' '}
            {totalWords} từ
          </>
        ) : (
          <>Tổng {totalWords} từ vựng theo chủ đề</>
        )}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((set) => {
          const known = ready ? knownIn(set.slug) : 0;
          const percent = set.wordCount ? Math.round((known / set.wordCount) * 100) : 0;
          return (
            <Link
              key={set.slug}
              href={set.ready ? `/vocabulary/${set.slug}` : '/vocabulary'}
              aria-disabled={!set.ready}
              className={`card-link group flex flex-col p-5 ${set.ready ? '' : 'opacity-70'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                  {TOPIC_LABEL[set.topic] ?? set.topic}
                </span>
                <span className="text-[11px] font-semibold text-ink-500 dark:text-ink-400">
                  {set.ready ? `${set.wordCount} từ` : 'Đang soạn'}
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink-900 group-hover:text-brand-800 dark:text-white dark:group-hover:text-brand-300">
                {set.titleVi}
              </h3>
              <p className="mt-1 text-[13px] text-ink-500 dark:text-ink-400">{set.title}</p>

              <div className="mt-auto pt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-ink-500 dark:text-ink-400">
                  {known > 0 ? `Đã thuộc ${known}/${set.wordCount}` : 'Chưa học từ nào'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink-500 dark:text-ink-400">
          Không tìm thấy bộ từ phù hợp.
        </p>
      ) : null}
    </div>
  );
}
