---
name: Keep formatter/hygiene changes separate from model work
description: Never mix bulk formatting/whitespace/import-reorder changes into DEM/PCR/catalyst/signal commits
type: feedback
---

Bulk formatter sweeps (whitespace, import reordering, LF normalization) must be treated as separate hygiene commits, never bundled with DEM, PCR, catalyst, or any model/signal work.

**Why:** The repo enforces pre-commit/formatter discipline and LF normalization in config. A giant whitespace-only diff pollutes git blame, makes code review impossible, and obscures the actual model changes. The user explicitly rejected a 780-file formatter pass being mixed in.

**How to apply:** If a formatter or linter produces bulk changes across many files, stash or commit them separately with a clear "chore: formatting" label. Never let auto-format output ride alongside analytical or pipeline commits.
