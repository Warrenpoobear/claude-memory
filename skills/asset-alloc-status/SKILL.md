---
name: asset-alloc-status
description: |
  Check the Wake Robin asset allocation model status: last commit, test count, open phases, Phase 23 PE commitment-book state. Use when the user says "asset allocation status", "wake robin model", "check the AA model", "asset alloc", or similar. Read-only summary of the model's current state.
allowed-tools:
  - Bash(git *)
  - Bash(python3 *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(cat *)
  - Bash(head *)
  - Bash(grep *)
---

# Asset Allocation Status

Read-only status check for the Wake Robin asset allocation model.

## Repo facts (verified 2026-07-15)

- Repo: `/mnt/c/Projects/asset allocation/asset-allocation` (note the space — quote the path)
- Remote: `WR-SW-Dev/WR-asset-allocation` (GitHub, private); branch `main`
- Venv: `.venv/` inside the repo (aarch64 WSL2)
- Doc-as-spec: `docs/MODEL_DOCUMENTATION.md` (moved from root 2026-07-14, commit `c8e1e55`);
  designed PDF export alongside it (regen: `node data/external/model_doc_export/render_pdf.mjs`)
- Live status dashboard file: `HERMES_TRACKING.md` (repo root) — fastest single source;
  its "Asset Allocation Model — Status" block carries tests/ruff/phase/gov-flag state
- Pre-push git hook runs ruff lint+format on src/tests/scripts (enable via
  `git config core.hooksPath hooks` once per clone)

## Steps

### 1 — Git state
```bash
cd "/mnt/c/Projects/asset allocation/asset-allocation" && git log --oneline -8 && git status -sb | head -5
```

### 2 — Quick status from the tracker (no test run needed)
```bash
cd "/mnt/c/Projects/asset allocation/asset-allocation" && grep -A16 "Asset Allocation Model — Status" HERMES_TRACKING.md
```
If HERMES_TRACKING.md's "Last manual sync" is older than the latest behavior commit, note the drift.

### 3 — Test suite count (only if a live count is needed; ~1–2 min)
```bash
cd "/mnt/c/Projects/asset allocation/asset-allocation" && .venv/bin/pytest -p no:warnings --ignore=tests/test_transaction_cost_summary.py --collect-only -q 2>/dev/null | tail -2
```
(4 cvxportfolio-gated tests are omitted by design; `test_transaction_cost_summary.py` is excluded per the standing pytest invocation.)

### 4 — Open gates / phases
```bash
cd "/mnt/c/Projects/asset allocation/asset-allocation" && sed -n '/## Open Gates/,/^## /p' HERMES_TRACKING.md | head -20 && ls docs/phase*.md
```

### 5 — Report
```
ASSET ALLOCATION MODEL STATUS — YYYY-MM-DD

Repo:    /mnt/c/Projects/asset allocation/asset-allocation
HEAD:    <hash> — <message>   (vs origin/main: <ahead/behind>)
Tests:   <NNN> passed (574 as of 2026-07-15, post-Phase-26)   Ruff: <0 errors expected>
Status:  <clean / N modified files>

PHASES
  Phases 1–22 + 14.3 + MC-0..MC-3 + Phase 24 (entity) + Phase 26 (purpose lens): SHIPPED on main
  Phase 25 (PE projection anchoring): reserved, not started
  Phase 23 (PE real-data commitment book): design locked f81ff43, DEFERRED
    Waiting on: user commitment book + Archway actuals + entity registry
  Phase 7 STAIRS adapter / Phase 10 L14 remainder: design-gated, open

GOVERNANCE
  Doc-as-spec: docs/MODEL_DOCUMENTATION.md — 2026-05-05 flag RESOLVED fc04aeb (2026-07-14)
  Limitations register: 19 entries — 8 resolved, 3 partial, 7 accepted, 1 open (L5)
  The one to watch: L19 (spending-base realism)

ENTITY STUDIES (local, gitignored)
  jims_trust_full/ — authoritative; v2 fixture 2026-07-14 (mixed as-of 7/14 marketable / 4/30 privates)
  Rebuild: .venv/bin/python data/external/build_jims_trust_v2_fixture_local.py
  Render:  .venv/bin/python scripts/run_entity_study.py --fixture data/external/entity_jims_trust_full_local.yaml --policy data/external/entity_jims_trust_full_policy_local.yaml --purpose-policy data/external/entity_jims_trust_purpose_policy_local.yaml
```

## Context
- HEAD `d1277dc` (2026-07-15): Phase 26 purpose (goals-based) allocation lens merged (PR #18;
  design lock `4364863`); before that: gov-flag resolution `fc04aeb`, doc move `c8e1e55`,
  PDF export regen `19b4def`, tracker sync `94d843d`
- 574 tests passing, ruff clean; purpose lens oracle-validated 56/56 vs the real workbook tab
- Pushing a NEW branch can exceed 2 min (pre-push ruff on /mnt/c) — use timeout ≥5 min, don't
  assume failure
- Wake Robin SFO: Gen 3–5 family office; NAV ≠ liquidity is the standing principle
- Never edit in a shared checkout mid-cron; concurrent sessions have used worktree `aa-fmt`
- Jim's Trust study artifact: https://claude.ai/code/artifact/a57e2bb7-9c3f-4698-bb0f-e4359b9242fd

## Session-end learning

After this skill runs, if anything surprised you, log a learning per `~/.claude/docs/session-end-learning.md` (Pattern-Key `SKILL_ASSET_ALLOC_STATUS_{description}`).
