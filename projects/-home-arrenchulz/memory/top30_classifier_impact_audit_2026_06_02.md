---
name: top30_classifier_impact_audit_2026_06_02
description: Ticker-level catalyst scoring impact validation — 5 tickers CONFIRMED affected
metadata: 
  node_type: memory
  type: project
  status: resolved
  date: 2026-06-02
  scope: "RVMD, CELC, ERAS, DRUG, ALKS, MBX"
  related: "herald_darkness_resolved, governance_decision_path_c_2026_05_28"
  originSessionId: 7aaaa27d-e4f5-4c4c-8fec-8c82b385f194
---

# Top-30 Classifier Impact Audit — Complete (2026-06-02)

**Verdict:** 5 of 6 focus tickers show CONFIRMED catalyst scoring contamination

## Summary Table

| Ticker | Classification | Impact | Rank | Remediation Lane |
|--------|---|---|---|---|
| RVMD | SUPPRESSED_CLINICAL_EVENT | CONFIRMED | 8 | CATALYST_ATTRIBUTION_REVIEW_REQUIRED |
| CELC | SUPPRESSED_CLINICAL_EVENT | CONFIRMED | 20 | CATALYST_ATTRIBUTION_REVIEW_REQUIRED |
| ERAS | COLLISION_NOISE_100% | CONFIRMED | 13 | CATALYST_INPUT_CONTAMINATION |
| DRUG | COLLISION_NOISE_67% | CONFIRMED | 9 | CATALYST_INPUT_CONTAMINATION |
| ALKS | COLLISION_NOISE_100% | CONFIRMED | 19 | CATALYST_INPUT_CONTAMINATION |
| MBX | LEGITIMATE_EVENTS | NO_IMPACT | 29 | POOL_QA_ONLY |

## Key Findings

**RVMD (rank 8):** RASolute 302 Phase 3 ASCO presentation classified as `informational_only=True` + `event_category=other` (non-clinical). Despite suppression flag, catalyst_days=303 in rankings — Phase 3 clinical event entered scoring despite informational-only suppression.

**CELC (rank 20):** VIKTORIA-1 Phase 3 cohort results conference call marked `informational_only=True`. Catalyst_days=29 (in-window), catalyst_bucket=`binary_now` — clinical data release treated as near-term binary event despite suppression.

**ERAS (rank 13):** 100% collision-flagged noise (Schwarzkopf pistol auction, ASUS laptops, E Ink displays). All 3 events marked `collision_flag=True` + `needs_review=True` + confidence=0.20. Yet catalyst_days=183 in rankings.

**DRUG (rank 9):** 9 events, 8 collision-flagged (67% contamination). Includes pet medication article. Only 1-2 might be legitimate (Ardena CSO, Evosep proteomics). Yet catalyst_days=153 (tier A, high-opt).

**ALKS (rank 19):** Single event is Lilly company news (not Alkermes). Marked collision_flag=True + needs_review=True + confidence=0.30. Yet catalyst_days=92.

**MBX (rank 29):** Both events legitimate MBX investor announcements. Properly classified, no flags. Clean.

## Governance Impact

**Portfolio Status:** Phase 2 Day 1 locked (safe)  
**Forward Actions:** BLOCKED on catalyst-driven rebalancing/expansion until remediation lanes 1 & 2 complete

**Remediation requirement:** Both suppressed clinical events (RVMD/CELC) AND collision-contaminated events (ERAS/DRUG/ALKS) must be reviewed upstream before catalyst fields can be trusted for forward decisions.

## Artifact Location

- `/mnt/c/Projects/biotech_screener/biotech-screener/artifacts/audit/top30_classifier_scoring_impact_2026_06_01.md`
- Full methodology, event-by-event analysis, remediation lanes, governance classification

## Additional Finding: COGT (Rank 1)

Broader classifier scan reveals 1 additional Top-30 issue:
- **COGT** (rank 1): Both events marked needs_review=True (100% flagged)
- Events are legitimate clinical/regulatory, but all flagged for review
- Risk: Ranking stability at highest position may be confidence-dependent

See `broader_classifier_misclassification_2026_06_01.md` for full portfolio scan.

## Next Steps

1. **Lanes 1 & 2:** Schedule catalyst attribution review (not yet authorized)
2. **COGT Review:** Verify ranking stability with all-flagged events
3. **Phase 2 Day 1:** Locked. Carry current portfolio as-is.
4. **Forward catalyst decisions:** Hold until remediation gates clear

**This audit does NOT require classifier code edits.** It is read-only validation of impact.
