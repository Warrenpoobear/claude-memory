---
name: governance_ic_evidence_hold_2026_05_13
description: Governance hold on ranker IC-based promotion claims until Spec 100 tooling fix
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 64125f0f-c9ea-4206-bd73-07c2f93a88dc
---

**IC Evidence Hold Governance — RESOLVED (Spec 100, 2026-05-17)**

Spec 100 tooling fix completed. Prior composite_score IC evidence remains INVALIDATED. New final_score IC is corrected baseline, ready for forward validation and promotion evaluation post-architecture-freeze-lift (~2026-05-26).

**Why**: Spec 095 audit discovered that `run_rank_ic_backtest.py` measures `composite_score`/`composite_rank`, not production ranker `final_score`/`actionable_rank`. The two rankings are effectively different (0.25 correlation, only 7/30 top-30 overlap). Any "ranker IC" claims may actually be composite_score IC.

**How to apply**: 
- ✅ **Prior audits remain valid**: Specs 093, 094, 095 findings stand (financial_score stress-upside confirmed, ranker membership changes real, evaluation scope problematic)
- ❌ **Do not cite IC evidence**: Cannot claim "ranker IC shows X" for promotion decisions
- ⏸️ **Defer IC-dependent claims**: Any feature that relies on IC validation must wait for Spec 100 tool fix
- 📋 **Track composite IC separately**: If composite_score IC is computed, label it clearly (⚠️ COMPOSITE_SCORE_IC, not ranker IC)

**Affected**: Future decision on Specs 098, 099 (catalyst timing, clinical orthogonality) if those specs propose to cite IC evidence for promotion.

**Unblocked**: Specs 093, 094, 095, 096 can proceed (they are investigation/audit only, not promotion).

**Resolution**: Once Spec 100 tool is implemented and output metadata is explicit (score_field, universe, row_count), IC-based promotion claims are again valid.
