---
name: Forward Harness Audit
description: QA audit of all forward/live monitoring infrastructure — findings, fixes, and trust level
type: project
---

**Forward Harness Audit completed 2026-04-05** — verdict: MOSTLY TRUSTWORTHY WITH CAVEATS

**Why:** Forward monitoring outputs had no comprehensive QA. Several silent bugs found.

**Key findings and fixes:**
- IC dashboard history.jsonl had NO dedup guard → duplicates found and fixed
- Calibration ledger had NO dedup guard → fixed before duplicates accumulated
- Production monitor ranker drift was broken (wrong file path) → fixed
- Post-promotion monitor used fragile positional CSV parsing → fixed to DictReader
- Live shadow performance.csv had 4 duplicate rows → cleaned (28→24 rows)
- Coinvest shadow backfills have look-ahead in forward returns (prices from after as_of_date)
- Dashboard mixes date contexts for some data sources

**Trust guidance:**
- Daily monitors are PIT-safe and correct for operator use
- Do NOT cite forward evidence until coinvest shadow has ≥20 genuine forward days (~Apr 23)
- Calibration ledger needs catalyst resolutions before timing hazard evidence exists
- All backfilled artifacts (mtime ≠ as_of_date) should be treated as retrospective

**How to apply:** When evaluating forward results, check file mtime vs as_of_date.
If they differ, the artifact was reconstructed. Selection/overlap metrics are PIT-safe;
forward returns are NOT. Audit memo: `specs/changes/forward_harness_audit_2026_04_05.md`
