---
name: biotech-options-monitor
description: |
  Full options chain insight layer for the biotech model universe. Use when the user says "options monitor", "options chain insight", "options snapshot", "what's the IV landscape", "what does the options chain say", "IV across the portfolio", or similar. Reads the pre-fetched universe options snapshot (production_data/options_snapshot_latest.json) and the latest rankings.csv, joins them on ticker, and surfaces: EXTREME IV / binary event names, event premium flags, term structure buckets (backwardation vs. contango), IV rank at 52-week highs, sell timing signals for sell-only names, and liquidity summary. Read-only. No trades, no model changes.
allowed-tools:
  - Bash(python3 *)
  - Bash(ls *)
  - Bash(cat *)
---

# Biotech Options Monitor

Full insight layer from the universe IV snapshot. Read-only, no model changes.

## Context

- **Data source**: `production_data/options_snapshot_latest.json` (written daily by Step 1.45 of run_daily_production.py via tastytrade market metrics API)
- **Scope**: all active universe tickers (~349), joined to top-30 from latest rankings.csv
- **Governance**: OPTIONS_SHADOW_OBSERVABILITY_ONLY / NO_MODEL_CHANGE / NO_RANKER_CHANGE

## Steps

### Step 1 — Load snapshot and rankings

```python
import json, csv, glob
from pathlib import Path

REPO = Path('/mnt/c/Projects/biotech_screener/biotech-screener')

# Options snapshot
snap_path = REPO / 'production_data/options_snapshot_latest.json'
if not snap_path.exists():
    dated = sorted((REPO / 'production_data').glob('options_snapshot_2*.json'))
    if not dated:
        raise FileNotFoundError("No options snapshot found — run collect_options_snapshot.py first")
    snap_path = dated[-1]

opt = json.loads(snap_path.read_text())
opt_meta = opt['metadata']
opt_tickers = opt['tickers']

# Coverage breakdown (new normalized schema)
valid    = opt_meta.get('coverage_valid', opt_meta.get('has_options_data', '?'))
low_liq  = opt_meta.get('coverage_low_liquidity', '?')
no_chain = opt_meta.get('coverage_no_chain', '?')
failed   = opt_meta.get('coverage_fetch_failed', 0)

print(f"Snapshot: {opt_meta['as_of_date']}  |  "
      f"Universe: {opt_meta['universe_count']}  |  "
      f"valid={valid}  low_liq={low_liq}  no_chain={no_chain}  failed={failed}  |  "
      f"event_prem={opt_meta['event_premium_detected']}")

# Latest rankings
snaps = sorted(REPO.glob('data/snapshots/*/rankings.csv'))
if not snaps:
    raise FileNotFoundError("No rankings snapshots found")

rows = []
with open(snaps[-1]) as f:
    for row in csv.DictReader(f):
        rows.append(row)
snap_date = str(snaps[-1]).split('snapshots/')[1].split('/')[0]
print(f"Rankings: {snap_date}  ({len(rows)} rows)")
```

### Step 2 — Build insight table for top-30

```python
def sf(v):
    try: f = float(v); return f if f == f else None
    except: return None

rows.sort(key=lambda r: int(float(r.get('actionable_rank', 9999))))
top30 = rows[:30]

# Sell-only constraint names (hard operational rule)
SELL_ONLY = {'ABVX'}

extreme, event_prem, backw, contango, hi_rank, lo_iv, no_data_list = [], [], [], [], [], [], []
table_rows = []

for row in top30:
    t = row['ticker']
    rank = int(float(row.get('actionable_rank', 0)))
    o = opt_tickers.get(t, {})

    atm    = sf(o.get('opt_atm_iv'))
    iv_rk  = sf(o.get('opt_iv_rank_tw'))
    iv_pct = sf(o.get('opt_iv_percentile'))
    regime = o.get('opt_iv_regime') or '—'
    liq    = o.get('opt_liquidity_state') or '—'
    evt    = o.get('opt_event_premium') or '—'
    slope  = sf(o.get('opt_term_slope'))
    usable = o.get('opt_use_for_judgment', 'N')
    has_d  = o.get('opt_has_data', 0)

    table_rows.append((rank, t, atm, iv_rk, iv_pct, regime, liq, evt, slope, usable, has_d))

    if not has_d:
        no_data_list.append(t)
    if regime == 'EXTREME':
        extreme.append((t, atm, iv_rk, iv_pct, slope))
    if evt == 'YES':
        event_prem.append((t, atm, slope))
    if slope is not None and slope < -0.10:
        backw.append((t, slope))
    if slope is not None and slope > 0.30:
        contango.append((t, slope))
    if iv_rk is not None and iv_rk > 0.70:
        note = '← SELL-ONLY + IV PEAK' if t in SELL_ONLY else ''
        hi_rank.append((t, iv_rk, note))
    if atm is not None and atm < 0.30 and regime not in ('EXTREME',):
        lo_iv.append((t, atm))

# Print table
print()
print(f"{'#':<4} {'Tkr':<7} {'IV':<7} {'IVRk':<6} {'IV%il':<6} {'Regime':<9} {'Liq':<8} {'Evt':<5} {'Slope':<8} {'OK'}")
print("─" * 82)
for rank, t, atm, iv_rk, iv_pct, regime, liq, evt, slope, usable, _ in table_rows:
    atm_s  = f"{atm*100:.0f}%"    if atm    is not None else "—"
    rk_s   = f"{iv_rk*100:.0f}%"  if iv_rk  is not None else "—"
    pct_s  = f"{iv_pct*100:.0f}%" if iv_pct  is not None else "—"
    slp_s  = f"{slope:+.2f}"      if slope  is not None else "—"
    print(f"{rank:<4} {t:<7} {atm_s:<7} {rk_s:<6} {pct_s:<6} {regime:<9} {liq:<8} {evt:<5} {slp_s:<8} {usable}")
```

