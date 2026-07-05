---
name: scoped-work-freeze-2026-06-22
description: Production model freeze remains; diagnostic/research/plumbing unfrozen under explicit read-only/non-scoring rules — 2026-06-22
metadata: 
  node_type: memory
  type: project
  status: resolved
  originSessionId: 2576507a-0c9a-455f-a1fe-f9cfd1822ad9
---

> ⚠️ **SUPERSEDED (2026-07-05 reconciliation).** The scoped production model freeze
> (INC-2026-06-20-AUTOPUSH) below was **LIFTED 2026-06-24 by explicit operator clearance**
> — verified in repo governance state: commit `1e8a44ca` on main
> (`.claude/rules/operational-state.md`: "SCOPED PRODUCTION MODEL FREEZE — LIFTED
> 2026-06-24"), lift scoped to unblock Spec 100. **No commit re-froze it after 06-24.**
> The "freeze" mentions in commits `972db318`/`bc900928` (06-27/06-28) are a *different*
> thing — the **DEM Top-30 candidate freeze + NO_MODEL_CHANGE forward-validation protocol**
> (candidate/spec freeze during the out-of-sample observation window), NOT the INC code
> freeze. The FROZEN/UNFROZEN lists below are historical (pre-lift). The live governance
> gate for any eligibility/ranker-affecting change is now the forward-validation
> NO_MODEL_CHANGE window, not this freeze. See [[project-2026-forward-splits-unadjusted]].

**[HISTORICAL, pre-lift] Production model freeze was ACTIVE as of 2026-06-22.**
Scoped work freeze lifted for: safe research, verification, diagnostics, artifact generation, and plumbing.

**Why:** Latest change was plumbing/coverage improvement (expectation layer 80%→95% weighted feature coverage via surfacing `short_interest_pct`, `close_price`, `market_cap_mm`, `priced_move_pct` into rankings.csv). Real remaining gap is `insider_net_buy_value_90d` at 0% — not to be rushed as alpha.

## FROZEN (do not touch)
- Ranker weights, selector, sizing, `final_score`
- Production gates / portfolio actions
- Production cartography scoring
- Insider signal promotion
- Automatic trading/action language
- Bypassing XBI staleness gates
- Harvester autonomy
- External MCP registration into Hermes
- Semgrep MCP registration into Hermes

## UNFROZEN (allowed if read-only, non-scoring, non-sizing, non-trading, explicitly audited)
1. **Expectation field wiring verification** — confirm rankings.csv carries & consumes newly surfaced fields; deliverable: `EXPECTATION_LAYER_FIELD_COVERAGE_VERIFICATION_2026_06_22.md`; verdict: PASS or FAIL
2. **Expectation layer backfill (research-only)** — add existing fields to historical rankings.csv for research, no altering historical decisions/governance verdicts/ranker outputs; deliverable: `EXPECTATION_LAYER_BACKFILL_RESEARCH_2026_06_22.md`
3. **Event EV shadow diagnostic** — market-implied expectation, catalyst vs priced move, miscalibration flags; label: `EVENT_EV_SHADOW_DIAGNOSTIC_ONLY_NO_ALPHA_PROMOTION`
4. **Scientific Cartography artifacts** — disease map quality, asset-indication map, cluster readability, per-disease markdown summaries, source_refs/unknown/confidence; do NOT wire into scoring; next lane: Phase 12.1 Disease Map Operational Review or Phase 13 Manual Review UX
5. **Production observability/QA** — health report polish, stale/missing field flags, XBI freshness, snapshot completeness, forward_eval IC observability, Semgrep governance audit, CodeGraph hygiene
6. **Hermes/MCP** — read-only biotech-mcp daily brief; one-shot dry-runs via `hermes chat -q`; no scheduler touch, no jobs.json mutation, no autonomous git add/commit/push; do NOT re-enable weekly-skill-harvester

## Freeze-safe diagnostic tasks (all COMPLETE as of 2026-06-23)
1. Expectation coverage verification → PASS (8555ef25) — `docs/governance/EXPECTATION_LAYER_FIELD_COVERAGE_VERIFICATION_2026_06_22.md`
2. Event EV shadow diagnostic → committed (d5f15a0b, #388 merged) — `tools/event_ev_shadow_diagnostic.py`
3. Scientific Cartography Phase 12.1 review → committed (7afbd1db, on main) — `docs/governance/SCIART_PHASE12_1_DISEASE_MAP_OPERATIONAL_REVIEW_2026_06_23.md`

## Phase 13 planning
- Phase 13 remediation plan committed (cef457d3, local) — `docs/governance/SCIENTIFIC_CARTOGRAPHY_PHASE13_REMEDIATION_PLAN_2026_06_23.md`
- Order: R2→R4→R3→R5→R6. R1 (artifact promotion) is operator decision — Phase 13 implementation GATED on operator R1 confirmation.
- R6 (mechanism normalizer) is design-memo only in Phase 13; no implementation.

**How to apply:** Before starting any biotech work, check against the FROZEN list. If the change touches ranker/selector/sizing/final_score/portfolio/gates → stop. If it is purely diagnostic, read-only, or plumbing → proceed with explicit audit note.
