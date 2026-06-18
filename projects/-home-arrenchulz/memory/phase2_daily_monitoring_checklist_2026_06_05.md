---
name: phase2-daily-monitoring-checklist
description: "Daily operational checklist for Phase 2 monitoring (2026-06-04 to ~2026-06-17); governance gates + data freshness + Layer B signals"
metadata:
  type: project
  status: active
  date: 2026-06-05
  relatedTo: "phase2_day1_official_start_2026_06_01, path_c_monitoring_restored_2026_06_01, layer_b_reactivation_2026_06_05"
---

# Phase 2 Daily Monitoring Checklist (2026-06-05 to ~2026-06-17)

**Purpose:** Verify operational health, governance gate status, and data freshness daily  
**Frequency:** Monday–Friday, business hours + evening (post-trading)  
**Owner:** Operator (manual review recommended; no automated portfolio changes)  

---

## PRE-MARKET (Before 08:00 ET)

### Data Freshness
- [ ] **Check price data currency**
  ```bash
  python3 -c "import pandas as pd; df=pd.read_csv('production_data/price_history.csv'); df['date']=pd.to_datetime(df['date']); latest=df[df['ticker'].isin(['XBI','COGT'])]['date'].max(); print(f'Latest price date: {latest.date()}')"
  ```
  ✓ If today's date matches → PASS  
  ⚠ If yesterday or older → CHECK logs/data_refresh.log for errors

- [ ] **Check yfinance recovery status**
  ```bash
  tail -20 artifacts/yfinance_recovery_log.txt
  ```
  ✓ Should show recent successful checks  
  ⚠ If errors → Alpaca fallback may be needed

- [ ] **Check Herald digest production** (8:05 AM ET job)
  ```bash
  ls -lh logs/news_digest.log | head -1
  tail -5 logs/news_digest.log
  ```
  ✓ Log updated today → news ingestion working  
  ⚠ If stale → Alert may be needed

---

## INTRADAY (08:00-14:00 ET)

### Cron Job Execution
- [ ] **Firecrawl research (08:00 ET)**
  ```bash
  tail -10 logs/data_refresh.log | grep -E "Firecrawl|ERROR"
  ```
  ✓ "done" message → successful  
  ⚠ Errors → check API key in .env

- [ ] **Herald news digest (08:05 ET)**
  ```bash
  tail -5 logs/news_digest.log
  ```
  ✓ Last line should be within last hour  
  ⚠ If older → job may have stalled

- [ ] **Path C governance gates (10:15 ET)**
  ```bash
  ls -lh /tmp/path_c_daily_$(date +%Y%m%d).log 2>/dev/null || echo "Not yet run"
  tail -30 /tmp/path_c_daily_*.log | grep -E "PASS|FAIL|trigger"
  ```
  ✓ Should show: Drawdown PASS, IC status, Jaccard, emergency exit armed  
  ⚠ Any FAIL → investigate immediately

- [ ] **Phase 2 daily tracking (10:20 ET)**
  ```bash
  tail -5 output/phase2_daily_$(date +%Y%m%d).log
  ```
  ✓ Should end with "PASS"  
  ⚠ If missing or error → snapshot not generated

---

## MIDDAY (14:00 ET)

### Full Data Refresh
- [ ] **Data refresh completion (14:00 ET)**
  ```bash
  tail -20 logs/data_refresh.log | grep -E "DONE|ERROR|Fail"
  ```
  ✓ All stages completed  
  ⚠ If partial completion → check individual stages:
  - ctgov, sec_8k, fda_adcom, fda_regulatory, herald, iv, universe

- [ ] **Snapshot generation readiness**
  ```bash
  ls -lh data/snapshots/$(date +%Y-%m-%d)/ 2>/dev/null | wc -l
  ```
  ✓ Should be 40+ files created after 10:20 ET  
  ⚠ If fewer files → check screen_output.json for errors

---

## AFTERNOON (16:00 ET)

### Intraday Enrichment
- [ ] **Firecrawl intraday enrichment (16:00 ET)**
  ```bash
  tail -5 logs/data_refresh.log | grep -E "intraday|enrichment"
  ```
  ✓ Job completed  
  ⚠ If missing → research enrichment delayed

---

## POST-TRADING (18:00-22:00 ET)

### Layer B Signal Monitors
- [ ] **Price action watch (18:00 ET)**
  ```bash
  tail -10 logs/price_action_watch.log
  ```
  ✓ Should show watch summary (X names, Y alerted)  
  ⚠ If error or missing → check if snapshot exists

- [ ] **Catalyst delta monitor (18:05 ET)**
  ```bash
  tail -10 logs/catalyst_delta.log
  ```
  ✓ Should report delta changes or "no changes"  
  ⚠ If missing → script may have failed

- [ ] **Options watch (18:10 ET)**
  ```bash
  tail -10 logs/options_watch.log
  ```
  ✓ Should report IV/greeks summary  
  ⚠ If error → options data may be stale

- [ ] **IC health monitor (18:15 ET)**
  ```bash
  tail -10 logs/ic_health_monitor.log
  ```
  ✓ Should report institutional cohort status  
  ⚠ If "NO DATA" → expected (cold-start), not an error

- [ ] **Grok biotech watch (18:20 ET)**
  ```bash
  tail -10 logs/grok_biotech_watch.log
  ```
  ✓ Should report analyst sentiment summary  
  ⚠ If error → news feed may be delayed

---

## EVENING (22:00 ET)

