# Content spec — IELTS English Hub

All learning content is plain JSON in `/content`, validated by
`node scripts/validate-content.mjs` (runs before every build). Types live in
`lib/types.ts`. **Never write outside your assigned files.**

## Rules that apply to every file

1. **UTF-8, 2-space indent, valid JSON only.** No comments, no trailing commas.
2. **Language:** UI/labels Vietnamese is handled by the app. Content is:
   - `titleVi`, `vi`, `description`, `summary` → Vietnamese (natural, friendly, "bạn").
   - `title`, `def`, `example`, `body`, `why`, `explanation` → English.
   - `whyItMatters`, `ieltsTips`, `ideaBank`, `bandBooster`, `howToReach` → Vietnamese
     explanation **with English keywords in backticks**.
3. **Accuracy over volume.** Never invent a rule. If unsure, use a simpler, safer
   explanation. Examples must be natural, exam-appropriate English.
4. **Band-7.5+ register.** No baby sentences. Every example ties to IELTS tasks
   (education, environment, technology, society, work, health, government…).
5. Inline markup allowed in body text: `**bold**`, `*italic*`, `` `code` ``.
6. IDs/slugs are lowercase ASCII, hyphen-separated, globally unique.
7. No emojis inside content strings (the UI adds icons).
8. Avoid quoting long passages from the source books. Rewrite in your own words.

## Grammar lesson — `content/grammar/<slug>.json`

```json
{
  "slug": "present-perfect-vs-past-simple",
  "title": "Present perfect vs past simple",
  "titleVi": "Hiện tại hoàn thành và quá khứ đơn",
  "level": "B1",
  "topic": "tenses",
  "bookUnits": [7, 8, 13, 14],
  "bandFocus": "7.0",
  "summary": "Vietnamese one-liner shown on cards (max ~110 chars).",
  "whyItMatters": "Vietnamese: why this point costs marks at band 6-7.",
  "sections": [
    {
      "heading": "Form",
      "body": ["Paragraph 1 with **bold** key words.", "Paragraph 2."],
      "table": { "headers": ["Aspect", "Present perfect", "Past simple"], "rows": [["Time", "unspecified", "finished + time given"]] },
      "examples": [
        { "right": "I have lived in Hanoi for ten years.", "wrong": "I have lived in Hanoi in 2015.", "note": "Use past simple with a finished time." }
      ]
    }
  ],
  "commonMistakes": [
    { "wrong": "I have seen him yesterday.", "right": "I saw him yesterday.", "why": "Vietnamese-style time thinking…" }
  ],
  "ieltsTips": ["Use **present perfect** when describing a trend that continues into now: *Rents have risen sharply since 2010.*"],
  "exercises": [
    { "id": "ex1", "type": "mcq", "question": "By 2030, the city ___ its transport budget twice.", "options": ["doubled", "has doubled", "will have doubled", "was doubling"], "answerIndex": 2, "explanation": "**By 2030** marks a deadline → future perfect." },
    { "id": "ex2", "type": "gap", "question": "She ___ (work) here since 2019.", "answers": ["has worked", "has been working"], "hint": "present perfect", "explanation": "**since + point in time** → present perfect (continuous is also natural with work)." }
  ]
}
```

Requirements per lesson:

| field | rule |
|---|---|
| `sections` | 3–5 sections; each `body` 1–4 paragraphs; at least 2 sections carry `examples` or a `table` |
| `examples` | 2–4 per section that has them; `wrong` optional but encouraged |
| `commonMistakes` | 3–5 entries |
| `ieltsTips` | 3–4 entries, each concrete and usable in an essay |
| `exercises` | 8–10 items, mixed `mcq` + `gap` (≥3 of each), all answers verified |
| `answers` (gap) | 1–3 accepted variants, lowercase, no punctuation; contractions where natural ("hasn't worked") |

Allowed `level`: `B1` `B2` `C1`. Allowed `bandFocus`: `6.5` `7.0` `7.5` `8.0`.
Allowed `topic`: tenses, modals, conditionals, passive, reported-speech,
verb-patterns, articles-nouns, pronouns-determiners, relative-clauses,
adjectives-adverbs, comparison, conjunctions, prepositions, phrasal-verbs,
word-order, clauses.

## Vocabulary set — `content/vocabulary/<slug>.json`

```json
{
  "slug": "environment-core",
  "title": "Environment — core set",
  "titleVi": "Môi trường — bộ từ cốt lõi",
  "topic": "environment",
  "description": "Vietnamese sentence: what this set gives you and where to use it.",
  "ieltsUse": "Vietnamese: which Task 2 topics / Task 1 language it powers.",
  "words": [
    {
      "word": "mitigate",
      "pos": "verb",
      "ipa": "/ˈmɪtɪɡeɪt/",
      "band": "7.5",
      "vi": "giảm nhẹ, làm dịu bớt",
      "def": "to make something bad less severe or harmful",
      "example": "Planting trees can mitigate the effects of urban heat.",
      "collocations": ["mitigate the impact", "mitigate the risk", "mitigate climate change"],
      "synonyms": ["alleviate", "reduce", "lessen"],
      "antonyms": ["aggravate", "worsen"],
      "family": ["mitigation (n)", "mitigating (adj)"]
    }
  ]
}
```

Requirements:

