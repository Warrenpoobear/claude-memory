---
name: containment-branch-status-2026-06-22
description: Canonical status after containment branch pushed and draft PR opened 2026-06-22
metadata: 
  node_type: memory
  type: project
  originSessionId: c137a3de-ca62-4ea1-b220-612f0a145451
---

**Fact:** PR #371 **MERGED** 2026-06-22. `main` now at `00b742f4`. Containment branch closed.

**Why:** INC-2026-06-20-AUTOPUSH response — 12 commits: LangGraph None-guard fix, incident closeout, pre-push guard, biotech-mcp (read-only, 11 tools), MCP intake rubric + Semgrep supply-chain rules, Semgrep MCP E0/E1/E2 evaluation.

**Canonical status as of 2026-06-22 (post-merge):**
- `PR_371_MERGED` — main at `00b742f4`
- External MCP track closed at E2
- Semgrep MCP: manual-only / not registered (`ADMIT_WITH_CONSTRAINTS_FOR_MANUAL_USE_ONLY`)
- biotech-mcp: registered read-only in Hermes (11 tools, `tools.include` allowlist)
- weekly-skill-harvester: `enabled=False, state=paused` — decide delete / rewrite (Option C preferred) / manual-only on separate branch
- OpenClaw: still live at `:19001`; retirement/fencing is next workstream (`openclaw-fence-retire` branch from new `main`)

**How to apply:** Next branch = `openclaw-fence-retire-2026-06-22` from current `main`. Do not resume weekly-skill-harvester. Do not register Semgrep MCP.

**Related:** [[semgrep_governance_guardrails_2026_06_22]], [[biotech_containment_governance_2026_06_21]]
