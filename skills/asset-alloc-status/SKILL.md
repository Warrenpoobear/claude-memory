---
name: asset-alloc-status
description: |
  Check the Wake Robin asset allocation model status: last commit, test count, open phases, Phase 23 PE commitment-book state. Use when the user says "asset allocation status", "wake robin model", "check the AA model", "asset alloc", or similar. Read-only summary of the model's current state.
allowed-tools:
  - Bash(git *)
  - Bash(python3 *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(cat *)
---

# Asset Allocation Status

Read-only status check for the Wake Robin asset allocation model.

## Steps

### 1 — Locate the repo
```bash
find /mnt/c/Projects /home/arrenchulz/Projects -maxdepth 3 -name "*.py" -path "*/asset_alloc*" 2>/dev/null | head -5
# Also try:
ls /mnt/c/Projects/ 2>/dev/null
ls ~/Projects/ 2>/dev/null
```

### 2 — Git status and recent commits
```bash
cd <asset_alloc_repo> && git log --oneline -10
git status --short
```

### 3 — Test suite count
```bash
cd <asset_alloc_repo> && python3 -m pytest --collect-only -q 2>/dev/null | tail -5
# Or:
find . -name "test_*.py" | xargs grep -l "def test_" | wc -l
```

### 4 — Phase status
```bash
python3 - <<'EOF'
# Check which phases are complete vs open
# Look for phase markers in the codebase or docs
import glob, os
for f in sorted(glob.glob('docs/phase*.md') + glob.glob('specs/phase*.md') + glob.glob('PHASES*.md')):
    print(f)
EOF
```

### 5 — Phase 23 PE commitment-book state
Check memory: Phase 23 is deferred, waiting on:
- User-gathered commitment book
- Archway monthly actuals
- Entity registry
Resumption order: EntityRegistry → fixtures → loader → diagnostics

### 6 — Report
```
ASSET ALLOCATION MODEL STATUS — YYYY-MM-DD

Repo:    <path>
HEAD:    <commit hash> — <message>
Branch:  main

Recent commits:
  <hash> <message>
  ...

Tests:   NNN (last known: 391 at HEAD 0280024)
Status:  <clean / N modified files>

PHASES
  Phases 1–22 + 14.3: SHIPPED (all on origin/main)
  Phase 23 (PE commitment-book): DEFERRED
    Waiting on: commitment book + Archway actuals + entity registry
    Design at: f81ff43

Open blockers:
  L19: partially resolved (pending human row classification)
  L20: RESOLVED
```

## Context
- Repo HEAD at `0280024` with 391 tests as of 2026-05-05
- External review complete (8 findings, all fixed)
- Phase 23 design locked at commit f81ff43; implementation deferred indefinitely
- Wake Robin SFO: real estate investment + community development company

## Session-end learning

After completing this skill's task, if you encountered an unexpected behavior, constraint, API response, or workflow edge case, log it:

```
[LRN-YYYYMMDD-NNN]
Pattern-Key: SKILL_ASSET_ALLOC_STATUS_{description}
Area: hermes_ops | data_pipeline | research | portfolio
Promotion-lane: skill | none
Recurrence-Count: 1
Context: <one line — what happened>
Rule: <one line — what to do differently>
Suggested-Action: <patch to this SKILL.md, or none>
```

Recurrence ≥ 3 in 7 days → propose a patch to this `SKILL.md` via `tools/pattern_to_skillpatch.py`. Full protocol: see `self-improving` skill.
