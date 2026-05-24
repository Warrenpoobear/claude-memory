---
name: ranker_research_landscape
description: "Ranker research pending work: diagnostic-only research blocked until evidence/verification complete; Spec 072 frozen candidate; Spec 096 doctrine governs all changes"
metadata: 
  node_type: memory
  type: project
  status: active
  expires: 2026-06-15
  originSessionId: aa59b343-1bcf-4550-8276-0cdf7344c285
---

## Ranker Research Landscape — Governance & Pending Work

**Status:** FROZEN (no production changes authorized until 2026-05-22 verification + evidence blockers satisfied)

### Governing Rule: Spec 096 — Gate/Ranker Separation Doctrine

**Core principle:**
- Gates exclude names (not ranked inputs)
- Risk controls adjust exposure post-ranking
- Ranker candidates must prove **marginal ordering value**
- Shadow-only and monitoring-only signals do NOT affect production
- Retired/no-go lanes stay closed unless explicitly reopened

**Ranker promotion requires:**
1. Marginal ordering value (Spec 094)
2. Correct IC scope / fixed tooling (Spec 095 + old Spec 100)
3. Orthogonality (cross-signal independence)
4. Checklist v2 (6 modules: FM, bootstrap, FDR, LOSO, year stab, domain)

### Pending Ranker Research Lanes

#### 1. Spec 072 — vNext Ranker Redesign (PRIMARY)

**Status:** Diagnostic-only; frozen candidate set; awaiting 2026-05-22 verification

**Design:**
```
Universe → Manager validation gate (coinvest_score_z)
→ Trap filter (liquidity / dilution / stale-thesis)
→ Rank survivors by catalyst+clinical quality
→ EW Top-30 construction
```

**Principle:** Use managers to validate science; traps to avoid obvious losers; catalyst/clinical quality to rank. Coinvest becomes **gate**, not continuous ranker input.

**Frozen candidate set:**
- PRIMARY: `clinical_score_v2_z` (D8/D9 preliminary IC ≈ +0.20 within L3; effective ~+3 NW-corrected)
- BACKUP: `endpoint_strength_score`
- Set aside: trial-maturity cluster

**Why frozen:** Preliminary results strong but sample short (5–10 tickers), partially overlaps cohort-quarantine window (2026-04-25 onward), doesn't meet promotion-grade threshold yet.

**Pending action (2026-05-22):**
- Re-run D7/D8/D9 on frozen set only
- If pass: proceed to D1–D6 (full diagnostic suite)
- If fail: close candidate; prepare backup

**Do not:**
- Add features; tune weights; build composite
- Shadow-ship or promote before verification
- Change coinvest weighting or gate logic during pending phase

#### 2. Spec 091 — `score_rank_pct` Degradation Governance (WARNING-CONTROL)

**Status:** Memo/governance only; no code, no weights, no retrain

**What it is:** Warning-control spec around IC dashboard signal `score_rank_pct` (entered WARN streak).

**What it is NOT:** A ranker-change spec; no justification for selector/ranker/sizing edits.

**Required evidence before action:**
- CRT — cohort regime test
- IC — multi-horizon independent IC validation
- PIT — input/data integrity audit
- Checklist v2 — full alpha-freeze battery

**Pending action:**
- Keep monitoring
- If WARN streak breaks post-13F refresh: close with no model action
- If persistent: prepare evidence bundle (earliest meaningful action after post-cohort-window forward-return window)

**Do not:**
- Use WARN as justification for Module 5 / ranker weights / IC thresholds edits
- Suppress or filter `score_rank_pct` signal

#### 3. Spec 094 — Marginal Ordering Value Proof (BLOCKER)

**Requirement:** Demonstrate that candidate signal adds ordering value **marginal to selector outputs** within eligible universe.

**Status:** Pending implementation; blocks ranker promotion.

#### 4. Spec 095 — Correct IC Scope / Composite Score Audit (BLOCKER)

**Finding:** IC backtest measured `composite_score` (selection universe), not ranker `final_score` (ranking within selection).

