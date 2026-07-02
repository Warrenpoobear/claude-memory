---
name: feedback-snapshot-qa-marketdata-falsepos
description: "biotech-snapshot-qa skill wrongly flags market_data.json as a missing snapshot artifact — it's a production_data input, not per-snapshot"
metadata: 
  node_type: memory
  type: feedback
  status: active
  originSessionId: 5fd143bf-4dee-427b-b532-a776caecfd37
---

The `biotech-snapshot-qa` skill's artifact-presence check lists `market_data.json` as an expected file in the snapshot dir. It is NOT a per-snapshot artifact — it lives in `production_data/market_data.json` and is tracked via the run_manifest `market_data_refresh` hash. It is absent from every snapshot dir (verified 06-30, 07-01, 07-02), so the check is a **false positive**.

**Why:** don't treat this "MISSING" as a QA failure. Market-data freshness/coverage is validated by the pipeline's market-data staleness/coverage gates and recorded in run_manifest (collected_at, ticker_count, coverage_pct, sha256).

**How to apply:** when running snapshot QA, verify market data via `run_manifest.json` → `market_data_refresh`, not by looking for market_data.json in the snapshot dir. The skill's expected-artifact list could drop market_data.json (or point it at production_data/).
