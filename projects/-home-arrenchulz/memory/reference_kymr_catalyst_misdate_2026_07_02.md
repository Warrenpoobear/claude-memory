---
name: reference-kymr-catalyst-misdate-2026-07-02
description: "KYMR excluded from ranked book by false sev3_gate — SEC 8-K readout (\"late 2027\") mis-parsed into 2026 half-year buckets"
metadata: 
  node_type: memory
  type: reference
  status: active
  originSessionId: 5fd143bf-4dee-427b-b532-a776caecfd37
---

**KYMR (Kymera)** carries no rank in snapshots from 2026-07-02 onward due to a `sev3_gate` exclusion at module_5_composite — a **false positive**. The gate is tripped by two `DATA_READOUT` events (source SEC_8K_FILING, disclosed 2026-06-25, confidence LOW, HALF_YEAR precision) whose own text says data expected **"late 2027"** but which the extractor bucketed into 2026 half-years (H1 `2026-01-01..06-30`, H2 `2026-07-01..12-31`). The H2-2026 bucket reads as an open critical-event window → sev3 gate. Real near-term item is a low-confidence CTGov PCD (NCT07412288, 2026-12-01, "Date type unknown"). Fundamentals fine; held in both IRAs (+38%).

General bug confirmed: the SEC-8K extractor drops the year in "late/1H/2H <YYYY>" and defaults to 2026 (current year). **Universe audit 2026-07-02:** 4 clear mis-parses (KYMR, ADCT, LXEO, RAPP) + 2 borderline (BBIO, MAZE) + 1 detector false-positive (APGE). **Material ranking impact = KYMR only** (sev3_gate); ADCT/LXEO already ineligible (deep_drawdown), RAPP ranked #53 on a different catalyst. So the extractor fix prevents recurrence but KYMR is the sole current casualty.

Data-quality note at `artifacts/data_quality_note_KYMR_catalyst_misdate_2026-07-02.md`.

**FIXED 2026-07-02** — extractor root-cause fix (PR #455, merge `8c0d2af5`): in `wake_robin_data_pipeline/collectors/sec_8k_catalyst_collector.py`, bounded the two DATA_READOUT HALF_YEAR pattern `.*?` gaps to `[^.]{0,60}?` (no cross-sentence year capture), added a "late/early/end-of <year>" readout pattern, and extended half-detection (late/end-of→second, early→first). +3 regression tests. Deployed to shared-checkout working tree AND committed to branch `fix/sync-hermes-skills-dual-map-drop` (commit `3a4509e5`, pushed). Effect: the fix takes hold when the 8-K cache is next re-parsed from EDGAR (normal daily warm) — **KYMR + ADCT/LXEO/RAPP self-correct on the 2026-07-03 run**; no cache surgery / EDGAR re-fetch was done. No `catalyst_overrides.json` entry needed.
