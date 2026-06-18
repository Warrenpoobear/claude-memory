# Skill: Skill Maturity Metadata and Freshness Tracking

**Status:** DRAFT  
**Last Reviewed:** 2026-05-18  
**Maintainer:** Hermes Operations Layer  
**Scope:** Hermes Agent Skills Lifecycle  

---

## Purpose

Track **maturity state** of each Hermes skill (14 core skills + 6 meta-skills drafted May 18) so Hermes agents can:

1. **Know which skills are fresh** — Which skill can I trust as current? Which is stale?
2. **Prioritize maintenance** — Which skills need review/update soonest?
3. **Identify blockers** — Which stale skills are blocking other systems?
4. **Understand dependencies** — If Skill X is stale, which downstream skills are affected?

**Motivation**: The doc review audit (May 2026) noted skills with varying recency ("Last reviewed: 2026-05-08" vs "Last reviewed: 2026-05-01" with no SLA). Without metadata, Hermes cannot distinguish "intentionally stable" from "forgotten."

---

## Metadata Schema

**Add frontmatter to every Hermes skill** (in addition to existing status/date/scope):

```yaml
---
# Core identity
name: {skill-slug}
description: {one-line purpose}
type: {core | operational | meta | research}  # See types below

# Metadata
last_reviewed: {YYYY-MM-DD}
last_substantive_change: {YYYY-MM-DD}
refresh_sla_days: {N}  # How often should this be reviewed?
maturity: {fresh | aging | stale | critical}  # Auto-calculated from dates

# Dependencies and impact
downstream_dependencies: [skill-name-1, skill-name-2, ...]  # Which skills reference this?
blocking_systems: [system-name-1, ...]  # Which operational systems depend on this?
known_open_issues: [issue-1, issue-2, ...]  # What needs fixing?
owner: {name or role}  # Who maintains this skill?

# Promotion tracking (for skills promoted from Content Library)
promoted_from: {document-name}  # If from Content Library
promoted_date: {YYYY-MM-DD}
promotion_task_id: {T-XXXXXX-NNN}

# Version and change tracking
version: {N.M}  # Semantic versioning if applicable
last_commit: {git-hash}  # Last commit that touched this skill
related_specs: [spec-name-1, spec-name-2, ...]  # GitHub specs this skill documents

---

{skill content}
```

---

## Skill Types and SLA

### Type 1: Core Operational Skills

**Definition**: Skill documents critical production procedures that operators need daily.

**Examples** (May 18 state):
- biotech-validation.md (Module 1–3 rules)
- financial-health.md (Module 2 gates)
- selector-ranker.md (selector + ranker logic)
- institutional-signal.md (coinvest_score_z)

**Refresh SLA**: 14 days (review every 2 weeks; updated immediately if code changes)

**Maturity states**:
- **Fresh**: Last reviewed ≤14 days ago; no open issues; all procedures tested
- **Aging**: 14–28 days stale; minor issues known but not blocking; scheduled for next review
- **Stale**: 28–42 days stale; open issues or known divergence from code; escalate to owner
- **Critical**: >42 days stale; blocking operational decisions; escalate to ops_supervisor immediately

---

### Type 2: Operational Reference Skills

**Definition**: Skill documents procedures/guidelines for ongoing operations but not core production logic.

**Examples** (May 18 state):
- Operational Health Baselines (SLA framework)
- Failure Pattern Library (error catalog)
- Document Lineage Map (fact authority)
- Decision Audit Trail (parameter rationale)

**Refresh SLA**: 30 days (review monthly; updated as needed)

**Maturity states**:
- **Fresh**: Last reviewed ≤30 days ago; operational state current; no blockers
- **Aging**: 30–60 days stale; minor updates pending; not critical
- **Stale**: 60–90 days stale; operational state may be outdated; escalate to owner
- **Critical**: >90 days stale; escalate to ops_supervisor

---

### Type 3: Meta-Skills (Governance & Self-Improvement)

**Definition**: Skill documents governance, decision-making, and learning frameworks.

