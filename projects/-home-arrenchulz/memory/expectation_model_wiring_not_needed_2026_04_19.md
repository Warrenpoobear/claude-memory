---
name: Expectation-model "wire these fields" synthesis was wrong — 2026-04-19
description: Empirical verification showed short_interest_pct / close_price / market_cap_mm / priced_move_pct are already wired end-to-end. The 80→95% coverage claim had no firm source and didn't match the code.
type: project
originSessionId: b9d88e96-eb38-45d4-b094-c0b588a6ad1e
---
Asked to ship a "wiring fix" for the expectation model (export `short_interest_pct`, `close_price`, `market_cap_mm`, `priced_move_pct` into `rankings.csv`, claimed to move coverage 80% → 95%).

**Empirical verification (2026-04-17 snapshot, 297 rows):**
- `short_interest_pct`: 98.3% populated
- `close_price`: 100% populated
- `market_cap_mm`: 100% populated
- `priced_move_pct`: 83.2% populated

All four fields are declared in `common/feature_registry.py`, listed in `run_screen_columns.py::SNAPSHOT_COLUMNS` (lines 177-180), backfilled at runtime by `run_screen.py:3570` / `_finalize_priced_move` at 3588, and consumed by the `ExpectationModel`. End-to-end wired.

When asked for the source of the 80→95% claim, user said "not sure." Responsible call: don't ship a fix for a problem we can't reproduce.

**Two secondary findings investigated instead:**
- `insider_net_buy_z` has 0.10 weight in `ExpectationModel._DEFAULT_FEATURE_WEIGHTS` but the Form 4 lane was closed 2026-04-05 (removed from registry). **Self-normalization (`belief_score /= total_weight`) makes this weight FUNCTIONALLY INERT** — missing feature contributes 0 to both numerator and denominator. Added a 10-line comment on `event_ev/expectation_model.py:37` explaining this so future readers don't repeat the confusion. No functional change.
- `implied_event_move` at 59.9% population is ALSO not a wiring gap. Decomposed: 77 rows masked by intentional 180-day catalyst-window cap, 39 rows lack a known catalyst date, ~11 rows outside the 35% liquid-options-chain coverage. **0 unexplained cases.** The 40% "gap" is data-coverage + protective masking, not missing plumbing.

**How to apply:**
- If this synthesis resurfaces in a future conversation ("wire these 4 fields for +15pp coverage"), flag it as already-verified-wrong and reference this memory.
- Real levers for improving expectation-model data coverage (if ever warranted): (a) catalyst-date coverage in CRT/calendar, (b) liquid-options-chain expansion beyond the current 35%, (c) relax the `_POS_DIV_MAX_DAYS = 180` mask with a governance-approved spec.
- Don't ship a "fix" based on a synthesis without a verifiable source, even if it sounds directionally plausible. This session's verification took about 15 minutes and saved shipping a no-op change.

**Artifact:**
- `event_ev/expectation_model.py` updated with explanatory comment on lines ~34-42 (post-edit). No other code changes.

**Related:** `feedback_autonomy_claims` — this is a direct application of that rule.
