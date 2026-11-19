import { GrammarBrowser } from '@/components/GrammarBrowser';
import { getGrammarIndex } from '@/lib/content';

export const metadata = {
  title: 'Ngữ pháp — 48 chủ điểm từ nền tảng đến C1',
  description:
    'Học ngữ pháp IELTS theo chủ điểm, bám sát English Grammar in Use: bảng so sánh, lỗi thường gặp của người Việt, bài tập chấm ngay kèm giải thích.',
};

export default function GrammarIndexPage() {
  const lessons = getGrammarIndex();

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="badge bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200">
          Ngữ pháp
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl dark:text-white">
          Ngữ pháp để viết đúng — và đúng kiểu học thuật
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
          48 chủ điểm được sắp theo thứ tự học, bám sát <em>English Grammar in Use</em> (5th ed.).
          Mỗi bài gồm phần giải thích có ví dụ đúng/sai, bảng so sánh, các lỗi người Việt hay mắc, và
          bài tập chấm ngay. Học xong một bài, bạn có thể dùng chính cấu trúc đó trong câu trả lời
          Writing.
        </p>
      </header>

      <GrammarBrowser lessons={lessons} />
    </div>
  );
}
