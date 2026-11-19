import fs from 'node:fs';
import path from 'node:path';
import type {
  BandDescriptors,
  GrammarLesson,
  StudyPlan,
  VocabSet,
  WritingGuide,
  WritingPrompt,
} from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const cache = new Map<string, unknown>();

function readJsonFile<T>(file: string): T | null {
  if (!fs.existsSync(file)) return null;
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readCached<T>(key: string, file: string): T | null {
  if (cache.has(key)) return cache.get(key) as T | null;
  const data = readJsonFile<T>(file);
  cache.set(key, data);
  return data;
}

function listJson(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort();
}

/** Meta shape stored in content/manifest.json. */
export interface LessonMeta {
  slug: string;
  title: string;
  titleVi: string;
  level: GrammarLesson['level'];
  topic: GrammarLesson['topic'];
  bookUnits: number[];
  bandFocus: GrammarLesson['bandFocus'];
}

export interface VocabSetMeta {
  slug: string;
  title: string;
  titleVi: string;
  topic: VocabSet['topic'];
}

interface Manifest {
  grammar: LessonMeta[];
  vocabulary: VocabSetMeta[];
}

export function getManifest(): Manifest {
  return (
    readCached<Manifest>('manifest', path.join(CONTENT_DIR, 'manifest.json')) ?? {
      grammar: [],
      vocabulary: [],
    }
  );
}

// ------------------------------------------------------------------ grammar --

export type LessonIndexItem = LessonMeta & { ready: boolean };

export function getGrammarIndex(): LessonIndexItem[] {
  const lessons = new Map<string, GrammarLesson>();
  for (const file of listJson(path.join(CONTENT_DIR, 'grammar'))) {
    const data = readCached<GrammarLesson>(`grammar:${file}`, path.join(CONTENT_DIR, 'grammar', file));
    if (data?.slug) lessons.set(data.slug, data);
  }

  const seen = new Set<string>();
  const items: LessonIndexItem[] = [];

  for (const meta of getManifest().grammar) {
    const data = lessons.get(meta.slug);
    seen.add(meta.slug);
    items.push({ ...meta, ready: Boolean(data) });
  }
  // Any lesson file that is not in the manifest still gets an entry.
  for (const [slug, data] of lessons) {
    if (seen.has(slug)) continue;
    items.push({
      slug,
      title: data.title,
      titleVi: data.titleVi,
      level: data.level,
      topic: data.topic,
      bookUnits: data.bookUnits,
      bandFocus: data.bandFocus,
      ready: true,
    });
  }
  return items;
}

export function getGrammarLessons(): GrammarLesson[] {
  const out: GrammarLesson[] = [];
  for (const item of getGrammarIndex()) {
    if (!item.ready) continue;
    const lesson = getGrammarLesson(item.slug);
    if (lesson) out.push(lesson);
  }
  return out;
}

export function getGrammarLesson(slug: string): GrammarLesson | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  return readCached<GrammarLesson>(
    `grammar:${slug}.json`,
    path.join(CONTENT_DIR, 'grammar', `${slug}.json`),
  );
}

// --------------------------------------------------------------- vocabulary --

export type VocabSetIndexItem = VocabSetMeta & { ready: boolean; wordCount: number };

export function getVocabSets(): VocabSet[] {
  const out: VocabSet[] = [];
  for (const item of getVocabIndex()) {
    if (!item.ready) continue;
    const set = getVocabSet(item.slug);
    if (set) out.push(set);
  }
  return out;
}

export function getVocabIndex(): VocabSetIndexItem[] {
  const sets = new Map<string, VocabSet>();
  for (const file of listJson(path.join(CONTENT_DIR, 'vocabulary'))) {
    const data = readCached<VocabSet>(
      `vocab:${file}`,
      path.join(CONTENT_DIR, 'vocabulary', file),
    );
    if (data?.slug) sets.set(data.slug, data);
  }

  const seen = new Set<string>();
  const items: VocabSetIndexItem[] = [];
  for (const meta of getManifest().vocabulary) {
    const data = sets.get(meta.slug);
    seen.add(meta.slug);
    items.push({
      ...meta,
      ready: Boolean(data),
      wordCount: data?.words?.length ?? 0,
    });
  }
  for (const [slug, data] of sets) {
    if (seen.has(slug)) continue;
    items.push({
      slug,
      title: data.title,
      titleVi: data.titleVi,
      topic: data.topic,
      ready: true,
      wordCount: data.words?.length ?? 0,
    });
  }
  return items;
}

export function getVocabSet(slug: string): VocabSet | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  return readCached<VocabSet>(
    `vocab:${slug}.json`,
    path.join(CONTENT_DIR, 'vocabulary', `${slug}.json`),
  );
}

// ------------------------------------------------------------------ writing --

export function getWritingGuide(slug: 'task1' | 'task2'): WritingGuide | null {
  return readCached<WritingGuide>(
    `writing:${slug}`,
    path.join(CONTENT_DIR, 'writing', `${slug}.json`),
  );
}

export function getBandDescriptors(): BandDescriptors | null {
  return readCached<BandDescriptors>(
    'band-descriptors',
    path.join(CONTENT_DIR, 'writing', 'band-descriptors.json'),
  );
}

export function getPrompts(): WritingPrompt[] {
  return (
    readCached<WritingPrompt[]>(
      'prompts',
      path.join(CONTENT_DIR, 'writing', 'prompts.json'),
    ) ?? []
  );
}

// --------------------------------------------------------------------- plan --

export function getPlan(): StudyPlan | null {
  return readCached<StudyPlan>('plan', path.join(CONTENT_DIR, 'plan.json'));
}

// -------------------------------------------------------------------- stats --

export interface ContentStats {
  grammarTotal: number;
  grammarReady: number;
  vocabTotal: number;
  vocabReady: number;
  vocabWords: number;
  models: number;
  prompts: number;
  /** Guides + model essays: the units the learner can mark as read/practised. */
  writingUnits: number;
}

export function getStats(): ContentStats {
  const grammar = getGrammarIndex();
  const vocab = getVocabIndex();
  const models = ['task1', 'task2'].reduce(
    (n, slug) => n + (getWritingGuide(slug as 'task1' | 'task2')?.models.length ?? 0),
    0,
  );
  return {
    grammarTotal: grammar.length,
    grammarReady: grammar.filter((l) => l.ready).length,
    vocabTotal: vocab.length,
    vocabReady: vocab.filter((v) => v.ready).length,
    vocabWords: vocab.reduce((n, v) => n + v.wordCount, 0),
    models,
    prompts: getPrompts().length,
    writingUnits: models + 3,
  };
}

// ------------------------------------------------------------- presentation --

export { LEVEL_LABEL, TOPIC_LABEL } from './labels';
