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

1. **Review/merge PR #371** — containment branch already pushed as draft; keep all current boundaries intact (no OpenClaw, no Semgrep MCP, harvester paused)

2. **Branch: `openclaw-fence-retire-2026-06-22`** — start from `main` after #371 merges; highest-risk remaining runtime surface. Minimum deliverable: doc + config proving no scheduler resurrection, no `git`/`gh` allowlist, no write-capable GitHub skill path, ownership to Hermes.
   ```bash
   git checkout main && git pull --ff-only
   git checkout -b openclaw-fence-retire-2026-06-22
   ```

3. **Branch: `harvester-manualization`** — do NOT resume weekly-skill-harvester as-is. Operator preference: **Option C** (writes local diff/report only, no git commit/push). Options: A=delete, B=manual command, C=local report only (preferred), D=draft PR on explicit command.

4. **Branch: biotech-mcp daily briefs** — add prompts/jobs that consume read-only tools; no new tools. Candidates: `daily_snapshot_brief`, `gate_verdict_drift_brief`, `phase2_health_watch`, `cartography_status_watch`, `semgrep_rules_inventory_check`. Reports only; no writes to production, no auto-fixes, no cron until reviewed.

5. **Later: reconsider Semgrep MCP registration blockers** — only after B1–B4 are resolved (roots/list client handling, LGPL sign-off, startup fetch policy, semgrep_scan metrics-off bug).

**How to apply:** When starting any new workstream, branch from `main` (post-merge), not from the containment branch. Never combine OpenClaw + harvester + biotech-mcp briefs in the same branch.

**Related:** [[containment-branch-status-2026-06-22]]
