# Skill: Operational Health Baselines and SLA Framework

**Status:** DRAFT  
**Last Reviewed:** 2026-05-18  
**Maintainer:** Hermes Operations Layer  
**Scope:** Biotech Screener Production System  

---

## Purpose

Define quantitative health baselines and escalation thresholds for the Hermes-coordinated biotech screener pipeline. This skill enables automated and human-supervised drift detection, operational alerting, and triage prioritization.

Without this layer, Hermes agents cannot distinguish between normal variation and degradation. A skill (or absence thereof) is a policy choice — this codifies that choice.

---

## Core Principle: Health = Freshness + Frequency + Completeness

Three dimensions define operational health for each system:

1. **Freshness**: How current is the data or artifact? (Age threshold, max_staleness)
2. **Frequency**: How often should this system produce output? (Expected cadence, max_missed_runs)
3. **Completeness**: Does the output meet coverage expectations? (Field coverage %, mandatory fields present)

Each system below specifies thresholds for each dimension. Breach of any threshold triggers escalation.

---

## System SLAs

### 1. Production Snapshot Pipeline

**Definition**: Daily snapshot creation at `/data/snapshots/{YYYY-MM-DD}/` with rankings, decision portfolio, and diagnostics.

| Metric | Expected | Warning | Critical | Escalation |
|--------|----------|---------|----------|-----------|
| **Freshness** | Created by 11:30 ET | Not created by 12:00 ET | Not created by 15:00 ET | Page ops_supervisor; block merges |
| **Frequency** | Every trading day (Mon–Fri) | 1 missed day in rolling 5d | 2+ consecutive missed days | Page ops_supervisor + fleet_steward |
| **Completeness** | 100% of core files | <98% core files | <90% core files | Rerun production immediately |

**Core files** (mandatory):
- `rankings.csv` (≥1 row, <1000 rows max)
- `decision_portfolio.csv`
- `diagnostics/{module}*.json` (all 5 modules)
- `screen_output.json` (size >1MB for full universe)

**Root cause checklist** (for <90% completeness):
- [ ] Universe load error (check Module 1 total_input count; should be ≥320)
- [ ] PIT filter error (unusual delist count; baseline 8–15 tickers)
- [ ] Gate evaluation stall (check Module 5 gate timings)
- [ ] Postmortem write failure (Herald digest missing event records)

---

### 2. Herald Digest (News + Event Daily Summary)

**Definition**: Automated daily email summarizing market events, clinical results, and insider activity for the holdings universe.

| Metric | Expected | Warning | Critical | Escalation |
|--------|----------|---------|----------|-----------|
| **Freshness** | Sent by 18:30 ET | Not sent by 19:00 ET | Not sent by 20:00 ET | Operator manual send |
| **Frequency** | Daily (Mon–Fri) | 1 missed day in rolling 5d | 3+ consecutive dark days | Escalate to ops_supervisor |
| **Completeness** | ≥5 distinct event types per digest | <3 event types | 0 events (empty digest) | Rerun herald builder |

**Event types** (should appear ≥once/week on rolling basis):
- Clinical (AACT trials, FDA approvals, trial results)
- Insider Form 4 (net buys, seasoned offerings)
- Price action (>10% moves, breakouts)
- Earnings/guidance
- M&A / financing events

**Baseline**: Herald has been DARK >5 consecutive weeks (as of May 18 diagnostic). This is **CRITICAL**. Root causes:
- [ ] AACT trial ingest stalled (check ctgov_poller last run)
- [ ] Herald builder script crash (check logs/herald.log for errors)
- [ ] Email delivery failure (SMTP auth expired)
- [ ] No triggering events in universe (unlikely; check Alpaca / Form 4 feeds)

**Recovery SLA**: 24 hours from escalation.

---

### 3. Bellringer (Results Email Weekly Summary)

**Definition**: Weekly email (Friday) summarizing prior week's price moves, wins, and losses on ranked holdings.

| Metric | Expected | Warning | Critical | Escalation |
|--------|----------|---------|----------|-----------|
| **Freshness** | Sent by 16:00 ET Friday | Not sent by 17:00 ET Fri | Not sent by 18:00 ET Fri | Operator manual send + escalate |
| **Frequency** | 1x per week (Friday) | 1 missed week in 4d | 2+ missed weeks | Page ops_supervisor |
| **Completeness** | 1 summary + 1 results table | Summary only, no table | 0 tables or empty content | Rerun builder |

**Baseline**: Sent 7 emails, only 1 results email in week of May 12–18. **This is degraded.** Expected ratio: ≥3 results emails per week (or ≥40% of all bellringer sends should include price/returns tables).

**Root causes**:
- [ ] Results builder crash (script killed mid-run)
- [ ] Holdings universe changed; prior week rankings stale
- [ ] Return data missing from market feeds

