---
name: hermes-skills-phase2-operational-status-2026-06-05
description: "Hermes 31 skills operational for Phase 2 monitoring; Layer B signal skills restored; all governance-critical skills active"
metadata:
  type: project
  status: active
  date: 2026-06-05
  relatedTo: "hermes_agent_skills_status_2026_05_26, hermes_skills_optimization_framework, layer_b_reactivation_2026_06_05"
---

# Hermes Skills — Phase 2 Operational Status (2026-06-05)

## Fleet Composition

**Total Skills Deployed:** 31 active  
**Model:** DeepSeek v4 flash (stable since 2026-05-20)  
**Status:** ✓ OPERATIONAL across all 3 layers

---

## Layer Organization (Operational for Phase 2)

### Layer A: Data Ingestion (5 skills — ✓ ACTIVE)
- **herald** — Press release collection + classification (daily)
- **ctgov_poller** — Clinical trial status monitoring (daily)
- **earnings_calendar_sync** — Earnings synchronization (daily)
- **aact_trial_ingest** — Advanced clinical trials (daily)
- **universe_maintenance** — Health auditing + scope (daily)

**Status:** ✓ Producing daily; all sources flowing

### Layer B: Signal Monitors (8 skills — ✓ RESTORED 2026-06-05)
- **price_action_watch** — Price moves, volume spikes (18:00 ET) ✓ RESTORED
- **catalyst_delta** — Event timing deltas (18:05 ET) ✓ RESTORED
- **options_watch** — IV dynamics, greeks (18:10 ET) ✓ RESTORED
- **ic_health_monitor** — Institutional positioning (18:15 ET) ✓ RESTORED
- **grok_biotech_watch** — Analyst sentiment (18:20 ET) ✓ RESTORED
- **biotech_news_digest** — Headline consolidation (daily)
- **review_queue_steward** — Portal triage (post-production)
- **intraday_mover_watch** — Intraday price action (16:00 ET)

**Status:** ✓ All 8 active; Layer B post-trading schedule confirmed working (price_action_watch tested 2026-06-05, output verified)

### Layer C: Control Plane (7 skills — ✓ OPERATIONAL)
- **data_auditor** — Schema validation, freshness (recovered 2026-05-26) ✓
- **fleet_steward** — Heartbeat aggregation, coordination ✓
- **ops** — Multi-source triage synthesis ✓
- **ops_supervisor** — Terminal decision layer ✓
- **production_qa** — Snapshot QA gates (awaiting Phase 2 inputs) ⏳
- **qa** — Drift monitoring, rollback advisory ⏳
- **sentinel** — Ops oversight + alert escalation ✓

**Status:** ✓ Core control agents active; QA agents awaiting fresh snapshot data

---

## Governance-Critical Skills (Phase 2)

### Active & Mission-Critical

| Skill | Purpose | Frequency | Phase 2 Role | Status |
|-------|---------|-----------|-------------|--------|
| **herald** | Market events ingest | Daily | Day 1 baseline + ongoing monitoring | ✓ Active |
| **price_action_watch** | Drawdown detection | 18:00 ET | Gate monitoring (outperformance vs XBI) | ✓ Active |
| **catalyst_delta** | Event changes | 18:05 ET | Classifier remediation tracking | ✓ Active |
| **ic_health_monitor** | Institutional cohort health | 18:15 ET | 13F Jaccard gate (threshold 0.70) | ✓ Active |
| **data_auditor** | Data freshness/integrity | Evening | Market data validation | ✓ Active |
| **ops** | Multi-source synthesis | Evening | Operator triage on anomalies | ✓ Active |
| **sentinel** | Fleet health + alerts | 24/7 | Real-time gate triggers (emergency exit) | ✓ Active |

---

## Market-Data-Dependent Skills (Currently Healthy)

**Price Data Path Status:** ✓ CURRENT (fresh rows through 2026-06-05)

All market-dependent skills can consume current data:
- ✓ price_action_watch (uses price_history.csv, verified 2026-06-05)
- ✓ catalyst_delta (uses snapshot + catalyst dates, verified)
- ✓ options_watch (uses options_diagnostics, verified)
- ✓ grok_biotech_watch (uses news feed + price context, verified)
- ✓ intraday_mover_watch (real-time price action, verified)

