---
name: project-snapshot-provenance-mismatch-2026-07-15
description: REVIEW FLAG — 2026-07-15 production snapshot ran on dirty tree / wrong code hash with screen_exit_code=1 yet passed integrity checks and landed as canonical PIT; caught only by manual tagging
metadata: 
  node_type: memory
  type: project
  originSessionId: d0599667-e09b-4348-97fb-c8a5cde4d33f
---

**REVIEW FLAG — raised 2026-07-17 (operator: Darren). Status: OPEN, needs pipeline-owner review.**

## ⚠️ CORRECTION 2026-07-17 (blast-radius done): this is CHRONIC & SYSTEMIC, not a 07-15 one-off
Blast-radius scan of `run_manifest.json` across every snapshot early-June → 07-17 shows **~20 consecutive production runs with `git.dirty=True` and/or non-zero `screen_exit_code` (1 or 2)**. Examples: 07-01/02 exit=2, 07-06..07-10 exit=2 dirty, 07-15 exit=1 dirty. It **cleared exactly on 07-16 & 07-17** (dirty=False, exit=0) — coincident with #499/#500 + CTIS fixes landing.
- **Non-zero `screen_exit_code` is TOLERATED BY DESIGN**: `tools/run_daily_production.py:667` logs it as a WARNING and the pipeline continues. ~20 such runs all produced valid rankings.csv that passed all 9 integrity checks and drove the live model/portfolio (EES gate ingested 07-09, 07-10, 07-15). So exit=1/2 ≠ "rankings invalid."
- **`dirty=True` is the operating norm**: production runs from the shared `/mnt/c` checkout which chronically carries uncommitted changes (untracked artifacts + concurrent sessions — see [[feedback_shared_checkout_concurrency_2026_06_30]]).
- **07-15 was NOT uniquely broken** — it only got hand-tagged because a human was actively watching during the #499/#500 outage. Data validity is not in question; reproducibility/provenance hygiene is.

**Implication for remediation:** re-running/quarantining *only* 07-15 is arbitrary and incoherent. A backdated re-run today cannot reconstruct 07-15 PIT conditions (would pull current prices → look-ahead contamination) — that would manufacture a worse artifact than the cosmetic tag it fixes. **DECLINED the re-run** on 07-17. The real remediation is forward-looking: (a) stop running production from a dirty shared checkout (operational), (b) add a WARN-level provenance gate to `snapshot_integrity_report` (code — via worktree+PR, must be WARN not FAIL or it flags ~20/20 recent snapshots).

## What was flagged
The EES v3 shadow ledger carried a row with `snap_date = "2026-07-15__pre_0409403e_provenance_mismatch"` — a hand-added tag on the 07-15 snapshot directory (later restored to canonical `2026-07-15`). Tracing it revealed a real provenance/reproducibility problem, not a cosmetic label.

## Evidence (from `data/snapshots/2026-07-15/`)
- `run_manifest.json`: `git.commit_sha = 616678e3` (**#500**, `fix(monitoring): surface_delta_monitor must not sys.exit`, committed 07-15 16:13 ET), `git.dirty = True`, `dirty_pre_run = True`, `dirty_post_run = True`. **`screen_exit_code = 1`** (audit_exit_code = 0).
- Expected/pinned reference hash in the mismatch tag: `0409403e` (**#499**, `fix(production): register price_append_health in GATE_ALLOWLIST`, 07-15 15:21 ET). `0409403e` is an ancestor of `616678e3` — i.e. the run happened one hotfix *ahead* of the pinned reference, plus uncommitted changes on top.
- `snapshot_integrity_report.json`: `ok = true`, `overall_severity = PASS` (all 9 checks pass; ruleset `8887576e`, engine v1.4.0). **The integrity gate does NOT check git-clean state, code-hash provenance, or screen_exit_code** — so it passed a run that (a) ran dirty, (b) didn't match the pinned code, and (c) had a failing screen step.

## Why it matters
1. The 07-15 snapshot is a **non-reproducible, dirty-tree production artifact with a failing screen step**, yet it landed as a **canonical PIT snapshot** and feeds downstream — it is already ingested into the EES v3 20d shadow gate ([[ees_shadow_monitor_state_2026_06_23]]) and decision_portfolio/rankings.
2. The only thing that caught it was a **human manually renaming the directory**. The automated `snapshot_integrity_report` is blind to provenance mismatch → gap in the integrity gate.
3. This sits squarely inside the **#499/#500 outage window** — see [[project_ctis_timeout_fix_2026_07_16]] ("Restart-storm was symptom of #499/#500 outage"). Likely the same root cause: hotfixes landing mid-run.

## What review should decide
- Whether to **quarantine / re-run** the 07-15 snapshot on clean `616678e3` (or later), and whether downstream consumers that already ate it (EES 20d gate, PIT archive) need correcting.
- Whether `snapshot_integrity_report` should gain a **provenance gate**: fail/flag on `git.dirty == True`, code-hash ≠ pinned reference, or `screen_exit_code != 0`.
- Blast-radius: which other snapshots in the #499/#500 window (07-15/07-16) share the dirty/exit-1 provenance.

**Governance:** diagnostic/data-integrity flag only — no model change, no portfolio action. See [[feedback_shared_checkout_concurrency_2026_06_30]] (readiness/snapshot dirs are untracked, hence this flag lives in memory, not a repo file that could vanish).
