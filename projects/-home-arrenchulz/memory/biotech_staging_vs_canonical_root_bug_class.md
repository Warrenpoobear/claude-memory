---
name: Staging-vs-canonical-root bug class in run_screen.py
description: Recurring bug class — diagnostics that walk sibling snapshot dirs use snap_path.parent (the staging tmp root) instead of the canonical data/snapshots/ root, silently emitting "no prior" or skipping comparisons
type: project
originSessionId: 51d77fc1-dc0d-47b4-a3f3-6546cb54e380
---
In the biotech_screener project, `run_screen.py` runs in staging-then-promote mode under daily production: the pipeline writes to a tmp staging dir like `/tmp/phase2_staging_<DATE>_<HASH>/<DATE>/`, then promotes to `data/snapshots/<DATE>/`. Inside `save_validation_snapshot`, `snap_path = snapshot_dir / as_of_date` points at the staging dir. `snap_path.parent` is therefore the empty staging tmp root, NOT the canonical `data/snapshots/` root.

Several diagnostic functions added later (per audit 2026-04-26) used `snap_path.parent` to find prior snapshot dirs. They silently produced bogus output: "no prior snapshot available" or no comparison at all. The canonical root is already threaded through `--prior-snapshot-dir` and bound to `_prior_dir` inside `save_validation_snapshot` — that's the variable to use.

**Why:** Staging-then-promote was added to make the pipeline atomic. Diagnostics added afterward weren't aware of the staging layer. Tests use single-dir tmp_path fixtures so the bug is invisible to the test suite.

**How to apply:** When auditing or adding any code in `save_validation_snapshot` (or anywhere it inherits the same staging assumption) that looks at `snap_path.parent`, `snapshot_dir`, sibling dirs, or `(somewhere / "rankings.csv")` directly under the snapshots root: stop and check whether you mean the staging dir or the canonical root. Use `_prior_dir` (set from `prior_snapshot_dir or snapshot_dir` at line ~4001) as the canonical root. Confirmed buggy + patched 2026-04-30 in three places: `_write_cohort_churn_alert`, `_annotate_cohort_membership_streaks`, and the EES gate-performance tracker block (~line 6634). Possibly more — full sweep not yet done. Pattern to grep: `snap_path.parent` and `_prior_dir / "rankings.csv"`.
