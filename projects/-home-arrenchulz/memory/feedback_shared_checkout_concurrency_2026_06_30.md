---
name: feedback_shared_checkout_concurrency_2026_06_30
description: "biotech-screener repo working directory is shared by multiple concurrent Claude Code sessions + cron with no locking — never edit code directly in the live checkout, always use a separate clone"
metadata: 
  node_type: memory
  type: feedback
  status: active
  related: 
    - options_scope_reset_phase1_2026_06_30
    - explore_agent_bash_write_risk_2026_06_22
    - feedback_fork_agent_runaway_2026_06_24
  originSessionId: 0933964e-5940-4edd-8ddd-597d5e54ae08
---

## Rule

Never dispatch a code-editing agent (or run your own git checkout/stash/commit)
directly against `/mnt/c/Projects/biotech_screener/biotech-screener` — that
single working directory is shared, live, and actively used by: (1) other
concurrent Claude Code sessions on this machine, (2) ~50+ scheduled cron jobs
(daily production, shadow monitors, ops_supervisor, allocation_lens, etc.)
that read/write files in it on a fixed schedule regardless of which git
branch is checked out.

**Why:** During Phase 1 options-diagnostic-repair work (2026-06-30 evening),
dispatching a Stage 2 repair agent directly in this checkout, then running my
own `git checkout main`/`git stash` in the same directory to protect an
imminent 20:30 cron firing, collided with the agent's in-progress edits
(looked to it like an "external revert"), hit `index.lock` contention, and
later `git reflog` confirmed a **second, unrelated, legitimate Claude Code
session** was also live on this exact checkout (it committed
`80cf5a47 fix(sync_hermes_skills): stop dropping dual-mapped skill mirrors`,
switching branches out from under the in-progress options work). `ps aux`
confirmed 2+ other `claude` processes running concurrently. Attempted
worktree isolation failed here (`isolation: "worktree"` requires the caller's
own cwd to be a git repo; this environment's cwd is `/home/arrenchulz`, not
a repo) — that's why the fallback was "work directly in the shared checkout,"
which turned out to be the actual root cause of the incident, not any
single mistake.

**How to apply:**
- For ANY code-editing task (not just options) in biotech-screener, first
  make a genuine separate `git clone` to a different directory (not a
  worktree — those failed here; not the shared checkout). This is immune to
  other sessions' branch switches/commits and to cron jobs writing into the
  shared tree, because it's a different `.git` and different working files.
- Read-only audits are fine directly in the shared checkout (low risk, no
  mutation) — this rule is specifically about anything that edits tracked
  files or runs `git checkout`/`stash`/`commit` there.
- If you must intervene urgently in the shared checkout (e.g., protecting
  an imminent cron firing from picking up dirty WIP), know that doing so
  can itself look like data loss to any other agent/process with in-flight
  edits there. Stash with a clearly-labeled message naming what it is and
  why, check `ps aux` for other `claude`/`python3 tools` processes and
  `git reflog` for foreign commits before assuming corruption, and stop to
  report rather than guessing which stash/branch state is "yours."
- 3+ stashes from the 2026-06-30 incident are sitting in this repo
  (labeled "WIP Stage2..." / "stray options WIP...") — do not blindly pop
  them; they contain overlapping/superseded versions of the same file edits
  from a race and need careful reconciliation or should be discarded in
  favor of a clean redo.
