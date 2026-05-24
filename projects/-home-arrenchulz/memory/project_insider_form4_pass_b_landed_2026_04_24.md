---
name: Insider Form 4 Pass B landed — observation window open
description: insider_net_buy_value_90d wired as diagnostic pass-through on 2026-04-24 via common/insider_enrichment.py. Scoring lane stays closed. Post-production checklist + no-go items listed below.
type: project
originSessionId: bdca0417-f353-48f3-b6a7-b0d9fada1d78
---
`insider_net_buy_value_90d` is now wired into rankings.csv as a diagnostic pass-through column.

**Why:** Pass A (incremental Form 4 refresh) + Pass B (on-demand enrichment at rankings-assembly time) completed 2026-04-24. Reuses existing `compute_insider_features()` from `tools/fetch_form4_insider.py` with PIT-safe `filing_date` windowing. Scoring lane for this field was closed 2026-04-05 and remains closed — the column is for expectation-layer context and QA visibility only.

**How to apply — tomorrow's (2026-04-25) production-cycle verification, in order:**

1. `rankings.csv` contains the `insider_net_buy_value_90d` column (index ~156 in SNAPSHOT_COLUMNS).
2. Row count is unchanged vs. prior day's snapshot.
3. `artifacts/production_qa/2026-04-25_report.json` feature_coverage detail shows `insider_net_buy_value_90d*=NN.N%; * = tracked nonblocking field` — no longer `MISSING (tracked_nonblocking)`.
4. Blank-vs-0.0 semantics preserved: tickers with no raw file = blank string; tickers with raw file + no P/A or S/D in the 90d window = `0.0`. Don't collapse them.
5. Top-30 DEM selections did NOT shift because of this column. If top rankings change materially, something leaked into scoring — investigate before the next cycle.

**Do-not-do list while the observation window is open:**

- Do NOT flip `insider_net_buy_value_90d` to `required=True` in `tools/production_qa_check.py` until coverage is stable ≥30% for 5 consecutive production snapshots. Earliest eligible flip date: **2026-05-01**.
- Do NOT re-add `insider_net_buy_value_90d` to `common/feature_registry.py`. Lane stays closed.
- Do NOT wire the 30d/60d variants, cluster/exec/unique-buyer flags, or `insider_net_buy_shares_*`. Pass B is one-field only.
- Insider **selling** is noisy (liquidity, taxes, 10b5-1, option exercises). Do not promote insider buying as alpha without dedicated incremental-predictive-value validation — and even then, buying only, not net.

**Key files (for fast recall):**
- `common/insider_enrichment.py` — the enrichment entrypoint
- `tools/fetch_form4_insider.py` — parser + aggregator (incremental mode since 2026-04-24)
- `data/form4/raw/{TICKER}.json` — per-ticker transaction store (341 tickers)
- `data/form4/form4_panel.csv` — event-keyed panel (27,766 rows as of 2026-04-24). Do NOT naively merge into rankings on `(ticker, as_of_date)` — panel is event-keyed, not daily-keyed.
- `tests/test_insider_rankings_enrichment.py` — 7 tests on the Pass B contract
- `tests/test_form4_insider.py` — 34 tests (30 parser/feature + 4 incremental-mode)
