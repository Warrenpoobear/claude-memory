---
name: Biotech options data + Spec 062 audit (2026-05-05)
description: Three sequential audits (data quality / liquid-universe / Spec 062 math) of the biotech-screener options stack. 4 code bugs in event_ev/expression_layer.py fixed and committed (33923f71). Higher-risk ingestion changes (silent fallback, staleness, MIN_OI, schema) flagged but not patched — require user approval. Live liquid coverage is 87/299 (29%), down from 105/297 at Spec 062 ship.
type: project
status: shipped
related: [openclaw_fleet.md, ees_v3_structural_failure_2026_04_30.md, massive_license_downgrade_2026_04_27.md]
originSessionId: 6a810053-4668-4fc5-b1b6-73abb1a22b43
---
External audit triggered 2026-05-05; three sequential read-only sweeps of the options stack at `/mnt/c/Projects/biotech_screener/biotech-screener/`.

**Why:** Memory headline "Options coverage: 35% liquid (105/297)" was static; user wanted accuracy + logic verification across data, gating, and Spec 062 math before relying on the diagnostic outputs.

**How to apply:** Treat the 4 patched bugs as closed; the 5 unpatched items are **flagged but not approved** — re-surface them when revisiting the options stack. Do not silently re-introduce any of the patched edges (regression tests guard them).

## Audit 1 — Data quality (read-only)

Pipeline: Tastytrade primary (REST API, async batch) → Massive/Polygon fallback (S3 flat-file) → fail-closed empty diagnostics. 96.3% coverage on universe. Findings:

- **HIGH** — Silent fallback to `empty_diagnostics("no_massive_module")` at `common/options_diagnostics.py:859` logs at INFO only. Matches the **incomplete-run silent-fallback bug class** (memory: `incomplete_production_run_fallback_2026_05_01.md`).
- **HIGH** — No max-staleness check on current-day quotes. `MAX_QUOTE_STALE_HOURS=48` defined in `options_quality.py` but applied only post-hoc in manifest assessment, not at ingestion (`common/options_diagnostics.py:976-999`).
- **HIGH** — 44.8% of rows missing `opt_put_call_skew`; 53.1% missing `opt_rr_25d` on 2026-05-05.
- **HIGH** — `MIN_OI_THRESHOLD=10` in `common/options_quality.py:14` is **never enforced** — gate uses TT vendor `liquidity_rating >= 3` only.
- **MED** — Massive license downgrade halts S3 refresh (latest cache 2026-04-24). Per memory `massive_license_downgrade_2026_04_27.md`, Task #2 (minute_aggs/trades audit) still PENDING.
- **MED** — `OptionsQuality` dataclass and `fetch_options_diagnostics` return paths lack pydantic / `__post_init__` validation.

## Audit 2 — Liquid-universe definition

Authoritative gating in `common/options_diagnostics.py`:
- L91 `MIN_LIQUIDITY_RATING = 1` — below → `absent` (`empty_diagnostics("low_liquidity_X")`)
- L179 `_LIQUIDITY_OK_THRESHOLD = 3` — rating ≥3 → `liquid`; ∈ {1,2} → `thin`
- L182 `_IV_JUNK_CAP = 5.00` (500%) — liquid + IV ≥ cap → `opt_use_for_judgment=NO`
- The integer rating itself is **vendor-supplied** (Tastytrade `MarketMetrics.liquidity_rating`); no code-level OI/spread/volume gate.

**Spec alignment: DRIFT.** Spec 059 line 99 assumed ~58% liquid; current state 29%. Universe drift table:

| Date | Universe | Liquid | %Liquid |
|------|----------|--------|---------|
| 2026-04-13 (Spec 062 ship) | 297 | **105** | 35.4% |
| 2026-04-25 | 297 | 76 | 25.6% |
| 2026-04-30 | 297 | 76 | 25.6% |
| 2026-05-04 | 297 | 86 | 29.0% |
| 2026-05-05 | 299 | 87 | 29.1% |

**Big membership churn 04-13 → 04-25: Jaccard 0.57.** 39 names dropped (incl. AZN, BMRN — large-caps that don't normally lose options liquidity), 10 added in 12 days. Suggests TT vendor recalibration, not real-market change. Updates memory's static "105/297" headline.

## Audit 3 — Spec 062 math correctness

Threshold-by-threshold the code matches the spec exactly. Bugs are at subtype assignment edges and one upstream contract issue.

**Patched at commit `33923f71`** (`event_ev/expression_layer.py` + `tests/test_expression_layer.py`, 193 tests green):
- DIRECTIONAL subtype now keys off `mispricing_score` sign alone (was `mispricing_score > 0 AND scenario_ev > 0`).
- VARIANCE subtype boundary now sign-based (was strict `< -0.30`, missed `gap == -0.30` exact equality with the outer gate).
- `compute_timing_confidence` now penalizes invalid prob sums via `1 - |sum - 1|` (was silent clamp on sum>1).
- `compute_surface_quality` docstring corrected to match code (`* 1000.0` for decimal-unit `bid_ask_spread_pct`); depth-mirrors-liquidity weighting documented as 50% effective weight.

**Not patched — Spec 062 inherits EES v3 structural failure.** The `dir_ok` gate requires sign agreement on `ees.conditional_misprice_score` (`event_ev/expression_layer.py:370-371`), but per `ees_v3_structural_failure_2026_04_30.md`, `conditional_misprice_score` is monotonic with pmv (Spearman ≈ −0.978). The "independent confirmation" the gate intends collapses to a near-tautological pmv-vs-mispricing-score check. Mitigated only because Spec 062 is shadow-only / diagnostic. **If Spec 062 is ever consulted as a signal, this is load-bearing.**

## Open / unpatched (require approval before touching)

These are real findings but each changes live behavior and was flagged not patched:

1. Enforce `MIN_OI_THRESHOLD = 10` as a code-level gate. Would shrink the liquid universe further from 29%.
2. Add `MAX_QUOTE_STALE_HOURS` check at ingestion path (not just post-hoc in manifest). Would start rejecting tickers that previously passed.
3. Promote silent `empty_diagnostics(...)` fallback from INFO log to a structured alert — operational noise risk.
4. Add `__post_init__` / pydantic validation on `OptionsQuality` and `fetch_options_diagnostics` return paths.
5. Replace TT vendor `liquidity_rating` with a derived quality score (per-strike OI + spread + volume). Architectural change; affects Spec 062 / 059 contract.

## Latent class to watch (cross-repo)

**Docstring/code drift continues to surface.** Asset-allocation review (`asset_allocation_external_review_2026_05_05.md` finding #3) found the same class — TA model docstring claimed "force full liquidation" but code did not. Biotech audit #3 finding #3 found `compute_surface_quality` docstring claimed `* 10` but code uses `* 1000`. Worth treating "comment makes a behavioral or numerical claim" as a regression-test trigger in future audits.
