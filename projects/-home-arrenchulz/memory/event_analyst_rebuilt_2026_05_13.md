---
name: event_analyst_rebuilt_2026_05_13
description: Fresh event analyst summary rebuilt 2026-05-13 after 5-day stale gap
metadata: 
  node_type: memory
  type: project
  status: resolved
  date: 2026-05-13
  originSessionId: 64125f0f-c9ea-4206-bd73-07c2f93a88dc
---

## Task B: Event Analyst Rebuild (COMPLETE)

**Stale period:** 2026-05-08 → 2026-05-13 (5 days)  
**Root cause:** Cron job at `55 18 * * 1-5` (6:55 PM ET M-F) not executing since 2026-05-08  
**Fix:** Manually rebuilt using `tools/build_event_analyst.py --as-of-date 2026-05-13`  
**Output files:** 
- `artifacts/event_analyst/2026-05-13_summary.json`
- `artifacts/event_analyst/2026-05-13_summary.md`

## Key Findings (174 postmortems, 90-day lookback)

### By Family
- **CLINICAL** (n=126): 53% hit T+1, 52% hit T+5 (median +0.27% / +0.07%)
- **REGULATORY** (n=23): 48% hit T+1, 67% hit T+5 (median -0.09% / +2.45%)
- **None** (n=23): 39% hit T+1, 52% hit T+5 (median -1.95% / +2.36%)
- **NO_CATALYST** (n=2): 100% hit T+1, 100% hit T+5 (median +19.10% / +17.40%) — small sample

### By Tier
- **Tier A** (n=36): 50% hit T+1, 64% hit T+5 (median +0.07% / +2.04%)
- **Tier B** (n=28): 57% hit T+1, 53% hit T+5 (median +1.05% / +0.01%)
- **Tier C** (n=35): 46% hit T+1, 53% hit T+5 (median +0.00% / +0.13%)
- **Tier D** (n=25): 64% hit T+1, 36% hit T+5 (median +1.89% / -4.10%) — **strong short-term mean reversion**

### By Shadow Membership
- **Shadow=True** (n=27): 52% hit T+1, 61% hit T+5 (median +0.11% / +1.85%)
- **Shadow=False** (n=147): 51% hit T+1, 53% hit T+5 (median +0.14% / +0.17%)
- **Signal:** Shadow names outperform at T+5 by ~8pp; T+1 parity

### By Hard Catalyst
- **Hard=True** (n=87): 49% hit T+1, 53% hit T+5 (median +0.00% / +0.07%)
- **Hard=False** (n=87): 53% hit T+1, 55% hit T+5 (median +0.34% / +1.21%)
- **Signal:** Soft catalysts slightly outperform hard

### By Trade Plan
- **Trade=True** (n=2): 0% hit T+1, 50% hit T+5 (median -2.44% / +1.64%) — insufficient data
- **Trade=False** (n=172): 52% hit T+1, 54% hit T+5 (median +0.19% / +0.36%)

## Notable Outcomes

**Largest Winners:**
- XENE +49.6% (tier B, None, shadow=yes, 2026-03-06)
- TVTX +37.2% (tier B, NO_CATALYST, shadow=no, 2026-04-13)
- FATE +17.6% (tier B, CLINICAL, shadow=no, 2026-05-01)
- REPL +14.7% (tier A, CLINICAL, shadow=yes, 2026-04-13)
- DNA +14.7% (tier D, CLINICAL, shadow=no, 2026-04-30)

**Largest Losers:**
- REPL -64.3% (tier A, CLINICAL, shadow=yes, 2026-04-10)
- ALLO -25.5% (tier A, None, shadow=yes, 2026-04-13)
- QURE -14.0% (tier D, CLINICAL, shadow=no, 2026-03-02)
- OCGN -11.2% (tier D, None, shadow=no, 2026-03-04)
- CRVS -7.0% (tier A, None, shadow=no, 2026-03-12)

## Cron Diagnosis

Event analyst cron job scheduled but not executing:
```
55 18 * * 1-5 cd /mnt/c/Projects/biotech_screener/biotech-screener && \
  source .env 2>/dev/null && \
  /usr/bin/python3 tools/run_agent_direct.py --agent event_analyst --message "DAILY" --write-memory
```

Last execution: 2026-05-06 (via Hermes agent). Builder script `/tools/build_event_analyst.py` works correctly and was used for manual rebuild. Recommend verifying cron daemon status and Hermes gateway health (may have crashed/restarted, losing scheduled jobs).

## Next Steps

1. Verify event_analyst cron is firing daily (add observability / canary check)
2. Ensure Hermes gateway restart at 2026-05-13 didn't lose cron registrations
3. Monitor 2026-05-14 execution at 18:55 ET
4. Verify memory note written to `agents/event_analyst/memory/2026-05-13.md` by next cron run
