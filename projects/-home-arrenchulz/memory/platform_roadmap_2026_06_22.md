---
name: platform-roadmap-2026-06-22
description: Operator-approved workstream sequence after containment branch — reduce legacy risk before adding autonomy
metadata: 
  node_type: memory
  type: project
  originSessionId: c137a3de-ca62-4ea1-b220-612f0a145451
---

**Fact:** Operator-approved sequence of 5 workstreams, each on its own branch.

**Why:** Platform is stabilized post-INC-2026-06-20-AUTOPUSH. Principle: reduce legacy risk before adding more autonomy.

**Sequence:**

1. ✅ **Review/merge PR #371** — MERGED to main (`00b742f4`); packages A–E2 + Hermes 0.17.0 + biotech-mcp registered.

2. ✅ **Branch: `openclaw-fence-retire-2026-06-22`** — MERGED as PR #372 (`4d1a4fd8`); `**` wildcard + shell removed from exec-approvals; 13 read-only binaries retained; 3 SOUL.md files added.

3. ✅ **Branch: `harvester-manualization-2026-06-22`** — PR #373 OPEN (draft, `b2acf98b`). Step 8 of `weekly-skill-harvester` replaced: autonomous `git add/commit/push` removed; agent now writes `docs/hermes_skills/pending/HARVEST_<date>.md` proposal only. Job still paused. Operator must merge #373 and review before re-enabling.

4. ✅ **Branch: `biotech-mcp-daily-briefs-2026-06-22`** — PR #374 OPEN (draft, `0cea79df`). Six-section read-only brief design + `docs/hermes/daily_brief_prompt.txt`. Cron spec drafted, NOT registered. Activation gate: dry-run reviewed + PR #375 merged + operator enables.

4b. **Branch: `harvester-dry-run-followup-2026-06-22`** — PR #375 OPEN (draft, `8186bc83`). Governance doc + dry-run PASS result + Path A (scheduler) OFF-LIMITS finding. Must merge before #374.

5. **Later: reconsider Semgrep MCP registration blockers** — only after B1–B4 are resolved (roots/list client handling, LGPL sign-off, startup fetch policy, semgrep_scan metrics-off bug).

**How to apply:** When starting any new workstream, branch from `main` (post-merge), not from the containment branch. Never combine OpenClaw + harvester + biotech-mcp briefs in the same branch.

**Merge sequence (locked):** #375 → #374 → daily brief one-shot dry-run → brief quality review → only then consider disabled cron registration.

**Post-#374 next workstream:** brief quality refinement — accurate, compact, flags stale/missing data instead of guessing. Not more autonomy.

**Current position (2026-06-23):** Steps 1–4b are complete. Immediate next task is HERMES_0_17_POST_MERGE_VALIDATION — validate the large upstream merge before adding any more autonomy. After that: Semgrep MCP blockers OR fresh PIT gap implementation branch.

**Related:** [[containment-branch-status-2026-06-22]]
