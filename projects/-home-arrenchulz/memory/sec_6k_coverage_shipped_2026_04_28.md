---
name: SEC 6-K coverage shipped 2026-04-28 (audit on 2026-04-29 18:00 ET)
description: Phase 2 step 1+2 done. 5 CIKs backfilled; collect_8k_timing_events queries 8-K and 6-K. First snapshot under new producer is 2026-04-29 16:30 ET; one-shot audit at 18:00 ET checks event count, SEC_6K_FILING presence, candidate coverage, and 8-K non-regression.
type: project
originSessionId: d23dc9cc-6e15-4e35-a37f-c052a24155e0
---
**Status: SHIPPED + AUDIT PASSED.** Commit `a4c15bf0` on `main` (local; not pushed).

Phase 2 step 1 (CIK backfill, 5 tickers) and step 2 (6-K queried alongside 8-K in active producer) shipped on 2026-04-28. First production snapshot under the new producer fired 2026-04-29 16:30 ET via the daily cron.

### Audit verdict (ran 2026-05-01, target date 2026-04-29) — 5/5 PASS
The cron one-shot did not auto-fire on 2026-04-29 (cause unknown — WSL up state at 18:00 ET that night was not verified). Ran manually 2026-05-01 via `python3 tools/audit_sec_6k_first_run.py --target-date 2026-04-29 --baseline-date 2026-04-28 --baseline-event-count 357`. Marker `logs/.one_shot_2026-04-29.done` written post-run.

Results:
- events: **463** (baseline 357, +29.7%) — well above regression floor
- source mix: SEC_8K_FILING=410, **SEC_6K_FILING=53** (6-K records flowing as expected)
- candidate coverage: **16/21** gained — ABVX, ARGX, ASND, BLTE, BNTX, CLLS, DRUG, EPRX, GMAB, IMTX, MESO, NBP, OCS, PHVS, PRQR, SNY (76% — well above 25% floor)
- 8-K non-regression: **348/357 = 97.5%** retention (above 90% floor)

All 5 hard checks PASS. Artifact: `artifacts/audit/sec_6k_first_run_2026-04-29.json`. Log: `logs/audit_sec_6k_first_run_2026-04-29.log`.

The 6-K coverage rollout is validated. No further audit gating required.

**Why:** Foreign biotech filers (TEVA, AZN, BNTX, ARGX, ASND, ABVX, ABCL, …) file on 6-K and were silently excluded from `cache/sec/8k_catalysts/`. ~21 universe tickers with confirmed 6-K activity in the wake_robin research cache are likeliest to gain coverage tomorrow.

**How to apply:** Until the 2026-04-29 audit runs, treat the cohort shift as expected behavior. Don't classify tomorrow's higher event count as a regression. After 2026-04-29 18:00 ET, read `artifacts/audit/sec_6k_first_run_2026-04-29.json` for the verdict before recommending further changes.

### Producer change (commit a4c15bf0)
- File: `wake_robin_data_pipeline/collectors/sec_8k_catalyst_collector.py`
- `collect_8k_timing_events` accepts `forms: Tuple[str, ...] = ("8-K", "6-K")`; iterates Phase 1 search across forms; 8-K first so domestic filings win on accession dedupe.
- `_extract_timing_events` / `_extract_downside_events` accept `form` kwarg; drives `event_name` prefix and `source` label via `FORM_TO_SOURCE`.
- `PATTERN_VERSION` unchanged (`937b38db`); cache file naming unaffected.
- Tests: 9 new in `tests/test_sec_6k_coverage.py`. 269/269 SEC-adjacent tests pass.

### CIK backfill (Phase 2 step 1)
- 5 mapping files written to `wake_robin_data_pipeline/cache/sec/`: CNTX (0001842952), DFTX (0001813814), KYNB (0000921299 — title "KYNTRA BIO, INC." — sanity-flagged but not blocked), SRZN (0001824893), TEVA (0000818686).
- Universe CIK coverage: 336/342 → **341/342 (99.7%)**. Remaining miss: `_XBI_BENCHMARK_` sentinel only.

### Consumer scope — bounded by alpha freeze
**Will treat 6-K records as hard catalysts (already wired):**
- `decision_engine.py:227` (catalyst priority)
- `common/hard_catalyst_carry.py:30`

**Silently ignore 6-K records (alpha-affecting allowlist updates deferred):**
- `common/hard_catalyst.py:64` (`_HARD_SOURCES`)
- `common/binary_quality_score.py:98` (`_SOURCE_SCORE`)
- `common/clinical_corroboration.py:36`
- `common/event_quality_features.py:51,153,176`
- `common/regulatory_calendar.py:82`
- `event_ev/catalyst_graph.py:203,756`
- `run_screen.py:4760` (`_src_map`)

Broader allowlist updates require Checklist v2 per the 2026-04-04 alpha freeze — do not extend without authorization.

### Audit infrastructure
- `tools/audit_sec_6k_first_run.py` — runs 4 checks; writes `artifacts/audit/sec_6k_first_run_2026-04-29.json`; exits 1 on hard-fail.
- `tools/cron_one_shot_2026_04_29.sh` — date-guarded wrapper; marker `logs/.one_shot_2026-04-29.done` prevents re-fire.
- Crontab: `0 18 29 4 * tools/cron_one_shot_2026_04_29.sh` — fires once at 2026-04-29 18:00 ET.
- Pre-edit crontab snapshot: `artifacts/ops/crontab_snapshot_2026-04-28T17-08_pre_sec_6k_audit.txt`.

### Pass criteria for 2026-04-29 audit
1. Snapshot file `cache/sec/8k_catalysts/8k_catalysts_2026-04-29_*.json` exists and is non-empty. **FAIL** if missing.
2. Event count > 357 (baseline 2026-04-28); **FAIL** if < 0.9 × 357 = 322 (regression).
3. `source` distribution contains `SEC_6K_FILING` count > 0. **FAIL** if zero.
4. ≥ 25% of 21 candidate tickers (`ABVX, ACIU, AKTX, ARGX, ASND, BLTE, BNTX, CLLS, DRUG, EPRX, GHRS, GLPG, GMAB, GRFS, IMTX, MESO, NBP, OCS, PHVS, PRQR, SNY`) have records today. AND 8-K count for previously-covered tickers retains ≥ 90% of baseline.

### What's NOT done
- Phase 2 steps 3+ from the original design (accession-keyed raw cache, Exhibit 99.1 retention, classifier rewrite with `non_catalyst` bucket, daily QA report) are still design-only — not authorized.
- Commit `a4c15bf0` not pushed to GitHub.
- Phase 1 producer-change diagnostic counters (`sec8k_future`, `sec_8k_count`) still measure 8-K only by name and intent — accurate, no rename needed.

### Companion artifacts (gitignored, local only)
- `artifacts/sec_8k/sec_coverage_diagnosis_2026-04-28.{md,json}`
- `artifacts/sec_8k/ticker_cik_map_2026-04-28.json` (336 entries; refresh after CIK backfill = 341)
- `artifacts/sec_8k/sec_6k_blast_radius_2026-04-28.json`