**Examples** (May 18 state):
- Town-Hermes Feedback Protocol (bidirectional routing)
- Content Library Promotion Pipeline (knowledge lifecycle)
- Skill Maturity Metadata (this skill!)
- Self-Improving Skill (Rule 1: pattern promotion logic)
- Memory-Steward (dual-storage reconciliation)

**Refresh SLA**: 60 days (review quarterly; updated per governance decision)

**Maturity states**:
- **Fresh**: Last reviewed ≤60 days ago; governance policies current; no contradictions
- **Aging**: 60–120 days stale; minor drift from operationalized procedures; scheduled for quarterly audit
- **Stale**: 120–180 days stale; policies may not match actual behavior; escalate
- **Critical**: >180 days stale; governance layer outdated; escalate to ops_supervisor + Town strategist

---

### Type 4: Research Skills (Experimental / Blocked)

**Definition**: Skill documents ongoing or deferred research that may become operational.

**Examples** (May 18 state):
- Spec 072 vNext (diagnostic-only redesign; promotion blocked)
- Spec 089 KG Ranker Governance (design locked, implementation deferred pending 13F refresh)
- Ranking Alternatives Research (Spec 036 follow-up; frozen per alpha freeze)

**Refresh SLA**: 90 days (or when blocker resolves)

**Maturity states**:
- **Fresh**: Active research; last updated <30 days; progress toward decision gate
- **Aging**: On hold, last reviewed 30–90 days; awaiting external gate (e.g., 13F refresh)
- **Stale**: Deferred >90 days; blocker status unchanged; re-evaluate if research still relevant
- **Critical**: Deferred >180 days; blocker hasn't moved; escalate for prioritization decision

---

## Current Skill Inventory (May 18, 2026)

### Core Operational Skills

| Skill | Owner | Last Reviewed | SLA | Days Stale | Status | Issues |
|-------|-------|---------------|----|------------|--------|--------|
| biotech-validation | Module 1/3 owner | 2026-05-16 | 14 days | 2 | FRESH | None |
| financial-health | Module 2 owner | 2026-05-16 | 14 days | 2 | FRESH | None |
| selector-ranker | Ranker owner | 2026-05-08 | 14 days | 10 | AGING | Dead lanes need update (Spec 036 post-mortem) |
| institutional-signal | Coinvest owner | 2026-05-08 | 14 days | 10 | AGING | inst_delta_z demotion (2026-05-04) documented; review trigger May 26 |

**Subtotal Core**: 4 skills, avg age 6 days, all FRESH/AGING

---

### Operational Reference Skills

| Skill | Owner | Last Reviewed | SLA | Days Stale | Status | Issues |
|-------|-------|---------------|----|------------|--------|--------|
| Operational Health Baselines | fleet_steward | 2026-05-18 | 30 days | 0 | FRESH | 4 CRITICAL alerts active (Herald, PDUFA, CI, Bellringer) |
| Failure Pattern Library | ops_supervisor | 2026-05-18 | 30 days | 0 | FRESH | 2 unresolved failures (F-011, F-012) escalated; monitoring |
| Document Lineage Map | ops_supervisor | 2026-05-18 | 30 days | 0 | FRESH | 4 drift issues active (B6 weights, agent count, tier defs); reconciliation SLA 7d |
| Decision Audit Trail | ops_supervisor | 2026-05-18 | 30 days | 0 | FRESH | 6 active decisions; inst_delta review trigger May 26; clinical shadow verdict May 26 |

**Subtotal Operational Reference**: 4 skills (drafted 2026-05-18), all FRESH

---

### Meta-Skills (Governance & Self-Improvement)

| Skill | Owner | Last Reviewed | SLA | Days Stale | Status | Issues |
|-------|-------|---------------|----|------------|--------|--------|
| Town-Hermes Feedback Protocol | ops_supervisor | 2026-05-18 | 60 days | 0 | FRESH | Phase 1 rollout pending (start May 20, weekly sync) |
| Content Library Promotion Pipeline | doc steward | 2026-05-18 | 60 days | 0 | FRESH | 7 promotion tasks pending (33h effort); deadline 2026-06-15 |
| Skill Maturity Metadata | fleet_steward | 2026-05-18 | 60 days | 0 | FRESH | Freshness check cron TBD; integration pending |
| Self-Improving Skill (Rule 1) | ops_supervisor | 2026-05-09 | 60 days | 9 | FRESH | References 3x recurrence promotion; Failure Pattern Library implements |
| Memory-Steward | ops_supervisor | 2026-05-09 | 60 days | 9 | FRESH | Dual-storage reconciliation; Town-Hermes Feedback Protocol implements |

