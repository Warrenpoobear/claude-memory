---
name: options_scope_reset_phase1_2026_06_30
description: "Options infra scope reset — EES/options divergence framing rejected as same circularity as EES v3; approved scope is Phase 1 diagnostic repair only (overlay/null-coding), no selector/ranker/alpha path"
metadata: 
  node_type: memory
  type: project
  status: active
  related: 
    - ees_v3_structural_failure_2026_04_30
    - options_research_policy_2026_04_06
    - spec059_options_event_overlay_2026_04_06
    - biotech_options_audit_2026_05_05
    - scoped_work_freeze_2026_06_22
    - options_alpha_revalidation_2026_04_05
  originSessionId: 0933964e-5940-4edd-8ddd-597d5e54ae08
---

## Corrected thesis (2026-06-30)

Options do not belong in the biotech model as alpha, selector, ranker, or
probability-gap machinery under current policy. They belong as **overlay
diagnostics and market-expectation context**: priced-move integrity,
event-vol diagnostics, liquidity confidence, staleness/null handling,
human-review overlay support only.

**Why:** A detailed options-infrastructure proposal (4-engine design:
chain normalization, implied-distribution, EES/options divergence,
quality/execution-readiness) was reviewed. The divergence engine
(`probability_gap = internal_p_success - options_implied_p_success`,
`ees_options_divergence_score`) is structurally the same move as the
EES v3 thesis closed 2026-04-30: extracting "expectation error" from
options-surface transforms alone. EES v3's dominant component was proven
a near-identity of `priced_move_pct` (Spearman -0.978), and three
independent residualization methods returned IC≈0. Forward vol, skew,
risk reversal, term structure are all still transforms of the same IV
surface — they do not qualify as the "fundamentally new data" that
[[options_research_policy_2026_04_06]] (37 signals tested, options-as-alpha
CLOSED) requires to reopen the lane.

**How to apply:** Reject any future proposal that frames options vs.
internal-model agreement/disagreement as a promotable score, unless it
introduces genuinely external data (order flow, market maker positioning)
AND the internal-model side is independently demonstrated not to be a
transform of pmv. Until then, route any such proposal to this memo and
to [[ees_v3_structural_failure_2026_04_30]] first.

## Rejected (do not build)

- `ees_options_divergence_score`
- `probability_gap` (internal_p_success − options_implied_p_success)
- `liquidity_adjusted_gap_score` as a promotable alpha feature
- Any "eventual selector/ranker/final_score promotion" path for options
- Any claim that forward vol / skew / risk reversal constitute "fundamentally new data"

## Approved — Phase 1 only (shadow/overlay, diagnostic repair)

1. Audit `priced_move_pct` and `straddle_price → priced_move_pct` formula + normalization vs `close_price`
2. Enforce `MIN_OI_THRESHOLD` (open in [[biotech_options_audit_2026_05_05]] — currently defined but not enforced)
3. Add ingestion-time staleness checks (also open in the 2026-05-05 audit)
4. Add explicit null reason codes (13-code set: NO_OPTIONS_CHAIN, NO_RELEVANT_EXPIRY, STALE_CHAIN, WIDE_BID_ASK, LOW_OPEN_INTEREST, LOW_VOLUME, BAD_UNDERLYING_PRICE, BAD_OPTION_QUOTE, CORPORATE_ACTION_MISMATCH, EVENT_DATE_UNCERTAIN, EXPIRY_MISALIGNED, SURFACE_FIT_FAILED, DIAGNOSTIC_ONLY_POLICY_CLOSED)
5. Liquidity-confidence weighting on existing diagnostic *display* outputs only
6. Audit [[spec059_options_event_overlay_2026_04_06]] sidecars (`surface_diagnostics.py`, `branch_sensitivity.py`) before adding any new fields — likely overlapping coverage
7. Coverage/integrity reports; tests proving options fields stay disconnected from selector/ranker/final_score

Governs under [[scoped_work_freeze_2026_06_22]] — diagnostics unfrozen, ranker/selector/sizing/final_score/portfolio stay frozen regardless of this note.

## Promotion status

No promotion path approved. Any future reopening of options-as-alpha requires a separate governance memo and genuinely new (non-IV-surface) data — not a Phase 1 deliverable.
