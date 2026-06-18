# Skill: Failure Pattern Library and Error Recognition

**Status:** DRAFT  
**Last Reviewed:** 2026-05-18  
**Maintainer:** Hermes Operations Layer  
**Scope:** Biotech Screener Production System  

---

## Purpose

Create a structured, queryable catalog of recurring failure modes so Hermes agents can:

1. **Recognize patterns** — When a failure occurs, match it against known patterns to identify root cause faster
2. **Detect systemic issues** — Track recurrence; after 3+ occurrences, flag as systemic and escalate to governance
3. **Learn and prevent** — Archive resolution steps and prevention rules so the same failure doesn't recur
4. **Prioritize triage** — Surface high-frequency failures first for investigation and fix

The self-improving skill (Rule 1) says "log corrections and promote patterns after 3x" — this document is the ledger where Hermes records that history.

---

## Failure Taxonomy

All failures are classified by **root cause category**:

| Category | Definition | Examples | Escalation Owner |
|----------|-----------|----------|------------------|
| **Data Staleness** | Input data (prices, trial records, manager holdings) is out-of-date beyond acceptable window | ipo_dates.json last_price_date frozen at 2026-04-02; AACT trial record count static >5 days; 13F filings delayed | Data Auditor + ctgov_poller owner |
| **Cache Miss / Invalidation** | Cached data not refreshed or invalidation logic broken; pipeline uses stale computed state | PIT cache >3 days old; trial_records_{date}.json not deleted on refresh; ranking cache from wrong snapshot | PIT Cache owner + data_auditor |
| **Logic Error** | Code path produces wrong result despite fresh data | Module 4 denominator 120 vs 117 (Town AI H1); composite_score IC measured instead of final_score; PIT survivorship filter logic inverted | Module owner + test suite |
| **Document Sync Gap** | Documentation and production diverge; skill says X but code does Y | B6 described as "65% sponsor + 35% momentum" but code is 100% coinvest_score_z; inst_delta_z marked "excluded from ranker" but excluded from selector | Document maintainer + governance |
| **Naming Collision / Ambiguity** | Same term means different things in different docs; or different terms mean the same thing | "selector" vs "gating"; "tier 1 / tier 2 / tier 3" defined three different ways across governance docs; "clinical_optionality_pct" vs "clinical_score_v2" | Governance layer + documentation |
| **Infrastructure Failure** | Cron, job scheduler, network, file system, or service outage | WSL shutdown May 15–17; cron job timeout; SMTP auth expired; GitHub Actions quota exhausted | ops_supervisor + infrastructure owner |
| **Governance Lapse** | Policy not enforced or enforcement bypassed; or decision rationale missing | inst_delta_z kept despite IC=-0.097 (later justified as cohort artifact) — but decision was ad-hoc, not pre-declared | Governance layer |
| **Specification Drift** | Feature spec written but not implemented, or implementation drifted from spec | Spec 089 KG design locked but implementation deferred; Spec 072 vNext designed but never built | Spec owner + ops_supervisor |

---

## Failure Ledger

Each row documents one failure type. Metadata:

- **failure_id**: Unique identifier (e.g., `F-001-data-staleness-ipo-dates`)
- **category**: Root cause taxonomy from above
- **first_seen**: ISO date of first detection
- **recurrence_count**: How many times has this pattern appeared?
- **severity**: CRITICAL / HIGH / MEDIUM / LOW (based on operational impact)
- **detection_method**: How was this failure identified? (automated test, manual audit, operational alert)
- **root_cause**: Specific reason why it happened
- **resolution**: What was done to fix it?
- **prevention_rule**: How to prevent recurrence
- **notes**: Contextual details (e.g., systemic or one-off; blocked on external dependencies)

---

### Active Failures (Recurring; Requires Action)

#### F-001: Data Staleness — ipo_dates.json

