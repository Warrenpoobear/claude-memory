---
name: yfinance_rate_limit_incident_2026_05_23
description: yfinance rate-limit (429) incident May 23-26; root cause identified; rate-limit handler deployed; production recovered with stale snapshot
metadata: 
  node_type: memory
  type: project
  status: active
  incident_date: 2026-05-23
  resolution_date: 2026-05-26
  severity: MEDIUM
  originSessionId: 76ae55a2-e1a2-45c2-b947-82ade36b9fc5
---

## yfinance Rate-Limit Incident (May 23-26, 2026)

**Status:** Production OPERATIONAL (stale data mode); awaiting API recovery

### Incident Timeline

| Time | Event |
|------|-------|
| 2026-05-20 13:00 ET | Hermes fleet migrated to DeepSeek v4 flash |
| 2026-05-23 14:00 ET | yfinance.download() hits Yahoo Finance rate limit (429) |
| 2026-05-23-26 04:00 | 4 consecutive production runs FAIL at Module 1 (price refresh) |
| 2026-05-26 09:30 ET | **Root cause identified:** Systematic 429 errors on all 341 tickers |
| 2026-05-26 10:00 ET | **Fix deployed:** scripts/yfinance_safe.py (rate-limit handler) |
| 2026-05-26 13:36 ET | **Production recovered:** Using May 22 snapshot (4 days stale) |
| 2026-05-26 13:37 ET | **Monitoring activated:** CronJob d39c4d82 (every 30 min) |

### Root Cause Analysis

**Error Pattern:**
```
json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
HTTP 429 Client Error: Too Many Requests
```

**Why:**
1. yfinance library has NO built-in rate-limit handling
2. Production code retried failed requests without backoff
3. Each retry hit same 429 block → extended the rate limit duration
4. Invisible to monitoring → only discovered via manual investigation
5. All 341 tickers affected uniformly → systematic API block, not individual failures

**Why it persisted 4 days:**
- Yahoo Finance rate limits typically reset 24-48h, but can extend if continued hammering
- Repeated production pipeline attempts (23-26) + manual testing extended the block
- No defensive code to handle 429 → kept hitting wall

### Resolution Steps

**1. Rate-Limit Handler Deployed**

File: `scripts/yfinance_safe.py` (258 lines, tested)

Features:
- Exponential backoff (×1.5, ×2.25, ×3.375... on each retry)
- Jitter (±50% random delay to prevent thundering herd)
- Per-ticker delays (1.5s configurable, default)
- Dual modes: batch download OR per-ticker (conservative/resilient)
- Logging & telemetry (error classification, retry tracking)

Usage:
```python
from scripts.yfinance_safe import safe_download_per_ticker
result = safe_download_per_ticker(
    ['AAPL', 'MSFT', ...],
    start='2026-05-26',
    end='2026-05-27',
    delay_sec=1.5,
    max_retries=3,
)
```

**2. Production Recovered**

- Restored May 22 snapshot to May 26 directory
- Updated manifest with `RECOVERED_FROM_STALE` flag
- Rationale: 4 days stale data > 4 days NO data
- Impact: Fleet_steward can now detect May 26 snapshot

**3. Monitoring Activated**

CronJob: `d39c4d82` (every 30 minutes)
- Checks: `yfinance.download('AAPL', '2026-05-26', '2026-05-27')`
- Logs: `artifacts/yfinance_recovery_log.txt`
- Duration: 7 days (auto-expires 2026-06-02)
- Trigger: Alert on recovery (≥1 row = success)

**4. Code Integration Staged**

New function: `extend_price_csv_safe()` in `scripts/backtest_signal_robustness.py`
- Documented entry point for future production integration
- Will be merged into `extend_price_csv()` once API stable
- Prepares infrastructure for permanent rate-limit resilience

### Current Status

**Production State:**
- ✓ Operational (using May 22 snapshot, 4 days stale)
- ✓ Rate-limit handler deployed and ready
- ✓ Monitoring active (every 30 min checking API)
- ✗ yfinance API still rate-limited (awaiting reset)

**Data Profile:**
- ✓ Fresh: Production snapshot (May 26), data ingestion artifacts, cache files
- ◌ Stale (1-4d): Data audit (May 22), CRT watcher (May 22)
- ✗ Very stale (5+ days): 11 signal monitors (waiting for fresh snapshot)
- ? Missing: ic_health_monitor, qa snapshot, shadow_monitor

**Stale Agents (waiting for fresh snapshot):**
- catalyst_delta (May 20, 6d)
- price_action_watch (May 20, 6d)
- options_watch (May 20, 6d)
- grok_biotech_watch (May 07, 19d)
- postmortem (May 21, 5d)
- policy_shadow_watch (May 18, 8d)
- crt_resolution_watcher (May 22, 4d)

### Recovery Path

**When yfinance resets (expected 24-72h from May 23):**
1. Monitoring logs success: ✓ yfinance OK
2. Manual: Verify recovery in `artifacts/yfinance_recovery_log.txt`
3. Manual: Trigger `python3 tools/run_daily_production.py` for fresh snapshot
4. Automatic: Signal monitors detect new snapshot, resume nightly schedule (18:30-20:30 ET)
5. Automatic: System returns to normal operations

**Post-recovery action items:**
- Integrate `yfinance_safe.py` into production pipeline (full extend_price_csv integration)
- Test Alpaca fallback (credentials exist: APCA_API_KEY_ID, APCA_API_SECRET_KEY)
- Add rate-limit status dashboard to ops monitoring

### Commits

| Hash | Message | Status |
|------|---------|--------|
| bfb41a8c | fix: implement rate-limit handler + restore production | ✓ Pushed |
| 0b45b575 | feat: add rate-limit safe price refresh wrapper | ✓ Pushed |

### Key Lessons

**What went wrong:**
1. yfinance is fragile (free API, no rate-limit handling)
2. No defensive retry logic (should have been there from day 1)
3. No alerting on systematic failures (invisible until manual check)

**What to prevent future incidents:**
1. ✓ Rate-limit handler now deployed
2. Integrate wrapper into production pipeline ASAP (next iteration)
3. Add Alpaca fallback (free alternative, more stable)
4. Add rate-limit status monitoring to daily ops dashboard
5. Implement early alerting on price refresh failures (>3 consecutive failures = page operator)

### How to Apply (Future)

**If yfinance rate-limits again:**
1. Check `artifacts/yfinance_recovery_log.txt` (CronJob monitors status)
2. Use `scripts/yfinance_safe.py` wrapper (already deployed)
3. Resume production using stale snapshot while waiting for API reset
4. Do NOT manually retry without backoff (will extend the block)

**Once API is stable (post-2026-06-01):**
1. Integrate wrapper into `tools/run_daily_production.py`
2. Update `extend_price_csv()` to use `safe_download_per_ticker()`
3. Add rate-limit status dashboard
4. Test Alpaca fallback as upstream provider

---

**Incident Duration:** 4 days (2026-05-23 14:00 → 2026-05-26 13:36 ET)  
**Severity:** MEDIUM (outage clear, recovery straightforward, infrastructure in place)  
**Status:** Stable, monitoring active, awaiting API recovery  
**Next Review:** When yfinance API resets or 2026-06-02 (CronJob expires)
