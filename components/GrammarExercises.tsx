'use client';

import { useMemo, useState } from 'react';
import { useProgress } from '@/components/ProgressProvider';
import { RichText } from '@/components/RichText';
import type { GrammarExercise } from '@/lib/types';

const normalise = (value: string) =>
  value
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?,;:]+$/, '');

export function GrammarExercises({
  slug,
  exercises,
}: {
  slug: string;
  exercises: GrammarExercise[];
}) {
  const { recordLesson, state } = useProgress();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const previous = state.lessons[slug];

  const results = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const exercise of exercises) {
      if (!checked[exercise.id]) continue;
      const given = answers[exercise.id] ?? '';
      if (exercise.type === 'mcq') {
        map[exercise.id] = Number(given) === exercise.answerIndex;
      } else {
        const accepted = (exercise.answers ?? []).map(normalise);
        map[exercise.id] = accepted.includes(normalise(given));
      }
    }
    return map;
  }, [answers, checked, exercises]);

  const answeredCount = exercises.filter((exercise) => {
    const value = answers[exercise.id];
    return value !== undefined && value.trim() !== '';
  }).length;

  const score = Object.values(results).filter(Boolean).length;
  const total = exercises.length;

  const setAnswer = (id: string, value: string) => {
    if (checked[id]) return;
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const checkOne = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: true }));
  };

  const submit = () => {
    const all: Record<string, boolean> = {};
    for (const exercise of exercises) all[exercise.id] = true;
    setChecked(all);
    setSubmitted(true);

    let correct = 0;
    for (const exercise of exercises) {
      const given = answers[exercise.id] ?? '';
      if (exercise.type === 'mcq') {
        if (Number(given) === exercise.answerIndex) correct += 1;
      } else if ((exercise.answers ?? []).map(normalise).includes(normalise(given))) {
        correct += 1;
      }
    }
    recordLesson(slug, correct, exercises.length);
  };

  const retryWrong = () => {
    const wrongIds = Object.entries(results)
      .filter(([, ok]) => !ok)
      .map(([id]) => id);
    setChecked((prev) => {
      const next = { ...prev };
      for (const id of wrongIds) delete next[id];
      return next;
    });
    setAnswers((prev) => {
      const next = { ...prev };
      for (const id of wrongIds) delete next[id];
      return next;
    });
    setSubmitted(false);
  };

  const resetAll = () => {
    setAnswers({});
    setChecked({});
    setSubmitted(false);
  };

  const percent = total ? Math.round((score / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">
            Bài tập
          </h2>
          <span className="text-xs font-medium text-ink-500 dark:text-ink-400">
            {answeredCount}/{total} đã trả lời
          </span>
        </div>
        {previous ? (
          <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            Điểm cao nhất: {previous.score}/{previous.total}
          </span>
        ) : null}
      </div>

      <ol className="space-y-3">
        {exercises.map((exercise, index) => {
          const isChecked = Boolean(checked[exercise.id]);
          const ok = results[exercise.id];
          const given = answers[exercise.id] ?? '';

          return (
            <li
              key={exercise.id}
              className={`card p-5 transition ${
                isChecked
                  ? ok
                    ? 'border-emerald-300/70 dark:border-emerald-400/30'
                    : 'border-rose-300/70 dark:border-rose-400/30'
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-100 text-[11px] font-bold text-ink-600 dark:bg-white/10 dark:text-ink-200">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] leading-relaxed text-ink-800 dark:text-ink-100">
                    <RichText text={exercise.question} />
                  </p>

                  {exercise.type === 'mcq' ? (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {(exercise.options ?? []).map((option, optionIndex) => {
                        const selected = given === String(optionIndex);
                        const isRight = exercise.answerIndex === optionIndex;
                        let tone =
                          'border-ink-200 bg-white hover:border-brand-300 dark:border-white/15 dark:bg-white/[0.03]';
                        if (isChecked && isRight) {
                          tone =
                            'border-emerald-400 bg-emerald-50 dark:border-emerald-400/50 dark:bg-emerald-500/10';
                        } else if (isChecked && selected && !isRight) {
                          tone =
                            'border-rose-400 bg-rose-50 dark:border-rose-400/50 dark:bg-rose-500/10';
                        } else if (selected) {
                          tone =
                            'border-brand-500 bg-brand-50 dark:border-brand-400/60 dark:bg-brand-500/10';
                        }
                        return (
                          <button
                            key={option}
                            type="button"
                            disabled={isChecked}
                            onClick={() => setAnswer(exercise.id, String(optionIndex))}
                            className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm transition ${tone} disabled:cursor-default`}
                          >
                            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-[10px] font-bold opacity-70">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>
                            <span className="text-ink-800 dark:text-ink-100">{option}</span>
                            {isChecked && isRight ? <CheckIcon className="ml-auto text-emerald-600 dark:text-emerald-400" /> : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <input
                        value={given}
                        onChange={(event) => setAnswer(exercise.id, event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !isChecked && given.trim()) checkOne(exercise.id);
                        }}
                        readOnly={isChecked}
                        placeholder="Điền từ còn thiếu…"
                        spellCheck={false}
                        autoComplete="off"
                        aria-label={`Câu ${index + 1}`}
                        className={`w-full max-w-sm rounded-xl border px-3.5 py-2.5 text-sm outline-none transition ${
                          isChecked
                            ? ok
                              ? 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-400/50 dark:bg-emerald-500/10 dark:text-emerald-100'
                              : 'border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-400/50 dark:bg-rose-500/10 dark:text-rose-100'
                            : 'border-ink-200 bg-white text-ink-800 focus:border-brand-400 dark:border-white/15 dark:bg-white/[0.05] dark:text-white'
                        }`}
                      />
                      {!isChecked ? (
                        <button
                          type="button"
                          onClick={() => checkOne(exercise.id)}
                          disabled={!given.trim()}
                          className="btn-soft !px-3.5 !py-2"
                        >
                          Kiểm tra
                        </button>
                      ) : null}
                    </div>
                  )}

                  {!isChecked && exercise.hint ? (
                    <div className="mt-2.5">
                      {showHint[exercise.id] ? (
                        <p className="text-xs leading-relaxed text-ink-500 dark:text-ink-400">
                          <span className="font-semibold text-gold-600 dark:text-gold-300">Gợi ý: </span>
                          <RichText text={exercise.hint} />
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowHint((prev) => ({ ...prev, [exercise.id]: true }))}
                          className="text-xs font-semibold text-ink-500 underline decoration-dotted underline-offset-2 hover:text-brand-700 dark:text-ink-400 dark:hover:text-brand-300"
                        >
                          Xem gợi ý
                        </button>
                      )}
                    </div>
                  ) : null}

                  {isChecked ? (
                    <div
                      className={`mt-3 rounded-xl px-3.5 py-2.5 text-sm ${
                        ok
                          ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100'
                          : 'bg-rose-50 text-rose-900 dark:bg-rose-500/10 dark:text-rose-100'
                      }`}
                    >
                      <p className="font-semibold">
                        {ok ? 'Chính xác.' : 'Chưa đúng.'}
                        {!ok ? (
                          <span className="ml-1 font-normal">
                            Đáp án:{' '}
                            <strong>
                              {exercise.type === 'mcq'
                                ? (exercise.options ?? [])[exercise.answerIndex ?? 0]
                                : (exercise.answers ?? []).join(' / ')}
                            </strong>
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-1 leading-relaxed opacity-90">
                        <RichText text={exercise.explanation} />
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="sticky bottom-4 z-10">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink-200/80 bg-white/95 p-4 shadow-lift backdrop-blur dark:border-white/10 dark:bg-ink-900/95">
          {!submitted ? (
            <>
              <button
                type="button"
                onClick={submit}
                disabled={answeredCount === 0}
                className="btn-primary"
              >
                Nộp bài &amp; chấm điểm
              </button>
              <span className="text-sm text-ink-500 dark:text-ink-400">
                {answeredCount < total
                  ? `Còn ${total - answeredCount} câu chưa trả lời — bạn vẫn có thể nộp.`
                  : 'Đã trả lời đủ. Nộp bài để xem điểm tổng.'}
              </span>
            </>
          ) : (
            <>
              <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
                {score}/{total} · {percent}%
              </span>
              <span className="text-sm text-ink-600 dark:text-ink-300">
                {percent >= 90
                  ? 'Rất tốt — bạn đã kiểm soát chủ điểm này.'
                  : percent >= 70
                    ? 'Khá tốt. Xem lại các câu sai rồi làm lại lần nữa.'
                    : 'Hãy đọc lại phần lý thuyết và làm lại — tiến bộ đến từ phần sửa lỗi.'}
              </span>
              {score < total ? (
                <button type="button" onClick={retryWrong} className="btn-soft">
                  Làm lại câu sai
                </button>
              ) : null}
              <button type="button" onClick={resetAll} className="btn-ghost">
                Làm lại tất cả
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}