| Field | Value |
|-------|-------|
| **failure_id** | F-001-data-staleness-ipo-dates |
| **category** | Data Staleness |
| **first_seen** | 2026-05-18 |
| **recurrence_count** | 1 (but symptomatic of broader data refresh gaps) |
| **severity** | **CRITICAL** |
| **detection_method** | Manual investigation of May 18 production universe loading bug; all 356 tickers had `last_price_date: 2026-04-02` |
| **root_cause** | ipo_dates.json not refreshed since April 2; PIT survivorship filter with 45-day delist buffer marked all tickers as delisted for as_of_date=2026-05-18 (delist cutoff = 2026-04-03) |
| **impact** | Module 1 received only 1 ticker (_XBI_BENCHMARK_) instead of full 338-ticker universe; rankings effectively single-stock |
| **resolution** | Updated all 356 tickers' `last_price_date` to 2026-05-17; production re-run confirmed 338-ticker universe loaded correctly |
| **commit** | 4e2fc6c8 "Fix universe loading bug: Update stale ipo_dates.json with current pricing data" |
| **prevention_rule** | **Rule F-001**: ipo_dates.json MUST be refreshed daily as part of `cron_data_extras.sh` (currently scheduled 13:30 ET). If refresh missing, data_auditor must flag by 15:00 ET; escalate to ops_supervisor by 16:00 ET. SLA: 2h from escalation to refresh completion. |
| **notes** | Systemic issue: Several data sources (market prices, AACT trial records, 13F filings) share same staleness risk. Data Auditor SLA from Operational Health Baselines should catch these; current implementation is manual check only. Recommend automated age validation in cron scripts. |

---

#### F-002: Logic Error — Module 4 Clinical Score Denominator

| Field | Value |
|-------|-------|
| **failure_id** | F-002-logic-error-module4-denominator |
| **category** | Logic Error |
| **first_seen** | 2026-04-24 (Town AI H1 audit) |
| **recurrence_count** | 1 (caught and fixed) |
| **severity** | HIGH |
| **detection_method** | Town AI H1 code review; execution_score max 22 causes total max 117 not 120; max ceiling 97.5 should be 100.0 |
| **root_cause** | Module 4 clinical_score aggregation logic used denominator 120 (original design) but execution_score capped at 22, so true max = 117. Ceiling normalization used 97.5 instead of 100.0. |
| **impact** | Clinical scores slightly compressed (max 97.5 vs 100.0); ranker IC unchanged but unfairly penalized clinical block attribution |
| **resolution** | Corrected denominator 120→117; corrected ceiling 97.5→100.0; verified all tests pass (27/27) |
| **commit** | 3ad7b904 "Fix Module 4 clinical_score normalization ceiling" |
| **prevention_rule** | **Rule F-002**: All module aggregations MUST document min/max bounds with examples. Code review checklist includes: "Verify ceiling = (execution_score_max + other_components_max)". Test suite MUST include edge-case bounds test (all components at max = 100.0 final score). |
| **notes** | Single-digit bug caught by external code review; did not propagate to production ranking (clinical_score in shadow only). Indicates need for more rigorous bounds validation in test suite. |

---

#### F-003: Document Sync Gap — B6 Weights (C1)

