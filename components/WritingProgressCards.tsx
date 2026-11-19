'use client';

import { useProgress } from '@/components/ProgressProvider';

export function WritingProgressCards({ modelTotal }: { modelTotal: number }) {
  const { summary, ready } = useProgress();

  const read = ready ? summary.writingRead : 0;
  const total = summary.writingTotal || 0;

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      <div className="card p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
          Đã đọc
        </p>
        <p className="mt-1 font-display text-2xl font-semibold text-ink-900 dark:text-white">
          {read}
          <span className="text-sm font-normal text-ink-500 dark:text-ink-400"> / {total} phần</span>
        </p>
        <p className="mt-1 text-[11px] text-ink-500 dark:text-ink-400">
          Lý thuyết Task 1, Task 2, tiêu chí chấm và các bài mẫu
        </p>
      </div>
      <div className="card p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
          Bài mẫu
        </p>
        <p className="mt-1 font-display text-2xl font-semibold text-ink-900 dark:text-white">
          {modelTotal}
          <span className="text-sm font-normal text-ink-500 dark:text-ink-400"> bài</span>
        </p>
        <p className="mt-1 text-[11px] text-ink-500 dark:text-ink-400">Band 7.5 và 8.0, có chú thích</p>
      </div>
      <div className="card p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
          Chuỗi ngày học
        </p>
        <p className="mt-1 font-display text-2xl font-semibold text-ink-900 dark:text-white">
          {ready ? summary.streak : 0}
          <span className="text-sm font-normal text-ink-500 dark:text-ink-400"> ngày</span>
        </p>
        <p className="mt-1 text-[11px] text-ink-500 dark:text-ink-400">
          Học 45 phút mỗi ngày tốt hơn 5 giờ cuối tuần
        </p>
      </div>
    </div>
  );
}
