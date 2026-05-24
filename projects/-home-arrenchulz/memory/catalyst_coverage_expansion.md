# Catalyst Coverage Expansion (2026-02-14)

## Overview
Expanded catalyst data sources beyond SEC 8-K: EDGAR multi-form (10-Q, 10-K, 6-K) + Federal Register FDA regulatory notices. Added comprehensive audit tooling.

## Files Created
- `tests/test_sec_multi_form.py` — 27 tests for FORM_TO_SOURCE, cache paths, filing_form field, backwards compat, priority resolution
- `tests/test_fda_regulatory_notices.py` — 23 tests for FR queries, event type mapping, product matching, cache, dedup, priority, schema
- `tests/test_audit_catalyst_coverage.py` — 8 tests for comprehensive offline coverage audit
- `scripts/audit_catalyst_coverage.py` — REPLACED (was archive backfill audit → now comprehensive offline coverage audit)

## Files Modified
- `wake_robin_data_pipeline/collectors/sec_8k_catalyst_collector.py`:
  - Added `FORM_TO_SOURCE` (4 entries: 8-K/10-Q/10-K/6-K → SEC_*_FILING)
  - Added `_MAX_FILINGS_PER_MULTI_FORM_RUN = 300`
  - Added `_multi_form_cache_path()` — `sec_filings_{date}_{PATTERN_VERSION}.json`
  - Added `collect_sec_filing_events()` — same pipeline as 8-K, separate cache, `filing_form` field
  - Added cache fallback in `collect_8k_timing_events()` — primary → `wake_robin_data_pipeline/cache/sec/8k_catalysts/`

- `wake_robin_data_pipeline/collectors/fda_adcom_collector.py`:
  - Added `_FR_REGULATORY_QUERIES` — 4 entries (FDA_APPROVAL, FDA_CRL, FDA_RTF, FDA_WARNING_LETTER)
  - Added `collect_fda_regulatory_notices()` — Federal Register API, product-to-ticker matching, dedup, cache to `fda_regulatory_{date}.json`

- `module_3_catalyst.py`:
  - Added `enable_sec_multi_form`/`enable_fda_regulatory` to Module3Config (off/cache_only/live)
  - Added ADCOM cache fallback (Step 1a)
  - Added SEC multi-form + FDA regulatory integration blocks

- `enrich_archive_inputs.py`:
  - Added `--sec-multi-form-mode` CLI arg (off/live)
  - `_collect_sec_events_for_date()` returns 3-tuple `(sec_events, adcom_events, multi_form_events)`

- `decision_engine.py`:
  - Added to `catalyst_priority_map`: SEC_10Q/10K/6K_FILING at pri=2, FEDERAL_REGISTER at pri=1
  - **DEFAULT_RULESET ID changed: b50ed3b6 → ca39188a**

- `scripts/run_drift_report.py`:
  - `_CATALYST_SOURCE_KEYS`: added SEC_10Q/10K/6K_FILING, FEDERAL_REGISTER
  - `_CATALYST_EVENT_TYPE_KEYS`: added FDA_PDUFA_DATE, FDA_APPROVAL, FDA_CRL, FDA_RTF, FDA_WARNING_LETTER, CT_PRIMARY/STUDY_COMPLETION
  - `_SOURCE_ALIASES`: added sec_10q/10k/6k, federal_register
  - `_EVENT_TYPE_ALIASES`: added fda_pdufa_date, fda_approval, fda_crl, fda_rtf, fda_warning_letter, ct_primary/study_completion
  - `_SRC_ORDER`: added new source sort priorities

## Ruleset IDs After Expansion
- DEFAULT_RULESET: ca39188a (was b50ed3b6)
- v1.json: ca39188a (regenerated)
- v1.3.0_candidate.json (active): f3454ef7 (UNCHANGED — not modified)
- v1.3.1_candidate.json (candidate): 591581ef (was 310c21ac)
- v1.2.2_candidate.json: bf6815e2 (UNCHANGED)

## Phase 2: Pipeline Enablement (2026-02-14)

