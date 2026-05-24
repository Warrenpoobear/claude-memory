---
name: Spec 092 bioshort historical backfill — Phase A shipped, Phases B-D held
description: Phase A docs+inventory shipped 2026-05-07; Phases B/C/D held on Spec 087 B1b first-fire validation; Phase B locked to isolation-only, no schema fallback
type: project
status: stale
expires: 2026-06-15
related:
  - spec_087_bioshort_producer_restoration
originSessionId: 681cd3e0-120b-428b-82ed-fa343ebdbd30
---
Spec 092 = research backfill of deterministic bioshort hedge-report features into
`artifacts/research/bioshort_backfill/`, separate from the live operational
`output/hedge_report/` surface.

**Phase A status (shipped 2026-05-07):**
- Spec at `specs/changes/spec_092_bioshort_historical_backfill_2026_05_07.md` (commits `f51b943a` initial + `65c41ab0` closure)
- Inventory at `artifacts/research/bioshort_backfill/phase_a_inventory.json` (gitignored, regenerable)
- Inventory headline: 162 canonical snapshots, 142 usable (`target_weight_pct`), 20 missing — of which 18 carry `decision_portfolio.csv` instead (2026-01-19 → 2026-02-17 schema-migration boundary), 2 have no portfolio artifact

**Phase B/C/D held until Spec 087 B1b first-fire validation passes.**

**Why:** Phase B touches the producer (`tools/biotech_hedge_report.py`), and Spec 087 B1b is the first-fire validation of that same producer in operational mode. Mixing historical reconstruction with operational first-fire validation would blur the audit trail.

**How to apply:**
1. Do not start Phase B work until Spec 087 B1b verdict is recorded.
2. Phase B scope is **isolation only** — redirect archive write (line 2762), prior-report lookup, and `BIOSHORT_VERDICT.{json,md}` to `output_dir`; emit `mode: "research_backfill"`. No behavior change in operational mode.
3. Phase B must NOT add `decision_portfolio.csv` fallback. That fallback is a **Phase C policy** decision, gated on an explicit compatibility check, and runs as a separate labeled cohort with `source_schema = "decision_portfolio_legacy"`. Reason: Spec 087 B1a/B1b targeted silent portfolio fallback specifically; introducing a new silent fallback in Phase B would undo that work.
4. Phase C does not join forward returns. Phase D defines its target-price source separately, preferring the existing PIT-safe market-data cache (no ad hoc yfinance / live pulls).
5. Producer must never be invoked in operational mode against historical dates. No writes to `output/hedge_report/` at any phase. No cron change.

**To resume:** check Spec 087 B1b first-fire validation status; if passed, start Phase B from §7.1 of the spec.
