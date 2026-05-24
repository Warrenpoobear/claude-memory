---
name: Post-cohort-change distorted regime — inst_delta inflated until ~2026-05-15
description: After Saturday 2026-04-25 force-rebuild added 4 new 13F managers (Fairmount, Vestal Point, Kynam, Soleus), inst_delta_z is byte-identical across 04-25/04-27/04-28 because no new 13F data has arrived. Self-heal expected only at next 13F refresh (~05-15).
type: project
originSessionId: d23dc9cc-6e15-4e35-a37f-c052a24155e0
---
**Status: ACTIVE distortion regime. Do not "fix". Do not override snapshots.**

**Why:** Saturday 2026-04-25 manual `--force-overwrite --allow-weekend` rebuild closed the inst_summary gate for 4 new managers (CIKs 0001802528, 0001974915, 0001907884, 0001802630 = Fairmount Funds Management, Vestal Point Capital, Kynam Capital Management, Soleus Capital Management). The cohort_state.json quarantine note expected contamination to "collapse on Monday's organic snapshot". It did not — there has been no new 13F data since the rebuild, so each daily snapshot recomputes the same delta against the same source file. Result: inst_delta_z is byte-identical (n=297, mean|x|=0.746, max|x|=4.404, top5=[4.40, 3.52, 3.22, 2.63, 2.63]) across 2026-04-25, 04-27, 04-28.

**How to apply:** During the distortion window, treat `inst_delta_z` as a *temporarily miscalibrated input*, not a fresh signal. Selector = `0.65 × coinvest + 0.35 × inst_delta` is structurally biased. When interpreting top-30 changes (e.g. RVMD entering, ERAS exiting on 2026-04-28), attribute unusual moves to **cohort contamination first, signal second**. Do NOT recompute inst_delta_z — that violates PIT/CCFT. Do NOT override snapshots. Do NOT promote rank-driven decisions during the window without explicit attribution.

**Source data:** `production_data/institutional_summary.json` mtime = 2026-04-25 13:57 ET. Frozen since.

**Quarantine doc (preserved as historical record):** `data/snapshots/2026-04-25/cohort_state.json` — flags `inst_delta_z_valid: false`, `rank_delta_valid: false`. Documents 4 cohort entrants (ABVX, BCAX, MIRM, NBIX) and 4 dropouts (KYMR, NAMS, PTCT, DYN) on the 04-25 snapshot as "likely largely artifact-driven".

**Self-heal trigger:** Next 13F refresh, expected ~2026-05-15 (Q1 2026 filings). Once new manager filings arrive, organic inst_delta_z deltas resume; SIGNAL_ALERT should clear naturally.

**Not actionable until then:**
- ic_health_monitor SIGNAL_ALERT for `inst_delta_z` is correctly persistent. Don't suppress it.
- Selector behavior is biased but not broken. Don't retrain.
- Rank-change monitor noise during this window is partly artifact. Don't recalibrate hysteresis.

**High-value diagnostic (authorized lane — attribution only, per architecture-freeze policy):**
Run an attribution decomposing each top-30 ticker's selector_score into `0.65 × coinvest_score_z` + `0.35 × inst_delta_z` contributions. Quantify how much of the current top-30 is driven by the contaminated component. Compare against a synthetic counterfactual using inst_delta_z values from a pre-rebuild snapshot (e.g. 2026-04-23 or 04-24). This produces clarity without modifying any production state.

**End of window check (2026-05-15 → 05-22):**
- Verify `production_data/institutional_summary.json` mtime advances post-13F refresh.
- Confirm inst_delta_z values change vs the locked 04-25 distribution.
- Confirm SIGNAL_ALERT clears at next ic_health heartbeat after the refresh.
- If any of these don't happen, escalate — would mean the 13F ingest itself is broken, not just quiet.

**Companion findings on 2026-04-28:**
- qa PHASE2_FAIL is `[carried]` governance flags (catalyst_7d_count_high, bucket_drift) — not a regression.
- calibration_evidence Friday 2026-04-24 cron silently missed; next fire 2026-05-01 19:00 ET. If 05-01 also misses, escalate WSL2 cron reliability separately.

**Cohort-expansion diff (ran 2026-05-01, manual, target 04-28):** `tools/diff_cohort_expansion_artifact.py --saturday 2026-04-25 --monday 2026-04-27` → `artifacts/manager_cohort_expansion_2026-04-27.md` (note: script writes Monday-date with hyphens, NOT `_2026_04_28` as monitor expected). Verdict: ⚠ **cohort-expansion artifact dominated**:
- 3/4 Saturday entrants (ABVX, BCAX, NBIX) reverted on Monday; only MIRM persisted.
- inst_delta_z byte-identical Sat→Mon for the 5 phantom-delta names (ELVN, GERN, NRIX, TYRA, COGT) — confirms no fresh 13F data, not a real signal.
- coinvest_z deltas Sat→Mon for the 4 entrants are tiny (-0.008 to -0.017), consistent with normalization-noise only.

This is empirical confirmation of the regime memo's prediction. Standing rule reinforced: do NOT treat post-cohort-change inst_delta_z as alpha; do NOT promote rank-driven decisions during the window.
