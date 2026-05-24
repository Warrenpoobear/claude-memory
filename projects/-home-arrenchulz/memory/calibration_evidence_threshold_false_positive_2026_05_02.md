---
name: calibration_evidence threshold false positive
description: calibration_evidence STALE alert fires on absolute time but the script's NO_DATA early-exit (no postmortems → no writes) is correct behavior; do not debug as a bug
type: feedback
status: active
related: feedback_observation_bias_cron_monitoring.md, openclaw_fleet.md
originSessionId: 11287a16-a428-425d-ba0a-aa74c7608c00
---
When the fleet status shows `calibration_evidence` as STALE/FAIL because its artifact is older than the staleness threshold (10d), do NOT treat it as a bug until you have confirmed new postmortems exist that should have been processed.

**Why:** The Friday 19:00 cron `tools/build_calibration_evidence.py` has a `NO_DATA` early-exit at ~line 339 that returns silently when `artifacts/postmortem/` contains no new entries since the last run. It writes nothing — no `json_path`, no `md_path`, no `ledger.jsonl` — and the log line is just `"No postmortem data yet"`. The cron *did* fire; it correctly produced zero artifacts. Verified 2026-05-02: log mtime stuck at 2026-04-17 19:16 (last run that found postmortems), `artifacts/postmortem/` newest dir = `2026-03-30/`, two subsequent Friday runs (04-24, 05-01) silent.

**How to apply:** Before investigating a calibration_evidence staleness alert, check `artifacts/postmortem/` for directories newer than the last successful artifact. If none, the alert is miscalibrated (fires on time; should fire on "new postmortems exist but weren't processed") — close the alert as no-op. The orthogonal real signal — "postmortems have stopped being filed" — is a separate question about the postmortem pipeline upstream, not about this script.
