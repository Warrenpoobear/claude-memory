---
name: biotech-autopsy
description: |
  Run a PIT-clean forensic attribution post-mortem on YTD Top-30 failure windows. Use when the user says "run the autopsy", "failure post-mortem", "attribution analysis", "why did the model miss", "forensic review", "analyze failure windows", or similar. Reconstructs per-name contribution, feature bucket attribution, counterfactuals, and failure classification. RESEARCH_AUTOPSY / NO_MODEL_CHANGE. Writes artifacts to artifacts/autopsy/ytd_top30_failure_postmortem_2026/.
allowed-tools:
  - Bash(python3 *)
  - Bash(ls *)
  - Bash(cat *)
  - Bash(mkdir *)
  - Read
  - Write
---

# Biotech YTD Top-30 Forensic Attribution

RESEARCH_AUTOPSY / VALIDATION_DIAGNOSTIC / NO_MODEL_CHANGE / NO_RANKER_CHANGE / NO_SELECTOR_CHANGE / NO_SIZING_CHANGE / NO_TRADING_CHANGE

## Data Environment

```
REPO=/mnt/c/Projects/biotech_screener/biotech-screener

Price history (split-adj, PIT-safe):
  $REPO/production_data/price_history_split_adj.csv
  cols: date, ticker, close, open, high
  coverage: 1982-02-16 → 2026-06-18, 351 tickers incl XBI

Rankings snapshots:
  $REPO/data/snapshots/{YYYY-MM-DD}/rankings.csv
  key fields: ticker, actionable_rank, catalyst_bucket, catalyst_days, 
              priced_move_pct, ees_v3_gate, ees_v3_score, ees_v3_pctile,
              ovf_has_event_premium, ovf_composite, ovf11_score,
              expectation_error_score, expectation_confidence,
              coinvest_score_z, inst_delta_z, short_interest_pct,
              market_cap_usd, price, size_band, regime_label,
              selector_clinical_block, selector_catalyst_block,
              selector_survivability_block, fundamental_red_flag

Existing aggregate validation (no per-name data):
  $REPO/artifacts/autopsy/top30_ytd_validation/2026_ytd_top30_validation.json
  25 weekly non-overlapping windows, 2026-01-02 → 2026-06-22

Output directory:
  $REPO/artifacts/autopsy/ytd_top30_failure_postmortem_2026/
```

## Failure Window Definition

Mark a window as FAILED if ANY of:
```
5d XS return <= -1.50pp
IC <= -0.20 (if available)
4-week rolling XS drawdown <= -5.00pp
```

**YTD confirmed failure windows** (from 2026_ytd_top30_validation.json):
```
2026-03-16 → 2026-03-23   xs = -2.92pp  *** HARD FAIL
2026-05-04 → 2026-05-11   xs = -1.95pp  *** HARD FAIL
2026-05-19 → 2026-05-26   xs = -1.67pp
2026-05-26 → 2026-06-02   xs = -2.45pp  *** HARD FAIL  (KEY CLUSTER)
2026-06-01 → 2026-06-08   xs = -1.64pp               (KEY CLUSTER)
2026-06-08 → 2026-06-15   xs = -1.44pp  (borderline)
```

Near-miss (check for 4-week rolling drawdown):
```
2026-04-20 → 2026-04-27   xs = -1.44pp  (borderline)
2026-04-27 → 2026-05-04   xs = -0.39pp  (rolling context)
```

## Analysis Steps

### Step 1 — Load price data and build 5d return matrix

```python
import pandas as pd, numpy as np, json
from pathlib import Path

REPO = Path('/mnt/c/Projects/biotech_screener/biotech-screener')
prices = pd.read_csv(REPO / 'production_data/price_history_split_adj.csv', parse_dates=['date'])
prices = prices.pivot(index='date', columns='ticker', values='close').sort_index()

# XBI benchmark
xbi = prices['XBI'].dropna()
```

### Step 2 — For each failure window, reconstruct Top-30 from snapshot

Snapshot date selection: use the snap_date (the window start date), find the
closest available snapshot at or before snap_date:
```python
import glob
snap_dirs = sorted(glob.glob(str(REPO / 'data/snapshots/????-??-??')))
snap_dates = [Path(d).name for d in snap_dirs if not any(x in d for x in ['_', 'QUARANTINED'])]

def find_snap(target_date):
    """Closest snapshot at or before target_date."""
    eligible = [d for d in snap_dates if d <= target_date]
    return eligible[-1] if eligible else None
```

