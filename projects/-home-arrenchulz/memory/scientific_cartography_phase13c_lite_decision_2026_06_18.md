---
name: scientific_cartography_phase13c_lite_decision
description: "Phase 13C-lite APPROVED - diagnostic artifact generation, not production deployment. Phase 13B and 14 deferred."
metadata: 
  node_type: memory
  type: project
  status: resolved
  locked_at: 2026-06-18T04:00:00Z
  decision: APPROVE_PHASE_13C_LITE / DEFER_13B_DASHBOARD / DEFER_14_MECHANISM_TARGET
  originSessionId: 94d82eeb-9e2a-435e-adc1-022456c22177
---

## SCIENTIFIC CARTOGRAPHY DECISION LOCK — 2026-06-18

### Validation Summary

```
SCIENTIFIC_CARTOGRAPHY_BIOTECH_UNIVERSE_MAPPING_VALIDATED
Coverage:      71,284 programs / 6,760 diseases / 6,794 clusters / 71,284 features
Tests:         323/323 PASS
Boundary:      READ_ONLY_DIAGNOSTIC
Status:        READY_FOR_PHASE_13C_LITE_DISABLED_BY_DEFAULT_GENERATION
Caveat:        MECHANISM_TARGET_LAYER_SPARSE_BY_DESIGN (0.1% coverage, conservative matching)
```

### Key Insight

The stack is **immediately useful as a disease/stage/company/trial landscape map**, but mechanism/target competitive intelligence is limited by design (conservative normalizer, 0.1% coverage). This is **not a failure** — it's an intentional trade-off favoring precision over recall.

### Three-Part Decision

**APPROVED: Phase 13C-lite**
- Purpose: repeatable diagnostic artifact generation
- Scope: manual trigger first, cron optional later
- Output: `artifacts/scientific_cartography/<as_of_date>/`
- Blocking: false (non-blocking by default)
- Production impact: none
- Status: disabled-by-default wrapper

**DEFERRED: Phase 13B (Dashboard)**
- Rationale: artifacts proven readable and safe; UI can wait until actual usage patterns emerge
- Trigger: after 2-4 weeks of Phase 13C-lite operational use
- Decision gate: "Which artifacts do users actually revisit?"

**DEFERRED: Phase 14 (Mechanism/Target Enhancement)**
- Rationale: separate phase for expanding mechanism/target coverage beyond 0.1%
- Scope: design new normalizer patterns, curated dictionary, validation layers
- Timing: after Phase 13C-lite stabilizes (3-4 weeks minimum)
- Not blocking Phase 13C approval

---

## Phase 13C-lite Scope Specification

### Framing

**NOT:** Automated production deployment  
**IS:** Scheduled diagnostic artifact generation with repeatability guard

### Requirements

1. **Default Behavior:**
   - No changes to daily pipeline unless explicitly enabled
   - `--run-scientific-cartography-phase13c` flag required
   - Non-blocking (failures logged, don't halt)

2. **Output:**
   - Root: `artifacts/scientific_cartography/<as_of_date>/`
   - Artifacts: `disease_map_summary.json/.md`, JSONL files, cluster/feature coverage reports
   - Manifest: `scientific_cartography_manifest.json` with file count, total size, runtime, governance flags

3. **Safety Checks:**
   - Size guard: fail if output > 2GB (prevents runaway logs)
   - Forbidden-field scan: error if any artifact contains "score", "rank", "weight", "final_score", "buy", "sell", "recommend" (as action language)
   - Governance flag validation: all artifacts must have `read_only_diagnostic=true`

4. **Tests:**
   - Regression: prove default pipeline path unchanged (all gates still pass)
   - Manifest: verify manifest schema and completeness
   - Boundary: confirm no files written to production directories

5. **No Changes Required:**
   - Ranking logic unchanged
   - Selector logic unchanged
   - Sizing logic unchanged
   - Final score logic unchanged

### Manifest Structure

```json
{
  "artifact_type": "scientific_cartography_diagnostic",
  "as_of_date": "2026-06-18",
  "snapshot_dir": "data/snapshots_pit/2026-06-18",
  "runtime_seconds": 142,
  "generated_at": "2026-06-18T12:34:56Z",
  "file_count": 8,
  "total_size_mb": 42.3,
  "governance": {
    "read_only_diagnostic": true,
    "ranker_change": false,
    "selector_change": false,
    "sizing_change": false,
    "final_score_change": false
  },
  "artifacts": {
    "disease_map_summary": {"size_mb": 6.9, "records": 6760},
    "landscape_features": {"size_mb": 653.8, "records": 71284},
    "competitive_clusters": {"size_mb": 8.9, "records": 6794}
  },
  "safety_checks": {
    "size_guard_pass": true,
    "forbidden_fields_scan": "PASS",
    "governance_flags_valid": true
  }
}
```

### Timeline

**Now (2026-06-18):**
- Refine Phase 13C impl: add manifest, size guard, forbidden-field scan
- Integrate tests into Phase 13C test suite
- Mark ready for operational use

**Phase 13C-lite Operational Window (2026-06-19 to ~2026-07-01):**
- Run with `--run-scientific-cartography-phase13c` on select dates (manual trigger)
- Monitor: manifest generation, file sizes, governance compliance
- Collect: which disease maps are actually revisited?
- Feedback loop: are the artifacts useful? Any missing data?

**Phase 13B Decision Gate (~2026-07-01):**
- If artifacts are regularly accessed: approve Phase 13B dashboard
- If unused: keep Phase 13C-lite as manual tool, no UI investment yet

**Phase 14 Design Gate (~2026-07-15):**
- Assess mechanism/target expansion: worth the design complexity?
- Scope: new normalizer patterns, curated reference dictionaries, validation layers
- Not blocking Phase 13C — separate initiative

---

## Rationale

### Why Phase 13C-lite before 13B

The bottleneck is **repeatability**, not discoverability. The Phase 13A runbook proved disease maps are readable and safe. The next question is: "Can we generate them reliably and include them in routine artifact output?"

A dashboard is premature until we know:
- What frequency of generation is useful (daily? weekly? on-demand?)
- Which artifacts users actually return to (disease maps? clusters? features?)
- What filtering/search patterns matter (by company? disease? stage?)

### Why mechanism/target is Phase 14

The 0.1% coverage is **by design** — conservative normalizer avoiding spurious matches. Expanding to 10% or 50% requires:
- New matching patterns (fuzzy, hierarchical, external references)
- Curated mechanism/target dictionary (not inferred from programs)
- Validation layer (cross-check against PubChem, ChEMBL, etc.)
- Separate governance review (different confidence model)

This is a distinct sub-project. Phase 13C should not be blocked on it.

---

## Status Going Forward

**Phase 13C-lite Implementation:** 
- Review current commit (cfe07a77) for manifest/safety additions needed
- Add tests proving default behavior unchanged
- Lock scope: manifest + size guard + forbidden-field scan

**Approved for Operational Activation:** 
- Manual trigger via CLI flags
- Non-blocking, disabled-by-default
- No UI, no cron (yet)
- Governance locked

**Decision Authority:** 
User approval of Phase 13C-lite scope and deferral of 13B/14

