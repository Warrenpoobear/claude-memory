---
name: spec_102_historical_backfill_phase_a
description: "Spec 102 Phase A shipped — backfill script + 13 tests for historical expectation field patching (19 snapshots, 2026-04-20 through 2026-05-13)"
metadata: 
  node_type: memory
  type: project
  status: shipped
  originSessionId: aa59b343-1bcf-4550-8276-0cdf7344c285
---

## Spec 102: Historical Backfill for Expectation Research — Phase A

**Commit:** `18cd13b1` (2026-05-14)
**Status:** SHIPPED; ready for execution on full snapshot range

### Deliverables

1. **tools/backfill_expectation_fields.py**
   - Main function: `main()` with argparse (--start-date, --end-date, --snapshot-dir, --dry-run, --skip-insider, --force)
   - Core logic: `backfill_snapshot(snapshot_dir, prices, shares, short_interest, dry_run, skip_insider, force)`
   - Data loaders: `load_price_pit()`, `load_shares_outstanding()`, `load_si_pit()`
   - Coverage measurement: `measure_coverage(rows, fields) → Dict[str, float]`
   - Snapshot discovery: `discover_snapshots(root, start_date, end_date) → List[Path]`

2. **tests/test_backfill_expectation_spec102.py** (13 tests, all passing)
   - TestBackfillCompleteness: 3 tests (all fields present, no columns dropped, row count preserved)
   - TestBackfillCoverage: 3 tests (coverage computation, None/nan handling, threshold alignment)
   - TestManifestGeneration: 2 tests (manifest structure, JSON validity)
   - TestGuardFlag: 3 tests (structure, JSON validity, research script readability)
   - TestRankPreservation: 2 tests (rank/action unchanged, only expectation fields modified)

### Data Sources & Patching Strategy

| Field | Source | Strategy |
|---|---|---|
| `close_price` | `data/caches/price_pit/PIT/<date>/prices.csv` → anchor_close | Fill empty cells; already 100% in all snapshots |
| `market_cap_mm` | `anchor_close × shares_outstanding / 1e6` | Fill empty cells; already 99%+ in all snapshots |
| `short_interest_pct` | Per-snapshot `inputs/short_interest.json` (PIT copy) | Fill empty cells; improves 98% → 99% |
| `priced_move_pct` | No backfill (no historical options data) | Leave as-is; 84% fill acceptable (options-gated) |
| `insider_net_buy_value_90d` | `common/insider_enrichment` for 4 missing-column snapshots | Add column + compute via form4 raw data |

### Dry-Run Validation Results

**10-snapshot sample (2026-04-20 through 2026-04-30):**
- All snapshots: 297+ rows, 100% close_price coverage
- short_interest_pct: improved from 97-98% to 98-99% via patching
- No errors; script handles all edge cases
- Estimated execution time: < 5 minutes for full 19-snapshot range

### Artifacts Generated

- `.backfill_metadata.json` per snapshot: `{backfill_expectation_fields: true, backfill_date: <UTC>, spec: "102"}`
- `artifacts/backfill_manifest/backfill_expectation_fields_<YYYY_MM_DD>.json` per snapshot:
  * snapshot_date, fields_added, insider_computed, coverage_before, coverage_after
  * actions_recomputed: false, ranks_recomputed: false (invariants enforced)

### Next Step: Execution

Ready to run on full range:

```bash
python tools/backfill_expectation_fields.py  # default: 2026-04-20 through 2026-05-13
```

Or with custom range / dry-run:

```bash
python tools/backfill_expectation_fields.py --dry-run --start-date 2026-04-25 --end-date 2026-05-10
```

Execution will:
1. Patch ~1-2% missing values in short_interest_pct across 19 snapshots
2. Create 19 manifest JSONs (coverage deltas)
3. Create 19 guard flags (.backfill_metadata.json)
4. Write updated rankings.csv files in-place

### Related Specs

- **Spec 105**: Expectation layer coverage verification (complements backfill; tests coverage gates)
- **Spec 104**: Insider diagnostic measurement (insider field is optional in backfill)
- **Spec 101**: Runway severity export (independent; completed earlier)

### Implementation Notes

- Additive-only patching: never overwrites existing non-empty values (unless --force)
- CSV column order preserved: new columns added at end, never reordered
- Idempotent: re-running with same inputs produces same result
- Error handling: missing tickers in data sources → leave cell blank, log warning, continue
- Shares_outstanding sourced once from market_data.json (static, acceptable for backfill)
