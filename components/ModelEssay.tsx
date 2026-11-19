'use client';

import { useMemo, useState } from 'react';
import { useProgress } from '@/components/ProgressProvider';
import type { ModelAnswer } from '@/lib/types';

type Segment = { text: string; note?: string; num?: number };

function buildSegments(paragraph: string, annotations: ModelAnswer['annotations']): Segment[] {
  const hits: { start: number; end: number; index: number }[] = [];

  annotations.forEach((annotation, index) => {
    const start = paragraph.indexOf(annotation.quote);
    if (start === -1) return;
    hits.push({ start, end: start + annotation.quote.length, index });
  });

  hits.sort((a, b) => a.start - b.start);

  const segments: Segment[] = [];
  let cursor = 0;

  for (const hit of hits) {
    if (hit.start < cursor) continue;
    if (hit.start > cursor) segments.push({ text: paragraph.slice(cursor, hit.start) });
    segments.push({
      text: paragraph.slice(hit.start, hit.end),
      note: annotations[hit.index].note,
      num: hit.index + 1,
    });
    cursor = hit.end;
  }

  if (cursor < paragraph.length) segments.push({ text: paragraph.slice(cursor) });
  return segments;
}

export function ModelEssay({ model, taskSlug }: { model: ModelAnswer; taskSlug: string }) {
  const { state, markWriting, ready } = useProgress();
  const key = `model:${model.id}`;
  const entry = state.writing[key];
  const [showNotes, setShowNotes] = useState(true);
  const [showVisual, setShowVisual] = useState(false);

  const paragraphs = useMemo(() => model.essay.split(/\n{2,}/), [model.essay]);
  const rendered = useMemo(
    () => paragraphs.map((paragraph) => buildSegments(paragraph, model.annotations)),
    [paragraphs, model.annotations],
  );

  return (
    <article id={model.id} className="card scroll-mt-24 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge border-gold-300 bg-gold-50 text-gold-700 dark:border-gold-400/40 dark:bg-gold-400/10 dark:text-gold-200">
          Band {model.band}
        </span>
        <span className="badge">{model.wordCount} từ</span>
        <span className="badge">{model.outline.length} đoạn</span>
        {ready && entry?.readAt ? (
          <span className="badge border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-300">
            Đã đọc
          </span>
        ) : null}
        {ready && entry?.practicedAt ? (
          <span className="badge border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-400/40 dark:bg-brand-500/10 dark:text-brand-200">
            Đã luyện
          </span>
        ) : null}
      </div>

      <div className="mt-3">
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
          Đề bài
        </p>
        <p className="mt-1 text-[15px] font-medium leading-relaxed text-ink-900 dark:text-white">
          {model.prompt}
        </p>
      </div>

      {model.visual ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowVisual((value) => !value)}
            className="text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300"
            aria-expanded={showVisual}
          >
            {showVisual ? 'Ẩn dữ liệu hình' : 'Xem dữ liệu hình (dạng chữ)'}
          </button>
          {showVisual ? (
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg border border-ink-200 bg-ink-50 p-3 font-mono text-[12px] leading-relaxed text-ink-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-ink-200">
              {model.visual}
            </pre>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
          Bài mẫu
        </p>
        <button
          type="button"
          onClick={() => setShowNotes((value) => !value)}
          className={`chip ${showNotes ? 'chip-active' : ''}`}
          aria-pressed={showNotes}
        >
          {showNotes ? 'Đang hiện chú thích' : 'Hiện chú thích'}
        </button>
      </div>

      <div className="mt-2 space-y-3 rounded-xl bg-ink-50/60 p-4 text-[15px] leading-[1.85] text-ink-800 dark:bg-white/[0.03] dark:text-ink-100">
        {rendered.map((segments, paragraphIndex) => (
          <p key={paragraphIndex}>
            {segments.map((segment, segmentIndex) =>
              segment.note && showNotes ? (
                <mark
                  key={segmentIndex}
                  title={segment.note}
                  className="cursor-help rounded bg-gold-200/70 px-0.5 text-ink-900 underline decoration-gold-500/60 decoration-dotted underline-offset-2 dark:bg-gold-400/25 dark:text-gold-50"
                >
                  {segment.text}
                  <sup className="ml-0.5 text-[9px] font-bold text-gold-700 dark:text-gold-300">
                    {segment.num}
                  </sup>
                </mark>
              ) : (
                <span key={segmentIndex}>{segment.text}</span>
              ),
            )}
          </p>
        ))}
      </div>

      {showNotes ? (
        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
            Chú thích từng câu
          </p>
          <ol className="mt-2 space-y-2">
            {model.annotations.map((annotation, index) => (
              <li key={annotation.quote} className="flex gap-2.5 text-[13px] leading-relaxed">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-100 text-[10px] font-bold text-gold-700 dark:bg-gold-400/20 dark:text-gold-200">
                  {index + 1}
                </span>
                <span className="text-ink-600 dark:text-ink-300">
                  <span className="italic">“{annotation.quote}”</span> — {annotation.note}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
            Dàn ý
          </p>
          <ol className="mt-1.5 ml-4 list-decimal space-y-1 text-[13px] leading-relaxed text-ink-600 marker:text-ink-400 dark:text-ink-300">
            {model.outline.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
            Cụm từ ăn điểm
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {model.keyLanguage.map((phrase) => (
              <span
                key={phrase}
                className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[12px] text-brand-800 dark:bg-brand-500/15 dark:text-brand-200"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-ink-200 pt-4 dark:border-white/10">
        <button
          type="button"
          onClick={() => markWriting(key, 'read')}
          className={`btn-ghost !px-3 !py-1.5 text-xs ${entry?.readAt ? '!border-emerald-300 !text-emerald-700 dark:!text-emerald-300' : ''}`}
        >
          {entry?.readAt ? 'Đã đọc bài này' : 'Đánh dấu đã đọc'}
        </button>
        <button
          type="button"
          onClick={() => markWriting(key, 'practiced')}
          className={`btn-ghost !px-3 !py-1.5 text-xs ${entry?.practicedAt ? '!border-brand-300 !text-brand-700 dark:!text-brand-300' : ''}`}
        >
          {entry?.practicedAt ? 'Đã luyện lại' : 'Đã tự viết lại bài này'}
        </button>
        <a href={`/writing/${taskSlug}#bai-mau`} className="btn-ghost !px-3 !py-1.5 text-xs">
          Về danh sách bài mẫu
        </a>
      </div>
    </article>
  );
}
