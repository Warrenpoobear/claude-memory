---
name: feedback-workflow-tool-cost
description: User finds the Workflow tool slow and token-heavy — prefer fork agents or sequential agent calls instead
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e32de6d4-08e2-4775-b2af-02ae7a9925c0
---

Avoid the Workflow tool. It is slow and chews up tokens.

**Why:** User observed high latency and token cost on v0.2b map prototype workflow.

**How to apply:** For multi-step implementation tasks, use `subagent_type: "fork"` for research/audit, or sequential direct tool calls for coding tasks. Reserve Workflow only if the user explicitly requests it. Workflows are also now disabled in settings (`enableWorkflows: false`).
