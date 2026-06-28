
export const meta = {
  name: 'sci-cart-phase13-5-r2b',
  description: 'Phase 13.5 R2b — fix stage parser singular "phase" field, add tests, run diagnostics, write memo',
  phases: [
    { title: 'Discover', detail: 'Locate _parse_simplified_format, read full context, understand stage normalizer' },
    { title: 'Fix', detail: 'Patch _parse_simplified_format to support singular phase string' },
    { title: 'Test', detail: 'Write and run targeted tests for the parser fix' },
    { title: 'Refresh', detail: 'Rerun Sci-Cart diagnostics, measure stage coverage before/after' },
    { title: 'Memo + Commit', detail: 'Write Phase 13.5 R2b memo and commit parser fix, tests, memo' },
  ],
}

// Phase 1: Discover
phase('Discover')

const discovery = await agent(`
You are in /mnt/c/Projects/biotech_screener/biotech-screener. READ ONLY in this phase.

Run ALL of the following commands and report verbatim output:

1. Find _parse_simplified_format:
   grep -rn "_parse_simplified_format" . --include="*.py" | grep -v __pycache__ | grep -v ".pyc"

2. Find stage-related ingest code:
   grep -rn "phases\|clinical_stage\|phase_string\|stage_normaliz" scientific_cartography/ --include="*.py" | grep -v __pycache__ | head -60

3. Read the full file containing _parse_simplified_format (find it first, then read it entirely):
   grep -rn "_parse_simplified_format" . --include="*.py" | grep -v __pycache__ | head -5

4. Find the stage normalizer:
   grep -rn "def.*stage\|stage_map\|STAGE_MAP\|normalize_stage\|clinical_stage" scientific_cartography/ --include="*.py" | grep -v __pycache__ | head -40

5. Find existing tests for this parser:
   grep -rn "_parse_simplified_format\|parse_simplified\|trial_records\|clinical_stage" tests/ --include="*.py" | grep -v __pycache__ | head -40

6. Show a sample of trial_records.json structure:
   python3 -c "
import json
with open('data/snapshots/2026-06-23/inputs/trial_records.json') as f:
    data = json.load(f)
records = data if isinstance(data, list) else data.get('records', data.get('trials', []))
print('Total records:', len(records))
print('First record keys:', list(records[0].keys()) if records else 'none')
print('Sample phase values:')
phases_seen = set()
for r in records[:500]:
    p = r.get('phase')
    if p and p not in phases_seen:
        phases_seen.add(p)
        print(' ', repr(p))
    if len(phases_seen) >= 20:
        break
print('Also checking plural phases key:')
for r in records[:50]:
    if r.get('phases'):
        print('  phases field found:', r.get('phases'))
        break
else:
    print('  no plural phases field found in first 50 records')
" 2>&1 | head -60

Report ALL output verbatim. Do not edit anything.
`, { label: 'discover', phase: 'Discover' })

log('Discovery done — reading target file')

// Get the actual file content
const fileRead = await agent(`
You are in /mnt/c/Projects/biotech_screener/biotech-screener. READ ONLY.

From the discovery output below, identify the file containing _parse_simplified_format.
Then read the ENTIRE file and return its full content.

Also read the stage normalizer file if it's separate.

Discovery output:
${discovery}

Return:
1. The full path of the file containing _parse_simplified_format
2. The complete file content (use cat -n to include line numbers)
3. The full path and content of the stage normalizer (if separate)
4. The full path of the most relevant test file to extend
5. The content of that test file (first 100 lines and any test class names)

cat -n <file> for each.
`, { label: 'read-files', phase: 'Discover' })

log('Files read — implementing fix')

// Phase 2: Fix
phase('Fix')

const fix = await agent(`
You are in /mnt/c/Projects/biotech_screener/biotech-screener. 
This phase: implement the parser fix only. No tests yet.

CONTEXT FROM DISCOVERY:
${discovery}

FILE CONTENT:
${fileRead}

TASK: Phase 13.5 R2b — fix _parse_simplified_format to support singular "phase" string field.

ROOT CAUSE: _parse_simplified_format calls data.get("phases", []) (plural, expects list).
trial_records.json stores field as "phase" (singular string, e.g. "PHASE2").
So every record returns empty list and stage becomes unknown.

REQUIRED BEHAVIOR:
1. Preserve existing support: if "phases" key exists as list, use it (no change to existing path)
2. Add new support: if "phases" is absent/empty, check "phase" as singular string
3. Normalize these values (map to your existing stage normalizer semantics):
   - "PHASE1" → phase1
   - "PHASE1_PHASE2" → phase1_phase2 (or whatever the normalizer uses for dual-phase)
   - "PHASE2" → phase2
   - "PHASE2_PHASE3" → phase2_phase3
   - "PHASE3" → phase3
   - "PHASE4" → phase4
   - "EARLY_PHASE1" → early_phase1 (or equivalent)
   - "NOT_APPLICABLE" → not_applicable (or unknown — follow existing convention)
   - missing/null/empty → unknown (no change)
4. Do NOT change any other fields: disease, mechanism, ticker, confidence, asset alias
5. Do NOT change ranker, selector, sizing, final_score, gates, snapshots, portfolio
6. Do NOT add warnings for successfully parsed singular phase — only warn on missing/unparseable

CONSTRAINTS:
- Make the smallest possible change that fixes the bug
- Preserve all existing behavior
- The fix should be in _parse_simplified_format (or a helper it calls)
- If the stage normalizer already handles these strings, just pass through to it
- Label this PHASE13_5_R2B_STAGE_PARSER_COMPATIBILITY_FIX in any comment

STEPS:
1. Read the file again to confirm current content
2. Make the edit using Edit tool
3. Verify the edit looks correct by reading the modified section
4. Check git diff to confirm only the parser file changed

Report:
- Exact file path edited
- The old code (before)
- The new code (after)  
- git diff output
- Confirmation that no other files were modified
`, { label: 'fix-parser', phase: 'Fix' })

