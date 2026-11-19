#!/usr/bin/env node
/**
 * Content validator — zero dependencies.
 * Run: node scripts/validate-content.mjs  (also runs before next build)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');

const grammarTopics = new Set([
  'tenses', 'modals', 'conditionals', 'passive', 'reported-speech', 'verb-patterns',
  'articles-nouns', 'pronouns-determiners', 'relative-clauses', 'adjectives-adverbs',
  'comparison', 'conjunctions', 'prepositions', 'phrasal-verbs', 'word-order', 'clauses',
]);
const vocabTopics = new Set([
  'education', 'environment', 'technology', 'health', 'society', 'economy-work',
  'government', 'media-advertising', 'culture-travel', 'urbanisation', 'family-children',
  'crime-law', 'science-research', 'globalisation', 'academic-verbs', 'academic-adjectives',
  'linking-signposting', 'describing-trends', 'collocations', 'idioms-formal',
]);
const posValues = new Set(['noun', 'verb', 'adjective', 'adverb', 'phrase', 'collocation']);
const bands = new Set(['6.5', '7.0', '7.5', '8.0']);
const levels = new Set(['B1', 'B2', 'C1']);
const blockTypes = new Set(['p', 'list', 'table', 'callout', 'quote', 'compare']);
const promptTypes = new Set([
  'opinion', 'discussion', 'advantage-disadvantage', 'problem-solution', 'two-part',
  'positive-negative', 'line-graph', 'bar-chart', 'pie-chart', 'table', 'process', 'map',
]);

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${path.relative(ROOT, file)}: ${msg}`);
const warn = (file, msg) => warnings.push(`${path.relative(ROOT, file)}: ${msg}`);

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    err(file, `invalid JSON — ${e.message}`);
    return null;
  }
};
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const isStrArr = (v, min = 0) =>
  Array.isArray(v) && v.length >= min && v.every((x) => isStr(x));
const clamp = (s, n) => (s || '').length <= n;
const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length;

function listJson(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => path.join(dir, f));
}

// ---------------------------------------------------------------- grammar ---
function validateGrammar(file, data, slugs) {
  const req = ['slug', 'title', 'titleVi', 'level', 'topic', 'bookUnits', 'bandFocus', 'summary', 'whyItMatters', 'sections', 'commonMistakes', 'ieltsTips', 'exercises'];
  for (const k of req) if (data[k] === undefined) err(file, `missing "${k}"`);
  if (!isStr(data.slug)) err(file, 'slug must be a non-empty string');
  else if (!/^[a-z0-9-]+$/.test(data.slug)) err(file, `slug "${data.slug}" must be lowercase a-z0-9-`);
  else if (slugs.has(data.slug)) err(file, `duplicate slug "${data.slug}"`);
  else slugs.add(data.slug);
  if (!levels.has(data.level)) err(file, `level "${data.level}" not in B1/B2/C1`);
  if (!grammarTopics.has(data.topic)) err(file, `topic "${data.topic}" not allowed`);
  if (!bands.has(String(data.bandFocus))) err(file, `bandFocus "${data.bandFocus}" not allowed`);
  if (!Array.isArray(data.bookUnits) || data.bookUnits.some((n) => !Number.isInteger(n) || n < 1 || n > 145))
    err(file, 'bookUnits must be integers 1..145');
  if (!clamp(data.summary, 140)) warn(file, `summary is ${data.summary.length} chars (>140)`);

  if (!Array.isArray(data.sections) || data.sections.length < 3 || data.sections.length > 5)
    err(file, `sections must have 3-5 entries (has ${data.sections?.length})`);
  let decorated = 0;
  (data.sections || []).forEach((s, i) => {
    if (!isStr(s.heading)) err(file, `sections[${i}].heading missing`);
    if (!isStrArr(s.body, 1)) err(file, `sections[${i}].body must be 1+ strings`);
    if (s.table) {
      if (!isStrArr(s.table.headers, 2)) err(file, `sections[${i}].table.headers needs 2+`);
      if (!Array.isArray(s.table.rows) || !s.table.rows.length) err(file, `sections[${i}].table.rows empty`);
      (s.table.rows || []).forEach((r, ri) => {
        if (!Array.isArray(r) || r.length !== s.table.headers.length)
          err(file, `sections[${i}].table.rows[${ri}] length must equal headers`);
      });
    }
    if (s.examples) {
      if (!Array.isArray(s.examples) || s.examples.length < 1) err(file, `sections[${i}].examples must be non-empty`);
      s.examples.forEach((ex, ei) => {
        if (!isStr(ex.right)) err(file, `sections[${i}].examples[${ei}].right missing`);
      });
    }
    if (s.examples || s.table) decorated++;
  });
  if (decorated < 2) err(file, 'at least 2 sections need examples or a table');

  if (!Array.isArray(data.commonMistakes) || data.commonMistakes.length < 3 || data.commonMistakes.length > 5)
    err(file, 'commonMistakes must have 3-5 entries');
  (data.commonMistakes || []).forEach((m, i) => {
    if (!isStr(m.wrong) || !isStr(m.right) || !isStr(m.why))
      err(file, `commonMistakes[${i}] needs wrong/right/why`);
  });
  if (!isStrArr(data.ieltsTips, 3)) err(file, 'ieltsTips needs 3+ strings');
  if (!Array.isArray(data.ieltsTips) || data.ieltsTips.length > 4) warn(file, 'ieltsTips > 4');

  const ex = data.exercises;
  if (!Array.isArray(ex) || ex.length < 8 || ex.length > 10)
    err(file, `exercises must have 8-10 items (has ${ex?.length})`);
  const ids = new Set();
  let mcq = 0, gap = 0;
  (ex || []).forEach((e, i) => {
    if (!isStr(e.id)) err(file, `exercises[${i}].id missing`);
    else if (ids.has(e.id)) err(file, `exercises[${i}].id "${e.id}" duplicate`);
    else ids.add(e.id);
    if (!isStr(e.question)) err(file, `exercises[${i}].question missing`);
    if (!isStr(e.explanation)) err(file, `exercises[${i}].explanation missing`);
    if (e.type === 'mcq') {
      mcq++;
      if (!isStrArr(e.options, 2) || e.options.length < 2)
        err(file, `exercises[${i}] mcq needs 2+ options`);
      if (!Number.isInteger(e.answerIndex) || e.answerIndex < 0 || e.answerIndex >= (e.options?.length ?? 0))
        err(file, `exercises[${i}].answerIndex out of range`);
    } else if (e.type === 'gap') {
      gap++;
      if (!isStrArr(e.answers, 1)) err(file, `exercises[${i}] gap needs answers[]`);
      else if (e.answers.some((a) => a !== a.trim() || a !== a.toLowerCase()))
        warn(file, `exercises[${i}].answers should be lowercase, untrimmed-free`);
      if (!e.question.includes('_')) warn(file, `exercises[${i}] gap question has no "___" blank`);
    } else err(file, `exercises[${i}].type "${e.type}" must be mcq|gap`);
  });
  if (mcq < 3 || gap < 3) err(file, `exercises need >=3 mcq and >=3 gap (mcq=${mcq}, gap=${gap})`);
}

// ------------------------------------------------------------- vocabulary ---
const allWords = new Map();
function validateVocab(file, data, slugs) {
  const req = ['slug', 'title', 'titleVi', 'topic', 'description', 'ieltsUse', 'words'];
  for (const k of req) if (data[k] === undefined) err(file, `missing "${k}"`);
  if (!isStr(data.slug)) err(file, 'slug must be a non-empty string');
  else if (!/^[a-z0-9-]+$/.test(data.slug)) err(file, `slug "${data.slug}" must be lowercase a-z0-9-`);
  else if (slugs.has(data.slug)) err(file, `duplicate slug "${data.slug}"`);
  else slugs.add(data.slug);
  if (!vocabTopics.has(data.topic)) err(file, `topic "${data.topic}" not allowed`);
  if (!isStr(data.description)) err(file, 'description missing');
  if (!isStr(data.ieltsUse)) err(file, 'ieltsUse missing');

  const ws = data.words;
  if (!Array.isArray(ws) || ws.length < 20 || ws.length > 30)
    err(file, `words must have 20-30 items (has ${ws?.length})`);
  const seen = new Set();
  (ws || []).forEach((w, i) => {
    const tag = `words[${i}] "${w?.word ?? '?'}"`;
    if (!isStr(w.word)) return err(file, `${tag}: word missing`);
    const key = w.word.toLowerCase().trim();
    if (seen.has(key)) err(file, `${tag}: duplicate inside set`);
    seen.add(key);
    if (allWords.has(key)) warn(file, `${tag}: also appears in ${allWords.get(key)}`);
    else allWords.set(key, data.slug);
    if (!posValues.has(w.pos)) err(file, `${tag}: pos "${w.pos}" invalid`);
    if (!bands.has(String(w.band))) err(file, `${tag}: band "${w.band}" invalid`);
    if (!isStr(w.vi)) err(file, `${tag}: vi missing`);
    if (!isStr(w.def)) err(file, `${tag}: def missing`);
    else if (words(w.def) > 22) warn(file, `${tag}: def is long (${words(w.def)} words)`);
    if (!isStr(w.example)) err(file, `${tag}: example missing`);
    else if (words(w.example) < 6) warn(file, `${tag}: example suspiciously short`);
    if (!isStrArr(w.collocations, 2)) err(file, `${tag}: collocations needs 2+`);
    if (!isStrArr(w.synonyms, 2)) err(file, `${tag}: synonyms needs 2+`);
    if (w.antonyms !== undefined && !isStrArr(w.antonyms, 1)) err(file, `${tag}: antonyms invalid`);
    if (w.family !== undefined && !isStrArr(w.family, 0)) err(file, `${tag}: family invalid`);
    if (w.ipa !== undefined && !/^\/.+\/$/.test(w.ipa)) warn(file, `${tag}: ipa should look like /ˈwɜːd/`);
    if (w.example && new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(w.example) === false)
      warn(file, `${tag}: example may not contain the word`);
  });
}

// ---------------------------------------------------------------- writing ---
function validateBlocks(file, blocks, where) {
  if (!Array.isArray(blocks) || !blocks.length) return err(file, `${where}.blocks must be non-empty`);
  blocks.forEach((b, i) => {
    const tag = `${where}.blocks[${i}]`;
    if (!blockTypes.has(b.type)) return err(file, `${tag}.type "${b.type}" invalid`);
    if (b.type === 'p' || b.type === 'callout' || b.type === 'quote') {
      if (!isStr(b.text)) err(file, `${tag}.text missing`);
    }
    if (b.type === 'callout' && !['tip', 'warn', 'info'].includes(b.tone))
      err(file, `${tag}.tone must be tip|warn|info`);
    if (b.type === 'list' && !isStrArr(b.items, 1)) err(file, `${tag}.items missing`);
    if (b.type === 'table') {
      if (!b.table || !isStrArr(b.table.headers, 2)) err(file, `${tag}.table.headers missing`);
      else (b.table.rows || []).forEach((r, ri) => {
        if (r.length !== b.table.headers.length) err(file, `${tag}.table.rows[${ri}] length mismatch`);
      });
    }
    if (b.type === 'compare') {
      if (!b.left || !b.right) err(file, `${tag} compare needs left/right`);
      else {
        if (!isStr(b.left.title) || !isStrArr(b.left.body, 1)) err(file, `${tag}.left invalid`);
        if (!isStr(b.right.title) || !isStrArr(b.right.body, 1)) err(file, `${tag}.right invalid`);
      }
    }
  });
}

function validateWriting(file, data, expectedSlug) {
  if (data.slug !== expectedSlug) err(file, `slug must be "${expectedSlug}"`);
  if (!isStr(data.title)) err(file, 'title missing');
  if (!isStr(data.titleVi)) err(file, 'titleVi missing');
  if (!isStr(data.subtitle)) err(file, 'subtitle missing');
  const minSections = expectedSlug === 'task1' ? 5 : 6;
  const maxSections = expectedSlug === 'task1' ? 8 : 9;
  if (!Array.isArray(data.sections) || data.sections.length < minSections || data.sections.length > maxSections)
    err(file, `sections must have ${minSections}-${maxSections} entries (has ${data.sections?.length})`);
  (data.sections || []).forEach((s, i) => {
    if (!isStr(s.heading)) err(file, `sections[${i}].heading missing`);
    validateBlocks(file, s.blocks, `sections[${i}]`);
  });
  const minModels = expectedSlug === 'task1' ? 5 : 6;
  if (!Array.isArray(data.models) || data.models.length < minModels)
    err(file, `models must have ${minModels}+ entries (has ${data.models?.length})`);
  const ids = new Set();
  (data.models || []).forEach((m, i) => {
    const tag = `models[${i}] "${m?.id ?? '?'}"`;
    if (!isStr(m.id)) err(file, `${tag}: id missing`);
    else if (ids.has(m.id)) err(file, `${tag}: duplicate id`);
    else ids.add(m.id);
    if (!isStr(m.prompt)) err(file, `${tag}: prompt missing`);
    if (!['7.5', '8.0'].includes(String(m.band))) err(file, `${tag}: band must be 7.5 or 8.0`);
    if (!Number.isInteger(m.wordCount)) err(file, `${tag}: wordCount must be integer`);
    else {
      const actual = words(m.essay);
      if (Math.abs(actual - m.wordCount) > 25) err(file, `${tag}: essay has ${actual} words but wordCount=${m.wordCount}`);
      const lo = expectedSlug === 'task1' ? 150 : 250;
      if (actual < lo) err(file, `${tag}: essay under ${lo} words (${actual})`);
      const hi = expectedSlug === 'task1' ? 240 : 330;
      if (actual > hi) warn(file, `${tag}: essay is ${actual} words (target < ${hi})`);
    }
    if (!isStr(m.essay)) err(file, `${tag}: essay missing`);
    if (!isStrArr(m.outline, 3)) err(file, `${tag}: outline needs 3+`);
    if (!Array.isArray(m.annotations) || m.annotations.length < 4 || m.annotations.length > 8)
      err(file, `${tag}: annotations need 4-8 (has ${m.annotations?.length})`);
    (m.annotations || []).forEach((a, ai) => {
      if (!isStr(a.quote) || !isStr(a.note)) err(file, `${tag}.annotations[${ai}] needs quote+note`);
      else if (isStr(m.essay) && !m.essay.includes(a.quote))
        err(file, `${tag}.annotations[${ai}].quote is not verbatim in essay: "${a.quote.slice(0, 60)}..."`);
    });
    if (!isStrArr(m.keyLanguage, 5)) err(file, `${tag}: keyLanguage needs 5+`);
  });
}

function validateDescriptors(file, data) {
  if (!isStr(data.title) || !isStr(data.intro)) err(file, 'title/intro missing');
  if (!Array.isArray(data.bands) || data.bands.length !== 4) err(file, 'bands must have exactly 4 criteria');
  const seen = new Set();
  (data.bands || []).forEach((b, i) => {
    ['criterion', 'criterionVi', 'weight', 'whatItMeans', 'band6', 'band7', 'band8'].forEach((k) => {
      if (!isStr(b[k])) err(file, `bands[${i}].${k} missing`);
    });
    if (!isStrArr(b.howToReach, 2)) err(file, `bands[${i}].howToReach needs 2+`);
    if (seen.has(b.criterion)) err(file, `duplicate criterion "${b.criterion}"`);
    seen.add(b.criterion);
  });
  const wanted = ['5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5'];
  const have = new Set((data.overall || []).map((o) => String(o.band)));
  wanted.forEach((w) => { if (!have.has(w)) err(file, `overall missing band ${w}`); });
}

function validatePrompts(file, data) {
  if (!Array.isArray(data) || data.length < 18 || data.length > 24)
    err(file, `prompts must be an array of 18-24 (has ${data?.length})`);
  const ids = new Set();
  let t1 = 0, t2 = 0;
  (data || []).forEach((p, i) => {
    const tag = `prompts[${i}] "${p?.id ?? '?'}"`;
    if (!isStr(p.id)) err(file, `${tag}: id missing`);
    else if (ids.has(p.id)) err(file, `${tag}: duplicate id`);
    else ids.add(p.id);
    if (!['1', '2'].includes(String(p.task))) err(file, `${tag}: task must be "1" or "2"`);
    else String(p.task) === '1' ? t1++ : t2++;
    if (!promptTypes.has(p.type)) err(file, `${tag}: type "${p.type}" invalid`);
    if (!isStr(p.prompt)) err(file, `${tag}: prompt missing`);
    if (Number(p.task) === 1 && p.type === 'opinion') err(file, `${tag}: Task 1 cannot be opinion`);
    if (!Number.isInteger(p.timeMinutes) || !Number.isInteger(p.minWords)) err(file, `${tag}: timeMinutes/minWords must be integers`);
    if (!isStrArr(p.ideaBank, 3)) err(file, `${tag}: ideaBank needs 3+`);
    if (!isStrArr(p.structure, 3)) err(file, `${tag}: structure needs 3+`);
    if (!isStrArr(p.usefulLanguage, 3)) err(file, `${tag}: usefulLanguage needs 3+`);
    if (!isStrArr(p.bandBooster, 2)) err(file, `${tag}: bandBooster needs 2+`);
  });
  if (t1 < 7 || t2 < 11) err(file, `need >=7 Task 1 and >=11 Task 2 prompts (got ${t1}/${t2})`);
}

function validatePlan(file, data, grammarSlugs, vocabSlugs) {
  if (!isStr(data.title) || !isStr(data.intro)) err(file, 'title/intro missing');
  if (!Array.isArray(data.weeks) || data.weeks.length !== 12) err(file, 'weeks must have exactly 12 entries');
  (data.weeks || []).forEach((w, i) => {
    if (w.week !== i + 1) err(file, `weeks[${i}].week must be ${i + 1}`);
    ['phase', 'theme'].forEach((k) => { if (!isStr(w[k])) err(file, `weeks[${i}].${k} missing`); });
    if (!isStrArr(w.goals, 2)) err(file, `weeks[${i}].goals needs 2+`);
    if (!Number.isFinite(w.hours)) err(file, `weeks[${i}].hours must be a number`);
    (w.grammar || []).forEach((s) => { if (!grammarSlugs.has(s)) err(file, `weeks[${i}].grammar unknown slug "${s}"`); });
    (w.vocabulary || []).forEach((s) => { if (!vocabSlugs.has(s)) err(file, `weeks[${i}].vocabulary unknown slug "${s}"`); });
  });
  if (!isStrArr(data.milestones?.map?.((m) => m.check), 3)) err(file, 'milestones need 3+');
  if (!Array.isArray(data.dailyRoutine) || !data.dailyRoutine.length) err(file, 'dailyRoutine missing');
  const total = (data.dailyRoutine || []).reduce((s, d) => s + (d.minutes || 0), 0);
  if (total < 60 || total > 180) warn(file, `dailyRoutine totals ${total} minutes (expected 90-150)`);
}

// ------------------------------------------------------------------ main ---
// `--only <substring>` validates just the files whose path contains <substring>
// so parallel content writers are not blocked by other agents' missing files.
const argIdx = process.argv.indexOf('--only');
const ONLY = argIdx !== -1 ? process.argv[argIdx + 1] : null;
const inScope = (f) => !ONLY || path.relative(ROOT, f).includes(ONLY);
/** 'validate' | 'skip' | 'missing' */
function state(f) {
  const exists = fs.existsSync(f);
  if (!inScope(f)) return 'skip';
  return exists ? 'validate' : 'missing';
}

