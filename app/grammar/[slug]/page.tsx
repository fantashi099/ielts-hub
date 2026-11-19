import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GrammarExercises } from '@/components/GrammarExercises';
import { BandBadge, LevelBadge, RichText, Tag } from '@/components/RichText';
import {
  getGrammarIndex,
  getGrammarLesson,
  LEVEL_LABEL,
  TOPIC_LABEL,
} from '@/lib/content';
import type { GrammarSection } from '@/lib/types';

export function generateStaticParams() {
  return getGrammarIndex()
    .filter((lesson) => lesson.ready)
    .map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getGrammarLesson(slug);
  if (!lesson) return { title: 'Không tìm thấy bài học' };
  return {
    title: `${lesson.titleVi} (${lesson.level})`,
    description: lesson.summary,
  };
}

export default async function GrammarLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getGrammarLesson(slug);
  if (!lesson) notFound();

  const index = getGrammarIndex().filter((item) => item.ready);
  const position = index.findIndex((item) => item.slug === slug);
  const prev = position > 0 ? index[position - 1] : null;
  const next = position >= 0 && position < index.length - 1 ? index[position + 1] : null;

  return (
    <article className="space-y-10">
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400">
        <Link href="/grammar" className="hover:text-brand-700 dark:hover:text-brand-300">
          Ngữ pháp
        </Link>
        <span>/</span>
        <span className="text-ink-700 dark:text-ink-200">{TOPIC_LABEL[lesson.topic] ?? lesson.topic}</span>
        <span>/</span>
        <span className="text-ink-500 dark:text-ink-400">{lesson.titleVi}</span>
      </nav>

      <header className="animate-fade-up">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={lesson.level} />
          <BandBadge band={lesson.bandFocus} />
          <Tag>{TOPIC_LABEL[lesson.topic] ?? lesson.topic}</Tag>
          <Tag>Unit {lesson.bookUnits.join(', ')}</Tag>
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl dark:text-white">
          {lesson.titleVi}
        </h1>
        <p className="mt-2 font-display text-lg italic text-ink-500 dark:text-ink-400">
          {lesson.title}
        </p>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink-700 dark:text-ink-200">
          <RichText text={lesson.summary} />
        </p>

        {lesson.whyItMatters ? (
          <div className="mt-5 flex gap-3 rounded-2xl border border-brand-200/70 bg-brand-50/70 p-4 dark:border-brand-400/25 dark:bg-brand-500/10">
            <span className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-300">
              <TargetIcon />
            </span>
            <p className="text-sm leading-relaxed text-ink-700 dark:text-ink-200">
              <span className="font-semibold text-ink-900 dark:text-white">Vì sao quan trọng: </span>
              <RichText text={lesson.whyItMatters} />
            </p>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-500 dark:text-ink-400">
          <span>{LEVEL_LABEL[lesson.level]}</span>
          <span aria-hidden>·</span>
          <span>{lesson.sections.length} phần lý thuyết</span>
          <span aria-hidden>·</span>
          <span>{lesson.exercises.length} câu bài tập</span>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="min-w-0 space-y-12">
          {/* ------------------------------------------------------ sections */}
          <section className="space-y-8">
            {lesson.sections.map((section, i) => (
              <SectionBlock key={`${section.heading}-${i}`} section={section} index={i} />
            ))}
          </section>

          {/* ----------------------------------------------- common mistakes */}
          {lesson.commonMistakes.length > 0 ? (
            <section>
              <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">
                Lỗi người Việt hay mắc
              </h2>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                Đây là những lỗi bị trừ điểm nặng nhất khi chấm Grammatical Range &amp; Accuracy.
              </p>
              <div className="mt-4 space-y-3">
                {lesson.commonMistakes.map((mistake, i) => (
                  <div
                    key={`${mistake.wrong}-${i}`}
                    className="card overflow-hidden p-0"
                  >
                    <div className="grid sm:grid-cols-2">
                      <div className="border-b border-rose-200/60 bg-rose-50/70 p-4 sm:border-b-0 sm:border-r dark:border-rose-400/20 dark:bg-rose-500/10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-300">
                          Sai
                        </p>
                        <p className="mt-1.5 text-sm text-rose-900 line-through decoration-rose-400/70 decoration-1 dark:text-rose-100">
                          {mistake.wrong}
                        </p>
                      </div>
                      <div className="bg-emerald-50/70 p-4 dark:bg-emerald-500/10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                          Đúng
                        </p>
                        <p className="mt-1.5 text-sm font-medium text-emerald-900 dark:text-emerald-100">
                          {mistake.right}
                        </p>
                      </div>
                    </div>
                    <p className="border-t border-ink-200/70 px-4 py-3 text-[13px] leading-relaxed text-ink-600 dark:border-white/10 dark:text-ink-300">
                      <RichText text={mistake.why} />
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* ------------------------------------------------------ ielts tips */}
          {lesson.ieltsTips.length > 0 ? (
            <section>
              <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">
                Áp dụng vào bài thi
              </h2>
              <ol className="mt-4 space-y-3">
                {lesson.ieltsTips.map((tip, i) => (
                  <li key={`${tip.slice(0, 12)}-${i}`} className="flex gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-100 text-[11px] font-bold text-gold-600 dark:bg-gold-400/15 dark:text-gold-300">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-ink-700 dark:text-ink-200">
                      <RichText text={tip} />
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {/* ------------------------------------------------------ exercises */}
          <section id="bai-tap" className="scroll-mt-24">
            <GrammarExercises slug={lesson.slug} exercises={lesson.exercises} />
          </section>

          {/* ------------------------------------------------------------ nav */}
          <nav className="flex flex-col gap-3 border-t border-ink-200/70 pt-6 sm:flex-row sm:justify-between dark:border-white/10">
            {prev ? (
              <Link href={`/grammar/${prev.slug}`} className="btn-ghost !justify-start">
                ← {prev.titleVi}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/grammar/${next.slug}`} className="btn-primary !justify-end">
                Bài tiếp: {next.titleVi} →
              </Link>
            ) : (
              <Link href="/writing" className="btn-primary !justify-end">
                Học xong ngữ pháp? Sang Writing →
              </Link>
            )}
          </nav>
        </div>

        {/* --------------------------------------------------------- sidebar */}
        <aside className="no-print hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="card p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">
                Trong bài này
              </p>
              <ol className="mt-2.5 space-y-1.5">
                {lesson.sections.map((section, i) => (
                  <li key={`${section.heading}-toc-${i}`}>
                    <a
                      href={`#phan-${i + 1}`}
                      className="block text-[13px] leading-snug text-ink-600 transition hover:text-brand-700 dark:text-ink-300 dark:hover:text-brand-300"
                    >
                      {i + 1}. {section.heading}
                    </a>
                  </li>
                ))}
                <li className="pt-1.5">
                  <a
                    href="#bai-tap"
                    className="block text-[13px] font-semibold text-brand-700 dark:text-brand-300"
                  >
                    → Bài tập ({lesson.exercises.length} câu)
                  </a>
                </li>
              </ol>
            </div>

            <div className="card p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">
                Luyện thêm
              </p>
              <div className="mt-2.5 space-y-2">
                <Link
                  href="/vocabulary"
                  className="block text-[13px] text-ink-600 transition hover:text-brand-700 dark:text-ink-300 dark:hover:text-brand-300"
                >
                  Bộ từ vựng cùng chủ đề →
                </Link>
                <Link
                  href="/writing"
                  className="block text-[13px] text-ink-600 transition hover:text-brand-700 dark:text-ink-300 dark:hover:text-brand-300"
                >
                  Áp dụng vào Writing →
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}

function SectionBlock({ section, index }: { section: GrammarSection; index: number }) {
  return (
    <section id={`phan-${index + 1}`} className="scroll-mt-24">
      <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">
        <span className="mr-2 text-brand-500 dark:text-brand-400">{String(index + 1).padStart(2, '0')}</span>
        {section.heading}
      </h2>
      <div className="prose-lesson mt-3">
        {section.body.map((paragraph, i) => (
          <p key={`${paragraph.slice(0, 10)}-${i}`}>
            <RichText text={paragraph} />
          </p>
        ))}
      </div>

      {section.table ? (
        <div className="mt-4 overflow-x-auto rounded-xl border border-ink-200/80 dark:border-white/10">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-ink-50 dark:bg-white/[0.06]">
                {section.table.headers.map((header) => (
                  <th
                    key={header}
                    className="border-b border-ink-200/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink-600 dark:border-white/10 dark:text-ink-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  className="odd:bg-white even:bg-ink-50/50 dark:odd:bg-transparent dark:even:bg-white/[0.03]"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className="border-b border-ink-100 px-4 py-2.5 align-top text-ink-700 last:border-b-0 dark:border-white/[0.06] dark:text-ink-200"
                    >
                      <RichText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {section.examples && section.examples.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {section.examples.map((example, i) => (
            <li
              key={`${example.right.slice(0, 10)}-${i}`}
              className="rounded-xl border border-ink-200/70 bg-white/60 p-3.5 dark:border-white/10 dark:bg-white/[0.03]"
            >
              {example.wrong ? (
                <p className="flex gap-2 text-sm text-rose-700 dark:text-rose-300">
                  <span className="font-bold">✗</span>
                  <span className="line-through decoration-rose-300/80">{example.wrong}</span>
                </p>
              ) : null}
              <p className="flex gap-2 text-sm text-emerald-800 dark:text-emerald-200">
                <span className="font-bold">✓</span>
                <span>
                  <RichText text={example.right} />
                </span>
              </p>
              {example.note ? (
                <p className="mt-1 pl-6 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
                  <RichText text={example.note} />
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function TargetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  );
}
