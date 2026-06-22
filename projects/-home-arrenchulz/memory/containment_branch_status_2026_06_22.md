---
name: containment-branch-status-2026-06-22
description: Canonical status after containment branch pushed and draft PR opened 2026-06-22
metadata: 
  node_type: memory
  type: project
  originSessionId: c137a3de-ca62-4ea1-b220-612f0a145451
---

**Fact:** Containment branch `langgraph-review-artifact-dir-none-guard-2026-06-22` pushed; draft PR #371 open at `github.com/Warrenpoobear/biotech-screener/pull/371`.

**Why:** INC-2026-06-20-AUTOPUSH response — 12 commits bundling the LangGraph None-guard fix, incident closeout, pre-push guard, biotech-mcp (read-only, 11 tools), MCP intake rubric + Semgrep supply-chain rules, and Semgrep MCP E0/E1/E2 evaluation.

**Canonical status as of 2026-06-22:**
- `CONTAINMENT_BRANCH_PUSHED_AND_DRAFT_PR_OPENED`
- External MCP track closed at E2
- Semgrep MCP: manual-only / not registered (`ADMIT_WITH_CONSTRAINTS_FOR_MANUAL_USE_ONLY`)
- biotech-mcp: registered read-only in Hermes (11 tools, `tools.include` allowlist)
- weekly-skill-harvester: `enabled=False, state=paused` — keep paused until PR reviewed/merged; then decide delete / rewrite / manual-only
- OpenClaw: still live at `:19001`; retirement/fencing deferred to a separate branch

**How to apply:** Do not add OpenClaw work to PR #371. Do not register Semgrep MCP. Do not resume weekly-skill-harvester. Next workstream = separate branch for OpenClaw fence/retire decision.

**Related:** [[semgrep_governance_guardrails_2026_06_22]], [[biotech_containment_governance_2026_06_21]]
