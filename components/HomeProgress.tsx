'use client';

import Link from 'next/link';
import { useProgress } from '@/components/ProgressProvider';

export function HomeProgress() {
  const { summary, ready } = useProgress();

  const ring = Math.max(0, Math.min(100, summary.percent));

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-6 p-6">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center">
          <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="9"
              className="stroke-ink-100 dark:stroke-white/10"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${(ring / 100) * 264} 264`}
              className="stroke-brand-500 transition-[stroke-dasharray] duration-700"
            />
          </svg>
          <span className="absolute font-display text-xl font-semibold text-ink-900 dark:text-white">
            {ready ? `${ring}%` : '—'}
          </span>
        </div>

        <div className="min-w-[200px] flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">
            Tiến độ của bạn
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink-900 dark:text-white">
            {!ready
              ? 'Đang tải tiến độ…'
              : summary.lessonsDone === 0 && summary.wordsKnown === 0
                ? 'Hôm nay là ngày đầu tiên — bắt đầu nhẹ nhàng nhé.'
                : `Đã xong ${summary.lessonsDone}/${summary.lessonsTotal} bài ngữ pháp, ${summary.wordsKnown} từ đã thuộc.`}
          </h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-600 dark:text-ink-300">
            <span>
              <strong className="font-semibold text-ink-900 dark:text-white">
                {ready ? summary.streak : 0}
              </strong>{' '}
              ngày liên tiếp
            </span>
            <span>
              <strong className="font-semibold text-ink-900 dark:text-white">
                {ready ? summary.wordsKnown : 0}
              </strong>
              /{summary.wordsTotal} từ
            </span>
            <span>
              <strong className="font-semibold text-ink-900 dark:text-white">
                {ready ? summary.writingRead : 0}
              </strong>
              /{summary.writingTotal} phần writing
            </span>
            {summary.averageScore !== null ? (
              <span>
                Điểm trung bình bài tập:{' '}
                <strong className="font-semibold text-ink-900 dark:text-white">
                  {summary.averageScore}%
                </strong>
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/grammar" className="btn-primary whitespace-nowrap">
            Tiếp tục học
          </Link>
          <Link href="/progress" className="btn-ghost whitespace-nowrap">
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
