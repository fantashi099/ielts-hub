import type { Metadata } from 'next';
import Link from 'next/link';
import { RichText, Tag } from '@/components/RichText';
import { DescriptorMarker } from '@/components/DescriptorMarker';
import { getBandDescriptors } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Bốn tiêu chí chấm Writing',
  description:
    'Band descriptors IELTS Writing được diễn giải sang tiếng Việt: band 6, 7 và 8 khác nhau ở đâu và cần sửa gì để lên band.',
};

export default function BandDescriptorsPage() {
  const data = getBandDescriptors();

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">
          Phần này đang được soạn
        </h1>
        <Link href="/writing" className="btn-soft mt-4">
          ← Về Writing
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-12">
      <nav className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400" aria-label="Breadcrumb">
        <Link href="/writing" className="hover:text-brand-700 dark:hover:text-brand-300">
          Writing
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink-700 dark:text-ink-200">Tiêu chí chấm</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <Tag>Nền tảng</Tag>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl dark:text-white">
          {data.titleVi ?? data.title}
        </h1>
        <p className="mt-1 text-sm italic text-ink-500 dark:text-ink-400">{data.title}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
          <RichText text={data.intro} />
        </p>
        <div className="mt-4">
          <DescriptorMarker />
        </div>
      </header>

      <section className="mt-10 space-y-5">
        {data.bands.map((row, index) => (
          <article key={row.criterion} className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">
                <span className="mr-2 text-xs font-bold text-brand-600 dark:text-brand-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {row.criterionVi}
              </h2>
              <span className="badge">{row.weight}</span>
            </div>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-500 dark:text-ink-400">
              {row.criterion}
            </p>

            <p className="mt-3 text-[15px] leading-relaxed text-ink-700 dark:text-ink-200">
              <RichText text={row.whatItMeans} />
            </p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
              {(
                [
                  ['Band 6', row.band6, 'border-ink-200 bg-ink-50/60 dark:border-white/10 dark:bg-white/[0.03]'],
                  ['Band 7', row.band7, 'border-gold-200 bg-gold-50/70 dark:border-gold-400/25 dark:bg-gold-400/[0.07]'],
                  ['Band 8', row.band8, 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-400/25 dark:bg-emerald-500/[0.07]'],
                ] as const
              ).map(([label, text, style]) => (
                <div key={label} className={`rounded-xl border p-3 ${style}`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
                    {label}
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-700 dark:text-ink-200">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50/60 p-3.5 dark:border-brand-400/25 dark:bg-brand-500/[0.07]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300">
                Cách lên band
              </p>
              <ul className="mt-1.5 space-y-1.5 text-[13px] leading-relaxed text-ink-700 dark:text-ink-200">
                {row.howToReach.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand-500" aria-hidden />
                    <span>
                      <RichText text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">
          Thang điểm tổng quát
        </h2>
        <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-300">
          Đọc từ dưới lên: bạn đang ở band nào, và mô tả của band tiếp theo nghe có giống bài gần nhất của bạn
          không?
        </p>
        <div className="mt-4 space-y-2">
          {data.overall.map((row) => (
            <div
              key={row.band}
              className={`flex gap-4 rounded-xl border p-4 ${
                row.band === '7.5'
                  ? 'border-gold-300 bg-gold-50/70 dark:border-gold-400/40 dark:bg-gold-400/10'
                  : 'border-ink-200 bg-white/60 dark:border-white/10 dark:bg-white/[0.03]'
              }`}
            >
              <span className="w-12 shrink-0 font-display text-xl font-semibold text-ink-900 dark:text-white">
                {row.band}
              </span>
              <p className="text-[13.5px] leading-relaxed text-ink-700 dark:text-ink-200">
                {row.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 pt-6 dark:border-white/10">
        <Link href="/writing" className="btn-ghost">
          ← Writing
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link href="/writing/task1" className="btn-ghost">
            Task 1
          </Link>
          <Link href="/writing/task2" className="btn-primary">
            Task 2 →
          </Link>
        </div>
      </nav>
    </div>
  );
}
