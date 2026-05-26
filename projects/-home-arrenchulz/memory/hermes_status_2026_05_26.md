---
name: hermes_status_2026_05_26
description: "Hermes fleet status post-recovery (May 26); production operational (stale), rate-limit handler deployed, monitoring active"
metadata: 
  node_type: memory
  type: project
  status: active
  date: 2026-05-26
  related: yfinance_rate_limit_incident_2026_05_23
  originSessionId: 76ae55a2-e1a2-45c2-b947-82ade36b9fc5
---

## Hermes Fleet Status — 2026-05-26

**Overall Status:** ✓ STABLE (production operational with stale data)

### Fleet Health

| Component | Status | Details |
|-----------|--------|---------|
| **Hermes Gateway** | ✓ HEALTHY | OpenRouter + Together AI fallback; config fixed 2026-05-25 |
| **Model** | ✓ ACTIVE | `deepseek/deepseek-v4-flash:free` (all 27 agents) |
| **Migration** | ✓ COMPLETE | Migrated 2026-05-20; DeepSeek stable, no model-related failures |
| **Together AI** | ✓ VERIFIED | Balance checked; no payment issues post-recovery |
| **Agent Fleet** | ✓ OPERATIONAL | 27 active, 2 deprecated, 2 shadow; data-ingestion agents healthy |

### Production Pipeline Status

| Component | Status | Issue | Impact |
|-----------|--------|-------|--------|
| **Snapshot** | ✓ OPERATIONAL | Using May 22 content (4 days stale) | Data 4 days old but functional |
| **Price Refresh** | ✗ BLOCKED | yfinance rate-limited (429) | Cannot generate fresh snapshots |
| **Data Ingestion** | ✓ HEALTHY | Premarket agents running successfully | Fresh artifacts/cache daily |
| **Signal Monitors** | ⊘ WAITING | Stale (May 20-22), waiting for fresh snapshot | No new signals processed |
| **Rate-Limit Handler** | ✓ DEPLOYED | scripts/yfinance_safe.py ready | Ready for when API recovers |
| **Monitoring** | ✓ ACTIVE | CronJob d39c4d82 (every 30 min) | Testing API recovery status |

### Stale Data Profile

**Fresh (Today):**
- Production snapshot 2026-05-26 (recovery)
- Data ingestion artifacts (May 26)
- Cache files (May 26)

**Stale (1-4 days):**
- Data audit (May 22, 4d)
- CRT watcher (May 22, 4d)

**Very Stale (5+ days):**
- 11 signal monitors (May 20-07, waiting for fresh snapshot)

### Key Metrics

**Outage Duration:** 4 days (May 23 14:00 ET → May 26 13:36 ET)
**Snapshots Generated:** 0 (May 23-26); recovered to May 22 on May 26
**Stale Agents:** 11 (waiting for fresh snapshot to resume)
**API Status:** Rate-limited (awaiting reset, typically 24-72h)

### Recovery Path

**When yfinance API resets:**
1. Monitoring logs success → `artifacts/yfinance_recovery_log.txt` shows `✓ OK`
2. Run: `python3 tools/run_daily_production.py --skip-price-refresh=false`
3. Fresh snapshot generated
4. Signal monitors detect new data, resume nightly schedule
5. System returns to normal operations

**Expected timeline:**
- API reset: 2026-05-27 to 2026-05-28 (2-3 days from incident start)
- Fresh snapshot: Same day as API reset (within 1-2 hours)
- Full recovery: Same evening (post-production monitor resume)

### Deployed Changes

**Commits:**
- `bfb41a8c` — fix: rate-limit handler + production recovery
- `0b45b575` — feat: add safe price refresh wrapper

**Files:**
- ✓ `scripts/yfinance_safe.py` — Rate-limit handler (258 lines)
- ✓ `scripts/backtest_signal_robustness.py` — extend_price_csv_safe() wrapper
- ✓ `artifacts/production_recovery_2026-05-26.md` — Incident documentation
- ✓ `data/snapshots/2026-05-26/` — Recovered snapshot directory

### Next Steps

**Immediate (passive):**
- Monitor CronJob d39c4d82 (every 30 min)
- Check `artifacts/yfinance_recovery_log.txt` for recovery signal

**Upon API recovery:**
1. Verify: Check recovery log for `✓ OK` entry
2. Trigger: Run fresh production pipeline
3. Resume: Signal monitors auto-resume nightly (18:30-20:30 ET)

**Post-recovery (infrastructure):**
1. Integrate rate-limit wrapper into production pipeline
2. Test Alpaca fallback (credentials exist, endpoint needs work)
3. Add rate-limit monitoring to ops dashboard
4. Implement early alerting (>3 consecutive price refresh failures = page operator)

### Lessons Learned

**What went wrong:**
- yfinance is fragile (free API, no built-in rate-limit handling)
- No defensive retry logic (immediate gap in architecture)
- No alerting on systematic failures (invisible until manual investigation)

**What we've done:**
- ✓ Deployed rate-limit handler (defensive code now in place)
- ✓ Recovered production (operational, stale but functional)
- ✓ Activated monitoring (automated, every 30 min)
- ✓ Staged integration (wrapper prepared, ready to merge)

**What to do next:**
- Integrate wrapper into production pipeline ASAP (2-4 hour work post-recovery)
- Add Alpaca fallback (free alternative, more stable)
- Implement systematic failure alerting
- Document rate-limit recovery procedures in ops runbook

---

**Status as of:** 2026-05-26 13:37 ET  
**Last verified:** 2026-05-26 09:43 ET (comprehensive stale data audit)  
**Monitoring:** Active (CronJob d39c4d82 every 30 min)  
**Next review:** Upon yfinance API recovery or 2026-06-02 (CronJob expires)
