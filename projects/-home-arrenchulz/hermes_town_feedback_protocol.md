# Skill: Town-Hermes Feedback Protocol and Dual-System Learning Reconciliation

**Status:** DRAFT  
**Last Reviewed:** 2026-05-18  
**Maintainer:** Hermes Operations Layer + Town AI Layer  
**Scope:** Biotech Screener Production System (coordinated human + AI oversight)  

---

## Purpose

Create a **two-way feedback channel** between Hermes (agent fleet coordinating production operations) and Town (human decision-maker with strategic oversight and memory management).

Current state (Spec 090):
- **Hermes → Town**: One-way notification (email with [HERMES] subject prefix)
- **Town → Hermes**: No formal channel; findings documented in Town memories but not accessible to agents

**Goal**: Enable:
1. **Town findings → Hermes agents** (e.g., doc review findings → fleet_steward prompt update)
2. **Hermes dark matter → Town** (e.g., Herald DARK 35 days → escalation to Town for investigation)
3. **Dual-system learning reconciliation** (Town memories ↔ Hermes .learnings/, avoid divergence)
4. **Governance feedback** (Town policy decisions → Hermes agent authorization rules)

---

## Context: Current Bridge (Spec 090, One-Way)

**Hermes → Town** (working):
```
Hermes agent detects operational anomaly
  → Routes message to email (subject: [HERMES] {alert})
  → Town receives email
  → Town investigates / updates memory
  → Town responds (manual follow-up or scheduled review)
```

**Examples**:
- Herald digest DARK: fleet_steward → email to Town → Town opens memory audit
- CI red 10 days: ops_supervisor → email "CI pipeline blocked" → Town investigates
- 13F filing delay: ops_supervisor → email "Q1 2026 refresh stalled, waiting on managers" → Town documents in memory

**Town → Hermes** (missing):
```
Town detects pattern / issue in memories or audit
  → ???? (no formal channel to tell agents)
  → Agents unaware
  → Dual storage diverges (Town memory != Hermes .learnings/)
```

**Examples of Town findings that should feed back**:
- Doc review audit (May 2026): flags C1 (B6 weights outdated), C4 (CI red 10d), C6 (agent count 17/26/27/28/30)
  - Should trigger: fleet_steward to audit agent_count fact, ops_supervisor to fix .docx, escalate CI
- Decision retrospective (May 2026): F-007 (inst_delta demotion was ad-hoc)
  - Should trigger: future ranker decisions enforce 5-element governed path (already added to Decision Audit Trail skill, but agents need to know)
- Memory audit (weekly): Herald DARK 35 days is unprecedented
  - Should trigger: fleet_steward to investigate + escalate (currently manual)

---

## Protocol Architecture: Bidirectional Message Routing

### Message Types and Routing

#### Type 1: Operational Alerts (Hermes → Town)

**Trigger**: Hermes agent detects anomaly exceeding SLA threshold  
**Mechanism**: Email to town-operations@[domain]  
**Subject**: `[HERMES] {system} {severity}: {description}`  
**Body**: Decision context + escalation path + action requested

**Example**:
```
From: fleet_steward@hermes
To: town-operations@[domain]
Subject: [HERMES] HERALD_DIGEST CRITICAL: Dark 35+ days; investigating AACT ingest failure

Body:
System: Herald Digest
Severity: CRITICAL (SLA breach >3 days dark; current 35d)
Detected: 2026-05-18 12:30 ET
Escalation Path: ops_supervisor (primary investigation owner)

Context:
Herald expected daily; last sent ~2026-04-13
SLA: max 3 dark days before escalation
Root cause candidates: AACT ingest stalled, Herald builder crash, SMTP auth expired

Action Requested:
(a) Confirm ops_supervisor is investigating (target resolution 24h)
(b) If ops_supervisor blocked, Town take over investigation
(c) If >24h, escalate to infrastructure team

Monitoring: Fleet_steward will check Herald status daily; next update 2026-05-19 09:00 ET
```

**Routing rules**:
- Severity CRITICAL → immediately (alert, SMS if available)
- Severity HIGH → within 4 hours (email, no urgent notification)
- Severity MEDIUM → daily digest (email, batched)
- Severity LOW → weekly report (email, low priority)

