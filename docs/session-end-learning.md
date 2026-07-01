# Session-end learning protocol

Single source of truth for the session-end learning step shared by every
`~/.claude/skills/*` skill. Each skill points here rather than restating it.

After a skill finishes its task, if you hit an unexpected behavior, constraint,
API response, or workflow edge case, append a learning entry:

```
[LRN-YYYYMMDD-NNN]
Pattern-Key: SKILL_<SKILL_NAME>_{description}
Area: hermes_ops | data_pipeline | research | portfolio
Promotion-lane: skill | none
Recurrence-Count: 1
Context: <one line — what happened>
Rule: <one line — what to do differently>
Suggested-Action: <patch to the skill's SKILL.md — or its Lessons Learned section, if it has one — or none>
```

`Pattern-Key` is `SKILL_` + the running skill's name uppercased with hyphens as
underscores, then `_{description}` (e.g. `biotech-rebalance` →
`SKILL_BIOTECH_REBALANCE_{description}`). `Area` is whichever of the listed
values fits; skip those that don't apply.

Promotion — recurrence thresholds, the patch-draft tool, and lane rules — is
owned by the Hermes `self-improving` skill
(`~/.hermes/hermes-agent/skills/autonomous-ai-agents/self-improving/SKILL.md`). Capture the entry
here; don't restate the promotion mechanics.
