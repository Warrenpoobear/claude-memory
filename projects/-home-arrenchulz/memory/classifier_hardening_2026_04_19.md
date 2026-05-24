---
name: Press-release classifier hardening (CH-1..CH-7 + P2 + M1) — complete 2026-04-19
description: End-to-end hardening of tools/classify_press_releases.py driven by FinGPT pilot seed audit. All spec acceptance criteria met. Shadow-run rollout pending.
type: project
originSessionId: b9d88e96-eb38-45d4-b094-c0b588a6ad1e
---
Completed 2026-04-18 → 2026-04-19. Driven by the FinGPT Week-3 pilot's seed audit, which found the classifier's `needs_review=True` escalation pool was ~47% filter leakage (collisions + noise). Rather than spend on a FinGPT HF endpoint to bake off a noisy pool, pivoted to fix the root cause.

**Delivered:**
- **CH-1..CH-5** in `tools/classify_press_releases.py`: HTML-entity decode, missing-name collision tightening, short-prefix token retention, biotech-rescue requiring ≥2 non-generic matches, 5 new noise patterns.
- **P2 soft-collision routing**: `collision_severity` field (`none`/`soft`/`hard`). Soft collisions stay visible for Grok/review; hard collisions silent-drop. Counterfactual shadow logging hook kept.
- **M1 schema/intake gate**: added `ticker_collision_flag` + `collision_severity` to `NewsEvent` Pydantic, extended `is_clean_for_calibration()`, added gate to `tools/herald_crt_intake.py` — closes the leak where soft collisions would enter CRT/calibration.
- **CH-6** `tools/reclassify_press_release_cache.py` — side-dir cache re-classification, never overwrites originals.
- **CH-7** `tools/audit_escalation_pool.py` — balanced 30-item sampler + A/B compare.

**Quantified impact on the 7,792-record cache:**
- 747 items drop as newly-detected noise (9.6%)
- 1,005 newly flagged hard collisions (12.9%) — silent drop
- 464 newly flagged soft collisions (6.0%) — escalate for review
- Escalation-pool size cut in half (2,612 → 1,292)
- 10-item spot-check: 9/10 true collisions (MESO/Ryoncil false positive is a pre-existing drug-brand-name gap, not a regression caused by this work)

**Tests:** 33 new tests across 4 files. Full suite 15,333 passing, zero regressions in touched files.

**How to apply:**
- The classifier filter is now tight enough that the FinGPT pilot can be revisited on a fresh 30-item seed post-cutover. Per user's standing rule: only reopen FinGPT after post-cutover purity ≥ 80% on a fresh sample.
- `collision_severity` field is the canonical way to distinguish silent-drop collisions (`"hard"`) from escalation-pool-visible collisions (`"soft"`). Any new consumer of classifier output should gate appropriately.
- The side-dir at `data/press_releases/classified/reclassified/` is evidence-only per CLAUDE.md CCFT "Frozen" rule. Promotion to canonical is a separate governance-approved step (shadow run + cutover).

**Open follow-ups (evidence-cataloged in FINAL_SUMMARY.md):**
1. Registry backfill for ARCT, OCS, TGTX.
2. Sector-mismatch override (fixes A13 VRDN "Viridian Metals"-style collision where name-match fires on non-biotech sector).
3. Drug-brand-name rescue via `production_data/drug_name_map.json` (fixes MESO/Ryoncil false positive).
4. Word-boundary regex for biotech indicators (fixes "gene" substring inside "regeneron").
5. `tools/build_event_feedback.py` gate on `ticker_collision_flag` (probably unintended omission).
6. Live-pipeline shadow run (spec §8 rollout), then cutover.

**Artifacts:**
- Spec: `/mnt/c/Projects/biotech_screener/fingpt_pilot/notes/CLASSIFIER_HARDENING_SPEC_v1.md`
- Final summary: `/mnt/c/Projects/biotech_screener/fingpt_pilot/notes/FINAL_SUMMARY.md`
- Consumer scan: `/mnt/c/Projects/biotech_screener/fingpt_pilot/notes/DOWNSTREAM_CONSUMERS_REPORT.md`
- Side-dir: `/mnt/c/Projects/biotech_screener/biotech-screener/data/press_releases/classified/reclassified/`

No commits made — working-tree changes awaiting user review.

**Post-cutover monitoring wired 2026-04-19:** Discrete Day-1/7/14 validation checkpoints replaced with continuous daily monitoring inside the existing `production_qa` fleet agent.
- Added `check_classifier_escalation_pool` to `tools/production_qa_check.py` — runs at 18:55 weekdays alongside the other production_qa checks, no new agent or cron.
- Floor date lives in `config/post_cutover_floor.json` (`classifier_min_date: "2026-04-20"`), so the check filters to post-cutover files only. Set the field to `""` to disable the floor after ~30 days of sustained PASS.
- Thresholds: PASS = pool empty (awaiting cron) OR (other-category share ≤ 50% AND re-run clean rate ≥ 70%). FAIL on either breach or schema drift.
- Emits daily rolling hard-collision sample to `artifacts/production_qa/hard_collisions_YYYY-MM-DD.json` for human review — supersedes the discrete Day-7 "spot-check 10 newly-flagged hard collisions" manual step.
- 6 new unit tests in `tests/test_production_qa_classifier_check.py`.
- Smoke test on 2026-04-19 (weekend, no post-cutover cron yet): PASS with "pool empty — awaiting first post-cutover cron output".