---

### 4. PDUFA / Catalyst Alert Engine

**Definition**: Intraday alerts (when active) on FDA decision dates and catalyst timings for ranked holdings.

| Metric | Expected | Warning | Critical | Escalation |
|--------|----------|---------|----------|-----------|
| **Freshness** | Alert sent within 30 min of event | >1 hour late | >2 hours late or missed | Escalate to ops; manual notification |
| **Frequency** | 1+ alert per trading day (when PDUFA active) | <1 alert per day during PDUFA window | 3+ trading days with zero alerts during window | Check AACT feed; escalate |
| **Completeness** | Alert includes ticker + event + action | Event only, no ticker | Blank or malformed alert | Rerun alert builder |

**Baseline**: PDUFA / Catalyst alerts were **DARK all week** (May 12–18). Expected frequency during May: ≥3–5 alerts (multiple PDUFA decisions expected mid-May). Baseline: **CRITICAL**.

**Root causes**:
- [ ] AACT ingest stalled (no new trial records since May 15)
- [ ] Alert cron disabled or failed (check crontab + cron.log)
- [ ] No eligible holdings with active PDUFA dates
- [ ] Catalyst event detection logic broken (check Spec 073)

---

### 5. Hermes Agent Fleet (18-agent coordinated system)

**Definition**: OpenClaw-managed fleet of specialized agents (ops, herald, sentinel, qa, intraday_mover, etc.) running on scheduled cadences.

| Metric | Expected | Warning | Critical | Escalation |
|--------|----------|---------|----------|-----------|
| **Freshness** | All agents running heartbeat ≤24h old | Any agent >24h stale | >3 agents >48h stale | fleet_steward + ops_supervisor |
| **Frequency** | ≥90% of scheduled runs execute | 85–90% execution rate | <85% execution rate | Escalate; investigate cron/gateway |
| **Completeness** | 0 FAIL agents; ≤2 WARN | 1–2 FAIL; 3–4 WARN | ≥3 FAIL agents | Page ops_supervisor immediately |

**Agent health tiers**:

- **FAIL**: Last activity >72h ago; or 2+ consecutive failed runs; or missing transcript/memory
  - Examples (May 18): (none currently)
  - Action: Investigate logs; restart if stalled; escalate if restart fails

- **WARN**: Last activity 24–72h ago; or 1 failed run in rolling 5; or stale artifact (>7d)
  - Examples (May 18): 6 agents STALE (data_auditor, sentinel, policy_shadow_watch, postmortem, ops_supervisor, grok_biotech_watch) due to May 15 WSL shutdown
  - Action: Confirm self-recovery via next scheduled run; escalate if not recovered within 24h

- **OK**: Last activity ≤24h; 0 consecutive failures; artifacts fresh (<7d)
  - Examples (May 18): ops, herald, ctgov_poller, earnings_calendar_sync, calibration, catalyst_delta, intraday_mover_watch, options_watch, qa, review_queue_steward, universe_maintenance, biotech_news_digest, company_news_ingest, aact_trial_ingest, price_action_watch, ic_health_monitor, crt_resolution_watcher, fleet_steward, shadow_monitor, data_auditor (last run 0.0d but pre-shutdown)

**SLA for recovery**: WARN → OK within 24h (next scheduled run); FAIL → escalated within 4h.

---

### 6. CI Pipeline (GitHub Actions)

**Definition**: Automated test suite on every commit (unit tests, type checks, integration tests).

| Metric | Expected | Warning | Critical | Escalation |
|--------|----------|---------|----------|-----------|
| **Freshness** | Latest commit tested ≤1h old | >1h; no test result | >4h; no test result | Block all merges; escalate |
| **Frequency** | 100% of commits have test result | <95% coverage | <90% coverage | Investigate CI config |
| **Completeness** | All test suites run (unit + integration) | 1 suite skipped | >1 suite missing | Page ops_supervisor |

**Baseline**: CI red since ~May 8 (10 days). Expected max red window: **5 days**. Exceeding 5 days = **CRITICAL**. At 10 days, this blocks promotion, ranker research, and Spec 089 implementation.

**Root causes** (May 8 red):
- [ ] Pre-existing test failure (Spec 100 scope gap in tool measurement)
- [ ] Infrastructure failure (GitHub Actions quota, runner timeout)
- [ ] New test added that's flaky or overly strict

**Recovery SLA**: 24h from escalation.

---

### 7. Data Auditor (PIT Refresh, Market Data Staleness Check)

**Definition**: Daily evening audit (18:00 ET) verifying that PIT cache, market data, and snapshot metadata are fresh and aligned.