### Step 3 — Surface insight buckets

```python
print()
print("═" * 82)
print()

if extreme:
    print("EXTREME IV — binary event signatures:")
    print("  (IV > 200%; term structure collapsed into front month)")
    for t, atm, rk, pct, slope in extreme:
        rk_s  = f"{rk*100:.0f}%"   if rk   is not None else "—"
        pct_s = f"{pct*100:.0f}%"  if pct  is not None else "—"
        slp_s = f"{slope:+.2f}"    if slope is not None else "—"
        note  = " ← SELL-ONLY" if t in SELL_ONLY else ""
        print(f"  {t:<7} IV={atm*100:.0f}%  IVRk={rk_s}  IV%ile={pct_s}  slope={slp_s}{note}")
    print()

if event_prem:
    print(f"EVENT PREMIUM ({len(event_prem)}/30 names) — near-term catalyst priced:")
    print("  (front month IV > back month by >10% → market expects binary outcome soon)")
    for t, atm, slope in event_prem:
        slp_s = f"{slope:+.2f}" if slope is not None else "—"
        note  = " ← SELL-ONLY" if t in SELL_ONLY else ""
        print(f"  {t:<7} IV={atm*100:.0f}%  slope={slp_s}{note}")
    print()

if hi_rank:
    print("HIGH IV RANK (TW >70%) — IV near 52-week highs:")
    for t, rk, note in sorted(hi_rank, key=lambda x: -x[1]):
        print(f"  {t:<7} IVRk={rk*100:.0f}%  {note}")
    print()

if backw:
    print("BACKWARDATION (slope < -0.10) — near-term event expected:")
    for t, s in sorted(backw, key=lambda x: x[1]):
        note = " ← SELL-ONLY" if t in SELL_ONLY else ""
        print(f"  {t:<7} slope={s:+.2f}{note}")
    print()

if contango:
    print("STEEP CONTANGO (slope > +0.30) — calm near-term, long-dated risk:")
    for t, s in sorted(contango, key=lambda x: -x[1]):
        print(f"  {t:<7} slope={s:+.2f}")
    print()

if lo_iv:
    print("LOW IV (<30%) — post-event calm or options-illiquid name:")
    for t, atm in sorted(lo_iv, key=lambda x: x[1]):
        print(f"  {t:<7} IV={atm*100:.0f}%")
    print()

cov_valid   = sum(1 for _, t, *_ in table_rows if opt_tickers.get(t, {}).get('opt_coverage_status') == 'VALID_OPTIONS')
cov_low     = sum(1 for _, t, *_ in table_rows if opt_tickers.get(t, {}).get('opt_coverage_status') == 'LOW_LIQUIDITY_CHAIN')
cov_none    = sum(1 for _, t, *_ in table_rows if opt_tickers.get(t, {}).get('opt_coverage_status') == 'NO_LISTED_OPTIONS')
cov_fail    = sum(1 for _, t, *_ in table_rows if opt_tickers.get(t, {}).get('opt_coverage_status') == 'FETCH_FAILED')
usable_ct   = sum(1 for _, t, *rest in table_rows if rest[-2] == 'YES')

# Use coverage_status names — not "no options data" (ambiguous)
if no_data_list:
    print(f"NO_LISTED_OPTIONS: {', '.join(no_data_list)}")
if cov_fail:
    fail_list = [t for _, t, *_ in table_rows if opt_tickers.get(t, {}).get('opt_coverage_status') == 'FETCH_FAILED']
    print(f"FETCH_FAILED: {', '.join(fail_list)}")
print()
print(f"COVERAGE (top-30): valid={cov_valid}  low_liq={cov_low}  no_chain={cov_none}  failed={cov_fail}")
print(f"USABLE for judgment: {usable_ct}/30")
```

### Step 4 — Sell-only sell-timing check

