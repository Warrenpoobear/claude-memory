---
name: Agent governance framework
description: Three-tier permission model for OpenClaw agents — read-only judges, artifact writers, human-only actions
type: feedback
---

Three-tier agent permission model (user-specified, 2026-03-26):

**Read-only agents** (judges and watchdogs):
- qa, sentinel, calibration
- Can inspect, classify, recommend, escalate
- Cannot write artifacts outside their own memory
- Rule: if the agent judges model quality, promotion, regression, or rollback → read-only

**Artifact-writing agents** (interpreters and evidence builders):
- ops, catalyst_delta, options_watch, postmortem
- Can write to `agents/<name>/memory/` and `artifacts/<name>/`
- Cannot write production state, other agent workspaces, or tracked files
- Rule: agents can write summaries, deltas, diagnostics, evidence packets — not authoritative state

**Human-only actions** (never delegated):
- Promote or rollback rulesets
- Edit scoring logic / decision engine code
- Edit ruleset manifest or active pins
- Commit / push / modify tracked files
- Execute trades or turn alerts into action
- Override readiness / health / trade gates
- Rule: if it changes portfolio behavior, model behavior, or governance state → human only

**Why:** Gives "another world" of faster information without agents becoming rogue PMs.

**How to apply:** When creating new agents or expanding existing ones, classify into one of the three tiers. Enforce in SOUL.md boundaries. Test in agent integrity tests (no writes into other workspaces, no git permissions).
