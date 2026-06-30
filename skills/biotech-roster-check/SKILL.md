---
name: biotech-roster-check
description: |
  Check whether the biotech model top-30 roster has changed since the last rebalance, and whether current agentic account holdings (802349084) are still aligned. Use when the user says "roster check", "has the model changed", "what's new in the top 30", "any changes to the model", "what changed in rankings", or similar. Read-only — no trades. Reports new entries not yet held, exits to action, significant rank movers among held positions.
allowed-tools:
  - mcp__robinhood-trading__get_equity_positions
  - Bash(cat *)
  - Bash(ls *)
  - Bash(python3 *)
---

# Biotech Roster Check

Read-only top-30 diff vs current holdings in account 802349084.

## Steps

### 1 — Load latest two snapshots (for rank change comparison)
```bash
python3 - <<'EOF'
import pandas as pd, glob, os

snaps = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/*/rankings.csv'))
if not snaps:
    print("ERROR: no snapshots found"); exit(1)

latest_path = snaps[-1]
prior_path  = snaps[-2] if len(snaps) >= 2 else None
latest_date = os.path.dirname(latest_path).split('/')[-1]
prior_date  = os.path.dirname(prior_path).split('/')[-1] if prior_path else "N/A"

df_now = pd.read_csv(latest_path)
top30_now = df_now[df_now['actionable_rank'] <= 30].set_index('ticker')['actionable_rank'].to_dict()

if prior_path:
    df_prior = pd.read_csv(prior_path)
    top30_prior = df_prior[df_prior['actionable_rank'] <= 30].set_index('ticker')['actionable_rank'].to_dict()
else:
    top30_prior = {}

new_entries = [t for t in top30_now if t not in top30_prior]
exits       = [t for t in top30_prior if t not in top30_now]
movers      = {t: (top30_prior[t], top30_now[t]) for t in top30_now
               if t in top30_prior and abs(top30_prior[t] - top30_now[t]) > 10}

print(f"Latest:  {latest_date}")
print(f"Prior:   {prior_date}")
print(f"\nNEW ENTRIES: {new_entries}")
print(f"EXITS:       {exits}")
print(f"MOVERS (>10 ranks): {movers}")
print(f"\nFull top-30 ({latest_date}):")
print(df_now[df_now['actionable_rank'] <= 30][['actionable_rank','ticker','tier_any','catalyst_days']].sort_values('actionable_rank').to_string(index=False))
EOF
```

### 2 — Get current holdings
`get_equity_positions(account_number="802349084")` → extract held tickers

### 3 — Compute actionable diff
```python
held = set(held_tickers)
top30 = set(top30_tickers)

not_yet_held   = top30 - held            # new entries to add at next weekly
to_exit        = held - top30            # get their current ranks; exit now if rank >= 40
already_held   = held & top30           # currently aligned
```

For `to_exit` tickers: check their current `actionable_rank` in latest snapshot.
- rank 31–39 → "exit at next weekly rebalance"
- rank 40+ → "⚠️ exit this session"

### 4 — Report
```
ROSTER CHECK  (snapshot: YYYY-MM-DD vs YYYY-MM-DD)

NEW TOP-30 ENTRIES (not yet held):
  Rank N — TICKER  Tier X  catalyst Xd  → ADD at next weekly rebalance

EXITS FROM TOP-30 (currently held):
  TICKER  now rank NN  → [defer to weekly / ⚠️ EXIT NOW — rank ≥ 40]

SIGNIFICANT RANK MOVERS among held positions (>10):
  TICKER: rank X → Y  [↑ improving / ↓ declining]

BINARY CATALYSTS WITHIN 5 DAYS (flag — no auto-action):
  TICKER — catalyst in Xd

ALIGNMENT: N/N held positions still in top-30
```

## Rule 2 reference
- Rank 31–39: exit at next weekly rebalance (Monday open)
- Rank ≥ 40: exit within current session
- New entries: add at next weekly rebalance (not immediately)
- Binary catalyst within 5 days: manual review only — no auto-action

## Session-end learning

After completing this skill's task, if you encountered an unexpected behavior, constraint, API response, or workflow edge case, log it:

```
[LRN-YYYYMMDD-NNN]
Pattern-Key: SKILL_BIOTECH_ROSTER_CHECK_{description}
Area: hermes_ops | data_pipeline | research | portfolio
Promotion-lane: skill | none
Recurrence-Count: 1
Context: <one line — what happened>
Rule: <one line — what to do differently>
Suggested-Action: <patch to this SKILL.md, or none>
```

Recurrence ≥ 3 in 7 days → propose a patch to this `SKILL.md` via `tools/pattern_to_skillpatch.py`. Full protocol: see `self-improving` skill.
