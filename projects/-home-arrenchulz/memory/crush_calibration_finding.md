---
name: crush_calibration_finding
description: Empirical IV crush study invalidates 0.45 default — clinical median is 1.04 (no crush), regulatory 0.98 T+1 / 0.90 T+3 (n=6). Relabel as stress scenario, defer bucket table to April.
type: project
---

## IV Crush Calibration Finding (2026-03-15)

### Key Result
The repo's `post_crush_iv_ratio=0.45` in `iv_crush_stress_test()` is empirically wrong.

| Bucket | T+1 Median | T+3 Median | T+5 Median | N |
|--------|-----------|-----------|-----------|---|
| CLINICAL | 1.04 | 1.08 | 1.04 | 77-82 |
| REGULATORY | 0.98 | 0.90 | 0.93 | 6 |

- Clinical events show NO systematic IV crush (median IV slightly increases)
- Real crushes exist in tail (ZBIO 0.55, XENE 0.56) but are exceptions
- Regulatory shows modest crush to 0.90 at T+3, but only 6 events

### Impact on Live Code
`iv_crush_stress_test()` drives:
- `iv_crush_breakeven_pct`
- `crush_adjusted_implied_move`
- `crush_loss_per_contract`

These flow through `compute_chain_analytics()` into live chain diagnostics.
The 0.45 assumption mechanically inflates modeled crush loss, raises modeled
breakeven move, and depresses crush_adjusted_implied_move — biasing diagnostics
toward "straddle too expensive."

### Recommended Correction (after April)
1. Relabel 0.45 as "severe crush stress scenario" not "default calibrated ratio"
2. After April regulatory outcomes add to sample, introduce bucketed base case:
   - CLINICAL: ~1.0 (no crush)
   - REGULATORY: ~0.90 (modest)
   - STRESS: retain 0.45 for downside scenarios only
3. Fix timing input: `compute_chain_analytics()` uses expiry-derived cat_days proxy,
   not true catalyst timing from the event pipeline

### Do NOT
- Replace 0.45 with 0.90 immediately (regulatory sample too small)
- Let crush outputs drive any decision rule yet (keep as diagnostic only)
- Forget to update tests that anchor to the old severe-crush assumption

**Why:** The calibration error is flowing into live diagnostics but the sample is too
small for a confident production bucket table. April outcomes are the right checkpoint.

**How to apply:** When crush model is discussed, reference this finding. Do not propose
recalibrating until April regulatory events add to the N=6 sample.
