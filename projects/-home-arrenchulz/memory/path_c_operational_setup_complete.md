---
name: path-c-operational-setup-complete
description: Path C governance monitoring infrastructure deployed and ready (2026-05-28)
metadata: 
  node_type: memory
  type: project
  status: active
  effective_period: 2026-05-28 to 2026-06-03
  decision_date: 2026-05-28
  window_close: 2026-06-03
  originSessionId: ee8dbb2b-22a4-49ff-8d99-f5e261281a6f
---

# Path C Operational Setup — Complete (2026-05-28)

## Status: READY FOR MONITORING

Governance decision (Path C: temporary catalyst timing policy override) is locked and operationalized. Daily monitoring infrastructure and 2026-06-03 window close decision automation are deployed and tested.

---

## What's Running

### 1. Daily Monitoring Checklist
**File:** `tools/daily_path_c_monitoring.sh` (2.2 KB, executable)

Runs four checks post-snapshot (typical 10 AM ET):
1. Forward Eval IC Status → queries IC ledger, shows latest_ic vs floor (0.0200)
2. Portfolio Drawdown vs XBI → checks portfolio_summary.json; warns if > 1pp, critical if > 2pp
3. 13F Cohort Stability → verifies governance memo, documents Jaccard >= 0.70
4. Emergency Exit Conditions → lists two hard triggers (drawdown > 2pp, cohort Jaccard < 0.70)

**Expected output (early window):** NO_DATA (expected; PIT cache horizons filling)

### 2. IC Monitoring Tool
**File:** `tools/monitor_forward_eval_ic.py` (already integrated into Step 5a of `run_daily_production.py`)

Called by daily checklist and `run_daily_production.py` post-snapshot. Extracts IC values from `forward_eval_ic_ledger.jsonl`. Reports:
- Status: ABOVE_FLOOR / BELOW_FLOOR / NO_DATA
- Latest observation date
- mean_ic value (or null if cold-start)

### 3. Window Close Decision Automation
**File:** `tools/path_c_window_close_decision.py` (6.1 KB, executable)

Operator runs on 2026-06-03 to execute decision tree:
- **Scenario A (observable IC):** Evaluate against floor → Path C valid (IC >= 0.0200) or revoke (IC < 0.0200)
- **Scenario B (unobservable IC—expected):** Operator chooses → extend window (~2026-06-17) or revert to HOLD

Output: Formatted decision summary with action items and next steps.

---

## Cold-Start IC Status (Expected)

Forward eval gate requires 10+ prior snapshots with filled 20-day return horizons. By 2026-06-03:
- **Expected status:** NO_DATA or cold-start warnings
- **Why:** PIT cache hasn't yet accumulated late-May 20-day forward returns (real-time lag ~2 weeks)
- **When IC appears:** ~2026-06-17 (first meaningful prints)
- **This is normal and anticipated.** Governance decision designed for this (IC_UNOBSERVABLE scenario in decision tree).

---

## Documentation

### Primary Reference (Governance)
**File:** `artifacts/readiness/GOVERNANCE_DECISION_PATH_C_2026_05_28.md`

Full decision memo: rationale, exit conditions, IC measurement gap, Path A design track.

### Primary Reference (Monitoring Framework)
**File:** `docs/hermes_skills/path-c-governance-monitoring.md`

Technical framework: IC ledger infrastructure, floor threshold, decision logic, metrics/triggers table.

### Operational Runbook (Daily Use)
**File:** `docs/hermes_skills/path-c-operational-runbook.md`

Quick reference + step-by-step guides:
- How to run daily checklist
- How to interpret output
- Window close decision tree (extend vs revert)
- Emergency exit conditions and escalation
- Timeline and references

---

## Timeline

