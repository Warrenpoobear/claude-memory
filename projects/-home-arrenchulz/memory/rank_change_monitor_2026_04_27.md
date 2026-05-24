---
name: Rank-change monitor + 2026-05-11 calibration audit
description: Read-only deterministic rank-change monitor wired into daily run_screen; calibration audit pre-scheduled for 2026-05-11
type: project
originSessionId: d3df65f9-6c1c-4be1-bd80-9585f00fe62b
---
Built 2026-04-27 in response to ERAS top-30 → AR 63 dropout that turned out to be a ranker_v2 cohort-boundary event, not a model regression. Read-only by design — does not touch scoring, selectors, ranking, eligibility, or portfolio construction.

**Components**
- `tools/build_rank_change_monitor.py` — diff against most-recent prior snapshot; emits `data/snapshots/{date}/rank_change_alerts.{csv,md,json}`. CLI flag `--print-alerts` dumps WARN+ rows to stdout for cron.log visibility.
- `tools/cron_daily_production.sh` — wired in after the production exit-code block; runs only on EXIT_CODE 0 or 2; CRITICAL alerts post to `PIPELINE_ALERT_WEBHOOK` mirroring the pipeline-failure pattern.
- `tools/audit_rank_change_monitor.py` — soak-window aggregator; reports severity rollup, top reasons, integrity pass-rate, cohort-churn percentiles, repeat offenders. Surfaces missing weekday alert files explicitly (per `feedback_observation_bias_cron_monitoring.md`).
- `tools/cron_one_shot_2026_05_11.sh` — one-shot wrapper, marker-file + date-check self-skip pattern matching `cron_one_shot_2026_04_28.sh`.
- Tests: `tests/test_rank_change_monitor.py` (16) + `tests/test_audit_rank_change_monitor.py` (7).

**Calibration window**: Mon 2026-05-11 17:00 ET, covering 2026-04-28 → 2026-05-11 (~10 weekday runs). Crontab line provided to user manually; not auto-installed. Marker file: `logs/.one_shot_2026-05-11.done`.

**Why:** ERAS-style cohort-boundary noise needed observability before any consideration of hysteresis. Hysteresis is spec-only and explicitly out-of-scope; soak window provides forward evidence for whether boundary churn warrants a model-side fix vs. staying as a diagnostic-only signal.

**How to apply:**
- After 2026-05-11 audit fires, read `logs/audit_rank_change_monitor_2026-05-11.log` + `artifacts/audit/rank_change_monitor_2026-05-11.json`. Watch for: dominant `ranker_v2_cohort_dropout` reason mix (≥60% of WARN+CRITICAL would suggest the boundary is genuinely jittery), CRITICAL=0 holding (integrity rules well-calibrated), median cohort_churn vs the 10% review threshold.
- If dominant cohort-dropout pattern confirms, hysteresis becomes a candidate research lane — but per `policy_freeze_architecture_2026_04_19.md` and `policy_alpha_freeze_2026_04_04.md`, any model-side change still requires Checklist v2 + forward attribution. Audit alone does not justify a ranker change.
- ERAS at 2026-04-25 is the canonical test case: composite_score stable at 0.0599, ranker_v2_score went present→blank, final_score collapsed 0.632→7.18e-05, actionable_rank 16→63. If a future change claims to "fix" cohort dropout, this case must still surface as a WARN (it's signal, not noise) with the same explanation.
