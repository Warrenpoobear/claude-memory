
export const meta = {
  name: 'sci-cart-v02b-prep',
  description: 'Refresh Sci-Cart diagnostics after R2, check stage data, write v0.2b spec',
  phases: [
    { title: 'Discover', detail: 'Find corrected wrapper, inspect R2 fix, locate latest artifacts' },
    { title: 'Refresh', detail: 'Rerun diagnostics with corrected wrapper' },
    { title: 'Stage Check', detail: 'Inspect artifact outputs for stage distribution' },
    { title: 'Spec', detail: 'Write v0.2b static prototype implementation spec' },
  ],
}

// Phase 1: Discover wrapper and R2 fix details
phase('Discover')

const discovery = await agent(`
You are doing READ-ONLY discovery in /mnt/c/Projects/biotech_screener/biotech-screener.

Run these commands and report all output:

1. Find the Scientific Cartography diagnostic wrapper:
   find . -name "*scientific_cartography*" -name "*.py" | grep -v __pycache__ | grep -v test | sort

2. Check the R2 fix (most recent sci-cart related commit):
   git log --oneline -10 -- scientific_cartography/ tools/run_scientific_cartography_diagnostics.py

3. Read the wrapper script (first 80 lines):
   head -80 tools/run_scientific_cartography_diagnostics.py 2>/dev/null || echo "not found at that path"

4. Find what input files the wrapper expects:
   grep -n "trial_records\\|input\\|snapshot\\|as.of.date\\|--date\\|argv" tools/run_scientific_cartography_diagnostics.py 2>/dev/null | head -40

5. List available snapshots/dates:
   ls /mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/ 2>/dev/null | tail -10 || echo "not found"
   ls /mnt/c/Projects/biotech_screener/biotech-screener/data/ 2>/dev/null | head -20

6. List recent Sci-Cart artifact directories:
   ls artifacts/scientific_cartography/ 2>/dev/null | tail -10

7. Check the R2 fix commit details:
   git show f4a32df2 --stat --no-patch

Report ALL output verbatim.
`, { label: 'discover-wrapper', phase: 'Discover' })

log('Discovery complete — determining run command')

// Phase 2: Refresh diagnostics
phase('Refresh')

const refresh = await agent(`
You are in /mnt/c/Projects/biotech_screener/biotech-screener.

Context from prior discovery step:
${discovery}

Based on the discovery above, determine the correct command to run the Scientific Cartography diagnostic wrapper with the R2-fixed input path. The R2 fix added trial_records.json to the input discovery order.

Then run the wrapper. If it requires a --date or --as-of-date argument, use today's date 2026-06-23. If it requires a snapshot, use the most recent available.

Run the command and capture all output. If it fails, capture the full error and diagnose why.

Do NOT:
- Modify any code
- Touch ranker, selector, sizing, final_score, gates, snapshots, portfolio files
- Start a server
- Commit anything

Report:
1. The exact command you ran
2. Full stdout/stderr output (up to 200 lines)
3. Whether it succeeded or failed
4. What artifact directory was written to (if any)
5. List of files in the output artifact directory
`, { label: 'run-wrapper', phase: 'Refresh' })

log('Wrapper run complete — checking stage distribution')

// Phase 3: Check stage data in fresh artifacts
phase('Stage Check')

const stageCheck = await agent(`
You are in /mnt/c/Projects/biotech_screener/biotech-screener.

Context from prior steps:
DISCOVERY:
${discovery}

REFRESH RUN:
${refresh}

Now inspect the freshly generated artifact directory (or the most recent one if the run failed) for stage distribution.

Run these commands:

1. Find the most recent artifact directory:
   ls -t artifacts/scientific_cartography/ | head -5

2. Check disease_map_summary.json for stage distribution:
   python3 -c "
import json, sys
with open('artifacts/scientific_cartography/<MOST_RECENT>/disease_map_summary.json') as f:
    data = json.load(f)
# Check stage fields
diseases = data.get('diseases', data if isinstance(data, list) else [])
stages = {}
for d in (diseases if isinstance(diseases, list) else []):
    for prog in d.get('programs', []):
        stage = prog.get('clinical_stage', prog.get('stage', 'unknown'))
        stages[stage] = stages.get(stage, 0) + 1
total = sum(stages.values())
for k,v in sorted(stages.items(), key=lambda x: -x[1])[:20]:
    print(f'{k}: {v} ({100*v/total:.1f}%)')
print(f'Total: {total}')
" 2>&1 | head -40

3. Check program_records.jsonl for stage field:
   python3 -c "
import json
stages = {}
count = 0
with open('artifacts/scientific_cartography/<MOST_RECENT>/program_records.jsonl') as f:
    for line in f:
        prog = json.loads(line)
        stage = prog.get('clinical_stage', prog.get('stage', 'unknown'))
        stages[stage] = stages.get(stage, 0) + 1
        count += 1
total = sum(stages.values())
for k,v in sorted(stages.items(), key=lambda x: -x[1])[:20]:
    print(f'{k}: {v} ({100*v/total:.1f}%)')
print(f'Total programs: {count}')
" 2>&1 | head -40

4. Check mechanism normalization coverage:
   python3 -c "
import json
mechs = {}
count = 0
with open('artifacts/scientific_cartography/<MOST_RECENT>/program_records.jsonl') as f:
    for line in f:
        prog = json.loads(line)
        mech = prog.get('mechanism_class', prog.get('mechanism', 'unknown'))
        mechs[mech] = mechs.get(mech, 0) + 1
        count += 1
total = sum(mechs.values())
known = total - mechs.get('unknown', 0) - mechs.get('', 0)
print(f'Known mechanism: {known}/{total} ({100*known/total:.1f}%)')
for k,v in sorted(mechs.items(), key=lambda x: -x[1])[:15]:
    print(f'{k}: {v} ({100*v/total:.1f}%)')
" 2>&1 | head -40

Replace <MOST_RECENT> with the actual most recent directory name.

Report:
1. Stage distribution (% unknown vs known)
2. Mechanism normalization coverage
3. Whether data quality improved vs pre-R2 (audit found: 100% unknown stage, 0.07% mechanism coverage)
4. Which disease has best coverage for v0.2b prototype (confirm or revise recommendation of type-2-diabetes-mellitus)
5. Exact artifact directory path to use for prototype
`, { label: 'stage-check', phase: 'Stage Check' })

