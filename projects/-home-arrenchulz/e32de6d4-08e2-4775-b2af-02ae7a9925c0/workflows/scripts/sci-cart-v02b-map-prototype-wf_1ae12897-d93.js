
export const meta = {
  name: 'sci-cart-v02b-map-prototype',
  description: 'v0.2b static disease-map generator: implement, test, generate T2DM prototype, commit',
  phases: [
    { title: 'Read', detail: 'Read spec, artifact schemas, existing exporter patterns' },
    { title: 'Implement', detail: 'Write tools/generate_scientific_cartography_map.py' },
    { title: 'Test', detail: 'Write and run test_map_generator.py' },
    { title: 'Generate', detail: 'Run generator on T2DM, inspect output' },
    { title: 'Commit', detail: 'Write implementation memo, commit generator + tests + memo' },
  ],
}

// Phase 1: Read spec and understand artifact schemas
phase('Read')

const readPhase = await agent(`
You are in /mnt/c/Projects/biotech_screener/biotech-screener. READ ONLY.

Run ALL of the following and report verbatim output:

1. Read the v0.2b spec:
   cat -n artifacts/audit/SCIENTIFIC_CARTOGRAPHY_MAP_UX_V0_2B_STATIC_PROTOTYPE_SPEC_2026_06_23.md

2. Find and read the most recent artifact directory (post-R2b):
   ls -t artifacts/scientific_cartography/ | head -5

3. Check what the disease_map_summary.json looks like (structure only):
   python3 -c "
import json
with open('artifacts/scientific_cartography/2026-06-23-r2b/disease_map_summary.json') as f:
    data = json.load(f)
# Print top-level keys and structure
if isinstance(data, dict):
    print('Top-level keys:', list(data.keys()))
    for k,v in data.items():
        if isinstance(v, list):
            print(f'{k}: list of {len(v)}, first item keys:', list(v[0].keys()) if v else 'empty')
        elif isinstance(v, dict):
            print(f'{k}: dict with keys', list(v.keys())[:10])
        else:
            print(f'{k}:', str(v)[:100])
elif isinstance(data, list):
    print('Top-level: list of', len(data))
    if data:
        print('First item keys:', list(data[0].keys()))
        print('First item sample:', json.dumps(data[0], default=str)[:500])
" 2>&1 | head -60

4. Check map_index.json structure:
   python3 -c "
import json
with open('artifacts/scientific_cartography/2026-06-23-r2b/map_index.json') as f:
    data = json.load(f)
if isinstance(data, dict):
    print('Top-level keys:', list(data.keys()))
    for k,v in list(data.items())[:5]:
        print(f'{k}:', str(v)[:200])
elif isinstance(data, list):
    print('List of', len(data), 'entries')
    if data:
        print('First entry:', json.dumps(data[0], default=str)[:400])
" 2>&1 | head -40

5. Find T2DM entries in map_index.json:
   python3 -c "
import json
with open('artifacts/scientific_cartography/2026-06-23-r2b/map_index.json') as f:
    data = json.load(f)
entries = data if isinstance(data, list) else data.get('diseases', data.get('entries', []))
t2dm = [e for e in entries if 'diabetes' in str(e).lower() and 'type 2' in str(e).lower() or '0005148' in str(e)]
print(f'T2DM entries: {len(t2dm)}')
for e in t2dm[:3]:
    print(json.dumps(e, default=str, indent=2)[:600])
" 2>&1 | head -80

6. Sample program_records.jsonl for T2DM:
   python3 -c "
import json
t2dm_progs = []
with open('artifacts/scientific_cartography/2026-06-23-r2b/program_records.jsonl') as f:
    for line in f:
        p = json.loads(line)
        disease = str(p.get('disease_name', '') + str(p.get('disease_id', ''))).lower()
        if 'diabetes' in disease and ('type 2' in disease or '0005148' in disease):
            t2dm_progs.append(p)
            if len(t2dm_progs) >= 3:
                break
print(f'T2DM programs found (sample): {len(t2dm_progs)}')
for p in t2dm_progs:
    print(json.dumps(p, default=str, indent=2)[:800])
    print('---')
" 2>&1 | head -120

7. Sample competitive_clusters.jsonl:
   python3 -c "
import json
t2dm_clusters = []
with open('artifacts/scientific_cartography/2026-06-23-r2b/competitive_clusters.jsonl') as f:
    for line in f:
        c = json.loads(line)
        if 'diabetes' in str(c).lower() and 'type 2' in str(c).lower():
            t2dm_clusters.append(c)
            if len(t2dm_clusters) >= 2:
                break
print(f'T2DM clusters (sample): {len(t2dm_clusters)}')
for c in t2dm_clusters:
    print(json.dumps(c, default=str, indent=2)[:800])
    print('---')
" 2>&1 | head -100

8. Read existing exporter for code patterns:
   cat -n scientific_cartography/export/disease_map_exporter.py 2>/dev/null | head -120 || echo "not found"

9. Check existing dashboard generator for HTML patterns:
   head -80 tools/generate_scientific_cartography_dashboard.py

10. Check artifact_manifest.json for schema:
    python3 -c "
import json
with open('artifacts/scientific_cartography/2026-06-23-r2b/artifact_manifest.json') as f:
    data = json.load(f)
print(json.dumps(data, default=str, indent=2)[:1000])
" 2>&1 | head -60

11. Check .gitignore for map_ux pattern:
    grep -E "map_ux|scientific_cartography" .gitignore 2>/dev/null || echo "no matching gitignore entries"

12. Count T2DM programs total and stage distribution:
    python3 -c "
import json
stages = {}
mechs = {}
tickers = set()
modalities = {}
count = 0
with open('artifacts/scientific_cartography/2026-06-23-r2b/program_records.jsonl') as f:
    for line in f:
        p = json.loads(line)
        disease = str(p.get('disease_name', '') + str(p.get('disease_id', '') or '')).lower()
        if '0005148' in disease or ('type 2' in disease and 'diabetes' in disease):
            count += 1
            stage = p.get('clinical_stage') or 'unknown'
            stages[stage] = stages.get(stage, 0) + 1
            mech = p.get('mechanism_class') or 'unknown'
            mechs[mech] = mechs.get(mech, 0) + 1
            t = p.get('ticker')
            if t:
                tickers.add(t)
            mod = p.get('modality') or 'unknown'
            modalities[mod] = modalities.get(mod, 0) + 1
print(f'Total T2DM (MONDO:0005148) programs: {count}')
print('Stages:', dict(sorted(stages.items(), key=lambda x: -x[1])))
print('Mechanisms:', dict(sorted(mechs.items(), key=lambda x: -x[1])[:10]))
print(f'Unique tickers: {len(tickers)}, sample: {list(tickers)[:15]}')
print('Modalities:', dict(sorted(modalities.items(), key=lambda x: -x[1])[:10]))
" 2>&1 | head -40

Report ALL output verbatim.
`, { label: 'read-schema', phase: 'Read' })

