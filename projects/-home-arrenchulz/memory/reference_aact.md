---
name: AACT Clinical Trials Database
description: CTTI-maintained PostgreSQL-ready daily mirror of ClinicalTrials.gov with structured trial attributes — source for aact_trial_ingest agent. GitHub: github.com/ctti-clinicaltrials/aact. Download pipe files from aact.ctti-clinicaltrials.org/pipe_files
type: reference
---

AACT (Aggregate Analysis of Clinical Trials) — maintained by CTTI (Clinical Trials Transformation Initiative). Daily-updated cleaned mirror of ClinicalTrials.gov in PostgreSQL-ready format.

**Source code:** https://github.com/ctti-clinicaltrials/aact
**Pipe file downloads:** https://aact.ctti-clinicaltrials.org/pipe_files
**PostgreSQL access:** Available for direct DB queries (registration may be required)

**Why it's better than raw CT.gov scraping:**
- Already cleaned and normalized
- PostgreSQL-ready with proper relational schema
- Daily updated
- Structured trial attributes: outcomes, enrollment, phase, sponsors
- Better for bulk historical analysis

**Integration:** `aact_trial_ingest` OpenClaw agent (Archivist). Phase 1 shipped.
- Ingest tool: `tools/fetch_aact_snapshot.py`
- Sponsor mapping: `production_data/sponsor_alias_map.json` (541 entries)
- Agent files: `agents/aact_trial_ingest/`
