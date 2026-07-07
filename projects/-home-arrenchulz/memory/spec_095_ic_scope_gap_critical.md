---
name: spec-095-ic-scope-gap-critical
description: CRITICAL governance finding — IC backtest tool measures composite_score not final_score; ranker IC unmeasured; all prior ranker IC claims invalidated
metadata: 
  node_type: memory
  type: project
  status: active
  severity: CRITICAL
  discovered: 2026-05-15
  expires: 2026-05-26
  originSessionId: a070e46e-7a47-4a4a-85d8-178abfd2db03
---

# Spec 095: IC Scope Gap — CRITICAL Finding

**Discovery date:** May 15, 2026 (Hermes skills audit)
**Severity:** CRITICAL
**Status:** Documented, remediation planned (Spec 100)
**Architecture freeze:** Lifts ~May 26, 2026

---

## The Finding

The IC backtest tool (`ic-evaluation` skill) **measures `composite_score`, NOT production `final_score`**.

**Result:** Ranker IC is unmeasured. All prior ranker IC claims are misattributed to composite_score IC, not ranker-specific IC.

## What This Means

Any claim like:
- "Ranker IC = +0.089"
- "Ranker contributes X basis points to alpha"
- "Ranker is proven to add value"

...is **INVALID** because:
1. The measurement was on composite_score (a blend)
2. Not on final_score (the production ranker output)
3. Ranker contribution isolated = **UNMEASURED**

**Examples of invalidated claims:**
- "Ranker IC +0.089 t=2.07" (pre-PIT-v2) — INVALIDATED
- Any ranker IC claim from backtest tools — INVALIDATED until Spec 100 implementation

---

## Governance Rule (Locked)

**Do NOT use prior ranker IC evidence for promotion decisions until:**

1. Spec 100 (ranker IC tooling correction) is implemented
2. Forward evidence on corrected tool is generated
3. Governance sign-off is complete

---

## Remediation: Spec 100

**Spec:** Ranker IC Tooling Correction
**Status:** Spec written, no implementation yet
**Priority:** HIGHEST post-freeze
**Freeze lift:** ~May 26, 2026 (h20d checkpoint)
**Timeline:** Implement 2026-05-27 onward

### Spec 100 Scope
- Refactor IC measurement to separate composite_score from final_score
- Measure ranker IC in isolation
- Validate against forward period
- Update ic-evaluation skill with corrected IC values
- Mark old claims as deprecated

---

## Related Specs & Context

**Spec 095** (Evaluation Scope) — The audit that found this scope gap

**Spec 094** (Selector-Only Comparator) — Also under review; RANKER_UNPROVEN classification

**Specs 093, 096–099** (Ranker/Selector monitoring) — All reference or depend on IC evidence; monitor for adjustment post-Spec 100

**Alpha freeze policy** (2026-04-04) — Checklist v2 required for all promotions; IC scope gap reinforces this gate

---

## Forward Shadows (Unaffected)

The forward-shadow evidence for inst_delta and cross-signal (T0=2026-04-28, h20d~2026-05-26) does NOT depend on IC tooling and remains valid.

---

## Memory Links

[[hermes-skills-audit-2026-05-15]] — Context: discovered in skills audit
ic_evaluation — Skill that documents this
[[policy_alpha_freeze_2026_04_04]] — Governance context
[[policy_freeze_architecture_2026_04_19]] — Architecture freeze (lifts 2026-05-26)

