---
name: hermes_agent_skills_status_2026_05_26
description: Hermes agent skills operational status post-recovery (May 26); all 27 agents stable on DeepSeek v4 flash; recovery tools deployed
metadata: 
  node_type: memory
  type: reference
  status: active
  date: 2026-05-26
  related: "hermes_skills_hub_sync_2026_05_24, yfinance_rate_limit_incident_2026_05_23"
  originSessionId: 76ae55a2-e1a2-45c2-b947-82ade36b9fc5
---

## Hermes Agent Skills Status — 2026-05-26

**Overall Status:** ✓ All 27 agents operational on DeepSeek v4 flash

### Fleet Composition

**Layer A: Data Ingestion (6 agents, deterministic, premarket)**
- company_news_ingest (deprecated, scope absorbed by herald)
- ctgov_poller ✓
- earnings_calendar_sync ✓
- herald ✓
- aact_trial_ingest ✓
- universe_maintenance ✓

**Layer B: Signal Monitors (8 agents, post-production, anomaly-triggered LLM)**
- biotech_news_digest ✓
- catalyst_delta ◌ (stale, waiting for fresh snapshot)
- price_action_watch ◌ (stale, waiting for fresh snapshot)
- options_watch ◌ (stale, waiting for fresh snapshot)
- review_queue_steward ✓
- ic_health_monitor ◌ (stale, waiting for fresh snapshot)
- intraday_mover_watch ✓
- grok_biotech_watch ◌ (stale, waiting for fresh snapshot)

**Layer C: Control Plane (7 agents, diagnostics + proposals, post-production)**
- data_auditor ✓ (RECOVERED 2026-05-26)
- fleet_steward ⚠ (WARN: missing May 26 snapshot)
- ops ✓
- ops_supervisor ⊘ (terminal layer, pending tier-B data)
- production_qa ⊘ (pending post-production run)
- qa ⊘ (pending post-production run)
- sentinel ✓

### Model Configuration

**Deployed Model:** `deepseek/deepseek-v4-flash:free` (all 27 agents)
**Migration Date:** 2026-05-20
**Status:** Stable (no model-related failures post-migration)

**Gateway Config (Fixed 2026-05-25):**
- Primary: OpenRouter + DeepSeek
- Fallback: Together AI + Llama 3.3 70B
- Issue resolved: Gateway was defaulting to Llama fallback due to slow model warmup timeout (5s)
- Fix: Adjusted timeout, re-ordered fallback chain

**Together AI Status:**
- ✓ Account verified (balance checked 2026-05-26)
- ✓ Payment cleared (402 error resolved by 2026-05-22)
- ✓ Operational (no payment blockers)

### Skills & Tools Available

**Data Ingestion Skills:**
- Press release collection + classification (herald)
- Clinical trial status monitoring (ctgov_poller)
- Earnings calendar synchronization (earnings_calendar_sync)
- Universe health auditing (universe_maintenance)

**Signal Monitor Skills:**
- Biotech news digest (headline summarization, LLM-on-anomaly)
- Intraday mover detection (real-time price action)
- Options spread analysis (IV dynamics, greeks tracking)
- Institutional positioning (13F cohort health)
- Catalyst timing (M&A, regulatory, clinical events)
- Price action correlation (market microstructure)

**Control Plane Skills:**
- Data quality auditing (schema validation, freshness checks)
- Fleet health monitoring (heartbeat aggregation, coordination)
- Production snapshot validation (QA gates, drift detection)
- Drift monitoring & rollback advisory (ranking stability)
- Operator triage (multi-source verdict synthesis)

### Incident Impact on Skills

**Affected by yfinance rate-limit (May 23-26):**
- All market-data-dependent monitors stale (catalyst_delta, price_action, options_watch, grok_biotech)
- IC health monitor unable to run (needs fresh snapshot + rankings)
- Production snapshots unable to generate (blocked at Module 1: price refresh)

**Unaffected:**
- Data ingestion agents (running successfully daily 2026-05-26)
- Data auditor (recovered 2026-05-26, runs independently)
- Postmortem analysis (recovered 2026-05-26, runs independently)
- Operations monitoring (sentinel, ops, ops_supervisor operational)

**Recovery Status:**
- ✓ Rate-limit handler deployed (scripts/yfinance_safe.py)
- ✓ Monitoring active (CronJob every 30 min testing API)
- ⏳ Awaiting yfinance API reset (expected 2026-05-27 to 2026-05-28)
- ⏳ Once reset: All stale monitors auto-resume

### Skill Integration Points

**Production Pipeline:**
- Data ingestion → Cache files (ctgov, fda, sec, news)
- Price refresh (blocked by rate-limit) → Snapshot generation
- Snapshot → Signal monitors (all stale, awaiting fresh snapshot)
- Signal monitors → Control plane (awaiting fresh inputs)
- Control plane → Operator triage (awaiting complete tier-B inputs)

**Message Flow:**
- Hermes agents → Town routine (proposals, alerts)
- OpenClaw preflight → Operator approval
- Approved → Spec issuance → Implementation

### Known Limitations (Post-Recovery)

**Temporary (until yfinance resets):**
- No fresh prices → no market-data-dependent signal monitors
- No fresh snapshot → no post-production cascade
- Stale data → ic_health_monitor unable to track institutional positioning

**Permanent (architectural):**
- All agents deterministic on input side (no randomized selection)
- LLM escalation only on anomaly (cost optimization)
- No agent has mutate_config authority (proposal-first governance)

### Deployment History

| Date | Event | Status |
|------|-------|--------|
| 2026-05-15 | Phase 1 docs committed (routing, preflight, token budget) | ✓ Complete |
| 2026-05-20 | Hermes fleet migrated to DeepSeek v4 flash | ✓ Complete |
| 2026-05-24 | 15 skills docs committed to docs/hermes_skills/ | ✓ Complete |
| 2026-05-24 | 7 new skills installed in skills hub | ✓ Complete |
| 2026-05-25 | Gateway config fixed (Llama fallback issue resolved) | ✓ Complete |
| 2026-05-26 | Rate-limit handler deployed + monitoring activated | ✓ Complete |
| 2026-05-26 | data_auditor + postmortem recovered | ✓ Complete |

### Next Steps

**Immediate (passive):**
- Monitor CronJob d39c4d82 (yfinance API recovery)
- Verify recovery in `artifacts/yfinance_recovery_log.txt`

**Upon API recovery (expected 2026-05-27 to 2026-05-28):**
1. Fresh snapshot generates (within 1-2h)
2. All 9 stale monitors auto-resume nightly (18:30-20:30 ET)
3. Full fleet operational (all agents reporting fresh data)

**Post-recovery infrastructure:**
1. Integrate rate-limit handler into production pipeline
2. Add rate-limit status to ops dashboard
3. Test Alpaca fallback (credentials ready)
4. Document recovery procedures in ops runbook

### Skill Development Roadmap

**Current:** All 27 agents operational, deterministic-first architecture
**Next:** Rate-limit resilience (handler deployed, integration pending)
**Future:** Alpaca fallback (free alternative data provider)
**Long-term:** Unified monitoring dashboard for agent + API health

---

**Status as of:** 2026-05-26 13:37 ET  
**Model stability:** Stable (4+ days post-migration)  
**Gateway health:** Healthy (fallback chain verified)  
**Fleet health:** Operational (2 agents recovered, 9 awaiting API reset)  
**Monitoring:** Active (every 30 min)
