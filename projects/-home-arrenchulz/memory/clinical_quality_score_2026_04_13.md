---
name: Clinical Quality Score — Spec 057
description: Clinical quality layer (endpoint, design, evidence, mechanism) — interaction signal, not standalone alpha. PIT-corrected. Conditional IC +0.10 within top coinvest (t=3.53).
type: project
originSessionId: a4125924-b3e9-4e43-9953-8cd4efb1a5de
---
## Spec 057: Clinical Quality Score (2026-04-13)

**IMPLEMENTED** as monitor-only shadow layer. Does NOT feed into selector, ranker, trap, or EES.

### Files
- `common/clinical_quality_score.py` — scoring module (4 sub-scores + composite)
- `scripts/enrich_trial_design.py` — enriches trial_records.json from AACT designs.txt + design_outcomes.txt
- `scripts/research/clinical_quality_interaction_test.py` — coinvest × CQ interaction test
- `tests/test_clinical_quality_score.py` — 50 tests
- `decision_engine.py` — 7 new DECISION_COLUMNS (monitor-only placeholders)
- `run_screen.py` — computation block after Calendar Alpha v2 enrichment
- Golden fingerprint updated: `7e8f3d4f7419`

### Sub-scores (composite weights)
- **endpoint_strength_tier** (30%): hard (+1.0) / semi_hard (+0.4) / surrogate (0.0) / unknown (0.0). Source: AACT design_outcomes primary endpoint text.
- **design_rigor_tier** (30%): gold_standard (+1.0) → observational (-0.5). Source: AACT designs.txt allocation + masking fields.
- **prior_evidence_tier** (25%): positive (+1.0) → negative (-1.0). Source: completed/terminated trial ratio. **PIT-corrected**: gates on `results_first_posted < as_of` AND `last_update_posted < as_of` for status observability.
- **mechanism_maturity_tier** (15%): validated (+1.0) → red_flag (-0.5). Source: TA classification + intervention keyword matching.

### PIT Audit (2026-04-13)
- Endpoint, design, mechanism: **CLEAN** (registration-time fields)
- Prior evidence: **CORRECTED** — removed ~3,500 status leaks + ~1,500 results leaks at typical snapshot. `last_update_posted` proxy for status observability.
- Trial records enriched from 2026-04-10 AACT extract (98.8% design match, 97.4% endpoint match)

### Key Finding: Interaction Signal, NOT Standalone Alpha
- **Standalone IC**: 20d +0.029 (t=1.84), 63d +0.039 (t=1.83) — borderline, not significant after PIT fix
- **Conditional IC within top coinvest Q5**: 63d **+0.103 (t=3.53), 71% hit rate** — STRONG and PIT-robust
- **Filter spread INVERTED**: high coinvest + low quality outperforms high quality by 3.51% at 63d
- **Why:** institutions early in lower-quality names → mispricing → upside. High quality = already priced.

### Sizing Tilt Backtest (2026-04-13) — REJECTED
- 4-arm backtest (60 snapshots): EW, B6^1.5, B6^1.5 + CQ tilt 0.15, B6^1.5 + CQ tilt 0.10
- **B6^1.5 alone is the best arm.** Both CQ tilt variants underperform (63d Sharpe: 0.656 vs 0.624/0.631).
- CQ tilt `strength=0.0` (disabled) is the correct production setting.
- IC-level signal is real but **not monetizable in portfolio construction** — noise penalty of reweighting exceeds the return improvement.
- Files: `event_ev/portfolio_sizing.py` (tilt code present but disabled), `scripts/research/cq_tilt_backtest.py`

### Correct Usage (validated)
- **Monitor-only, interpretive, non-allocative.** Informative but not monetizable.
- **NOT** a ranking signal, sizing lever, or filter. Tilt tested and REJECTED.
- **IS** a pricing-state indicator for: attribution, cohort analysis, operator context, tail-risk framing.
- Keep in daily report. Keep out of rank/sizing/selection.

### Production Stats (301 tickers)
- Score range: -0.25 to +1.0, mean +0.39
- Design: 215 gold_standard, 39 strong, 11 moderate, 19 weak, 17 unknown
- Endpoint: 36 hard, 31 semi_hard, 141 surrogate, 93 unknown
- Confidence: 273 high, 20 medium, 8 low

### What NOT to do
- Do NOT add CQ to B6 or selector
- Do NOT gate/filter names by CQ
- Do NOT use in trap or EES
- Do NOT promote without Checklist v2 pass (standalone fails, sizing tilt fails)
- Do NOT re-test sizing tilt without new evidence (backtest is definitive at current sample size)
