---
name: town-hermes-bridge-delivery-targets
description: Town-Hermes bridge email delivery targets and routing rules for operator briefs and alerts
metadata: 
  node_type: memory
  type: reference
  originSessionId: bfaf2f47-3e88-4a27-8b40-7b9e01fd383f
---

Operator briefs and alerts from the Hermes Knowledge Layer route to:

- **djschulz@gmail.com** — personal (primary)
- **dschulz@wakerobin.co** — work (Wake Robin)

Module: `common/operator_delivery.py` (`send_operator_event(channel="town", ...)`)

Subject prefix `[Hermes]` triggers Town routine → task creation / DM to operator.

**Status (2026-05-24):** Phase A complete (dry-run, `OPERATOR_DELIVERY_DRY_RUN=1`). Phase B (live delivery) not started. Town-Hermes Feedback Protocol frozen until post-h20d governance decision.

**Why:** Wake Robin Director of Investments operates the DEM biotech screener as a parallel investment research capability. Operator briefs deliver to both personal and work addresses so alerts reach the operator regardless of which inbox is being monitored.
