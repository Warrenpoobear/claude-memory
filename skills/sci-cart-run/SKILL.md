---
name: sci-cart-run
description: |
  Run the Scientific Cartography diagnostic wrapper for a given snapshot date. Use when the user says "run scientific cartography", "run sci cart", "generate disease maps", "run the cartography diagnostics", or similar. Executes the standalone wrapper, generates 9 diagnostic artifacts + status.json, and reports outcome. Read-only diagnostic — no production model changes.
allowed-tools:
  - Bash(python3 *)
  - Bash(ls *)
  - Bash(cat *)
---

# Scientific Cartography Run

Run the Scientific Cartography diagnostic wrapper (Phase 7A/7B).

## Steps

### 1 — Determine target date
Use today's date or user-specified date. Verify snapshot exists first:
```bash
ls /mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/YYYY-MM-DD/rankings.csv 2>/dev/null \
  && echo "Snapshot found" || echo "ERROR: no snapshot for YYYY-MM-DD — run biotech-run-pipeline first"
```

### 2 — Run the diagnostic wrapper
```bash
cd /mnt/c/Projects/biotech_screener/biotech-screener && source .env && \
python3 tools/run_scientific_cartography_diagnostics.py --date YYYY-MM-DD
```
Or with Phase 7B production hook (disabled by default):
```bash
python3 scripts/run_batch.py --date YYYY-MM-DD --run-scientific-cartography
```

### 3 — Verify artifacts
```bash
python3 - <<'EOF'
import os, json, glob

REPO = '/mnt/c/Projects/biotech_screener/biotech-screener'
cart_dir = os.path.join(REPO, 'artifacts', 'scientific_cartography', 'YYYY-MM-DD')

if not os.path.exists(cart_dir):
    print(f"Output dir not found: {cart_dir}"); exit(0)

# Check status.json
status_file = os.path.join(cart_dir, 'status.json')
if os.path.exists(status_file):
    status = json.load(open(status_file))
    print(f"Status: {status.get('status', 'unknown')}")
    print(f"Artifacts generated: {status.get('artifacts_count', '?')}")
else:
    print("status.json not found")

# List artifacts
artifacts = glob.glob(os.path.join(cart_dir, '*'))
print(f"\nArtifacts ({len(artifacts)}):")
for a in sorted(artifacts):
    size = os.path.getsize(a)
    print(f"  {os.path.basename(a):<50} {size:,} bytes")
EOF
```

### 4 — Report
```
SCIENTIFIC CARTOGRAPHY — YYYY-MM-DD

Status:     COMPLETE / PARTIAL / FAILED
Artifacts:  N/9 generated

  map_index.json            ✓
  disease_map_*.json        ✓ (N diseases)
  landscape_features.json   ✓
  competitive_clusters.json ✓
  artifact_manifest.json    ✓
  status.json               ✓

Output: artifacts/scientific_cartography/YYYY-MM-DD/

[Any errors or warnings]
```

## Context
- Wrapper is cache-only, non-blocking, no production wiring (Phase 7A commit 57e665cf)
- Phase 7B hook exists but is disabled-by-default (commit 365ef05d)
- 208/208 tests PASS on last verified run
- Governance: READ_ONLY_DIAGNOSTIC — never affects ranker/selector/sizing/final_score

## Session-end learning

After completing this skill's task, if you encountered an unexpected behavior, constraint, API response, or workflow edge case, log it:

```
[LRN-YYYYMMDD-NNN]
Pattern-Key: SKILL_SCI_CART_RUN_{description}
Area: hermes_ops | data_pipeline | research | portfolio
Promotion-lane: skill | none
Recurrence-Count: 1
Context: <one line — what happened>
Rule: <one line — what to do differently>
Suggested-Action: <patch to this SKILL.md, or none>
```

Recurrence ≥ 3 in 7 days → propose a patch to this `SKILL.md` via `tools/pattern_to_skillpatch.py`. Full protocol: see `self-improving` skill.