**Requirement:** Fix IC measurement tooling and re-validate scope.

**Status:** Pending; blocks ranker IC claims until resolved.

#### 5. Old Spec 100 — True Ranker IC Tooling (BLOCKER)

**Requirement:** Implement ranker-specific IC measurement (not composite; not selection universe) with LOSO and bootstrap.

**Status:** Pending; critical blocker for all ranker promotions.

#### 6. Specs 098 / 099 — Shadow Lanes (NOT YET PRODUCTION)

**Spec 098:** Catalyst timing monitor (shadow-only path)
**Spec 099:** Clinical orthogonality audit (shadow-only path)

**Status:** Diagnostic-only; monitoring lanes do not affect production.

### Practical Priority Order (2026-05-14 onward)

```
1. IMMEDIATE (2026-05-15):
   ✓ Close Spec 104 Phase B (insider diagnostic 5-day measurement)
   ✓ Close Spec 105 (expectation coverage verification)

2. WAIT FOR VALIDATION (2026-05-15):
   ✓ Validate 13F Q1 2026 refresh
   ✓ Confirm SIGNAL_ALERT clears (inst_delta distortion recovery)
   ✓ Check cohort window state cleared

3. PREPARE REVIEW PACK (by 2026-05-22):
   ✓ Spec 072 D7/D8/D9 frozen-set re-run + diagnostics
   ✓ score_rank_pct WARN status + trajectory
   ✓ Spec 091 evidence-bundle readiness assessment
   ✓ Forward-return test post-cohort-window accumulation

4. DECIDE NEXT RANKER PHASE (2026-05-22 review):
   ✓ Spec 072 verdict: advance to D1–D6 or close candidate
   ✓ Spec 091 verdict: dismiss WARN or prepare evidence bundle
   ✓ Spec 096 enforcement: confirm all pending work respects doctrine
   ✓ Go/no-go on shadow phase advancement for Specs 098/099

5. NO PRODUCTION RANKER CHANGES until all above complete + Spec 096 blockers satisfied
```

### Freeze Status

**Production ranker:** Frozen at 2-feature pairwise (v2) + selector input weighting (0.65 coinvest, 0.35 inst_delta)

**Blocked transitions:**
- ❌ Ranker feature additions (until Spec 094/095/100 satisfied)
- ❌ Ranker weight changes (until evidence + Checklist v2)
- ❌ Coinvest reweighting (until Spec 072 verified + 13F refresh cleared)
- ❌ Score-rank-pct adjustments (until Spec 091 evidence)

**Allowed work:**
- ✓ Diagnostic-only research (Spec 072 D8/D9 re-run)
- ✓ Warning monitoring (Spec 091 tracking)
- ✓ Shadow-only lanes (Specs 098/099)
- ✓ IC tooling repair (old Spec 100 implementation)

### Key Constraints

**Spec 096 doctrine controls all:**
- Gate/ranker separation is non-negotiable
- Marginal value must be proven, not assumed
- IC tooling must be correct before IC claims
- Orthogonality is a requirement, not a nice-to-have
- Checklist v2 is mandatory for promotion

**Architecture frozen:**
- Per policy_freeze_architecture_2026_04_19.md
- Attribution lane only until ranker promotion criteria met
- No tuning; no weight retraining; no composite building

**Cohort regime active until ~2026-05-15:**
- inst_delta_z inflated/miscalibrated (04-25 cohort expansion)
- Do NOT interpret rank changes as signal validation during window
- SIGNAL_ALERT persistence is correct behavior
- Self-healing expected only post-13F refresh

### References

- **Spec 072:** `specs/changes/spec_072_screener_vnext_2026_05_01.md`
- **Spec 091:** (memo-only; check memory for governance_score_rank_pct notes)
- **Spec 096:** (governance doctrine; controls all ranker work)
- **Spec 094/095/old-100:** (blockers; tooling not yet built)
- **Specs 098/099:** (shadow lanes; diagnostic-only)
- **Spec 096 doctrine:** `policy_freeze_architecture_2026_04_19.md` + gate/ranker separation principle
