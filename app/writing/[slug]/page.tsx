import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ModelEssay } from '@/components/ModelEssay';
import { RichText, Tag } from '@/components/RichText';
import { WritingBlocks } from '@/components/WritingBlocks';
import { WritingReadMarker } from '@/components/WritingReadMarker';
import { getWritingGuide } from '@/lib/content';

type Params = { params: Promise<{ slug: string }> };

const SLUGS = ['task1', 'task2'] as const;

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (!SLUGS.includes(slug as (typeof SLUGS)[number])) return { title: 'Không tìm thấy bài viết' };
  const guide = getWritingGuide(slug as 'task1' | 'task2');
  if (!guide) return { title: 'Không tìm thấy bài viết' };
  return { title: guide.titleVi, description: guide.subtitle };
}

export default async function WritingGuidePage({ params }: Params) {
  const { slug } = await params;
  if (!SLUGS.includes(slug as (typeof SLUGS)[number])) notFound();
  const guide = getWritingGuide(slug as 'task1' | 'task2');
  if (!guide) notFound();

  const other = slug === 'task1' ? 'task2' : 'task1';
  const otherGuide = getWritingGuide(other);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-12">
      <nav className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400" aria-label="Breadcrumb">
        <Link href="/writing" className="hover:text-brand-700 dark:hover:text-brand-300">
          Writing
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink-700 dark:text-ink-200">{slug === 'task1' ? 'Task 1' : 'Task 2'}</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <Tag>{slug === 'task1' ? 'Task 1 · 20 phút · 150 từ' : 'Task 2 · 40 phút · 250 từ'}</Tag>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl dark:text-white">
          {guide.titleVi}
        </h1>
        <p className="mt-1 text-sm italic text-ink-500 dark:text-ink-400">{guide.title}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
          <RichText text={guide.subtitle} />
        </p>
        <div className="mt-4">
          <WritingReadMarker guideSlug={guide.slug} />
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-10">
          {guide.sections.map((section, index) => (
            <section key={section.heading} id={`phan-${index + 1}`} className="scroll-mt-24">
              <h2 className="flex items-baseline gap-2.5 font-display text-xl font-semibold text-ink-900 dark:text-white">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {section.heading}
              </h2>
              {section.intro ? (
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
                  <RichText text={section.intro} />
                </p>
              ) : null}
              <div className="mt-4">
                <WritingBlocks blocks={section.blocks} />
              </div>
            </section>
          ))}

          <section id="bai-mau" className="scroll-mt-24">
            <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">
              {guide.models.length} bài mẫu có chú thích
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              Đọc bài trước, đoán xem câu nào là câu ăn điểm, rồi mở chú thích để kiểm tra. Câu được tô vàng
              là câu giám khảo sẽ ghi nhận.
            </p>
            <div className="mt-5 space-y-5">
              {guide.models.map((model) => (
                <ModelEssay key={model.id} model={model} taskSlug={guide.slug} />
              ))}
            </div>
          </section>

          <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 pt-6 dark:border-white/10">
            <Link href="/writing" className="btn-ghost">
              ← Tổng quan Writing
            </Link>
            <div className="flex flex-wrap gap-2">
              <Link href="/writing/prompts" className="btn-ghost">
                Thư viện đề bài
              </Link>
              {otherGuide ? (
                <Link href={`/writing/${other}`} className="btn-primary">
                  {other === 'task2' ? 'Sang Task 2 →' : 'Sang Task 1 →'}
                </Link>
              ) : null}
            </div>
          </nav>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
                Trong bài này
              </p>
              <ol className="mt-2 space-y-1.5 border-l border-ink-200 pl-3 dark:border-white/10">
                {guide.sections.map((section, index) => (
                  <li key={section.heading}>
                    <a
                      href={`#phan-${index + 1}`}
                      className="block text-[13px] leading-snug text-ink-600 transition hover:text-brand-700 dark:text-ink-300 dark:hover:text-brand-300"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#bai-mau"
                    className="block text-[13px] font-semibold leading-snug text-brand-700 dark:text-brand-300"
                  >
                    Bài mẫu có chú thích
                  </a>
                </li>
              </ol>
            </div>

            <div className="rounded-xl border border-ink-200 bg-white/60 p-3.5 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
                Bài mẫu
              </p>
              <ul className="mt-2 space-y-1.5">
                {guide.models.map((model) => (
                  <li key={model.id}>
                    <a
                      href={`#${model.id}`}
                      className="flex items-center justify-between gap-2 text-[12.5px] text-ink-600 hover:text-brand-700 dark:text-ink-300 dark:hover:text-brand-300"
                    >
                      <span className="line-clamp-1">{model.prompt.slice(0, 46)}…</span>
                      <span className="shrink-0 font-mono text-[10px] text-ink-400 dark:text-ink-500">
                        {model.band}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