### Changes
- **`run_screen.py`**: `_build_m3_config()` + `run_screening_pipeline()` defaults flipped from `"off"` to `"cache_only"` for `sec_multi_form_mode` and `fda_regulatory_mode`
- **`fda_adcom_collector.py`**: Added `_GENERIC_INTERVENTION_NAMES` frozenset (19 terms); `build_product_ticker_map()` now mines `trial_records.json` interventions (~2000+ drug-name-to-ticker mappings)
- **`sec_8k_catalyst_collector.py`**: Added `_MAX_DOC_BYTES = 2_000_000` size cap in `_fetch_filing_text()` (prevents pathological regex stalls on large 10-K HTML); added per-filing progress logging in `collect_sec_filing_events()`

### Files Created
- `scripts/build_multi_form_caches.py` — builds SEC multi-form caches for all archive dates; idempotent (skips existing); reads `data/archives/*.tar.gz` dates

### Cache Build Results (initial, pre-filter)
- 33/33 archive date caches built (2024-01-31 through 2026-02-07)
- 1680 per-filing parsed caches
- Typical yield: ~108 events, ~72 tickers per date (2026 dates)
- First run stalled on pathological 10-K (>2MB HTML) — fixed by doc size cap

### Tests Added
- `test_sec_multi_form.py`: `TestCacheOnlyMode` (2 tests) — reads from cache, handles missing cache
- `test_fda_regulatory_notices.py`: `TestProductMapTrialExpansion` (2 tests) — trial intervention inclusion, generic name exclusion
- `test_sec_multi_form.py`: renamed `test_default_modes_off` → `test_default_modes_cache_only`

## Phase 3: Quality Gating (2026-02-14, commits e9c7f38 + f8518f8)

### Problem
Pre-filter multi-form events were 84% LOW confidence boilerplate ("foreseeable future", accounting standard adoption, "material weakness"). 4 false-positive tier upgrades (AURA, CTMX, APGE, ENTA).

### Changes
- **`module_3_catalyst.py`**: Hard gate at merge time — `_MF_ALLOWED_CONF = {MED, HIGH}`, `_MF_ALLOWED_PREC = {"DAY", "WEEK", "MONTH", "QUARTER"}`. Logs `gated: N` count.
- **`sec_8k_catalyst_collector.py`**:
  - `_fetch_filing_text(prefer_exhibits_only=True)` for 10-Q/10-K (skip main doc body, fetch exhibit 99.x only)
  - `_extract_timing_events(require_biopharma_context=True, block_boilerplate=True)` for multi-form collection
  - `_BOILERPLATE_KWS` (8 terms): "foreseeable future", "going concern", "material weakness", "accounting standard", "fasb", "asu", "impairment", "adopt"
  - `_BIOPHARMA_KWS` (15 terms): "fda", "pdufa", "nda", "bla", "crl", "phase 1/2/3", "topline", "readout", "primary endpoint", "enrollment", "interim analysis", "clinical", "regulatory"
  - Context window: ±300 chars around match
  - Oversize doc skip counters: `skipped_oversize`, `fetched_any` (logged when >0)
- 8-K collection path unchanged (no `require_biopharma_context`, no `prefer_exhibits_only`)

### Cache Rebuild (post-filter)
- Old caches preserved: `multi_form_parsed.pre_filter_2026-02-14/`, `date_caches.pre_filter_2026-02-14/`
- New caches rebuilt: 33/33 dates, ~15-19 events/date (was ~100-150)
- Total events: 3665 → 518 (86% reduction)
- Quality: HIGH=108 (21%), MED=237 (46%), LOW=173 (33%) — was 84% LOW
- Surviving event types: DATA_READOUT=230, SAFETY_SIGNAL=163, FDA_PDUFA_DATE=80, CLINICAL_HOLD=45
- All 10-Q/10-K boilerplate eliminated; remaining events predominantly 6-K (foreign issuer press releases)

### Ablation Result (2026-02-07 cache, 2026-02-11 snapshot)
- 10 dev events (was 73 pre-filter)
- 8 survive hard gate (2 LOW/HALF_YEAR blocked)
- All survivors: 6-K filings with real biopharma events (PDUFA, safety signals, clinical holds)
- 0 false-positive tier upgrades
- 0 non-redundant coverage gain (all survivors already CT.gov/PDUFA-covered)
- Drift baseline unchanged: specific_days=73.2%, no_upcoming=26.8%, missing=0.0%

