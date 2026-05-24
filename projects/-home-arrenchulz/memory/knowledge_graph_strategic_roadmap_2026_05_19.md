---
name: knowledge_graph_strategic_roadmap_2026_05_19
description: "Strategic guidance on selective KG application — deterministic governance tools, not alpha engines"
metadata: 
  node_type: memory
  type: feedback
  status: active
  originSessionId: f4dc98ee-62dd-4417-a691-d33d6d3e0320
---

# Knowledge Graph Strategic Roadmap — 2026-05-19

## Core Principle

**KGs should be selective** — apply only where there are real relationships, dependencies, lineage, blockers, contradictions, and evidence chains. They are deterministic governance tools, **not alpha engines or graph databases**.

**Spec 089 (Governance KG) is the right template:**
- Deterministic, in-memory, no graph DB
- Focused on 5 governance questions: blockers, spec status, contradictions, next actions, file touches
- Read-only, no LLM reasoning, no production changes

## Priority Roadmap

| # | Graph | Primary Goal | Value | Status |
|---|-------|---|---|---|
| 1 | **Governance KG** (Spec 089) | Blockers, contradictions, spec status | High | ✅ Complete |
| 2 | **Pipeline Lineage** (Spec 110) | "Why did score change?" + PIT safety | **Very High** | 🔨 Design (2026-05-19) |
| 3 | **Feature Provenance** | Prevent score/evidence confusion | High | → Next |
| 4 | **13F Cohort Graph** | Quarantine gates, refresh impact | High | → Post-lineage |
| 5 | **Agent/Cron Ops** | Hermes observability | Medium | → Parallel track |
| 6 | **Catalyst/Trial Evidence** | Source reconciliation | Medium | → Foundation work |

## Spec 110: Pipeline Provenance Graph

**Goal:** Deterministic lineage from raw source → feature engineering → scoring module → snapshot artifact → validation artifact.

**Answers:**
- "Why did this company's score change?" (with full data provenance)
- "Which raw files fed today's rankings.csv?"
- "Which snapshot used which code commit and raw data as-of-date?"
- "Which feature is stale, missing, backfilled, or quarantined?"
- "If SEC cache breaks, which downstream outputs are affected?"

**Nodes (13):** RawSource, CacheFile, SnapshotArtifact, FeatureColumn, FeatureModule, ScoringModule, ModelArtifact, CodeCommit, ValidationReport, QuarantineMarker, BackfillRecord, GateLock, ConfigVersion

**Edges (8):** PRODUCES, CONSUMES, DERIVES, IMPLEMENTS, VALIDATES, QUARANTINES, BACKFILLS, GATED_BY

**Pattern:** Same as Spec 089 (4-layer pipeline: extract, build, validate, emit)

**Timeline:** Phases A/B/C, target 2026-05-28 completion

## Hard Boundaries — Where NOT to Apply KGs

**Do NOT use KGs directly inside production ranker/selector path.**

Avoid:
- ❌ KG-derived score boosts
- ❌ Graph centrality as alpha
- ❌ "Entity relationship richness" as a ranking signal
- ❌ LLM-extracted graph facts feeding scores
- ❌ Graph enforcement loops before operator review

The Spec 089 KG explicitly says: provide tools + let operator review before Phase 2 Step 5 enforcement.

## Why: Prevent Spec-EES Mistake

Graph reasoning can be seductive but risky. Avoid silent leakage:
- EES v3 used expectation error (from expectation alone) → structurally invalid
- Rule: **Cannot extract expectation/signal from itself**
- Graph reasoning has same risk: **Cannot infer alpha from relationship structure alone**

Solution: **Graphs are for lineage/governance, not ranking.**

## Integration

**Spec 110 touches:**
- `governance-spec-enforcement` skill (lineage for QA)
- `build_hermes_knowledge_layer.py` (artifact dependencies)
- `phase-2-step-4-readiness` (validation infrastructure)
- Governance memo (PIT safety report)

**Does NOT touch:**
- selector_engine.py
- ranker_v2_pairwise.py
- run_screen.py
- Model weights or scoring logic

## Next Specs in Order

1. **Spec 110** — Pipeline Provenance (deterministic lineage)
2. **Spec 111** — Feature Provenance (prevents score/evidence confusion, learns from Spec 095/100)
3. **Spec 112** — 13F Cohort Graph (quarantine gates, refresh impact, filing stale-ness)
4. **Spec 113+** — Agent/cron ops graph, catalyst evidence graph (later)

## Implementation Principle

Each KG spec follows the Spec 089 pattern:
1. Four-layer deterministic pipeline (extract → normalize → validate → emit)
2. In-memory JSON/JSONL (no graph database)
3. 5 core query patterns (answering specific questions)
4. Read-only (no enforcement; operator review required)
5. Daily cron update (post-snapshot, pre-governance-decision)
6. Output: nodes.jsonl + edges.jsonl + human-readable report

## Why This Matters

**Pipeline lineage (Spec 110) has very high value because:**
- Reduces debugging time (answer "why?" in seconds, not hours)
- Improves PIT safety (verify no forward-looking data)
- Documents snapshot reproducibility (code commit at snapshot time)
- Tracks data freshness (stale Morningstar → affected features)
- Quantifies breakage impact (source down → 3+ features → snapshot invalid)
- Audits quarantine enforcement (13F gate blocks downstream correctly)

**Without it:** Operator is blind to lineage, can't debug score changes, can't verify PIT safety, can't track data staleness.

**With it:** Operator can query provenance and make informed decisions in real time.

## How to Apply This

When a future spec proposes a KG or graph-based approach:
1. Ask: Does it have real relationships, dependencies, lineage, or evidence chains?
2. If yes: Is it deterministic and in-memory, or does it need a database?
3. If deterministic: Does it feed decisions (5+ query patterns) or just "nice to have"?
4. If high value: Write it in Spec 089/110 style (4-layer, in-memory, queries).
5. If it touches scoring: STOP — graphs are for governance, not alpha.

---

**Spec 110 is the proof of concept that pipeline lineage is worth it. After that, feature provenance, then 13F cohort, then agent ops.**

