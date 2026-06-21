---
name: biotech_containment_governance_2026_06_21
description: "Biotech repo containment (INC-2026-06-20-AUTOPUSH) + governance/model-confidence package; durable docs at ~/governance_package_2026_06_21/; sequence A-E; July 8 packet amended (U2 co-primary)"
metadata:
  node_type: memory
  type: project
  status: active
  date: 2026-06-21
  relatedTo: "hermes_update_2026_06_21, phase2_daily_monitoring_checklist_2026_06_05, robinhood_live_execution_2026_06_10"
  originSessionId: ec7a4958-2a85-44e3-bb58-cf66e6fa3931
---

# Biotech Containment + Governance Package — 2026-06-21

## Incident
INC-2026-06-20-AUTOPUSH: autonomous writer committed/pushed directly to `main`; cleanup auto-reverted by a still-live watcher; ~59MB herald_cache (626 files) + file deletions churned. **Production ranker/selector code NOT breached** — repo history/hygiene only. Repo frozen at `origin/main = d9531c7b`. Remote switched to SSH this session (HTTPS password auth dead; gh token was invalid; SSH key works). See [[hermes_update_2026_06_21]] for fleet containment.

## Durable governance package (OUTSIDE repo, not under git)
`~/governance_package_2026_06_21/` — 8 docs + README. Originals were in session scratchpad (ephemeral); this is the persistent copy.
1. funding_memo — fundability story, leads with portfolio face validity, capital stage-gated
2. ranking_confidence_plan — falsifiable audit sequence
3. july8_forward_oos_validation_packet — **AMENDED A1 (pre-data, 2026-06-21):** U2 candidate-cohort IC = CO-PRIMARY; new SELECTION-DRIVEN verdict (U1+ but U2≈0); catalyst_decay_w needs incremental IC after `selector_score` + `coinvest_score_z` (raw IC insufficient)
4. ranker_v3_design_memo — constrained design target, shadow-only, no impl authority
5. agent_governance_branch_protection_policy — PR-only agents, no direct main-write
6. post_incident_runbook — repeatable recovery
7. agent_token_separation_note — separate machine identity for agents (durable identity fix)
8. branch_protection_ui_checklist — operator UI steps (first gate)

## Containment gates (ALL must hold before any repo/agent/model work)
```
BRANCH_PROTECTION_ENABLED        ⬜ operator (GitHub UI)
ALL_AGENTS_CLOSED                ⬜ operator (halt Hermes/OpenClaw/crons)
QUIESCENCE_CONFIRMED_TWICE       ⬜ read-only poll, two spaced checks; NO git fetch unless separately approved
```
Standing freeze: no repo cleanup, no model edits, no commits, no pushes, no autonomous agent work.

## Sequence
A. Finish containment (operator) ⬜ → B. Preserve package ✅ → C. Fresh A3 cleanup plan vs d9531c7b ⬜ → D. Run July 8 packet as amended ⬜ → E. Ranker v3 shadow decision ⬜

## Central model question (unresolved, pending July 8)
**Is the system merely selecting reasonable biotech names, or can it rank the best names within that selected cohort?** Truest test = U2 candidate-cohort IC. Smoking gun for "selection, not ranking" = U1 IC positive but U2 IC ≈ 0. Roadmap: July 8 (U2 co-primary) → selector/ranker incremental-IC audit → eligibility false-negative audit → only then v3 shadow features. No new features before failure mode is known.

## Governance principle
**Repo control ≠ model validity ≠ capital authorization.** Three independent gates; none substitutes for another. Scientific Cartography stays diagnostic-only (architecturally ready but sponsors don't map to public tickers → not a live alpha source).
