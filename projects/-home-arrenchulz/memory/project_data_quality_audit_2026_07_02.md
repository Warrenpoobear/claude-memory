---
name: project-data-quality-audit-2026-07-02
description: Cross-ticker data-quality audit of 2026-07-02 snapshot — top finding is incomplete defensive_features enrichment (52 active tickers)
metadata: 
  node_type: memory
  type: project
  status: active
  related: 
    - reference-kymr-catalyst-misdate-2026-07-02
  originSessionId: 5fd143bf-4dee-427b-b532-a776caecfd37
---

Ran an all-tickers data-quality audit on the 2026-07-02 snapshot (302 screened / 324 active). Note at `artifacts/data_quality_audit_2026-07-02.md`.

**Top actionable finding (🔴): incomplete `defensive_features` enrichment.** `de_vol_60d`/`de_beta_xbi_60d`/`de_drawdown`/`de_rsi_14d` are read from each universe record's embedded `defensive_features` block (`decision_engine.py:15`, `run_screen.py:5132`). **52 of 324 active tickers lack that block** (272 have it) → `de_vol_60d` missing for 44 screened names despite ample price history (TEVA 11k bars, CAPR, ABBV, DNTH, VKTX…). Blind spot: `coverage_status` does NOT track defensive_features, so the coverage gate can't see it. Remediation (NOT applied, needs sign-off): re-run defensive-features enrichment over the full active universe + add defensive_features to coverage_status. Sample missing: ABBV, AKBA, CAPR, CPRX, DNTH, TEVA, VKTX, VRDN, VSTM, +others.

Clean axes: price freshness (0 missing, 1 stale CNTA), coverage_status (all covered), eligibility normal (70 deep_drawdown, 5 fundamental_red_flag), sev3_gate (12; 11 legit, 1=KYMR fixed).

Catalyst mis-parse (18 flagged): 17 SEC-8K/6K → fixed by PR #455 (self-correct on 07-03 re-parse); 1 CTGOV (GILD) benign. See [[reference-kymr-catalyst-misdate-2026-07-02]]. 46 tickers carry imprecise HALF_YEAR/YEAR CRITICAL events (sev3 risk surface) — inherent, monitor.
