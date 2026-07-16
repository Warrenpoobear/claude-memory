---
name: project-ctis-timeout-fix-2026-07-16
description: CTIS trial-register warm timing out → stale since 06-24; fixed via detail-cache + enrich budget (PR
metadata: 
  node_type: memory
  type: project
  originSessionId: 97a54a24-e482-488b-9d6a-48e62bdb3eca
---

CTIS (EU trials register) went stale 2026-06-24→07-16: detail enrichment made ~1,200 sequential
API calls (0.5s rate limit) >20min, exceeding the 1200s cron timeout → process killed before the
atomic cache write → `ctis=0` in every merged_trials. Discovered while checking the
`source_freshness` WARN (ctis=22d>14d) during a pre-run data-freshness check.

**Fixed — PR #507 (`aa09bbc1`), deployed to shared checkout 2026-07-16:**
- `_fetch_ctis_detail` reads persistent `cache/trials/ctis/raw/ctis_detail_*.json` first within
  `_DETAIL_CACHE_TTL_DAYS=30` (no network/sleep on hit). Archive already had ~1,196 files → next
  run's enrichment near-instant.
- `collect_ctis_trials(enrich_budget_secs=900)`: wall-clock budget defers remaining candidates so
  the collector always reaches the cache write; meta records `enrichment.deferred`.
- `cron_data_refresh.sh` CTIS timeout 1200→1800s. 56/56 collector tests green (+2 cache tests).
- Manual backfill run for 2026-07-16 initiated post-deploy (confirm cache wrote + ctis>0 in merge).

**Restart-storm root cause = the production outage, not cron itself.** The watchdog (`*/30`
`cron_watchdog.sh`) runs `data_refresh all` recovery whenever `PROD_RAN=false`; while production
was failing (price_append_health #499, surface_delta #500) it re-triggered every 30 min, each
hitting the CTIS timeout. Once production succeeded (07-16 09:42 exit 2), watchdog logs "Production
already ran — skipping" and the storm stopped. `service cron restart` "no sudo" line = benign
expected WSL behavior, not the loop.

**OPEN — minor watchdog loop:** `cron_watchdog.sh` (~L169) checks
`artifacts/heartbeat/${TODAY}_receipt.md`, but `tools/agent_heartbeat_checks.py` writes its receipt
to `agents/fleet_steward/memory/${TODAY}_receipt.md` (path mismatch) → "MISSED heartbeat receipt →
recovering" every 30 min. Heartbeat run itself is cheap (~seconds, exits 0 standalone) so low
impact, but it's a perpetual re-run. Fix = align the receipt path (decide which is canonical).
Not yet fixed — flagged for operator. Related: [[env_wsl_uptime_required]],
[[project_forward_validation_hardening_2026_07_10]].
