---
name: session_2026_03_14_coverage_fixes
description: Major data coverage and pipeline fixes from 2026-03-14 session — catalyst family, PDUFA calendar, SEC scanner, 13F cache, options audit
type: project
---

## 2026-03-14 Session: Coverage & Pipeline Fixes

### Commits (all pushed to main)

1. **`ce53845c`** — Secondary regulatory path for Step 10 options tilt + book-split sleeve comparison + demote 73113d54
2. **`8d5166af`** — SEC PDUFA scanner: ingestion-ready format (`format_for_ingestion()`) + expanded keyword recall
3. **`661d65c1`** — Three-tier catalyst event lookup (exact → fuzzy ±14d → NCT UID inference) — fixes 53 unassigned names
4. **`8a93b619`** — Tier-0 earliest-future-event fallback — fixes 7 more names where integration.next_catalyst_date was null
5. **`01857803`** — PDUFA calendar expansion: 7 → 15 entries (VRDN, MRNA, SMMT, DNLI, RCKT, ARVN, RGNX, ARGX)
6. **`26d33dab`** — `--forward-only` filter for SEC scanner (past_date / duplicate_existing / imprecise_date rejection)

### Key Metrics Changes (next screen run)

- **catalyst_family coverage**: 182/296 (61.5%) → ~242/296 (81.8%) — 60 names gained via four-tier lookup
- **91-180d regulatory population**: 1 (VERA only) → 3 (VERA, VRDN 108d, MRNA 144d) — from PDUFA calendar expansion
- **PDUFA calendar**: 7 → 15 entries, 11/15 full provenance
- **13F cache**: was EMPTY (0 files) → warmed for 2026-03-14 (29/29 elite managers, 1625 holdings, 195/354 universe overlap). inst_delta sort contribution was zero; now has data.
- **Options quality composite**: 75/296 (25.3%) — confirmed as market-structure ceiling, not a bug. 105 names have no listed options, 116 fail liquidity gate.

### 73113d54 Candidate Status

Moved from "structurally inert" to "confirmed single-name divergence":
- VERA: +0.40 sort delta under candidate vs +0.00 under active (options_quality_91_180 fires)
- Treatment set: 1 → 3 names after PDUFA expansion (VRDN, MRNA join VERA)
- SMMT (245d) enters 91-180d window in ~65 days

**Why:** Step 10 now uses secondary regulatory path (has_regulatory_upcoming_180d + regulatory_days) instead of primary catalyst_family==REGULATORY gate.

**How to apply:** Monitor on fresh snapshots. If treatment set reaches 5+ names with nonzero OQC, re-evaluate for real shadow promotion.

### Standing Workflow: SEC Scanner → PDUFA Calendar

After each SEC 8-K cache refresh:
```bash
python3 scripts/research/find_pdufa_candidates_from_sec.py --forward-only --format ingestion --out-json artifacts/pdufa_collector/candidates.json
# Review survivors → validate → dry-run → ingest
python3 tools/collect_pdufa_forward.py --validate candidates_reviewed.json
python3 tools/collect_pdufa_forward.py --ingest candidates_reviewed.json --dry-run
python3 tools/collect_pdufa_forward.py --ingest candidates_reviewed.json
python3 tools/collect_pdufa_forward.py --audit
```

### Data Coverage Audit Results

| Signal | Coverage | Status |
|--------|----------|--------|
| clinical_score_v2 | 296/296 (100%) | OK |
| alpha_60d | 296/296 (100%) | OK |
| calendar_alpha_z | 296/296 (100%) | OK |
| inst_delta_z | 296/296 (100%) | OK (was zero-contribution; 13F cache now warm) |
| catalyst_family | ~242/296 (81.8%) | IMPROVED (was 61.5%) |
| clinical_quality_composite | ~242/296 (81.8%) | IMPROVED (follows family) |
| options_quality_composite | 75/296 (25.3%) | Market-structure ceiling |
| regulatory coverage | ~5% expected | IMPROVED (was 2.4%) |
