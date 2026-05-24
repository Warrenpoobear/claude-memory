---
name: Cohort-change quarantine flag for manager additions
description: Snapshots produced immediately after 13F manager additions are NOT decision-grade for inst_delta_z or rank_delta — they are inflated because new managers' existing holdings appear as "new institutional buys" against a smaller-cohort prior. Always emit a quarantine flag and wait for the next snapshot before trusting deltas.
type: feedback
originSessionId: 3fb90187-7159-4921-96d4-7093cc61ab88
---
After adding any 13F manager to `production_data/manager_registry.json`, the FIRST snapshot built post-addition has contaminated `inst_delta_z` and `rank_delta`. The new managers' holdings count as "new institutional buys" vs the prior snapshot built with fewer managers.

**Why:** B6 selector is coinvest 65% + inst_delta 35%. Coinvest barely moves under cohort expansion (z-score renormalization noise, max abs delta ~0.014 in the 2026-04-25 case). But inst_delta_z spikes +0.5 to +0.8 on names held by the new managers, driving cohort entrants/dropouts that look like real signal but are not.

**How to apply:**
- `tools/onboard_manager.py` automatically emits two markers on each addition:
  - `production_data/cohort_pending.json` (consumed by next production snapshot)
  - `data/snapshots/<today>/cohort_state.json` (if a snapshot already exists for today; flags inst_delta_z_valid=false and rank_delta_valid=false)
- A snapshot is decision-grade for inst_delta/rank only when `cohort_state.json` is absent OR all `validity.*_valid` flags are true.
- The SECOND snapshot post-change is valid again — it compares like-for-like cohorts.
- Never interpret rank deltas, top-30 cohort changes, or new-entrant/dropout claims from a quarantined snapshot. Wait for the next snapshot.
- Schema versions: `cohort_pending.v1`, `cohort_state.v1`. Production screen integration to auto-consume `cohort_pending.json` is still TODO — for now, the manual-edit path of `tools/onboard_manager.py` is the only producer.

**Reference incident:** 2026-04-25 — added Fairmount/Vestal/Kynam/Soleus (38→42 managers). Saturday rebuild showed 4 new top-30 entrants (ABVX, BCAX, MIRM, NBIX) and 5 phantom +0.5 to +0.8 inst_delta_z movers (ELVN, GERN, NRIX, TYRA, COGT). Tuesday 2026-04-28 09:00 EDT cron diff against Monday's organic snapshot will measure how much was artifact.
