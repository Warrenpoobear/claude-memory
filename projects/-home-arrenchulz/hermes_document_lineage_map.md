# Skill: Document Lineage Map and Fact Authority Framework

**Status:** DRAFT  
**Last Reviewed:** 2026-05-18  
**Maintainer:** Hermes Operations Layer + Governance  
**Scope:** Biotech Screener Production System  

---

## Purpose

Establish a dependency graph of all documents, code, and artifacts used by Hermes agents so that:

1. **Agents know which document to trust** — When encountering a fact (agent count, selector weights, feature list), agents consult this map to find the authoritative source
2. **Sync gaps are detected and tracked** — For each fact, record when it was last verified against production; flag if drift detected
3. **Updates propagate consistently** — When a fact changes (code update, governance decision, feature addition), document owners know which downstream documents need refresh
4. **Contradictions are visible** — If two documents claim different values for the same fact, this map highlights the contradiction and names the owner responsible for resolving it

The Failure Pattern Library already identified three instances of this problem:
- **F-003**: B6 weights (65/35 vs 100% coinvest) — doc and code disagree
- **F-005**: Tier numbering (three distinct systems) — no cross-reference
- **C6 (audit finding)**: Agent count (17, 26, 27, 28, 30 across docs) — no single source of truth

This skill prevents those failures from recurring.

---

## Core Concept: The Fact Authority Model

**A "fact" is any statement about the system that appears in multiple documents.**

Examples of facts:
- Agent count (how many in the Hermes fleet?)
- Selector weights (what are the feature weights?)
- B6 construction (coinvest_score_z weight)
- Financial score formula (Module 5 calculation)
- PIT delist buffer (45 days)
- Max holdings (30 or 35?)
- Tier 1 / Tier 2 / Tier 3 definitions
- Gate thresholds (penny stock gate = $5.00)
- IC evidence requirements (Checklist v2 criteria)
- Snapshot format (which files are mandatory?)

**Each fact has three attributes:**

1. **Authoritative Source**: The single document/code that is the source of truth
2. **Downstream References**: All documents that cite or depend on this fact
3. **Sync State**: Last verified against source; any drift detected?

---

## Document Dependency Graph

**Tier 0 (Authority Layer)** — Single source of truth:

```
production_code/
├── run_screen.py (scoring modules 1–5 logic)
├── screener_selector.py (selector gate logic)
├── screener_ranker.py (ranker feature logic)
└── production_data/
    ├── ranker_v2_model.json (current weights, thresholds)
    ├── universe.json (holdings universe)
    └── ipo_dates.json (delist tracking)

GitHub Repo (Code + Specs):
├── specs/changes/spec_*.md (feature design, decision rationale)
├── docs/governance/*.md (governance policy, decision audit trail)
├── docs/architecture/ (system design, routing)
├── .gitignore (artifact exclusion policy)
└── tests/ (test suite, validation logic)

Biotech Screener Agent Specs ("Warm" Skills):
├── skills/biotech-validation.md (Module 1-3 validation rules)
├── skills/financial-health.md (Module 2 financial gates)
├── skills/selector-ranker.md (selector + ranker logic + dead lanes table)
├── skills/institutional-signal.md (coinvest_score_z + inst_delta tracking)
└── skills/... (14 total skills as of May 18)
```

**Tier 1 (Derived, Upstream)** — Direct downstream of production code:

```
GitHub Docs:
├── docs/architecture/model_documentation_root.md (summary of scoring, gates, ranker)
├── docs/ranker_v2_architecture.md (ranker design; links to ranker_v2_model.json)
└── docs/governance/signal_research_history.md (IC evidence, field definitions)

Hermes Memory Files (~50 total as of May 18):
├── MEMORY.md (index of all memories, <200 lines)
├── {memory-type}_{topic}_{date}.md (individual memories)
└── memory_graph.json (graph of memory interdependencies)
```

**Tier 2 (Downstream, External)** — Derived from Tier 0 + Tier 1:

```
Executive Communications:
├── .docx files (quarterly reports, executive overviews)
├── Investor decks (hypothesis statements, strategy slides)
└── Weekly memos (operational status, decision summaries)

Governance Artifacts:
├── Policy documents (compliance, decision audit trail)
├── Governance ledger (approval history)
└── Glossary (terminology + definitions)

Training / Onboarding:
├── Hermes agent initialization prompts (encoded in agent skills)
├── New-agent runbooks (how to operate the system)
└── FAQ / troubleshooting guides
```

**Tier 3 (Dead-End, Archive)** — Not actively maintained:

