---
name: Freeze architecture, study live behavior (2026-04-19)
description: After Family B was scrapped, the directional call is to stop proposing model variants and instead audit the current live A4 selector + 2-feat ranker on recent snapshots. Attribution only, not performance.
type: project
originSessionId: a00492eb-ebe1-484d-bcf4-5901650c6669
---
Current production stack (pinned, do not propose replacements without explicit
new direction):

- Selector: A4 config in `run_screen.A4_SELECTOR_CONFIG` — clinical 0%,
  catalyst 15%, survivability 10%, institutional 65%, market 10%. Institutional
  signals: `coinvest_score_z` 65% + `inst_delta_z` 35%.
- Ranker: `feature_set="minimal_v2"`, 2 features — `coinvest_score_z` (+) and
  `financial_score` (−). Loaded from `production_data/ranker_v2_model.json`.
  Currently the Family C live pilot (coinvest weight capped at 0.02).
- **Deployed ≠ trained.** The minimal_v2 file is the Family-C capped vector
  (coinvest weight 0.02), not the trained 0.0613. "minimal_v2" without that
  qualifier is ambiguous.

## Live-model behavioral description (2026-04-19 audit)

Reach for this phrasing: **coinvest-driven selector + financial-score reversal
ranker.** On 2026-04-17 / 2026-04-15 snapshots the selector is ~96% Spearman
with its institutional block; clinical is flat (std=0, weight=0), catalyst is
a minor tilt, market_structure is noise, survivability is weak. The ranker
reorders ~10/30 names between selector_top30 and final_top30 and its
distinctive job is the `financial_score` reversal (Spearman −0.68 with
`ranker_v2_score`). Downstream layers (risk_flags, tier gating) affect
target_weight_pct, not portfolio membership — on the audit dates, final_top30
equals portfolio 30/30. There is no "IDZ" prune in the current code path.

See also `family_b_scrapped_2026_04_19.md`.

## Direction

1. Freeze architecture. Do not reopen Family A/B/C lanes, do not propose
   additional ranker features, do not propose new blocks.
2. Study the behavior of the frozen stack on live snapshots.
3. Do not run backtests or forward-return studies as part of this lane.

## What "study behavior" means here

Compositional attribution only:
- per-name decomposition of selector_score into block contributions
- per-name ranker adjustment magnitude vs selector ordering
- coinvest / inst_delta share of top-30 ordering on each live snapshot
- names whose top-book presence is ~entirely institutional-driven

**Why:** Family B was scrapped by direction before any wider eval (see
`family_b_scrapped_2026_04_19.md`), and the live/forward sample is too thin
to support any performance-based claim. Attribution on the current stack is
the one form of live work that doesn't either (a) relitigate a closed lane
or (b) overreach on a 1–2 point live sample.

## How to apply

- When asked "what's next for the model?", propose attribution/observability
  work against `tools/data_explorer/`, Spec 062 attribution logs, or the
  existing `selector_*_block` / `ranker_*_adjustment` columns in
  `rankings.csv`. Do not propose new features, new ranker lanes, or new
  selector modes.
- Per-snapshot tables, not rolled-up cross-snapshot statistics. Live n is
  effectively 1–2 at the time of this memo and does not support aggregates.
- If evidence emerges that an architectural change is needed, surface it as
  a question, not a patch. The freeze is explicit and the user reopens it.