**Subtotal Meta**: 5 skills, all FRESH (drafted/affirmed late May 2026)

---

### Research Skills (Experimental / Deferred)

| Skill | Status | Last Reviewed | SLA | Blocker | Review Trigger |
|-------|--------|---------------|----|---------|----------------|
| Spec 072 vNext (diagnostic-only redesign) | SHADOW_ONLY | 2026-05-04 | 90 days | Alpha freeze + Spec 089 KG (not yet built) | Post-KG-completion (2026-06+ estimate) |
| Spec 089 KG Ranker Governance (design locked, impl. deferred) | DEFERRED | 2026-05-15 | 90 days | 13F cohort refresh (Jaccard ≥0.70); est. 2026-05-23 | 13F refresh completion (~2026-05-26) |
| Ranking Alternatives (Spec 036 follow-up) | FROZEN | 2026-05-08 | 90 days | Alpha freeze (locked until Checklist v2) | Post-alpha-freeze decision (2026-06+) |
| EES v3 Promotion Battery (Spec 064) | CLOSED | 2026-04-30 | — | Formulation invalid (structural failure) | Archive only (no reactivation planned) |

**Subtotal Research**: 4 skills, 2–3 actively deferred, 1 closed

---

## Automated Freshness Check

**Pseudocode for weekly cron job** (runs Monday 08:00 ET):

```bash
#!/bin/bash
# Hermes Skill Freshness Monitor

for skill in hermes_skills/*.md; do
  name=$(basename "$skill" .md)
  last_reviewed=$(grep "^last_reviewed:" "$skill" | awk '{print $2}')
  refresh_sla=$(grep "^refresh_sla_days:" "$skill" | awk '{print $2}')
  
  days_stale=$(( ($(date +%s) - $(date -d "$last_reviewed" +%s)) / 86400 ))
  maturity=""
  
  if [ $days_stale -le $refresh_sla ]; then
    maturity="FRESH"
  elif [ $days_stale -le $((refresh_sla * 2)) ]; then
    maturity="AGING"
  elif [ $days_stale -le $((refresh_sla * 3)) ]; then
    maturity="STALE"
  else
    maturity="CRITICAL"
  fi
  
  echo "$name | last_reviewed=$last_reviewed | stale_days=$days_stale | SLA=$refresh_sla | status=$maturity"
  
  if [ "$maturity" = "STALE" ] || [ "$maturity" = "CRITICAL" ]; then
    owner=$(grep "^owner:" "$skill" | awk '{print $2}')
    echo "ESCALATE: $name ($maturity after $days_stale days). Owner: $owner"
  fi
done
```

**Output**: Freshness report (CSV + summary); escalations list

**Action**:
- FRESH/AGING: no action
- STALE: notify owner "Your skill is $N days over SLA. Review and update by {deadline}."
- CRITICAL: escalate to ops_supervisor "Skill $name is CRITICAL ($N days stale). Requires immediate attention."

---

## Integration with Review Cycles

### Weekly Check (Monday 08:00 ET)

- Run automated freshness check (above)
- Generate report: "{M} skills FRESH, {N} aging, {K} stale, {J} critical"
- Escalate any CRITICAL to owner + ops_supervisor

### Monthly Review (1st of month, 10:00 ET)

- ops_supervisor reviews all STALE skills
- For each: decide: (a) Update immediately, (b) Defer + note reason, (c) Archive (if superseded)
- Update last_reviewed date + metadata
- Document any ownership changes

### Quarterly Audit (Every 3 months: May, Aug, Nov, Feb)

- Comprehensive skill health assessment
- Check: any skills approaching deprecation? (e.g., research skills >180d deferred)
- Re-evaluate SLA for each skill (still appropriate?)
- Identify skills ready for promotion/archival
- Link to Content Library Promotion Pipeline audit