```
├── Old backtests / reports (historical reference only)
├── Deprecated spec documents
├── Archived decision logs (>90 days old)
└── Prior ranker versions (ranker_v1.*, superseded by v2)
```

---

## Fact Authority Table

**Template**: For each fact, document the authoritative source, downstream references, last verified date, and sync state.

| Fact | Category | Authoritative Source | Downstream References | Last Verified | Drift Detected? | Verification SLA | Owner |
|------|----------|---------------------|----------------------|---------------|-----------------|--------------------|-------|
| **Agent Count** | Fleet | `openclaw doctor` (current fleet state); `agents.list[].id` in openclaw.json | MEMORY.md (max 200 lines, lists all 18 agents); Weekly fleet report; Exec memo; .docx | 2026-05-18 | YES (17 vs 26 vs 27 vs 28 vs 30) | Every cron agent change (immediate) | fleet_steward |
| **B6 Weights** | Ranker | `ranker_v2_model.json` (primary); run_screen.py line ~9400 (code verification) | selector-ranker.md (doc says 65/35 coinvest/inst_delta but see F-003); .docx (quarterly report); Investor deck | 2026-05-04 | YES (docs say 65/35; code is 100% coinvest since May 4 demotion) | Every ranker weight change (immediate) | ops_supervisor |
| **Financial Score Formula** | Scoring | run_screen.py Module 5 (rank_norm of raw M2 output) | financial-health.md (skill); selector-ranker.md (references financial block); Architecture docs | 2026-05-15 | NO | Weekly code audit | Module 5 owner |
| **PIT Delist Buffer** | Survivorship | run_screen.py line ~9340 (hardcoded 45 days) | institutional-signal.md (documents buffer + rationale); Comments in code; Test fixtures | 2026-05-18 | NO | Annual policy review or when PIT policy changes | ops_supervisor |
| **Max Holdings Count (K)** | Construction | ranker_v2_model.json (K=30, in "top_n_selection" field); selector-ranker.md documents K=30 + PIT sweep validation | Architecture docs; Exec memos; Training runbooks | 2026-05-08 | NO (pending K validation sweep; currently scheduled 2026-05-22) | On next ranker research; then annual | data_auditor / selector owner |
| **Selector Gate Thresholds** | Gating | screener_selector.py (source code: Gate 1 $5.00 penny stock, Gate 2 market cap thresholds, Gate 3 liquidity, etc.) | financial-health.md (skill; rationale for thresholds) | 2026-04-25 | NO | Annual; or on gate change SLA = same-day commit + doc update | Module 3 owner |
| **Snapshot Mandatory Files** | Output | run_screen.py (produces rankings.csv, decision_portfolio.csv, diagnostics/, screen_output.json; see Operational Health Baselines) | biotech-validation.md (skill); Spec 102/104/105 (closed specs); Test suite assertions | 2026-05-14 | NO | On spec change; test validation continuous | qa owner |
| **Tier 1 / Tier 2 / Tier 3 Investor Definitions** | Governance | Three distinct "tier" systems in governance docs (investor AUM tiers, signal quality tiers, operational risk tiers); no single authoritative source | governance-glossary.md (TBD; not yet created); See F-005 in Failure Pattern Library | Never (no authoritative source exists) | **CRITICAL** (3 systems, no cross-ref) | Immediate (create glossary + define) | ops_supervisor |
| **Hermes Agent List** | Fleet | `agents.list[]` in ~/.openclaw/openclaw.json (source of truth for OpenClaw); also `openclaw agents list --json` output | MEMORY.md (indexed list; may lag); Fleet status report; Training docs | 2026-05-18 | NO (both sources in sync) | Every agent add/remove (immediate) | fleet_steward |
| **IC Evidence Requirements** | Governance | governance_ic_evidence_hold.md (memory; spec 095 audit scope, Checklist v2 requirements); policy_alpha_freeze_2026_04_04.md (freeze policy) | All ranker research specs (091–099); training prompts | 2026-05-13 | NO | On IC policy change (rare) | ops_supervisor |
| **Spec Status (Spec 089 blocked on 13F refresh)** | Planning | 13f_q1_2026_monitoring_live_2026_05_15.md (memory; current quarantine state); 13f_refresh_runbook.md (gate criteria) | Operational Closure (2026-05-15); Weekly plan; Exec memo | 2026-05-18 | NO | Daily (quarantine gate is time-sensitive) | ops_supervisor |
| **Financial Score Module Max Value** | Scoring | run_screen.py Module 5 (rank_norm of M2; ceiling 100.0 as of fix 3ad7b904) | financial-health.md (skill; now says "max 100.0"); Architecture docs | 2026-05-17 | NO (post-fix) | On Module 5 change | Module 5 owner |
| **Catalyst Event Definitions (Spec 073)** | Scoring | Spec 073 (spec document, GitHub); catalyst_phase_a_verdict_2026_05_04.md (memory; explains blocker: EV field mismatch) | catalyst_delta.md (skill; references Spec 073) | 2026-05-06 | NO (but Spec 073 implementation blocked pending EV binder fix, Spec 077) | On Spec 073/077 update | Spec owner |
| **Selector vs Gating Terminology** | Terminology | GitHub code + specs define "selector" as L1 filter; gating as L2 thresholds. governance-glossary.md (TBD) should define. | selector-ranker.md (uses both terms); governance docs; See F-005 | Never formalized | **MEDIUM** (terms used inconsistently) | Immediate (add to glossary) | ops_supervisor |
| **Snapshot Create Time SLA** | Operations | Operational Health Baselines skill (Tier 1, just drafted): "by 11:30 ET" | Fleet status report; Weekly ops memo; Data auditor SLA check | 2026-05-18 | NO | Weekly SLA audit (per Operational Health Baselines) | fleet_steward |
| **AACT Trial Record Age Tolerance** | Data Freshness | Operational Health Baselines skill (Tier 1): "≤3 days old"; Failure Pattern Library (F-001 prevention rule): "refresh daily" | Data auditor checks; Production validation | 2026-05-18 | NO | Daily validation (per Data Auditor SLA) | data_auditor |

