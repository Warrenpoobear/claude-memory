---
name: herald_darkness_resolved
description: Herald digest pipeline restored (2026-06-02 diagnosis and fix)
metadata: 
  node_type: memory
  type: project
  status: resolved
  date: 2026-06-02
  related: hermes_skills_inventory_current
  originSessionId: 7aaaa27d-e4f5-4c4c-8fec-8c82b385f194
---

# Herald Darkness Resolved — 2026-06-02

**Problem:** Herald news digest generation stopped 2026-05-26 (~5-day silence)  
**Root Cause:** Digest script existed but was never wired into cron  
**Resolution:** Cron entry added for 8:05 AM ET weekdays  
**Status:** LIVE (first digest sent 2026-06-02)

## Diagnosis Summary

### What was working
- ✓ Herald fetch (`fetch_company_press_releases.py`) — 2 PM daily via `cron_data_refresh.sh`
- ✓ Herald classify (`classify_press_releases.py`) — 2 PM daily via `cron_data_refresh.sh`
- ✓ Latest data: `classified_2026-06-01.jsonl` (338 KB, current)

### What was broken
- ✗ Herald digest (`build_news_digest.py`) — created 2026-04-02, never scheduled
- ✗ Last digest sent: 2026-05-26 08:47 (5 days + 15 hours silence)
- ✗ No cron entries for digest at 8 AM, 3 PM, or evening
- ✗ Script not called from any orchestrator or cron script

### Why it broke
Registry absorbed biotech_news_digest into herald (2026-05-30 Fix #5), but the digest script was never added back to the production cron. The fetch+classify pipeline was wired, but digest publication was overlooked.

## Fix Applied

**Cron entry added:**
```bash
5 8 * * 1-5 cd /mnt/c/Projects/biotech_screener/biotech-screener && python3 scripts/build_news_digest.py --window morning >> logs/news_digest.log 2>&1
```

**Timing:** 8:05 AM ET weekdays (offset from 8:00 AM firecrawl to avoid contention)  
**Window:** Morning (overnight news digest)  
**Log:** Appends to `logs/news_digest.log` (last entry now 2026-06-02 08:16)  
**Delivery:** Email to dschulz@wakerobin.co, djschulz@gmail.com

## Verification

```
Universe: 338 tickers
Loaded: 250 classified releases
Morning window: 0 items (no overnight catalysts)
Status: Sent to both recipients ✓
```

**Artifacts generated:**
- `biotech_news_digest_2026-06-02_0805.txt` (plain text)
- `biotech_news_digest_2026-06-02_0805.html` (formatted)
- `biotech_news_digest_2026-06-02_0805.json` (structured)

## Operational Notes

- **Digest runs daily at 8:05 AM ET** — morning window only (covers overnight news)
- **Data freshness:** Uses yesterday's classified releases (fetch/classify happen at 2 PM)
- **Monitoring:** Audit confirms all 31 Hermes skills operational; digest now part of daily deterministic pipeline
- **No Phase 2 or model impact** — pure data pipeline operational restoration

## References

- Herald agent: `agents/herald/SOUL.md`, `agents/herald/HEARTBEAT.md`
- Registry: `agents/AGENT_REGISTRY.json` (status: active, category: data_ingestion)
- Scripts: `tools/fetch_company_press_releases.py`, `tools/classify_press_releases.py`, `scripts/build_news_digest.py`
- Cron: User crontab entry 8:05 AM weekdays

**Signal darkness resolved. Herald pipeline fully operational.**