#### Type 2: Findings / Audit Results (Town → Hermes)

**Trigger**: Town completes investigation, audit, or retrospective analysis  
**Mechanism**: Structured message filed in Hermes inbox (MCP endpoint or GitHub issue/discussion); includes decision + action items  
**Format**: Decision memo (from Decision Audit Trail skill) or Audit Finding template

**Example 1: Doc Review Audit Finding**:
```
From: Town (conducting doc review audit)
To: fleet_steward, ops_supervisor
Type: AUDIT_FINDING
Date: 2026-05-18
Finding ID: C1-B6-weights-outdated

Finding: B6 weights documented as "65% coinvest + 35% inst_delta" in .docx files; 
production code is 100% coinvest (since 2026-05-04 demotion of inst_delta_z).

Severity: MEDIUM (stakeholder confusion risk; no production impact)
Owner: ops_supervisor (ranker governance)
Required Action: Update .docx by 2026-05-26 (pre-13F refresh)
                 Implement doc refresh policy (per Document Lineage Map skill)

Context: Related to Decision Audit Trail 2026-05-04 (inst_delta demotion).
Rationale: Demotion is valid pending 13F refresh; docs should reflect current state.

Approval Gate: ops_supervisor sign-off on .docx update + refresh policy

Routing: ops_supervisor notified; action tracked in decision audit trail
```

**Example 2: Memory Reconciliation Request**:
```
From: Town (memory steward)
To: fleet_steward
Type: MEMORY_SYNC_REQUEST
Date: 2026-05-18

Issue: Town memory "13f_q1_2026_monitoring_live_2026_05_15.md" says "6/48 managers filed (12.5%), 
Jaccard=0.536." Hermes .learnings/ references outdated Jaccard value (0.50).

Resolution: Update Hermes file at .claude/learnings/13f_cohort_status.md with new Jaccard=0.536, 
filing_count=6, last_verified=2026-05-18.

Owner: fleet_steward (maintains Hermes operational state)
Urgency: MEDIUM (sync within 24h; impacts Spec 089 gate decision)

Routing: fleet_steward notified; update tracked
```

**Example 3: Governance Decision Feedback**:
```
From: Town (governance review)
To: ops_supervisor, memory-steward
Type: GOVERNANCE_FEEDBACK
Date: 2026-05-18
Decision: Enforce 5-element governed path for all ranker feature changes

Finding: Failure Pattern Library F-007 identified ad-hoc decision (inst_delta demotion lacked 
pre-declared criteria). Reviewed Decision Audit Trail; 5-element path is documented; 
recommend promoting to governance policy + agent authorization rules.

Action Item 1: ops_supervisor — Update agent initialization prompts 
               ("Before removing a ranker signal, prepare 5-element governed path memo")
               Target: By 2026-05-26 (before next ranker research sprint)

Action Item 2: memory-steward — Update self-improving skill 
               ("Log corrections and promote patterns after 3x; always document 
                5-element path for parameter changes")
               Target: By 2026-05-26

Action Item 3: fleet_steward — Wire Decision Audit Trail into fleet_steward agent 
               (weekly check: are all active decisions on track for review triggers?)
               Target: By 2026-05-30

Approval Gate: Town sign-off on all 3 action items before Spec 089 KG implementation

Routing: ops_supervisor, memory-steward, fleet_steward notified; action tracked in quarterly plan
```

#### Type 3: Dark Matter / Unresolved Issues (Town → Hermes)

**Trigger**: Town discovers operational gap not currently tracked by agents  
**Mechanism**: File as new issue in Failure Pattern Library (with escalation to Hermes agents)

**Example**:
```
From: Town (reviewing operational closure memo)
To: fleet_steward, ops_supervisor
Type: DARK_MATTER_ESCALATION
Date: 2026-05-18

Issue: Herald digest DARK 35+ days (as of May 18 diagnostic)
       + PDUFA alerts DARK 6 days
       + Bellringer degraded (1 results email in week)
       = 3 concurrent operational failures (F-011, F-012, and unnamed)

Status: All three escalated to ops_supervisor on 2026-05-18 morning.
        Town adds: "This pattern (3 concurrent system failures in messaging/alert layer) 
        suggests common root cause (AACT ingest stalled?) or infrastructure issue."

Suggested Action: Cross-system investigation 
  1. Check AACT trial ingest (ctgov_poller) — likely common trigger
  2. If AACT stalled, restore and backfill
  3. If not AACT, investigate email delivery (Herald builder, Bellringer builder, alert cron)

Owner: ops_supervisor (operational triage)
Escalation Path: If not resolved by 2026-05-19 18:00 ET, escalate to infrastructure on-call

Routing: ops_supervisor primary; fleet_steward secondary (monitoring); escalate if SLA breached
```

