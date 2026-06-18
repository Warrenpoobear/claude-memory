---
name: hermes_skills_inventory_current
description: "Complete Hermes skills registry (31 active skills, synced 2026-06-02)"
metadata: 
  node_type: memory
  type: reference
  updated: 2026-06-02
  source: docs/hermes_skills/_meta.json
  audit_status: CLEAN
  originSessionId: 7aaaa27d-e4f5-4c4c-8fec-8c82b385f194
---

# Hermes Skills Inventory (2026-06-02)

**Registry Status:** 31/31 skills synced, no drift, no orphans  
**Last Audit:** 2026-06-02 (clean)  
**Location:** `docs/hermes_skills/_meta.json`

## Skill Categories

### Governance & Control (6 skills)
- **Town-Operator Bridge** (Spec 090) — Phase B live; routes events to operator inbox
- **Governance Spec Enforcement** — Spec lifecycle + enforcement gates
- **Path C Governance Monitoring** — Temporary catalyst-timing policy override monitoring
- **Path C Operational Runbook** — Window close automation + decision framework
- **Phase 2 Step 4 Readiness** — Knowledge graph implementation readiness
- **Hermes Knowledge Layer State Capture** — KG state capture + persistence

### Signal & Scoring (6 skills)
- **Clinical Trial Scoring** — CTGOV trial progression + clinical grade assessment
- **Institutional Holdings Signal** — 13F cohort monitoring + Jaccard validation
- **IC Evaluation** — Information Coefficient calculation + floor monitoring
- **Catalyst Resolution & Tracking** — Event outcome tracking + attribution
- **Financial Health Assessment** — Balance sheet + cash runway analysis
- **Selector & Ranker Architecture** — Top-30 selection + pairwise ranking

### Operations & Monitoring (7 skills)
- **Screener Ops & Governance** — Daily pipeline status + fleet health
- **13F Validation Coordinator** — Q1 refresh validation + cohort quarantine gates
- **Memory Steward** — Session memory indexing + semantic linking (hermes_authoritative)
- **Validation & Export Contracts** — Output contract verification + type safety
- **Data Integrity Audit** — Schema + field validation (implied)
- **Hermes Knowledge Layer State Capture** — KG persistence
- **Codegraph Repo Intelligence** — Symbol lookup + architecture analysis

### Liquidity & Portfolio Risk (3 skills)
- **Spending Liquidity** — Cash allocation runway modeling
- **SFO Liquidity Architecture** — Real estate portfolio + community dev liquidity
- **PE Pacing** — Private equity commitment-book modeling

### Research & Discovery (3 skills)
- **Firecrawl Research Discovery** — Biotech news + paper discovery (research-only)
- **Dossier Generation** — Company profile + thesis generation
- **Self-Improving Agent Loop** — Agent optimization + feedback loops

### Debugging & Infrastructure (4 skills)
- **OpenClaw Agent Optimize** — Agent parallelization + cost profiling
- **OpenClaw Agent Scope Audit** — Fleet capacity + workload assessment
- **OpenClaw Cron Scheduler Debug** — Job dispatch + timing issues
- **OpenClaw Data Pipeline Debug** — Data freshness + cache diagnostics
- **OpenClaw Session Routing Debug** — Multi-agent session coordination

### Office & Integration (3 skills)
- **Excel / XLSX** — Spreadsheet generation + manipulation (cursor_reference)
- **Word / DOCX** — Document generation + templating (cursor_reference)
- **Browser Automation (OpenClaw)** — Selenium + web scraping (hermes_native)

## Source Authority Legend

| Authority | Meaning |
|-----------|---------|
| `cursor_skill` | Synced from `skills/<dir>/SKILL.md` (edit source, then sync) |
| `cursor_reference` | Synced from `skills/<dir>/REFERENCE.md` (edit source, then sync) |
| `hermes_native` | Direct edit in `docs/hermes_skills/<file>.md` (no sync) |
| `hermes_authoritative` | Mirror-only (sync skips this, manual override) |

## Phase B Implementation Status

**All 4 agents deployed (2026-05-27):**
1. hermes-held-spec-ledger (event: held_spec_ledger)
2. hermes-first-fire-validator (events: first_fire_pass, first_fire_fail)
3. hermes-ruleset-integrity (events: ruleset_mismatch_pass/fail)
4. agent_supervisor_sentinel (event: snapshot_missing)

## Operational Notes

- **SKILL_MAP:** 16 cursor-synced skills (require `sync_hermes_skills.py` after edit)
- **HERMES_NATIVE:** 12 docs-only skills (direct edit, no sync needed)
- **Memory Steward:** Authoritative (hermes_authoritative, edit via mirror only)
- **Daily use:** screener-ops, 13f-validation, path-c monitoring, town-operator-bridge
- **Path C window:** Extended to ~2026-06-17 (decision 2026-06-03 ✓ EXTEND approved)

## Sync & Maintenance

```bash
# After editing skills/<dir>/SKILL.md or skills/<dir>/REFERENCE.md:
python3 tools/sync_hermes_skills.py

# Update registry:
python3 tools/sync_hermes_skills.py --register-meta

# Audit:
python3 -m tools.audit_hermes_skills
```

**All skills current as of 2026-06-02. No action required.**
