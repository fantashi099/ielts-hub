import type { Metadata } from 'next';
import Link from 'next/link';
import { RichText } from '@/components/RichText';
import { getBandDescriptors, getPrompts, getWritingGuide } from '@/lib/content';
import { WritingProgressCards } from '@/components/WritingProgressCards';

export const metadata: Metadata = {
  title: 'IELTS Writing',
  description:
    'Chiến lược Writing Task 1 và Task 2: khung bốn đoạn, cách viết overview, cách triển khai luận điểm, bài mẫu band 7.5–8.0 có chú thích.',
};

export default function WritingPage() {
  const task1 = getWritingGuide('task1');
  const task2 = getWritingGuide('task2');
  const descriptors = getBandDescriptors();
  const prompts = getPrompts();

  const models = [...(task1?.models ?? []), ...(task2?.models ?? [])];
  const task1Prompts = prompts.filter((p) => p.task === '1').length;
  const task2Prompts = prompts.filter((p) => p.task === '2').length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
          Writing
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl dark:text-white">
          Writing không phải cảm hứng, mà là quy trình
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
          Task 1 dạy bạn <em>chọn số liệu</em>; Task 2 dạy bạn <em>triển khai lập luận</em>. Cả hai đều có
          khung cố định và những lỗi rất dễ đoán — đúng thứ có thể sửa trong hai tuần.
        </p>
      </header>

      <WritingProgressCards modelTotal={models.length} />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <GuideCard
          href="/writing/task1"
          label="Task 1 · 20 phút"
          title={task1?.titleVi ?? 'Writing Task 1'}
          subtitle={task1?.subtitle ?? 'Phân tích biểu đồ, quy trình, bản đồ'}
          points={[
            'Khung 4 đoạn bắt buộc và lý do không có kết luận',
            'Overview — đòn bẩy điểm lớn nhất',
            'Ngôn ngữ mô tả xu hướng và so sánh',
          ]}
          meta={`${task1?.models.length ?? 0} bài mẫu`}
          ready={Boolean(task1)}
        />
        <GuideCard
          href="/writing/task2"
          label="Task 2 · 40 phút"
          title={task2?.titleVi ?? 'Writing Task 2'}
          subtitle={task2?.subtitle ?? 'Nghị luận xã hội'}
          points={[
            'Nhận dạng dạng đề và xác định phần bắt buộc trả lời',
            'Kiến trúc đoạn: ý → giải thích → ví dụ → liên kết',
            'Collocation, sắc thái và hedging ở band 8',
          ]}
          meta={`${task2?.models.length ?? 0} bài mẫu`}
          ready={Boolean(task2)}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Link href="/writing/band-descriptors" className="card-link group p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
                Nền tảng
              </p>
              <h2 className="mt-1.5 font-display text-xl font-semibold text-ink-900 group-hover:text-brand-800 dark:text-white dark:group-hover:text-brand-300">
                Bốn tiêu chí chấm điểm
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                Giám khảo chấm bạn theo 4 tiêu chí, mỗi tiêu chí 25%. Biết band 6 khác band 8 ở đâu thì mới
                biết sửa gì.
              </p>
            </div>
            <span className="text-2xl" aria-hidden>
              →
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {['Task Response', 'Coherence', 'Lexical Resource', 'Grammar'].map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </Link>

        <Link href="/writing/prompts" className="card-link group p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">
                Luyện tập
              </p>
              <h2 className="mt-1.5 font-display text-xl font-semibold text-ink-900 group-hover:text-brand-800 dark:text-white dark:group-hover:text-brand-300">
                Thư viện đề bài
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                {prompts.length} đề thật, mỗi đề có dàn ý gợi ý, cấu trúc đoạn và cụm từ ăn điểm. Không bao
                giờ phải nhìn đề trống giấy.
              </p>
            </div>
            <span className="text-2xl" aria-hidden>
              →
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="chip">{task1Prompts} đề Task 1</span>
            <span className="chip">{task2Prompts} đề Task 2</span>
          </div>
        </Link>
      </div>

      {descriptors ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">
            Bạn đang ở đâu trên thang điểm?
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-ink-600 dark:text-ink-300">
            <RichText text={descriptors.intro} />
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {descriptors.overall.slice(0, 8).map((row) => (
              <div key={row.band} className="card p-4">
                <p className="font-display text-2xl font-semibold text-brand-700 dark:text-brand-300">
                  {row.band}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600 dark:text-ink-300">
                  {row.description.slice(0, 150)}
                  {row.description.length > 150 ? '…' : ''}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function GuideCard({
  href,
  label,
  title,
  subtitle,
  points,
  meta,
  ready,
}: {
  href: string;
  label: string;
  title: string;
  subtitle: string;
  points: string[];
  meta: string;
  ready: boolean;
}) {
  const body = (
    <div className="card flex h-full flex-col p-6 transition group-hover:border-brand-300 dark:group-hover:border-brand-400/40">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          {label}
        </span>
        <span className="text-[11px] font-semibold text-ink-500 dark:text-ink-400">{meta}</span>
      </div>
      <h2 className="mt-2 font-display text-2xl font-semibold text-ink-900 dark:text-white">{title}</h2>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{subtitle}</p>
      <ul className="mt-4 space-y-2 text-sm text-ink-700 dark:text-ink-200">
        {points.map((point) => (
          <li key={point} className="flex gap-2">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand-500" aria-hidden />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-brand-700 dark:text-brand-300">
        {ready ? 'Vào học' : 'Đang soạn'}
        <span aria-hidden>→</span>
      </span>
    </div>
  );

  if (!ready) return <div className="group opacity-70">{body}</div>;
  return (
    <Link href={href} className="group block">
      {body}
    </Link>
  );
}