| Metric | Expected | Warning | Critical | Escalation |
|--------|----------|---------|----------|-----------|
| **Freshness** | Audit runs by 19:00 ET | Not run by 19:30 ET | Not run by 20:00 ET | Operator manual audit |
| **Frequency** | Daily (Mon–Fri, evening) | 1 missed day in rolling 5d | 2+ consecutive missed | Page ops_supervisor |
| **Completeness** | Audit report ≥50 lines of findings | <30 lines; sparse | 0 lines or no file | Rerun immediately |

**Audit scope** (mandatory checks):
- [ ] PIT cache age ≤3 days old
- [ ] Market data (price, volume) ≤1 day old
- [ ] AACT trial record count ≤3 days drift (should be stable ±5 tickers)
- [ ] Snapshot manifest alignment (ranking count = decision portfolio count)

**Baseline**: Last successful audit May 15 (3 days ago). WSL shutdown May 15–17 morning missed May 15 18:00 ET cron. **WARN until May 18 18:00 ET run completes.**

---

### 8. Postmortem Analyzer (T+1, T+3, T+5 Event Outcome Tracking)

**Definition**: Automated daily script that binds clinical/FDA/price outcomes to prior catalyst alerts and scores accuracy.

| Metric | Expected | Warning | Critical | Escalation |
|--------|----------|---------|----------|-----------|
| **Freshness** | Latest postmortem event ≤24h old | >48h stale | >72h stale; script failed | Restart script; escalate |
| **Frequency** | ≥1 postmortem per trading day | <5 in rolling week | 0 in rolling week | Escalate to ops_supervisor |
| **Completeness** | All T+1/T+3/T+5 fields populated | >10% fields null | >25% fields null | Check event ingest; rerun |

**Baseline**: T+3 pending for all May 13–15 events; will self-resolve by May 20 (T+5 window closure). **STALE but expected;** no escalation needed if cadence resumes by May 20.

---

## Escalation Matrix

### Severity Levels

| Level | Definition | Typical Trigger | Action | Owner |
|-------|-----------|-----------------|--------|-------|
| **Green** | All systems HEALTHY | All thresholds met; <1 WARN | Monitor; document changes | Routine automated monitoring |
| **Yellow** | 1–2 systems WARN or 1 system >24h late | 1–2 systems past warning threshold | Investigate root cause; alert ops_supervisor | ops_supervisor (manual review) |
| **Orange** | 3+ systems WARN or 1 system CRITICAL or >2 stale agents | Multiple systems degraded; coordination required | Page ops_supervisor + fleet_steward; convene incident call | ops_supervisor + fleet_steward |
| **Red** | >50% of systems FAIL or production snapshot missing | Major infrastructure failure; operators unable to act | Page ops_supervisor + on-call; activate war room | ops_supervisor (incident commander) |

### Current State (May 18, 12:30 ET)

**Overall: YELLOW** (trending to ORANGE if Herald remains DARK >24h more)

| System | Status | Days Stale | Action |
|--------|--------|------------|--------|
| Production Snapshot | OK | 0 | None |
| Herald Digest | **CRITICAL** | 35+ | Escalate to ops_supervisor immediately; investigate AACT ingest |
| Bellringer | WARN | 5 | Monitor; next summary Fri should recover |
| PDUFA/Catalyst Alerts | **CRITICAL** | 6 | Escalate; check AACT feed + alert cron |
| Agent Fleet | WARN | 3 (6 agents stale from WSL outage) | Monitor recovery on May 18 evening cron runs |
| CI Pipeline | **CRITICAL** | 10 | Unblock; blocks all promotion and research |
| Data Auditor | WARN | 3 (WSL outage) | Next run May 18 18:00 ET should clear |
| Postmortem | STALE (expected) | Self-resolve May 20 | Monitor; no action needed |

---

## Operational Playbooks

### Herald Digest Recovery (CRITICAL)

1. Check ctgov_poller last run: `ls -ltr logs/ctgov_poller.log | tail -1`
   - If >24h old: Restart `cron_ctgov_poller.sh` manually
2. Check herald builder: `tail -50 logs/herald.log`
   - If error: Rerun `python -m tools.build_herald_digest --date $(date +%Y-%m-%d) --send-email`
3. Check SMTP config in `.env` (SMTP_HOST, SMTP_USER, SMTP_PASS)
   - If expired: Update via ops_supervisor credentials
4. If all above pass, escalate to ops_supervisor (may require external feed restart)

**SLA**: 2 hours from discovery to resolution or escalation.

---

### Agent Fleet Recovery (WARN → OK)

For each STALE agent:

1. Check last run time: `openclaw agents list --json | jq '.[] | select(.id=="<agent_id>") | .lastRun'`
2. If >24h: Check for lock file: `ls -la ~/.openclaw/agents/<agent_id>/.lock`
   - If exists and stale (>2h): `rm ~/.openclaw/agents/<agent_id>/.lock`
