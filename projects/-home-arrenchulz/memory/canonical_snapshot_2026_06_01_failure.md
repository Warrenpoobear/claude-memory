---
name: canonical_snapshot_2026_06_01_failure
description: "2026-06-01 production snapshot has broken composite scoring — CANONICAL_BAD, use 2026-05-29 for Phase 2"
metadata: 
  node_type: memory
  type: project
  status: active
  severity: critical
  date: 2026-06-01
  originSessionId: 7aaaa27d-e4f5-4c4c-8fec-8c82b385f194
---

## Incident: Canonical Snapshot Composite Scoring Failure

**Date:** 2026-06-01  
**Status:** CRITICAL — Canonical snapshot corrupted  
**Verdict:** CANONICAL_BAD (not a run-path mismatch)

## Problem

The locked 2026-06-01 production snapshot (`data/snapshots/2026-06-01/rankings.csv`) produces near-zero composite scores despite normal component scores.

**Example (canonical snapshot data):**
- DNTH: composite=0.0566, smart_money=38.1, clinical=-41.9, financial=-41.7
- NRIX: composite=0.0599, smart_money=40.9, clinical=-22.5, financial=-33.9
- URGN: composite=0.1000, smart_money=27.6, financial=-36.6

**Result:** Top 30 collapses to tier-A clinical holdings only; previous leaders (BMRN, BEAM, BNTX, RVMD) absent.

## Root Cause

Composite aggregation function broken. Component scores are normal (SmartMoney 27–40, Financial -26 to -41), but final composite scoring produces 0.06–0.10 instead of expected 50–60 range.

**Not a data quality issue.** Not missing artifacts. Not SmartMoney disabled. Pure scoring logic regression.

## Impact

- **DO NOT use 2026-06-01 for Phase 2** — portfolio is broken
- **Lock 2026-06-01 snapshot as corrupted** — do not promote to production
- **Rollback to 2026-05-29** — last known-good snapshot (48 files, normal top-30)

## Supporting Evidence

- **Canonical vs ad-hoc overlap:** 0/30 (zero intersection)
- **Canonical top 3:** DNTH(0.06), NRIX(0.06), URGN(0.10) — all near-zero
- **Ad-hoc top 3:** BMRN(60.82), BEAM(59.34), BNTX(57.51) — normal scores
- **Git HEAD:** `124ea911` (Hermes fix, unrelated to scoring)
- **Metadata:** snapshot_manifest.json shows `all_sources_ready: N/A` (incomplete metadata)

## Diagnostics Conducted

1. ✓ Git status and recent commits
2. ✓ Top-30 rank/score comparison (canonical vs ad-hoc)
3. ✓ Overlap analysis (0/30)
4. ✓ File inventory (canonical has 37 JSON, missing analytics)
5. ✓ Composite scoring inspection (components normal, aggregation broken)
6. ✓ Run-path isolation (ad-hoc is test path, canonical is production path)

**Conclusion:** This is not a configuration mismatch. The canonical production pipeline generated a broken snapshot.

## Governance Decisions

1. ✅ **2026-06-01 QUARANTINED** — Do not use for Phase 2 (composite aggregation broken)
2. ⏸️ **Phase 2 SUSPENDED** — SUSPENDED_PENDING_COMPOSITE_AGGREGATION_DIAGNOSIS
3. 📌 **2026-05-29 REFERENCE ONLY** — Last known-good snapshot for comparison; NOT a replacement Day 1 without explicit governance approval
4. 🔍 **Next diagnostic:** Trace Module 5 composite aggregation collapse (why 0.06–0.10 from normal components)
5. ⛔ **No rollback, no relock, no Phase 2 restart** until root cause isolated

## References

- `data/snapshots/2026-06-01/rankings.csv` — corrupted canonical
- `data/snapshots/2026-05-29/rankings.csv` — last known-good (use this)
- Git HEAD: `124ea911` (unrelated Hermes fix)
- Diagnostic: Full screen run with `--diagnostics full` flag (2026-06-01 12:26 UTC)

## Follow-up

Investigate composite scoring in Module 5 ranker. Likely cause:
- Gating logic too aggressive (100% valuation gating)
- Weighting mismatch (components normal, composite multiply/aggregate incorrect)
- Regime forced to UNKNOWN (0% confidence) → haircut applied to all scores?
