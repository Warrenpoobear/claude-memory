---
name: ranker-contract-test-hardening-2026-06-21
description: "Ranker contract test-hardening lane — MERGED to main as PR #364 (2026-06-22); next ranker lane is diagnostic/shadow IC only"
metadata: 
  node_type: memory
  type: project
  status: resolved
  related: 
    - biotech-containment-governance-2026-06-21
    - universe-hygiene-branch-2026-06-21
  originSessionId: 1b96737f-246c-461f-996a-59db489feb5f
---

Ranker Contract Test Hardening — TEST_CONTRACT_ONLY lane. **MERGED to `main` as PR #364 on 2026-06-22** (merge commit `c09bf1e2`; operator squash/merge, by Warrenpoobear). Branch auto-deleted on merge. ⚠️ Merged WITHOUT CI passing — GitHub Actions budget was exhausted, so no job ran; the contract tests have not executed against `main` yet (validate on first run after Actions budget restored).

**Branch:** `test/ranker-contract-hardening-main-2026-06-21` (pushed, tracks `origin/<same>`)
**Commit:** `5a943bec` — `test(ranker): harden production ranker contracts`
**Base:** `origin/main @ d9531c7b` (the INC-2026-06-20-AUTOPUSH frozen point — NO universe-hygiene commits in ancestry; cherry-picked from earlier `1f2fe2b5` which was stacked on `universe/hygiene-2026-06-21`).
**Tests:** 49/49 pass. Scope: TEST_CONTRACT_ONLY / NO_MODEL_CHANGE / NO_PRODUCTION_CHANGE.

**What it pins (3 test files only):**
- `tests/test_ranker_v2_production.py` — live model artifact tightened to exactly 2-feature `minimal_v2` (`n_features==2`, `feature_names==["coinvest_score_z","financial_score"]`); new `TestNonCohortFinalScoreFallback` characterizes the inline `selector_score * 0.0001` demotion at `run_screen.py:5647` (literal, NOT a named constant).
- `tests/test_ranker_v2_config.py` — new `TestDeployedLiveWeights`: coinvest weight ≈0.02, financial ≈-0.05332037006884376, bias ≈0.5019276351788997, capped_weight_value == deployed coinvest weight.
- `tests/test_production_selector_ruleset.py` (NEW) — pinned ruleset `8887576e`/v1.14.0 coinvest-only: file hashes to `8887576e`, `sort_anchor=="selector_score"`, raw-JSON `selector_config=="coinvest_only"`, coinvest selector weight 1.0 / inst_delta 0.0; ties to live `A4_SELECTOR_CONFIG`.

**PR:** [#364](https://github.com/Warrenpoobear/biotech-screener/pull/364) — MERGED 2026-06-22 (was opened as draft via gh, then operator-merged into `main`).

**Next ranker lane direction (operator):** diagnostic/shadow IC ONLY — NOT production ranker changes.

**Ops note:** 3 `codegraph serve --mcp` watchers on `/mnt/c` cause transient `.git/index.lock` races; foreground git with a short retry loop works. `/mnt/c` filesystem lag can make `git log` read stale immediately after a commit — re-read to confirm. See [[biotech-containment-governance-2026-06-21]].