---

## Sync State Dashboard

**Current state (2026-05-18):**

| Fact | Source | Downstream Doc | Last Verified | Drift? | Action Required |
|------|--------|-----------------|---------------|---------|--------------------|
| B6 Weights | ranker_v2_model.json (100% coinvest) | .docx (says 65/35) | 2026-05-04 | **YES** | Update .docx immediately; create doc refresh policy (F-003) |
| Agent Count | openclaw.json (18 agents) | MEMORY.md (lists all 18; up-to-date) | 2026-05-18 | NO | Continue monitoring |
| Agent Count | openclaw.json (18 agents) | .docx exec memo (says "26–30 agents") | 2026-04-15 | **YES** | Update .docx; flag for May 22 refresh cycle |
| Tier Definitions | Governance docs (3 systems, no canonical) | Governance policy docs | Never | **CRITICAL** | Create governance-glossary.md; standardize terms |
| Financial Score Max | run_screen.py Module 5 (100.0 as of commit 3ad7b904) | financial-health.md (updated post-fix) | 2026-05-17 | NO | Continue monitoring |
| Selector Gates | screener_selector.py (source code) | financial-health.md (skill, explains rationale) | 2026-04-25 | NO | Review annually |
| Snapshot Cadence SLA | Operational Health Baselines (by 11:30 ET daily) | Data auditor (validates) | 2026-05-18 | NO | Monitor via SLA checks |
| AACT Freshness | Operational Health Baselines (≤3 days) | Data auditor (validates) | 2026-05-18 | NO | Monitor daily |
| PIT Delist Buffer | run_screen.py (45 days, line ~9340) | institutional-signal.md | 2026-05-18 | NO | Review on policy change |

---

## Document Update and Refresh Process

### When Source Changes (Tier 0 → Tier 1)

**Trigger**: Code change, spec approval, or policy decision.

**Process**:

1. **Source Update** (owner of changed code/spec)
   - Update GitHub repo file (code or spec_*.md)
   - Add comment linking to related failure pattern or governance decision
   - If fact changes, update fact authority table (above) with new source value

2. **Dependency Audit** (within 24h)
   - Run dependency check: "Which Tier 1 + Tier 2 docs reference this fact?"
   - Hermes agent or human scans Fact Authority Table for downstream references
   - Example: If ranker weights change, scan for {selector-ranker.md, Architecture docs, .docx files}

3. **Downstream Refresh** (Tier 1 → Tier 2)
   - Update all Tier 1 docs (skills, architecture docs, governance docs) within 24h
   - Update Fact Authority Table: set "Last Verified" to today, "Drift Detected?" = NO
   - Tag commit: `[DOCS-SYNC-REQUIRED]` if downstream .docx refresh needed

4. **Schedule Downstream Tier 2 Refresh**
   - .docx files: schedule refresh within 1 week (quarterly cycle preferred)
   - Exec memos: update in next weekly memo (target: Friday)
   - Training/runbooks: update within 2 weeks or on next agent deployment

