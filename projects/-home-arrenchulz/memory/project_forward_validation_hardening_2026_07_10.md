---
name: project-forward-validation-hardening-2026-07-10
description: "DEM forward-validation feed diagnosed, fixed & hardened for shadow mandate SM-20260629-001 — PR"
metadata: 
  node_type: memory
  type: project
  originSessionId: 10171b49-1bf2-4342-9dbd-d5a67cceaa8c
---

Forward-shadow mandate **SM-20260629-001** (DEM YTD bootstrap; DOL `ICD-20260629-001`) had **0 of 20** required post-mandate windows. Triggered via the `biotech-ic-council` skill re-review (`ICD-20260710-001`) and worked through the operator's 7-step plan. Repo: `/mnt/c/Projects/biotech_screener/biotech-screener/`.

**Root causes found (both real):**
1. Live forward-validation capture had *never run in production* — `cron_daily_production.sh` ran under `set -euo pipefail` with an unguarded `run_daily_production.py` call, which exits 2 on WARN-status runs, so `set -e` aborted the wrapper before its tail (no wrapper outcome line since 2026-04-17). All prior capture history was a one-time 06-28 backfill ending 06-26.
2. Price feed silently broken since 07-08 (only **AARD** appended/day) — `extend_price_csv_safe` → `safe_download_per_ticker` used `yf.download` (MultiIndex columns); the long-format parser read `row.get("Close")` (a tuple key), dropping ~every row. Same class as PR #453 but in the `_safe` path it never covered.

**Delivered — branch `fix/fwd-validation-capture-guard`, PR #489 MERGED, deployed to live checkout HEAD `4d8623e5` (2026-07-10).** 7 commits: (1) guard pipeline call under set -e; (2) behavioral model-hash `ast-v1` (AST strips annotations/docstrings) + `docs/governance/2026-07-10-dem-candidate-hash-equivalence.md`; (3) capture only on exit 0/2 + freshness/provenance gate (`--expect-commit`); (4) schema-v2 quarantine fields + authoritative `capture_is_eligible_for_mandate()` (LIVE+PASS+hash+benchmark+realized 5d) driving `weekly_validation_summary.py` gates; (5) price-feed fix (`_flatten_yf_columns` + per-ticker starts) + hard-gate `check_price_append_health()`; (6) read-only `tools/forward_validation_liveness_monitor.py` (6 alerts); (7) `run_forward_bootstrap.py --forward-only-from` + `tools/cron_forward_validation_liveness.sh`. **49 new tests, all green.** NO_MODEL_CHANGE throughout.

**Model-hash drift resolved (benign):** the `a9983a67`→`a7a80e85` "drift" was ONE type-annotation line (`compute_sort_contribs` return hint, commit `b12addd0` #485 mypy) — proven annotation-only-equivalent; ranker/selector byte-identical. Under ast-v1 both hash to **`827c35a9ed3ee6e1`**. **`CANDIDATE.json` re-registered 2026-07-10** to `model_hash=827c35a9ed3ee6e1`, `hash_scheme=ast-v1`, `legacy_model_hash=a9983a67c6954813`, `registered=2026-06-26` (freeze date unchanged). Verified deployed `compute_model_hash()` == candidate → captures now `model_hash_match=true`.

**⚠️ Open follow-ups:**
- **`CANDIDATE.json` is dirty (uncommitted) in the live checkout** — operator must commit+push it (my pushes blocked by `~/.claude/hooks/block-dangerous-git.sh`).
- **Liveness cron NOT installed** — `tools/cron_forward_validation_liveness.sh` has the suggested crontab line in its header; operator installs.
- **Verify self-heal:** the 2026-07-10 16:30 ET run should backfill XBI + universe prices (07-08/09/10) via the fixed refresh AND record a clean `capture_mode=LIVE` window. Confirm `price_append_health` PASS + a live capture next session.
- **Mandate still 0 eligible windows** (now enforced in code, not prose); backfilled/replay never count. Clock starts from the first clean LIVE capture once its 5d return realizes. **2026-09-30 = status checkpoint (not resolution deadline).** ~mid-Nov = 20-window gate. **DEM thesis stays HOLD / unresolved.**

Working-tree isolation used a git worktree at `scratchpad/fwdfix-wt` (shared-checkout rule). See also [[project_dem_model_lesson_2026_06_28]] and the `biotech-ic-council` skill (now installed at `~/.claude/skills/`).
