---
name: production-run-2026-05-15
description: "May 15, 2026 production run outcome — snapshot ready, QA YELLOW, Spec 104 Phase B PASS, ev_severity working, 13F partial refresh"
metadata: 
  node_type: memory
  type: project
  status: completed
  date: 2026-05-15
  run_start: 2026-05-15T08:55Z
  run_complete: 2026-05-15T13:49Z
  originSessionId: a070e46e-7a47-4a4a-85d8-178abfd2db03
---

# Production Run 2026-05-15

**Date:** May 15, 2026 (Thursday, 13F filing deadline)
**Run window:** 08:55 – 13:49 UTC (~5 hours)
**Status:** COMPLETE

---

## Snapshot

**File:** `data/snapshots/2026-05-15/rankings.csv`
**Status:** READY ✓
**Size:** 839 KB
**Created:** 2026-05-15 09:47 UTC
**Content:** 298 tickers, 335 columns

---

## Production QA Check

**Verdict:** YELLOW (11/12 pass)

| Check | Result | Notes |
|-------|--------|-------|
| Snapshot structure | PASS | 298 tickers, 335 columns |
| Gates | PASS | 37 gates, 5 WARN |
| Tracebacks | PASS | No errors |
| Sidecars | PASS | All present |
| Herald digest | PASS | 2 digests |
| Schema | PASS | Required fields OK |
| Severity formulas | PASS | All checks passed |
| Feature coverage | PASS | short_interest 99.0%, close_price 100%, market_cap 100% |
| Readiness | PASS | READY verdict |
| Lint | PASS | 8 files clean |
| Tests | PASS | All passing |
| **classifier_escalation_pool** | **FAIL** | **pool=788, clean=30/30, other_share=58.2%** |

**Single failure:** `classifier_escalation_pool` gate (58.2% other_share). Not a blocker; monitoring status.

---

## ev_severity_score Export Status

**Issue:** Previously flagged as potential production blocker

**Finding:** NO BLOCKER

```
Column: ev_severity_score
Location: Index 199 in rankings.csv
Coverage: 298/298 rows (100%)
Blanks: 0
Sample values: 0.006, 0.0, 0.0078, 0.0085, ...
Status: WORKING ✓
```

**Diagnostic note:** Script `diagnose_ev_severity.py` failed on import path (`No module named 'event_ev'`), but production export is functioning correctly. Diagnostic-script hygiene fix deferred (non-blocking): add repo root to `sys.path` or run as module.

---

## Spec 104 Phase B: Insider Diagnostic Coverage

**Verdict:** PASS ✓

**Measurement window:** 2026-05-11 through 2026-05-15 (5 trading days)

| Date | Nonblank % | Activity % |
|------|-----------|-----------|
| 2026-05-11 | 100.0 | 69.1 |
| 2026-05-12 | 100.0 | 68.5 |
| 2026-05-13 | 100.0 | 68.8 |
| 2026-05-14 | 100.0 | 69.5 |
| 2026-05-15 | 100.0 | 70.1 |

**Variance check:** 0.0 pp spread (threshold: 5.0 pp) — **PASS**

**Report:** `artifacts/insider_diagnostics/stabilization_report_2026_05_15.md`

**Closure:** All closure conditions satisfied.
- insider_net_buy_value_90d column present and populated across all 5 snapshots
- Coverage stable at 100% nonblank
- Activity rates consistent (68.5%–70.1%)
- **Status:** Insider signal remains diagnostic-only; NOT promoted to ranker input

---

## 13F Q1 2026 Refresh Status

**Filing deadline:** Today (2026-05-15)

**Ingestion:**
- Q1 2026 holdings file: `production_data/holdings_2026-03-31.json` (169 KB, May 15 09:09)
- Manager filings received: Partial (6/48 filed as of earlier check)

**Cohort state:**
- Distortion from cohort change (inst_delta inflated) — **NOT CLEARED**
- Reason: Incomplete filings; refresh is partial
- Jaccard gate: <0.70 (quarantine mode active)
- Next validation: Post-all-filings (~May 22–23)

**Gate verdict for 2026-03-31:**
- Overall: WARN (26 pass, 12 warn, 0 fail)
- Ruleset: 9f1f4587

**Impact on 2026-05-22 ranker review:**
- Governance mode: Evidence/briefing only
- No promotion gate opens until cohort clears
- Ranker research (D7/D8/D9) re-runs post-refresh on clean cohort

---

## Timeline & Processes

**Key events:**
- 08:55 UTC: `cron_watchdog.sh` running
- 09:24 UTC: `cron_daily_production.sh` started
- 09:32 UTC: `warm_caches.py` began loading 9 sources (SEC 8K, ClinicalTrials.gov, 13F, FDA)
- 09:47 UTC: Snapshot `rankings.csv` written
- 13:49 UTC: Snapshot detected by monitor, QA/diagnostics began

**Cache warming sources loaded:**
- SEC 8K, ClinicalTrials.gov, SEC 13F, FDA adcom, FDA regulatory, EUCTR, CTIS, ISRCTN, merged trials

---

## Operational Queue Resolution

All items completed:

```
✓ 1. Wait for snapshot — ready at 09:47 UTC
✓ 2. Production QA check — YELLOW (11/12 pass)
✓ 3. ev_severity diagnostic — Working (no export blocker)
✓ 4. Patch export path — Not needed
✓ 5. Spec 104 Phase B — PASS
✓ 6. Validate 13F/cohort — Partial refresh, distortion not cleared
```

---

## Holding Pattern

**Status:** Production holding until post-h20d (2026-05-26)

**Next steps:**
1. Monitor 13F filings through May 22–23 (completion expected)
2. Cohort quarantine clears post-all-filings
3. Architecture freeze lifts ~May 26
4. Spec 100 (IC tooling correction) — highest-priority post-freeze work
5. Ranker research (D7/D8/D9) — re-runs post-cohort-refresh

**No code changes authorized** until architecture freeze lifts and cohort validation complete.

---

## Decisions Recorded

**ev_severity_score:** Removed from production blockers. Export is working. Diagnostic script cleanup is non-blocking hygiene fix.

**Spec 104 Phase B closure:** Locked in. Insider signal diagnostic-only status confirmed across 5-day window (0.0 pp variance).

**13F cohort quarantine:** Expected to lift ~May 22–23. Distortion (inst_delta inflated) will clear post-refresh completion.

