import type { Metadata } from 'next';
import Link from 'next/link';
import { RichText, Tag } from '@/components/RichText';
import { PlanTracker } from '@/components/PlanTracker';
import { getGrammarIndex, getPlan, getVocabIndex } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Lộ trình 12 tuần',
  description:
    'Lộ trình 12 tuần tự học IELTS: mỗi tuần một nhóm lỗi ngữ pháp, một nhóm từ vựng và một bài writing hoàn chỉnh.',
};

export default function PlanPage() {
  const plan = getPlan();

  if (!plan) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">
          Lộ trình đang được soạn
        </h1>
        <Link href="/grammar" className="btn-soft mt-4">
          ← Học ngữ pháp trước
        </Link>
      </div>
    );
  }

  const grammarTitle = new Map(getGrammarIndex().map((item) => [item.slug, item.titleVi]));
  const vocabTitle = new Map(getVocabIndex().map((item) => [item.slug, item.titleVi]));

  const phases = plan.weeks.reduce<Record<string, typeof plan.weeks>>((acc, week) => {
    acc[week.phase] = [...(acc[week.phase] ?? []), week];
    return acc;
  }, {});

  const totalHours = plan.weeks.reduce((sum, week) => sum + week.hours, 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-12">
      <header className="max-w-3xl">
        <Tag>Lộ trình</Tag>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl dark:text-white">
          {plan.title}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
          <RichText text={plan.intro} />
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Thời lượng" value={`${plan.weeks.length} tuần`} />
          <Stat label="Tổng giờ" value={`~${totalHours}h`} />
          <Stat label="Bài ngữ pháp" value={String(plan.weeks.reduce((n, w) => n + w.grammar.length, 0))} />
          <Stat label="Bộ từ vựng" value={String(new Set(plan.weeks.flatMap((w) => w.vocabulary)).size)} />
        </div>
      </header>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {plan.dailyRoutine.map((block) => (
          <div key={block.block} className="card p-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                {block.block}
              </p>
              <p className="font-mono text-xs text-ink-500 dark:text-ink-400">{block.minutes}′</p>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600 dark:text-ink-300">
              {block.detail}
            </p>
          </div>
        ))}
      </section>

      <PlanTracker totalWeeks={plan.weeks.length} />

      <div className="mt-10 space-y-10">
        {Object.entries(phases).map(([phase, weeks]) => (
          <section key={phase}>
            <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">{phase}</h2>
            <div className="mt-4 space-y-4">
              {weeks.map((week) => {
                const milestone = plan.milestones.find((item) => item.week === week.week);
                return (
                  <article
                    key={week.week}
                    id={`tuan-${week.week}`}
                    className="card scroll-mt-24 p-5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">
                        <span className="mr-2 inline-grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                          {week.week}
                        </span>
                        {week.theme}
                      </h3>
                      <span className="badge">{week.hours} giờ</span>
                    </div>

                    <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                      {week.goals.map((goal) => (
                        <li key={goal} className="flex gap-2 text-[13.5px] leading-relaxed text-ink-700 dark:text-ink-200">
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold-500" aria-hidden />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 grid gap-4 border-t border-ink-100 pt-4 sm:grid-cols-3 dark:border-white/10">
                      <Column title="Ngữ pháp">
                        {week.grammar.map((slug) => (
                          <Link
                            key={slug}
                            href={`/grammar/${slug}`}
                            className="block text-[13px] leading-snug text-brand-700 hover:underline dark:text-brand-300"
                          >
                            {grammarTitle.get(slug) ?? slug}
                          </Link>
                        ))}
                      </Column>
                      <Column title="Từ vựng">
                        {week.vocabulary.map((slug) => (
                          <Link
                            key={slug}
                            href={`/vocabulary/${slug}`}
                            className="block text-[13px] leading-snug text-emerald-700 hover:underline dark:text-emerald-300"
                          >
                            {vocabTitle.get(slug) ?? slug}
                          </Link>
                        ))}
                      </Column>
                      <Column title="Writing">
                        {week.writing.map((item) => (
                          <p key={item} className="text-[13px] leading-snug text-ink-600 dark:text-ink-300">
                            {item}
                          </p>
                        ))}
                      </Column>
                    </div>

                    {milestone ? (
                      <p className="mt-4 rounded-lg border border-gold-200 bg-gold-50/70 px-3 py-2 text-[12.5px] leading-relaxed text-gold-800 dark:border-gold-400/25 dark:bg-gold-400/10 dark:text-gold-200">
                        <span className="font-bold uppercase tracking-wider">Mốc kiểm tra · </span>
                        {milestone.check}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 pt-6 dark:border-white/10">
        <Link href="/grammar" className="btn-ghost">
          ← Ngữ pháp
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link href="/writing/prompts" className="btn-ghost">
            Đề bài để luyện
          </Link>
          <Link href="/progress" className="btn-primary">
            Xem tiến độ →
          </Link>
        </div>
      </nav>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
        {label}
      </p>
      <p className="mt-0.5 font-display text-lg font-semibold text-ink-900 dark:text-white">{value}</p>
    </div>
  );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400 dark:text-ink-500">
        {title}
      </p>
      <div className="mt-1.5 space-y-1">{children}</div>
    </div>
  );
}
