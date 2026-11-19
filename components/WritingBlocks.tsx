import { RichText } from '@/components/RichText';
import type { WritingBlock } from '@/lib/types';

export function WritingBlocks({ blocks }: { blocks: WritingBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: WritingBlock }) {
  switch (block.type) {
    case 'p':
      return (
        <p className="text-[15px] leading-relaxed text-ink-700 dark:text-ink-200">
          <RichText text={block.text ?? ''} />
        </p>
      );

    case 'list':
      if (block.ordered) {
        return (
          <ol className="ml-5 list-decimal space-y-1.5 text-[15px] leading-relaxed text-ink-700 marker:text-ink-400 dark:text-ink-200">
            {(block.items ?? []).map((item, i) => (
              <li key={i}>
                <RichText text={item} />
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="ml-5 list-disc space-y-1.5 text-[15px] leading-relaxed text-ink-700 marker:text-brand-400 dark:text-ink-200">
          {(block.items ?? []).map((item, i) => (
            <li key={i}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );

    case 'table':
      return (
        <div className="overflow-x-auto rounded-xl border border-ink-200 dark:border-white/10">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-ink-50 dark:bg-white/[0.04]">
                {(block.table?.headers ?? []).map((header) => (
                  <th
                    key={header}
                    className="border-b border-ink-200 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-ink-600 dark:border-white/10 dark:text-ink-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(block.table?.rows ?? []).map((row, rowIndex) => (
                <tr key={rowIndex} className="align-top even:bg-ink-50/50 dark:even:bg-white/[0.02]">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border-b border-ink-100 px-3 py-2.5 leading-relaxed text-ink-700 last:border-0 dark:border-white/[0.06] dark:text-ink-200"
                    >
                      <RichText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'callout': {
      const tone = block.tone ?? 'info';
      const styles: Record<string, string> = {
        tip: 'border-gold-300 bg-gold-50 text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-100',
        warn: 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-100',
        info: 'border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-400/30 dark:bg-brand-500/10 dark:text-brand-100',
      };
      const labels: Record<string, string> = { tip: 'Mẹo', warn: 'Cảnh báo', info: 'Ghi nhớ' };
      return (
        <aside className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles[tone]}`}>
          <span className="mr-2 text-[10px] font-bold uppercase tracking-widest opacity-70">
            {labels[tone]}
          </span>
          <RichText text={block.text ?? ''} />
        </aside>
      );
    }

    case 'quote':
      return (
        <blockquote className="border-l-2 border-brand-300 pl-4 text-[15px] italic leading-relaxed text-ink-600 dark:border-brand-400/50 dark:text-ink-300">
          <RichText text={block.text ?? ''} />
        </blockquote>
      );

    case 'compare':
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {[block.left, block.right].map((side, index) =>
            side ? (
              <div
                key={index}
                className={`rounded-xl border p-4 ${
                  index === 0
                    ? 'border-rose-200 bg-rose-50/60 dark:border-rose-400/25 dark:bg-rose-500/[0.07]'
                    : 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-400/25 dark:bg-emerald-500/[0.07]'
                }`}
              >
                <p
                  className={`text-[11px] font-bold uppercase tracking-widest ${
                    index === 0
                      ? 'text-rose-600 dark:text-rose-300'
                      : 'text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {side.title}
                </p>
                <ul className="mt-2 space-y-1.5 text-[13.5px] leading-relaxed text-ink-700 dark:text-ink-200">
                  {side.body.map((line, i) => (
                    <li key={i}>
                      <RichText text={line} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null,
          )}
        </div>
      );

    default:
      return null;
  }
}