5. **Verification**
   - Owner of fact confirms: "I have checked Tier 1 docs and found no drift"
   - Automation: Run linter that scans Fact Authority Table and checks "Last Verified" date; flag if >7 days old without update

### When Drift Detected

**Trigger**: Auditor or agent notices fact in document A contradicts fact in document B.

**Process**:

1. **Document Contradiction** in Fact Authority Table (mark Drift = YES)
2. **Escalate** to fact owner: "B6 weights drift detected: ranker_v2_model.json says 100% coinvest, .docx says 65/35. Which is authoritative?"
3. **Owner decides**: Is this old documentation lagging (docs need refresh), or code bug (code needs fix)?
4. **Execute fix**:
   - If docs lagging: update docs, set Last Verified = today, Drift = NO
   - If code bug: fix code, update code comment with rationale, follow "When Source Changes" process
5. **Log in Failure Pattern Library**: If drift persists >7 days, log as F-XXX (doc sync gap), escalate

---

## Authority Hierarchy for Disputed Facts

**When two documents claim different values, use this priority order:**

1. **Production Code** (run_screen.py, screener_*.py, ranker_v2_model.json)
   - Ground truth: what the system actually does
   - Use if spec or doc claims otherwise

2. **GitHub Specs** (specs/changes/spec_*.md in repo)
   - Approved design; official record of decisions
   - Use if code and docs diverge (indicates code or docs have bug)

3. **Hermes Skill Docs** (biotech-validation, financial-health, selector-ranker, etc.)
   - Warm documentation; updated regularly
   - Use for operational context and rationale

4. **Governance / Policy Docs** (policy_*.md, governance-*.md)
   - Policy authority for decisions and gates
   - Use if code/spec/skill diverge (may indicate policy not yet implemented)

5. **Executive Comms** (.docx, memos, investor decks)
   - Likely lagging; derived from above tiers
   - Use only if all above tiers disagree with each other

**Example (from F-003)**:
- .docx says B6 = "65% coinvest + 35% inst_delta"
- ranker_v2_model.json says B6 = 100% coinvest (post-May-4 demotion)
- Code (run_screen.py) implements 100% coinvest
- Authority resolution: Code + JSON are authoritative; .docx is outdated

---

## Document Refresh Calendar

**Quarterly refresh cycle (all Tier 2 docs updated):**

| Quarter | Refresh Window | Owner | Docs | Trigger |
|---------|----------------|-------|------|---------|
| Q1 (Jan–Mar) | Last week of March | ops_supervisor | Executive overview, investor deck, quarterly report | Annual planning cycle |
| Q2 (Apr–Jun) | Last week of June | ops_supervisor | Executive overview, investor deck, quarterly report | Mid-year review |
| Q3 (Jul–Sep) | Last week of September | ops_supervisor | Executive overview, investor deck, quarterly report | Summer planning |
| Q4 (Oct–Dec) | Last week of December | ops_supervisor | Executive overview, investor deck, quarterly report | Year-end summary |

**Between-cycle urgent refreshes:**

| Trigger | SLA | Owner | Docs |
|---------|-----|-------|------|
| Ranker weights change | 24h (code) + 1 week (.docx) | ops_supervisor | selector-ranker.md, architecture, .docx |
| Gate thresholds change | 24h (code) + 1 week (.docx) | Module owner | financial-health.md, .docx |
| Governance policy change | 24h (spec) + 1 week (memo) | ops_supervisor | governance-*.md, weekly memo |
| Agent count change | Immediate (openclaw.json) + 1 day (MEMORY.md) | fleet_steward | MEMORY.md, Fleet status report |
| Data format change | 24h (code) + 1 week (skill doc) | Module owner | biotech-validation.md, .docx |

---

## Fact Authority Maintenance Task

**Recommended: Automated check (weekly) + manual audit (monthly)**

### Weekly Check (Automated)

```bash
# Pseudocode for Hermes agent:
for each row in Fact_Authority_Table:
  source_value = read(authoritative_source)
  for each downstream_doc in downstream_references:
    doc_value = read(downstream_doc, fact)
    if source_value != doc_value:
      print(f"DRIFT: {fact} — source={source_value}, {downstream_doc}={doc_value}")
      alert(fact_owner, "Drift detected; review and update")

# Trigger: Monday 09:00 ET (start of ops week)
# Owner: fleet_steward (automated via data_auditor skill)
# Action: Send weekly report of any drifts to ops_supervisor
```

### Monthly Audit (Manual)

**Task**: First Monday of month, 10:00 ET.

1. ops_supervisor opens Fact Authority Table
2. For each fact with Last Verified >30 days ago:
   - Read authoritative source and 2–3 downstream references
   - Confirm they still align
   - Update Last Verified = today
   - Note any drift in table (set Drift = YES if detected)
