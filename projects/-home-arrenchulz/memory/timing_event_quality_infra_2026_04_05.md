---
name: Timing + Event Quality Infrastructure Upgrade
description: Spec 058+ timing warning bug fix, catalyst family hygiene, calibration dashboard, review packet, confusion dashboard, source reliability scores
type: project
---

## Timing + Event Quality Infrastructure (2026-04-05)

**9-item build shipped in one session.** All items implemented, tested, passing.

### Phase 1 — Critical Fixes
1. **Warning bug fix** (`compute_timing_hazard.py:584-590`): `_compute_execution_warning` was called without 8 keyword args, causing FAMILY_MISSING and LOW_CONFIDENCE_DATE to fire on every catalyst. Warning precision was 10.3% (89.7% FP rate). Fix: threaded through `catalyst_family`, `catalyst_days`, `precision` (from `clinical_days_precision`), `date_confidence` (from `clinical_date_confidence`), `source`, `n_revisions` (from `estimate.features_used`), `last_revision_pushout` (from `estimate.features_used`), `source_action` (from `source_reliability_action`).
2. **Catalyst family hygiene**: `classify_catalyst_family()` now returns `"NO_CATALYST"` instead of `""`. FAMILY_MISSING check updated. `backfill_catalyst_event_type.py` updated.

### Phase 2 — Timing Calibration
3. **Calibration dashboard** (`build_calibration_dashboard()`): Per-horizon calibration curves, source provenance, overall summary. Output: `artifacts/timing_hazard/calibration_dashboard.json`. Dashboard endpoint: `GET /api/timing_hazard/calibration_dashboard`.
4. **Base rate trend**: `_load_rolling_base_rate_with_trend()` compares current vs prior 200-record window. `base_rate_trend` + `prior_base_rate` in output.

### Phase 3 — Event Quality
5. **Ground truth expansion**: `--target-n 200`, `--oversample-confused`, `--oversample-sec-near` flags. Batch output: `data/ground_truth/batch_{date}.jsonl`.
6. **Review prioritization**: `prioritize_reviews()` in `event_quality_shadow_sizer.py`. Output: `artifacts/review/review_priority_{date}.json`. Criteria: low event_type_score, source DEMOTE/SUPPRESS, no catalyst family, near-term low quality.
7. **Confusion dashboard**: New `tools/build_event_quality_confusion.py`. Confusion matrix, P/R/F1 per class, sliced by family/source, top confusion pairs, F1 drift detection. Output: `artifacts/event_quality/confusion_dashboard.json`.
8. **Source reliability scores**: `compute_reliability_score()` in `source_reliability.py`. Formula: `on_time_rate * (1 - clip(slip/90)) * min(1, n/10)`. Enriched into build output.

### Phase 4 — Review Packet
9. **Unified review packet**: New `tools/build_review_packet.py`. Reads all artifacts, produces `artifacts/review/{date}_review_packet.json` with timing, calibration, event-type dist, herald precision, confusion, source reliability, review queue.

### New Dashboard Endpoints
- `GET /api/timing_hazard/calibration_dashboard`
- `GET /api/event_quality/confusion`
- `GET /api/review/packets`
- `GET /api/review/priority`

### Test Files Added
- `tests/test_compute_timing_hazard.py` (34 tests)
- `tests/test_event_quality_confusion.py` (13 tests)
- `tests/test_review_packet.py` (11 tests)
- Extended `tests/test_source_reliability.py` (+6 tests)
