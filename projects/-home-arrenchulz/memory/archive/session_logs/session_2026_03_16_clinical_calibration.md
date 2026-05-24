---
name: session_2026_03_16_clinical_calibration
description: 51 commits — clinical backfill (18,689 trials, 4,909 outcomes, 1,587 p-value labels), PoS calibration (slope=0.032), v2 phase priors (±2 cap, 90% top-60 overlap), survivorship audit, production review
type: project
---

## 2026-03-16 Session — Clinical Calibration + Production Hardening

### Commits: 51 total (carries over from 2026-03-15)

**Production fixes:**
- P0: 6 missing gate names in GATE_ALLOWLIST (would crash every production run)
- DE schema test: 2 new sort contrib columns
- AdCom vote: nearest-prior-date fallback
- Forward-carry: catalyst_days override from estimated event date

**Clinical backfill pipeline:**
- CT.gov PIT history: 16 quarterly snapshots (2022-2026)
- Clinical history catalog: 18,689 trials, 310 tickers
- Clinical outcome events: 4,909 with results_first_posted
- CT.gov Results API: 1,587 high-confidence p-value labels (63.3% success)
- 8-K outcome labeler: framework built, needs full text (73/75 SAE boilerplate)
- Trial quality calibration: Phase 21pp lift, endpoint 8pp

**PoS calibration finding:**
- Composite calibration slope = 0.032 (not a clinical predictor)
- Clinical-only univariate: Phase 2 52.2%, Phase 3 73.2%

**V2 phase priors (Spec 023):**
- ±4 cap: 81.7% top-60 overlap (FAILED gate)
- ±2 cap: 90.0% top-60 overlap (PASSED gate)
- Production table: phase 2 18→20, phase 3 25→27
- Opt-in flag: --phase-scores-v2, metadata stamped

**Survivorship audit:**
- 2,220 terminated/withdrawn without labels (likely failures)
- Missing-failure pool is 1.4x larger than labeled pool
- Worst-case adjusted rate: 26.4% (if all missing = failure)
- V2 priors are survivorship-biased — ±2 cap provides protection

### Next Steps (in priority order)
1. **Clinical-only design-feature backtest** on the 1,587 labeled outcomes
   - Which features actually predict success in this universe?
   - Phase, endpoint, blinding, enrollment, therapeutic area
2. **Survivorship sensitivity** — label terminated trials via EDGAR full-text
   or treat TERMINATED status as medium-confidence negative
3. **Monitored forward utility** of ±2 v2 phase prior
   - Dual runs for 30-60 days
   - Daily compare artifact: top-60 overlap, rank shifts, tier changes
   - Alert if overlap < 85%
4. **April RR validation** — unchanged from prior session
   - Scorecard: 0/1 (TBPH wrong)
   - Remaining: ESPR (~Mar 30), BIIB (~Apr 3), CELC/PVLA (~Apr 1)

### What NOT to do
- Do not re-run composite-score calibration (already proven weak)
- Do not treat 63.3% as calibrated truth (survivorship bias)
- Do not widen ±2 cap without measuring survivorship correction first
- Do not enable v2 as default without 30-day parallel monitoring

**Why:** The clinical calibration pipeline is complete end-to-end. The
constraint is now data quality (missing failure labels) and forward
monitoring (v2 parallel runs), not more infrastructure.

**How to apply:** Next clinical work should focus on labeling terminated
trials and monitoring v2 forward utility. Do not build more scoring
infrastructure until survivorship bias is measured.
