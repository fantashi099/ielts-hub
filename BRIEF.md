# BRIEF — IELTS English Hub content build

Read this before writing anything. The user's goal: a Vietnamese-first web app that
takes a learner from ~6.0 to **7.5–8.0 Academic IELTS**, covering grammar,
vocabulary and writing.

## Repository

Root: `/home/fantashi099/Workspace/Projects/Personal_Projects/english_learner`

| Path | What it is |
|---|---|
| `CONTENT_SPEC.md` | The contract: schemas, allowed values, minimum counts. **Read it fully.** |
| `lib/types.ts` | The TypeScript types your JSON must satisfy. |
| `content/manifest.json` | The full curriculum: every grammar lesson and vocabulary set with its exact slug, title, level, topic and book units. |
| `content/grammar/present-perfect-vs-past-simple.json` | **Gold-standard example.** Match this depth and tone. |
| `scripts/validate-content.mjs` | The validator. Use it constantly. |
| `sources/grammar.txt` | Extracted text of *English Grammar in Use* (5th ed., 145 units). Use `grep -n "^Unit 42" sources/grammar.txt` style lookups. |
| `sources/task1.txt` / `sources/task2.txt` | Vietnamese IELTS Writing guides (Task 1 / Task 2) by Nguyễn Hoàng Huy. Source of structure, not text to copy. |

## Hard rules

1. **Only write the files assigned to you.** Never edit app code, `package.json`,
   `lib/`, `scripts/`, `content/manifest.json`, or another agent's content files.
2. **Validate before you report:**
   ```bash
   cd /home/fantashi099/Workspace/Projects/Personal_Projects/english_learner
   node scripts/validate-content.mjs --only <path-fragment-of-your-files>
   ```
   Every `FAIL` line that mentions your files must be fixed. Zero errors from your
   scope. Warnings are acceptable but try to clear them.
3. **Never invent grammar rules.** When unsure, check `sources/grammar.txt` for the
   unit, or simplify the point. Accuracy is graded, volume is not.
4. **Paraphrase the source books.** Explain in your own words. Never paste long
   passages from *English Grammar in Use* or the writing guides.
5. **English content, Vietnamese guidance.**
   - English: lesson titles, explanations bodies, examples, definitions, essays.
   - Vietnamese: `titleVi`, `summary`, `whyItMatters`, `vi`, `ieltsTips`,
     `commonMistakes.why`, `ideaBank`, `bandBooster`, `whatItMeans`, `howToReach`.
   - Address the learner as **bạn**; keep it warm and direct, no fluff.
6. **Register:** everything an IELTS band-7.5+ candidate could actually write.
   Examples should sit in typical exam topics (education, environment, technology,
   health, society, work, government, urbanisation, media, culture).
7. **No emojis anywhere in content.** No HTML. Inline `**bold**`, `*italic*`,
   `` `code` `` only.
8. **Unique values:** slugs, exercise ids and (for vocabulary) words must not
   collide with anything already in `content/`.

## Quality bar (what makes this app worth using)

- A learner should be able to read one grammar lesson and **fix a real mistake**
  they make in essays. So: contrast the wrong and right form, name the Vietnamese
  interference, and show the IELTS sentence.
- Vocabulary entries must be *usable*: real collocations, a natural exam sentence,
  and a Vietnamese meaning precise enough to choose the word correctly.
- Writing models must be genuinely band 8: a clear position, developed paragraphs,
  varied complex sentences, precise lexis — and each model annotated so the learner
  sees *why* a sentence scores.
- Prefer fewer, sharper items over padded lists. Never pad to hit a count with
  filler; if you are short, write better content.

## Reporting back

When your task is done, mark it complete with a short summary containing:
files written, item counts, and the validator output line
(`content check — … ok`). Do not paste the whole content into your report.