Load rankings for that snap:
```python
df = pd.read_csv(REPO / f'data/snapshots/{snap_date}/rankings.csv')
top30 = df[df['actionable_rank'] <= 30].copy()
bench31_60 = df[(df['actionable_rank'] > 30) & (df['actionable_rank'] <= 60)].copy()
```

### Step 3 — Compute per-name 5d forward returns (PIT-clean)

```python
def compute_5d_returns(tickers, snap_date, fwd_date, prices):
    """Return dict of ticker -> 5d return, enforcing endpoint parity."""
    rets = {}
    for t in tickers:
        if t not in prices.columns:
            continue
        p = prices[t]
        # find price on snap_date or nearest prior
        snap_p = p.loc[:snap_date].iloc[-1] if not p.loc[:snap_date].empty else None
        fwd_p = p.loc[:fwd_date].iloc[-1] if not p.loc[:fwd_date].empty else None
        if snap_p and fwd_p and snap_p > 0:
            rets[t] = (fwd_p - snap_p) / snap_p
    return rets

# XBI 5d return for same window
xbi_ret = (xbi.loc[:fwd_date].iloc[-1] - xbi.loc[:snap_date].iloc[-1]) / xbi.loc[:snap_date].iloc[-1]
```

### Step 4 — Build per-name contribution table

```python
n = len(top30_returns)  # should be ~30
rows = []
for ticker, ret in top30_returns.items():
    xs = ret - xbi_ret
    rows.append({
        'window': f'{snap_date}→{fwd_date}',
        'ticker': ticker,
        'rank': df_snap.loc[df_snap.ticker==ticker, 'actionable_rank'].iloc[0],
        'cohort': 'top30',
        'ret_5d': round(ret * 100, 3),
        'xbi_5d': round(xbi_ret * 100, 3),
        'xs_5d': round(xs * 100, 3),
        'ew_contrib': round(ret / n * 100, 3),
        'contrib_to_xs': round(xs / n * 100, 3),
    })
# sort by contrib_to_xs ascending (worst first)
df_contrib = pd.DataFrame(rows).sort_values('contrib_to_xs')
```

### Step 5 — Feature bucket attribution

Attach pre-window snapshot fields to each contributor:
```python
feature_cols = [
    'catalyst_bucket',     # 0_30d / 31_90d / 91_180d / none / no_near_catalyst
    'size_band',           # micro/small/mid/large
    'priced_move_pct',     # options-implied expected move pct
    'ees_v3_gate',         # pass/fail/no_data
    'ees_v3_score',
    'ovf_has_event_premium',
    'ovf_composite',
    'expectation_error_score',
    'coinvest_score_z',
    'inst_delta_z',
    'fundamental_red_flag',
    'selector_clinical_block',
    'selector_survivability_block',
    'regime_label',
]
df_contrib = df_contrib.merge(
    df_snap[['ticker'] + feature_cols], on='ticker', how='left'
)
```

Bucket aggregation pattern:
```python
# e.g. by catalyst_bucket
for bucket_col in ['catalyst_bucket', 'size_band', 'ees_v3_gate']:
    agg = df_contrib.groupby(bucket_col).agg(
        n_names=('ticker','count'),
        avg_ret=('ret_5d','mean'),
        avg_xs=('xs_5d','mean'),
        total_contrib_xs=('contrib_to_xs','sum'),
        hit_rate=('xs_5d', lambda x: (x>0).mean()),
    ).reset_index()
    print(agg.to_string())
```

### Step 6 — Counterfactual baskets

For each failure window, compute these EW baskets using only same-day data:

| basket_id | description | construction |
|-----------|-------------|--------------|
| actual_top30 | Baseline | top30 tickers |
| ex_ees_veto | Exclude EES veto | top30 where ees_v3_gate != 'fail'; fill from ranks 31–60 |
| ex_event_premium | Exclude high options EP | top30 where ovf_has_event_premium != True; fill from 31–60 |
| ex_priced_move_q4 | Exclude top quartile priced_move_pct | top30 excluding top-quartile pm; fill from 31–60 |
| ex_0_30d_catalyst | Exclude near-term binary | top30 where catalyst_bucket != '0_30d'; fill from 31–60 |
| bench_31_60 | Ranks 31–60 EW | ranks 31–60 tickers |
| top60_ew | Top-60 EW | top 60 tickers |

For fill-from-31-60: replace excluded top-30 names with next-best ranks 31–60
that don't also meet the exclusion criterion, maintaining N=30.

Beta-neutral and factor-matched baskets: compute only if enough tickers are
available (n >= 20 after exclusion).

### Step 7 — Failure classification

