---
name: feedback_doc_update_evidence_boundary
description: Do not import unreviewed or quarantined research outputs into canonical operational-state docs
metadata: 
  node_type: memory
  type: feedback
  status: active
  originSessionId: f55818be-3deb-4a8e-987b-480447befb30
---

Do not write performance numbers, backtest verdicts, or model claims from a session's analytical work into canonical governance docs (CLAUDE.md, operational-state.md, governance rules) unless the operator has explicitly reviewed and accepted those outputs.

**Why:** A doc update in this session imported PIT backtest numbers (+9.85%, +60.5%, "Backtest verdict: PASS") directly into the Forward Shadow section of operational-state.md. Those outputs came from an autonomous research run that had already been quarantined as unaccepted evidence. Importing them into canonical docs would have contaminated the accepted evidence record with quarantined claims.

**How to apply:** When updating operational-state or any governance doc after a research/analysis session:
- Quarantined outputs → note that quarantine exists, say results are not accepted evidence, no numbers
- Merged PRs for operational facts (freeze status, fenced tools, manualized harvester) → safe to record
- Forward shadow accumulation → safe to note elapsed time and gating conditions, NOT safe to claim IC or performance results from unreviewed work
- The test: would this line survive if the operator read it cold as an accepted model claim? If no, don't write it.
