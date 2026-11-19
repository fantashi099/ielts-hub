import Link from 'next/link';
import { HomeProgress } from '@/components/HomeProgress';
import { LevelBadge, SectionHeading, Tag } from '@/components/RichText';
import { getGrammarIndex, getStats, getVocabIndex, TOPIC_LABEL } from '@/lib/content';

export const metadata = {
  title: 'IELTS Hub — Học ngữ pháp, từ vựng và writing để đạt 7.5–8.0',
};

const BAND_LADDER = [
  { band: '6.5', note: 'Đủ ý, nhưng lỗi ngữ pháp còn lặp và từ vựng còn chung chung.', level: 62 },
  { band: '7.0', note: 'Câu phức đa dạng, ý mạch lạc, vẫn còn lỗi nhỏ rải rác.', level: 74 },
  { band: '7.5', note: 'Ít lỗi, từ vựng chính xác theo chủ đề, mạch lạc tự nhiên.', level: 86, target: true },
  { band: '8.0', note: 'Kiểm soát lỗi gần như tuyệt đối, diễn đạt tinh tế và linh hoạt.', level: 96 },
];

export default function HomePage() {
  const stats = getStats();
  const lessons = getGrammarIndex().filter((l) => l.ready).slice(0, 3);
  const vocab = getVocabIndex().filter((v) => v.ready).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* ---------------------------------------------------------------- hero */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.12fr_.88fr]">
        <div className="animate-fade-up">
          <p className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
            IELTS Academic · mục tiêu 7.5 – 8.0
          </p>
          <h1 className="mt-4 font-display text-[2.15rem] font-semibold leading-[1.12] tracking-tight text-ink-900 sm:text-5xl dark:text-white">
            Ngữ pháp vững, vốn từ đủ,
            <br className="hidden sm:block" /> writing có chiến lược.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
            Một lộ trình tự học dành cho người Việt, đi từ gốc: 48 chủ điểm ngữ pháp có bài tập chấm
            ngay, 20 bộ từ vựng học thuật kèm collocation, và writing mẫu band 7.5–8.0 được bóc
            từng câu để bạn hiểu vì sao nó đạt điểm cao.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/grammar" className="btn-primary !px-5 !py-2.5">
              Bắt đầu với ngữ pháp
            </Link>
            <Link href="/plan" className="btn-ghost !px-5 !py-2.5">
              Xem lộ trình 12 tuần
            </Link>
          </div>

          <dl className="mt-9 grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { v: stats.grammarTotal, l: 'chủ điểm ngữ pháp' },
              { v: stats.vocabTotal, l: 'bộ từ vựng' },
              { v: stats.models, l: 'bài writing mẫu' },
              { v: '12', l: 'tuần lộ trình' },
            ].map((item) => (
              <div key={item.l}>
                <dt className="font-display text-2xl font-semibold text-ink-900 dark:text-white">
                  {item.v}
                </dt>
                <dd className="text-xs leading-snug text-ink-500 dark:text-ink-400">{item.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="card animate-fade-up p-6 [animation-delay:80ms]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">
              Thang điểm mục tiêu
            </p>
            <span className="badge bg-gold-100 text-gold-600 dark:bg-gold-400/15 dark:text-gold-300">
              Mục tiêu
            </span>
          </div>

          <ol className="mt-5 space-y-4">
            {BAND_LADDER.map((row) => (
              <li key={row.band} className="relative pl-12">
                <span
                  className={`absolute left-0 top-0 grid h-9 w-9 place-items-center rounded-xl font-display text-sm font-semibold ${
                    row.target
                      ? 'bg-brand-600 text-white shadow-soft'
                      : 'bg-ink-100 text-ink-600 dark:bg-white/10 dark:text-ink-200'
                  }`}
                >
                  {row.band}
                </span>
                <p
                  className={`text-sm leading-snug ${
                    row.target
                      ? 'font-semibold text-ink-900 dark:text-white'
                      : 'text-ink-600 dark:text-ink-300'
                  }`}
                >
                  {row.note}
                </p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${
                      row.target
                        ? 'bg-gradient-to-r from-brand-500 to-gold-400'
                        : 'bg-ink-300/70 dark:bg-white/20'
                    }`}
                    style={{ width: `${row.level}%` }}
                  />
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-5 rounded-xl bg-ink-50 px-4 py-3 text-xs leading-relaxed text-ink-600 dark:bg-white/[0.05] dark:text-ink-300">
            IELTS chấm 4 tiêu chí, mỗi tiêu chí chiếm 25%. Muốn 7.5 tổng, bạn gần như chắc chắn phải
            có ít nhất 7.0 ở cả bốn, và 8.0 ở hai tiêu chí mạnh.
          </p>
        </aside>
      </section>

      {/* ------------------------------------------------------------ progress */}
      <section>
        <HomeProgress />
      </section>

      {/* ------------------------------------------------------------- pillars */}
      <section>
        <SectionHeading
          eyebrow="Ba trụ cột"
          title="Học đúng thứ tự, không học tràn lan"
          description="Ngữ pháp giúp bạn viết đúng. Từ vựng giúp bạn viết hay. Writing mẫu cho bạn thấy người ta đã ghép hai thứ đó lại như thế nào."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/grammar" className="card card-link group p-6">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <GrammarIcon />
              </span>
              <span className="text-xs font-semibold text-ink-500 dark:text-ink-400">
                {stats.grammarTotal} chủ điểm
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink-900 dark:text-white">
              Ngữ pháp có kiểm tra
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              Bám sát <em>English Grammar in Use</em>, mỗi bài có bảng so sánh, lỗi thường gặp của
              người Việt và 8–10 câu bài tập chấm ngay kèm giải thích.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2.5 dark:text-brand-300">
              Vào học <ArrowIcon />
            </span>
          </Link>

          <Link href="/vocabulary" className="card card-link group p-6">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                <VocabIcon />
              </span>
              <span className="text-xs font-semibold text-ink-500 dark:text-ink-400">
                {stats.vocabTotal} bộ · {stats.vocabWords}+ từ
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink-900 dark:text-white">
              Từ vựng theo chủ đề
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              Không học từ rời. Mỗi từ đi kèm nghĩa Việt, định nghĩa Anh, collocation, từ đồng nghĩa
              và một câu ví dụ đúng kiểu bài thi.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2.5 dark:text-brand-300">
              Mở bộ từ <ArrowIcon />
            </span>
          </Link>

          <Link href="/writing" className="card card-link group p-6">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-100 text-gold-600 dark:bg-gold-400/15 dark:text-gold-300">
                <WritingIcon />
              </span>
              <span className="text-xs font-semibold text-ink-500 dark:text-ink-400">
                {stats.models} bài mẫu
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink-900 dark:text-white">
              Writing có phân tích
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              Task 1 và Task 2: cấu trúc 4 đoạn, cách viết overview, cách xây thesis, kèm bài mẫu
              band 7.5–8.0 được gắn ghi chú từng câu.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2.5 dark:text-brand-300">
              Xem bài mẫu <ArrowIcon />
            </span>
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------- start here */}
      {lessons.length > 0 ? (
        <section>
          <SectionHeading
            eyebrow="Bắt đầu ngay"
            title="Ba bài ngữ pháp nên học đầu tiên"
            description="Nếu bạn chưa biết bắt đầu từ đâu, đây là ba chủ điểm nền tảng nhất — chúng xuất hiện trong gần như mọi bài writing."
            action={
              <Link href="/grammar" className="btn-ghost">
                Xem tất cả
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            {lessons.map((lesson) => (
              <Link
                key={lesson.slug}
                href={`/grammar/${lesson.slug}`}
                className="card card-link group p-5"
              >
                <div className="flex items-center gap-2">
                  <LevelBadge level={lesson.level} />
                  <Tag>{TOPIC_LABEL[lesson.topic] ?? lesson.topic}</Tag>
                </div>
                <h3 className="mt-3 font-display text-base font-semibold leading-snug text-ink-900 dark:text-white">
                  {lesson.titleVi}
                </h3>
                <p className="mt-1 text-[13px] text-ink-500 dark:text-ink-400">{lesson.title}</p>
                <p className="mt-3 text-xs text-ink-500 dark:text-ink-400">
                  Unit {lesson.bookUnits.join(', ')} · Band {lesson.bandFocus}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* -------------------------------------------------------------- method */}
      <section className="rounded-3xl border border-ink-200/70 bg-white/60 p-6 sm:p-10 dark:border-white/10 dark:bg-white/[0.03]">
        <SectionHeading
          eyebrow="Cách học"
          title="Một vòng học 45 phút, lặp lại mỗi ngày"
          description="Học ít nhưng đều. Mỗi ngày một vòng nhỏ, mỗi tuần một bài writing hoàn chỉnh."
        />
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            {
              n: '01',
              title: 'Học lý thuyết 15 phút',
              body: 'Đọc một bài ngữ pháp hoặc một bộ từ. Ghi lại 3 cấu trúc bạn chắc chắn sẽ dùng trong bài viết tới.',
            },
            {
              n: '02',
              title: 'Luyện tập 15 phút',
              body: 'Làm bài tập chấm ngay. Sai câu nào đọc giải thích câu đó — đây là phần tạo ra tiến bộ thật.',
            },
            {
              n: '03',
              title: 'Viết 15 phút',
              body: 'Áp dụng vào một đoạn văn: mở bài của Task 2, hoặc overview của Task 1. Viết xong so với bài mẫu.',
            },
          ].map((step) => (
            <li key={step.n} className="rounded-2xl bg-ink-50/80 p-5 dark:bg-white/[0.05]">
              <span className="font-display text-sm font-semibold text-brand-600 dark:text-brand-300">
                {step.n}
              </span>
              <h3 className="mt-1 font-display text-base font-semibold text-ink-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------------------------------------------------- vocab peek */}
      {vocab.length > 0 ? (
        <section>
          <SectionHeading
            eyebrow="Từ vựng"
            title="Bộ từ đang mở"
            description="Mỗi bộ 20–30 từ, đủ để viết một bài Task 2 trọn vẹn về chủ đề đó."
            action={
              <Link href="/vocabulary" className="btn-ghost">
                Tất cả bộ từ
              </Link>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {vocab.map((set) => (
              <Link
                key={set.slug}
                href={`/vocabulary/${set.slug}`}
                className="card card-link flex items-center justify-between gap-3 p-4"
              >
                <div>
                  <p className="font-display text-sm font-semibold text-ink-900 dark:text-white">
                    {set.titleVi}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                    {set.wordCount} từ
                  </p>
                </div>
                <ArrowIcon className="text-ink-400" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------------------- band */}
      <section className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-12 text-center sm:px-12 dark:bg-white/[0.04]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_240px_at_50%_-10%,rgba(59,102,246,.55),transparent_70%)]"
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Đừng học thêm thật nhiều. Hãy học đúng thứ tự, rồi luyện viết mỗi tuần.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-300">
            12 tuần là đủ để đi từ band 6.5 lên 7.5 nếu bạn giữ được nhịp 45 phút mỗi ngày và viết
            đủ 12 bài.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/plan" className="btn bg-white !px-5 !py-2.5 text-ink-900 hover:bg-ink-100">
              Xem lộ trình 12 tuần
            </Link>
            <Link
              href="/writing"
              className="btn border border-white/25 !px-5 !py-2.5 text-white hover:bg-white/10"
            >
              Vào phần Writing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform group-hover:translate-x-0.5 ${className}`}
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function GrammarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16M4 12h10M4 19h13" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function VocabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5Z" />
      <path d="M4 5.5V20.5M8 7h7M8 11h5" />
    </svg>
  );
}

function WritingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 21 4.5-1.2 10-10a2.1 2.1 0 0 0-3-3l-10 10Z" />
      <path d="M13.5 6.5 17 10M4 13H2M4 17H2" />
    </svg>
  );
}
