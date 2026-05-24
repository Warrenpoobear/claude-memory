---
name: 13f-refresh-runbook-complete-2026-05-17
description: "13F Q1 2026 cohort refresh runbook drafted and finalized with 6 validation gates, decision matrix, and clearance thresholds"
metadata: 
  node_type: memory
  type: project
  status: completed
  completed: 2026-05-17
  relates_to: 
    - 13f_q1_2026_monitoring_live_2026_05_15
    - 13f_cohort_quarantine_prep_2026_05_01
    - operating-state-post-spec-100-2026-05-17
  originSessionId: f76c74e5-ca06-4596-901a-ca7d6597895b
---

# 13F Q1 2026 Cohort Refresh Runbook — COMPLETE

**Completed:** 2026-05-17  
**Location:** `docs/13f_q1_2026_refresh_runbook.md`  
**Purpose:** Deterministic validation workflow for May 2026 13F refresh enabling fast clearance decision when holdings exceed 70% filing threshold (~2026-05-23).

---

## Runbook Contents

### Monitoring Status
- Current (2026-05-15): 6/48 filed (12.5%), Jaccard 0.536, quarantine ACTIVE
- Expected timeline with filing targets through 2026-06-20
- Cron job 7b627c0e active (weekday checks at 6:22 PM ET)

### 6 Validation Gates (All Must Pass for Clearance)

1. **File Freshness** — cache_as_of_date ≥ 2026-04-30 + mtime > 2026-05-22 12:00 ET
2. **inst_delta_z Normalization** — KS-stat ≥ 0.30 vs pre-refresh baseline (0.743)
3. **SIGNAL_ALERT Clearance** — Entry exists, status cleared by ic_health heartbeat
4. **Top-30 Jaccard Audit** — Jaccard ≥ 0.70, attribution to manager composition (ALMS/ANAB)
5. **Governance (No Model Changes)** — Selector/ranker/sizing frozen; organic snapshots only
6. **Producer Data Quality** — G1/G2/G3 guardrails (completeness, freshness, cause attribution)

### Hard NO-GO Conditions
- Architecture freeze still in effect (→ BLOCK until ~2026-05-26)
- Cohort Jaccard < 0.70 (→ quarantine extends)
- Coverage drop ≥10pp (→ producer audit required)
- Manager Δ > 5 (→ extended quarantine ~3 weeks)
- coinvest_score_z KS ≥ 0.20 (→ manual review)
- SIGNAL_ALERT active (→ monitoring continues)

### Decision Matrix
- **All 6 gates PASS + no hard NO-GO** → Quarantine LIFTED (conditional on freeze lift)
- **Any gate FAILS or NO-GO triggered** → Quarantine EXTENDED 10 days
- **Borderline (Jaccard 0.70–0.85)** → Standard cohort window, proceed with governance

### Commands Quick Reference
- Gate 1 (file freshness): `python -c "import json; print(json.load(open('production_data/institutional_summary.json')).get('cache_as_of_date'))"`
- Gate 2 (inst_delta KS): `python -m tools.data_explorer compare --date-a 2026-04-24 --date-b 2026-05-22 --field inst_delta_z`
- Gate 3 (SIGNAL_ALERT): `grep -E "ic_health_monitor|SIGNAL_ALERT" artifacts/heartbeat/{post_date}_anomalies.md; ls artifacts/ic_dashboard/{post_date}_dashboard.md 2>/dev/null`
  - PASS: no `ic_health_monitor` line in heartbeat AND dashboard file exists (ran clean)
  - FAIL: `SIGNAL_ALERT: inst_delta_z` present in heartbeat, OR dashboard file absent (ic_health_monitor did not run)
  - Note: `rank_change_monitor_{date}.log` never existed — that artifact path was incorrect (confirmed 2026-05-24)
- Gate 4 (Jaccard): `python -m tools.check_13f_cohort_quarantine --pre-date 2026-04-24 --post-date 2026-05-22`
- Gate 5 (model audit): `git log --oneline 2026-04-25..2026-05-22 -- "common/ranker_active_contract.py" ... | wc -l` (should be 0)
- Gate 6 (producer QA): `python -m tools.check_13f_cohort_quarantine --pre-date 2026-04-24 --post-date 2026-05-22 --guardrail-check`

### Decision Memo Template
- Fill-in-the-blanks for Gate results, NO-GO checks, verdict (LIFT/EXTEND/ESCALATE)
- Include filing count, Jaccard, root cause (if EXTEND/ESCALATE)
- Commit hash required for sign-off

---

## Ready for Deployment

**Timeline ahead:**
- **~2026-05-23:** Expected ≥34 managers filed → trigger validation rerun
- **2026-05-22 onward:** Run all 6 gates in sequence, generate decision memo
- **~2026-05-26:** h20d checkpoint; if cohort cleared, freeze lift decision
- **~2026-06-20:** Final quarantine lift or extension decision

**Next action (post-May-23):**
1. Check filing count via monitoring
2. If ≥34 managers filed: execute gates in order (6 commands in runbook)
3. Populate decision memo with results
4. Document verdict and constraints (even if cleared, freeze continues until ~2026-05-26)

---

## Key Guardrails Built In

✓ Clear filing targets (50%→70%→95%→100%)  
✓ All 6 gates documented with exact commands  
✓ Hard NO-GO conditions enumerated (no surprises at decision time)  
✓ Decision matrix removes ambiguity (PASS → LIFT, FAIL → EXTEND)  
✓ Constraints listed (freeze still blocks even if cohort clears)  
✓ Template memo enforces documentation discipline  

---

## Current Status

**Runbook status:** READY FOR DEPLOYMENT  
**Validation gates:** Fully specified (commands, pass conditions, fail actions)  
**Clearance path:** Deterministic (6-gate all-or-nothing + NO-GO check)  
**Monitoring:** Active (cron job through 2026-06-20)  
**Next milestone:** ~2026-05-23 (expected trigger for validation rerun)
