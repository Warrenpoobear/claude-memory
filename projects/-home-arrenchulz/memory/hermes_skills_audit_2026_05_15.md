---
name: hermes-skills-audit-2026-05-15
description: "Complete audit of 19 Hermes skills; all current, 5 screener skills received external updates (Specs 092–105), critical IC scope gap identified in Spec 095"
metadata: 
  node_type: memory
  type: project
  status: completed
  date: 2026-05-15
  originSessionId: a070e46e-7a47-4a4a-85d8-178abfd2db03
---

# Hermes Skills Audit — May 15, 2026 (Re-Audit #2)

**Audit date:** May 15, 2026 (Thursday deadline day)
**Prior audit:** May 12, 2026
**Scope:** All 19 Hermes skills

## Executive Summary

All 19 Hermes skills are **current and well-maintained**. The 5 screener skills received substantial external updates during the week's development sprint (Specs 092–105), all respecting the two-section structure (Framework Reference / Operational State) introduced in the prior audit. The remaining 14 skills are unchanged since Monday and require no action.

## Verdict by Skill (19 Total)

| Skill | Category | Status | Action |
|-------|----------|--------|--------|
| **financial-health** | Screener | Updated (Spec 101 severity export) | Current |
| **clinical-scoring** | Screener | Unchanged | Current |
| **biotech-validation** | Screener | Updated (Gate 7 collapse guards) | Current |
| **institutional-signal** | Screener | Updated (Spec 104, 13F status May 13) | **Minor: Filing deadline language stale** |
| **catalyst-resolution** | Screener | Updated (Specs 092, 097, 098) | Current |
| **screener-ops** | Screener | Updated heavily (Specs 101–105, Llama config) | Monitor growth |
| **ic-evaluation** | Screener | Updated heavily (Spec 095 critical finding) | Current |
| **selector-ranker** | Screener | Updated (Specs 093–100) | Current |
| **pe-pacing** | Frameworks | Unchanged | Current |
| **sfo-liquidity-architecture** | Frameworks | Unchanged | Current |
| **spending-liquidity** | Frameworks | Unchanged | Current |
| **memory-steward** | Agent Ops | Unchanged | Current |
| **openclaw-agent-optimize** | Agent Ops | Unchanged | Current |
| **self-improving** | Agent Ops | Unchanged | Current |
| **workflow-guide** | Town Platform | Town-managed | Current |
| **slide-deck-guide** | Town Platform | Town-managed | Current |
| **shared-install-guide** | Town Platform | Town-managed | Current |
| **skill-creation-guide** | Town Platform | Town-managed | Current |
| **town-github-coding-workflow** | Town Platform | Town-managed | Current |

## Critical Finding: Spec 095 IC Scope Gap

**Location:** ic-evaluation skill
**Severity:** CRITICAL
**Discovery date:** 2026-05-15 (this audit)

The IC backtest tool measures `composite_score`, NOT production `final_score`. **Ranker IC is unmeasured.**

**Impact:** All prior ranker IC claims are misattributed. Do NOT use for promotion decisions.

**Resolution path:** Spec 100 (ranker IC tooling correction) is the highest-priority post-freeze code change (post ~2026-05-26 h20d).

**Related memory:** [[spec_095_ic_scope_gap_critical]]

## Screener Skills: Detailed Changes

### 5 Skills Updated Externally (All Current)

1. **financial-health** — Spec 101 severity export added. Framework-Reference section now documents dual severity paths (truth-gate severity vs EV/sizing severity) with derived field contracts.

2. **biotech-validation** — Gate 7 collapse guards added. Detects signal-level collapse (coinvest_score_z SD collapse, catalyst_quality classification). Production verification confirmed.

3. **institutional-signal** — Three updates:
   - Insider signal (Spec 104) fully documented: blank/zero semantics, expectation isolation, promotion criteria
   - 13F Filing Cycle Status updated to May 13; post-filing action sequence documented
   - SEC_USER_AGENT preflight check added
   - **Minor:** "2 days away" deadline reference (written May 13) is now stale; deadline IS today (May 15)

4. **catalyst-resolution** — Specs 097/098 monitoring frameworks canonicalized. Spec 092 (BioShort) Phase A–D completion documented with returns data and pseudo-PIT caveat.

5. **screener-ops** — **Most heavily updated.** Major sections added:
   - Model configuration: Llama 3.3 70B via Together AI (switched from OpenRouter May 13)
   - Spec lifecycle extended: 071–105 (was 071–097)
   - Six new spec closures documented (087 B0/B2/C A, 088 B, 101, 104, 105)
   - Expectation Layer Coverage Gate (Spec 105) production specification
   - Export Contract Registry (Spec 101) and Diagnostic Fields Registry (Spec 104)
   - Backfill Tooling (Spec 102) and BioShort Research (Spec 092)
   - **Note:** Skill is growing rapidly; monitor for potential future split if exceeds ~500 lines

### ic-evaluation — Heavily Updated

Major updates:
- **CRITICAL:** Spec 095 IC Scope Gap — IC tool measures composite_score, not final_score; **ranker IC unmeasured**
- Spec 100 (tooling correction) — Highest-priority post-freeze code change
- Spec 105 (expectation coverage prerequisite) — Documented
- Insider signal status (Spec 104) — Diagnostic-only, isolation guard documented
- Deprecated evidence list updated to exclude ranker IC claims
- Forward shadow status: 28 trading days accumulated as of May 13
- coinvest_score_z IC caveat: universe-wide IC, not ranker-specific

### selector-ranker — Updated with Spec Details

- Spec 093: financial_score sign direction reconfirmed INTENTIONAL_STRESS_UPSIDE
- Spec 094: selector-only comparator, Jaccard overlap 42.7%, forward-return sparse
- Spec 095: scope issue cross-referenced to ic-evaluation
- Specs 096–099: monitoring gates and review dates added
- EV/Sizing Severity Consumption: new Decision Engine section
- Architecture freeze documented in operational state
- ranker_active_contract.py status: deferred to post-freeze merge

## Structural Observation

The two-section convention introduced in Monday's audit (Section 1: Framework Reference / Section 2: Operational State) is **working well**. External agents are correctly placing stable governance content in Section 1 and volatile operational snapshots in Section 2. This convention should be preserved going forward.

## Items to Monitor (Non-Blocking)

1. **13F filings:** Expected to land today (May 15 deadline). Post-filing, institutional-signal and ic-evaluation will need Section 2 refreshes (cohort quarantine results, IC decomposition).

2. **institutional-signal filing-deadline language:** "2 days away" reference (written May 13) now stale. Will self-correct on next update cycle.

3. **screener-ops growth:** At current growth rate, monitor for potential future sub-skill split (e.g., export-contracts, expectation-layer) to stay under ~500-line ideal.

4. **Forward shadow thresholds:** Cross-signal forward shadow approaching 30-day evaluation (28d accumulated as of May 13). Once reached, ic-evaluation will document results.

5. **Architecture freeze lift:** Scheduled ~May 26 (post-h20d checkpoint). Spec 100 implementation can begin post-freeze.

## Structural Decisions

✓ Two-section skill structure is standard and working
✓ All updates respect Framework Reference / Operational State partition
✓ Freshness dates on operational snapshots are being maintained
✓ No breaking changes across the skill fleet