log('Parser fix applied — writing tests')

// Phase 3: Tests
phase('Test')

const tests = await agent(`
You are in /mnt/c/Projects/biotech_screener/biotech-screener.

CONTEXT:
${discovery}
${fileRead}
FIX APPLIED:
${fix}

TASK: Write targeted tests for Phase 13.5 R2b and run them.

Step 1 — Find/create the right test file.
Look at the existing test files identified in discovery. Either:
a) Add tests to an existing test file for the CTGov parser/ingest
b) Create a new test file: tests/test_phase13_5_r2b_stage_parser.py

The tests MUST cover:
1. phases list still works: {"phases": ["PHASE2"]} → phase2 (regression test)
2. singular phase string: {"phase": "PHASE2"} → phase2
3. singular phase string: {"phase": "PHASE3"} → phase3
4. dual-phase string: {"phase": "PHASE1_PHASE2"} → correct normalized stage
5. early phase: {"phase": "EARLY_PHASE1"} → correct normalized stage
6. missing phase: {} → unknown/None/empty (no crash)
7. null phase: {"phase": null} → unknown/None/empty (no crash)
8. not_applicable: {"phase": "NOT_APPLICABLE"} → not_applicable or unknown (consistent with existing convention)

Step 2 — Write the test file (or add to existing).

Step 3 — Run the tests:
   python3 -m pytest <test_file> -v 2>&1 | tail -40

Step 4 — Also run the existing Sci-Cart tests to confirm no regressions:
   python3 -m pytest tests/ -k "cartograph or sci_cart or scientific_cartography" -v --tb=short 2>&1 | tail -60

Step 5 — Report:
- Test file path and content
- pytest output for new tests
- pytest output for existing Sci-Cart tests
- Pass/fail verdict

If any test fails, fix the implementation (go back to edit the parser) until all tests pass.
`, { label: 'write-run-tests', phase: 'Test' })

log('Tests complete — running diagnostic refresh')

// Phase 4: Refresh diagnostics
phase('Refresh')

const refresh = await agent(`
You are in /mnt/c/Projects/biotech_screener/biotech-screener.

CONTEXT:
Fix applied: ${fix.slice(0, 300)}
Tests passed: ${tests.slice(0, 200)}

TASK: Rerun Sci-Cart diagnostics to measure stage coverage after the R2b fix.

Step 1 — Run the diagnostic wrapper:
python3 tools/run_scientific_cartography_diagnostics.py \\
  --as-of-date 2026-06-23 \\
  --snapshot-dir data/snapshots/2026-06-23 \\
  --ctgov-cache data/snapshots/2026-06-23/inputs \\
  --output-dir artifacts/scientific_cartography/2026-06-23-r2b

(Use a new output dir suffix -r2b so we don't overwrite the pre-fix baseline)

Step 2 — Check stage distribution in fresh artifacts:
python3 -c "
import json
stages = {}
count = 0
with open('artifacts/scientific_cartography/2026-06-23-r2b/program_records.jsonl') as f:
    for line in f:
        prog = json.loads(line)
        stage = prog.get('clinical_stage') or prog.get('stage') or 'unknown'
        stages[stage] = stages.get(stage, 0) + 1
        count += 1
total = sum(stages.values())
known = total - stages.get('unknown', 0) - stages.get('', 0) - stages.get(None, 0)
print(f'Known stage: {known}/{total} ({100*known/total:.1f}%)')
print(f'Unknown: {stages.get(\"unknown\", 0)} ({100*stages.get(\"unknown\", 0)/total:.1f}%)')
print()
print('Distribution:')
for k,v in sorted(stages.items(), key=lambda x: -x[1])[:20]:
    print(f'  {k}: {v} ({100*v/total:.1f}%)')
" 2>&1

Step 3 — Check ticker linkage (should remain ~98%):
python3 -c "
import json
with_ticker = 0
total = 0
with open('artifacts/scientific_cartography/2026-06-23-r2b/program_records.jsonl') as f:
    for line in f:
        prog = json.loads(line)
        total += 1
        if prog.get('ticker') or prog.get('tickers'):
            with_ticker += 1
print(f'Ticker linkage: {with_ticker}/{total} ({100*with_ticker/total:.1f}%)')
" 2>&1

Step 4 — Check mechanism coverage (should remain sparse, ~0.07%):
python3 -c "
import json
mechs = {}
total = 0
with open('artifacts/scientific_cartography/2026-06-23-r2b/program_records.jsonl') as f:
    for line in f:
        prog = json.loads(line)
        total += 1
        mech = prog.get('mechanism_class') or prog.get('mechanism') or 'unknown'
        mechs[mech] = mechs.get(mech, 0) + 1
known = total - mechs.get('unknown', 0) - mechs.get('', 0)
print(f'Known mechanism: {known}/{total} ({100*known/total:.2f}%)')
" 2>&1

Step 5 — Check confidence distribution (should be non-zero after R3):
python3 -c "
import json
confs = {}
total = 0
with open('artifacts/scientific_cartography/2026-06-23-r2b/program_records.jsonl') as f:
    for line in f:
        prog = json.loads(line)
        total += 1
        conf = prog.get('confidence') or 'missing'
        if isinstance(conf, float):
            bucket = f'{conf:.1f}'
        else:
            bucket = str(conf)
        confs[bucket] = confs.get(bucket, 0) + 1
print(f'Confidence distribution (top 10):')
for k,v in sorted(confs.items(), key=lambda x: -x[1])[:10]:
    print(f'  {k}: {v} ({100*v/total:.1f}%)')
" 2>&1

Report all output verbatim. Label it BEFORE/AFTER clearly:
- BEFORE R2b: stage was 100% unknown (from prior workflow run)
- AFTER R2b: report the actual numbers above
`, { label: 'diagnostic-refresh', phase: 'Refresh' })

