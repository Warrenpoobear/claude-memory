---
name: run_screen production audit (2026-04-25)
description: Production audit of run_screen.py — fixes landed, residual PIT/data warnings still open. Verdict and next-task scope frozen.
type: project
originSessionId: 3e14f5c0-2cce-4362-bcf2-26a5745b14dc
---
Verdict: **production safe with material PIT/data warnings** (not clean production-safe).

**Fixes landed in this audit (do not revert):**
- `--pit-mode=strict` now actually raises `FileNotFoundError` on cache miss (was silently identical to `degrade`).
- `ranker_mode=pairwise_minimal` (production default) + missing `production_data/ranker_v2_model.json` now raises (was soft-FATAL log + continue).
- `institutional_summary.{build,compute_delta}` write `created_at = "<as_of_date>T00:00:00Z"` instead of `datetime.now(...)` — sidecars now byte-identical across reruns.
- `event_ev/conditional_model.py` `_join_text` helper drops `None`/non-str entries; sidecar overlay no longer lost when a CTGov intervention is `None`. Backfilled 2026-04-23 + 2026-04-24 overlays.
- 6 regression tests in `tests/test_audit_fixes_2026_04_25.py`.

**Why:** these were runtime/integrity defects with no ranking impact. Audited on 2026-04-25; all 4 surfaced expectation-model fields confirmed at expected coverage (short_interest_pct 98.0 %, close_price 100 %, market_cap_mm 99.7 %, priced_move_pct 84.2 %).

**How to apply:** treat the patch set as frozen. Do not stack more structural fixes until one production cycle (Mon 2026-04-27) clears cleanly.

**Two open controls — explicitly the next task, narrow scope only, no alpha:**
1. `production_data/market_data.json` has no document-level `as_of_date`/`snapshot_date` — per-row `collected_at` exists but `run_screen` doesn't read it. PIT lookahead protection currently depends entirely on upstream discipline. Next: producer emits top-level `as_of_date` wrapper; `run_screen` validates `collected_at` consistency and freshness (proposed: ≤2 business days). Strict mode raises; degrade mode warns + flags `coverage_degraded`.
2. `priced_move_pct` unit drift — **diagnosis corrected 2026-04-25** (see `IV_UNIT_DRIFT_DIAGNOSIS_2026_04_25.md` at project root). Original "chain-straddle dollar-denomination" diagnosis was wrong: `row["straddle_price"]` is unconditionally overwritten at `run_screen.py:5605` with `cvs["implied_move"]` (decimal fraction). **Real cause: `opt_atm_iv` unit drift in the Tastytrade producer (`common/options_diagnostics.py:718` block, completely uncapped) propagating through the IV-implied-move fallback in `common/straddle_mispricing.py:74` (`iv × sqrt(t)`).** Scale is also worse than originally captured — 37–45/297 rows (~13%) on each of the 2026-04-20…04-25 snapshots, not 13/250 once. `opt_iv_regime == EXTREME` already predicts 36/38 bad rows but no consumer reads it. Chain-straddle dollar/decimal confusion remains a secondary checked failure mode, not the primary diagnosis. Next (post-cycle): producer-side cap at TT path (blank IV when > 4.0; do not silently clamp), align Polygon path threshold, downstream tripwire in `straddle_mispricing.py`, `--pit-mode=strict` hard-fail in Phase 2z. Do **not** clamp `priced_move_pct` downstream.

**Determinism status:** post-fix, all sidecars byte-identical and ticker order stable. Residual `rankings.csv` drift is 3 options columns at the 4th decimal from the live Tastytrade API. A true deterministic test requires a `--no-live-options` / cache-only run mode, which doesn't exist yet.

**Out-of-scope observations** (not fixed; do not fix without explicit direction): SEC 8-K cache-miss silent-empty, morningstar/price_history staleness silent-skip, stale doc comment in `event_ev/expectation_model.py:35-43` (functionally inert because module is research-only), `_XBI_BENCHMARK_` sentinel 404 noise, float32 precision in `close_price`, `TEMPORARILY_NOT_AVAILABLE` CTGov status enum gap.