Classify each failed window into one primary bucket + any secondary:

```
DATA_ARTIFACT           — ≥3 names with data quality flags or stale endpoints
BROAD_SECTOR_BETA       — XBI itself down >3%, top30 xs within 1pp of random 30
RANK_INVERSION          — ranks 31–60 EW outperformed top30 by >2pp
CATALYST_BUCKET_CONCENTRATION — >50% of miss came from 0_30d bucket
EVENT_ALREADY_PRICED    — ex_priced_move_q4 basket beats actual by >2pp
OPTIONS_CROWDING        — ex_event_premium basket beats actual by >2pp
EES_WOULD_HAVE_HELPED   — ex_ees_veto basket beats actual by >1.5pp
INSTITUTIONAL_CROWDING  — high coinvest names drove >60% of miss
LOW_LIQUIDITY_OR_MICROCAP — micro/small names drove >60% of miss
NO_OBVIOUS_PRE_WINDOW_SIGNAL — none of the above; counterfactuals all within 1pp
```

Rule: if NO_OBVIOUS_PRE_WINDOW_SIGNAL, do not recommend model changes.

### Step 8 — Write artifacts

```
OUTDIR = $REPO/artifacts/autopsy/ytd_top30_failure_postmortem_2026/
```

Files:
- `failure_windows.csv` — one row per window, xs_5d, classification, primary/secondary
- `name_attribution.csv` — one row per (window, ticker), all feature cols + contribution
- `feature_bucket_attribution.csv` — one row per (window, bucket_col, bucket_val)
- `counterfactuals.csv` — one row per (window, basket_id), port_ret_5d, xbi_ret_5d, xs_5d, delta_vs_actual
- `YTD_TOP30_FAILURE_POSTMORTEM.md` — full narrative report

### Step 9 — Self-improve this skill

After completing the analysis, update the `## Lessons Learned` section below.

Pattern for adding a lesson:
```
- [YYYY-MM-DD] <what was true> — <what it implies for future runs>
```

Do NOT add lessons that are already captured. Do NOT add lessons that are
specific to one name/date (only add patterns that would apply to a future run).

---

## Output Format (YTD_TOP30_FAILURE_POSTMORTEM.md)

```markdown
# YTD Top-30 Failure Post-Mortem — {run_date}

CLASSIFICATION: RESEARCH_AUTOPSY / NO_MODEL_CHANGE

## Executive Verdict
[2-3 sentences: what fraction of failures were avoidable vs noise]

## Failure Windows Summary
| window | xs_5d | primary_class | secondary | was_avoidable |
| ...

## Per-Window Attribution
### {snap_date} → {fwd_date}  (xs = X.Xpp)
Top 5 detractors: ...
Feature concentration: ...
Counterfactual summary: ...
Classification: PRIMARY / SECONDARY reason

## Feature Bucket Attribution (aggregate across all failure windows)
[table: bucket_col, bucket_val, n_names, avg_xs, total_contrib, hit_rate]

## Counterfactual Results (aggregate)
| basket | avg_xs across failure windows | vs actual |
| ...

## EES / Options / Expectation Layer Assessment
- Would EES veto have helped? YES/NO — delta = X.Xpp average
- Would options exclusion have helped? YES/NO — delta = X.Xpp average
- Would priced_move exclusion have helped? YES/NO — delta = X.Xpp average

## Ranks 31–60 Assessment
- Did bench outperform Top-30 during failure weeks? YES/NO
- Average bench xs during failure windows: X.Xpp
- Rank-inversion windows: [list]

## Governance Conclusion
- Actionable findings: [list or NONE]
- Overfitting risk: [assessment]
- Recommended next validation: [or NONE]

## Classification: NO_MODEL_CHANGE [or specific recommendation if evidence is repeated and statistically credible]
```

---

## Lessons Learned

*(Updated after each run. Each entry: what the data showed → what to watch for next time.)*

