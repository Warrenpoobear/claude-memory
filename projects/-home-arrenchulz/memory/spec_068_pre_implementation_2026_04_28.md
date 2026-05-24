---
name: Spec 068 pre-implementation findings (2026-04-28)
description: development_stage confirmed display-only; alias check 10/10 HIGH; Spec 068 is metadata integrity audit, not model-risk fix
type: project
originSessionId: 6ade3205-6cd1-47d8-8f13-bf6cae946429
---
# Spec 068 — Pre-implementation findings (2026-04-28)

Authorized read-only Spec 068 build. Pre-implementation §13 grep + §11.3 alias sanity completed before any audit code merged.

**Why:** the proposal framed `development_stage` validation as a model-risk problem. Pre-implementation evidence reframed it as metadata-only. That changes the upper bound on damage from 100% mismatched stages to "wrong text in a display column."

**How to apply:** when reading future audit findings, do not treat `development_stage` mismatches as scoring/selector defects. The cohort that drives `financial_score` rank-norm is `stage_bucket`, derived independently from Module 4 `lead_phase` inside `module_5_composite*.py`. If a future audit finds 50% mismatch, the fix is metadata cleanup in `universe.json`, not a model retrain.

## Confirmed findings

1. **`development_stage` is display-only.** No downstream consumer in scoring, selector, ranker, eligibility, EES, DEM, Event EV, or `tools/production_qa_check.py`. Only consumers:
   - `run_screen.py:664-699` `_derive_development_stage()` — explicit "Display-only" docstring
   - `run_screen.py:6336-6348` — writes column into snapshot row
   - `run_screen_columns.py:126-132` — explicit comment "NOT a scoring/selector input"
   - `tools/build_rank_change_monitor.py:353,491` — read-only audit consumer
   - `tests/test_development_stage.py` — tests assert pure-read invariance

2. **Cohort key is `stage_bucket`, not `development_stage`.** Verified `decision_engine.py`, `defensive_overlay_adapter.py`, `module_5_alpha_cohort.py`, `module_5_composite{,_v2,_v3}.py` all read `stage_bucket`, derived from Module 4 `lead_phase` via `_stage_bucket()`.

3. **CT.gov already pre-resolves ticker→sponsor.** `cache/ctgov/trial_records_{date}.json` carries a `ticker` field on every trial alongside `sponsor` (e.g., AARD → "Aardvark Therapeutics, Inc."). The hard alias problem is solved upstream; the audit's job becomes verification, not creation.

4. **Alias sanity 10/10 HIGH.** Random sample (seed=42) of covered tickers: VOR, BCAX, ADCT, GPCR, FATE, ELVN, CADL, AVXL, SIGA, ASND. All passed normalized-name match with HIGH confidence. GPCR (Structure Therapeutics → Gasherbrum Bio subsidiary) caught via parent-mention substring.

5. **CT.gov coverage 88% of universe.** 301 / 342 tickers have CT.gov trials. 41 uncovered split: 18 explicit `commercial` (tier_commercial set), 13 explicit `platform_*` (correctly emit `platform_not_ctgov_applicable`), 23 not in rankings.csv (universe = 342 vs rankings = 297, outside audit scope).

6. **`sponsor_alias_uncertain` will not dominate** the audit's error surface.

## Cache feasibility (§2 inputs)

All present except a stale Orange Book:
- `data/snapshots/2026-04-28/rankings.csv` — 297 rows, today
- `cache/ctgov/trial_records_2026-04-28.json` — 19,241 trials, today
- `production_data/universe.json` — 342 tickers (real name in `market_data.company_name`, not top-level `name`)
- `production_data/drug_name_map.json` — 300 entries under `entries`
- `production_data/pit_financials/` — 341 ticker fact stores; revenue = list of `{end, val, filed, form, accn, start}`
- `cache/sec/8k_catalysts/` — 88 files but contains `.staging_*` subdirs; sparse, treat as best-effort
- `cache/fda/` — today's adcom_calendar + fda_regulatory + openfda
- `production_data/pdufa_dates_extracted.json` — 31 PDUFAs, today
- `production_data/purple_book.json` + `purple_book_ticker_map.json` — present
- `data/enrichment/orange_book_2026-03-27.json` — **32 days stale**, single-file; per spec §13 audit must mark "approved evidence: small-molecule confirmation possibly stale" rather than treat absence as negative

## Decision

**PROCEED_SPEC_068** as a metadata integrity audit.

Diagnostic-only outputs at `artifacts/development_stage/stage_cache_audit_{date}.{csv,md,json}`. End-of-run must explicitly select one of: `MANUAL_FIX` / `RECURRING_VALIDATOR` / `ALIAS_MAP_FIRST`.

No mutation of `universe.json`, `rankings.csv`, scoring, selector, ranker, EES, DEM, Event EV, or QA gates.
