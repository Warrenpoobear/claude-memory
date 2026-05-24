---
name: Spec 050 A/B Evaluation Results
description: Selector engine A/B results — A4 best selector, DEFAULT best within-top-30 IC, selector≠ranker
type: project
---

## Spec 050 A/B Evaluation (2026-04-03)

**Key finding: best selector and best ranker are NOT the same thing.**

### Selection Delta (63d, top-30 vs DEM baseline)
- **S050_A4 (coinvest+inst 65%)**: Δ=+1.12pp/mo, t=1.37, hit=61%, overlap=43% — **best selector** but t<2.0 (shadow only)
- **S050_A5 (resid+inst)**: Δ=+0.23pp, t=0.17 — too weak, do not promote
- **S050_DEFAULT (blueprint weights)**: Δ=-0.53pp — **destructive as selector**

### Within-top-30 IC (63d)
- **S050_DEFAULT**: IC=+0.088, t=2.84 — **best ranker signal** (clinical/catalyst/survivability blocks help order within a set)
- **S050_A4**: IC=+0.005, t=0.18 — poor within-top-30 ordering
- **S050_A5**: IC=+0.028, t=1.03

### Regime (63d)
- All configs strong in bear (+4.9 to +7.6pp), weak in bull (-1.9 to -6.9pp)
- A4 has least-bad bull Δ (-1.88pp)

### Architecture conclusion
- **Selector anchor**: A4-style institutional signal (coinvest+inst dominant)
- **Ranker overlay**: DEFAULT-style blocks (clinical/catalyst/survivability) for within-top-30 ordering
- **Construction**: keep EW Top-30 as control

**Why:** The multi-block clinical-heavy structure is bad at picking which 30 names to own (coinvest dominates selection) but good at ordering them once selected.

**How to apply:** Do NOT use DEFAULT weights as selector. Use A4 config for selector. Use DEFAULT blocks through ranker. Shadow both arms daily.

### Four-Arm Replay (final, after opt_has_data fix + inst_delta_z forward-fill)
- **A4 selector**: **+1.64pp, t=2.14**, 70% hit — **CROSSES PROMOTION BAR** (was +1.12, t=1.37 before forward-fill)
- **A4+ranker**: **+1.85pp, t=2.47**, 70% hit — strongest arm, t=2.47
- **Bull regime improved**: A4 bull from -1.88 to **-1.17pp**, A4+ranker to **-0.98pp**
- **RW-EW spread**: still negative — EW Top-30 remains correct construction
- **Within-top-30 IC**: A4=+0.010 (flat), DEFAULT still best at +0.097 (t=3.09)
- **Bugs found+fixed**: (1) ranker gate `opt_has_data == "1"` vs `"1.0"`, (2) inst_delta_z all-zero in 47/71 snapshots (quarterly 13F only)
- **Forward-fill impact**: inst_delta_z carried forward max 3 months from 13F dates. Coverage: 33%→78% nonzero. This was the main driver of t-stat improvement.

### Ranker Composition Audit (5 variants on A4 top-30)
- **No variant improves within-top-30 IC** — best is R2 at +0.006 (t=0.22), all below significance
- **DEFAULT ranker is worst** at IC=-0.013 (t=-0.50)
- **All variants make bull regime worse** — R0 (no ranker) has least-bad bull at -1.88pp
- **RW-EW negative everywhere** — rank-weighting still not justified
- **Root cause**: A4 selector homogenizes the top-30 on institutional sponsorship, leaving too little clinical/catalyst/survivability variation to rank with
- **Verdict (composition audit only)**: ranker composition variants don't improve within-top-30 IC on research panel.
- **BUT**: True PIT backtest (below) shows the default ranker DOES add +0.21pp/mo on PIT snapshots.

### True PIT Backtest (definitive, 67 monthly periods from snapshots_pit_v2/)
- **A4 selector**: +2.23pp/mo hedged, +149.7pp cum, +2.13pp net, **t=2.35**, 67% hit, 22% turnover
- **A4+ranker EW**: +2.45pp/mo hedged, +163.9pp cum, +2.34pp net, **t=2.60**, 66% hit, 22% turnover
- **A4 vs baseline**: Δ=+1.64pp/mo, cum=+109.8pp, **t=2.13**, hit=70%
- **A4R vs baseline**: Δ=+1.85pp/mo, cum=+124.1pp, **t=2.47**, hit=70%
- **RW-EW**: -0.04pp, t=-0.39 — rank-weighting NOT justified, keep EW
- **Overlap with baseline**: only 13/30 — substantially different book
- **Regime**: bear +3.00pp (71% hit), neutral +6.62pp (93% hit), bull -0.26pp (46% hit)
- **Bull weakness persists** but is better than baseline (-0.26 vs -0.43)

### K-Sweep (true PIT, 25 bps, A4+ranker EW)
- **K=30 confirmed as optimal**: +2.34pp/mo net, t=2.60, 66% hit
- K=25 virtually tied (+2.32pp, t=2.27) — stable plateau from K=25 to K=35
- K=10 bad (-2.51pp Δ vs BL) — too concentrated
- K=50 best Δ vs baseline (+2.49pp, t=4.87) but lower absolute net (+1.98pp)
- Bull regime: only K=50 positive (+0.95); K=30 is -0.99 (least-bad in 25-35 range)
- Yearly: K=30 positive 4/6 years, 2020 negative across all K≤35 (early data effect)
- 1-SE rule: all K from 15-50 within 1 SE; K=30 has highest t-stat in stable zone

### Ranker Blend Sweep (18 variants tested on true PIT)
- **clinical_50 is the best blend**: opt=5%, inst=10%, clin=50%, cat=20%, surv=15%
- PIT result: **+2.34pp net, t=2.57**, best bull (-0.11pp), best Δ vs selector (+0.22pp)
- Clinical quality is the dominant ranker signal — top 3 blends all have clinical ≥ 35%
- IC and net are inversely correlated — bounded ranker works by selection perturbation, not ordinal ranking
- Neighborhood stable: clinical_40 at +2.30, clin_cat_heavy at +2.27
- `activation_require_options=False` — analyst rank works for all top-30 names
- **Locked in as production default 2026-04-03**

### Leading Book
> **A4 selector + analyst-rank ranker, equal-weight Top-30**
> Net-of-cost: +2.25pp/mo, t=2.52, 67 periods, true PIT, K=30 validated by sweep
> Forward shadow accumulating daily (s050_a4, s050_a4_ranker arms)

### Shadow Status
- 30-day forward shadow launched 2026-04-03
- 7 arms in coinvest_shadow_tracker.py (v2): baseline, coinvest_orig, coinvest_resid, coinvest_inst, resid_inst, s050_a4, s050_a4_ranker
- Day 0: s050_a4 overlap=40%, s050_a4_ranker overlap=36.7%
- Promotion bar: Δ > +0.20pp, t >= 2.0, IC positive, no regime < -0.50pp
- **Key forward question**: does ranker overlay change ordering on live data where options coverage exists?
