---
name: feedback-sync-hermes-skills-bug
description: sync_hermes_skills.py all_sync_keys() silently drops SKILL_MAP entry when a key appears in both maps
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 516c9a38-5fd1-4d61-bfc3-97674c7e0cd7
---

`all_sync_keys()` in `tools/sync_hermes_skills.py` returns `{**SKILL_MAP, **REFERENCE_MAP}`. When a skill directory name (e.g. "self-improving") appears as a key in both `SKILL_MAP` and `REFERENCE_MAP`, the REFERENCE_MAP value overwrites the SKILL_MAP value. The merged dict only has the REFERENCE_MAP entry (`self-improving-reference.md`), so `main()` never processes the SKILL_MAP mirror (`self-improving.md`). The tool reports "already in sync" for a file that has drifted.

**Why:** Python dict merge `{**a, **b}` — last writer wins. SKILL_MAP and REFERENCE_MAP share the "self-improving" key intentionally (same skill dir, different source files), but the merge loses one of them.

**How to apply:**
- When sync reports a skill "already in sync" but you know the source was edited, check if the skill key appears in both maps.
- Workaround: call `sync_pair(key, mirror_filename, dry_run=False)` directly via importlib to bypass `all_sync_keys()`.
- Future fix: in `sync_hermes_skills.py main()`, iterate `SKILL_MAP.items()` and `REFERENCE_MAP.items()` separately instead of merging.
- Do NOT trust `sync_hermes_skills.py` output for the "self-improving" SKILL_MAP entry until the bug is fixed.

See [[project-hermes-skill-sync-2026-06-26]] for discovery context.
