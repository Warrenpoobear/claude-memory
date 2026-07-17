---
name: ees-shadow-monitor-state-2026-06-23
description: "EES v3 shadow monitor — current state, observation gates, research package complete, raw_veto_core selected as lead diagnostic policy (2026-06-25)"
metadata: 
  node_type: memory
  type: project
  originSessionId: f3567a5c-fdf8-4963-9f3c-a55b32f3f06a
---

EES diagnostic chain closed at design-only (2026-06-23). No production action authorized.

**Commit chain (original):**
- `e80c3ff2` — EES forward validation: PASS diagnostic signal observed
- `fb52071f` — Attribution: Phase 3 CT_PRIMARY_COMPLETION left-tail avoidance
- `c35fc1ba` — Shadow monitor spec
- `60876b11` — Shadow monitor implementation (landed on main directly)
- `376d9e9d` — Settled-row immutability hardening
- `96733236` — Left-tail guardrail design memo

**EES v3 shadow research package (2026-06-25):**
- `149c8f56` — 4 research scripts + promotion simulator memo
- `6123739c` — Veto autopsy (HL bucket analysis)
- `0d47544f` — Conditional veto simulator

**Research package scripts (all DIAGNOSTIC_ONLY):**
- `scripts/research/ees_v3_shadow_variants.py` — daily 5-variant tracker
- `scripts/research/ees_v3_disagreement_ledger.py` — ranker vs EES v3 bucket analysis
- `scripts/research/ees_v3_regime_analysis.py` — early/late IC decomposition
- `scripts/research/ees_v3_promotion_simulator.py` — 9-policy PIT backtest
- `scripts/research/ees_v3_veto_autopsy.py` — HL bucket failure mode analysis
- `scripts/research/ees_v3_conditional_veto_simulator.py` — evidence-qualified veto tests

**Key artifacts:**
- `artifacts/readiness/EES_V3_PROMOTION_SIMULATOR_2026_06_25.md`
- `artifacts/readiness/EES_V3_VETO_AUTOPSY_2026_06_25.md`
- `artifacts/readiness/EES_V3_CONDITIONAL_VETO_SIMULATOR_2026_06_25.md`

---

## Final model stance (operator decision 2026-06-25)

**EES_V3_ROLE = RANKER_FALSE_POSITIVE_VETO** (not a boost, not a general veto — a financing/overpricing false-positive detector)

**LEAD_POLICY = RAW_VETO_CORE**
- IC 0.0639, t_NW=2.36 at 63d, mean excess +3.53%, late-regime +7.1% (EARLY +2.4% → LATE +7.1%)
- 76 PIT snapshots, 2020-01-31 → 2026-04-16
- Veto autopsy: 55.6% true-negative rate overall, 60.5% in late regime — improving with coverage expansion
- Dominant failure modes: dilution_overhang (18.8%, 67% tn, -7.4% excess), market_already_priced (6.0%, 62.5% tn, -6.0% excess)
- Weak failure mode: no_options_coverage (67.4% of HL, only 52.9% tn, ~0 excess) — near-random but still worth vetoing as portfolio tightening

**CONDITIONAL_POLICY = WATCHLIST_ONLY**
- conditional_veto_v1: IC 0.0731 (higher per-veto accuracy) but t_NW=2.14 (lower power), fires only 1.8 vs 7.0 vetoes/snap
- Precision-recall tradeoff kills statistical power — relaxing veto frequency costs more than it saves
- Correct upgrade path: wait for coverage expansion, not conditional filtering

**Governance labels:**
- `EES_V3_RAW_VETO_CORE_SELECTED_AS_LEAD_DIAGNOSTIC_POLICY`
- `CONDITIONAL_VETO_RETAINED_AS_SECONDARY_RESEARCH_NOTE`
- `FREEZE_ACTIVE_PENDING_20D_SHADOW_GATE_AND_OPERATOR_APPROVAL`
- `NO_PRODUCTION_WIRING_AUTHORIZED`

---

## Shadow monitor gates — UPDATE 2026-07-17

- 20d gate **MET**: 49/20 settled observations (was "unknown/unmet" as of 06-23).
- Cumulative 20d veto alpha **+8.2%** (selected +1.2% vs vetoed −7.0%), 87% alpha+ rate.
- Gate MET ≠ freeze lifted. Still `FREEZE_ACTIVE | DIAGNOSTIC_ONLY | NO_PRODUCTION_DECISIONING`. Promotion needs explicit operator memo.

**Scheduling reality (verified 2026-07-17): NO CRON — by design.**
- Lead script `scripts/research/ees_v3_raw_veto_shadow_card.py` carries a hard-coded `NO_CRON` governance label; nothing in WSL crontab / tools / Hermes schedules it (only `tools/build_personal_pilot_action_card.py` *reads* its JSON output).
- Daily cards are produced by **manual runs of the `biotech-ees-monitor` skill** (Step 4 → `tee -a logs/ees_v3_veto_monitor.log`).
- The `biotech-ees-monitor` skill doc's claim of cron `ees3a1b2c3d4e5 @ 17:50 ET` is **stale/inaccurate** vs. the code — do NOT treat a missing evening run as an outage.
- Operator decision 2026-07-17: **keep it manual**, respect NO_CRON. (Cron-safe sibling `tools/build_ees_shadow_card.py` exists but builds the older gate-progress card, a different artifact.)
- See [[feedback_pause_between_control_plane_changes]].

**Current lead script + ledger (v3 — v2 retired):**
```bash
cd /mnt/c/Projects/biotech_screener/biotech-screener
python3 scripts/research/ees_v3_raw_veto_shadow_card.py --as-of-date YYYY-MM-DD
```
Ledger: `artifacts/shadow/ees_v3_raw_veto_shadow_ledger.jsonl`

**Next step:** daily veto shadow card tracking raw_veto_core performance under current coverage regime (script being built as of 2026-06-25).

**Next memo (only after gates met):** `EES_V2_PHASE3_SHADOW_MONITOR_EVALUATION_2026_MM_DD.md`

**Why:** Do not promote until 20d shadow gate is met AND operator approval received. The research shows veto is improving in the late regime — the gate will provide forward confirmation under high-coverage conditions.
