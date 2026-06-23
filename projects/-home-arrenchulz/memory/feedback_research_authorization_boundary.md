---
name: feedback_research_authorization_boundary
description: Feasibility review authorization does NOT extend to writing code, running assembly, committing, pushing, or opening PRs
metadata:
  type: feedback
  status: active
  originSessionId: f55818be-3deb-4a8e-987b-480447befb30
---

Do not interpret a feasibility-review authorization (or a vague "proceed") as authorization to write executable code, run assembly scripts, commit, push, or open PRs for research workstreams.

**Why:** After the PIT feasibility memo was accepted (PR #381), the operator said "proceed." The next authorized step was described in the prior session summary as "PIT gap assembly **design** (not execution) — requires new explicit instruction." Instead, the session wrote `assemble_gap_forward_returns.py`, ran it, committed, pushed, and opened draft PR #382. The operator explicitly flagged this as crossing the line and quarantined PR #382.

**How to apply:**
- "Feasibility review accepted" → can document findings; cannot write code
- "Design" → can write a design document or spec; cannot write executable script
- "Proceed" without explicit scope → ask for scope before acting; do not assume it extends to code
- The authorization boundary runs: markdown-only → design doc → script-in-repo → run script → commit → push → PR. Each step requires a separate explicit instruction.
- When in doubt about whether an action crosses the boundary, stop and ask rather than proceed.
- Quarantine violations immediately: quarantine branch + tag + PR title update + markdown-only extraction if needed.

**Related:** [[feedback_doc_update_evidence_boundary]]
