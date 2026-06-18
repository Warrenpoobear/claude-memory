# Skill: Content Library Promotion Pipeline and Knowledge Archival Framework

**Status:** DRAFT  
**Last Reviewed:** 2026-05-18  
**Maintainer:** Hermes Operations Layer + Documentation Steward  
**Scope:** Biotech Screener Production System  

---

## Purpose

Create a systematic process to promote durable operational knowledge from the Content Library (external documents, one-off reports, research digests) into the Hermes skill layer, so agents can systematically access and apply this knowledge.

**Current problem**:
- 7+ operational documents exist outside the skill layer (Content Library, shared drives, GitHub wiki)
- These documents contain real knowledge (schema specs, security posture, debugging runbooks)
- But agents don't know about them; they're not referenced in skill prompts
- Knowledge decays: documents created, read once, then forgotten; never promoted to durable status
- Duplicate effort: agents re-discover patterns that were already documented in a forgotten file

**Goal**: Every 30–90 days, audit Content Library; decide for each document: **PROMOTE to skill layer, ARCHIVE as reference, or DEPRECATE as stale**.

---

## Core Principle: Three-Tier Knowledge Architecture

### Tier 1: Durable Skill Layer (Hermes Agent Accessible)

**What belongs here**: 
- Operational procedures (how-to runbooks for common tasks)
- Architectural patterns (routing logic, gate logic, survivorship rules)
- Taxonomy and definitions (what is a "Tier 1 signal"? what gates are mandatory?)
- Policy and governance (approval gates, decision frameworks)
- Evidence/rationale (why was this decision made?)

**Characteristics**:
- Referenced in agent initialization prompts
- Updated on regular cadence (weekly to quarterly)
- Ownership assigned (skill owner is responsible for maintenance)
- Cross-referenced with other skills
- Tested (correctness verified by automated checks or manual audit)

**Examples from Hermes (May 18 state)**:
- biotech-validation.md (Module 1–3 validation rules)
- financial-health.md (Module 2 gates + rationale)
- selector-ranker.md (selector + ranker logic + dead lanes)
- institutional-signal.md (coinvest_score_z + tracking)
- (14 total skills as of May 18)

**Plus the 5 new meta-skills (drafted May 18)**:
- Operational Health Baselines (SLA framework)
- Failure Pattern Library (error catalog)
- Document Lineage Map (fact authority)
- Decision Audit Trail (parameter rationale)
- Town-Hermes Feedback Protocol (dual-system reconciliation)

### Tier 2: Warm Reference Library (Indexed, Searchable, But Not Agent-Embedded)

**What belongs here**:
- Recent audit reports (findings from May 2026 doc review audit, CI diagnostic)
- Research summaries (ranker research landscape, clinical alternatives)
- Time-sensitive guidance (cohort monitoring runbook, 13F refresh progress)
- Specialized deep-dives (options surface shape analysis, EES v3 structural failure)
- External context (AI landscape research, compliance memos, security posture)

**Characteristics**:
- Indexed in Content Library master list (with last-reviewed date, owner, deprecation SLA)
- Findable by search + browsing
- NOT embedded in agent prompts (agents must explicitly request/consult)
- Owned by domain expert (not necessarily maintained on cadence; allowed to go stale)
- Expected lifetime: 30–90 days (then promote or deprecate)

**Examples (May 18 state)**:
- Biotech Screener Build Specs (Export Correctness) — schema/coverage/export rules
- Ranker Research Prep Pack — unbuilt scripts, May 22 deadline
- CI Diagnostic Report + CI Fix Checklist — root-cause analysis
- Full Sweep Audit Report (May 17) — comprehensive findings
- Hermes Stale Agent Diagnostic Checklist — 6 stale agents

### Tier 3: Archive (Historical Reference, Read-Only)

**What belongs here**:
- Superseded documents (replaced by newer versions in Tier 1)
- Completed initiatives (Spec 102 backfill execution closure; Spec 104 Phase A)
- Past decision memos (archived after 12 months of being current)
- Research that didn't pan out (dead lanes, rejected signals)
- Incident post-mortems (resolved, no ongoing action needed)