3. Manually trigger next cron: `crontab -l | grep <agent_id> | bash -x`
4. Monitor for success via fleet_steward or `openclaw agents status`

**SLA**: 4 hours from escalation to confirmed recovery; if still stale, escalate to Hermes engineering.

---

### CI Pipeline Unblock

1. Identify failing test: `git log --oneline -1` (latest commit)
   - `gh pr checks <PR#> --json` to see which tests fail
2. If pre-existing failure: Confirm via `git checkout origin/main && npm test` (should also fail)
   - If yes: Known issue; safe to merge with approval
   - If no: Regression in PR; request author fix
3. If infrastructure failure: Check GitHub Actions quota/runners
4. If flaky test: Run locally 3x to confirm behavior

**SLA**: 24 hours from escalation to unblock decision (with or without approval override).

---

## Refresh Cadence

| Review Scope | Frequency | Owner | Notes |
|--------------|-----------|-------|-------|
| **Daily operational check** | Every 08:00 ET (pre-market) | fleet_steward (automated) | Scan all system health; alert on any CRITICAL |
| **Weekly operational review** | Every Monday 09:00 ET | ops_supervisor (manual) | Trend analysis; escalation retrospective |
| **Monthly SLA audit** | 1st of month, 10:00 ET | ops_supervisor + fleet_steward | Confirm all thresholds still valid; adjust if needed |
| **Quarterly baseline reset** | Every 3 months (1 Jan, 1 Apr, 1 Jul, 1 Oct) | ops_supervisor + Hermes maintainer | Recalibrate thresholds based on operational reality |

---

## Known Issues and Baseline Deviations

| Issue | Detected | Root Cause | Status | Owner |
|-------|----------|-----------|--------|-------|
| Herald DARK 35+ days | May 18 diagnostic | AACT ingest stalled; cause unclear | **CRITICAL; ESCALATED** | ops_supervisor |
| PDUFA/Catalyst alerts DARK 6 days | May 18 diagnostic | No eligible holdings with active PDUFA, OR alert cron disabled | **CRITICAL; ESCALATED** | ops_supervisor |
| Bellringer 1 results email in week | May 18 diagnostic | Results builder may be crashing; or holdings universe too volatile | WARN | fleet_steward |
| CI red 10 days | May 18 baseline | Pre-existing test failure from Spec 100 scope gap (tool measured composite_score not final_score) | **CRITICAL; BLOCKS PROMOTION** | ops_supervisor + Hermes engineering |
| Agent fleet 6 stale (data_auditor, sentinel, policy_shadow_watch, ops_supervisor, postmortem, grok_biotech_watch) | May 18 diagnostic | WSL shutdown May 15 evening; missed May 15 18:00–20:30 ET crons | WARN; expected recovery May 18 18:00 ET+ | fleet_steward (monitoring) |
| Postmortem T+3 pending (May 13–15 events) | May 18 | Design: T+3 window closes May 18 evening; events will populate T+5 May 20 | Expected; self-resolving | None needed |

---

## Maintenance Notes

- **Last reviewed**: 2026-05-18
- **Last substantive change**: 2026-05-18 (initial draft)
- **Known open issues**: 4 (Herald DARK, PDUFA DARK, CI red, Bellringer low results rate)
- **Next review date**: 2026-05-22 (to confirm Herald, PDUFA, CI recovery; and baseline stale agent recovery)
- **Downstream dependencies**: ops_supervisor, fleet_steward, data_auditor, postmortem, herald builder, AACT ingest, PDUFA/catalyst alert engine

---

## Cross-References

- **Spec 063** (Intraday Mover Watch): Defines expected alert cadence for intraday price moves; uses this baseline for escalation
- **Spec 089** (Ranker Governance KG): Blocked pending CI unblock and 13F cohort clearance (~May 26)
- **Fleet Health Report** (Memory, May 18): Real-time status of 18-agent fleet; references this SLA document for thresholds
- **Operational Closure** (Memory, May 15): Documents snapshot QA, specs closed, blockers; foundation for escalation matrix
- **Town-Hermes Bridge** (Spec 090): One-way notification channel (Hermes → email → Town); could be extended to feedback loop (Town findings → Hermes agents)

---

## Suggested Next Steps

1. **Immediate (May 18–19)**: Escalate Herald DARK and PDUFA alerts to ops_supervisor; trigger AACT ingest restart
2. **Short-term (May 19–22)**: Unblock CI pipeline; confirm agent fleet recovery by May 18 18:00 ET cron runs
3. **Medium-term (May 22–26)**: Recalibrate Bellringer completeness threshold if results rate remains low; confirm all baseline CRITICAL items resolved
4. **Integration (post-May 26)**: Bind this SLA skill to fleet_steward agent prompts so automated monitoring consults these thresholds for escalation decisions

