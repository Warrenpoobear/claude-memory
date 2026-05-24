---
name: 2026-03-21 Session — Quality Tiebreak Evaluation
description: Catalyst type mult (Spec 030) and top-book BQS tiebreak (Spec 031) both evaluated and marked dormant; optionality anchor confirmed near-optimal
type: project
---

## Session Summary

Three candidates evaluated, all DORMANT:

### Spec 030 — Catalyst Type Multiplier (b7511c92)
- **Gap found**: catalyst_type_mult was only in L3 sizing, not sort key. Wired into
  _build_sort_contributions (#6 catalyst_bonus, #7 binary_quality, #9 clinical_quality_91_180).
  205 contract tests pass.
- **Rerank**: top-60 overlap 99.2%, mean shift 0.39, T1/T2 UP (-0.75), T3+ DOWN (+0.05)
- **Signal evidence**: all deltas zero (+0.00pp hedged at 84d). Effect confined to mid-book
  less_binary outside top-K.
- **Verdict**: DORMANT. Structurally valid, economically immaterial.

### Spec 031 — Top-Book Quality Tiebreak (846ae27b, 7956312c)
- binary_now_sort_mode="quality_primary" — activates contribution #11 for BN+BW buckets
- **Weight sweep** (131 dates): w=0.35 selected (top-20 overlap 98.4%, separation +1.44)
- **Signal evidence w=0.35**: zero hedged delta, IC slightly negative (-0.0031 at 84d)
- **Boundary w=0.50**: +0.01pp hedged (noise), IC worse (-0.0041)
- **Verdict**: DORMANT. BQS does not discriminate forward returns within binary_now/build_window.

### Key Learning
Quality tiebreaks tested at THREE scopes — all economically immaterial:
1. less_binary catalyst-type mult (Spec 030) — zero delta
2. binary_now/build_window BQS tiebreak (Spec 031) — zero delta
3. (Prior) build_window clinical_z (d59b6cc3) — NEEDS_MORE +0.01pp

**Why:** Optionality anchor is already near-optimal for top-book ordering with current
signals. New top-book alpha requires a new signal source, not reordering with existing
quality composites.

**How to apply:** Do not propose further quality-tiebreak or mid-book reordering candidates.
The only shadow candidate with real economic upside is catalyst tilt (a08749e4), which is
governance-blocked (weekly gate failed, shadowing 3-5 more weeks). Next new scoring lane
should be a genuinely new signal source for top-book discrimination.

## PI Trial Count (Spec 032) — Phase 1 COMPLETE, Signal HOLD
- `common/pi_features.py` (280 lines): name normalization, PIT gate, CRO filter (cap=100),
  cross-company PI experience, z-scoring
- `scripts/build_pi_features.py`: CLI wrapper
- `tests/test_pi_features.py`: 34 tests, all pass
- CT.gov API v2 enrichment: 5,310 trials added → coverage 43%→69%, binary_now 93%
- **IC check (34 dates)**: 20d IC=+0.007 (t=0.66), 63d IC=-0.006 (t=-1.11)
- **Quintile spread**: -2.73pp at 63d (high-PI UNDERPERFORMS)
- **Root cause**: PI experience captures company scale, not drug quality
- **Decision**: RESEARCH COMPLETE, NO SIGNAL. Lane closed. Infrastructure stays.

## Oncology Crowding Penalty (Spec 033) — NEEDS_MORE (shadow)
- Sort contribution #14 added to decision_engine.py (oncology-gated, default OFF)
- Phase 1 sweep: w=0.25 selected (93.9% top-20 overlap, 3.52 mean shift)
- Phase 2 signal evidence: +0.02pp hedged at 84d — all deltas positive but 10x below bar
- First candidate today with all-positive deltas; stays shadow
- Manifest: 6e91fb7a

## FDA Designation Correction (Spec 034) — IMPLEMENTED
- Data regression found: 135→20 entries from commit b59e41d1. Restored to 149 entries.
- IC check: designations are NEGATIVE signal (IC=-0.035, t=-5.14, -9.53pp spread)
- pos_multiplier (1.12-1.34x) was directionally wrong — boosting underperformers
- Fix: neutralized multiplier in module_5_composite_v3.py + module_5_scoring_v3.py
- Designation data preserved for attribution; engine still runs

## Competitive Intensity IC Check
- 63d IC=+0.053 (t=3.45) but non-monotonic / confounded with indication market size
- U-shaped: uncrowded (+26pp) and highly_crowded (+28pp) both outperform
- NOT usable as linear DEM sort signal
- Would need within-indication normalization — different project scope

## Code Changes
- `decision_engine.py`: catalyst_type_mult wired into sort key (3 contributions). Default-OFF, no behavioral change.
- New ruleset files: v1.12.0_catalyst_type_tilt_candidate.json, v1.14.0_top_book_quality_{035,050}*.json
- New feature files: common/pi_features.py, scripts/build_pi_features.py, tests/test_pi_features.py
- Specs: 030 (DORMANT), 031 (DORMANT), 032 (PHASE 1 COMPLETE / SIGNAL HOLD)
- Manifest: 3 new entries (b7511c92, 846ae27b, 7956312c), all dormant