**Characteristics**:
- Read-only; not updated
- Searchable for historical context
- Linked from Tier 1/2 documents (for lineage/rationale)
- Automatically archived after deprecation trigger (30–90 days in Tier 2 without promotion)
- Lifetime: indefinite (kept for compliance, learning, audit trail)

**Examples (May 18 state)**:
- Spec 064 EES v3 Promotion Battery (closed; formulation invalid)
- Spec 069 Module 2 v2 Schema Restore (not implemented; spec archived)
- Historical ranker v1 documentation (replaced by v2; archived May 2026)
- Prior clinical stack v1 (superseded by v2; archived May 2026)

---

## Document Triage Framework: Promotion Criteria

**Decision tree for each document in Content Library**:

### Step 1: Is This Document Durable or Time-Sensitive?

| Attribute | Durable (Tier 1 Candidate) | Time-Sensitive (Tier 2 Candidate) | Stale (Archive/Deprecate) |
|-----------|---------------------------|-----------------------------------|--------------------------|
| **Lifetime** | Indefinite (policy, architecture, core procedures) | 30–90 days (current project status, deadline-driven guidance) | >90 days stale (past initiative, resolved incident) |
| **Change frequency** | Stable (changes documented in Decision Audit Trail) | Frequent (daily updates during active phase) | None (read-only, no ongoing ownership) |
| **Ownership** | Clear (skill owner responsible for maintenance) | Clear but temporary (project lead during initiative) | Unclear (no active owner) |
| **Testability** | Testable (correctness verified) | Observable (progress tracked, outcomes measured) | Historical (facts frozen at deprecation time) |
| **Agent embedding** | Yes (referenced in prompts) | Conditional (agents consult if relevant) | No (archive only) |

### Step 2: Does This Document Meet Promotion Criteria?

**Criteria for Tier 1 promotion** (all must be true):

- [ ] **Durable**: Content will remain valid >6 months without major revision (policy, architecture, core procedures)
- [ ] **Unique**: Knowledge is not duplicated elsewhere in Tier 1 skills or GitHub specs
- [ ] **Referenced**: Document is actively consulted by 1+ Hermes agents or operators
- [ ] **Correctness**: Content accuracy verified (manual review, automated test, or expert sign-off)
- [ ] **Ownership**: Clear owner assigned; owner commits to maintenance cadence
- [ ] **Agent-consumable**: Content can be embedded in agent initialization prompt without bloat (aim <500 lines)

**Criteria for Tier 2 retention** (pass all; if not, deprecate):

