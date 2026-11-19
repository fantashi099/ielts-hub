import type { Metadata } from 'next';
import Link from 'next/link';
import { ProgressDetail } from '@/components/ProgressDetail';
import { getGrammarIndex, getStats, getVocabIndex } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Tiến độ học',
  description: 'Theo dõi số bài ngữ pháp đã làm, số từ đã thuộc và các phần Writing đã đọc.',
};

export default function ProgressPage() {
  const lessons = getGrammarIndex().filter((lesson) => lesson.ready);
  const vocab = getVocabIndex().filter((set) => set.ready);
  const stats = getStats();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-12">
      <header className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
          Tiến độ
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl dark:text-white">
          Bạn đã đi được bao xa
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
          Kho nội dung hiện có {stats.grammarReady} bài ngữ pháp, {stats.vocabWords} từ vựng và {stats.models} bài
          mẫu Writing. Con số dưới đây là phần bạn đã chạm tới.
        </p>
      </header>

      <div className="mt-8">
        <ProgressDetail lessons={lessons} vocab={vocab} />
      </div>

      <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 pt-6 dark:border-white/10">
        <Link href="/plan" className="btn-ghost">
          ← Lộ trình
        </Link>
        <Link href="/grammar" className="btn-primary">
          Học tiếp ngữ pháp →
        </Link>
      </nav>
    </div>
  );
}
