---
name: Spec 064 EES v3 Promotion Battery
description: Verification plan gating EES v3 promotion from diagnostic overlay to selection gate; WS4-targeted stats + forward sidecar + incremental FM
type: project
originSessionId: 26d85a0a-1763-4cd9-b4b8-ac843ab7ea7c
---
# Spec 064 — EES v3 Promotion Battery (2026-04-23)

Path: `specs/changes/spec_064_ees_v3_promotion_battery.md`

**Why**: EES v3 sits at Checklist v2 = 4/5, WS4 fails (`t_adj=1.53` vs 1.65
threshold, structural autocorrelation). Historical backtests invalidated
(2026-04-17). Architecture frozen (2026-04-19) → cross-snapshot aggregates
prohibited. Plan had to be reshaped around (a) data-plane trust first,
(b) WS4-specific stats only, (c) forward sidecar as primary evidence.

**How to apply**: when any EES v3 testing / promotion / research question
arises, do NOT propose generic component-IC batteries or cross-snapshot
rolling-IC analysis. Route all work through this spec's P0/P1/P2 ordering.
`base_rate_gap_score` is negative control only — do not resurrect it as a
candidate. Promotion requires all three: 5/5 Checklist v2 + ≥30 live
trading days of sidecar with clean coverage + P2 incremental FM pass.

## Key constants to remember
- Coverage hard-fails (any ≥3 consecutive snapshots blocks P1/P2):
  `pct_priced_move ≥ 0.60`, `pct_short_interest ≥ 0.70`,
  `pct_gap_computable ≥ 0.50`, `pct_full_ees_computable ≥ 0.40`,
  MoM delta ≤ 10pp.
- WS4 pass: `t_adj ≥ 1.65` at 21d horizon with lag `L = h−1`, `N_eff ≥ 30`,
  block bootstrap 95% CI excludes zero, sign agreement Test A vs Test C.
- P2 pass: `mean(β_3) > 0`, NW-corrected `t_adj ≥ 1.96`, ΔR² ≥ 0.5pp,
  sign stability ≥ 60% of snapshots.

## Canonical harness
`pit_backtest_ees_v2.py` — but strip cross-snapshot aggregates per the
2026-04-19 freeze. Use `ees_v3_checklist_battery.py` as template for
promotion gate execution.

## Status
P0 sidecar emission wired 2026-04-23 into `run_screen.py` phase2 block
(after portfolio_positions write, before catalyst coverage diagnostics).
Writes `data/snapshots/{date}/ees_sidecar_diff.json`. Registered in
`tools/production_qa_check.py` sidecar check. Dry-run against 2026-04-23
data: 297 rows scored, coverage pm=83.8% si=98.0% gap=83.8% full=100%,
no hard-fail flags, 4 of 30 baseline would be filtered by EES v3, 13
non-baseline candidates ≥95th pctile. First live artifact on next
scheduled pipeline run.

## State change confirmed 2026-04-23
**Data plane is no longer the bottleneck. WS4 is.** All four coverage
metrics clear hard-fail thresholds with wide margin (≥40pp above floor
for pct_full_ees). The expectation-layer wiring note from earlier —
"what matters next is verification, not more wiring" — is now
empirically validated. This changes how all EES v3 questions should be
framed: the problem is autocorrelation-honest statistics + forward
outcome evidence, NOT input sparsity.

## Shadow-period discipline (2026-04-23 → ≥2026-06-05 earliest)
During the 5-clean-snapshot countdown and the 30-trading-day sidecar
window, the following are OFF-LIMITS even if asked:

1. Do NOT tune thresholds (coverage, gate cut, pctile cuts)
2. Do NOT interpret filter counts as "good" or "bad" (e.g. "4/30 is low,
   let's change the gate") — per-snapshot counts are noise until 30 days
   of outcomes exist
3. Do NOT analyze `would_add` names as "missed alpha" or trade them —
   the field is diagnostic, not a recommendation. It must not leak into
   decision discussions until P2 passes.
4. Do NOT rerun historical IC ladders or cross-snapshot aggregates (the
   2026-04-19 freeze plus the 2026-04-17 "no historical claim is
   credible" rule both apply)
5. Do NOT reweight EES v3 components based on live observations —
   architecture is frozen
6. Do NOT treat driver_component as "full decision reason" — it covers
   v3 core only (conditional_misprice + expected_move), not v2 context
   (trap/timing/quality) which are exposed separately as `v2_context`

When asked "what's next for EES?" during this window, the correct answer
is: **wait for outcomes**. No intermediate work unblocks promotion.

## Known coverage-metric caveats (tighten later, not blockers)
- `pct_gap_computable` is currently proxied as `priced_move_pct present
  AND |pm| > eps`, not the stricter spec intent of "priced_move AND
  expected_move both available." Coverage may read green if one leg is
  silently missing.
- `pct_full_ees_computable` is proxied as `misprice_available` (which
  checks `conditional_misprice_score` non-NaN). Doesn't include
  short_interest presence in the "full" check.
- Both are acceptable for P0; tighten only if P1/P2 need stricter
  coverage discipline.

## Small enhancement queued (non-urgent)
Add `baseline_overlap_top30` (yesterday-vs-today) to the sidecar payload
— already computed by trapops, bringing it into the same artifact avoids
cross-artifact joins when reviewing diffs. Deferred; not a promotion
blocker.
