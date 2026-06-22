---
name: biotech_open_pr_triage_2026_06_22
description: "Open-PR triage 2026-06-22: six test/CI PRs merged to main, universe-hygiene #365 opened, stale PRs dispositioned; GitHub free-plan blocks (no Actions minutes, no branch protection)"
metadata: 
  node_type: memory
  type: project
  status: active
  date: 2026-06-22
  related: 
    - biotech_containment_governance_2026_06_21
    - universe_hygiene_branch_2026_06_21
    - ranker_contract_test_hardening_2026_06_21
  originSessionId: 9a7027f7-4d17-4b28-9a14-d3e67c96744e
---

# Biotech Open-PR Triage — 2026-06-22

Session opened gh auth (Warrenpoobear, `repo` scope, SSH), created/triaged PRs. `main` advanced `d9531c7b → b096cfe7`.

## 🚩 GitHub free-plan blockers (binding, account-level — operator only)
Repo is a **private repo on a free GitHub plan**. Two structural consequences:
1. **No Actions minutes** — every CI job is blocked at start ("job was not started because an Actions budget is preventing further use"). So NOTHING merged this session has been CI-validated. Restore at https://github.com/settings/billing.
2. **Branch protection unavailable** — `gh api .../branches/main/protection` → 403 "Upgrade to GitHub Pro or make this repository public." So the containment gate `BRANCH_PROTECTION_ENABLED` is **impossible as written** on this plan. The autopush root cause (INC-2026-06-20) has no platform guard; the only fix is procedural (agent token separation + PR-only policy) UNLESS the plan is upgraded (Pro/Team) or repo made public.

**Decision pending (operator):** upgrade plan (fixes both) vs. accept procedural-only containment.

## Merged to main (six, by operator, 2026-06-22 — NO CI ran)
#359 semgrep phase0 · #360 phase2 runner fixture · #361 snapshot deadlock fix · #362 rankings contract · #363 IC forward-date · #364 ranker contract ([[ranker_contract_test_hardening_2026_06_21]]). First `main` run after Actions budget restored is their real validation.

## Opened
- **#365 DRAFT** — `universe/hygiene-2026-06-21` ([[universe_hygiene_branch_2026_06_21]]). Live `main` universe (338 tickers) still carries dead RNA/APLS/KALV and is missing KLRA/PBLS/GENB/KARD → real impact. Merge gated by containment + no-CI.

## Stale-PR dispositions
- **#338** WR Hangry Wheel lunch randomizer — **CLOSED** (off-mission).
- **#270** inst_delta_z governance docs — **CLOSED** (superseded docs + cron scripts duplicating #269).
- **#268** catalyst CT.gov hard-reject (spec 071 lane 1) — **KEEP**. Substantive production logic (rejects catalyst credit for WITHDRAWN/TERMINATED/SUSPENDED/etc + 4 test files); addresses "catalyst fields UNTRUSTED". Model-behavior change → must route through containment/governance review; needs rebase onto current main.
- **#267** PIT hardening (as_of_date gate + priced_move quarantine) — **RE-DO CLEAN**. ~140 lines useful code+tests buried under an 8190-line `market_data.json` regen blob. Extract code onto fresh branch off current main; don't resurrect this draft.
- **#269** ops cron WSL2 catchup — **PARK**. Still-relevant (calibration_evidence still FAIL per 2026-06-19 fleet status) but crons forbidden + fleet CLOSED under containment. Revisit when fleet reopens.

## Next concrete actions (operator-gated)
Restore Actions budget → CI-validate main + #365. Plan decision (branch protection). Then: route #268 through governance, re-do #267 clean. Universe Part A adds (KLRA/PBLS/GENB/KARD) still missing from live universe.
