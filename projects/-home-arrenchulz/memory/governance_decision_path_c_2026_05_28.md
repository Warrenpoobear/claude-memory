---
name: governance-decision-path-c-2026-05-28
description: Governance approved Path C (temporary policy override) for catalyst timing; Path A (durable gates) mandated post-freeze
metadata: 
  node_type: memory
  type: project
  status: active
  decision_date: 2026-05-28
  expires: 2026-06-03
  related: 
    - catalyst-concentration-diagnosis
    - forward-eval-ic-monitoring
  originSessionId: ee8dbb2b-22a4-49ff-8d99-f5e261281a6f
---

# Governance Decision: Path C Approval — 2026-05-28

**Status:** APPROVED  
**Effective:** 2026-05-28 snapshot through 2026-06-03 (forward eval IC window)  
**Decision maker:** Operator (dschulz@wakerobin.co)

## Primary Decision: Path C — Temporary Policy Override

**Approved to relax catalyst-timing policy temporarily:**
- Allow 0–30d binary catalyst exposure up to 40–45% (vs legacy 10% policy)
- Allow 91–180d exposure to fall to observed regime level (26.7%, vs legacy 55%)
- Keep daily monitoring active through 2026-06-03

**Why:** Institutional data contamination remediated (49-manager cohort confirmed); near-term concentration is real institutional consensus, not data artifact or selector bias. Readiness HOLD caused by policy/signal mismatch, not data failure.

## Hard Exit Conditions (2026-06-03 Window Close) — AMENDED

**CRITICAL GOVERNANCE CORRECTION (2026-05-28):** PIT cache will not have filled 20-day forward-return horizons until mid-June, *after* window close. Mean IC evaluation may be **IC_UNOBSERVABLE** rather than above/below floor.

**Revised exit logic:**

1. **If mean_ic is available (observable):**
   - mean_ic ≥ 0.0200 → Path C remains valid; window closes successfully
   - mean_ic < 0.0200 → revert to HOLD pending Path A

2. **If mean_ic is unavailable (IC_UNOBSERVABLE):**
   - PIT cache has no filled 20-day forward-return horizons (expected until mid-June)
   - Classify as IC_UNOBSERVABLE, not PASS or FAIL
   - **Operator review required:** Choose one:
     - Extend observation window until first valid 20-day IC prints (typically mid-June), then evaluate at that date
     - Revert to HOLD pending Path A (conservative, closes override immediately)
   - Document decision and rationale in governance ledger

3. **Pre-window-close emergency exits:**
   - If portfolio drawdown > 2pp relative to XBI before 2026-06-03 → revoke immediately
   - If 13F cohort Jaccard drops below 0.70 or new quarantine triggers → escalate for review

## Parallel Design Track: Path A (Durable Fix)

**Post-freeze implementation target:**
- Max 30% weight in 0–7d catalysts (hard constraint in portfolio construction)
- Min 40% weight in 90+d catalysts (hard constraint in portfolio construction)
- Decouple institutional signal from portfolio timing distribution
- Implement in portfolio construction layer (NOT ranker)

**Spec target:** Design post-freeze (2026-06-01+), implement as architectural item

**Why:** Selector tier assignment already favors 8–90d (38.2% A-tier vs 25.5% near-term); signal works correctly. Ranking concentration on near-term is driven by institutional consensus strength (real signal), not bias—should remain visible. Portfolio layer should enforce timing diversification independently.

## Why Not Path B or Path D

**Path B (Coinvest Dampening):** Deferred until Spec 95/100 IC review signals IC dampening is acceptable. Premature suppression could distort evidence base.

**Path D (Exception Trade):** Path C provides cleaner governance wrapper with hard exit conditions vs pure HOLD waiver.

## Governance Accountability

**This is NOT a clean readiness pass.** Explicit policy exception:
- Time-bounded (2026-05-28 to 2026-06-03)
- Daily monitoring with hard exit conditions
- Durable fix (Path A) mandated as follow-on
- Full audit trail in artifacts/readiness/

**Documentation:**
- `/mnt/c/Projects/biotech_screener/biotech-screener/artifacts/readiness/GOVERNANCE_DECISION_PATH_C_2026_05_28.md` (full decision memo)
- `/mnt/c/Projects/biotech_screener/biotech-screener/artifacts/readiness/CATALYST_CONCENTRATION_DIAGNOSIS.md` (updated with decision note)

## Related Decisions

- **13F Cohort Clearance:** Jaccard 0.875 ≥ 0.70 (2026-05-24); quarantine lifted; Phase 2 Step 5 KG unblocked on 13F gate
- **h20d Override Decision:** Manual override lifted freeze despite failed 13F validation (2026-05-26); Phase 2 Step 5 unblocked
- **Forward Eval IC Monitoring:** 2026-05-27 to 2026-06-03, floor 0.0200; escalate if below at window close
- **Spec 089 Phase 1.5A:** Ranker governance KG design locked; implementation deferred to Phase 2 Step 5 (would provide second-order gating like this)

## IC Measurement Gap & Observability Timeline

**Current state (2026-05-28):**
- Forward eval IC ledger deployed and integrated into production pipeline (commit f542a31b)
- PIT cache exists but has **no filled 20-day forward-return horizons**
- Mean IC cannot be computed until sufficient forward price data accumulates

**When IC becomes observable:**
- Forward eval gate requires 10+ prior snapshots with filled 20-day return horizons
- First meaningful IC prints expected: ~2026-06-17 (when 20-day forward returns for late May become available)
- This is **after** the 2026-06-03 Path C window close

**Implication:**
- 2026-06-03 evaluation will likely result in IC_UNOBSERVABLE, not above/below floor
- Operator decision required at that point: extend window or revert to HOLD (documented above)
- This is not a measurement failure—it's a natural consequence of real-time portfolio monitoring

**Mitigation:** IC ledger auto-populates once horizons fill (no action needed). Expected IC trajectory visible by early-to-mid June.

## Key Insight

The institutional consensus on near-term catalysts (COGT, RVMD, SYRE, PRAX) is real, confirmed by refreshed 49-manager Q1 2026 cache. The policy/signal mismatch is not a failure—it's a regime shift in institutional positioning toward event-driven opportunities. Governance accepts this as intentional opportunity (Path C) while designing structural safeguards (Path A) for post-freeze implementation.

---

**Expires:** 2026-06-03 (forward eval IC window closes; decision reviewed at window end; IC_UNOBSERVABLE clause governs if IC unavailable)