### Control Plane & QA
- [ ] **Evening catchup & audit (22:00 ET)**
  ```bash
  tail -30 logs/cron_evening_catchup.log | grep -E "PASS|FAIL|ERROR|sentinel"
  ```
  ✓ Should show: data_auditor PASS, sentinel heartbeat, no critical errors  
  ⚠ Any FAIL → investigate before next day

- [ ] **Ops control plane status**
  ```bash
  ls -lh output/phase2_daily_*.log | tail -1
  ```
  ✓ File timestamp within last 2 hours  
  ⚠ If older → ops reporting may be delayed

---

## GOVERNANCE GATE CHECKS (Daily)

### Critical Gates (Must PASS)

| Gate | How to Check | Expected | Action if FAIL |
|------|--------------|----------|---|
| **Drawdown vs XBI** | `tail /tmp/path_c_daily_*.log \| grep "drawdown"` | 0.00pp (PASS, ≤-2.00pp hard exit) | Real-time escalation |
| **13F Jaccard** | `tail /tmp/path_c_daily_*.log \| grep "Jaccard"` | ≥0.70 (0.875 stable) | Monitor; re-check daily |
| **IC Observable** | `tail /tmp/path_c_daily_*.log \| grep "IC"` | NO_DATA (expected; cold-start) | Monitor; expect first print ~2026-06-17 |
| **Emergency Exit** | `tail /tmp/path_c_daily_*.log \| grep "trigger"` | ARMED | Verify armed; no trigger should fire |

---

## PORTFOLIO INTEGRITY CHECKS (Daily)

### Immutability Verification
- [ ] **Baseline locked check**
  ```bash
  python3 -c "import json; b=json.load(open('data/snapshots_pit/2026-06-04/portfolio_positions.json')); print(f'Locked positions: {len(b[\"positions\"])}')"
  ```
  ✓ Should always be 30  
  ✗ If changed → governance violation; alert immediately

- [ ] **No unauthorized trades**
  ```bash
  git status | grep "modified.*positions\|modified.*portfolio"
  ```
  ✓ Should be clean (no uncommitted portfolio changes)  
  ⚠ If changes exist → not authorized; do not commit

---

## OPERATOR DECISION POINTS

### If Any Gate Fails

**Drawdown vs XBI drops to ≤-2.00pp:**
- Hard exit triggered
- Phase 2 window ends immediately
- Operator decision: abandon paper trading or investigate root cause

**13F Jaccard drops below 0.70:**
- Emergency exit escalates
- Operator decision: continue or revert

**Data freshness gaps (prices stale >1 day):**
- Drawdown gate becomes unreliable
- Operator decision: use Alpaca fallback or pause monitoring

---

## WEEKLY SUMMARY (Friday End-of-Day)

- [ ] **Collect Layer B outputs**
  ```bash
  ls -lh artifacts/price_action_watch/$(date +%Y-%m-*)_watch.json | tail -5
  ls -lh artifacts/catalyst_delta/*.json | tail -5
  ls -lh artifacts/options_watch/*.json | tail -5
  ```
  ✓ 5 days of outputs (Mon-Fri)

- [ ] **Review governance gate history**
  - Drawdown vs XBI: stable (0.00pp)?
  - 13F Jaccard: stable (0.875)?
  - Emergency exits: triggered? (should be zero)

- [ ] **Skills efficacy observations** (logging active since 2026-06-05)
  - Any Layer B skill runtime anomalies?
  - Any data freshness issues?
  - Any signal divergences (price_action vs catalyst_delta)?

- [ ] **Next week readiness**
  - Price data path functioning?
  - All cron jobs on schedule?
  - Any warnings or stalls?

---

## QUICK COMMANDS (Save to Alias)

```bash
# Full daily check (run once in morning)
alias phase2-check='echo "=== Price Data ===" && python3 -c "import pandas as pd; df=pd.read_csv(\"production_data/price_history.csv\"); df[\"date\"]=pd.to_datetime(df[\"date\"]); print(f\"Latest: {df[df[\\\"ticker\\\"].isin([\\\"XBI\\\"])][\\\"date\\\"].max().date()}\")" && echo "=== Path C Gates ===" && tail -5 /tmp/path_c_daily_*.log && echo "=== Phase 2 Tracking ===" && tail -3 output/phase2_daily_*.log && echo "=== Layer B Status ===" && tail -1 logs/price_action_watch.log logs/catalyst_delta.log logs/options_watch.log'

# Check all logs at once
alias logs-today='echo "Price Action:" && tail -1 logs/price_action_watch.log && echo "Catalyst Delta:" && tail -1 logs/catalyst_delta.log && echo "Options Watch:" && tail -1 logs/options_watch.log && echo "Evening Catchup:" && tail -1 logs/cron_evening_catchup.log'

# Governance gate status
alias gates-status='tail -20 /tmp/path_c_daily_*.log | grep -E "Drawdown|Jaccard|IC_MONITOR|trigger"'
```

---

## Notes

- **No portfolio changes authorized** (baseline locked through ~2026-06-17)
- **Layer B outputs advisory only** (no automatic trading)
- **Emergency exits armed** (real-time triggers if thresholds breach)
- **Operator decision authority** only during decision gate (~2026-06-17)

---

**Duration:** 2026-06-04 (Day 1) → ~2026-06-17 (Decision gate)  
**Frequency:** Daily Mon-Fri  
**Effort:** ~15-20 minutes per day (10 minutes automated checks + 5-10 minutes review)  
**Next Milestone:** 2026-06-17 IC observable + Path C extension decision
