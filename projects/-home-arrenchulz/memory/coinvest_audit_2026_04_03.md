---
name: Coinvest Anchor Audit
description: Forensic audit of coinvest_score_z signal from Spec 049 — decomposition, ablation, shadow tracker setup
type: project
---

## Coinvest Anchor Audit (2026-04-03)

Spec 049 claimed coinvest_score_z is the dominant selector and ranker. Forensic audit of 4 checks:

### Check 1: PIT Audit — PASS
- Filing-date guards are solid (`filing_date < as_of_date`, no datetime.now())
- Holdings pipeline is PIT-safe end-to-end
- Decision engine previously rejected signal (v1.9.0 comment: "look-ahead contaminated") — that referred to cross-sectional z-score issue, not raw data

### Check 2: Coverage Audit — CORRECTED
- **Original "artificial 100% coverage" concern was WRONG**
- All tickers have valid numeric `sponsor_tier1_count` (0 = no tier-1 sponsors, not missing data)
- 13F filings are per-manager, covering full universe — zeros are real observations
- `exclude_missing` mode would have zero effect
- **Real issue found: strong size-band confound** (L: 4.68 avg, XS: 1.59 avg, 42% zero)

### Check 3: Ablation — COMPLETE
- Size-residualized coinvest retains **79%** of selector improvement — signal is real beyond size
- Best bundle: coinvest+inst 65/35 (Δ=+1.85pp, t=3.56, IR=0.43)
- Honest bundle: size-resid+inst 65/35 (Δ=+1.62pp, t=2.79, IR=0.34)
- Binary coinvest nearly worthless (+0.25pp, t=1.25) — count granularity matters
- Pure EW is flat (-0.11pp) — confirms any positive Δ is real lift
- Clinical confirmed destructive (-0.68pp)
- Bull weakness persists across all coinvest variants (bear-market engine)

### Check 4: Forward Shadow — LIVE
- `tools/coinvest_shadow_tracker.py` — daily Step 5k.11b in production pipeline
- Tracks 5 strategies: baseline, coinvest_orig, coinvest_resid, coinvest+inst, resid+inst
- First 6 days seeded: CI overlap ~44%, RI overlap ~37% with baseline
- `artifacts/coinvest_shadow/` — daily JSON + history.csv + summary.md
- 30-day window starts 2026-04-03

### Artifacts
- `scripts/research/audit_coinvest_decomposition.py` — decomposition audit
- `scripts/research/ablation_coinvest_audit.py` — ablation runner
- `output/signals/coinvest_audit/` — all audit results (JSON + reports)
- `tools/coinvest_shadow_tracker.py` — daily shadow tracker (wired into pipeline)

### Verdict
**Candidate breakthrough confirmed, pending 30-day shadow.** Size explains ~21% (not fatal). The honest production candidate is size-resid+inst 65/35. Do NOT change anchor until shadow window completes (~2026-05-03).
