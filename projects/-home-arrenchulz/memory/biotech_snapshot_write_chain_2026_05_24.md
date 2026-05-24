---
name: biotech-snapshot-write-chain
description: "Corrected call chain for how run_screen_for_date results reach disk — run_batch is the orchestrator, out_root is snapshots_pit not snapshots"
metadata: 
  node_type: memory
  type: project
  originSessionId: bf02a102-1834-4264-940f-d22c3435cc93
---

The expected chain `run_screen_for_date → _write_snapshot` is **wrong**. Both are siblings called by `run_batch`.

**Correct chain** (`scripts/run_screen_from_bundle.py`):

```
main() [L1374]  --out-root default: {PROJECT_ROOT}/data/snapshots_pit/
  ├── --bundle-root mode → run_batch(out_root) [L1301]
  │       ├── run_screen_for_date(...) → (rows, metadata)   [L1338]  # pure computation
  │       └── if rows: _write_snapshot(out_root, dt, rows, metadata)  [L1351]
  └── --bundle-dir mode  → _write_snapshot() called directly from main
        ├── {out_root}/{date}/rankings.csv
        └── {out_root}/{date}/metadata.json
```

**Three corrections vs. original assumption:**

1. Output root is `data/snapshots_pit/` (CLI default L1393), **not** `data/snapshots/`
2. `_write_snapshot` writes **two** files per date: `rankings.csv` + `metadata.json`
3. `_write_snapshot` has **two production callers**: `run_batch` (batch mode) and `main` directly (single-date `--bundle-dir` mode)

**Why:** `run_screen_for_date` is pure computation — it returns `(csv_rows, metadata)` and does no I/O. `_write_snapshot` is only called if `rows` is non-empty (guard at L1350). The `codegraph_callers` result showed 20 callers but 18 are test-local `_write_snapshot` helpers (8 symbols share the name); only 2 are production callers of `scripts/run_screen_from_bundle.py:1267`.

**How to apply:** When tracing any pipeline write issue, start at `run_batch` (batch) or `main` (single-date). Path bugs should look at the `--out-root` CLI arg or `_PROJECT_ROOT / "data" / "snapshots_pit"` default. Ambiguity warning: `codegraph_callers` on `_write_snapshot` aggregates all 8 same-named symbols — filter to production file manually.
