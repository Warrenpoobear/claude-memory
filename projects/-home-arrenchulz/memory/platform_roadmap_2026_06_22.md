---
name: platform-roadmap-2026-06-22
description: Operator-approved workstream sequence after containment branch — reduce legacy risk before adding autonomy
metadata: 
  node_type: memory
  type: project
  originSessionId: c137a3de-ca62-4ea1-b220-612f0a145451
---

**Fact:** Operator-approved workstream sequence post-INC-2026-06-20-AUTOPUSH. Principle: reduce legacy risk before adding autonomy.

**Why:** Corrected roadmap as of 2026-06-23. Items 1–8 are all complete. Do not reopen any of them.

**Sequence (corrected 2026-06-23):**

1. ✅ **PR #371 merged** — MERGED to main (`00b742f4`); packages A–E2 + Hermes 0.17.0 + biotech-mcp registered.

2. ✅ **OpenClaw fence/retire** — Fenced 2026-06-22 (read-only exec allowlist, 13 binaries, no git/gh). Retired 2026-06-23: `systemctl --user stop + disable openclaw-gateway.service`; port 19001 closed; removed from autostart. Governance record written. `OPENCLAW_STATUS: RETIRED`.

3. ✅ **Harvester manualization Option C** — Autonomous `git add/commit/push` removed from `weekly-skill-harvester`; now writes proposal-only to `docs/hermes_skills/pending/`. PR #373 merged. Job remains paused.

4. ✅ **Biotech-MCP daily brief design** — Six-section read-only brief design complete. Activation gated: cron NOT registered; requires dry-run review + operator enables.

5. ✅ **Semgrep MCP blockers closed** — Registered with governance boundaries. B1–B4 blockers resolved.

6. ✅ **Hermes 0.17 + Desktop build fixed** — Upstream merge validated. Desktop `--disable-gpu` flag added; Symbol clash (`@assistant-ui/tap`) fixed via `vite.config.ts` dedupe.

7. ✅ **Event EV shadow diagnostic landed** — EES shadow framework shipped.

8. ✅ **Sci-Cart Phase 12.1 review + Phase 13 plan landed** — Phase 13 planning complete.

9. → **PIT evidence review / EES forward validation** — ACTIVE. PIT evidence review memo written 2026-06-23 (`artifacts/audit/PIT_GAP_FORWARD_RETURN_EVIDENCE_REVIEW_2026_06_23.md`), verdict `PASS_PIT_GAP_PANEL_ACCEPTED_FOR_DIAGNOSTIC_RESEARCH`. Next: EES forward validation.

**Constraints (active):**
- Do NOT reopen harvester-manualization.
- Do NOT reopen OpenClaw work.
- Do NOT enable any scheduler.
- Do NOT mutate production model files (ranker/selector/sizing/final_score/gates/snapshots/portfolio).
- Do NOT claim alpha. Freeze remains ACTIVE.

**How to apply:** Active lane is item 9. EES forward validation is the next concrete task.

**Related:** [[containment-branch-status-2026-06-22]] [[scoped-work-freeze-2026-06-22]]
