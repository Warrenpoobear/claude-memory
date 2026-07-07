---
name: memory-graph-resolver-hardening-2026-07-07
description: build_memory_graph.py edge resolver now normalizes separator/.md/file-stem and hardens the YAML scalar parser; dangling links cut 106→0
metadata: 
  node_type: memory
  type: reference
  status: active
  created: 2026-07-07
  originSessionId: 7e4e3e0f-c930-464d-924a-c7a0a4688fbb
---

`build_memory_graph.py` link resolution was brittle: links are authored inconsistently, so 106 of ~176 edges were "dangling" (unresolved) even though the target files existed.

**Resolver changes (no memory content edited):**
- Edge targets now match via a normalized form `s.lower().removesuffix(".md").replace("_","-").strip("-")`, so `-`/`_` separator style and a trailing `.md` no longer matter.
- Nodes are indexed by **both** their `name:` frontmatter slug **and** their file stem. Most links are written as the target's filename (with date), while the node is keyed by a shorter `name:` title — stem indexing bridges that. `name:`-slug wins on collision.
- YAML scalar parser hardened: whitespace around `:` matched with `[ \t]*` not `\s*` (an empty `key:` no longer bleeds the next line's value); `[]`/`{}` treated as absent; `resolves`/`supersedes` comma-split into multiple edges.

**Practical contract:** an inline double-bracket link resolves whether written as the file stem, the `name:` slug, with or without `.md`, and with either separator. Truly-dead links (target file gone) still dangle — fix by repointing or removing.

**2026-07-07 cleanup residue (17 genuine content issues fixed):** repointed 9 renamed/typo links to existing files (e.g. `governance_ic_evidence_hold`→`…_2026_05_13`, `phase_2_day1`→`phase2_day1`, `spec_104_closure_pending`→`specs_104_105_closure_sequence…`); removed/de-linked 8 dead pointers (3 prose-in-`supersedes:`, refs to a skill/commit, and vanished `resolves:` targets in phase_1b/sec_8k/spec_092). Result: **0 dangling links**. Extends [[memory_cleanup_batch1_2026_05_06]].
