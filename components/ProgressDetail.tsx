'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useProgress } from '@/components/ProgressProvider';
import { LEVEL_LABEL } from '@/lib/labels';
import type { LessonIndexItem, VocabSetIndexItem } from '@/lib/content';

export function ProgressDetail({
  lessons,
  vocab,
}: {
  lessons: LessonIndexItem[];
  vocab: VocabSetIndexItem[];
}) {
  const { state, summary, ready, reset } = useProgress();

  const done = useMemo(
    () => lessons.filter((lesson) => state.lessons[lesson.slug]),
    [lessons, state.lessons],
  );

  const knownBySet = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const [key, status] of Object.entries(state.words)) {
      if (status !== 'known') continue;
      const [setSlug] = key.split(':');
      counts[setSlug] = (counts[setSlug] ?? 0) + 1;
    }
    return counts;
  }, [state.words]);

  const writingEntries = Object.entries(state.writing).filter(([, value]) => value?.readAt || value?.practicedAt);

  return (
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <BigStat
          label="Ngữ pháp"
          value={`${summary.lessonsDone}/${summary.lessonsTotal}`}
          hint={
            summary.averageScore === null
              ? 'Chưa có bài nào được chấm'
              : `Điểm trung bình ${summary.averageScore}%`
          }
        />
        <BigStat label="Từ vựng" value={`${summary.wordsKnown}/${summary.wordsTotal}`} hint={`${summary.wordsLearning} từ đang học`} />
        <BigStat
          label="Writing"
          value={`${summary.writingRead}/${summary.writingTotal}`}
          hint="Lý thuyết và bài mẫu đã đọc"
        />
        <BigStat label="Chuỗi ngày" value={`${summary.streak}`} hint="Ngày học liên tiếp" />
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">
            Ngữ pháp đã hoàn thành
          </h2>
          <Link href="/grammar" className="text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300">
            Học tiếp →
          </Link>
        </div>
        {done.length === 0 ? (
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            Chưa có bài nào. Làm xong bài đầu tiên ở{' '}
            <Link href="/grammar" className="underline">
              phần Ngữ pháp
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {done.map((lesson) => {
              const entry = state.lessons[lesson.slug];
              const percent = entry.total ? Math.round((entry.score / entry.total) * 100) : 0;
              return (
                <li key={lesson.slug}>
                  <Link
                    href={`/grammar/${lesson.slug}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-ink-200 bg-white/70 px-3.5 py-2.5 transition hover:border-brand-300 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] font-medium text-ink-900 dark:text-white">
                        {lesson.titleVi}
                      </span>
                      <span className="block text-[11px] text-ink-500 dark:text-ink-400">
                        {LEVEL_LABEL[lesson.level]} · {entry.attempts} lần làm
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold ${
                        percent >= 80
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                          : percent >= 50
                            ? 'bg-gold-100 text-gold-700 dark:bg-gold-400/20 dark:text-gold-200'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                      }`}
                    >
                      {entry.score}/{entry.total}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Từ vựng theo bộ</h2>
          <Link href="/vocabulary" className="text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300">
            Học tiếp →
          </Link>
        </div>
        <ul className="mt-3 space-y-2">
          {vocab.map((set) => {
            const known = knownBySet[set.slug] ?? 0;
            const percent = set.wordCount ? Math.round((known / set.wordCount) * 100) : 0;
            return (
              <li key={set.slug} className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:flex-nowrap">
                <Link
                  href={`/vocabulary/${set.slug}`}
                  className="w-full shrink-0 truncate text-[12.5px] sm:w-56 text-ink-700 hover:text-brand-700 dark:text-ink-200 dark:hover:text-brand-300"
                >
                  {set.titleVi.replace(' — bộ từ cốt lõi', '')}
                </Link>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right font-mono text-[11px] text-ink-500 dark:text-ink-400">
                  {known}/{set.wordCount}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {writingEntries.length > 0 ? (
        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">
            Writing đã đánh dấu
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {writingEntries.map(([key]) => (
              <li
                key={key}
                className="rounded-lg bg-ink-50 px-2.5 py-1 font-mono text-[11px] text-ink-600 dark:bg-white/[0.06] dark:text-ink-300"
              >
                {key.replace('model:', 'Bài mẫu · ').replace('guide:', 'Lý thuyết · ').replace('prompt:', 'Đề · ')}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-ink-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <h2 className="text-sm font-semibold text-ink-900 dark:text-white">Dữ liệu tiến độ</h2>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-600 dark:text-ink-300">
          Toàn bộ tiến độ chỉ nằm trong <code className="kbd">localStorage</code> của trình duyệt này — không
          có tài khoản, không có máy chủ, không ai thấy bạn học gì. Đổi máy hoặc xoá dữ liệu trình duyệt là
          mất tiến độ.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Xoá toàn bộ tiến độ học trên trình duyệt này?')) reset();
          }}
          className="btn-ghost mt-3 !border-rose-300 !px-3 !py-1.5 text-xs !text-rose-700 dark:!text-rose-300"
        >
          Xoá tiến độ
        </button>
      </section>

      {!ready ? (
        <p className="text-xs text-ink-500 dark:text-ink-400">Đang đọc dữ liệu tiến độ…</p>
      ) : null}
    </div>
  );
}

function BigStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="card p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-semibold text-ink-900 dark:text-white">{value}</p>
      <p className="mt-0.5 text-[11px] text-ink-500 dark:text-ink-400">{hint}</p>
    </div>
  );
}