log('Read phase done — implementing generator')

// Phase 2: Implement the generator
phase('Implement')

const implement = await agent(`
You are in /mnt/c/Projects/biotech_screener/biotech-screener.

CONTEXT FROM READ PHASE:
${readPhase}

TASK: Write tools/generate_scientific_cartography_map.py

This is a static map generator that reads Sci-Cart artifact directories and produces:
- artifacts/scientific_cartography/map_ux/<disease-slug>/index.html  (self-contained, file:// openable)
- artifacts/scientific_cartography/map_ux/<disease-slug>/map.svg     (inline in HTML too)
- artifacts/scientific_cartography/map_ux/<disease-slug>/map.json    (data contract)
- artifacts/scientific_cartography/map_ux/<disease-slug>/README.md

REQUIREMENTS (implement all of these):

1. CLI usage:
   python3 tools/generate_scientific_cartography_map.py \\
     --artifact-dir artifacts/scientific_cartography/2026-06-23-r2b \\
     --disease-mondo MONDO:0005148 \\
     --output-dir artifacts/scientific_cartography/map_ux/type-2-diabetes-mellitus \\
     --as-of-date 2026-06-23

2. MAP LAYOUT (SVG):
   - rows/lanes = mechanism_class (each unique mechanism is a lane; unknown has its own lane)
   - columns = clinical_stage buckets: phase1, phase1_phase2, phase2, phase2_phase3, phase3, phase4, not_applicable, unknown
   - nodes = programs/assets, placed at (lane, column) intersection
   - nodes in same cell are laid out in a small grid within the cell
   - unknown mechanism lane MUST be shown even if it dominates
   - unknown stage column MUST be shown if any programs have unknown stage
   - lane height is proportional to number of programs in that lane (min height enforced)
   - SVG is embedded inline in index.html

3. NODE rendering:
   - label = asset_name (truncated to 20 chars) + company/ticker in smaller text
   - public ticker: show ticker badge in distinct color
   - confidence: affects opacity (high=1.0, medium=0.7, low=0.4, missing=0.4)
   - source_refs_count: shown as small number badge
   - modality: simple CSS class coloring (small molecule, biologic, gene therapy, cell therapy, etc.)
   - cluster_id if present: small indicator
   - node size: uniform small rect (~120x50px)

4. HONEST SPARSE DATA treatment:
   - header shows: "Mechanism resolution: X/Y programs (Z%)"
   - if mechanism coverage < 5%: show warning banner: "Mechanism data is sparse. Named lanes cover <5% of programs."
   - if disease fragmentation: show banner: "View limited to MONDO:0005148. T2DM programs appear under 11+ disease IDs."
   - unknown lane background: light grey, dashed border
   - known mechanism lanes: distinct background per mechanism

5. map.json schema:
   {
     "metadata": {
       "disease_name": str,
       "disease_slug": str,
       "mondo_id": str,
       "as_of_date": str,
       "artifact_source": str (path),
       "generated_at_utc": str,
       "governance": ["READ_ONLY_DIAGNOSTIC", "NOT_AN_INVESTMENT_RECOMMENDATION", "DIAGNOSTIC_ONLY"],
       "warnings": [str],
       "program_count": int,
       "known_stage_count": int,
       "known_mechanism_count": int,
       "unique_tickers": int
     },
     "summary": {
       "by_stage": {stage: count},
       "by_mechanism": {mech: count},
       "by_modality": {mod: count},
       "top_tickers": [str]
     },
     "lanes": [
       {
         "mechanism": str,
         "is_unknown": bool,
         "program_count": int,
         "columns": {
           "phase1": [program_id, ...],
           "phase2": [...],
           ...
         }
       }
     ],
     "programs": {
       program_id: {
         "asset_name": str,
         "ticker": str or null,
         "company": str or null,
         "mechanism_class": str,
         "modality": str,
         "clinical_stage": str,
         "confidence": float or null,
         "source_refs_count": int,
         "cluster_id": str or null
       }
     }
   }

6. GOVERNANCE GUARD:
   - Read artifact_manifest.json
   - If any of these appear in artifact filenames or manifest paths: rankings.csv, portfolio_positions.csv, screen_output.json, selector, sizing, final_score -> raise SystemExit with error message
   - Embed governance text in HTML header: "READ_ONLY_DIAGNOSTIC — Not an investment recommendation"
   - Never write: recommendation, ranking, buy, sell, sizing, alpha, signal, score

7. OUTPUT: deterministic (sorted lanes by mechanism name, unknown last; sorted columns by stage order; sorted nodes by asset_name)

8. HTML: self-contained (no CDN), inline CSS, inline SVG, inline JS (minimal, just for tooltip hover). Must open with file://.

9. README.md: brief, includes disease name, date, program counts, stage coverage, mechanism coverage, warnings, governance statement.

IMPLEMENTATION APPROACH:
- Read program_records.jsonl, filter to MONDO:0005148 (by disease_id field)
- Also check disease_name field for "type 2 diabetes" / "diabetes mellitus type 2" as fallback
- Build lane/column grid from filtered programs
- Generate SVG programmatically (Python string building, not a library)
- Wrap SVG in HTML with inline CSS for tooltip
- Write map.json, README.md

IMPORTANT CONSTRAINTS:
- No external libraries beyond stdlib + json + argparse + pathlib + datetime + sys + os
- No Flask, no Jinja2, no matplotlib, no networkx
- The generator must be importable for testing (guard main with if __name__ == "__main__")
- Expose a generate_map(artifact_dir, mondo_id, output_dir, as_of_date) function

Write the complete file. After writing, verify:
  python3 -c "import tools.generate_scientific_cartography_map; print('import ok')" 2>&1 || python3 tools/generate_scientific_cartography_map.py --help 2>&1

Report: file written, import check result, any syntax errors.
`, { label: 'write-generator', phase: 'Implement' })

