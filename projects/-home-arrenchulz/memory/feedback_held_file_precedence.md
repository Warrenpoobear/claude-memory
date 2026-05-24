---
name: held-file precedence over generic commit instructions
description: When user has explicitly held a file from commit, a later generic "commit and push" does NOT auto-include it; ask before staging held files
type: feedback
originSessionId: 0085c3a7-8c04-448f-8a2c-47ffeaa4601a
---
Rule: If the user has explicitly told me to keep a file uncommitted (e.g., "leave uncommitted", "do not include in spec X", "out of scope"), a subsequent generic instruction like "commit and push" does NOT override that hold. Surface the held file's status and ask before staging it.

**Why:** On 2026-05-07 the operator told me multiple times during Spec 087 work to keep `data/snapshots/resolutions/watchlist_current.json` uncommitted ("Keep watchlist_current.json uncommitted and out of Spec 087", "Keep watchlist_current.json uncommitted"). When they later said "commit and push" with no other dirty files in the tree, I auto-staged the held file via `git add -u`. They reverted it with `9c65f239 fix: revert accidental watchlist_current.json commit (not approved)`. The hold was sticky; the generic instruction was for other in-flight work, not a blanket re-approval.

**How to apply:** When "commit and push" is given and the working tree is clean except for previously-held files: respond with the working-tree state (named files), confirm `origin/main..HEAD` for any unpushed commits, and ASK whether the held file is now approved before staging. Treat "held from commit" as sticky until the user explicitly says "commit X" or names the file. This applies to any file the user has flagged out-of-scope, not just watchlist artifacts; the pattern is general (keep-uncommitted decisions persist across sessions and across later commit instructions).
