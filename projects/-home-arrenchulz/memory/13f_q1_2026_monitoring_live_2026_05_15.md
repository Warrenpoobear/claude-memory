---
name: 13f_q1_2026_monitoring_live_2026_05_15
description: Q1 2026 13F cohort CLEARED (Jaccard 0.875 >= 0.70); quarantine lifted; ~35 trading days forward monitor accumulated
metadata: 
  node_type: memory
  type: project
  status: resolved
  expires: 2026-06-20
  resolves: 13f_q1_2026_preflight_2026_05_14
  originSessionId: 74a4f2ce-99f9-4c6c-9348-cd18fd837a80
---

# Q1 2026 13F Filing Monitoring — CLEARED

## Current Status (2026-05-24)
- **Cohort Jaccard:** 0.875 — CLEARED (threshold 0.70) ✓
- **Quarantine:** LIFTED
- **Forward monitor:** ~35 trading days accumulated
- Prior status (2026-05-15): 6/48 managers filed, Jaccard 0.536, quarantine active

## Downstream Unlocks
- Attribution analysis no longer restricted to observe-only
- 13F cohort now usable for validation (not alpha — still subject to alpha freeze and h20d DEFERRED)
- Phase 2 Step 5 (KG): unblocked on 13F gate; still blocked on h20d DEFERRED (Path B, 2026-05-24)

## Original Status (2026-05-15)
- Filed: 6 of 48 managers (12.5%)
- Holdings file: `holdings_2026-03-31.json` — 210 tickers, 345 positions
- Cohort Jaccard: 0.536 (quarantine active; threshold < 0.70)
- Monitoring: Automated weekday checks at 6:22 PM ET via CronCreate (job: 7b627c0e)

## Early Filers (6 managers)
- Renaissance Technologies (1037389) — 3,213 positions, filed 2026-05-14
- RTW Investments (1493215) — 88 positions, filed 2026-05-15
- Soleus Capital (1802630) — 93 positions, filed 2026-05-14
- Avidity Partners (1791827) — 46 positions, filed 2026-05-13
- Avoro Capital (1633313) — 33 positions, filed 2026-05-15
- Krensavage Asset (1609251) — 20 positions, filed 2026-05-15

**Only 2 of 6** (RTW, Avidity) overlap with Q4 2025 holdings → early filer sample bias expected.

## Cohort Constraints [ACTIVE QUARANTINE]
Jaccard 0.536 < 0.70 threshold triggers per [[13f_cohort_quarantine_prep_2026_05_01.md]]:
- ✗ Do NOT use for alpha/ranker/selector decisions
- ✓ Attribution analysis + observation lane only
- Top-30 changes treated as cohort-composition artifacts
- Lift path: 70% filing (≥34 managers) + post-refresh validation gates pass

## Key Portfolio Moves (Q4→Q1, RTW Investments)
- **Largest adds:** TNGX +2006%, CELC +532%, CGON +466%
- **Largest cuts:** NTRA -27.3%, MDGL -10.1%, PTCT -10.3%, ARGX -8.5%
- **Sentiment:** Significant reallocation; not yet interpretable (cohort incomplete)

## Monitoring Tools
- **Script:** `tools/monitor_13f_filing_progress.py` (auto-checks SEC EDGAR for new filings)
- **Status file:** `production_data/13f_filing_status.json` (progress tracking)
- **Cron:** Weekday 6:22 PM ET, expires after 7 days if session dies
- **Duration:** Through 2026-06-15 (filing deadline) or until quarantine lifts

## Timeline
| Date | Target | Trigger |
|------|--------|---------|
| 2026-05-20 | 50% filing (24+ mgrs) | monitoring continues |
| 2026-05-22 | 70% filing (34+ mgrs) | FIRST VALIDATION RERUN eligible |
| 2026-06-01 | 95% filing (45+ mgrs) | expect near-final cohort |
| 2026-06-15 | 100% filing deadline | all 48 should be in |
| 2026-06-20 | Quarantine lift decision | post-refresh gates pass/fail |

## Validation Gates (Pending)
Once ≥34 managers filed:
1. Cohort Jaccard ≥ 0.70 (stability check)
2. Producer freshness (post-refresh data quality)
3. Position completeness (no stale Q4 positions)
4. Top-30 change audit (artifact vs. signal separation)

## Related Memories
- [[13f_cohort_quarantine_prep_2026_05_01.md]] — quarantine trigger conditions
- [[13f_q1_2026_preflight_2026_05_14.md]] — pre-refresh validation planning
- [[regime_post_cohort_change_distortion_2026_04_28.md]] — inst_delta monitoring (separate shadow)

## How to Apply
**For next session/check-in:**
1. Verify CronCreate job 7b627c0e is still active
2. Check `production_data/13f_filing_status.json` for filing count
3. If ≥34 managers filed: rerun `check_13f_cohort_quarantine.py` validation gates
4. If Jaccard ≥ 0.70 + gates pass: lift quarantine, notify downstream
5. If gates fail: document issues, defer lift to next batch

**Do NOT:**
- Use fresh holdings for alpha/ranking decisions (quarantine active)
- Claim top-30 changes are signal (cohort artifact risk until full refresh)
- Promote institutions/signals based on early filer subset

---
**Artifact:** `artifacts/13f_q1_2026_monitoring_2026_05_15.md` (detailed findings)
