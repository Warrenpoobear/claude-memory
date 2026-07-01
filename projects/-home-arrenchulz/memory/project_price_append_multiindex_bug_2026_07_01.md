---
name: project-price-append-multiindex-bug-2026-07-01
description: yfinance MultiIndex broke daily price append (Series-repr ticker); data backfilled 2026-07-01 but production code fix still PENDING
metadata: 
  node_type: memory
  type: project
  status: active
  related: 
    - feedback-shared-checkout-concurrency-2026-06-30
  originSessionId: 5fd143bf-4dee-427b-b532-a776caecfd37
---

Daily price refresh silently corrupted `production_data/price_history.csv`: 1 garbage row/day whose `ticker` value is a pandas Series `__repr__` (`"TICKER\n  AARD\nNAME: <date>, DTYPE: OBJECT"`).

**Root cause:** `scripts/backtest_signal_robustness.py:1567` in `extend_price_csv_safe()` builds the row `ticker` via `str(row.get("ticker", ...)).strip().upper()` **without** the `_scalar_value()` unwrap (line 1546) that every OHLCV field uses. Current yfinance returns **MultiIndex columns** (`('Close','AARD')`), so after `safe_download_per_ticker` concats per-ticker frames, `row.get("ticker")` is a `pd.Series` → `str(Series).upper()` writes the repr. The `_scalar_value(.iloc[0])` OHLCV path is also unreliable under MultiIndex.

**Timeline:** 1 corrupt row/day since **2026-04-30** (yfinance still returned flat cols, so real rows also wrote). When yfinance fully switched to MultiIndex ~**2026-06-29**, the append collapsed to ONLY the garbage row → split-adj series froze at 06-26 → snapshots 06-29/06-30/07-01 all ran on Jun 26 prices (frozen RSI, stale exposure gates, stale ACTION.md performance).

**Backfill done 2026-07-01** (data only, shared-checkout-safe, backups in scratchpad): dropped 43 confirmed-garbage rows, fetched 06-29→07-01 for all active universe tickers with correct MultiIndex flattening (`data[ticker]` per-ticker), appended, regenerated `price_history_split_adj.csv` via `scripts/repair_price_history_splits.py`. Both files now fresh through 07-01, 348 tickers, 0 corrupt.

**⚠️ PENDING:** production code NOT fixed (shared checkout — needs separate clone + PR). Fix = flatten MultiIndex / apply `_scalar_value` to the ticker field in `extend_price_csv_safe`. Until merged, the next cron daily run RE-CORRUPTS (1 garbage row/day; full collapse while yfinance stays MultiIndex). See [[feedback-shared-checkout-concurrency-2026-06-30]].
