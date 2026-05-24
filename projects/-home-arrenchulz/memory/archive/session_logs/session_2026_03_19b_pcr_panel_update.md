---
name: 2026-03-19 session B — PCR panel Mar-19 snapshot
description: Added Mar-19 snapshot to PCR panel, verified coverage, deferred decision to April outcome maturation
type: project
---

## What was done
- Stashed 780-file formatter churn (git stash: `formatter-hygiene-pass-780-files`)
- Ran full PCR checklist: coverage PASS, signal shape PASS, temporal consistency BORDERLINE (60% at 20d)
- Created Mar-19 archive (`data/archives/2026-03-19.tar.gz`, 296 tickers)
- Rebuilt precatalyst options panel: 7 snapshots, 647 rows (was 6/515)
- Mar-19 build_window CLINICAL: 55 rows, 52 with PCR (95%), 92% non-neutral
- High-PCR names (Mar-19): FDMT (0.92), FOLD (0.78), ARGX (0.70), GLUE (0.64), CATX (0.61)
- Reran focused eval — ICs unchanged (no new outcome data beyond what was already priced in)

**Why:** PCR shadow overlay needs more outcome maturation before any promotion decision. Adding the snapshot now queues it for the April evidence window.

**How to apply:** Do NOT rerun the focused PCR study or propose turning on the penalty before the checkpoints below.

## Next checkpoints
- **~Apr 8**: rerun `eval_put_call_ratio_focused.py` — Mar-19 5d outcomes available
- **~Apr 16**: Feb-20/Feb-27 20d outcomes mature
- **Early April**: BIIB/CELC/PVLA/TBPH hard-catalyst resolution as contextual evidence
- No model change justified before then