log('Stage check complete — writing v0.2b spec')

// Phase 4: Write the spec
phase('Spec')

const spec = await agent(`
You are in /mnt/c/Projects/biotech_screener/biotech-screener.

Context from prior steps:
DISCOVERY:
${discovery}

REFRESH:
${refresh}

STAGE CHECK:
${stageCheck}

Write the v0.2b static prototype implementation spec to:
  artifacts/audit/SCIENTIFIC_CARTOGRAPHY_MAP_UX_V0_2B_STATIC_PROTOTYPE_SPEC_2026_06_23.md

This is a spec document (NO code implementation). It must be actionable enough that an engineer can implement the HTML/SVG generator from it alone.

Required sections:

# Scientific Cartography Map UX v0.2b — Static Prototype Spec
Date: 2026-06-23

## 1. Objective
One-paragraph summary. Static-first RA-style disease landscape map for type-2-diabetes-mellitus (or revised disease if stage check found a better candidate). No server, no React, no production wiring.

## 2. Input Artifacts
List exact file paths from the artifact directory confirmed in stage check. For each file:
- path
- what data it contributes to the map
- any known quality issues (stage unknown, mechanism sparse, etc.)

## 3. Disease Selection
Which disease. Why. Evidence from stage check (program count, mechanism coverage, ticker count, cluster count, source ref count). If stage is still 100% unknown, say so and specify how the prototype handles it.

## 4. Output Files
Exact paths under artifacts/scientific_cartography/map_ux/type-2-diabetes-mellitus/ (or revised slug):
- index.html — layout, description
- map.svg — visual grammar description
- map.json — data contract (define all fields)
- README.md — content

## 5. Visual Grammar
Precise specification:
- Map frame: what are rows (lanes), what are columns
- If stage is unknown: fallback column scheme (e.g., by source count or program count only)
- Node encoding: size/color/shape rules for modality, confidence, crowding, source strength
- Label rules: what text goes on each node
- Tooltip / sidecard content
- Unknown-state rendering: how to visually distinguish unknown stage, unknown mechanism

## 6. Data Pipeline (no server)
Step-by-step: how a Python generator script reads the input artifacts and produces the four output files. Pseudo-code or clear prose. Do NOT write actual Python — describe the algorithm:
1. Load inputs
2. Filter to target disease
3. Build map data model (define structure)
4. Render SVG (describe layout algorithm)
5. Wrap in HTML
6. Write map.json and README.md

## 7. map.json Schema
Define the JSON schema for map.json. This is the data contract. All fields, types, required vs optional, and what "unknown" looks like.

## 8. Acceptance Criteria
Checklist — the prototype passes when:
- Reader can identify top crowded mechanisms (or "mechanism data sparse" if <5 known)
- Reader can identify stage distribution (or see "[stage data unresolved]" label)
- Reader can identify major companies/assets
- Reader can see white-space candidates
- Reader can see low-confidence areas
- Map is deterministic and reproducible
- Source refs are preserved and count is visible
- File opens in browser with file:// (no server)

## 9. Governance
- DIAGNOSTIC_ONLY
- No ranker, selector, sizing, final_score, gates, snapshots, portfolio changes
- No investment/trading recommendations
- No model promotion, no freeze lift
- No production wiring

## 10. Implementation Notes
Any caveats, gotchas, or decisions the implementer needs to know based on the actual artifact data found in stage check.

## Verdict
SPEC_COMPLETE_V0_2B_READY_FOR_IMPLEMENTATION

Write the file. Then verify it was written:
  wc -l artifacts/audit/SCIENTIFIC_CARTOGRAPHY_MAP_UX_V0_2B_STATIC_PROTOTYPE_SPEC_2026_06_23.md

Report: file path, line count, and a 3-bullet summary of the most important decisions in the spec.
`, { label: 'write-spec', phase: 'Spec' })

return {
  discovery: discovery.slice(0, 500),
  refresh: refresh.slice(0, 500),
  stageCheck: stageCheck.slice(0, 500),
  spec: spec,
}