- `words`: **20–30** per set, no duplicates inside a set or across sets.
- `pos` ∈ noun, verb, adjective, adverb, phrase, collocation.
- `band` ∈ 6.5, 7.0, 7.5, 8.0 — spread realistically: mostly 7.0/7.5, a few 6.5
  essentials, 4–8 at 8.0.
- `ipa` British IPA, with slashes. Skip only if genuinely variable.
- `def` ≤ 18 words, learner-dictionary style, no circular definitions.
- `example` 8–22 words, IELTS-topic sentence, shows the word in a natural pattern.
- `collocations` 2–4, `synonyms` 2–3, `family` 0–3, `antonyms` optional.
- No topic word repeated across sets — the validator rejects duplicates.

Allowed topics: education, environment, technology, health, society, economy-work,
government, media-advertising, culture-travel, urbanisation, family-children,
crime-law, science-research, globalisation, academic-verbs, academic-adjectives,
linking-signposting, describing-trends, collocations, idioms-formal.

## Writing guide — `content/writing/task1.json`, `task2.json`

```json
{
  "slug": "task2",
  "title": "Writing Task 2 — the band 8 essay",
  "titleVi": "Writing Task 2 — bài luận band 8",
  "subtitle": "Vietnamese subtitle line.",
  "sections": [
    {
      "heading": "Question types",
      "intro": "Optional lead-in.",
      "blocks": [
        { "type": "p", "text": "Paragraph with **bold**." },
        { "type": "list", "items": ["First", "Second"], "ordered": false },
        { "type": "table", "table": { "headers": ["Type", "Task"], "rows": [["Opinion", "agree/disagree + why"]] } },
        { "type": "callout", "tone": "warn", "text": "Overgeneralising loses Task Response marks." },
        { "type": "compare", "left": { "title": "Band 6", "body": ["…"] }, "right": { "title": "Band 8", "body": ["…"] } }
      ]
    }
  ],
  "models": [
    {
      "id": "t2-opinion-1",
      "prompt": "Some people believe that… Discuss both views and give your opinion.",
      "band": "8.0",
      "wordCount": 285,
      "essay": "Full essay as one string with \\n\\n between paragraphs.",
      "outline": ["Introduction — paraphrase + thesis", "Body 1 — view A", "Body 2 — view B", "Conclusion — opinion"],
      "annotations": [{ "quote": "exact sentence from the essay", "note": "Vietnamese: why this earns marks" }],
      "keyLanguage": ["a compelling argument", "it is arguable that…"]
    }
  ]
}
```

Requirements:

- `task1`: **5–8 sections**, **5 models** (line graph, bar chart, pie/table combo,
  process, map). Each model 160–220 words, `band` 7.5 or 8.0.
- `task2`: **6–9 sections**, **6 models** covering opinion, discussion
  (both views), advantage–disadvantage, problem–solution, two-part, and one
  "outweigh" question. Each 270–310 words.
- Every model needs 4–8 `annotations` whose `quote` appears **verbatim** in the
  essay (validator checks this), and 5–8 `keyLanguage` items.
- Covers requirement: the learner must be able to reach 7.5–8.0, so explain
  *why* language scores, not just list phrases.

## Band descriptors — `content/writing/band-descriptors.json`

```json
{
  "title": "IELTS Writing band descriptors, decoded",
  "intro": "Vietnamese intro.",
  "bands": [
    {
      "criterion": "Task Response",
      "criterionVi": "Đáp ứng đề bài",
      "weight": "Task 2: 25%",
      "whatItMeans": "Vietnamese explanation.",
      "band6": "English summary of band 6 behaviour.",
      "band7": "…",
      "band8": "…",
      "howToReach": ["Vietnamese action 1", "…"]
    }
  ],
  "overall": [{ "band": "6.0", "description": "Vietnamese" }]
}
```

Exactly 4 criteria; `overall` covers 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5.

## Prompts — `content/writing/prompts.json`

Array of 18–24 prompts: ~8 Task 1 (mixed types) and ~14 Task 2 (mixed types).

```json
[{
  "id": "t2-edu-01",
  "task": "2",
  "type": "discussion",
  "prompt": "Full exam-style question.",
  "timeMinutes": 40,
  "minWords": 250,
  "ideaBank": ["Vietnamese/English mixed ideas — 4 to 6"],
  "structure": ["Intro — paraphrase + both views preview", "…"],
  "usefulLanguage": ["…5–8 phrases…"],
  "bandBooster": ["Vietnamese: what separates 7 from 8 here"]
}]
```

Types allowed: opinion, discussion, advantage-disadvantage, problem-solution,
two-part, positive-negative, line-graph, bar-chart, pie-chart, table, process, map.
Task 1 → 20 minutes / 150 words. Task 2 → 40 minutes / 250 words.

## Study plan — `content/plan.json`

```json
{
  "title": "Lộ trình 12 tuần từ 6.0 lên 7.5–8.0",
  "intro": "Vietnamese.",
  "weeks": [{ "week": 1, "phase": "Foundation", "theme": "…", "goals": ["…"], "grammar": ["lesson-slug"], "vocabulary": ["set-slug"], "writing": ["task1"], "hours": 8 }],
  "dailyRoutine": [{ "block": "Morning", "minutes": 20, "detail": "…" }],
  "milestones": [{ "week": 4, "check": "…" }]
}
```

`weeks` = 12. `grammar`/`vocabulary` values must be **existing slugs** —
the validator cross-checks. `dailyRoutine` totals 90–150 minutes.