- [ ] **Active**: Document is <90 days old OR owner has updated it within last 30 days
- [ ] **Relevant**: Content relates to current initiative or operational state (not purely historical)
- [ ] **Findable**: Document is indexed in Content Library master list; findable by search
- [ ] **Useful**: 1+ team members have referenced it in past 30 days (or it's on critical path, like May 22 deadline)

**Criteria for archival** (move to Tier 3):

- [ ] **Superseded**: Content replaced by newer version (Tier 1 skill, newer report, updated spec)
- [ ] **Stale**: Document is >90 days old AND no active owner AND not on critical path
- [ ] **Complete**: Initiative closed; no ongoing action needed (spec shipped, incident resolved)
- [ ] **Compliance**: Keep for audit trail / compliance, but not for operational reference

---

## Current Content Library Audit (May 18, 2026)

**Status**: 7 documents identified for triage (below)

### Document 1: Biotech Screener Build Specs (Export Correctness)

| Field | Value |
|-------|-------|
| **Title** | Biotech Screener Build Specs (Export Correctness) |
| **Size** | ~410 lines |
| **Created** | ~2026-04 |
| **Last Updated** | ~2026-04-15 (stale 33 days) |
| **Owner** | Module 3/QA owner (unclear responsibility) |
| **Content** | Schema definitions (rankings.csv, decision_portfolio.csv, diagnostics formats); coverage rules (mandatory fields, format validation); export correctness rules |
| **Current Usage** | Referenced in biotech-validation.md (skill); implied in qa agent behavior |
| **Tier 1 Promotion Criteria** | ✓ Durable (schema stable >6mo) | ✓ Unique (specs detail not in skills) | ✓ Referenced (qa agent uses) | ✗ Correctness (needs QA audit) | ✗ Ownership (unclear) | ✓ Consumable (<500 lines OK) |
| **Recommendation** | **PROMOTE to Tier 1** — Upgrade to `biotech-export-schema.md` skill; clarify ownership (qa owner); verify correctness against production snapshots; embed into qa agent initialization; link from biotech-validation |
| **Promotion SLA** | 14 days (by 2026-06-01) |
| **Action Items** | (1) QA owner audit specs vs actual May 18 snapshot format, (2) File as new skill (or expand biotech-validation), (3) Update qa agent prompt to reference schema spec, (4) Add compliance note: "Schema locked v1.14.0; breaking changes require governance approval" |

### Document 2: Ranker Research Prep Pack

| Field | Value |
|-------|-------|
| **Title** | Ranker Research Prep Pack (H1 2026) |
| **Size** | ~350 lines |
| **Created** | ~2026-05-01 |
| **Last Updated** | 2026-05-15 (3 days; active) |
| **Owner** | Ranker research lead (active ownership) |
| **Content** | 3 unbuilt scripts (validation suite, cross-validation harness, pairwise ranker stress test); feature candidate list (20 signals under consideration for Checklist v2 path); research timeline (May 22 milestone: finalize signal candidates) |
| **Current Usage** | Active (May 22 deadline approaching; 4 days away) |
| **Tier 1 Promotion Criteria** | ✗ Durable (tied to H1 deadline; will expire 2026-06-30) | ✓ Unique | ✓ Referenced (ranker research team) | ✗ Correctness (unbuilt, untested) | ✓ Ownership (clear) | ✗ Consumable (unbuilt scripts, not ready) |
| **Recommendation** | **TIER 2 (Warm Reference)** — Keep as active reference during H1 research sprint (May–June); escalate to Tier 1 if scripts complete + research yields production-ready signal candidates; otherwise archive post-June |
| **Retention SLA** | 30 days (expires 2026-06-15; escalate by May 31 or plan deprecation) |
| **Action Items** | (1) Ranker lead confirm May 22 milestone status, (2) If milestone met, promote unbuilt scripts to Tier 1 testing suite, (3) If behind, plan recovery or archive document by June 15 |

### Document 3: CI Diagnostic Report + CI Fix Checklist

| Field | Value |
|-------|-------|
| **Title** | CI Pipeline Diagnostic Report (May 8–18) + Remediation Checklist |
| **Size** | ~200 lines (diagnostic) + 50 lines (checklist) |
| **Created** | 2026-05-18 (today) |
| **Last Updated** | 2026-05-18 |
| **Owner** | ops_supervisor (CI/infrastructure accountability) |
| **Content** | Root-cause analysis of CI red (10 days, since May 8); test failure signature (pre-existing or regression?); proposed fixes (unlock test, dismiss if pre-existing); remediation checklist (steps to unblock) |
| **Current Usage** | CRITICAL — blocking all merges; needs immediate action |
| **Tier 1 Promotion Criteria** | ✓ Durable (diagnostic applicable to future CI issues) | ✓ Unique (specific to current failure) | ✓ Referenced (ops_supervisor, eng team) | ✓ Correctness (diagnosis fresh, just completed) | ✓ Ownership (clear) | ✗ Consumable (one-off incident, not generalizable) |
| **Recommendation** | **SPLIT**: (1) **PROMOTE checklist to Tier 1** as `ci-unblock-runbook.md` (reusable for future CI red); (2) **ARCHIVE diagnostic** as incident post-mortem (reference only) once CI unblocked; document lessons in Failure Pattern Library |
| **Promotion SLA** | Immediate (unblock checklist live by 2026-05-19; diagnostic archived by 2026-05-20) |
| **Action Items** | (1) Extract checklist as standalone skill doc, (2) Add to ci_remediation procedures, (3) Link from Operational Health Baselines CI system SLA section, (4) Archive diagnostic in incident record (reference for future similar issues) |

### Document 4: Full Sweep Audit Report (May 17)

| Field | Value |
|-------|-------|
| **Title** | Full Sweep Audit Report (May 17, 2026) |
| **Size** | ~500 lines (comprehensive) |
| **Created** | 2026-05-17 |
| **Last Updated** | 2026-05-17 |
| **Owner** | Audit team (one-time audit; no ongoing ownership) |
| **Content** | Snapshot consistency checks (file counts, row counts); diagnostic output audit (mandatory fields present); gate validation (all gates firing as designed); edge case testing (empty universe, max holdings, delist boundary) |
| **Current Usage** | Reference for May 18 snapshot QA (already incorporated into qa agent checks) |
| **Tier 1 Promotion Criteria** | ✓ Durable (audit procedures generalizable) | ✓ Unique | ✗ Referenced (was one-time audit, not ongoing) | ✓ Correctness (audit just completed) | ✗ Ownership (one-time, no ongoing owner) | ✗ Consumable (audit output, not procedure) |
| **Recommendation** | **SPLIT**: (1) **PROMOTE audit procedures to Tier 1** as `production-snapshot-qa-checklist.md` (embedded in qa agent); (2) **ARCHIVE audit results** (May 17 snapshot is now closed; results historical) |
| **Promotion SLA** | 7 days (by 2026-05-25) |
| **Action Items** | (1) Extract audit procedures (consistency checks, diagnostic audit, gate validation, edge cases) as reusable skill, (2) Assign qa owner as maintainer, (3) Wire into qa agent initialization (run on every snapshot), (4) Archive May 17 results as reference |

### Document 5: Hermes Stale Agent Diagnostic Checklist

| Field | Value |
|-------|-------|
| **Title** | Hermes Stale Agent Diagnostic Checklist (May 18) |
| **Size** | ~80 lines |
| **Created** | 2026-05-18 (today) |
| **Last Updated** | 2026-05-18 |
| **Owner** | fleet_steward (agent fleet accountability) |
| **Content** | 6 agents identified as stale post-WSL-shutdown (data_auditor, sentinel, policy_shadow_watch, postmortem, ops_supervisor, grok_biotech_watch); recovery actions (verify lock files, check next scheduled run); expected recovery timeline (May 18 18:00 ET crons should resolve) |
| **Current Usage** | Active (monitoring recovery through 2026-05-19) |
| **Tier 1 Promotion Criteria** | ✗ Durable (specific to May 15 WSL shutdown; won't recur unless same infra issue) | ✓ Unique | ✓ Referenced (fleet_steward tracking) | ✓ Correctness (fresh diagnosis) | ✓ Ownership (clear) | ✓ Consumable |
| **Recommendation** | **TIER 2 (Warm Reference)** — Keep as active reference through recovery (May 18–19); once stale agents recover, archive as incident post-mortem in Failure Pattern Library F-006; do NOT promote to Tier 1 (too specific to one infrastructure event) |
| **Retention SLA** | 3 days (expires 2026-05-21; archive as F-006 incident record) |
| **Action Items** | (1) fleet_steward monitor May 18 18:00 ET cron recovery, (2) Confirm all 6 agents back to OK by May 19 morning, (3) Archive checklist + outcomes in Failure Pattern Library F-006, (4) Document prevention rule in Operational Health Baselines (WSL heartbeat monitoring) |

### Document 6: DEM Compliance Memo + agent-security-posture

| Field | Value |
|-------|-------|
| **Title** | DEM Compliance Memo + Hermes Agent Security Posture |
| **Size** | ~150 lines (memo) + ~120 lines (security audit) |
| **Created** | ~2026-04 |
| **Last Updated** | ~2026-05-10 (8 days; stale) |
| **Owner** | Compliance/security lead (unclear responsibility for ongoing maintenance) |
| **Content** | Data handling policy (what data can agents access); credential management (API keys, auth tokens); audit trail requirements (what actions must be logged); security posture checklist (permissions, access controls, sandboxing) |
| **Current Usage** | Referenced in openclaw-agent-optimize skill (agent configuration); implicit in agent authorization rules |
| **Tier 1 Promotion Criteria** | ✓ Durable (compliance/security stable) | ✓ Unique | ✓ Referenced (agent config) | ✗ Correctness (needs security audit) | ✗ Ownership (unclear; responsibility diluted) | ✓ Consumable |
| **Recommendation** | **PROMOTE to Tier 1** — Upgrade to durable skill `agent-security-and-compliance.md`; assign security owner; quarterly security audit (required by DEM); embed into agent initialization; clarify: "Agents MUST follow Rule {X}: no plaintext secrets, all API calls logged, access restricted to authorized targets" |
| **Promotion SLA** | 21 days (by 2026-06-08) |
| **Action Items** | (1) Security lead audit memo vs actual agent implementation (May 2026 state), (2) File as Tier 1 skill, (3) Define quarterly audit SLA, (4) Add to agent initialization: "Security baseline: {checklist}", (5) Link from Operational Health Baselines (governance tier) |

### Document 7: CCFT-Aware Routing Policy

| Field | Value |
|-------|-------|
| **Title** | CCFT-Aware Routing Policy (7-Tier Message Routing) |
| **Size** | ~200 lines |
| **Created** | ~2026-03 |
| **Last Updated** | ~2026-04-05 (43 days; aging) |
| **Owner** | Architecture lead (unclear if maintaining) |
| **Content** | 7-tier routing classification (urgent escalation → background async → deferred); routing rules per message type (alert → immediate, finding → async, dark matter → escalation); queue depth management (backpressure policy) |
| **Current Usage** | Referenced in Town-Hermes Feedback Protocol (drafted today); implied in ops_supervisor escalation logic |
| **Tier 1 Promotion Criteria** | ✓ Durable (architecture stable, reviewed in Town-Hermes Feedback draft) | ✓ Unique | ✓ Referenced (Feedback Protocol integrates) | ✗ Correctness (needs validation against actual system) | ✗ Ownership (unclear) | ✗ Consumable (document references but not linked) |
| **Recommendation** | **PROMOTE to Tier 1** — Integrate into `town-hermes-feedback-protocol.md` skill (already drafted; just needs explicit routing policy section); assign architecture owner; clarify "W4 note" in Document Lineage Map (this is one of three "tier" systems; CCFT-aware routing is the canonical one; add to governance-glossary) |
| **Promotion SLA** | 7 days (by 2026-05-25) |
| **Action Items** | (1) Validate routing policy against Town-Hermes Feedback Protocol drafted today, (2) Integrate into skill as "Section 2.1: Message Queue Architecture", (3) Define CCFT tiers in governance-glossary (resolve W4 naming collision), (4) Assign architecture owner for quarterly review |

### Document 8: ai-projects Research Digests (7+ files)

| Field | Value |
|-------|-------|
| **Title** | AI Projects Research Digests (7+ files, assorted topics) |
| **Size** | ~1000 lines total |
| **Created** | Various (2026-03 through 2026-05) |
| **Last Updated** | Various (most <30 days old) |
| **Owner** | Research team (loosely; unclear if maintained as corpus) |
| **Content** | AI capability summaries (Claude versions, LLM landscape, multimodal models); agent architecture patterns (specialized vs general-purpose, tool use optimization); prompt engineering lessons (in-context learning, few-shot, retrieval); observability (token usage, latency, error patterns) |
| **Current Usage** | Informational (team reference for agent design decisions); not actively embedded in system |
| **Tier 1 Promotion Criteria** | ✗ Durable (AI landscape changes rapidly; 3-month shelf life) | ✓ Unique (good surveys) | ✗ Referenced (informational, not procedural) | ✓ Correctness (accurate as of creation date) | ✗ Ownership (no active curation) | ✗ Consumable (external context, not system procedure) |
| **Recommendation** | **TIER 2 (Warm Reference)** — Keep indexed as research library; mark with "Last reviewed: {date}" and "Shelf life: 90 days"; deprecate oldest (>6 months) automatically; do NOT promote to Tier 1 (external context, not operational procedure); instead, reference curated summaries in agent initialization ("Agent prompt references: see ai-projects-research/ for LLM capability baseline") |
| **Retention SLA** | 90 days (auto-deprecate files older than 2026-02-18) |
| **Action Items** | (1) Organize research digests into topic categories (models, patterns, observability), (2) Add metadata (created date, last reviewed, author, shelf-life), (3) Update references in agent prompts ("See ai-projects research for context on multimodal capabilities"), (4) Set up quarterly curation (remove outdated, promote high-value summaries to skill layer if generalizable) |

---

## Promotion Pipeline Process

### Phase 1: Quarterly Content Library Audit (Every 3 months: May, Aug, Nov, Feb)

**Timeline**: 2 weeks (first week: inventory; second week: triage + decisions)

**Week 1: Inventory**
1. List all documents in Content Library (shared drives, GitHub, knowledge bases)
2. For each: note created date, last updated date, size, current usage
3. Categorize: actively used vs stale vs historical
4. Identify owners (who maintains? who uses?)

**Week 2: Triage + Decisions**
1. Run promotion criteria against each document (above)
2. For each document, decide: PROMOTE (Tier 1) | RETAIN (Tier 2) | ARCHIVE (Tier 3)
3. For promotions: assign task (skill author, deadline, responsibility)
4. For retentions: confirm owner + usage; set next review date
5. For archives: confirm no active references; move to archive storage
6. Document triage decisions in Content Library Master List (below)

**Week 2 Deliverable**: Content Library Triage Report (CSV + summary memo)

### Phase 2: Promotion Execution (4 weeks after audit decision)

**For each PROMOTE document**:
1. **Author** (assigned skill owner): Distill document into durable skill format
   - Extract operational procedures (remove decision context, keep principles)
   - Add examples tied to current system state
   - Add cross-references to related skills
   - Include maintenance SLA (e.g., "quarterly review" or "per decision audit trail")

2. **Test** (qa owner): Verify skill correctness
   - Manual: expert review against production
   - Automated: test suite if applicable
   - Completeness: any gaps vs original document?

3. **Integrate** (fleet_steward / ops_supervisor): Wire into agent prompts
   - Update agent initialization prompt to reference new skill
   - Test: agent can find and use the skill
   - Verify no duplicate content (skill doesn't conflict with existing docs)

4. **Archive** (documentation steward): Move original document to Tier 3
   - Link from new Tier 1 skill back to archived document (for provenance)
   - Document when/why promoted
   - Keep for audit trail (shows evolution of skill)

5. **Sign-off**: Skill author confirms task complete; signs off in triage report

### Phase 3: Ongoing Maintenance

**For each Tier 2 document**:
- Monthly: Confirm owner is actively maintaining (or mark for deprecation)
- Quarterly: Re-evaluate promotion criteria (move to Tier 1 if fully baked; deprecate if stale)
- Update: "Last reviewed: {date}" metadata

**For each Tier 1 skill**:
- Per maintenance SLA (weekly to quarterly): Owner updates skill
- On change: re-test correctness; update agent prompt if needed
- On deprecation: archive, update references

---

## Content Library Master List

**Format**: CSV with columns: Document Name | Current Tier (1/2/3) | Size | Created | Last Updated | Owner | Usage Status | Next Review | Triage Decision | Promotion Task ID (if applicable)

| Document | Tier | Size | Created | Updated | Owner | Usage | Review | Decision | Task |
|----------|------|------|---------|---------|-------|-------|--------|----------|------|
| Biotech Export Schema Specs | 1 (PENDING) | 410 | 2026-04 | 2026-04-15 | QA | Active | 2026-08 | PROMOTE | T-20260518-001 |
| Ranker Research Prep Pack | 2 | 350 | 2026-05-01 | 2026-05-15 | Ranker lead | Active (deadline 05-22) | 2026-05-31 | RETAIN or DEPRECATE | — |
| CI Fix Checklist | 1 (PENDING) | 50 | 2026-05-18 | 2026-05-18 | ops_supervisor | Active (blocking) | 2026-06 | PROMOTE | T-20260518-002 |
| CI Diagnostic Report | 3 (PENDING) | 200 | 2026-05-18 | 2026-05-18 | ops_supervisor | Reference | 2026-06 | ARCHIVE (incident) | T-20260518-003 |
| Full Sweep Audit (May 17) | 3 (PENDING) | 500 | 2026-05-17 | 2026-05-17 | Audit team | Reference | 2026-06 | ARCHIVE (results only) | T-20260518-004 |
| Snapshot QA Checklist | 1 (PENDING) | 150 | 2026-05-17 | 2026-05-17 | QA | Reference | 2026-06 | PROMOTE (procedures) | T-20260518-005 |
| Stale Agent Recovery Checklist | 2 | 80 | 2026-05-18 | 2026-05-18 | fleet_steward | Active (through 05-19) | 2026-05-21 | ARCHIVE (post-recovery) | — |
| DEM Compliance Memo | 1 (PENDING) | 150 | 2026-04 | 2026-05-10 | Security lead | Referenced | 2026-06 | PROMOTE | T-20260518-006 |
| Agent Security Posture | 1 (PENDING) | 120 | 2026-04 | 2026-05-10 | Security lead | Implicit | 2026-06 | PROMOTE (merge with memo) | T-20260518-006 |
| CCFT Routing Policy | 1 (PENDING) | 200 | 2026-03 | 2026-04-05 | Architecture | Referenced | 2026-06 | PROMOTE (integrate into Feedback Protocol) | T-20260518-007 |
| AI Projects Research Digests | 2 | 1000 | Various (2026-03–05) | Various | Research team | Informational | 2026-08 | RETAIN (curated library) | — |
| (Total Tier 1 pending promotion) | | | | | | | | 6 documents | 7 tasks |

---

## Promotion Tasks (May 18 Triage)

**Open Tasks (due by 2026-06-15 for high-priority; 2026-07-15 for medium)**:

| Task ID | Document | Type | Owner | Deadline | Estimated Effort |
|---------|----------|------|-------|----------|------------------|
| T-20260518-001 | Biotech Export Schema | PROMOTE (new skill) | QA owner | 2026-06-01 | 8 hours (audit + write) |
| T-20260518-002 | CI Fix Checklist | PROMOTE (runbook) | ops_supervisor | 2026-05-19 | 2 hours (extract + integrate) |
| T-20260518-003 | CI Diagnostic Report | ARCHIVE (incident) | ops_supervisor | 2026-05-20 | 0.5 hours (move + link) |
| T-20260518-004 | Full Sweep Audit Results | ARCHIVE (reference) | QA owner | 2026-05-25 | 1 hour (extract procedures + archive results) |
| T-20260518-005 | Snapshot QA Checklist | PROMOTE (procedures) | QA owner | 2026-05-25 | 6 hours (generalize checklist + test) |
| T-20260518-006 | DEM Compliance Memo + Security | PROMOTE (merged skill) | Security lead | 2026-06-08 | 12 hours (audit + write + test) |
| T-20260518-007 | CCFT Routing Policy | PROMOTE (integrate) | Architecture lead | 2026-05-25 | 4 hours (validate + integrate + glossary) |

**Total effort**: ~33 hours; recommended: 1 week with focused team (or distribute across June)

---

## Integration with Other Skills and Processes

- **Document Lineage Map (Skill #3)**: Content Library docs are Tier 2 references; promotion to Tier 1 means doc becomes authoritative source for certain facts
- **Skill Maturity Metadata (Skill #7, not yet drafted)**: Will track when each Tier 1 skill was promoted from Content Library; flag if promotion-source becomes stale
- **Town-Hermes Feedback Protocol (Skill #5)**: Town audit findings (e.g., doc review audit) feed into Content Library audit; Town may recommend promoting certain findings to Tier 1
- **Failure Pattern Library (Skill #2)**: Incident post-mortems (Tier 3) feed into failure patterns; if pattern recurs, escalate for Tier 1 prevention rule

---

## Quarterly Review Cadence

| Quarter | Audit Window | Sign-Off | Key Actions |
|---------|--------------|----------|-------------|
| **Q2 (May–Jun)** | May 18–31 | June 1 | Triage May 18 findings (7 pending tasks); clean up Q1 artifacts (promote/deprecate) |
| **Q3 (Jul–Sep)** | Aug 1–15 | Aug 20 | Promote any H1 research that matured; deprecate time-sensitive items (runbooks, project guides) |
| **Q4 (Oct–Dec)** | Nov 1–15 | Nov 20 | Year-end review; archive all 2026 Q1–Q3 initiatives that are complete; promote durable learnings from year |
| **Q1 (Jan–Mar)** | Feb 1–15 | Feb 20 | H1 2027 planning; update roadmap; identify new Content Library docs to create |

---

## Governance and Approval

**Triage decisions**: Require approval from **ops_supervisor + documentation steward**

**Promotion tasks**: Require sign-off from **skill author (correctness)** + **qa owner (testing)** + **fleet_steward (agent integration)**

**Archival decisions**: Noted in triage report; no explicit approval needed (but link archived doc from Tier 1 for provenance)

---

## Known Gaps and Future Enhancements

1. **Automated content discovery**: Currently manual inventory (find all docs in shared drives, GitHub). Future: web crawler + metadata tagging to auto-detect new documents in Content Library

2. **Promotion checklist automation**: Currently manual skill writing. Future: AI tool to extract key points from document + draft skill outline + request expert review

3. **Freshness tracking**: Tier 2 documents have "shelf life" but no automated expiration. Future: cron job to flag Tier 2 docs >90 days old for review

4. **Cross-references**: When document promoted to Tier 1, need to update all references in other skills. Currently manual. Future: automated link checker to identify orphaned references

5. **Content versioning**: Tier 1 skills may have multiple versions (v1.0 stable, v2.0 in development). Currently no version scheme. Future: semantic versioning for skills with compatibility tracking

6. **Skill decomposition**: Some Tier 1 skills are monolithic (biotech-validation.md is 500+ lines). Future: split large skills into sub-modules with clear ownership

---

## Suggested Next Steps

1. **Immediate (May 18–19)**:
   - Acknowledge triage decisions for 8 Content Library documents (above)
   - Assign task owners for 7 promotion tasks
   - Set team calendar for May 22 deadline (Ranker Research Prep Pack) + May 25–Jun 1 promotion sprint

2. **Short-term (May 19–June 1)**:
   - Execute T-20260518-002 (CI Fix Checklist) by 2026-05-19 (blocking issue)
   - Execute T-20260518-003, T-20260518-004, T-20260518-007 by 2026-05-25 (quick wins)
   - Start T-20260518-001, T-20260518-005, T-20260518-006 (longer lead time; target 2026-06-08)

3. **Medium-term (June 1–15)**:
   - Promotion sprint: complete all 7 tasks
   - Final sign-off: skill authors + QA + fleet_steward
   - Archive originals; link from new Tier 1 skills
   - Update Content Library Master List with promotion results

4. **Long-term (June 15+)**:
   - Establish quarterly audit cadence (next: August 1–15)
   - Maintain Tier 2 documents (monthly confirmation of ownership + usage)
   - Monitor newly promoted skills (first month post-promotion: daily check-in; then stabilize to maintenance cadence)

---

## Appendix: Promotion Task Template

**Use this template for each T-XXXXXX-NNN task**:

```markdown
# Promotion Task T-XXXXXX-NNN: {Document Name}

## Metadata
- Original Document: {filename, location}
- Decision: {PROMOTE to Tier 1 / ARCHIVE / DEPRECATE}
- Assigned To: {skill author}
- Deadline: {date}
- Estimated Effort: {hours}

## What to Do

### Step 1: Distill to Skill Format
- Extract key operational procedures / principles
- Remove decision context; keep rationale
- Add current system examples (from May 2026 state)
- Add cross-references to related skills
- Target length: <500 lines

### Step 2: Test Correctness
- [ ] Manual expert review (vs production)
- [ ] Automated test suite (if applicable)
- [ ] Completeness check (coverage vs original doc)

### Step 3: Integrate
- [ ] Update agent prompt to reference new skill
- [ ] Verify agent can find and use
- [ ] Check for conflicts with existing docs

### Step 4: Archive Original
- [ ] Move original document to Tier 3 storage
- [ ] Add link from new skill back to archive (provenance)
- [ ] Document promotion in Content Library Master List

## Acceptance Criteria
- [ ] Skill author sign-off (correctness verified)
- [ ] QA sign-off (testing complete)
- [ ] fleet_steward sign-off (agent integration verified)
- [ ] Original document archived + linked
- [ ] Content Library Master List updated

## Status
- [ ] Not started
- [ ] In progress (as of {date})
- [ ] Complete (sign-off by {date})
- [ ] Deferred (reason: {})
```