| Date | Action | Command | Status |
|------|--------|---------|--------|
| 2026-05-28 | Path C APPROVED | (commit 8cbe1648) | ✓ DONE |
| 2026-05-28 → 06-03 | **Daily monitoring** | `bash tools/daily_path_c_monitoring.sh` | ⏳ ACTIVE |
| 2026-05-28 → 06-03 | IC auto-extraction (pipeline) | `run_daily_production.py` Step 5a | ⏳ ACTIVE |
| 2026-06-03 10:00+ ET | **Window close decision** | `python3 tools/path_c_window_close_decision.py` | ⏳ PENDING |
| 2026-06-03 | **Document decision** | Create `WINDOW_CLOSE_DECISION_2026_06_03.md` | ⏳ PENDING |
| ~2026-06-17 | First observable IC (if extended) | Await PIT cache fill | ⏳ EXPECTED |
| 2026-06-03+ | Path A design begins (post-freeze) | Portfolio timing gates spec | ⏳ PENDING |

---

## Operator Checklist (Now Through Window Close)

- [ ] **Daily:** Run `bash tools/daily_path_c_monitoring.sh` post-snapshot (or set cron)
- [ ] **Anytime:** Check IC status with `python3 tools/monitor_forward_eval_ic.py`
- [ ] **Watch for:** Any deviation in portfolio drawdown (warn if > 1pp, critical if > 2pp)
- [ ] **Watch for:** 13F cohort changes (Jaccard < 0.70 triggers escalation)
- [ ] **2026-06-03:** Run window close automation → make operator decision
- [ ] **2026-06-03:** Document decision in governance ledger with timestamp

---

## Key Insights

1. **IC_UNOBSERVABLE is expected.** Forward eval gate cold-start is normal. PIT cache horizons fill ~2 weeks behind observation date. First meaningful IC prints expected ~2026-06-17, after window close.

2. **Cold-start is not a failure.** The governance decision anticipated this. Operator decision tree has dedicated IC_UNOBSERVABLE branch: extend (wait for IC) or revert (go to HOLD).

3. **Two hard exit conditions remain active:** Portfolio drawdown > 2pp vs XBI (automatic revocation) or 13F cohort instability (Jaccard < 0.70, escalation).

4. **Path C is controlled exception, not indefinite waiver.** Hard decision point on 2026-06-03: observable IC floor evaluation OR operator extend/revert choice. No auto-extension.

5. **Path A is durable fix.** Post-freeze portfolio timing gates (max 30% in 0–7d, min 40% in 90+d) will structurally decouple institutional signal from portfolio timing policy.

---

## Files Summary

| File | Type | Purpose | Status |
|------|------|---------|--------|
| `tools/daily_path_c_monitoring.sh` | Executable | Daily 4-check post-snapshot | ✓ Ready |
| `tools/monitor_forward_eval_ic.py` | Python tool | IC status query + ledger update | ✓ Ready (integrated) |
| `tools/path_c_window_close_decision.py` | Python script | 2026-06-03 decision automation | ✓ Ready |
| `artifacts/forward_eval_ic_ledger.jsonl` | Data ledger | IC value extraction (auto-populate) | ⏳ Cold-start |
| `artifacts/readiness/GOVERNANCE_DECISION_PATH_C_2026_05_28.md` | Governance memo | Full decision rationale | ✓ Locked |
| `docs/hermes_skills/path-c-governance-monitoring.md` | Skill doc | IC monitoring framework | ✓ Complete |
| `docs/hermes_skills/path-c-operational-runbook.md` | Runbook | Daily operations guide | ✓ Complete |

---

## Next: Monitoring Window

From 2026-05-28 through 2026-06-03, follow daily checklist. Monitor for:
- IC trend (once data starts appearing, likely post-2026-06-17)
- Portfolio drawdown vs XBI (watch for breaches)
- 13F cohort stability (watch for manager changes)

On 2026-06-03, run window close automation and make decision: extend observation window or revert to HOLD.

---

**Status:** ✅ Operational infrastructure deployed and tested  
**Ready for:** Daily monitoring through 2026-06-03 window close  
**Next decision point:** 2026-06-03, 10 AM ET (window close automation)  
**Operator:** dschulz@wakerobin.co