log('Generator written — writing tests')

// Phase 3: Tests
phase('Test')

const tests = await agent(`
You are in /mnt/c/Projects/biotech_screener/biotech-screener.

CONTEXT:
Generator written:
${implement.slice(0, 600)}

TASK: Write tests/scientific_cartography/test_map_generator.py and run them.

The generator is at tools/generate_scientific_cartography_map.py.
It exposes a generate_map(artifact_dir, mondo_id, output_dir, as_of_date) function.

Write a test file that:
1. Creates a small fixture artifact directory in a tempdir with minimal valid files:
   - program_records.jsonl: 10 programs for MONDO:0005148 across phase1/phase2/phase3/unknown stages,
     2-3 with known mechanism (e.g. "GLP-1 RA"), rest unknown mechanism; mix of tickers and no ticker
   - competitive_clusters.jsonl: 2 clusters for MONDO:0005148
   - disease_map_summary.json: minimal valid structure
   - map_index.json: minimal valid structure  
   - landscape_features.jsonl: 2 features
   - artifact_manifest.json: {"generated_at": "2026-06-23", "artifacts": ["program_records.jsonl"]}

2. Tests to write:
   - test_map_json_schema: map.json exists, has metadata.disease_name, metadata.governance list, lanes list, programs dict
   - test_map_json_deterministic: generate twice, map.json identical both times
   - test_unknown_mechanism_lane_present: lanes include an entry with is_unknown=True
   - test_unknown_stage_column_present: if fixture has unknown-stage programs, unknown column appears in at least one lane
   - test_html_generated: index.html exists and contains "READ_ONLY_DIAGNOSTIC"
   - test_html_self_contained: index.html does NOT contain "http://" or "https://" (no CDN)
   - test_svg_generated: map.svg exists and contains "<svg"
   - test_governance_text_in_html: index.html contains "Not an investment recommendation" or "NOT_AN_INVESTMENT_RECOMMENDATION"
   - test_forbidden_source_guard: if artifact_manifest.json contains "selector" or "final_score" in artifact names, generator raises SystemExit
   - test_no_recommendation_language: generated output files do not contain words: "buy", "sell", "ranking", "alpha signal", "position size"
   - test_readme_generated: README.md exists and contains disease name

3. Run the tests:
   python3 -m pytest tests/scientific_cartography/test_map_generator.py -v --tb=short 2>&1 | tail -60

4. Also run the broader Sci-Cart test suite for regressions:
   python3 -m pytest tests/scientific_cartography/ -v --tb=short 2>&1 | tail -40

5. Fix any failures (edit generator or tests as needed) until all pass.

Report:
- Test file written to: (path)
- Test count and pass/fail
- Any fixes needed and what you changed
- Final pytest output
`, { label: 'write-run-tests', phase: 'Test' })

