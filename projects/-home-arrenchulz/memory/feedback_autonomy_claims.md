---
name: Autonomy claims require repo-grounded evidence
description: Do not claim "fully autonomous" without distinguishing repo-backed automation from local runtime state (OpenClaw cron, gateway auth)
type: feedback
---

Never say "fully autonomous" or "no manual intervention needed" without qualification.

**Repo-grounded claims are safe**: WSL cron wrapper, catch-up logic, GHA workflows — these are in the repo and verifiable.

**Runtime-dependent claims need hedging**: OpenClaw cron jobs, gateway/auth status, local service health — these are machine state, not repo state. Say "locally scheduled and appears live" not "autonomous."

**Hybrid scheduler awareness**: The production loop is local WSL cron (5:30 PM ET) + GitHub Actions (14:00 UTC) — two independent schedulers, not a single loop. Acknowledge this when describing the operating model.

**Why:** User values precision in system characterization. Overclaiming autonomy from repo evidence alone is misleading — a reboot could break the local half.

**How to apply:** When summarizing production readiness or automation status, always distinguish what's repo-provable vs what requires runtime validation. The gold standard is: reboot → gateway status → cron list → agent fires → no dirty git.
