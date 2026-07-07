---
name: sec-8k-collapse-2026-06-03
description: SEC 8K data collapse blocked snapshot 2026-06-03; safety safeguard working correctly
metadata: 
  node_type: memory
  type: project
  status: active
  originSessionId: 7aaaa27d-e4f5-4c4c-8fec-8c82b385f194
---

# SEC 8K Data Collapse Investigation — 2026-06-03

## Incident Summary
Production snapshot **blocked** 2026-06-03 because SEC 8K cache refresh **failed data quality validation**. This is a **safeguard working correctly**, not a system failure.

**Timeline:**
- 2026-06-01: 497 events ✓ accepted → cache written
- 2026-06-02 at 14:00 ET: 118 events collected → REJECTED (collapse)
- 2026-06-03 at 14:00 ET: 118 events collected → REJECTED (collapse) 

**Rejection Criteria:**
```
new_count / prior_count = 118 / 497 = 0.24
threshold = 0.30 (SEC8K_MIN_RATIO_VS_PRIOR in cache_health.py)
verdict: REJECTED (0.24 < 0.30) — collapse detected
```

## Root Cause: UNKNOWN (Data Source, Not Code)

**What we know:**
- No code changes to SEC collector since May 29
- No code changes to warm_caches.py since May 29
- No code changes to cache_health.py since May 29
- Pattern repeats on both June 2 and 3 (118 events both days)
- Only SEC 8K affected; FDA, ClinicalTrials, press releases all operational
- Collapse detection is **working as designed** (safeguard functioning)

**Possible causes:**
1. SEC EDGAR API incomplete response (network/API issue)
2. SEC EDGAR search index stale or degraded
3. Legitimate drop in 8K filings filed June 2-3 vs June 1
4. Collector filtering logic (deduplication) too aggressive

**Not caused by:**
- Recent code changes (none detected)
- Phase 1b infrastructure changes (unrelated code paths)
- System failure (other data sources working)

## Impact & Status

**Operational:**
- ✗ Today's snapshot NOT produced (`data/snapshots/2026-06-03/` empty)
- ✗ Status file: `sec_8k.exists: false`, `overall_pass: false`
- ✓ Other data sources operational (10 FDA AdCom, 3 FDA regulatory, 19K ClinicalTrials, 253 press releases)
- ✓ Phase 1b primitives unaffected (scheduler, CircuitBreaker, IC hygiene all running)
- ✓ Phase 2 read-only monitoring unaffected (paused pending new portfolio data)

**Cache state:**
- Latest SEC 8K cache: `8k_catalysts_2026-06-01_937b38db.json` (497 events)
- No dated caches for June 2-3 exist (both rejected)
- Safeguard **preventing stale/incomplete data** from entering production

## Recovery Options

**Option A (safest): Investigate root cause first**
1. Manual curl test to SEC EDGAR API to verify responsiveness
2. Check actual number of 8-Ks filed June 2-3 on SEC website
3. Review collector filtering logic (deduplication rules)
4. Only then proceed to Options B/C

**Option B: Use stale June 1 cache (temporary)**
```bash
cp cache/sec/8k_catalysts/8k_catalysts_2026-06-01_*.json \
   cache/sec/8k_catalysts/8k_catalysts_2026-06-03_937b38db.json
# Re-run production screen; note: data will be 2 days stale
```
Risk: Snapshot will have old catalyst data; acceptable for diagnostics only

**Option C: Relax collapse threshold (NOT recommended)**
- Change `SEC8K_MIN_RATIO_VS_PRIOR` in cache_health.py from 0.30 → 0.20
- Allows 118-event cache to pass (ratio 0.24 < 0.20 still fails, but 0.25+ passes)
- Risk: Safeguard weakened; could accept genuinely bad data in future incidents

## Recommendation

**Do NOT relax safeguards yet.** Safeguard is working as designed. Execute Option A:

1. **Verify SEC EDGAR availability**
   ```bash
   curl -s -H "User-Agent: Wake Robin Research contact@wakerobincapital.com" \
     "https://efts.sec.gov/LATEST/search-index?q=10-K"
   ```
   Should return JSON with company filings. If 5xx error or malformed → SEC issue confirmed.

2. **Check universe 8K coverage**
   - Manually visit SEC EDGAR for 1-2 top biotech tickers (e.g., RVMD, CELC)
   - Count their 8K filings May 29 – June 3
   - Compare to expected coverage in collector output

3. **Review deduplication logic**
   - Check if June 1 cache included duplicates that June 2-3 correctly removed
   - If so, actual new coverage might be similar (false collapse)

Once root cause confirmed, decide recovery path.

## Governance Impact

- Phase 2 overall status: **Waiting state continues** (no new portfolio data)
- Phase 3 decision gates: **Unaffected** (waiting for ~2026-06-17 IC gate regardless)
- Daily monitoring: **Paused on production snapshot** (other data sources monitored separately)
- Safeguards: **All working correctly** (no emergency lift authorized)

---
**Investigation Status:** RESOLVED (2026-06-04)
**Operator Decision:** EXECUTED Option B — Used June 1 cache for June 3-4 snapshots
**Rationale:** SEC API confirmed responsive; 118-event collapse appears transient. Unblocked production to maintain operational continuity. Phase 2 read-only (paper trading) unaffected.
**Monitoring:** Continues 2026-06-04+ to detect API recovery; will flag if June 5+ collections remain depressed
**Timeline:** Snapshots unblocked; next decision point if depressed data continues
