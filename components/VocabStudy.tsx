'use client';

import { useMemo, useState } from 'react';
import { useProgress } from '@/components/ProgressProvider';
import { RichText } from '@/components/RichText';
import { ProgressBar } from '@/components/RichText';
import { wordKey, type WordStatus } from '@/lib/progress';
import type { VocabSet, VocabWord } from '@/lib/types';

const POS_LABEL: Record<VocabWord['pos'], string> = {
  noun: 'danh từ',
  verb: 'động từ',
  adjective: 'tính từ',
  adverb: 'trạng từ',
  phrase: 'cụm từ',
  collocation: 'kết hợp từ',
};

type Mode = 'list' | 'flash' | 'quiz';

export function VocabStudy({ set }: { set: VocabSet }) {
  const { state, setWord, ready } = useProgress();
  const [mode, setMode] = useState<Mode>('list');

  const statusOf = (word: string): WordStatus | undefined => state.words[wordKey(set.slug, word)];
  const knownCount = set.words.filter((w) => statusOf(w.word) === 'known').length;
  const learningCount = set.words.filter((w) => statusOf(w.word) === 'learning').length;

  const toggle = (word: string, next: WordStatus) => {
    setWord(set.slug, word, statusOf(word) === next ? null : next);
  };

  return (
    <div className="space-y-5">
      <div className="card flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2 rounded-full bg-ink-100 p-1 dark:bg-white/[0.06]">
          {(
            [
              ['list', 'Danh sách'],
              ['flash', 'Flashcard'],
              ['quiz', 'Trắc nghiệm'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                mode === value
                  ? 'bg-white text-ink-900 shadow-soft dark:bg-white/15 dark:text-white'
                  : 'text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-ink-600 dark:text-ink-300">
          <span>
            <strong className="font-semibold text-emerald-600 dark:text-emerald-400">{knownCount}</strong>{' '}
            đã thuộc
          </span>
          <span>
            <strong className="font-semibold text-gold-600 dark:text-gold-400">{learningCount}</strong>{' '}
            đang học
          </span>
          <span className="text-ink-400 dark:text-ink-500">/ {set.words.length} từ</span>
        </div>
      </div>

      <ProgressBar percent={ready && set.words.length ? Math.round((knownCount / set.words.length) * 100) : 0} />

      {mode === 'list' ? (
        <WordList set={set} statusOf={statusOf} toggle={toggle} />
      ) : mode === 'flash' ? (
        <Flashcards set={set} statusOf={statusOf} toggle={toggle} />
      ) : (
        <Quiz set={set} />
      )}
    </div>
  );
}

function WordList({
  set,
  statusOf,
  toggle,
}: {
  set: VocabSet;
  statusOf: (word: string) => WordStatus | undefined;
  toggle: (word: string, next: WordStatus) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'new' | 'learning' | 'known'>('all');

  const words = set.words.filter((word) => {
    const status = statusOf(word.word);
    if (filter === 'new') return !status;
    if (filter === 'learning') return status === 'learning';
    if (filter === 'known') return status === 'known';
    return true;
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ['all', `Tất cả (${set.words.length})`],
            ['new', 'Chưa học'],
            ['learning', 'Đang học'],
            ['known', 'Đã thuộc'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`chip ${filter === value ? 'chip-active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {words.map((word) => {
          const status = statusOf(word.word);
          return (
            <li
              key={word.word}
              className={`card p-4 transition ${
                status === 'known'
                  ? 'border-emerald-300/70 dark:border-emerald-400/30'
                  : status === 'learning'
                    ? 'border-gold-300/70 dark:border-gold-400/30'
                    : ''
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">
                      {word.word}
                    </h3>
                    {word.ipa ? (
                      <span className="font-mono text-xs text-ink-500 dark:text-ink-400">{word.ipa}</span>
                    ) : null}
                    <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-600 dark:bg-white/10 dark:text-ink-300">
                      {POS_LABEL[word.pos]}
                    </span>
                    <span className="rounded-md bg-gold-100 px-1.5 py-0.5 text-[10px] font-semibold text-gold-600 dark:bg-gold-400/15 dark:text-gold-300">
                      {word.band}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-ink-800 dark:text-ink-100">{word.vi}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                    <RichText text={word.def} />
                  </p>
                  <p className="mt-1.5 text-sm italic leading-relaxed text-ink-600 dark:text-ink-300">
                    “{word.example}”
                  </p>

                  <details className="group mt-2.5">
                    <summary className="cursor-pointer list-none text-xs font-semibold text-ink-500 hover:text-brand-700 dark:text-ink-400 dark:hover:text-brand-300">
                      Collocation, từ đồng nghĩa, họ từ
                    </summary>
                    <div className="mt-2 grid gap-2 text-[13px] sm:grid-cols-2">
                      <InfoRow label="Collocation" items={word.collocations} />
                      <InfoRow label="Đồng nghĩa" items={word.synonyms} />
                      {word.antonyms?.length ? <InfoRow label="Trái nghĩa" items={word.antonyms} /> : null}
                      {word.family?.length ? <InfoRow label="Họ từ" items={word.family} /> : null}
                    </div>
                  </details>
                </div>

                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggle(word.word, 'learning')}
                    aria-pressed={status === 'learning'}
                    title="Đánh dấu đang học"
                    className={`grid h-8 w-8 place-items-center rounded-full border transition ${
                      status === 'learning'
                        ? 'border-gold-400 bg-gold-100 text-gold-600 dark:bg-gold-400/20 dark:text-gold-300'
                        : 'border-ink-200 text-ink-400 hover:border-gold-300 hover:text-gold-600 dark:border-white/15 dark:text-ink-400'
                    }`}
                  >
                    <BookmarkIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggle(word.word, 'known')}
                    aria-pressed={status === 'known'}
                    title="Đánh dấu đã thuộc"
                    className={`grid h-8 w-8 place-items-center rounded-full border transition ${
                      status === 'known'
                        ? 'border-emerald-400 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                        : 'border-ink-200 text-ink-400 hover:border-emerald-300 hover:text-emerald-600 dark:border-white/15 dark:text-ink-400'
                    }`}
                  >
                    <CheckIcon />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {words.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-500 dark:text-ink-400">
          Không có từ nào trong nhóm này.
        </p>
      ) : null}
    </div>
  );
}

function InfoRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400 dark:text-ink-500">
        {label}
      </p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md bg-ink-50 px-1.5 py-0.5 text-[12px] text-ink-700 dark:bg-white/[0.06] dark:text-ink-200"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Flashcards({
  set,
  statusOf,
  toggle,
}: {
  set: VocabSet;
  statusOf: (word: string) => WordStatus | undefined;
  toggle: (word: string, next: WordStatus) => void;
}) {
  const deck = useMemo(
    () => set.words.filter((word) => statusOf(word.word) !== 'known'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [set, statusOf],
  );
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const card = deck[index];

  if (!card) {
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-lg font-semibold text-ink-900 dark:text-white">
          Bạn đã thuộc cả {set.words.length} từ của bộ này.
        </p>
        <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
          Quay lại danh sách để ôn lại, hoặc chuyển sang bộ từ khác.
        </p>
        <a href="/vocabulary" className="btn-soft mt-4">
          Chọn bộ khác
        </a>
      </div>
    );
  }

  const advance = (status: WordStatus | null) => {
    if (status) toggle(card.word, status);
    setRevealed(false);
    setIndex((prev) => (prev + 1 < deck.length ? prev + 1 : 0));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center justify-between text-xs font-medium text-ink-500 dark:text-ink-400">
        <span>
          Thẻ {index + 1}/{deck.length} (chưa thuộc)
        </span>
        <span>Bấm vào thẻ để xem nghĩa</span>
      </div>

      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        className="card flex min-h-[280px] w-full flex-col items-center justify-center p-8 text-center transition hover:border-brand-300 dark:hover:border-brand-400/40"
      >
        <span className="font-display text-3xl font-semibold text-ink-900 dark:text-white">
          {card.word}
        </span>
        {card.ipa ? (
          <span className="mt-1.5 font-mono text-sm text-ink-500 dark:text-ink-400">{card.ipa}</span>
        ) : null}

        {revealed ? (
          <span className="mt-5 block max-w-lg">
            <span className="block text-base font-semibold text-brand-700 dark:text-brand-300">
              {card.vi}
            </span>
            <span className="mt-2 block text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              <RichText text={card.def} />
            </span>
            <span className="mt-3 block text-sm italic text-ink-600 dark:text-ink-300">
              “{card.example}”
            </span>
          </span>
        ) : (
          <span className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-ink-400 dark:text-ink-500">
            Nhấn để xem nghĩa
          </span>
        )}
      </button>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => advance('learning')}
          className="btn-ghost border-gold-300 text-gold-700 hover:bg-gold-50 dark:border-gold-400/40 dark:text-gold-300"
        >
          Chưa nhớ
        </button>
        <button type="button" onClick={() => advance(null)} className="btn-ghost">
          Bỏ qua
        </button>
        <button
          type="button"
          onClick={() => advance('known')}
          className="btn-primary !bg-emerald-600 hover:!bg-emerald-700 dark:!bg-emerald-500"
        >
          Đã nhớ
        </button>
      </div>
    </div>
  );
}

function Quiz({ set }: { set: VocabSet }) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const question = useMemo(() => {
    const pool = [...set.words];
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const correct = pool[0];
    const distractors = pool.slice(1, 4);
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    return { correct, options };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [set, round]);

  const totalRounds = 10;

  const pick = (word: VocabWord) => {
    if (picked) return;
    setPicked(word.word);
    if (word.word === question.correct.word) setScore((s) => s + 1);
  };

  const next = () => {
    if (round + 1 >= totalRounds) {
      setDone(true);
      return;
    }
    setRound((r) => r + 1);
    setPicked(null);
  };

  if (done) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">
          Kết quả
        </p>
        <p className="mt-2 font-display text-4xl font-semibold text-ink-900 dark:text-white">
          {score}/{totalRounds}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
          {score >= 9
            ? 'Bạn đã nắm rất chắc bộ từ này. Hãy dùng chúng trong một bài writing.'
            : score >= 7
              ? 'Khá tốt. Ôn lại những từ vừa chọn sai rồi thử lại.'
              : 'Nên quay lại chế độ Flashcard để nhớ nghĩa trước, rồi làm lại bài này.'}
        </p>
        <button
          type="button"
          onClick={() => {
            setRound(0);
            setScore(0);
            setPicked(null);
            setDone(false);
          }}
          className="btn-primary mt-5"
        >
          Làm lại
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center justify-between text-xs font-medium text-ink-500 dark:text-ink-400">
        <span>
          Câu {round + 1}/{totalRounds}
        </span>
        <span>Đúng: {score}</span>
      </div>
      <ProgressBar percent={(round / totalRounds) * 100} />

      <div className="card mt-4 p-6">
        <p className="text-center font-display text-2xl font-semibold text-ink-900 dark:text-white">
          {question.correct.word}
        </p>
        <p className="mt-1 text-center text-xs text-ink-500 dark:text-ink-400">
          Nghĩa tiếng Việt của từ này là gì?
        </p>

        <div className="mt-5 grid gap-2">
          {question.options.map((option) => {
            const isCorrect = option.word === question.correct.word;
            const isPicked = picked === option.word;
            let tone =
              'border-ink-200 bg-white hover:border-brand-300 dark:border-white/15 dark:bg-white/[0.03]';
            if (picked && isCorrect) {
              tone =
                'border-emerald-400 bg-emerald-50 dark:border-emerald-400/50 dark:bg-emerald-500/10';
            } else if (picked && isPicked) {
              tone = 'border-rose-400 bg-rose-50 dark:border-rose-400/50 dark:bg-rose-500/10';
            }
            return (
              <button
                key={option.word}
                type="button"
                disabled={Boolean(picked)}
                onClick={() => pick(option)}
                className={`rounded-xl border px-4 py-3 text-left text-sm text-ink-800 transition ${tone} dark:text-ink-100`}
              >
                {option.vi}
              </button>
            );
          })}
        </div>

        {picked ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-600 dark:text-ink-300">
              {picked === question.correct.word ? 'Chính xác.' : `Đáp án đúng: ${question.correct.vi}`}
            </p>
            <button type="button" onClick={next} className="btn-primary !px-4 !py-2">
              {round + 1 >= totalRounds ? 'Xem kết quả' : 'Câu tiếp'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 4h12v17l-6-4-6 4Z" />
    </svg>
  );
}