| Field | Value |
|-------|-------|
| **failure_id** | F-003-doc-sync-b6-weights |
| **category** | Document Sync Gap |
| **first_seen** | 2026-05-01 (doc review audit, C1) |
| **recurrence_count** | 1 (persisting; not yet fixed) |
| **severity** | MEDIUM |
| **detection_method** | Manual doc review: .docx files (executive overview, May 2026 quarterly summary) describe B6 as "65% sponsorship (coinvest) + 35% momentum (inst_delta)"; production code is 100% coinvest_score_z since May 4 demotion of inst_delta_z |
| **root_cause** | May 4 policy decision to demote inst_delta_z (IC -0.097; cohort artifact) was not propagated to documentation; .docx files not refreshed post-May-4 |
| **impact** | External stakeholders, decision-makers, and cross-functional teams reading .docx receive outdated feature weights; decision rationale (cohort distortion) not documented |
| **resolution** | Not yet fixed. Requires: (a) updated .docx with current weights and rationale, (b) document sync process defined (cron refresh or manual gate). |
| **prevention_rule** | **Rule F-003**: Establish document authority hierarchy: GitHub repo (code + specs) is authoritative; .docx files are derived downstream. On every production ranker code change: (1) Update specs/changes/spec_*.md, (2) Tag commit with [DOCS-SYNC-REQUIRED], (3) Schedule .docx refresh within 24h. Enforce via PR checklist. |
| **notes** | Part of broader document lineage gap (Skill #2 gap). Solution requires Document Lineage Map skill to be drafted and implemented. Interim: manual doc refresh on next quarterly cycle (June 2026). |

---

#### F-004: Specification Drift — Spec 089 KG (Implementation Deferred)

| Field | Value |
|-------|-------|
| **failure_id** | F-004-spec-drift-089-kg-deferred |
| **category** | Specification Drift |
| **first_seen** | 2026-05-15 (operational closure decision) |
| **recurrence_count** | 1 (ongoing; spec waiting on prerequisite gate) |
| **severity** | HIGH |
| **detection_method** | Memory note from Operational Closure (2026-05-15): Spec 089 Phase 1.5A design locked, implementation deferred pending 13F cohort clearance (Jaccard ≥0.70, distortion cleared); estimated ~2026-05-23+. Currently blocking Phase 2 KG research and ranker governance validation. |
| **root_cause** | Spec 089 is blocked on external gate (13F cohort refresh) which itself blocked on time-dependent event (managers filing 13F amendments, estimated ~2026-05-23). Design was finalized but implementation cannot proceed without cohort clarity. |
| **impact** | Ranker governance KG (11 node types, 15 edge types, 5 contradiction rules) not yet built; Spec 090 (Town-Hermes bridge) and downstream specs (091–099) all downstream of this. IC evidence hold remains in place; no ranker promotion eligible until Spec 089 complete. |
| **resolution** | Waiting on 13F refresh gate; will resume ~2026-05-23 when ≥34 of 48 managers file. Runbook at `docs/13f_q1_2026_refresh_runbook.md`. |
| **prevention_rule** | **Rule F-004**: Gate blocking specs MUST have: (a) clear pass/fail criteria, (b) estimated resolution date, (c) owner who monitors gate status, (d) fallback plan if gate slips. For Spec 089: Owner = ops_supervisor; criteria = 13F Jaccard ≥0.70 + inst_delta_z distortion cleared; fallback = build KG on subset universe if full refresh delayed >7d. |
| **notes** | Not a production failure, but a planning/prioritization failure. Indicates need for Skill #7 (Skill Maturity Metadata) to track spec dependencies and gate health. Current state captured in memory, not in skill layer accessible to agents. |

---

#### F-005: Naming Collision / Ambiguity — Tier Numbering Systems (W4)

| Field | Value |
|-------|-------|
| **failure_id** | F-005-naming-collision-tier-systems |
| **category** | Naming Collision / Ambiguity |
| **first_seen** | 2026-05-07 (governance audit, W4) |
| **recurrence_count** | 1 (persisting; three distinct tier systems in governance docs without cross-references) |
| **severity** | MEDIUM |
| **detection_method** | Doc review audit: governance docs reference "Tier 1 / Tier 2 / Tier 3" in three distinct ways: (1) institutional investor tiers (by AUM), (2) signal quality tiers (by IC / statistical rigor), (3) operational risk tiers (by degradation/criticality). No cross-reference; readers confused about which "tier" is meant. |
| **root_cause** | Governance docs written over time by different authors; no naming convention enforced; taxonomy grew organically without consolidation. |
| **impact** | Cross-functional communication ambiguous; governance layer agents cannot reliably interpret references to "Tier N"; decision-making inefficient. |
| **resolution** | Not yet fixed. Requires: (a) unified naming scheme (e.g., "InvestorTier", "SignalTier", "OperationalRiskTier" or "T-INVESTOR-N", "T-SIGNAL-N", "T-RISK-N"), (b) glossary document, (c) audit of all existing docs to rename and cross-reference. |
| **prevention_rule** | **Rule F-005**: Maintain a "Governance Glossary" document with machine-readable definitions (JSON or YAML). On every governance spec change: (1) Validate all new taxonomy against glossary, (2) If new term introduced, add to glossary with definition, examples, and synonyms to avoid, (3) Lint scripts enforce no undefined terms. Glossary lives in `docs/governance-glossary.md` (to be created). |
| **notes** | Systemic cross-document issue; requires Document Lineage Map skill (#2) for full resolution. Interim workaround: Manual glossary created and distributed with next governance memo. |

---

#### F-006: Infrastructure Failure — WSL Shutdown May 15–17

| Field | Value |
|-------|-------|
| **failure_id** | F-006-infra-wsl-shutdown-may15 |
| **category** | Infrastructure Failure |
| **first_seen** | 2026-05-15 17:30 ET (watchdog log gap; discovered 2026-05-18 morning) |
| **recurrence_count** | 1 (infrastructure event; rare but happened) |
| **severity** | **CRITICAL** |
| **detection_method** | Watchdog log shows gap May 15 17:30 ET → May 18 09:12 ET (65+ hours); 6 agents stale (data_auditor, sentinel, policy_shadow_watch, postmortem, ops_supervisor, grok_biotech_watch); all missed evening crons (18:00–20:30 ET on May 15). |
| **root_cause** | WSL2 machine shutdown (power loss, system restart, or user intervention) May 15 evening; systemd services did not auto-restart on boot May 18 morning (or boot delayed >65h). Cron jobs cannot run if system down. |
| **impact** | Data Auditor missed May 15 18:00 ET audit; Sentinel missed May 15 17:15 ET health check; Postmortem missed T+3 window for May 13–15 events (will resolve T+5 by May 20). Production snapshot completed May 18 09:47 UTC (normal). No data loss; recovery automatic on system restart. |
| **resolution** | System recovered May 18 morning; agents resumed normal cron cadence. Watchdog detected gap and caught up; no manual intervention needed. |
| **prevention_rule** | **Rule F-006**: (a) Systemd unit files MUST include `Restart=always` and `RestartSec=30` so services auto-restart on crash/reboot. (b) Watchdog MUST email ops_supervisor if gap >24h. (c) On-call responder monitors system uptime via heartbeat; if gap detected >2h during business hours, escalate. (d) WSL2 session should have auto-reconnect; consider moving cron to native Linux VM or cloud scheduler (CloudWatch, GitHub Actions, etc.) for higher availability. |
| **notes** | Single-point failure of local WSL2 machine. Production snapshot pipeline continued (runs via `run_daily_production.py` which has independent watchdog), but evening audit and health-check agents were affected. Suggests need for agent redundancy or cloud-based scheduler fallback. |

---

#### F-007: Governance Lapse — inst_delta_z Demotion (Ad-Hoc Decision)

| Field | Value |
|-------|-------|
| **failure_id** | F-007-governance-lapse-inst-delta-demotion |
| **category** | Governance Lapse |
| **first_seen** | 2026-05-04 (decision made; lapse noticed 2026-05-13 in governance audit) |
| **recurrence_count** | 1 (documented; rationale added retroactively 2026-05-06) |
| **severity** | MEDIUM |
| **detection_method** | Governance audit noted: inst_delta_z IC -0.097 dropped from ranker without pre-declared criteria; decision appeared ad-hoc. Memory files later documented as "cohort artifact" (2026-04-25 manager additions caused byte-identical inst_delta_z signal). |
| **root_cause** | Decision made in response to observed degradation (IC -0.097) but without pre-announced policy or alternatives considered. Rationale (cohort artifact) was understood by ops_supervisor but not formalized in Spec or governance layer before demotion. |
| **impact** | Signal removed but governance trail incomplete; future reviewers cannot understand why or what alternatives were considered; demotion appears arbitrary rather than principled. Creates doubt about future decisions. |
| **resolution** | Retroactively documented in governance memory (`policy_demotion_path_2026_05_06.md`) with rationale and learned rule: "signal removals under confirmed degradation are NOT Checklist v2 promotions; require 5-element governed path: two-frame evidence + comparator probe + Spec-style writeup + operator sign-off + receipt/changelog." |
| **prevention_rule** | **Rule F-007**: Establish Decision Audit Trail skill (#4 from gap analysis): Before removing/demoting any signal or parameter change: (1) Document current state (IC, selector Δ, recency), (2) State alternatives considered, (3) Cite evidence (e.g., two-frame backtest, forward shadow, A/B test), (4) Predict impact if reverted, (5) Set review date. Decision memo MUST be filed in `docs/decisions/{YYYY-MM-DD}-{description}.md` BEFORE implementation. |
| **notes** | This was handled well retroactively; rationale is documented. But the process should be proactive next time. Suggests need for governance checklist skill that prompts for decision memo before making ranker changes. |

---

#### F-008: Cache Invalidation — PIT Survivorship Filter Logic

| Field | Value |
|-------|-------|
| **failure_id** | F-008-cache-invalidation-pit-survivorship |
| **category** | Cache Miss / Invalidation |
| **first_seen** | 2026-05-18 (root cause analysis of F-001) |
| **recurrence_count** | 1 (related to F-001; systemic data staleness issue) |
| **severity** | HIGH |
| **detection_method** | Debug trace analysis showed PIT filter logic correct, but input (ipo_dates.json) stale; filter correctly marked 337/338 tickers as "delisted" based on stale pricing data. |
| **root_cause** | Not a logic bug (as initially suspected), but data staleness cascading through correct logic. PIT cache idempotency already documented (`biotech_pit_cache_idempotent.md` memory), but source data refresh not enforced. |
| **impact** | Universe loading bug (F-001) was consequence of cascade: stale ipo_dates.json → PIT filter marks all as delisted → Module 1 receives 1 ticker. |
| **resolution** | Fixed via F-001 (refresh ipo_dates.json). But underlying issue is data refresh orchestration. |
| **prevention_rule** | **Rule F-008**: Data sources MUST have explicit refresh cadence in cron script documentation. ipo_dates.json MUST refresh daily in `cron_data_extras.sh` (currently 13:30 ET; verify execution SLA). PIT cache MUST be cleared/invalidated on data refresh (currently requires manual delete of `cache/ctgov/trial_records_{date}.json`; should be automated). Data Auditor MUST validate data freshness (max staleness tolerance) — integrate F-001 prevention rule. |
| **notes** | Related to data staleness failure (F-001) but distinct root cause. Indicates need for data orchestration audit: which sources are refreshed when, and what happens if refresh fails? Recommend creating `cron_data_refresh_orchestration.md` spec. |

---

### Resolved Failures (Fixed; Learning Archived)

#### F-009: Logic Error — Spec 100 IC Measurement Scope Gap

| Field | Value |
|-------|-------|
| **failure_id** | F-009-logic-error-spec100-ic-scope |
| **category** | Logic Error |
| **first_seen** | 2026-05-13 (governance audit finding) |
| **recurrence_count** | 1 (fixed; pervious IC claims invalidated) |
| **severity** | **CRITICAL** |
| **detection_method** | Spec 095 audit found IC backtest measured composite_score, not ranker final_score. Spec 100 fixed tooling to use final_score. Prior IC evidence invalidated. |
| **root_cause** | IC tool bug: measured signal IC on composite_score (internal intermediate) instead of final_score (ranker output). All pre-Spec-100 IC claims invalid for promotion decisions. |
| **impact** | IC evidence hold placed; ranker promotion blocked until Spec 100 tool fix deployed and re-baselined. |
| **resolution** | Spec 100 implemented; corrected final_score baseline established; metadata label spec_100_status added; commit 2faa88e6. |
| **commit** | 2faa88e6 "Spec 100: IC tooling correction — default signal → final_score" |
| **prevention_rule** | **Rule F-009**: IC tool MUST explicitly document which score it measures (composite_score vs final_score vs ranker_output). Code review checklist: "Verify IC tool measures ranker final output, not intermediate scores." Test suite includes validation that IC measurement matches documented signal. Annual audit of IC tool scope against current ranker architecture. |
| **notes** | Caught and fixed; valid learning. Shows importance of governance audit layer checking tool behavior vs spec claims. |

---

#### F-010: Governance Lapse — CLI Color Output in Prod Tests

| Field | Value |
|-------|-------|
| **failure_id** | F-010-logic-error-cli-color-output |
| **category** | Logic Error (minor) |
| **first_seen** | 2026-04-30 (test failure during pre-commit) |
| **recurrence_count** | 1 (caught by linter; fixed immediately) |
| **severity** | LOW |
| **detection_method** | Pre-commit hook caught CLI color ANSI codes in test output; test assertion failed because actual output included `\x1b[32m` (green) and other escape sequences. |
| **root_cause** | CLI output module auto-detected TTY and added color codes; test did not strip color. Assertion compared colored output to plain expected output. |
| **impact** | Test failed; PR couldn't merge until fixed; no production impact (color codes don't affect functionality, only display). |
| **resolution** | Fixed by stripping ANSI codes in test assertion or disabling color output in test environment (`NO_COLOR=1`). Commit `e70ae626`. |
| **prevention_rule** | **Rule F-010**: CLI tools MUST have `--no-color` flag or respect `NO_COLOR` env var. Tests MUST strip ANSI codes from actual output before comparing to expected. Pre-commit hook runs with `NO_COLOR=1` automatically. |
| **notes** | Low severity; caught by test suite working as designed. Learning: environment-aware output requires environment-aware testing. |

---

### Unresolved Failures (Under Investigation)

#### F-011: Data Staleness — Herald Digest Silence (35+ Days)

| Field | Value |
|-------|-------|
| **failure_id** | F-011-data-staleness-herald-dark |
| **category** | Data Staleness |
| **first_seen** | ~2026-04-13 (Herald last sent; discovered 2026-05-18) |
| **recurrence_count** | 1 (ongoing; not yet diagnosed) |
| **severity** | **CRITICAL** |
| **detection_method** | Operational Health Baselines SLA check (May 18 diagnostic); Herald expected daily, last sent 35+ days ago |
| **root_cause** | Under investigation. Possible causes: (a) AACT trial ingest stalled (ctgov_poller last run unknown), (b) Herald builder script crashed, (c) SMTP auth expired, (d) No triggering events (unlikely; would require zero trials + zero insider trades + zero price moves all month) |
| **impact** | Daily news digest not sent; stakeholders missing market intelligence; operational visibility degraded; escalation alerts not sent |
| **investigation_steps** | (1) Check ctgov_poller last run and logs, (2) Check herald builder logs for errors, (3) Verify SMTP config in .env, (4) Manual test: `python -m tools.build_herald_digest --date $(date +%Y-%m-%d) --send-email` |
| **prevention_rule** | **Rule F-011**: Herald SLA from Operational Health Baselines: max 3 dark days before escalation. Implement automated check: if Herald digest not sent by 19:00 ET, trigger alert to ops_supervisor. Cron: check `ls -ltr logs/herald.log | tail -1` and validate timestamp ≤24h old. If failed: escalate to ops_supervisor + run recovery playbook F-011. |
| **status** | **ESCALATED** (2026-05-18 12:30 ET) |
| **notes** | High-priority operational issue; blocks stakeholder reporting; requires immediate investigation and fix. Once resolved, root cause and resolution must be logged here. |

---

#### F-012: Data Staleness — PDUFA/Catalyst Alerts Silence (6 Days)

| Field | Value |
|-------|-------|
| **failure_id** | F-012-data-staleness-pdufa-alerts-dark |
| **category** | Data Staleness |
| **first_seen** | ~2026-05-12 (PDUFA alerts stopped; discovered 2026-05-18) |
| **recurrence_count** | 1 (ongoing; baseline indicates 3–5 alerts expected per week during PDUFA active season) |
| **severity** | **CRITICAL** |
| **detection_method** | Operational Health Baselines SLA check; PDUFA alerts expected 1+ per day during May (PDUFA season), zero for 6 days indicates systemic failure |
| **root_cause** | Under investigation. Possible causes: (a) AACT trial ingest stalled (no new PDUFA dates in database), (b) Alert detection cron disabled/failed (check `crontab -l | grep pdufa`), (c) No eligible holdings with active PDUFA dates (unlikely; at least 2–3 expected in ranked portfolio each month), (d) Catalyst event detection logic broken (Spec 073 scope issue) |
| **impact** | FDA decision alerts not sent; ranked holdings at risk if PDUFA decisions happen without alert; event_ev_p_hit binding broken (Spec 077); postmortem scoring degraded |
| **investigation_steps** | (1) Check AACT trial ingest: `tail logs/ctgov_poller.log`, (2) Check alert cron: `crontab -l | grep pdufa` and verify last run, (3) Count PDUFA-eligible holdings in current snapshot: `grep -c "PDUFA" data/snapshots/$(date +%Y-%m-%d)/diagnostics/*.json`, (4) Test alert manually: `python -m tools.build_pdufa_alerts --date $(date +%Y-%m-%d)` |
| **prevention_rule** | **Rule F-012**: Implement PDUFA/Catalyst alert SLA in Operational Health Baselines (per Spec 073). Expected: ≥1 alert per day during PDUFA active season (May, Aug, Nov, Feb). If 0 alerts for 2+ consecutive days during season: escalate to ops_supervisor. Root cause playbook: Check AACT ingest → alert cron → event detection logic → Spec 073 scope (all in order). |
| **status** | **ESCALATED** (2026-05-18 12:30 ET) |
| **notes** | High-priority operational issue; impacts event-driven alpha strategy; requires immediate investigation and fix. Once resolved, root cause and resolution must be logged here. |

---

## Pattern Promotion Logic

**Rule: Systemic Recognition and Escalation**

When a failure pattern reaches **recurrence_count ≥ 3**, it is promoted from "error to fix" to "systemic issue to prevent":

1. **At 3+ occurrences**: 
   - Escalate from agent-level fix to governance-level review
   - Ops_supervisor + fleet_steward convene to discuss prevention rule
   - Prevention rule drafted and added to this ledger

2. **At 5+ occurrences**:
   - Escalate to architectural review
   - Consider systemic redesign (e.g., WSL2 → cloud scheduler) rather than just prevention rule
   - Spec may be required to address root infrastructure

3. **Example (current state)**:
   - **F-001 (ipo_dates staleness)**: recurrence_count=1, but symptomatic of broader F-008 (cache invalidation). If ipo_dates OR market_data staleness occurs 2 more times by June 18, escalate to data orchestration redesign.
   - **F-002 (Module 4 denominator)**: recurrence_count=1. If similar normalization bugs occur 2+ more times, escalate to create unified bounds-validation framework across all 5 modules.

---

## Queries and Search Interface

Hermes agents should be able to query this ledger:

```
# Find all CRITICAL failures
> filter(severity == "CRITICAL")
  Result: F-001, F-006, F-009, F-011, F-012

# Find all failures in a category
> filter(category == "Data Staleness")
  Result: F-001, F-011, F-012

# Find failures first seen after a date
> filter(first_seen > "2026-05-01")
  Result: F-001, F-004, F-006, F-011, F-012

# Find unresolved failures
> filter(resolution == null or resolution.startswith("Under investigation"))
  Result: F-011, F-012

# Find failures awaiting action (escalated)
> filter(status == "ESCALATED")
  Result: F-011, F-012

# Find prevention rules (for governance update)
> filter(prevention_rule != null)
  Result: All entries (each has prevention rule or note about needing rule)
```

**Implementation note**: This ledger should eventually be stored in a structured format (JSON, YAML, or SQL) for automated querying. For now, can be parsed by Hermes agents via natural language + grep.

---

## Maintenance and Review Cadence

| Review Scope | Frequency | Owner | Action |
|--------------|-----------|-------|--------|
| **New failure logged** | Ad-hoc (when failure occurs) | ops_supervisor / module owner | Add row to Active Failures section; link to fix commit |
| **Escalation check** (recurrence_count ≥ 3) | Weekly (Monday morning) | fleet_steward | Scan all entries; promote if needed; update prevention rules |
| **SLA review** | Monthly (1st of month) | ops_supervisor | Confirm all prevention rules still valid; audit past month for patterns that weren't logged |
| **Seasonal audit** | Quarterly (every 3 months) | ops_supervisor + Hermes maintainer | Consolidate lessons learned; identify systemic root causes; propose architectural changes |
| **Archival** | Quarterly | fleet_steward | Move resolved failures >6 months old to "Historical Archive" section (not shown here; kept for reference) |

---

## Cross-References

- **Operational Health Baselines Skill**: SLA thresholds that trigger escalation of failures (e.g., Herald dark >3 days = escalate)
- **Self-Improving Skill (Rule 1)**: Defines "log corrections and promote patterns after 3x" — this ledger implements that requirement
- **Document Lineage Map Skill** (#2 gap): Will address systemic document-sync failures (F-003, F-005)
- **Decision Audit Trail Skill** (#4 gap): Will prevent governance lapses (F-007) by formalizing decision memo requirements
- **Town-Hermes Feedback Protocol** (#5 gap): Will route failure findings from Town diagnostics back to Hermes agents for pattern recognition

---

## Known Gaps and Next Steps

1. **Automated failure detection**: Currently all failures detected manually (via audit, investigation, or alert). Next step: wire this ledger into automated monitoring (data auditor checks, health baseline SLA checks) so failures are logged immediately rather than discovered weeks later.

2. **Failure taxonomy refinement**: Current 8 categories may be too coarse or too fine. After 20–30 failures logged, revisit taxonomy to ensure categories are predictive and actionable.

3. **Root-cause root-cause analysis**: Several failures (F-001, F-008, F-011) have surface root causes (stale data, missing cron) but deeper causes (no data orchestration layer; no automated freshness check; infrastructure single point of failure). Next step: build "root-cause graph" that links surface failures to infrastructure/design gaps.

4. **Prevention rule automation**: Many prevention rules (F-001, F-006, F-011) require human judgment (escalation, decision-making). Future state: codify rules into automated checks (scripts, pre-commit hooks, monitoring agents) so prevention is enforced, not just recommended.

5. **Learning feedback loop**: Once a failure is resolved, the resolution and prevention rule should be fed back into agent training/prompts so future agents recognize the pattern and apply the prevention rule proactively. This requires the Town-Hermes feedback protocol (#5 gap) to be implemented.

---

## Suggested Next Step

Link this Failure Pattern Library into Hermes agent initialization prompts:

- **fleet_steward**: "You have access to the Failure Pattern Library. Before escalating an operational issue, query it for similar patterns and check if prevention rules apply."
- **ops_supervisor**: "When resolving an operational failure, log it in the Failure Pattern Library and draft a prevention rule. At recurrence_count ≥ 3, escalate to governance."
- **data_auditor**: "Use the Failure Pattern Library prevention rules (F-001, F-008, F-011, F-012) as your data freshness SLA checklist."

