---
name: Phase 3 memory graph usage audit (2026-05-14)
description: One-shot audit of whether memory graph tooling shipped 2026-04-30 is being used; recommends stay/advance/sunset for Phase 3
type: project
status: resolved
created: 2026-05-14
resolved_at: 2026-05-14
resolution: see recommendation below
related:
  - biotech_ranker_active_contract_2026_04_30
---

## Audit window
2026-04-30 → 2026-05-14 (14 days)

## Findings

**Memory writes since hygiene pass**: 37 files
- `policy_demotion_path_2026_05_06.md` (mtime 2026-05-06)
- `polymarket_alpha_verdict_2026_05_05.md` (mtime 2026-05-05)
- `postmortem_detection_fix_2026_05_02.md` (mtime 2026-05-02)
- `ranking_alternatives_research_2026_05_08.md` (mtime 2026-05-08)
- `ranking_methodology_spec_backlog_2026_05_13.md` (mtime 2026-05-13)
- `regime_post_cohort_change_distortion_2026_04_28.md` (mtime 2026-05-01)
- `scoring_model_identity_2026_04_06.md` (mtime 2026-05-06)
- `screener_vnext_d8_d9_first_candidate_2026_05_01.md` (mtime 2026-05-01)
- `sec_6k_coverage_shipped_2026_04_28.md` (mtime 2026-05-01)
- `spec_071_078_catalyst_hygiene_closed_2026_05_06.md` (mtime 2026-05-06)
- `spec_072_screener_vnext_2026_05_01.md` (mtime 2026-05-01)
- `spec_092_phase_a_shipped_2026_05_07.md` (mtime 2026-05-07)
- `spec_092_phase_b_complete_2026_05_13.md` (mtime 2026-05-13)
- `spec_092_phase_c_complete_2026_05_13.md` (mtime 2026-05-13)
- `spec_092_phase_d_complete_2026_05_13.md` (mtime 2026-05-13)

**memory_graph.json freshness**: STALE — graph mtime 2026-05-07 < most recent .md mtime 2026-05-13

**Tool invocations across transcripts + history.jsonl**:
- `query_memory_graph.py`: 51
- `build_memory_graph.py`: 79

**Frontmatter discipline on new files**:
- Lifecycle (status/expires/related/etc.): 25
- Old-format (name/description/type only): 12

## Recommendation

**Phase 3B** (auto-rebuild PostToolUse hook). The query CLI is being used (51 invocations). Rebuild friction is now the bottleneck — wire a PostToolUse hook on Write/Edit of memory/*.md to run build_memory_graph.py.

## Crontab self-removal

removed 2 line(s)
