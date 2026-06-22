---
name: semgrep-governance-guardrails-2026-06-22
description: Semgrep governance/regression guardrail layer for biotech screener — shipped as draft PR
metadata: 
  node_type: memory
  type: project
  status: shipped
  related: 
    - biotech-containment-governance
    - scientific-cartography
  originSessionId: 6c6f3a44-2a5a-4b12-86c7-0bd28da00245
---

Built a deterministic **Semgrep governance/regression guardrail** for the biotech screener (`/mnt/c/Projects/biotech_screener/biotech-screener`). Insurance against accidental edits — **adds nothing to model/alpha**; runtime correctness still owned by the 16.5k-test suite + snapshot monitors (none of the real past incidents — composite-aggregation, classifier collisions, yfinance — were code-shape problems Semgrep would catch).

**Shipped 2026-06-22 as two draft PRs (no auto-merge; kept in draft pending review):**
- **PR #370** `semgrep-governance-guardrails-2026-06-22` (commit `0573101e`) — `.pre-commit-config.yaml` + `.semgrep/` (8 files) + `.semgrepignore`.
- **PR #371** `langgraph-review-artifact-dir-none-guard-2026-06-22` (commit `afced5d4`) — unrelated 1-line `nodes.py` None-guard, isolated. Provenance of the original edit unverified (appeared in working tree mid-session; consistent with watcher/operator pattern).

**Scope = 4 of 5 planned areas (§5 taint DEFERRED — noisy/audit-only/slow on /mnt/c):**
- Builds on a pre-existing Phase-0 scaffold (`bb543d9f`): R1 live-source-in-pit/replay (ERROR), R2 snapshot-write (WARN), R3 shell=True (WARN), R4 model-artifact-write (WARN) + `detect-secrets`.
- New: `cartography-boundary.yml` (C1 ERROR forbidden score/sizing/selector *writes* from scientific_cartography/; C2 WARN buy/sell language), `pit-clock-randomness.yml` (P1/P2 WARN), `feature-exports.yml` (4 ERROR pinning short_interest_pct/close_price/market_cap_mm/priced_move_pct in SNAPSHOT_COLUMNS), `agent-safety.yml` (A1 unsafe-yaml ERROR, A2 pickle ERROR, A3 eval/exec ERROR, A4 os.popen WARN). 16 rules total, all `--validate` clean.

**Rollout decision: LOCAL pre-commit, NOT CI** — GitHub Actions budget is exhausted so the existing `semgrep-governance-audit.yml` workflow never runs. Hook in `.pre-commit-config.yaml` blocks on **ERROR severity only** (`--config .semgrep/ --severity ERROR --error`); WARNING tier is on-demand (`semgrep scan --config .semgrep/`). Baseline ERROR scan on real source = 0 hits; hook smoke-tested (clean→0, field-drop→1, forbidden-write→1).

**Hard-won gotchas (reuse these):**
- **Semgrep is unusably slow on /mnt/c** — it git-enumerates the whole repo before scanning even explicit targets; full + targeted scans both time out (124). **Workaround: copy rules+targets to the fast scratchpad fs and scan there.** For a rules-only branch, validate with `semgrep scan --validate --config .semgrep/` (no code scan, fast).
- **Explicit targets bypass `.semgrepignore`** — `semgrep scan ... .semgrep` re-flags the intentional fixture violations in `.semgrep/agent-safety.py`. The fixture-exclusion only works on a normal repo-root scan, not when `.semgrep` is passed explicitly. So a "scan .semgrep" validation always falsely exits 1.
- **`pattern-not-regex` for required-field pins must use the quoted literal** (`'"priced_move_pct"'`), else a bare comment mention masks a dropped field (and a rename to `_v2` correctly trips it).
- **Bootstrap paradox**: the commit introducing the guardrail used `git commit --no-verify` (its fixtures contain deliberate violations the hook would block).
- `semgrep --test` (the native test runner) crashed with an IndexError on this layout; verified rules via direct fast-fs scans of fixtures instead.

See [[biotech-containment-governance-2026-06-21]] — branches pushed under the active INC-2026-06-20-AUTOPUSH freeze with operator that auto-merges PRs; drafts used to prevent that.

**Status (operator close-out 2026-06-22): `SEMGREP_GOVERNANCE_GUARDRAILS_DRAFT_REVIEW_READY`.** Scope = governance/dev guardrails only; production impact = none; merge posture = keep draft until explicitly reviewed. Caveat: #370's pre-commit hook is a developer-machine guardrail only — NOT server-side enforcement unless CI is active.

**Durable path (agreed, not yet done):** 1) merge #370 as developer-machine guardrail; 2) later add/reactivate the CI Semgrep audit once Actions budget allows (server-side gate); 3) keep blocking rules small + deterministic, keep taint warning/audit-only.