function main() {
  const grammarSlugs = new Set();
  const vocabSlugs = new Set();

  const grammarFiles = listJson(path.join(CONTENT, 'grammar')).filter(inScope);
  if (!ONLY && grammarFiles.length < 40) warn(path.join(CONTENT, 'grammar'), `only ${grammarFiles.length} grammar lessons`);
  for (const f of grammarFiles) {
    const d = readJson(f);
    if (d) validateGrammar(f, d, grammarSlugs);
  }

  const vocabFiles = listJson(path.join(CONTENT, 'vocabulary')).filter(inScope);
  if (!ONLY && vocabFiles.length < 18) warn(path.join(CONTENT, 'vocabulary'), `only ${vocabFiles.length} vocab sets`);
  for (const f of vocabFiles) {
    const d = readJson(f);
    if (d) validateVocab(f, d, vocabSlugs);
  }

  const wDir = path.join(CONTENT, 'writing');
  const singles = [
    ['task1', (f, d) => validateWriting(f, d, 'task1')],
    ['task2', (f, d) => validateWriting(f, d, 'task2')],
    ['band-descriptors', (f, d) => validateDescriptors(f, d)],
    ['prompts', (f, d) => validatePrompts(f, d)],
  ];
  for (const [name, fn] of singles) {
    const f = path.join(wDir, `${name}.json`);
    const st = state(f);
    if (st === 'skip') continue;
    if (st === 'missing') { errors.push(`${path.relative(ROOT, f)}: missing`); continue; }
    const d = readJson(f);
    if (d) fn(f, d);
  }

  const planFile = path.join(CONTENT, 'plan.json');
  const pst = state(planFile);
  if (pst === 'missing') errors.push(`${path.relative(ROOT, planFile)}: missing`);
  else if (pst === 'validate') {
    const d = readJson(planFile);
    if (d) validatePlan(planFile, d, grammarSlugs, vocabSlugs);
  }

  const totalWords = [...allWords.keys()].length;
  console.log(`\ncontent check — grammar:${grammarSlugs.size}  vocab sets:${vocabSlugs.size}  unique words:${totalWords}`);

  for (const w of warnings) console.log(`  warn  ${w}`);
  if (errors.length) {
    console.log('');
    for (const e of errors) console.log(`  FAIL  ${e}`);
    console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)\n`);
    process.exit(1);
  }
  console.log(`  ok  ${warnings.length} warning(s)\n`);
}

main();
