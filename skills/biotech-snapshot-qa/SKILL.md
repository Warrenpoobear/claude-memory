---
name: biotech-snapshot-qa
description: |
  QA the latest biotech screener snapshot: ticker count, score distribution, top-30 stability vs prior day, governance field checks. Use when the user says "QA the snapshot", "check the snapshot", "did the pipeline run correctly", "snapshot QA", or after running biotech-run-pipeline. Reports PASS/WARN/FAIL with specific issues flagged.
allowed-tools:
  - Bash(python3 *)
  - Bash(ls *)
  - Bash(cat *)
---

# Biotech Snapshot QA

Quality check on the latest snapshot. Run after any pipeline execution.

## Steps

### 1 — Identify latest snapshot
```bash
ls /mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/ | sort | tail -5
```

### 2 — Core QA checks
```bash
python3 - <<'EOF'
import pandas as pd, json, glob, os

REPO = '/mnt/c/Projects/biotech_screener/biotech-screener'
snaps = sorted(glob.glob(f'{REPO}/data/snapshots/*/rankings.csv'))
if not snaps:
    print("ERROR: no snapshots found"); exit(1)

latest = snaps[-1]
prior  = snaps[-2] if len(snaps) >= 2 else None
snap_date = os.path.dirname(latest).split('/')[-1]

df = pd.read_csv(latest)

# Check 1: ticker count
ticker_count = len(df)
print(f"[{'PASS' if ticker_count >= 300 else 'WARN'}] Tickers ranked: {ticker_count} (expect ≥300)")

# Check 2: top-30 populated
top30 = df[df['actionable_rank'] <= 30]
print(f"[{'PASS' if len(top30) == 30 else 'FAIL'}] Top-30 count: {len(top30)} (expect 30)")

# Check 3: score distribution — no zero-score collapse
score_col = 'final_score' if 'final_score' in df.columns else 'composite_score'
if score_col in df.columns:
    mean_score = df[score_col].mean()
    print(f"[{'PASS' if mean_score > 0.15 else 'FAIL'}] Mean {score_col}: {mean_score:.4f} (expect >0.15)")

# Check 4: top-30 Jaccard vs prior
if prior:
    df_prior = pd.read_csv(prior)
    t30_now   = set(df[df['actionable_rank'] <= 30]['ticker'])
    t30_prior = set(df_prior[df_prior['actionable_rank'] <= 30]['ticker'])
    jaccard = len(t30_now & t30_prior) / len(t30_now | t30_prior)
    print(f"[{'PASS' if jaccard >= 0.70 else 'WARN'}] Top-30 Jaccard vs prior: {jaccard:.3f} (warn <0.70)")
    new_in  = t30_now - t30_prior
    new_out = t30_prior - t30_now
    if new_in:  print(f"  New entries: {sorted(new_in)}")
    if new_out: print(f"  Exits:       {sorted(new_out)}")

# Check 5: required fields present
required = ['ticker','actionable_rank','tier_any','alpha_cohort_pct','catalyst_days']
missing = [f for f in required if f not in df.columns]
print(f"[{'PASS' if not missing else 'FAIL'}] Required fields: {'all present' if not missing else f'MISSING: {missing}'}")

print(f"\nTop-10:")
print(df.nsmallest(10,'actionable_rank')[['actionable_rank','ticker','tier_any','alpha_cohort_pct']].to_string(index=False))
EOF
```

### 3 — Artifact presence check
```bash
python3 - <<'EOF'
import os, glob
REPO = '/mnt/c/Projects/biotech_screener/biotech-screener'
snaps = sorted(glob.glob(f'{REPO}/data/snapshots/*/rankings.csv'))
snap_dir = os.path.dirname(snaps[-1])
expected = ['rankings.csv','institutional_summary.json','market_data.json']
for f in expected:
    path = os.path.join(snap_dir, f)
    status = "✓" if os.path.exists(path) else "✗ MISSING"
    print(f"  {f}: {status}")
EOF
```

### 4 — Report
```
SNAPSHOT QA — YYYY-MM-DD

[PASS] Tickers ranked: NNN
[PASS] Top-30 count: 30
[PASS] Mean score: X.XXXX
[PASS] Top-30 Jaccard vs prior: X.XXX
[PASS] Required fields: all present

ARTIFACTS: rankings.csv ✓ | institutional_summary.json ✓ | market_data.json ✓

VERDICT: PASS / WARN (see above) / FAIL (do not use for trading)

Top-10: COGT, DNTH, ORIC, ...
```

## Session-end learning

After this skill runs, if anything surprised you, log a learning per `~/.claude/docs/session-end-learning.md` (Pattern-Key `SKILL_BIOTECH_SNAPSHOT_QA_{description}`).
