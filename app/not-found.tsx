import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-6xl font-semibold text-brand-700 dark:text-brand-300">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink-900 dark:text-white">
        Không tìm thấy trang này
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-600 dark:text-ink-300">
        Có thể bài học đang được soạn, hoặc đường dẫn bị gõ sai. Bạn thử quay lại một trong ba phần chính.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/grammar" className="btn-primary">
          Ngữ pháp
        </Link>
        <Link href="/vocabulary" className="btn-soft">
          Từ vựng
        </Link>
        <Link href="/writing" className="btn-soft">
          Writing
        </Link>
      </div>
      <Link href="/" className="mt-6 text-xs font-semibold text-ink-500 underline dark:text-ink-400">
        Về trang chủ
      </Link>
    </div>
  );
}