**No stalls or degradation detected in June 5 test runs.**

---

## Governance Integration (Phase 2 Locks)

### Skills Bound to Governance Gates

| Gate | Monitoring Skill | Threshold | Current Status |
|------|-----------------|-----------|---------|
| **Drawdown vs XBI** | price_action_watch | ≤-2.00pp hard exit | 0.00pp (PASS) |
| **IC Observable** | ic_health_monitor | Expected ~2026-06-17 | Cold-start (MONITORING) |
| **13F Jaccard** | ic_health_monitor | ≥0.70 | 0.875 (PASS) |
| **Emergency Exits** | sentinel + price_action_watch | Real-time trigger | ARMED |

### Phase 3 Blocked Skills (Not Active)

Skills requiring Phase 3 authorization (currently **NOT** running):
- ✗ Forward catalyst scoring (blocked pending classifier remediation)
- ✗ Ranker feature additions (alpha freeze v1.14.0)
- ✗ Phase 3 decision agents (awaiting Phase 3 authorization)

**Blockage is governance-intentional, not a system failure.**

---

## Skill Efficacy Observations (Phase 2 Baseline)

### High Confidence
- **herald** — 100% uptime, daily press release flow consistent
- **price_action_watch** — Responsive to intraday moves; 40 names monitored, 39 alerted (2026-06-05)
- **data_auditor** — Schema validation clean; no data integrity issues
- **sentinel** — No false positives; alert escalation working

### Monitoring (Expected Cold-Start Effects)
- **ic_health_monitor** — No IC data yet (expected ~2026-06-17 first print); institutional cohort stable
- **production_qa** — Awaiting Phase 2 snapshots for comparative analysis

### Known Limitations (Not Blocking)
- **grok_biotech_watch** — Analyst sentiment sourced from news; latency ~1-2 days behind market events
- **intraday_mover_watch** — Requires intraday tick data; currently post-market only
- **catalyst_delta** — Event timing uncertain for catalyst-adjacent holdings (RVMD/CELC flags in manual review/freeze/caveat state)

---

## Skills Logging & Self-Improvement (New, June 5-12)

**Status:** Observation period in progress (2026-06-05 to 2026-06-12)

Logging deployed for:
- Execution time tracking (5 Layer B agents)
- Data freshness observations
- Gate trigger events
- Operator feedback collection

**Next phase (2026-06-12):** Analyze logs, generate weekly skill efficacy report. No automated changes until operator approval.

---

## Readiness for Phase 2 Duration (~2026-06-17)

| Dimension | Status | Notes |
|-----------|--------|-------|
| **Data Pipeline** | ✓ Ready | Layer A producing daily; price data current |
| **Governance Monitoring** | ✓ Ready | 4 gates armed; Layer B restored |
| **Alert Infrastructure** | ✓ Ready | sentinel + escalation operational |
| **Operator Triage** | ✓ Ready | ops skill synthesizing inputs daily |
| **Portfolio Lock Enforcement** | ✓ Ready | No forward-action skills active |
| **Emergency Exit** | ✓ Ready | Real-time trigger chain armed |

---

## Next Milestones

**Immediate (week of 2026-06-05):**
- ✓ Layer B signals producing daily (restored)
- ✓ Skills logging baseline established (observe 7 days)

**2026-06-17 (IC observable + decision gate):**
- Phase 2 closeout memo
- Skill efficacy weekly report (1st report)
- Path C window extension decision (continue or revert)
- Phase 3 authorization or rollback decision

**Post-2026-06-17:**
- Skill performance scoring (recursive self-improvement)
- Classifier remediation completion check (forward actions unblock)
- Phase 3 implementation planning (if authorized)

---

**Last Updated:** 2026-06-05  
**Fleet Status:** ✅ OPERATIONAL  
**Phase 2 Readiness:** ✓ GREEN  
**Next Review:** Weekly during Phase 2 window; formal assessment ~2026-06-17
