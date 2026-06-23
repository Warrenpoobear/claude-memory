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

9. ✅ **PIT evidence review / EES forward validation / attribution / guardrail design** — COMPLETE 2026-06-23. Full chain: PIT `PASS` (`692eded0`) → EES validation `PASS` (`e80c3ff2`) → attribution (`fb52071f`: Phase 3 CT_PRIMARY_COMPLETION left-tail avoidance) → shadow monitor live (`60876b11`, `376d9e9d`) → guardrail design-only (`96733236`). No model changes. Freeze ACTIVE. **Active path: prospective shadow observation only.** See [[ees-shadow-monitor-state-2026-06-23]].

**All 9 items complete. No new workstream authorized.**

**Constraints (active):**
- Do NOT reopen harvester-manualization.
- Do NOT reopen OpenClaw work.
- Do NOT enable any scheduler.
- Do NOT mutate production model files (ranker/selector/sizing/final_score/gates/snapshots/portfolio).
- Do NOT claim alpha. Freeze remains ACTIVE.
- Do NOT add more EES analysis — shadow observation only until gates met.

**How to apply:** All items complete. Only active task is daily shadow monitor run after each promoted snapshot.

**Related:** [[containment-branch-status-2026-06-22]] [[scoped-work-freeze-2026-06-22]]
