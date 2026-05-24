---
name: april_validation_plan
description: Post-April validation sequence for total_volume_z signal and options lane — wait for BIIB/CELC/PVLA/TBPH outcomes, then run 4-step validation
type: project
---

## April Validation Plan (written 2026-03-15)

### The Signal: total_volume_z
- IC=0.134 vs signed_gap, incremental IC=0.122 after catalyst timing control
- First options signal to survive controls with meaningful directionality
- Interpretation: higher pre-event options volume → positive event gap

### Target Events
- CELC, PVLA, TBPH ~April 1 (SEC 8-K data readouts) — is_hard=1 confirmed
- BIIB PDUFA is **May 24** (not April 3 as originally noted; corrected 2026-03-26)

### Validation Sequence (do NOT skip steps)
1. **April revalidation**: rerun eval_options_signal_pack.py with --hard-filter-mode snapshot_native after events resolve. IC must hold above 0.10.
2. **Walk-forward split**: 2022-03 to 2024-06 vs 2024-07 to 2026-03. IC must be positive in both halves.
3. **Threshold calibration**: test top/bottom tercile vs continuous z-score.
4. **Interaction test**: total_volume_z AND rr_25d_canonical as joint signal.

### Production Path (if validation passes)
- Ablation: add total_volume_z as bounded modifier to secondary-regulatory 31-90d lane
- Sharpe improvement must be >= 0.1
- Top-60 overlap must be >= 0.90
- Start at w=0.05 (not 0.15)
- Promotion template: same as alpha_cohort_tiebreak (100% overlap, max rank shift 2, 0 tier-A regressions)

### Crush Model Status
- CLINICAL T+1 median = 1.04 (n=100): essentially no crush on average
- REGULATORY T+1 = 0.98, T+3 = 0.90 (n=6): modest, needs more events
- Scenario-based architecture already deployed (base + stress)
- Confirm catalyst_family flows correctly into iv_crush_stress_test() before April

### Pre-April Checklist
- [x] price_history.csv current through 2026-03-13 (auto-refreshes on screen runs)
- [x] All 4 target tickers have full price history
- [x] is_hard_catalyst now in rankings.csv (natively set on new snapshots)
- [x] Forward-carry state active (prevents hard source disappearance)
- [x] 4-year historical panel rebuilt (5.68M surface rows, 254K features, real volume)
- [ ] Run daily screens through April to accumulate snapshot_native hard-catalyst data
- [ ] After April 3: rerun all validation commands

### Exact April Rerun Commands
```bash
# 1. Signal pack with snapshot_native
python3 scripts/research/eval_options_signal_pack.py \
  --snapshots-dir data/snapshots --price-csv production_data/price_history.csv \
  --iv-features data/research/historical_iv_features.csv \
  --event-move-table data/research/event_move_table.json \
  --event-subset hard --hard-filter-mode snapshot_native \
  --max-catalyst-days 90 --horizons 5,21 --min-obs 10 --walkforward \
  --output-dir output/options_signal_pack_snapshot_native

# 2. Surface alpha pack with snapshot_native
python3 scripts/research/eval_surface_alpha_pack.py \
  --snapshots-dir data/snapshots --price-csv production_data/price_history.csv \
  --iv-features data/research/historical_iv_features.csv \
  --event-move-table data/research/event_move_table.json \
  --event-subset hard --hard-filter-mode snapshot_native \
  --max-catalyst-days 90 --signals actual_implied_move_pctile,atm_iv_change_5d \
  --horizons 5,21 --min-obs 10 --walkforward monthly \
  --output-dir output/surface_alpha_pack_snapshot_native

# 3. Crush recalibration
python3 scripts/research/measure_iv_crush.py \
  --iv-features data/research/historical_iv_features.csv \
  --snapshots-dir data/snapshots --price-csv production_data/price_history.csv \
  --event-subset hard --hard-filter-mode snapshot_native \
  --event-window 60 --pre-offsets 3,1 --post-offsets 1,3,5 --min-obs 5 \
  --output-dir output/iv_crush_calibration_snapshot_native
```

**Why:** The signal is real enough to plan around but not yet confirmed on PIT-native hard events. April is the gate.

**How to apply:** When asked about options promotion before April outcomes, point here. Do not propose weight changes until steps 1-2 pass.