---

## Known Open Issues (Per Skill)

**May 18 snapshot**:

| Skill | Issue | Severity | Owner | Target Fix |
|-------|-------|----------|-------|-----------|
| **selector-ranker** | Dead lanes table needs Spec 036 post-mortem update | MEDIUM | Ranker owner | 2026-05-25 |
| **institutional-signal** | inst_delta_z demotion decision impact to be determined (review trigger 2026-05-26) | HIGH | Coinvest owner | 2026-05-26 (forward shadow verdict) |
| **Operational Health Baselines** | 4 CRITICAL alerts active (Herald DARK, PDUFA DARK, CI red, Bellringer degraded) | **CRITICAL** | ops_supervisor | Daily escalation check; target 2026-05-19 resolution |
| **Failure Pattern Library** | F-011 (Herald DARK) and F-012 (PDUFA DARK) unresolved; escalated to ops_supervisor | **CRITICAL** | ops_supervisor | Same-day investigation; 24h SLA |
| **Document Lineage Map** | 4 drift issues (B6 weights, agent count, tier defs); need weekly sync + 7d reconciliation | MEDIUM | ops_supervisor | Weekly starting 2026-05-20 |
| **Decision Audit Trail** | Review triggers on 3 decisions firing 2026-05-26 (13F refresh, clinical shadow, inst_delta forward shadow) | HIGH | ops_supervisor | Prepare decision memos by 2026-05-26 |
| **Content Library Promotion Pipeline** | 7 promotion tasks (33h effort) pending; 2 urgent (CI checklist, CI diagnostic) | HIGH | doc steward + task owners | CI tasks by 2026-05-19; others by 2026-06-15 |
| **Skill Maturity Metadata** | Freshness check cron not yet wired; integration into fleet_steward agent pending | MEDIUM | fleet_steward | By 2026-05-25 |

---

## Skill Dependency Graph

**Which skills block which systems?**

```
Core Production:
  biotech-validation ────→ Module 1 universe loading ────→ Snapshot
  financial-health  ────→ Module 2 gates ────────────────→ Snapshot
  selector-ranker   ────→ Module 3/4 selection/ranking ──→ Snapshot
  institutional-sig ────→ Module 4 scoring ──────────────→ Snapshot

Governance:
  Decision Audit Trail ──→ All parameter decisions ──────→ Production
  Failure Pattern Lib ───→ Error recognition/prevention ─→ Escalation paths
  Document Lineage Map ──→ Fact authority/reconciliation → All skills
  Operational Health BSL → SLA monitoring/escalation ────→ All systems

Feedback & Learning:
  Town-Hermes Protocol ──→ Bidirectional updates ────────→ Agent prompts
  Content Library Pipeline → Knowledge promotion ────────→ Tier 1 skills
  Skill Maturity Meta ───→ Freshness tracking ──────────→ Maintenance scheduling

Blocking Dependencies:
  Spec 089 KG (deferred) ← blocked by 13F refresh ────→ Ranker research
  Alpha Freeze (2026-04-19) ← blocks new signal promotions → All ranker work
```

**Critical path**: If Operational Health Baselines, Failure Pattern Library, or Decision Audit Trail go STALE → cascading impact on all downstream systems (escalations, decisions, error handling).

---

## Suggested Next Steps

1. **Immediate (May 18–19)**:
   - Add metadata frontmatter to all 13 existing Hermes skills (May 2026 state)
   - Add metadata to 6 new meta-skills (drafted May 18)
   - Verify all ownership assignments

2. **Short-term (May 19–25)**:
   - Implement freshness check cron job (target: Monday 08:00 ET, May 20)
   - Wire into fleet_steward agent prompt: "Review skill freshness report weekly; escalate any CRITICAL"
   - Execute urgent Content Library promotion tasks (CI checklist, diagnostic)

3. **Medium-term (May 25–June 1)**:
   - First monthly review (June 1): confirm all STALE skills updated or deferred
   - Implement skill maturity dashboard (optional: GitHub project board or metrics dashboard)
   - Reconcile skill metadata with Decision Audit Trail + Failure Pattern Library (cross-references)

