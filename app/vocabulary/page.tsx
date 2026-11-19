import type { Metadata } from 'next';
import { VocabBrowser } from '@/components/VocabBrowser';
import { getStats, getVocabIndex } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Từ vựng IELTS',
  description:
    'Từ vựng Academic IELTS theo chủ đề, kèm phiên âm, nghĩa tiếng Việt, ví dụ, collocation và flashcards để nhớ lâu.',
};

export default function VocabularyPage() {
  const sets = getVocabIndex();
  const stats = getStats();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
          Vocabulary
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl dark:text-white">
          Vốn từ đủ để viết và nói về mọi chủ đề
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
          Band 7.5 không đòi từ quá hiếm. Nó đòi từ <em>chính xác</em>, đúng collocation và lặp lại đúng
          chỗ. {stats.vocabReady} bộ dưới đây gồm {stats.vocabWords} từ được chọn theo chủ đề thi thật, mỗi
          từ có phiên âm, nghĩa tiếng Việt, ví dụ và collocation.
        </p>
      </header>

      <div className="mt-8">
        <VocabBrowser sets={sets} />
      </div>
    </div>
  );
}
