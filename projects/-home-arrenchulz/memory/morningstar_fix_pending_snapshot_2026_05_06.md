---
name: Morningstar ms_* fix — pending live snapshot verification
description: Two key-path bugs fixed; live confirmation requires next production snapshot showing ms_* field coverage
type: project
status: active
created: 2026-05-06
expires:
  condition: next production snapshot lands and coverage check runs
related:
  - biotech_ranker_active_contract_2026_04_30
originSessionId: a98b987e-1b00-4f21-addd-8faa5c86651c
---
**Two bugs fixed in commits `e70ae626` and `5c284ab7`. Smoke test passed. Live confirmation pending.**

## What was fixed

| Commit | Bug | Change |
|---|---|---|
| `e70ae626` | Top-level key wrong | `results.get("enhancement_result", {})` → `results.get("enhancements", {})` |
| `5c284ab7` | Inner key wrong | `.get("morningstar_scores", {}).get("scores", {})` → `.get("morningstar_scores", {}).get("scores_by_ticker", {})` |

Smoke test against 2026-05-06 `screen_output.json` confirmed 297/299 tickers would be enriched with the corrected key path.

## Snapshot check to run on next production snapshot

```python
import csv
path = "data/snapshots/{DATE}/rankings.csv"
ms_fields = ["ms_return_ytd","ms_volatility_3yr","ms_star_rating",
             "ms_return_annualized_3yr","ms_return_annualized_5yr","ms_volatility_5yr"]
with open(path) as f:
    rows = list(csv.DictReader(f))
total = len(rows)
for f in ms_fields:
    pop = sum(1 for r in rows if r.get(f,"").strip() not in ("","None","nan"))
    print(f"{f}: {pop}/{total}")
```

## Expected results

| Field | Expected | Notes |
|---|---|---|
| `ms_return_ytd` | ~297/299 non-null | Should match 2026-05-06 smoke test |
| `ms_volatility_3yr` | ~262/299 non-null | Requires price history data |
| `ms_return_annualized_3yr` | ~264/299 non-null | |
| `ms_star_rating` | ~25/299 non-null | Sparse — requires RR01Y field in MCP data |

## Verdict criteria

| Result | Verdict |
|---|---|
| `ms_return_ytd` ≥ 290/299 | FIXED_AND_LIVE |
| `ms_return_ytd` = 0/299 | STILL_BROKEN — new bug introduced |
| `ms_return_ytd` > 0 but < 100 | FIXED_BUT_UPSTREAM_INACTIVE — partial data |

## Schema note (from spec_076 correction)

`ms_*` fields are classified `FIXED_MAPPING / KEEP` in spec_076. Do NOT cut them pending this verification and explicit evidence that the Morningstar enrichment pipeline is permanently retired.
