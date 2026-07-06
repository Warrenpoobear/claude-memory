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

## Data feed for other projects (added 2026-07-06)
Repo is now wired as a reusable feed — consumers import, don't parse CSVs:
- `morningstar_feed.py` — pandas accessor: `benchmark_names()`, `resolve_name()` (aliases like sp500/xbi/agg + SecIds), `get_series()`, `load_return_index()/load_daily_returns(trading_days_only=True)`, `trailing_return(name,window)` (1M/3M/6M/YTD/1Y/2Y/3Y/5Y/10Y, annualized >1Y), `cumulative_return()`, `latest_date()`, `as_of_freshness()`. Data dir = module's folder, override via `MORNINGSTAR_FEED_DIR`.
- `datasets.json` — manifest (schemas, sha256, per-benchmark coverage, SecId map, as_of); regenerate with `python3 build_manifest.py` after every refresh.
- `pyproject.toml` — `pip install -e /mnt/c/Projects/morningstar` → `import morningstar_feed`.
- Validated vs source table: S&P 500 1Y 22.32 / 3Y 20.61, EM H1 21.79. No existing consumer of the benchmark CSVs (biotech_screener uses a separate per-ticker MD dataset). See [[reference_morningstar_direct_returns_workflow]].
- Merged to main locally (`1cd7b11`), push gated by git-guardrails hook (user runs `git push`).
