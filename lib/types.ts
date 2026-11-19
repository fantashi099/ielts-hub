// -----------------------------------------------------------------------------
// Content contracts. Every JSON file in /content must satisfy these types.
// The validator (scripts/validate-content.mjs) mirrors these rules at build time.
// -----------------------------------------------------------------------------

export type Level = 'B1' | 'B2' | 'C1';
export type Band = '6.5' | '7.0' | '7.5' | '8.0';

export type GrammarTopic =
  | 'tenses'
  | 'modals'
  | 'conditionals'
  | 'passive'
  | 'reported-speech'
  | 'verb-patterns'
  | 'articles-nouns'
  | 'pronouns-determiners'
  | 'relative-clauses'
  | 'adjectives-adverbs'
  | 'comparison'
  | 'conjunctions'
  | 'prepositions'
  | 'phrasal-verbs'
  | 'word-order'
  | 'clauses';

/** Inline markup allowed inside body text: **bold**, *italic*, `code`. */
export type RichText = string;

export interface GrammarSection {
  heading: string;
  body: RichText[];
  table?: { headers: string[]; rows: string[][] };
  examples?: { right: string; wrong?: string; note?: string }[];
}

export interface GrammarExercise {
  id: string;
  type: 'mcq' | 'gap';
  question: string;
  /** mcq only */
  options?: string[];
  answerIndex?: number;
  /** gap only: accepted answers (normalised, case-insensitive) */
  answers?: string[];
  hint?: string;
  explanation: string;
}

export interface GrammarLesson {
  slug: string;
  title: string;
  titleVi: string;
  level: Level;
  topic: GrammarTopic;
  /** Units in English Grammar in Use (5th ed.) this lesson draws on. */
  bookUnits: number[];
  bandFocus: Band;
  summary: string;
  whyItMatters: string;
  sections: GrammarSection[];
  commonMistakes: { wrong: string; right: string; why: string }[];
  ieltsTips: string[];
  exercises: GrammarExercise[];
}

// -----------------------------------------------------------------------------
// Vocabulary
// -----------------------------------------------------------------------------

export type VocabTopic =
  | 'education'
  | 'environment'
  | 'technology'
  | 'health'
  | 'society'
  | 'economy-work'
  | 'government'
  | 'media-advertising'
  | 'culture-travel'
  | 'urbanisation'
  | 'family-children'
  | 'crime-law'
  | 'science-research'
  | 'globalisation'
  | 'academic-verbs'
  | 'academic-adjectives'
  | 'linking-signposting'
  | 'describing-trends'
  | 'collocations'
  | 'idioms-formal';

export interface VocabWord {
  word: string;
  pos: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'collocation';
  ipa?: string;
  band: Band;
  /** Vietnamese meaning */
  vi: string;
  /** English definition (learner-friendly dictionary style) */
  def: string;
  example: string;
  collocations: string[];
  synonyms: string[];
  antonyms?: string[];
  family?: string[];
}

export interface VocabSet {
  slug: string;
  title: string;
  titleVi: string;
  topic: VocabTopic;
  description: string;
  ieltsUse: string;
  words: VocabWord[];
}

// -----------------------------------------------------------------------------
// Writing
// -----------------------------------------------------------------------------

export interface WritingBlock {
  type: 'p' | 'list' | 'table' | 'callout' | 'quote' | 'compare';
  text?: RichText;
  items?: string[];
  ordered?: boolean;
  table?: { headers: string[]; rows: string[][] };
  tone?: 'tip' | 'warn' | 'info';
  /** for compare blocks */
  left?: { title: string; body: string[] };
  right?: { title: string; body: string[] };
}

export interface WritingSection {
  heading: string;
  intro?: RichText;
  blocks: WritingBlock[];
}

export interface ModelAnswer {
  id: string;
  prompt: string;
  /** Short description of the chart/diagram for Task 1. */
  visual?: string;
  band: '7.5' | '8.0';
  wordCount: number;
  essay: string;
  outline: string[];
  annotations: { quote: string; note: string }[];
  keyLanguage: string[];
}

export interface WritingGuide {
  slug: 'task1' | 'task2';
  title: string;
  titleVi: string;
  subtitle: string;
  sections: WritingSection[];
  models: ModelAnswer[];
}

export interface BandDescriptorRow {
  criterion: string;
  criterionVi: string;
  weight: string;
  whatItMeans: string;
  band6: string;
  band7: string;
  band8: string;
  howToReach: string[];
}

export interface BandDescriptors {
  title: string;
  /** Vietnamese title shown as the page heading. */
  titleVi?: string;
  intro: string;
  bands: BandDescriptorRow[];
  overall: { band: string; description: string }[];
}

export type WritingTaskType =
  | 'opinion'
  | 'discussion'
  | 'advantage-disadvantage'
  | 'problem-solution'
  | 'two-part'
  | 'positive-negative'
  | 'line-graph'
  | 'bar-chart'
  | 'pie-chart'
  | 'table'
  | 'process'
  | 'map';

export interface WritingPrompt {
  id: string;
  task: '1' | '2';
  type: WritingTaskType;
  prompt: string;
  timeMinutes: number;
  minWords: number;
  /** Guided ideas so the learner never faces a blank page. */
  ideaBank: string[];
  structure: string[];
  usefulLanguage: string[];
  bandBooster: string[];
}

// -----------------------------------------------------------------------------
// Study plan
// -----------------------------------------------------------------------------

export interface PlanWeek {
  week: number;
  phase: string;
  theme: string;
  goals: string[];
  grammar: string[];
  vocabulary: string[];
  writing: string[];
  hours: number;
}

export interface StudyPlan {
  title: string;
  intro: string;
  weeks: PlanWeek[];
  dailyRoutine: { block: string; minutes: number; detail: string }[];
  milestones: { week: number; check: string }[];
}
