---
name: FinGPT pilot verdict — DROP spend, redirect to filter fix (2026-04-18)
description: Week 3 FinGPT sprint killed before endpoint spend; the seed exposed classifier noise/ticker-collision leakage as the higher-leverage problem
type: project
originSessionId: b9d88e96-eb38-45d4-b094-c0b588a6ad1e
---
Week 3 (FinGPT) of the 30-day repo-evaluation plan was killed before any hosted-inference spend. The pilot's own seed-quality audit exposed a more important finding upstream.

**Why killed:**
- Day 1 install preflight passed on aarch64 (hosted HF Inference Endpoint path was viable; ~$5 budget authorized).
- Before spinning up, the 30-item seed was pulled from the baseline's own escalation pool (`needs_review=True, confidence ≤ 0.6` in `data/press_releases/classified/*.jsonl`).
- Hand-adjudicated distribution: **16 clean biotech events, 11 ticker collisions, 3 non-company noise items, only 3 negatives in the full 30-item set.** Effective N for the real question ~11.
- Running FinGPT on that seed would produce low-power, hand-shaped results. User and Claude agreed: fix the leak first, rerun later.

**Key finding:** `tools/classify_press_releases.py` escalation pool (`needs_review=True`) is ~47% filter leakage (collisions + noise), not real biotech ambiguity. That is almost certainly higher-leverage to fix than any model swap — the current Grok-4-1-fast spend is partly paying for non-biotech or off-ticker text.

**Specific gaps catalogued in verdict memo:**
1. Noise-pattern list missing entries ("halper sadeh", "investment opportunities in the", "billion valuation by 20"). Possible case-sensitivity/HTML-entity bug on law-firm pattern "levi & korsinsky".
2. `_is_ticker_collision()` short-circuits to "no collision" for any ticker not in `company_ir_sources.json` (missing-name-entry gives a free pass).
3. Biotech-indicator rescue in collision check is too permissive; no sector-mismatch negative signal (mining, iron ore, EMTN bond, asset management, etc. should count as collision evidence).

**How to apply:**
- Do NOT recommend spending on FinGPT endpoint until the filter fix is done AND a re-pulled 30-item seed has ≥ 6 negatives out of 20 ambiguous.
- If user asks about biotech NLP model swaps in the future, default answer is: "audit the escalation pool first — the last pool had 47% noise."
- The classifier-filter fix is itself a concrete follow-up task (scoped in `fingpt_pilot/notes/VERDICT.md`); it touches production code, so per CLAUDE.md North Star Rule and governance, propose spec first and get user approval before editing.

**Artifacts:**
- Verdict memo: `/mnt/c/Projects/biotech_screener/fingpt_pilot/notes/VERDICT.md`
- Frozen seed + gold labels: `/mnt/c/Projects/biotech_screener/fingpt_pilot/{seed,labels}/`
- Rubric (reusable): `/mnt/c/Projects/biotech_screener/fingpt_pilot/rubric/LABEL_RUBRIC_v1.md`
- Sandbox safe to delete once filter fix lands.

**Sprint outcome:** Week 3 slot reallocated to classifier-filter fix (pending user go-ahead). Week 4 Part 2 Kronos slot unchanged.
