---
name: ranking_methodology_spec_backlog_2026_05_13
description: "7-spec audit backlog for ranking methodology improvements (descriptive/research only, no implementation)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 64125f0f-c9ea-4206-bd73-07c2f93a88dc
---

**7-Spec Ranking Methodology Backlog** — Created 2026-05-13

All specs are descriptive/research audits with clear promotion blockers. No implementation, no scoring changes.

### Priority Order (1-7)

1. **Spec 093** — Financial_score sign-direction audit
   - Correctness prerequisite: is negative weight intentional (stress-upside) or artifact?
   - 2-4 hours; documentation only
   - Blocks: ranker retrain decision

2. **Spec 094** — Selector-only comparator
   - Does ranker add marginal value over selector-only on forward returns/drawdown/churn?
   - 4-6 hours; postmortem analysis
   - Foundational baseline; unblocks Specs 095-099 if ranker justified

3. **Spec 095** — Top-60 evaluation-scope correction
   - Define correct IC measurement universe (eligible/top-60 vs full 341 tickers)
   - 2-3 hours; evaluation tool audit
   - Blocks: ranker IC interpretation

4. **Spec 096** — Gate/ranker separation doctrine
   - Classify all signals as GATE / RISK_OVERLAY / ALPHA_CANDIDATE / SHADOW_ONLY
   - 3-4 hours; documentation + audit
   - Enables: Spec 072 vNext architecture clarity

5. **Spec 097** — Event-EV prospective monitoring gate
   - Track bound HIT/MISS records with event_ev_p_hit; ≥30 threshold for promotion
   - 1-2 hours; monthly tracking setup
   - Blocks: event-EV promotion until ≥30 samples

6. **Spec 098** — Catalyst timing shadow monitor
   - Shadow-track catalyst_days, catalyst_decay_w, binary_quality post-hygiene-fix
   - 4-5 hours; signal extraction + stability validation + orthogonality pre-check
   - Blocked by: catalyst hygiene stability (2026-05-20) + ≥30 postmortems
   - Blocks: catalyst promotion decision

7. **Spec 099** — Clinical orthogonality audit
   - Validate clinical_design_quality independence from coinvest + other signals
   - 3-5 hours; correlation analysis + PCA + conditional IC
   - Blocked by: 13F refresh (2026-05-15)
   - Blocks: clinical promotion pathways if dependent

### Framework Rules

**Do NOT create specs for:**
- Ranker retrain
- New production ranker
- Clinical promotion
- Event-EV promotion
- Polymarket/options promotion
- Weight changes

**All specs follow:**
- Problem statement
- Investment logic
- Exact evidence needed
- Data constraints
- Out-of-scope
- Tests/analysis commands
- Pass/fail criteria
- Rollback/no-op statement
- Expected timeline
- Related specs

### Context

User explicitly corrected earlier ranker-improvement answer (2026-05-13):
- "Clinical remains shadow unless independently validated post-cohort/post-PIT AND orthogonal to coinvest"
- "Coinvest is not alpha" was too strong; coinvest is quality/context gate
- Timeline estimates were over-defensive
- Framework shift: descriptive research now → promotion blockers → implementation only if evidence clear

All 7 specs document prerequisites and decision gates, not implementation paths.
