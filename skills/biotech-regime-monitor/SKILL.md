---
name: biotech-regime-monitor
description: |
  Run the daily market regime monitor for the DEM pilot. Use when the user says "run regime monitor", "check regime", "what's the regime today", "regime status", "update regime", or similar. Fetches live VIX + XBI/SPY 30d historicals via Robinhood MCP, writes the regime_inputs cache, then runs the tracking script which accumulates a regime ledger and self-calibrates after 20d windows settle.
allowed-tools:
  - mcp__robinhood-trading__get_index_quotes
  - mcp__robinhood-trading__get_equity_historicals
  - Bash(python3 *)
  - Bash(ls *)
  - Bash(cat *)
---

# Biotech Regime Monitor

Daily regime classification + self-calibrating ledger for the DEM pilot.

## Context

- **Regime engine**: `regime_engine.py` — BULL / BEAR / VOLATILITY_SPIKE / SECTOR_ROTATION / SECTOR_DISLOCATION / RECESSION_RISK / CREDIT_CRISIS
- **Primary inputs**: VIX (from RH `get_index_quotes`), XBI/SPY 30d relative performance (from `get_equity_historicals`)
- **Cache**: `data/caches/robinhood/{date}/{date}_rh_regime_inputs.json`
- **Ledger**: `artifacts/regime_monitor/regime_history.jsonl` (append-only)
- **Self-calibration**: After each 20d window settles, compute whether regime label + signal adjustments matched actual XBI outcome
- **VIX instrument ID**: `3b912aa2-88f9-4682-8ae3-e39520bdf4db`
- **Classification**: PILOT_ACTION_INFRASTRUCTURE / NO_MODEL_CHANGE / NO_AUTONOMOUS_TRADING

## Steps

### 1 — Determine as-of date
Use today's date unless user specifies. Format: YYYY-MM-DD.

```python
from datetime import date
AS_OF = date.today().isoformat()
```

### 2 — Fetch live market data (MCP calls, run in parallel)

**Call A — Index quotes (VIX, SPX, RUT, NDX):**
```
get_index_quotes(instrument_ids=[
  "3b912aa2-88f9-4682-8ae3-e39520bdf4db",  # VIX
  "432fbbb8-b82c-454a-852d-eb85382c7066",  # SPX
  "30245bf8-c3a3-454e-9e1f-1abde83da1f9",  # RUT
  "50c298f7-27a8-44a1-b049-ec153cf2892f",  # NDX
])
```

**Call B — XBI + SPY 30d daily bars:**
```
get_equity_historicals(
  symbols=["XBI", "SPY"],
  start_time="<30d ago>T00:00:00Z",
  interval="day",
  adjustment_type="split"
)
```

### 3 — Write regime_inputs cache

```python
import sys
sys.path.insert(0, '/mnt/c/Projects/biotech_screener/biotech-screener')
from tools.rh_feed_sync import write_regime_inputs

path = write_regime_inputs(AS_OF, hist_response, idx_response)
```

### 4 — Run the tracking script

```bash
cd /mnt/c/Projects/biotech_screener/biotech-screener
python3 scripts/run_regime_monitor.py --as-of-date AS_OF 2>&1
```

### 5 — Report format

```
REGIME MONITOR — YYYY-MM-DD

Regime:      SECTOR_DISLOCATION  (confidence=0.48)
VIX:         18.41
XBI 10d:     +17.1%
SPY 10d:     -1.2%
XBI vs SPY 30d: +17.7pp

Transition:  NO CHANGE  (3rd day in SECTOR_DISLOCATION)
  — or —
Transition:  ⚠ REGIME SHIFT: SECTOR_DISLOCATION → BULL

Signal adjustments implied:
  momentum    ×0.85 (dampened — don't chase the run)
  institutional ×1.20 (favor institutional-owned names)
  quality     ×1.10 (favor balance-sheet quality)

Self-calibration (last N settled 20d windows):
  Windows settled: N
  Accuracy: X/N correct direction calls
  Avg regime prediction error: ±Xpp vs actual XBI 20d
  Miscalibration flag: [NONE / FLAGGED: <detail>]

GOVERNANCE: INFORMATIONAL_ONLY | NO_MODEL_CHANGE | NO_RANKER_CHANGE
```

## Self-Calibration Logic

After each day's regime is recorded, the script checks whether the window from **20 trading days ago** has settled:

1. Find the regime label from 20 trading days prior
2. Compute actual XBI 20d return from price history
3. Compute actual SPY 20d return
4. Compare to regime prediction: did XBI outperform/underperform SPY as predicted?
5. Append `fwd_20d_settled=True` with actual returns to that ledger row
6. Accumulate calibration metrics

**Miscalibration flags** (advisory only — never triggers automatic model changes):
- BULL predicted but XBI 20d < 0% → false positive
- BEAR predicted but XBI 20d > +5% → false positive  
- SECTOR_DISLOCATION predicted but XBI vs SPY 20d spread < 5pp → false positive

## Pitfalls

- **VIX instrument ID must match exactly** — `3b912aa2-88f9-4682-8ae3-e39520bdf4db`. Do not use XBI's instrument ID by mistake.
- **XBI/SPY via get_equity_quotes (ETFs), not get_index_quotes** — XBI and SPY are ETFs; only VIX/SPX/RUT/NDX use get_index_quotes.
- **start_time for 30d**: Use 35 calendar days ago to guarantee ≥30 trading days of bars.
- **Settled window accuracy**: Only count windows where the 20d-ago row exists in the ledger. Skip if ledger < 20 rows.
- **No automatic weight changes**: Miscalibration flags are advisory. Operator must explicitly authorize any regime engine threshold adjustment.

## Session-end learning

After this skill runs, if anything surprised you, log a learning per `~/.claude/docs/session-end-learning.md` (Pattern-Key `SKILL_BIOTECH_REGIME_MONITOR_{description}`).
