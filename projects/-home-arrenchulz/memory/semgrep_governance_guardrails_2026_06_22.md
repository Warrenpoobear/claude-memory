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

**Durable path — 5-step sequence (confirmed 2026-06-22):**
1. **Review + merge #370** — no new rules until reviewed; it already covers the highest-value guardrails.
2. **Semgrep CI audit** — once Actions budget returns, small follow-up PR. Shape: `pull_request` + `workflow_dispatch` triggers; `fetch-depth: 0`; `SEMGREP_BASELINE_REF: origin/main` for diff-aware scan (only newly-introduced findings, avoids old-finding flood); `--severity ERROR --error`; audit-first until a few clean PRs, then make ERROR blocking.
3. **Rule/test refactor** — split `.semgrep/` into `rules/` + `tests/semgrep/` to eliminate fixture self-scan confusion. Use `semgrep --test --config .semgrep/rules tests/semgrep`.
4. **High-confidence new rules** — (P1) `nosemgrep` ban without justification token; (P1) live-network calls in cartography/replay/cache-only paths; (P1) `final_score`/`ranker_v2_score`/sizing writes outside approved modules. (P2) `subprocess` in MCP/agent wrappers WARN; (P2) destructive file ops in agent/tool code WARN.
5. **§5 taint pilot (WARN only)** — only after CI is stable; run on fast-fs copy NOT `/mnt/c`; separate false-positive triage cycle.

**What not to do yet:** No §5 taint immediately. No broad subprocess bans repo-wide. `.semgrepignore` is not a control for secrets scans (Semgrep Secrets ignores it — detect-secrets handles that separately).
