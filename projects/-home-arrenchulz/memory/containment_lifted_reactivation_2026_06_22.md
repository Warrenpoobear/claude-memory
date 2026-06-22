---
name: containment-lifted-reactivation-2026-06-22
description: "Containment INC-2026-06-20-AUTOPUSH LIFTED 2026-06-22 by operator override (branch protection waived, push risk accepted). Fleet reactivated: Hermes gateway up, crontab restored (49 jobs), LG3 cron reinstalled. Auto-push vector re-armed."
metadata: 
  node_type: memory
  type: project
  status: active
  expires: 2026-07-06
  supersedes: hermes_update_2026_06_21
  related: 
    - hermes-fleet-integrity-2026-06-22
    - biotech_containment_governance_2026_06_21
    - hermes_update_2026_06_21
    - langgraph-lg3-cron-activated
  originSessionId: 15541646-0e32-452b-9f94-5548c6defadb
---

# Containment Lifted + Fleet Reactivated — 2026-06-22

Operator instruction "drop containment and execute"; chose **Full reactivation, accept push risk** (declined push-neutralization). Durable note: `~/governance_package_2026_06_21/CONTAINMENT_LIFTED_2026_06_22.md`.

## Override basis (NOT gate satisfaction)
- `BRANCH_PROTECTION_ENABLED` — **WAIVED**; impossible on free GitHub plan. Root-cause control still absent.
- `ALL_AGENTS_CLOSED` / `QUIESCENCE_CONFIRMED_TWICE` — released; fleet reactivated.
- **Incident root cause (autonomy + unprotected `main`) is re-established. Operator explicitly accepted.**

## ✅ Auto-push vector — FOUND & PAUSED (2026-06-22 13:14 EDT, containment-first audit)
`weekly-skill-harvester` Hermes cron (`~/.hermes/cron/jobs.json`, id `a15dbdcb6f41`, Mon 20:00) autonomously `git commit`+`git push docs/hermes_skills/` to `main`, "no approval needed" — the exact INC-2026-06-20 mechanism. Was LIVE & scheduled to fire 2026-06-22 20:00; **PAUSED** via `hermes cron pause weekly-skill-harvester` (operator-authorized this session). Now `enabled:false`/`state:paused`; 22 other Hermes jobs untouched. Reversible: `hermes cron resume`. **Not hard-closed** — push step still in job config; no branch protection (free plan), no CI. Pre-push guard still TODO.
- **Audit lesson:** autopush audits MUST check `~/.hermes/cron/jobs.json` (Hermes scheduler) — it is invisible to `crontab -l`. OpenClaw scheduler (`~/.openclaw/cron`) is dormant (only `.migrated` files, no run since 06-17; exec-approval allowlist = read-only binaries, no `git`/`gh`).
- Closeout artifact: tracked `docs/incidents/INC_2026_06_20_AUTOPUSH_CLOSEOUT_2026_06_22.md` (commit `2d3f54ea`, branch `langgraph-review-...None-guard`, NOT pushed); working copy `artifacts/incidents/` (gitignored); durable mirror `~/governance_package_2026_06_21/`.
- Part of containment-first Hermes plan: **Pkg A ✅ (harvester paused) → Pkg B ✅ runtime-boundary map (`docs/governance/HERMES_OPENCLAW_LANGGRAPH_RUNTIME_BOUNDARY_2026_06_22.md`, commit `96ffea36`) → pre-push guard ✅ (`tools/githooks/pre-push` + installer, commit `ded2d3b0`, installed+tested in this clone) → Pkg C read-only `biotech-mcp` (NEXT) → D/E external MCP intake.** All commits on branch `langgraph-review-...None-guard`, **NOT pushed** (ahead 3).
- **Boundary-map open operator decisions:** (1) OpenClaw fence-vs-retire (blocks new Hermes profiles; OpenClaw scheduler dormant, github-skill push triple-gated); (2) `hermes update` 0.15.1→≥0.16.0 to close HIGH DNS-rebinding vuln on LAN-exposed gateway :8642. (3) git-push control gap: `approvals.cron_mode:deny` bypassed by shell-via-`-c` allowlist — pre-push guard is the backstop.

## What was done
1. **Hermes default gateway** `hermes-gateway.service` started (:8642, telegram off) → revives 23-job Hermes cron scheduler. Health `{"status":"ok"}`.
2. **OpenClaw NOT stopped** — it is the live agent executor Hermes *supervises* (corrects the earlier "cutover" framing; stopping it would orphan the fleet). Both gateways live (openclaw :19001, hermes :8642).
3. **User crontab restored** — was wiped during containment. 49 recurring jobs reconstructed from `crontab.bak.20260519.post-phase2b` (expired one-shots dropped) + LG3 line. Source kept at `~/reactivated.crontab`; pre-restore backup `~/crontab.bak.pre-reactivation.20260622` (empty). cron daemon active (pid 195).
4. **LG3 cron** reinstalled `5 8 * * *`; fixed latent NoneType guard at `scientific_cartography/langgraph_review/nodes.py:188` (189 was already fixed). Smoke test exit 0 / outcome success.
5. **2026-06-22 snapshot** regenerated via `cron_daily_production.sh` (06-21 was empty stub). [verify completion]

## NOT done (still open)
- **Repo-history cleanup (runbook §6 / A3)** — gated incident cleanup (tag incident commit, inspect contaminated range, forbidden-file check, staged-behind-approval) was NOT run. Lifting containment ≠ cleanup.
- **Branch protection** — still absent. Mitigations available without it: runbook §7 pre-push hook + agent write-token separation.
- Repo still has uncommitted `src/snapshot_generator.py`.
