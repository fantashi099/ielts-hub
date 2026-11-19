import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-ink-200/60 bg-white/50 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 font-display text-[11px] font-bold text-white">
              IH
            </span>
            <span className="font-display text-[15px] font-semibold text-ink-900 dark:text-white">
              IELTS Hub
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            Lộ trình tự học IELTS Academic cho người Việt: ngữ pháp có giải thích, từ vựng theo chủ
            đề, và writing mẫu band 7.5–8.0 kèm phân tích. Mục tiêu: đạt 7.5 hoặc 8.0.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-ink-500 dark:text-ink-400">
            Tiến độ học được lưu ngay trên trình duyệt của bạn (localStorage). Không cần tài khoản,
            không gửi dữ liệu lên máy chủ.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">
            Học
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ['/grammar', 'Ngữ pháp theo chủ điểm'],
              ['/vocabulary', 'Từ vựng theo chủ đề'],
              ['/writing', 'Writing Task 1 & 2'],
              ['/writing/prompts', 'Thư viện đề bài'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-ink-600 transition hover:text-brand-700 dark:text-ink-300 dark:hover:text-brand-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">
            Học liệu tham khảo
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-600 dark:text-ink-300">
            <li>
              <em>English Grammar in Use</em> (5th ed.) — Raymond Murphy
            </li>
            <li>IELTS Writing Task 1 &amp; 2 — Nguyễn Hoàng Huy</li>
            <li>IELTS Academic band descriptors (public version)</li>
          </ul>
          <p className="mt-3 text-xs text-ink-500 dark:text-ink-400">
            Nội dung được biên soạn lại, không sao chép nguyên văn.
          </p>
        </div>
      </div>

      <div className="border-t border-ink-200/60 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-ink-500 sm:px-6 dark:text-ink-400">
          <p>© {new Date().getFullYear()} IELTS Hub — dự án học tập cá nhân.</p>
          <p>Không liên kết chính thức với British Council, IDP hay Cambridge.</p>
        </div>
      </div>
    </footer>
  );
}
