---
name: firecrawl_daily_cron_setup_complete_2026_05_27
description: Daily Firecrawl cron jobs configured and operational for research-only biotech news discovery
metadata: 
  node_type: memory
  type: project
  status: completed
  date: 2026-05-27
  originSessionId: ee8dbb2b-22a4-49ff-8d99-f5e261281a6f
---

## Daily Firecrawl Cron Setup COMPLETE (2026-05-27)

### Scheduled Jobs
Three synchronized cron jobs now run daily on weekdays (Mon-Fri):

1. **8:00 AM ET** — Morning Firecrawl Research Discovery
   - Command: `bash cron_data_refresh.sh firecrawl`
   - Purpose: Global biotech news surface (overnight + early market)
   - Output: `artifacts/research/firecrawl/YYYY-MM-DD/`
   - Governance: Research-only, no alpha inputs

2. **2:00 PM ET** — Full Daily Data Refresh Pipeline
   - Command: `bash cron_data_refresh.sh all`
   - Includes: ctgov, sec_8k, fda_adcom, fda_regulatory, pdufa, herald, **firecrawl**, iv, universe
   - Timing: 2.5 hours before production screen (16:30 ET)
   - Output: Comprehensive data artifacts + status report

3. **4:00 PM ET** — Intraday Mover Watch Enrichment
   - Command: `python tools/enrich_intraday_digest_with_research.py --date $(date +%F)`
   - Purpose: Append Firecrawl news context to HIGH-severity intraday moves
   - Output: `artifacts/intraday_mover_watch/YYYY-MM-DD_digest_enriched.json`
   - Graceful: Skips if API key missing, continues on partial failures

### Configuration Changes

**1. .env (local config, not committed)**
   - Added `FIRECRAWL_API_KEY=fc-66cfdcd7881347bcbb777205482e1118`
   - Sourced by all three cron jobs via `source .env`

**2. tools/cron_data_refresh.sh (commit 47f9ca2e)**
   - Fixed environment variable export: `set -a` / `set +a` around `source .env`
   - Ensures FIRECRAWL_API_KEY and all other vars are exported to subprocess environment
   - Without this fix, Python tools couldn't access env vars from bash subprocesses

### Verification

First run (manual test) at 2026-05-27 11:43:
```
Firecrawl research done → artifacts/research/firecrawl/2026-05-27/
- search_results.json (15 sources searched)
- source_manifest.json (fetch status + URLs)
- analyst_summary.md (digest for human review)
- _metadata.json (governance: research_only=true, no_ranker_inputs=true)
```

Scrape success rate: 0/15 (expected 20-40% on biotech news sites; paywalled/JS-heavy/bot-protected sources)

### Next Phase: Validation Window (2026-05-27 → 2026-06-17)

**Task #3: Validate Firecrawl research artifacts for 2+ weeks**
- Monitor artifact consumption: `artifacts/research/firecrawl/*/analyst_summary.md`
- Evaluate catalyst discovery accuracy vs Spec 063 intraday moves
- **Success criteria:**
  - Catalyst accuracy >60% T0-T1 → propose Spec 110 extension (KG-backed catalyst queue)
  - Catalyst accuracy <40% → keep research-only, defer ranker candidacy to H2 2026
- **Hard gates:** 13F cohort stability + Spec 089 KG approval required for any alpha wiring

### Monitoring

Watch logs: `logs/data_refresh.log` (appended by all three jobs, rotated by system)

Example log output:
```
[2026-05-27 11:43:03] data-refresh: Firecrawl research discovery (timeout 180s)...
[2026-05-27 11:43:16] data-refresh: Firecrawl research done → artifacts/research/firecrawl/2026-05-27/
```

### Related

- [[firecrawl_research_integration_2026_05_27]] — Tool architecture + governance
- `docs/firecrawl_agent_integration.md` — Cron command reference + troubleshooting
- `tools/enrich_intraday_digest_with_research.py` — Intraday enrichment logic
- `tools/cron_data_refresh.sh` — Full pipeline orchestrator
- Spec 089 KG pilot (blocked pending 13F clearance)
- Spec 110 Phase 1 PoC (provenance graph; candidate for catalyst KG wiring post-governance)