```python
sell_timing_flags = []
for t in SELL_ONLY:
    o = opt_tickers.get(t, {})
    iv_rk = sf(o.get('opt_iv_rank_tw'))
    iv_pct = sf(o.get('opt_iv_percentile'))
    if iv_rk is not None and iv_rk > 0.60:
        sell_timing_flags.append((t, iv_rk, iv_pct))

if sell_timing_flags:
    print()
    print("SELL TIMING — sell-only names with elevated IV:")
    print("  (IV near historical highs → exit into elevated vol while premium is high)")
    for t, rk, pct in sell_timing_flags:
        pct_s = f"{pct*100:.0f}%" if pct is not None else "—"
        print(f"  {t}: IVRk={rk*100:.0f}%  IV%ile={pct_s}  → consider accelerating exit")
```

---

## Output format

```
OPTIONS MONITOR — YYYY-MM-DD
Snapshot: YYYY-MM-DD  |  Universe: NNN/NNN  |  liquid=N  event_prem=N
Rankings: YYYY-MM-DD  (N rows)

#    Tkr     IV      IVRk   IV%il  Regime    Liq      Evt   Slope    OK
─────────────────────────────────────────────────────────────────────────────
1    COGT    55%     5%     26%    NORMAL    thin     NO    +0.21    YES
...
3    ORIC    2681%   68%    100%   EXTREME   thin     YES   -0.92    NO
...

══════════════════════════════════════════════════════════

EXTREME IV — binary event signatures:
  ORIC    IV=2681%  IVRk=68%  IV%ile=100%  slope=-0.92
  TRVI    IV=838%   IVRk=38%  IV%ile=96%   slope=-0.96
  TYRA    IV=267%   IVRk=10%  IV%ile=35%   slope=-0.77

EVENT PREMIUM (7/30 names) — near-term catalyst priced:
  ORIC    IV=2681%  slope=-0.92
  NRIX    IV=82%    slope=-0.31
  TRVI    IV=838%   slope=-0.96
  ABVX    IV=146%   slope=-0.42  ← SELL-ONLY
  XENE    IV=48%    slope=-0.35
  PHVS    IV=79%    slope=-0.09
  TYRA    IV=267%   slope=-0.77

HIGH IV RANK >70%:
  ABVX    IVRk=80%  ← SELL-ONLY + IV PEAK

BACKWARDATION (slope < -0.10):
  TRVI    slope=-0.96
  ORIC    slope=-0.92
  TYRA    slope=-0.77
  ABVX    slope=-0.42  ← SELL-ONLY
  XENE    slope=-0.35
  NRIX    slope=-0.31

STEEP CONTANGO (slope > +0.30):
  ALMS    slope=+1.11
  APGE    slope=+0.68
  MIRM    slope=+0.37
  STOK    slope=+0.33

LOW IV (<30%):
  APGE    IV=13%

NO_LISTED_OPTIONS: DRUG
FETCH_FAILED: [none]

COVERAGE (top-30): valid=3  low_liq=11  no_chain=1  failed=0
USABLE for judgment: 14/30

SELL TIMING — sell-only names with elevated IV:
  ABVX: IVRk=80%  IV%ile=98%  → consider accelerating exit
```

## Thresholds

| Signal | Threshold | Interpretation |
|--------|-----------|---------------|
| EXTREME IV | ATM IV > 200% | Pure binary event; term structure collapsed |
| EVENT PREMIUM | front > back by >10% | Catalyst priced in near-term |
| HIGH IV RANK | TW rank > 70% | Near 52-week highs — elevated risk perception |
| BACKWARDATION | slope < -0.10 | Front-heavy risk; near-term event expected |
| STEEP CONTANGO | slope > +0.30 | Market calm near-term; longer-dated uncertainty |
| LOW IV | ATM IV < 30% | Post-event, illiquid options market, or low-float |
| SELL TIMING | SELL_ONLY + IVRk > 60% | Exit into elevated IV window |

## Governance

```
OPTIONS_SHADOW_OBSERVABILITY_ONLY / NO_MODEL_CHANGE / NO_RANKER_CHANGE /
NO_SELECTOR_CHANGE / NO_SIZING_CHANGE / NO_TRADING_CHANGE
```

Options IV signals are observational only. They may inform timing of rebalances or
exits (particularly for sell-only names) but do NOT alter rankings, weights, or
screening logic. Refer to biotech-rebalance and the ISS for trade authorization.

## Session-end learning

After completing this skill's task, if you encountered an unexpected behavior, constraint, API response, or workflow edge case, log it:

```
[LRN-YYYYMMDD-NNN]
Pattern-Key: SKILL_BIOTECH_OPTIONS_MONITOR_{description}
Area: hermes_ops | data_pipeline | research | portfolio
Promotion-lane: skill | none
Recurrence-Count: 1
Context: <one line — what happened>
Rule: <one line — what to do differently>
Suggested-Action: <patch to this SKILL.md, or none>
```

Recurrence ≥ 3 in 7 days → propose a patch to this `SKILL.md` via `tools/pattern_to_skillpatch.py`. Full protocol: see `self-improving` skill.
