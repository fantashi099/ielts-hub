'use client';

import { useMemo, useState } from 'react';
import { RichText } from '@/components/RichText';
import { useProgress } from '@/components/ProgressProvider';
import type { WritingPrompt } from '@/lib/types';

const TYPE_LABEL: Record<WritingPrompt['type'], string> = {
  opinion: 'Opinion',
  discussion: 'Discussion',
  'advantage-disadvantage': 'Advantage / Disadvantage',
  'problem-solution': 'Problem / Solution',
  'two-part': 'Two-part question',
  'positive-negative': 'Positive / Negative',
  'line-graph': 'Line graph',
  'bar-chart': 'Bar chart',
  'pie-chart': 'Pie chart',
  table: 'Table',
  process: 'Process',
  map: 'Map',
};

export function PromptLibrary({ prompts }: { prompts: WritingPrompt[] }) {
  const { state, markWriting } = useProgress();
  const [task, setTask] = useState<'all' | '1' | '2'>('all');
  const [type, setType] = useState<string>('all');
  const [query, setQuery] = useState('');

  const types = useMemo(() => {
    const pool = prompts.filter((p) => task === 'all' || p.task === task);
    return [...new Set(pool.map((p) => p.type))].sort();
  }, [prompts, task]);

  const filtered = prompts.filter((prompt) => {
    if (task !== 'all' && prompt.task !== task) return false;
    if (type !== 'all' && prompt.type !== type) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return prompt.prompt.toLowerCase().includes(q) || TYPE_LABEL[prompt.type].toLowerCase().includes(q);
  });

  const practicedCount = prompts.filter((p) => state.writing[`prompt:${p.id}`]?.practicedAt).length;

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center gap-3 p-3.5">
        <div className="flex items-center gap-1 rounded-full bg-ink-100 p-1 dark:bg-white/[0.06]">
          {(
            [
              ['all', 'Tất cả'],
              ['1', 'Task 1'],
              ['2', 'Task 2'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTask(value);
                setType('all');
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                task === value
                  ? 'bg-white text-ink-900 shadow-soft dark:bg-white/15 dark:text-white'
                  : 'text-ink-600 dark:text-ink-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-xs text-ink-800 dark:border-white/15 dark:bg-ink-900 dark:text-ink-100"
        >
          <option value="all">Mọi dạng đề</option>
          {types.map((item) => (
            <option key={item} value={item}>
              {TYPE_LABEL[item]}
            </option>
          ))}
        </select>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm theo chủ đề: environment, work…"
          className="min-w-[200px] flex-1 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none dark:border-white/15 dark:bg-white/[0.03] dark:text-white"
        />

        <span className="text-[11px] text-ink-500 dark:text-ink-400">
          {filtered.length} đề · đã luyện {practicedCount}
        </span>
      </div>

      <div className="space-y-4">
        {filtered.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink-500 dark:text-ink-400">
          Không có đề phù hợp bộ lọc.
        </p>
      ) : null}
    </div>
  );
}

function PromptCard({ prompt }: { prompt: WritingPrompt }) {
  const { state, markWriting } = useProgress();
  const entry = state.writing[`prompt:${prompt.id}`];
  const [tab, setTab] = useState<'ideas' | 'structure' | 'language'>('ideas');

  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-400/30 dark:bg-brand-500/10 dark:text-brand-200">
          Task {prompt.task}
        </span>
        <span className="badge">{TYPE_LABEL[prompt.type]}</span>
        <span className="badge">
          {prompt.timeMinutes} phút · {prompt.minWords}+ từ
        </span>
        {entry?.practicedAt ? (
          <span className="badge border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-300">
            Đã luyện
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-[15px] font-medium leading-relaxed text-ink-900 dark:text-white">
        {prompt.prompt}
      </p>

      <div className="mt-4 flex gap-1.5">
        {(
          [
            ['ideas', 'Gợi ý ý tưởng'],
            ['structure', 'Cấu trúc'],
            ['language', 'Cụm từ'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`chip ${tab === value ? 'chip-active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-ink-50/70 p-3.5 dark:bg-white/[0.03]">
        {tab === 'ideas' ? (
          <ul className="space-y-1.5 text-[13.5px] leading-relaxed text-ink-700 dark:text-ink-200">
            {prompt.ideaBank.map((idea) => (
              <li key={idea} className="flex gap-2">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold-500" aria-hidden />
                <span>
                  <RichText text={idea} />
                </span>
              </li>
            ))}
          </ul>
        ) : tab === 'structure' ? (
          <ol className="ml-4 list-decimal space-y-1.5 text-[13.5px] leading-relaxed text-ink-700 marker:text-ink-400 dark:text-ink-200">
            {prompt.structure.map((step) => (
              <li key={step}>
                <RichText text={step} />
              </li>
            ))}
          </ol>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {prompt.usefulLanguage.map((phrase) => (
                <span
                  key={phrase}
                  className="rounded-md bg-white px-1.5 py-0.5 text-[12px] text-brand-800 shadow-sm dark:bg-white/10 dark:text-brand-200"
                >
                  {phrase}
                </span>
              ))}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
                Ăn điểm
              </p>
              <ul className="mt-1 space-y-1 text-[13px] leading-relaxed text-ink-700 dark:text-ink-200">
                {prompt.bandBooster.map((item) => (
                  <li key={item}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => markWriting(`prompt:${prompt.id}`, 'practiced')}
          className={`btn-ghost !px-3 !py-1.5 text-xs ${entry?.practicedAt ? '!border-emerald-300 !text-emerald-700 dark:!text-emerald-300' : ''}`}
        >
          {entry?.practicedAt ? 'Đã luyện đề này' : 'Đánh dấu đã luyện'}
        </button>
        <span className="text-[11px] text-ink-500 dark:text-ink-400">
          Viết ra giấy hoặc máy, đếm số từ, rồi tự chấm theo 4 tiêu chí.
        </span>
      </div>
    </article>
  );
}
