import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { VocabStudy } from '@/components/VocabStudy';
import { RichText, Tag } from '@/components/RichText';
import { getVocabIndex, getVocabSet } from '@/lib/content';
import { TOPIC_LABEL } from '@/lib/labels';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getVocabIndex()
    .filter((set) => set.ready)
    .map((set) => ({ slug: set.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const set = getVocabSet(slug);
  if (!set) return { title: 'Không tìm thấy bộ từ' };
  return {
    title: set.titleVi,
    description: set.description,
  };
}

export default async function VocabSetPage({ params }: Params) {
  const { slug } = await params;
  const set = getVocabSet(slug);
  if (!set) notFound();

  const index = getVocabIndex();
  const position = index.findIndex((item) => item.slug === set.slug);
  const prev = position > 0 ? index[position - 1] : null;
  const next = position >= 0 && position < index.length - 1 ? index[position + 1] : null;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-12">
      <nav className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400" aria-label="Breadcrumb">
        <Link href="/vocabulary" className="hover:text-brand-700 dark:hover:text-brand-300">
          Từ vựng
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink-700 dark:text-ink-200">{TOPIC_LABEL[set.topic] ?? set.topic}</span>
      </nav>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <Tag>{TOPIC_LABEL[set.topic] ?? set.topic}</Tag>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl dark:text-white">
            {set.titleVi}
          </h1>
          <p className="mt-1 text-sm italic text-ink-500 dark:text-ink-400">{set.title}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
            <RichText text={set.description} />
          </p>
        </div>
        <div className="rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-700 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-300">
            Dùng trong bài thi
          </p>
          <p className="mt-1 max-w-xs leading-relaxed">{set.ieltsUse}</p>
        </div>
      </header>

      <div className="mt-8">
        <VocabStudy set={set} />
      </div>

      <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 pt-6 dark:border-white/10">
        {prev ? (
          <Link href={`/vocabulary/${prev.slug}`} className="btn-ghost">
            ← {prev.titleVi}
          </Link>
        ) : (
          <Link href="/vocabulary" className="btn-ghost">
            ← Danh sách bộ từ
          </Link>
        )}
        {next ? (
          <Link href={`/vocabulary/${next.slug}`} className="btn-ghost">
            {next.titleVi} →
          </Link>
        ) : (
          <Link href="/writing" className="btn-ghost">
            Sang phần Writing →
          </Link>
        )}
      </nav>
    </div>
  );
}
