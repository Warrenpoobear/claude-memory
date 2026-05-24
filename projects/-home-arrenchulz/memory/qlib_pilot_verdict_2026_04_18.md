---
name: Qlib pilot verdict — DROP on aarch64 WSL2 (2026-04-18)
description: Week 2 Qlib sprint killed Day 1 due to aarch64 wheel + no-sdist + no-local-toolchain; record of verdict + revisit conditions
type: project
originSessionId: b9d88e96-eb38-45d4-b094-c0b588a6ad1e
---
Week 2 (Qlib) of the 30-day repo-evaluation plan was killed on Day 1, before a single line of research code was written.

**Why killed:**
1. Dev box is WSL2 aarch64 (Windows on ARM) — see `env_wsl2_aarch64.md`.
2. pyqlib 0.9.7 has no aarch64 wheel and no PyPI sdist.
3. Not on conda-forge.
4. Local box has no gcc / `build-essential` / `python3.12-dev` — source build would require sudo.

The plan's kill rule ("if a tool cannot show workflow savings or measurable model improvement in 1 week, stop") was already triggered by install friction alone, because Qlib's whole pitch is "research discipline" and acquiring that discipline costs a system-level change on the primary dev machine before any discipline gain exists.

**How to apply:**
- Treat Qlib as "NOT ADOPTED on this environment" for future conversations. Don't recommend `pip install pyqlib` on this machine.
- Only revisit Qlib if: (a) user has an x86_64 Linux host available, (b) a disposable container/devcontainer is standardized for pilots, or (c) user explicitly overrides the verdict.
- The pattern generalizes: for the other repos in the 30-day plan (OpenBB, FinGPT, TradingAgents, Kronos), check aarch64 wheel availability upfront before proposing install. Treat aarch64 install friction as a signal, not a hurdle to plow through.

**Artifacts:**
- Verdict memo: `/mnt/c/Projects/biotech_screener/qlib_pilot/notes/VERDICT.md`
- Sandbox: `/mnt/c/Projects/biotech_screener/qlib_pilot/` (empty venv + empty scaffolds, safe to delete)

**Sprint outcome:** Week 2 time budget reallocated to Week 3 FinGPT (biotech NLP), per user's explicit pivot decision.
