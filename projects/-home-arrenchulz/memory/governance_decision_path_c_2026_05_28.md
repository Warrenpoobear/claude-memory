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

## Hard Exit Conditions (Revoke Override)

- If forward_eval mean_ic < 0.0200 at 2026-06-03 window close → revert to HOLD
- If portfolio drawdown > 2pp relative to XBI → revoke immediately
- If concentration risk breaches operator-defined limits → escalate

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

## Key Insight

The institutional consensus on near-term catalysts (COGT, RVMD, SYRE, PRAX) is real, confirmed by refreshed 49-manager Q1 2026 cache. The policy/signal mismatch is not a failure—it's a regime shift in institutional positioning toward event-driven opportunities. Governance accepts this as intentional opportunity (Path C) while designing structural safeguards (Path A) for post-freeze implementation.

---

**Expires:** 2026-06-03 (forward eval IC window closes; decision reviewed at window end)
