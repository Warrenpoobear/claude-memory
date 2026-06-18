---
name: phase7b_preflight_checklist
description: Phase 7B production hook integration requires preflight verification before implementation
metadata: 
  node_type: memory
  type: feedback
  status: active
  date: 2026-06-17
  originSessionId: 2939d787-8865-47fd-905a-06d889a9f688
---

## Phase 7B Preflight: Verify Before Implementing

**Lesson:** VERIFY LOCAL APIs AND INTEGRATION POINTS BEFORE ORCHESTRATING THEM

If Phase 7B (production hook) is approved after operational validation, do NOT implement until:

### 1. Read Orchestration Flow
- [ ] Read `tools/run_daily_production.py` (or equivalent) completely
- [ ] Understand full daily snapshot → ranking → publication flow
- [ ] Identify where post-snapshot step would fit without blocking main execution

### 2. Identify Integration Point
- [ ] Find exact location for optional diagnostic hook
- [ ] Verify it doesn't block snapshot completion
- [ ] Confirm non-blocking pattern is used elsewhere in codebase

### 3. Verify Existing Conventions
- [ ] Check how optional features are enabled (env vars? CLI flags? config files?)
- [ ] Examples: `SCIENTIFIC_CARTOGRAPHY_ENABLED=1`, `--run-diagnostics`, config YAML?
- [ ] Read 2-3 examples of disabled-by-default integrations in codebase
- [ ] Adopt same pattern for Phase 7B

### 4. Verify Failure Handling
- [ ] How do optional post-snapshot steps fail gracefully?
- [ ] What happens if diagnostics fail in non-strict mode?
- [ ] Are there logging/status patterns already in place?
- [ ] Should Phase 7B write status to same location as other optional steps?

### 5. Draft Integration Plan
- [ ] Write pseudocode for the hook (don't implement yet)
- [ ] Show how it's guarded (default disabled)
- [ ] Show what happens on failure (logging, not blocking)
- [ ] Show how tests prove production behavior unchanged when disabled
- [ ] Get approval on plan before touching code

### 6. Only Then Implement
- [ ] Add guarded call site in run_daily_production.py
- [ ] Implement disabled-by-default gate
- [ ] Add tests proving default behavior unchanged
- [ ] Add tests proving enabled behavior works
- [ ] Verify no production rankings/scoring changes

---

**Why This Matters:**

Phase 7A avoided production wiring by design. Phase 7B would introduce the first integration point. Guessing at how integration should work (as Phase 7A did with APIs) is riskier when touching production orchestration.

Preflight verification costs a few hours reading and planning. Implementation mistakes cost much more.

---

**Related:** [[scientific_cartography_phase7a_complete]], [[phase6_1_scope_boundaries]]
