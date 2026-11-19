import type { ReactNode } from 'react';

const TOKEN = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`)/g;

/** Renders the light inline markup used across content: **bold**, *italic*, `code`. */
export function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(TOKEN).filter((part) => part !== '');
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const key = `${i}-${part.slice(0, 8)}`;
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={key} className="font-semibold text-ink-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={key}
              className="rounded-md bg-ink-100 px-1.5 py-0.5 font-mono text-[0.9em] text-brand-700 dark:bg-white/10 dark:text-brand-200"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <em key={key} className="italic">
              {part.slice(1, -1)}
            </em>
          );
        }
        return <span key={key}>{part}</span>;
      })}
    </span>
  );
}

export function LevelBadge({ level }: { level: string }) {
  const tone =
    level === 'C1'
      ? 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-200'
      : level === 'B2'
        ? 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-200'
        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200';
  return <span className={`badge ${tone}`}>{level}</span>;
}

export function BandBadge({ band }: { band: string }) {
  return (
    <span className="badge bg-gold-100 text-gold-600 dark:bg-gold-400/15 dark:text-gold-300">
      Band {band}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="badge bg-ink-100 text-ink-600 dark:bg-white/10 dark:text-ink-200">
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl dark:text-white">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function ProgressBar({ percent, className = '' }: { percent: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/10 ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-[width] duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function Stat({
  value,
  label,
  hint,
}: {
  value: ReactNode;
  label: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-ink-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="font-display text-2xl font-semibold text-ink-900 dark:text-white">{value}</div>
      <div className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </div>
      {hint ? <div className="mt-1 text-xs text-ink-500 dark:text-ink-400">{hint}</div> : null}
    </div>
  );
}

export function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-ink-300/70 bg-white/50 px-6 py-12 text-center dark:border-white/15 dark:bg-white/[0.02]">
      <span className="badge mb-3 bg-gold-100 text-gold-600 dark:bg-gold-400/15 dark:text-gold-300">
        Đang biên soạn
      </span>
      <p className="max-w-md text-sm text-ink-600 dark:text-ink-300">{label}</p>
    </div>
  );
}