### Pending
- Morningstar ablation (OFF vs cache_only, diff source_mix.json files)
- Monitor for non-redundant coverage gains as new 6-K filings arrive

## Phase 4: Source Mix Sidecar (2026-02-15, commit 4af48e7)

- **`module_3_catalyst.py`**: Computes `catalyst_source_mix` dict from `events_by_ticker_v2` after all merges (line ~1795), added to output dict
  - Fields: `total_events`, `unique_tickers_with_events`, `by_source`, `by_confidence`, `by_date_precision`
- **`run_screen.py`**: `save_validation_snapshot()` writes `catalyst_source_mix.json` next to `rankings.csv`
- Enables trivial OFF vs cache_only ablation: diff two sidecar JSONs

## Phase 5: Ablation Tooling + Pinned ID Fix (2026-02-15)

### Ablation Comparison Script (commits de1eda7, 04e9867)
- **`scripts/compare_ablation_snapshots.py`** — compares two snapshot folders
  - Source-mix deltas (from `catalyst_source_mix.json`)
  - Top-60/100 overlap + entries/exits + biggest rank movers
  - Catalyst UX conversions: `no_upcoming/missing` → `specific_days/blended_window` (and reverse)
  - Provenance shifts: `catalyst_source` + `catalyst_event_type` changes
  - Nearest catalyst improvements: `catalyst_days` gained/lost, strength shifts
  - `--json-out PATH` for machine-readable summary (greppable over time)
  - Hardened: `parse_int` handles nan/MISSING/none, column-missing guards with skip notes
  - Uses `argparse` for proper CLI

### Pinned Ruleset ID Fix (commit c1e3dab)
- **`run_phase2_snapshot_delta.py`**: `PHASE2_PINNED_RULESET_ID` was stale `f3454ef7` → updated to `96f655ee`
- Root cause: `run_screen.py` imports delta module's pin as `DELTA_PINNED_ID` (line 4674), so both MUST match
- This was the sole cause of spurious `ruleset_mismatch` FAIL in health gate
- After fix: identical portfolio runs → **HEALTH: OK**, turnover 0.0%, +0/-0 names

## Phase 6: 2026-02-14 Cache Lift (commit ca0f5e7)

### Cache Build
- Built 8-K cache for 2026-02-14: 214 events (`8k_catalysts_2026-02-14_249a4353.json`, 81KB)
- Built multi-form cache for 2026-02-14: 15 events (`sec_filings_2026-02-14_249a4353.json`, 6KB)
- API note: `collect_sec_filing_events()` / `collect_8k_timing_events()` need universe as list of DICTS (not ticker strings)

### Screen Results (before → after fresh caches)
- Catalyst events: 1099 → 1301 (+202)
- Dev specific_days: 133/183 (72.7%) → 141/183 (77.0%) — 8 dev tickers flipped no_upcoming → specific_days
- A-tier count: 33 → 37
- Phase-2 health: OK (turnover 15.0%), delta +3/-3 names

### Source Mix Attribution (post-cache `catalyst_source_mix.json`)
- SEC_8K_FILING: 206 (primary driver of all lift)
- CTGOV_CALENDAR: 1084, FDA_CALENDAR: 11
- Multi-form: 0 net impact (15 events all LOW/HALF_YEAR, blocked by hard gate)
- by_confidence: HIGH=145, MED=255, LOW=901 (LOW dominated by CTGOV)
- by_date_precision: DAY=929, RANGE=232, QUARTER=22, HALF_YEAR=118

### Attribution doc: `docs/ablation/2026-02-14_sec_catalyst_cache_lift.md`

### Pending
- Morningstar ablation (OFF vs cache_only on same as-of date in SDK environment)
- Monitor for non-redundant coverage gains as new 6-K filings arrive

## Test Count: 6870 passing
## HEAD: ca0f5e7 on origin/main