log('Tests complete — generating T2DM prototype')

// Phase 4: Generate the T2DM prototype
phase('Generate')

const generate = await agent(`
You are in /mnt/c/Projects/biotech_screener/biotech-screener.

CONTEXT:
Generator: tools/generate_scientific_cartography_map.py (implemented and tested)
Tests: ${tests.slice(0, 200)}

TASK: Generate the T2DM prototype map.

Step 1 — Run the generator:
python3 tools/generate_scientific_cartography_map.py \\
  --artifact-dir artifacts/scientific_cartography/2026-06-23-r2b \\
  --disease-mondo MONDO:0005148 \\
  --output-dir artifacts/scientific_cartography/map_ux/type-2-diabetes-mellitus \\
  --as-of-date 2026-06-23

Step 2 — Report on output:
ls -lh artifacts/scientific_cartography/map_ux/type-2-diabetes-mellitus/

Step 3 — Check map.json contents:
python3 -c "
import json
with open('artifacts/scientific_cartography/map_ux/type-2-diabetes-mellitus/map.json') as f:
    data = json.load(f)
meta = data.get('metadata', {})
summary = data.get('summary', {})
lanes = data.get('lanes', [])
print('=== METADATA ===')
print('disease_name:', meta.get('disease_name'))
print('program_count:', meta.get('program_count'))
print('known_stage_count:', meta.get('known_stage_count'))
print('known_mechanism_count:', meta.get('known_mechanism_count'))
print('unique_tickers:', meta.get('unique_tickers'))
print('governance:', meta.get('governance'))
print('warnings:', meta.get('warnings'))
print()
print('=== SUMMARY ===')
print('by_stage:', summary.get('by_stage'))
print('by_mechanism (top 5):', dict(list(sorted(summary.get('by_mechanism', {}).items(), key=lambda x: -x[1]))[:5]))
print('top_tickers:', summary.get('top_tickers', [])[:15])
print()
print('=== LANES ===')
for lane in lanes:
    col_counts = {k: len(v) for k,v in lane.get('columns', {}).items() if v}
    print(f'  {lane[\"mechanism\"][:40]}: {lane[\"program_count\"]} programs, cols={col_counts}')
" 2>&1 | head -60

Step 4 — Check HTML:
wc -c artifacts/scientific_cartography/map_ux/type-2-diabetes-mellitus/index.html
wc -c artifacts/scientific_cartography/map_ux/type-2-diabetes-mellitus/map.svg
grep -c "governance\\|DIAGNOSTIC\\|READ_ONLY" artifacts/scientific_cartography/map_ux/type-2-diabetes-mellitus/index.html

Step 5 — Check git status (confirm output is untracked, not staged):
cd /mnt/c/Projects/biotech_screener/biotech-screener && git status --short | head -20

Step 6 — Check .gitignore for map_ux:
grep -E "map_ux|scientific_cartography.*ux" .gitignore 2>/dev/null || echo "not gitignored — note for memo"

Report:
- Exact run command used
- Output file sizes
- map.json: program_count, stage distribution, mechanism lanes, top tickers
- HTML size and governance text present
- Git status of generated files (untracked? staged? committed?)
- Whether map_ux is in .gitignore
`, { label: 'generate-t2dm', phase: 'Generate' })

