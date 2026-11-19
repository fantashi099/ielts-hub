'use client';

import { useProgress } from '@/components/ProgressProvider';

export function WritingReadMarker({ guideSlug }: { guideSlug: 'task1' | 'task2' }) {
  const { state, markWriting, ready } = useProgress();
  const entry = state.writing[`guide:${guideSlug}`];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => markWriting(`guide:${guideSlug}`, 'read')}
        className={`btn-soft !px-3 !py-1.5 text-xs ${entry?.readAt ? '!border-emerald-300 !text-emerald-700 dark:!text-emerald-300' : ''}`}
      >
        {entry?.readAt ? 'Đã đọc phần lý thuyết' : 'Đánh dấu đã đọc lý thuyết'}
      </button>
      {ready && entry?.readAt ? (
        <span className="text-[11px] text-ink-500 dark:text-ink-400">
          Đã ghi vào tiến độ của bạn
        </span>
      ) : null}
    </div>
  );
}
