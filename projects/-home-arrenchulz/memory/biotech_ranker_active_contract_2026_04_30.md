---
name: ranker-active-contract-branch-unapplied
description: ranker_active_contract.py module exists on unmerged branch; manual enforcement accepted; defer merge until after h20d checkpoint
metadata:
  type: project
---

# ranker_active_contract.py — Branch Status (2026-05-14)

**Status:** Branch exists but unapplied. Manual enforcement accepted per operator decision (2026-05-13).

**Module Details:**
- Branch: `hygiene/ranker-active-contract-2026-04-30`
- Commit: `e7c0ee47`
- Size: 21 drift tests, ~150 lines
- Schema: Tests for field-value-drift in ranker inputs across snapshots

**Why Unapplied:**
- Ranker is frozen (Spec 086 v1.14.0); no new fields expected until Spec-driven promotion
- Active fields (coinvest_score_z, financial_score) are static across snapshots
- Unintended drift is caught by production monitoring (ic_health_monitor, sentinel)
- Merging now is low-ROI during observation period (h20d checkpoint 2026-05-26)

**Decision (2026-05-13):**
- Accept manual enforcement (code review + commit-level audit diffs)
- Defer module merge until: (a) next ranker retrain approved, OR (b) Spec-driven promotion with field-contract change

**When to Merge:**
- Post h20d checkpoint (2026-05-26) if ranker unfrozen
- Merge requires: (a) test suite audit, (b) integration test in run_screen.py pre-ranker gate, (c) Checklist v2 addition "active contract verified"
- Document field list in MODEL_DOCUMENTATION.md post-merge

**Audit Updates (2026-05-14):**
- ✓ held_spec_ledger_2026_05_11.md updated
- ✓ ranking_alternatives_research_2026_05_08.md updated
- ✓ t1_ranker_anatomy_2026_05_08.md updated
- ✓ t4_risk_analysis_2026_05_08.md updated
- ✓ agent_fleet_investment_logic_audit_2026_05_06.md updated

All 5 audit documents now reference the decision and branch status correctly.

---

**Related:** [[policy-alpha-freeze-2026-04-04]], [[ranking_methodology_spec_backlog_2026_05_13]]
