'use client';

import { useProgress } from '@/components/ProgressProvider';

/**
 * Shows the week the learner is on based on the first lesson/word activity,
 * and lets them jump to the current week. Purely local, no backend.
 */
export function PlanTracker({ totalWeeks }: { totalWeeks: number }) {
  const { summary, ready } = useProgress();

  const percent = ready ? summary.percent : 0;
  const week = ready ? Math.min(totalWeeks, Math.max(1, Math.ceil((percent / 100) * totalWeeks))) : 1;

  return (
    <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-400/25 dark:bg-brand-500/[0.08]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300">
            Vị trí của bạn
          </p>
          <p className="mt-0.5 font-display text-lg font-semibold text-ink-900 dark:text-white">
            {ready ? `Tuần ${week} / ${totalWeeks}` : `Tuần 1 / ${totalWeeks}`}
          </p>
        </div>
        <a href={`#tuan-${week}`} className="btn-soft !px-3 !py-1.5 text-xs">
          Tới tuần này
        </a>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/70 dark:bg-white/10">
        <div
          className="h-full rounded-full bg-brand-600 transition-all dark:bg-brand-400"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-[11.5px] leading-relaxed text-ink-600 dark:text-ink-300">
        Vị trí được ước lượng từ số bài ngữ pháp, số từ đã thuộc và số phần writing bạn đã đánh dấu. Học
        chậm hơn lộ trình không phải vấn đề — đi hết một vòng rồi quay lại còn tốt hơn bỏ giữa.
      </p>
    </div>
  );
}