- [2026-06-28] **Failure windows are confirmed in existing validation JSON** — no need to recompute aggregate XS; load `2026_ytd_top30_validation.json` first and use it as the window index. The per-name work is the new layer.
- [2026-06-28] **Price source is `production_data/price_history_split_adj.csv`** — covers through 2026-06-18 (351 tickers, XBI included). For windows with fwd_date > 2026-06-18, flag as `PRICE_INCOMPLETE`. The `prices.db` SQLite stops 2026-04-17; `universe_prices.csv` stops 2026-01-15. Do not use these for 2026 windows.
- [2026-06-28] **Snapshots have irregular naming** — some dates have variants (`2026-03-16b`, `2026-03-16c`, `_QUARANTINED_BACKUP`). Always filter to `????-??-??` format only (10-char, no suffix) when building the eligible snapshot list.
- [2026-06-28] **May was the only negative monthly block** — mean XS = -1.25pp in May vs +0.3–1.6pp all other months. The May 26 → June 8 cluster is the primary failure cluster to explain.
- [2026-06-28] **`ees_v3_gate` is a boolean column (True/False), not a string ('pass'/'fail')** — check for `== False` in Python, not `== 'fail'`. March 2026 snapshots have NO ees_v3_gate column at all (only ees_v2 fields). EES v3 was first available ~April 2026.
- [2026-06-28] **`regime_label` is 'UNKNOWN' in all 2026 snapshots** — regime classification was not operational. Cannot use for BROAD_SECTOR_BETA classification. Use XBI absolute return (>3%) as a proxy instead.
- [2026-06-28] **`ovf_has_event_premium` and `ovf_composite` are all NaN/empty** — use `ovf11_ep` instead for event premium. But `ovf11_ep` was also all zeros in 2026 failure windows — the options overlay was not generating event premium scores. This field is a data gap for 2026.
- [2026-06-28] **`market_cap_usd` does not exist** — use `market_cap_mm` (market cap in millions) and `market_cap_bucket` for bucketing.
- [2026-06-28] **binary_now was the best catalyst bucket during YTD failure windows (single period, not a durable rule)** — avg xs = −0.74pp vs build_window −3.52pp and less_binary −3.88pp. Counter-intuitive; requires forward confirmation before drawing conclusions about catalyst bucket weighting.
- [2026-06-28] **EES False names underperformed by 3.2pp in YTD failure windows** — aggregate avg xs: False = −4.62pp vs True = −1.40pp. EES veto improved 3 of 5 post-EES windows by +1.26 to +2.71pp. EES missed ABVX and PRAX (both EES-True, binary failures). Finding is consistent across 3+ windows but requires prospective shadow validation before production use.
- [2026-06-28] **Bench 31–60 outperformed Top-30 by +1.64pp on average during failure windows** — the clearest counterfactual signal. Rank-inversion in 3 windows. Whether this is failure-specific or a persistent alpha leak requires checking non-failure weeks — do NOT assume the bench is consistently better.
- [2026-06-28] **Failure concentration is extreme: top 5 names drive 59–206% of each miss** — failures are not broad ranker inversions. They are 3–5 name blowups with offsetting contributors. CELC (5 windows, −2.50pp total) and ABVX (5 windows, −1.88pp total) were serial offenders in 2026. Do not hard-code these names — check repeat-offender flag dynamically on each run.
- [2026-06-28] **Rolling 4-window drawdown trigger fired: May 4 → June 8 = −8.52pp** (threshold −5.00pp). This is the formal definition of the "cluster." Track this metric going forward on each weekly run.
- [2026-06-28] **Xs reconstruction matches known xs exactly when correct snapshot is used** — if there's a material discrepancy (e.g., Jun-01 window), investigate the snapshot used. The 0.69pp discrepancy in Jun-01 traces directly to the QUARANTINED snapshot substitution.

## Known Data Gaps

- `2026-06-01` snapshot is QUARANTINED (composite aggregation failed) — use `2026-05-29` as substitute; causes ~0.69pp xs reconstruction discrepancy (substituted snapshot = different portfolio composition).
- Price history ends 2026-06-18; windows with fwd_date > 2026-06-18 need raw price fallback or must be flagged PRICE_INCOMPLETE.
- `regime_label` is 'UNKNOWN' in all 2026 snapshots — regime-based classification is unavailable; use XBI >3% absolute return as BROAD_SECTOR_BETA proxy.
- `ovf11_ep` (event premium) was all zeros in 2026 failure windows — options overlay was not generating event premium scores; this counterfactual is meaningless until the field is populated.
- March 2026 snapshots have no `ees_v3_gate` column — EES v3 not yet deployed; skip EES counterfactual for March window.
- `priced_move_pct` is NaN for some names (particularly in May-26 window) — options data gap for certain names, not systematic.
- 31–60 bench tracking was formally added with rank-depth-shadow PR #436 (2026-06-28). Historical windows reconstruct bench from existing snapshot rankings.csv (actionable_rank 31–60 present in all snapshots).

## Session-end learning

After this skill runs, if anything surprised you, log a learning per `~/.claude/docs/session-end-learning.md` (Pattern-Key `SKILL_BIOTECH_AUTOPSY_{description}`).