4. **Integration with Full Stack**:
   - Skill maturity feeds into quarterly Content Library audit (promote mature research, archive stale)
   - Skill SLA breaches trigger escalations in Operational Health Baselines
   - Known open issues tracked in Failure Pattern Library + Decision Audit Trail
   - Skill dependencies documented in this metadata; inform prioritization in quarterly planning

---

## Example: Using Skill Metadata for Proactive Maintenance

**Scenario (May 25, 2026)**:

```
fleet_steward (Monday 08:00 ET freshness check):
  - selector-ranker.md: 17 days stale (SLA 14 days) → AGING
  - institutional-signal.md: 17 days stale (SLA 14 days) → AGING
  - Check open issues:
    - selector-ranker: "Dead lanes need Spec 036 post-mortem" (Medium, target 2026-05-25)
    - institutional-signal: "inst_delta review trigger 2026-05-26" (High, decision pending)
  
  ESCALATION: ops_supervisor
    "selector-ranker skill is AGING (17 days); open issue 'Dead lanes update' due TODAY (2026-05-25).
     institutional-signal skill is AGING; open issue 'inst_delta review trigger' TOMORROW (2026-05-26).
     Both skills impact ranker production logic. Recommend immediate owner follow-up."

ops_supervisor (receives alert):
  - Checks selector-ranker last_substantive_change: 2026-05-08 (Spec 036 research completion)
  - Sees open issue "needs post-mortem"
  - Decision Audit Trail shows Decision 2026-04-06 (ranker v2 locked per alpha freeze)
  - Failure Pattern Library shows F-009 (Spec 100 IC scope fix) related to ranker trust
  
  ACTION: Update selector-ranker.md with:
    - Spec 036 dead lanes learning (extracted from research report)
    - Link to Spec 100 IC scope gap (affects ranker IC evidence)
    - Confirm ranker is locked per alpha freeze until Checklist v2
    - Update last_reviewed = 2026-05-25, last_substantive_change = 2026-05-25
    - Mark open issue RESOLVED

fleet_steward (next week, May 27):
  - Re-runs freshness check
  - selector-ranker now FRESH (reviewed 2026-05-25, 2 days ago)
  - institutional-signal decision review completed (2026-05-26 inst_delta verdict ready)
  - Both skills healthy again
```

---

## Known Limitations

| Limitation | Impact | Mitigation |
|-----------|--------|-----------|
| **Metadata drift** | last_reviewed date goes stale if not auto-updated | Use commit hooks to auto-update date on edits; manual confirmation weekly |
| **SLA subjectivity** | Different skill types need different SLAs; hard to standardize | Documented 4 skill types with explicit SLAs above; adjust per quarterly audit if needed |
| **Ownership changes** | Skill orphaned if owner leaves; metadata not updated | Monthly audit confirms all skills have named owner; escalate orphans to ops_supervisor |
| **No automated fixing** | Freshness check identifies stale skills but doesn't fix them | Check is notification only; owner must update skill (prevents stale auto-rewrites) |
| **Cross-skill dependencies** | Skill A references skill B; if B stale, A may be unreliable | Dependency graph (above) documents critical paths; weekly check flags chains of AGING/STALE |

---

## Appendix: Metadata Frontmatter Template

```yaml
---
# Core identity
name: {skill-slug}
description: {one-line purpose}
type: {core | operational | meta | research}

# Maturity
last_reviewed: {YYYY-MM-DD}
last_substantive_change: {YYYY-MM-DD}
refresh_sla_days: {14|30|60|90}
maturity: {fresh | aging | stale | critical}  # Auto-calculated

# Dependencies
downstream_dependencies: [{skill-name}, ...]
blocking_systems: [{system-name}, ...]
known_open_issues: [{issue-1}, {issue-2}, ...]
owner: {name or role}

# Promotion (if from Content Library)
promoted_from: {document-name}
promoted_date: {YYYY-MM-DD}
promotion_task_id: {T-XXXXXX-NNN}

# Version & history
version: {N.M}
last_commit: {git-hash}
related_specs: [{spec-name}, ...]

---

{skill content}
```