3. For any Drift = YES entries:
   - Escalate to fact owner with deadline: "Resolve drift within 7 days"
4. Generate report: "Fact Authority Audit — {month}. {N} facts verified, {M} drifts found, {K} drifts resolved."

---

## Cross-References and Related Skills

- **Failure Pattern Library** (Skill #2, drafted): Documents specific document-sync failures (F-003, F-005) and links to prevention rules from this skill
- **Operational Health Baselines** (Skill #1, drafted): SLA thresholds for document refresh cadence (Facts must be verified weekly; drift SLA 7 days to fix)
- **Decision Audit Trail** (Skill #4, gap #4): Will annotate facts with decision rationale ("Why is PIT buffer exactly 45 days?"), complementing the authority lineage
- **Skill Maturity Metadata** (Skill #7, gap #7): Will track when each skill doc was last reviewed, complementing this refresh calendar

---

## Known Issues and Action Items

| Issue | Severity | Owner | SLA | Status |
|-------|----------|-------|-----|--------|
| **B6 weights drift** (.docx vs code since May 4) | HIGH | ops_supervisor | 1 week | Pending Q2 refresh cycle (June 23) |
| **Agent count contradictions** (17, 26, 27, 28, 30 across docs) | MEDIUM | fleet_steward | 2 weeks | Resolved in MEMORY.md (May 18); .docx pending |
| **Tier terminology (3 systems, no canonical)** | MEDIUM | ops_supervisor | Immediate | Glossary TBD; create governance-glossary.md |
| **No authoritative source for tier definitions** | CRITICAL | ops_supervisor | Immediate | Create canonial definitions in governance-glossary.md + link from Fact Authority Table |
| **Spec 089 KG design not yet implemented** | HIGH | ops_supervisor | ~2026-05-26 | Blocked on 13F cohort gate; spec doc complete; implementation pending |
| **Herald DARK 35+ days** (cascading failure) | **CRITICAL** | ops_supervisor | Immediate | Not a document sync issue, but a source of operational dark matter; investigation underway (F-011) |

---

## Governance Glossary (TBD)

**To be created**: `docs/governance-glossary.md`

**Template entry**:
```markdown
## Tier

**Definition**: A classification of X by dimension Y.

**Variants** (reconcile these):
1. **Investor Tier**: Manager AUM-based classification (Tier 1 = >$5B, Tier 2 = $1B–$5B, Tier 3 = <$1B)
2. **Signal Quality Tier**: Statistical significance (Tier 1 = IC >0.080 t>2.0, Tier 2 = IC >0.050 t>1.5, Tier 3 = exploratory)
3. **Operational Risk Tier**: System component criticality (Tier 1 = production snapshot, Tier 2 = research-only, Tier 3 = deprecated)

**Canonical usage**: Use full term in governance docs (e.g., "Investor-Tier-1") to avoid ambiguity.

**Related**: See policy_alpha_freeze_2026_04_04.md for Checklist v2 tier criteria (different from above).
```

---

## Suggested Next Steps

1. **Immediate (May 18–19)**:
   - Create governance-glossary.md with definitions for Tier-1/2/3 variants
   - Add governance-glossary.md to Fact Authority Table (authoritative source for terminology)
   - Log current drift issues in Failure Pattern Library (F-003, F-005 already logged; create F-013 for tier terminology)

2. **Short-term (May 19–26)**:
   - Update .docx with B6 weights (100% coinvest, not 65/35) and explanation (cohort artifact)
   - Update MEMORY.md agent count listing (17 or 18?)
   - Validate all facts in Fact Authority Table; confirm Last Verified dates

3. **Medium-term (May 26–June 2)**:
   - Automate weekly drift check (fleet_steward or data_auditor agent queries Fact Authority Table)
   - Schedule Q2 quarterly refresh for late June

4. **Integration with Hermes Agents**:
   - Wire Fact Authority Table into agent initialization: "When you encounter a fact, consult the Fact Authority Table to find authoritative source"
   - Link Failure Pattern Library prevention rules (F-003, F-005) into agent prompts: "Avoid document sync gaps by following the refresh process"
   - fleet_steward: "Run weekly drift audit; escalate any Drift = YES to fact owners"

5. **Long-term (post-June)**:
   - Migrate Fact Authority Table from Markdown to JSON/YAML for automated querying
   - Implement pre-commit hooks: "On code change, confirm downstream docs updated within SLA"
   - Build searchable fact database: "Which docs mention B6 weights? When was each last verified?"

