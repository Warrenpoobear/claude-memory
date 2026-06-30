---
name: reference-morningstar-benchmark
description: Location and status of the Morningstar Direct benchmark return dataset and refresh skill
metadata: 
  node_type: memory
  type: reference
  originSessionId: e9d45531-8e63-4c2a-a5fe-a124168cb0bc
---

# Morningstar Benchmark Data Reference

**Local path:** `C:\Projects\morningstar` (`/mnt/c/Projects/morningstar`)
**Remote:** `github.com/Warrenpoobear/morningstar` (private)
**Skill:** `morningstar-benchmark` — handles status checks and refresh

## Files
- `benchmark_return_index_10yr.csv` — cumulative daily TR index, 29 benchmarks, 2016-07-01 → present
- `benchmark_daily_ret_pct_10yr.csv` — daily % returns computed from TR index
- `GOVERNANCE.md` — SecId map, limitations, refresh instructions

## Coverage
29 benchmarks: Bloomberg (Commodity, Global Agg hedged/unhedged, US Agg, Corp HY, Leveraged Loan), MSCI (ACWI, ACWI ex-US, EAFE, EM), Russell (1000/2000/2500/3000 × Growth/Value/Blend + Magnificent 7), S&P 500, FTSE Nareit (Composite + Apartments), KBW Nasdaq Bank, XBI, BIL, Roundhill MAGS ETF.

**Not in MD API:** Bloomberg US Govt/Credit 1-5 Yr, Bloomberg HY Muni, Credit Suisse HF, NCREIF, Galene, S&P UBS Leveraged Loan.

## Auth
`MD_AUTH_TOKEN` env var — JWT from Morningstar Direct → Account → API Token. Expires ~24h.
