'use client';

import { useProgress } from '@/components/ProgressProvider';

export function DescriptorMarker() {
  const { state, markWriting } = useProgress();
  const entry = state.writing['guide:band-descriptors'] as { readAt?: string } | undefined;

  return (
    <button
      type="button"
      onClick={() => markWriting('guide:band-descriptors', 'read')}
      className={`btn-soft !px-3 !py-1.5 text-xs ${entry?.readAt ? '!border-emerald-300 !text-emerald-700 dark:!text-emerald-300' : ''}`}
    >
      {entry?.readAt ? 'Đã đọc bốn tiêu chí' : 'Đánh dấu đã đọc'}
    </button>
  );
}