log('Diagnostics complete — writing memo and committing')

// Phase 5: Memo + Commit
phase('Memo + Commit')

const memoAndCommit = await agent(`
You are in /mnt/c/Projects/biotech_screener/biotech-screener.

CONTEXT:
DISCOVERY: ${discovery.slice(0, 400)}
FIX: ${fix.slice(0, 600)}
TESTS: ${tests.slice(0, 400)}
REFRESH: ${refresh.slice(0, 800)}

TASK: Write the Phase 13.5 R2b memo and commit everything.

Step 1 — Write memo to:
artifacts/audit/SCIENTIFIC_CARTOGRAPHY_PHASE13_5_R2B_STAGE_PARSER_COMPATIBILITY_FIX_2026_06_23.md

Required sections:
# Scientific Cartography Phase 13.5 — R2b Stage Parser Compatibility Fix
Date: 2026-06-23
Label: PHASE13_5_R2B_STAGE_PARSER_COMPATIBILITY_FIX

## Root Cause
- What field was being read vs what was in trial_records.json
- Exact code before and after

## Fix Summary
- File(s) modified
- Nature of change (minimal, backward-compatible)
- No other files changed

## Test Coverage
- List each test case added
- Test file path
- All tests pass / any failures

## Diagnostic Results
### Stage Coverage
| Metric | Before R2b | After R2b |
| Stage known % | 0% | X% |
...

### Ticker Linkage
Before/after

### Mechanism Coverage  
Unchanged (expected)

### Confidence Distribution
Non-zero (expected after R3)

## Governance
- DIAGNOSTIC_ONLY
- No ranker, selector, sizing, final_score, gates, snapshots, portfolio changes
- No production wiring
- No freeze lift

## Next Step
v0.2b static map prototype can now proceed with real stage columns
(per SCIENTIFIC_CARTOGRAPHY_MAP_UX_V0_2B_STATIC_PROTOTYPE_SPEC_2026_06_23.md)

## Verdict
PASS_R2B_STAGE_PARSER_COMPATIBILITY_DIAGNOSTIC_ONLY

Step 2 — Check git status to see what files changed:
git status --short
git diff --name-only

Step 3 — Commit ONLY these files:
- The parser fix file
- The test file(s) added/modified
- The memo

Do NOT commit:
- artifacts/scientific_cartography/2026-06-23-r2b/ (generated artifacts)
- Any snapshot files
- Any production pipeline files

Commit command:
git add <parser_file> <test_file> artifacts/audit/SCIENTIFIC_CARTOGRAPHY_PHASE13_5_R2B_STAGE_PARSER_COMPATIBILITY_FIX_2026_06_23.md
git commit -m "fix(sci-cart): Phase 13.5 R2b — stage parser singular phase field compatibility

_parse_simplified_format now supports trial_records.json singular \\"phase\\" string
field in addition to existing plural \\"phases\\" list. Fixes 100% unknown stage
across all 73,075 program records. All existing Sci-Cart tests pass.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

Step 4 — Report:
- Memo written: yes/no, line count
- Files committed (list them)
- Commit hash
- Stage coverage before/after (one line each)
- Whether tests passed
- Final verdict: PASS_R2B_STAGE_PARSER_COMPATIBILITY_DIAGNOSTIC_ONLY
`, { label: 'memo-commit', phase: 'Memo + Commit' })

return {
  fix: fix.slice(0, 800),
  tests: tests.slice(0, 400),
  refresh: refresh.slice(0, 800),
  memoAndCommit: memoAndCommit,
}