---

## Dual-System Storage Reconciliation

**Current state**: 
- Town maintains 20+ global memories (in Claude's memory system)
- Hermes maintains .learnings/ directory (flat Markdown files)
- Both cover overlapping facts (agent count, signal IC, operational state)
- No reconciliation process → risk of divergence

**Solution: Primary vs Secondary Storage Model**

### Principles

1. **Town is primary for strategic/governance decisions** (why decisions made, approval history, retrospectives)
2. **Hermes is primary for operational state** (current snapshot, agent status, system health)
3. **Reconciliation happens on schedule** (weekly sync + monthly audit)
4. **Conflicts resolved by ownership** (fact owner decides which system is canonical)

### Storage Allocation

| Fact Type | Primary | Secondary | Sync Frequency | Owner |
|-----------|---------|-----------|-----------------|-------|
| **Agent fleet status** | Hermes .learnings/ | Town memory (optional) | Daily (Hermes updates) | fleet_steward |
| **Signal IC / evidence** | Town memory | Hermes .learnings/ (references) | Per signal review (weekly+ during active research) | Signal owner / ops_supervisor |
| **Decision rationale** | Town memory (narrative) + GitHub Decision Audit Trail (structured) | Hermes .learnings/ (summary) | Per decision (immediate) + quarterly audit | ops_supervisor |
| **Operational dark matter** | Hermes Failure Pattern Library | Town memory (context) | Per failure (immediate) + weekly escalation check | ops_supervisor / fleet_steward |
| **Document sync state** | Hermes Document Lineage Map | Town memory (reference) | Per fact change (24h) + monthly audit | Document owner |
| **Governance policy** | Town memory (policy doc) + GitHub specs | Hermes .learnings/ (policy summary) | Per policy change (immediate) | ops_supervisor |
| **Learning from dead lanes** | Town memory (analysis) | Hermes .learnings/ (summary) | Per dead lane closure (within 1 week) | Spec owner |
| **Cohort / 13F state** | Town memory (detailed) | Hermes .learnings/ (summary: filing count, Jaccard, ETA) | Daily (Town updates daily 18:30 ET, Hermes syncs) | ops_supervisor |
| **Checklist v2 framework** | GitHub specs (source) + Town memory (status) | Hermes .learnings/ (checklist summary) | Per spec completion (weekly+ during build) | Spec owner |

### Reconciliation Process

#### Weekly Sync (Monday 09:00 ET)

**Owner**: memory-steward + fleet_steward  
**Process**:

1. **Hermes → Town**:
   - Export current state from Hermes .learnings/ (agent count, fleet status, failure pattern recurrence counts)
   - Send to memory-steward as structured report
   - memory-steward confirms: "Does this match Town memory? Any drift?"

2. **Town → Hermes**:
   - Export recent Town memory updates (strategic decisions, governance findings, audit results)
   - Send to fleet_steward as list of changes
   - fleet_steward confirms: "Do Hermes agents know about these findings? Should any agent prompts update?"

3. **Conflict Resolution** (if drift detected):
   - Identify discrepancy (e.g., agent count in Town memory = 26, in Hermes = 18)
   - Fact owner (fleet_steward for agent count) decides: "Which is current? Why the divergence?"
   - Update lagging system + document reason for divergence (e.g., "Town memory last updated 2026-05-08; Hermes updated 2026-05-18 post-onboarding; Town memory was stale")

4. **Action Items**:
   - Any finding requiring Hermes agent action → create action item + assign owner + due date
   - Any operational state change requiring Town documentation → update Town memory
   - Track all reconciliation actions in weekly report

#### Monthly Audit (1st of month, 10:00 ET)

**Owner**: ops_supervisor + memory-steward  
**Process**:

1. **Review all storage tiers** (Town memories, Hermes .learnings/, GitHub specs, Decision Audit Trail):
   - Check for contradictory statements about the same fact
   - Identify any fact with >30 days since last sync
   - Flag any fact with multiple "owners" (conflicts about who is responsible)

2. **Establish primary source** for each fact tier:
   - Strategic/governance: which Town memory is canonical? (mark others as "derived" or "archive")
   - Operational: which Hermes file is canonical?
   - Specs: which GitHub spec is current? (mark superseded specs as "deprecated")

3. **Reconcile contradictions**:
   - Interview fact owners
   - Decide: is one system lagging, or is there a genuine conflict?
   - Update lagging system
   - Document root cause (e.g., "Town was on vacation; Hermes didn't update memory; no sync happened")

4. **Update storage allocation table** (above) if ownership changes

#### Quarterly Deep-Dive (Every 3 months: Jan, Apr, Jul, Oct)

**Owner**: ops_supervisor + Hermes maintainer + Town strategist  
**Process**:

1. **Validate storage allocation model**: Are the primary/secondary assignments still correct?
   - Are there new fact types that need allocation?
   - Are there facts where secondary storage is never used? (consider removing)
   - Are there frequent conflicts in certain categories? (may need reallocation)

2. **Reconcile learning archives**: 
   - Hermes Failure Pattern Library vs Town incident retrospectives — do they tell same story?
   - Hermes Decision Audit Trail vs Town decision memos — are decisions consistently documented?
   - Identify learning that exists in one system but not the other

3. **Test dual-system queries**:
   - Ask: "What is the current status of 13F Q1 2026 refresh?"
   - Check: Can you answer by reading Hermes? By reading Town? Do they match?
   - Document any gaps or conflicting info

4. **Update governance** if needed:
   - Refine storage allocation (primary/secondary assignments)
   - Adjust sync cadence if reconciliation is expensive
   - Add new reconciliation rules if new patterns emerge

---

## Agent Prompt Updates: Embedding Feedback Loop

**Current state**: Agent prompts reference only Hermes systems (Failure Pattern Library, Decision Audit Trail, Operational Health Baselines)

**Change**: Update key agent prompts to reference Town findings and dual-system state

### fleet_steward Prompt Updates

**Addition 1: Weekly Reconciliation Check**
```
"Before your weekly report, run memory_sync_check():
  - Hermes .learnings/ (agent count, fleet status, failure recurrence)
  - Town memory 'current state' section
  - If drift >10%, escalate to memory-steward for manual reconciliation
  - Report: '{N} facts verified, {M} drifts detected, reconciliation status'"
```

**Addition 2: Dark Matter Escalation**
```
"When you detect 3+ concurrent operational failures (e.g., Herald DARK + PDUFA DARK + Bellringer degraded),
escalate to Town with pattern analysis:
  - 'Three concurrent messaging failures suggests common root (AACT ingest?) or infrastructure issue'
  - Request Town cross-system investigation
  - Track owner (ops_supervisor primary) and resolution SLA (24h)"
```

**Addition 3: Decision Audit Trail Monitoring**
```
"Weekly check: scan Decision Audit Trail for decisions with review triggers firing soon.
Example: Decision 2026-05-04 (inst_delta demotion) has review trigger 2026-05-26 (13F refresh).
5 days before trigger: notify ops_supervisor 'Decision 2026-05-04 review trigger approaching. 
Prepare cohort analysis for inst_delta_z IC re-evaluation.'"
```

### ops_supervisor Prompt Updates

**Addition 1: Governance Policy Reference**
```
"Before making a ranker feature change, consult Decision Audit Trail 5-element governed path:
  1. Prepare two-frame evidence (baseline + recent degradation)
  2. Run comparator probe (rule out confounds)
  3. Write spec-style memo
  4. Get approval from Hermes governance owner
  5. File decision memo + link commit

If this is a new decision type not yet in Audit Trail, ask Town strategist 
'Is this decision type documented in policy? What approval gate applies?'"
```

**Addition 2: Escalation Routing**
```
"When escalating operational issue to Town, include:
  - Current Hermes Failure Pattern Library entry (if exists)
  - Current Operational Health Baselines status
  - Related Decision Audit Trail entries (if applicable)

Example: 'Herald DARK escalation should reference F-011 (failure pattern), 
Operational Health Baselines SLA breach (CRITICAL), Decision 2026-04-28 
(enable alerts) status.'"
```

### data_auditor Prompt Updates

**Addition 1: Fact Freshness Check (from Document Lineage Map)**
```
"Weekly fact freshness audit:
  - Scan Document Lineage Map Fact Authority Table
  - For any fact with Last Verified >30 days old: escalate to fact owner
  - Report: '{N} facts verified, {M} over-due for verification, {K} drifts detected'
  
If drift detected, notify ops_supervisor + Town memory-steward:
  'Sync gap detected: {fact} diverges across documents. Authoritative source: {source}. 
  Drift status: {drift_details}. Suggest update within {SLA}.'"
```

---

## Implementation: Routing Layer and Message Queues

### Message Queue Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Town Layer                             │
│  (Memory, Decision Context, Governance, Retrospectives)    │
└─────────────────────────────────────────────────────────────┘
                          ↑ ↓
        ┌──────────────────────────────────────────┐
        │  Town-Hermes Feedback Queue (MCP)        │
        ├──────────────────────────────────────────┤
        │ Message Type | From | To | Priority      │
        ├──────────────────────────────────────────┤
        │ ALERT        | H→T  | ops_supervisor    │
        │ FINDING      | T→H  | fleet_steward     │
        │ SYNC_REQ     | T→H  | memory-steward    │
        │ DARK_MATTER  | T→H  | ops_supervisor    │
        └──────────────────────────────────────────┘
                          ↑ ↓
┌─────────────────────────────────────────────────────────────┐
│                    Hermes Layer                             │
│  (Agents, Operations, Failure Patterns, Audit Trail)       │
└─────────────────────────────────────────────────────────────┘
```

**Implementation options**:

1. **Email-based** (simplest, current Spec 090):
   - Hermes agents send alerts via email
   - Town sends findings via email with `[TOWN-FEEDBACK]` subject prefix
   - ops_supervisor reads both inboxes and routes manually
   - Pro: Simple, no new infrastructure
   - Con: Slow, manual routing, no structured data

2. **GitHub Issues / Discussions** (medium complexity):
   - Hermes agents file issues in `biotech-screener` repo
   - Town comments with findings + links to memories
   - Agents subscribe to issue labels
   - Pro: Structured, searchable, version control integration
   - Con: Requires GitHub API integration, polling for updates

3. **MCP Endpoints** (complex, future):
   - Create MCP (Model Context Protocol) server in Hermes
   - Town agents query Hermes state (agent status, failure patterns, etc.)
   - Hermes agents poll Town findings endpoint (Town memories, governance decisions)
   - Pro: Real-time, bidirectional, structured queries
   - Con: Requires MCP implementation, infrastructure cost

**Recommended**: Start with email (current) + GitHub issues (structured), plan for MCP (2026-06+).

---

## Escalation Paths and Decision Rights

### When Town Findings Conflict with Hermes Operations

**Scenario**: Town memory says "Clinical v2 should be re-evaluated post-13F-refresh" 
but Hermes Decision Audit Trail says "Clinical v2 is closed (FINAL REJECTION)" 
and Decision 2026-04-02 says review trigger "never" (archive only).

**Resolution path**:

1. **Alert**: Town finding conflicts with Hermes policy
2. **Escalate to ops_supervisor**: "Town suggests clinical v2 reconsideration; Hermes decision 2026-04-02 says FINAL. Reconcile?"
3. **ops_supervisor decides**: 
   - Option A: Update Decision 2026-04-02 review trigger (add "Post-13F-refresh" as new trigger)
   - Option B: Confirm FINAL and notify Town "No reconsideration planned"
4. **Document**: File decision memo (Decision Audit Trail 2026-05-??-reconsider-clinical-v2) or update existing memo
5. **Sync**: Update both Town memory + Hermes Decision Audit Trail with resolution

### When Hermes Detects Dark Matter That Town Doesn't Know About

**Scenario**: Fleet_steward notices 6 agents STALE for >72 hours (post-WSL shutdown 05-15)
but Town's last memory update was 05-16 (didn't capture full recovery timeline).

**Resolution path**:

1. **Alert**: Hermes → Town "6 agents recovered post-WSL-outage; full timeline at {Hermes file}"
2. **Town updates memory**: "Confirmed WSL recovery 05-18 morning; agents back to OK status by 12:30 ET"
3. **Sync**: Hermes .learnings/ agent status now matches Town memory
4. **Archive**: File incident in Failure Pattern Library F-006 (WSL shutdown) with recovery timeline

---

## Known Issues and Limitations

| Issue | Severity | Workaround | Target Fix |
|-------|----------|-----------|-----------|
| **No automated query interface** | MEDIUM | Manual weekly sync + email routing | MCP endpoints (2026-06+) |
| **Email routing is slow** | MEDIUM | Use GitHub issues for urgent findings | GitHub API integration (2026-05-30) |
| **Storage allocation may be wrong** | MEDIUM | Quarterly deep-dive audit to validate | Refine based on May/Jun experience |
| **No conflict detection** | MEDIUM | ops_supervisor manually reviews contradictions | Automated linter (2026-06+) |
| **Agent prompt updates require manual edit** | LOW | Document required updates; batch on next agent release | Metadata-driven agent config (2026-06+) |
| **Hermes .learnings/ has no read access control** | LOW | Trust ops_supervisor not to edit externally | Hermes agent owns all writes (current) |
| **Town memories may reference deleted Hermes files** | LOW | Link check on quarterly audit | Automated link validation (2026-06+) |

---

## Integration with Other Skills

- **Operational Health Baselines (Skill #1)**: SLA thresholds trigger Hermes → Town alerts (e.g., Herald DARK >3 days → escalate)
- **Failure Pattern Library (Skill #2)**: Town audit findings feed back to Hermes; when recurrence ≥3, Town signals systemic issue for Hermes to investigate
- **Document Lineage Map (Skill #3)**: Town fact authority audits → Hermes drift detection; Hermes fact freshness checks → Town memory updates
- **Decision Audit Trail (Skill #4)**: Town governance decisions → Hermes agent prompts; Hermes decision reviews → Town governance retrospectives
- **Self-Improving Skill (Rule 1)**: Dual storage (Town memory + Hermes .learnings/) managed by this protocol

---

## Rollout Plan

### Phase 1: Email + GitHub (May 18–June 15)

1. **Week 1 (May 18–24)**:
   - Start weekly memory sync (Monday 09:00 ET)
   - Town files audit findings as GitHub issues + links to memories
   - Hermes agents subscribe to issues; read findings into .learnings/
   - Test with current operational issues (Herald DARK, PDUFA DARK, CI red)

2. **Week 2–3 (May 25–Jun 8)**:
   - Monthly audit (June 1): validate storage allocation, reconcile conflicts
   - Update agent prompts (fleet_steward, ops_supervisor, data_auditor) with findings references
   - Test dual-system queries: "What is current 13F refresh status?" (Town memory + Hermes .learnings/)

3. **Week 4 (Jun 8–15)**:
   - Rollout complete; daily operations running bidirectional feedback loop
   - Weekly sync + monthly audit routine established
   - Document lessons learned; plan Phase 2

### Phase 2: GitHub API Integration (June 15–30)

1. Create GitHub API automation:
   - Hermes agents file issues programmatically (vs manual email)
   - Town findings auto-posted as issue comments
   - Escalation paths trigger GitHub workflows (e.g., auto-assign to ops_supervisor)

2. Implement conflict detection:
   - Linter scans Decision Audit Trail + GitHub specs for contradictions
   - Linter checks Document Lineage Map for sync gaps
   - Reports run on commit + weekly audit

### Phase 3: MCP Endpoints (July+)

1. Build MCP server in Hermes:
   - Agents query: "What are current Town findings?" → returns latest memories
   - Agents query: "Is decision X on track for review trigger?" → checks audit trail + memory status

2. Town agents access Hermes state:
   - Query: "What is failure pattern recurrence count for F-011?" 
   - Returns: { count: 1, status: "UNRESOLVED", owner: "ops_supervisor", escalated: "2026-05-18T12:30Z" }

---

## Suggested Next Steps

1. **Immediate (May 18–19)**:
   - Set up weekly memory sync (first one: Monday 05-20, 09:00 ET)
   - Create GitHub issues for current dark matter (Herald DARK, PDUFA DARK, CI red) with references to Failure Pattern Library
   - Add Town context comments linking to related memories

2. **Short-term (May 19–26)**:
   - Update fleet_steward, ops_supervisor, data_auditor agent prompts with feedback loop references
   - Conduct first weekly sync; reconcile any drifts (expect Herald/PDUFA issues to surface)
   - Test dual-system queries (agent count, signal IC, decision status)

3. **Medium-term (May 26–Jun 15)**:
   - Monthly audit (June 1): validate storage allocation, reconcile conflicts discovered in first month
   - Implement GitHub API automation for issue filing
   - Plan MCP integration

4. **Integration with Full Skill Stack**:
   - Operational Health Baselines → Town escalation routing
   - Failure Pattern Library → Town pattern analysis
   - Document Lineage Map → Town fact authority audits
   - Decision Audit Trail → Town governance feedback
   - Feedback Protocol → bidirectional reconciliation for all above

---

## Example: End-to-End Feedback Loop (Herald DARK Case Study)

**May 18, 12:30 ET**: Herald DARK 35+ days detected by Hermes

```
1. fleet_steward (Hermes agent) detects SLA breach
   → Generates Operational Health Baselines alert (CRITICAL)
   → Sends email [HERMES] HERALD_DIGEST CRITICAL: Dark 35+ days
   → Creates GitHub issue #451 "Herald digest dark 35 days; investigate AACT ingest"
   → Logs Failure Pattern Library F-011 (ESCALATED)

2. ops_supervisor (human, receives email + GitHub notification)
   → Opens GitHub issue #451
   → Sees ops_supervisor is owner; reviews playbook from Operational Health Baselines
   → Checks AACT trial ingest, Herald builder logs
   → Finds: ctgov_poller last ran 2026-04-13; stalled for 35 days (!)
   
3. ops_supervisor (human) investigates + fixes
   → Restarts ctgov_poller; backfills May 2026 trial records
   → Confirms Herald builder runs successfully; digest sent 2026-05-18 17:30 ET
   → Updates GitHub issue: "Root cause: ctgov_poller cron killed 04-13; recovered 05-18. 
                             AACT ingest backfill in progress."
   
4. Town (Town strategist) reviews GitHub issue + Hermes findings
   → Reads Failure Pattern Library F-011 (UNRESOLVED)
   → Reads Operational Health Baselines CRITICAL alert
   → Reads decision context: has Herald been addressed before? (yes, Spec 063 Phase 1-3 complete, live since 04-17)
   → Creates Town memory: "Herald dark 35 days incident (2026-04-13–05-18). 
                           Root: ctgov_poller cron killed, undetected for 3+ weeks. 
                           Prevention: add monitoring (heartbeat check) + escalation SLA."
   
5. fleet_steward (Hermes agent, Monday 09:00 ET) runs weekly sync
   → Reads Town memory about Herald incident
   → Updates Hermes .learnings/herald_incident_2026_05_18.md with Town analysis
   → Escalates to ops_supervisor: "Town memory says add Herald heartbeat monitoring. 
                                   Should we wire this into data_auditor SLA checks?"
   
6. ops_supervisor + Town (governance) update decision + policy
   → Town writes Decision Audit Trail memo: 
     "Decision 2026-05-18: Add Herald heartbeat SLA (max 3 dark days before escalation)"
   → Updates Operational Health Baselines: add Herald heartbeat check to data_auditor playbook
   → Links GitHub commit to decision memo
   
7. fleet_steward (Hermes agent) updates agent initialization
   → New prompt: "Herald digest expected daily. Monitor via Operational Health Baselines SLA. 
                  If DARK >3 days, escalate to ops_supervisor with suggested root cause playbook 
                  (from F-011 prevention rule)."
   → Next week's monitoring uses new SLA baseline
```

**Outcome**: Issue fully closed, learning archived in both Town memory + Hermes Failure Pattern Library, new SLA in place, agent prompts updated, decision documented in audit trail.

