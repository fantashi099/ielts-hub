import type { Metadata } from 'next';
import Link from 'next/link';
import { PromptLibrary } from '@/components/PromptLibrary';
import { getPrompts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Thư viện đề Writing',
  description:
    'Đề Writing Task 1 và Task 2 kèm gợi ý ý tưởng, cấu trúc đoạn và cụm từ ăn điểm cho từng dạng đề.',
};

export default function PromptsPage() {
  const prompts = getPrompts();
  const task1 = prompts.filter((p) => p.task === '1').length;
  const task2 = prompts.filter((p) => p.task === '2').length;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:py-12">
      <nav className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400" aria-label="Breadcrumb">
        <Link href="/writing" className="hover:text-brand-700 dark:hover:text-brand-300">
          Writing
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink-700 dark:text-ink-200">Đề bài</span>
      </nav>

      <header className="mt-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl dark:text-white">
          Thư viện đề bài
        </h1>
        <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
          {task1} đề Task 1 và {task2} đề Task 2, phủ đủ các dạng thường gặp. Mỗi đề có sẵn dàn ý để bạn không
          mất 5 phút đầu chỉ để nghĩ ra ý.
        </p>
      </header>

      <div className="mt-7">
        <PromptLibrary prompts={prompts} />
      </div>
    </div>
  );
}
