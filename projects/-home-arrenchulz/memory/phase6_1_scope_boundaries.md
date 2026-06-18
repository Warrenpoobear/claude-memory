---
name: phase6_1_scope_boundaries
description: "Phase 6.1 CLI ergonomics only — tight boundary, no pipeline integration"
metadata: 
  node_type: memory
  type: project
  status: active
  date: 2026-06-17
  originSessionId: 2939d787-8865-47fd-905a-06d889a9f688
---

## Phase 6.1 Scope: CLI Ergonomics Only

**Decision Date:** 2026-06-17  
**Rationale:** Phase 6 operational review validated export layer. CLI is ergonomic wrapper, not integration layer.

### What IS Phase 6.1

✅ **Allowed:**
- `export-artifacts` CLI command
- Input path arguments (--programs, --clusters, --features)
- Output directory argument (--output)
- as_of_date argument (--date)
- File count / progress summary (stderr reporting)
- Deterministic artifact writing (same logic as Phase 6)

### What IS NOT Phase 6.1

❌ **Deferred to Phase 7+:**
- Production snapshot pipeline integration (wiring exporters into daily cron)
- Rankings export / alpha artifacts
- Daily scheduled execution / cron wiring
- Scoring formula changes
- LangGraph orchestration
- Dashboard / web UI
- Automated artifact serving

### Boundary Rationale

Phase 6.1 is a **thin CLI wrapper** over validated Phase 6 export layer. The exporters themselves are:
- Deterministic (rerunnable)
- Read-only (no side effects)
- Governance-locked (no production wiring)
- Operationally validated (all tests pass + manual review clean)

CLI should be **convenience only**—not architectural integration. Pipeline wiring comes *after* CLI output is stable and operational team is satisfied with artifact quality.

### Success Criteria for Phase 6.1

- ✅ `export-artifacts --programs P.jsonl --clusters C.jsonl --features F.jsonl --output /tmp/maps --date 2026-06-17` runs cleanly
- ✅ Help text explains governance (read-only, diagnostic-only)
- ✅ Error handling for missing files, invalid paths
- ✅ Progress reporting (artifact counts, file sizes)
- ✅ 5-10 new tests (CLI argument parsing, file I/O, error cases)
- ✅ No changes to Phase 6 exporters (only add CLI layer)

### Phase 7 Decision Gate

After Phase 6.1 CLI stabilizes (1-2 weeks operational use):
- Operator reviews artifact quality, usability, naming conventions
- Decision: integrate into daily snapshot pipeline OR defer further
- If yes: Phase 7 wires exporters into cron/scheduler with governance checks
- If no: CLI remains standalone diagnostic tool for manual runs

---

**Related:** [[scientific_cartography_v0_1_phase6_locked]]
