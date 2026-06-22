---
name: scoped-work-freeze-2026-06-22
description: Production model freeze remains; diagnostic/research/plumbing unfrozen under explicit read-only/non-scoring rules — 2026-06-22
metadata: 
  node_type: memory
  type: project
  status: active
  originSessionId: 2576507a-0c9a-455f-a1fe-f9cfd1822ad9
---

**Production model freeze REMAINS ACTIVE as of 2026-06-22.**
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

## Recommended next 3 tasks (in order)
1. Expectation coverage verification
2. Event EV shadow diagnostic
3. Scientific Cartography operational review

**How to apply:** Before starting any biotech work, check against the FROZEN list. If the change touches ranker/selector/sizing/final_score/portfolio/gates → stop. If it is purely diagnostic, read-only, or plumbing → proceed with explicit audit note.
