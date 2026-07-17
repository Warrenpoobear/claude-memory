---
name: pkos-policy
description: |
  Load PKOS (Personal Knowledge Operating System) governance before doing any work in
  or about the wake-robin-knowledge vault/repo. Use when the user says things like "add
  this biotech finding to PKOS", "run the weekly PKOS review", "promote this candidate
  note", "check whether this claim was knowable as of a historical date", "update the
  Arcellx thesis", "record this contradiction", or any request to create, edit, link,
  promote, or review knowledge in the wake-robin-knowledge vault. Also trigger on
  "M2 item", "Lane A", "Lane C", or "Town orchestrator" when the context is the
  wake-robin-knowledge repo specifically — not to be confused with the biotech-screener
  model repo's own governance gates (h20d, 13F cohort quarantine, IC health, etc.),
  which are a separate system this skill does not cover.
---

# PKOS Policy Adapter (Claude / Claude Code)

Canonical policy: `docs/PKOS_POLICY.md` in `Warrenpoobear/wake-robin-knowledge`
(local clone: `/mnt/c/Projects/wake robin knowledge` / `C:\Projects\wake robin knowledge`).
**Read that file before acting** — this skill only adds Claude-specific procedure; it
does not restate the policy, and if the two ever disagree, the canonical file in the
repo wins (this skill may be stale; that file is live).

## First: distinguish research work from repository governance work

- **Research work** (reading/summarizing evidence, drafting a candidate note's content,
  checking a temporal claim against `known_at`/`source_date`) can happen freely — it's
  Lane-A-shaped: read, prepare, propose. Nothing here writes to `main`.
- **Repository governance work** (branching, committing, opening a PR, merging, running
  Lane-A prep scripts, running the M2 runbook, touching `docs/RUNBOOK-PKOS-M2.md` items,
  or anything touching `docs/SPEC-PKOS-M4.md` / Town) requires the fail-closed Git
  procedure below and explicit human approval before any Lane-C action.

## Fail-closed Git procedure

- Verify canonical alignment by comparing live SHAs (`git rev-parse HEAD` vs
  `git rev-parse origin/main`) — never a hardcoded expected SHA.
- Never report PASS when a command failed or a compared variable is empty. Two empty
  strings are not equal for gate purposes — check `test -n` before comparing.
- Record the exact commit SHA, branch name, and PR number for anything you do, not a
  paraphrase.
- A file existing in the working tree (even one you generated) is not "approved
  canonical knowledge" until it has gone through a human-approved branch → PR → merge →
  post-merge verification cycle. Don't conflate generating output with promoting it.

## Never manufacture evidence

Do not create a canonical artifact whose primary purpose is to prove a governance step
(a "cycle", a checklist item, a sign-off) occurred. If a milestone requires N genuine
instances of something (e.g. M2 Item 9's 3 independent manual promotion cycles), report
the gate as open when fewer than N genuinely exist — never invent one to close it out,
and never treat same-session repetition as satisfying an "independent occasion"
requirement.

## Lane C requires a human

Before any branch, commit, PR, or merge touching canonical `wake-robin-knowledge`
content: get an explicit human approve decision first (reviewer + timestamp), then
branch → commit → PR. Never merge it yourself — merging is the human's click, per the
M2 runbook. You may prepare branches and PRs only when the user has explicitly
authorized that specific action; a general "looks good" on content is not authorization
to open a PR.

## Town vs. "Town" — don't conflate

"Town" the M4-design PKOS gatekeeper (design-only, blocked until M2 Item 9 closes) is
the *same underlying product* as the Town that already exists live for biotech-screener
operator alerts (`common/operator_delivery.py` → email → Town inbox), just a different,
not-yet-authorized role for it. Don't imply Town orchestration is running for PKOS — it
isn't, and won't be until M4 implementation is explicitly unblocked.

## Current blocked-operations state

Check `docs/PKOS_POLICY.md`'s "Blocked operations" block for the live state (cron,
scheduling, autonomous Lane C, Town runtime orchestration, M4 implementation claims) —
it's a living block, don't rely on a cached memory of it across sessions.
