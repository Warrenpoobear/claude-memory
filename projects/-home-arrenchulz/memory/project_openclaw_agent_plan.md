---
name: OpenClaw agent architecture plan
description: Self-hosted agent framework plan for biotech screener — 4 roles (ops, shadow evaluator, watchdog, research), workspace-per-function, read-mostly, no auto-promotion
type: project
---

OpenClaw planned as self-hosted operator/research agent for biotech screener.

**Four roles:**
1. **Daily operator** — run production, check health, produce digest, diff vs prior, surface actionable items only
2. **Shadow evaluator** — rerank baseline vs candidate, run signal evidence, write decision memo, update spec status
3. **Data watchdog** — stale sources, health false alarms, missing caches, regressions, PIT parity
4. **Research worker** — bounded IC checks, crowding studies, FDA audits, "what changed" summaries, spec drafting

**Why:** Automation without steering wheel. Highest ROI = ops agent morning sequence.

**How to apply:** Build toward workspace-per-function layout (ops/, research/, shadow/). Read-mostly by default. No auto-push, no promotion without human yes. Skills for repeated workflows. AGENTS.md with governance rules.

**Starter**: ops agent that runs production → inspects health + readiness → diffs vs prior → summarizes new issues → refuses to modify active rulesets.