log('Prototype generated — writing memo and committing')

// Phase 5: Memo + Commit
phase('Commit')

const commit = await agent(`
You are in /mnt/c/Projects/biotech_screener/biotech-screener.

CONTEXT:
IMPLEMENT: ${implement.slice(0, 500)}
TESTS: ${tests.slice(0, 400)}
GENERATE: ${generate.slice(0, 800)}

TASK: Write implementation memo, add map_ux to .gitignore, commit generator + tests + memo.

Step 1 — Add map_ux to .gitignore if not already there:
   Read .gitignore, then add if missing:
   artifacts/scientific_cartography/map_ux/
   (generated map output — not committed)

Step 2 — Write implementation memo:
Write to: artifacts/audit/SCIENTIFIC_CARTOGRAPHY_MAP_UX_V0_2B_STATIC_PROTOTYPE_IMPLEMENTATION_2026_06_23.md

Required sections:
# Scientific Cartography Map UX v0.2b — Static Prototype Implementation
Date: 2026-06-23

## Summary
One paragraph: what was built, what it consumes, what it produces.

## Generator
- File: tools/generate_scientific_cartography_map.py
- CLI: how to run it
- Key design decisions (SVG approach, no external libs, governance guard)

## T2DM Prototype Results
### Program Statistics
| Metric | Value |
| Program count | N |
| Known stage | N (X%) |
| Known mechanism | N (X%) |
| Unique tickers | N |

### Stage Distribution
(table from map.json)

### Mechanism Lanes
(list lanes and program counts)

### Top Tickers
(list)

### Output Files
| File | Size |
| index.html | Xkb |
| map.svg | Xkb |
| map.json | Xkb |
| README.md | Xkb |

## Data Quality Notes
- Mechanism coverage note (honest: sparse is expected)
- Stage residual unknown note
- Disease fragmentation note

## Tests
- File: tests/scientific_cartography/test_map_generator.py
- Test count: N
- All pass: yes

## Governance
- READ_ONLY_DIAGNOSTIC
- NOT_AN_INVESTMENT_RECOMMENDATION
- No ranker/selector/sizing/final_score/portfolio/production changes
- Generated output gitignored (not committed)

## Next Steps
- v0.2c: mechanism/modality landscape map
- v0.2d: company pipeline map
- Mechanism normalization R6 will improve lane resolution

## Verdict
PASS_MAP_UX_V0_2B_STATIC_PROTOTYPE_DIAGNOSTIC_ONLY

Step 3 — Check git status:
git status --short

Step 4 — Commit ONLY these files:
- tools/generate_scientific_cartography_map.py
- tests/scientific_cartography/test_map_generator.py
- artifacts/audit/SCIENTIFIC_CARTOGRAPHY_MAP_UX_V0_2B_STATIC_PROTOTYPE_IMPLEMENTATION_2026_06_23.md
- .gitignore (if modified)

DO NOT commit:
- artifacts/scientific_cartography/map_ux/ (generated output)
- Any snapshot or production files

git add tools/generate_scientific_cartography_map.py tests/scientific_cartography/test_map_generator.py artifacts/audit/SCIENTIFIC_CARTOGRAPHY_MAP_UX_V0_2B_STATIC_PROTOTYPE_IMPLEMENTATION_2026_06_23.md .gitignore

git commit -m "$(cat <<'EOF'
feat(sci-cart): Map UX v0.2b — static disease-map prototype generator

Implements tools/generate_scientific_cartography_map.py: reads Sci-Cart
artifact directories and generates static HTML/SVG/JSON disease landscape maps.
First prototype: type-2-diabetes-mellitus (MONDO:0005148). Mechanism/stage/
confidence/ticker encodings; honest sparse-data treatment; governance guard.
Generated output gitignored; not committed.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"

Step 5 — Confirm:
git log --oneline -3
git status --short

Report:
- .gitignore updated: yes/no
- Memo written: yes/no, line count
- Files committed (list)
- Commit hash
- git status after commit (generated output still untracked)
- Final verdict: PASS_MAP_UX_V0_2B_STATIC_PROTOTYPE_DIAGNOSTIC_ONLY
`, { label: 'memo-commit', phase: 'Commit' })

return {
  read: readPhase.slice(0, 400),
  implement: implement.slice(0, 400),
  tests: tests.slice(0, 400),
  generate: generate.slice(0, 800),
  commit: commit,
}
