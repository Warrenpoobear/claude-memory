---
name: codegraph-pilot-complete-2026-05-24
description: "Codegraph local repo intelligence tool — pilot result, operating rules, and Hermes acceptance gate (2026-05-24)"
metadata: 
  node_type: memory
  type: project
  originSessionId: bfaf2f47-3e88-4a27-8b40-7b9e01fd383f
---

Codegraph v0.9.4 pilot completed 2026-05-24. Installed via `npm i -g @colbymchenry/codegraph`.

**Why:** Reduce grep/read/file-scan overhead in Claude Code sessions on the biotech-screener repo. Pure static analysis (tree-sitter WASM), no cloud, no API keys.

**Outcome label:** Codegraph Claude-side accelerator approved; autonomous-agent integration deferred.

## Current state

- Installed: `npm i -g @colbymchenry/codegraph` (Node 22.22.2, v0.9.4)
- Index: `/mnt/c/Projects/biotech_screener/biotech-screener/.codegraph/` (1,667 files, 50,259 nodes, 114,016 edges, 108 MB SQLite)
- Claude Code global MCP: registered (`~/.claude.json`, `~/.claude/settings.json`, `~/.claude/CLAUDE.md`)
- Git hooks: **declined** (WSL2 /mnt/ path; run `codegraph sync` manually after changes)
- Hermes: **not registered**
- Cursor: **not registered**

## Validated value (interactive Claude use)

- Task 1 (rankings.csv production path): 11 CLI calls → full chain confirmed: `main() → run_batch() → run_screen_for_date() → _write_snapshot() → data/snapshots/{date}/rankings.csv`
- Task 2 (Module 4 clinical_score inputs): 2 CLI calls → complete z_* input map from `save_validation_snapshot` callees
- `codegraph_trace` MCP: 1 call, loaded cleanly, flagged dynamic-dispatch break and 8-symbol `_write_snapshot` ambiguity — useful diagnostics for interactive use
- **Ambiguity confirmed in MCP session (2026-05-24):** `codegraph_node` on `main` resolved to wrong file (10 symbols named `main`); workaround = use `codegraph_explore` with the filename as part of the query (e.g. `"main run_batch run_screen_from_bundle.py"`) to force file-scoped resolution. Common generic names (`main`, `run`, `test`, `load`) are high-risk for misfires — always include the filename in the query.

## Operating rules

**Use codegraph in Claude Code when:**
- trace symbol callers/callees
- map signal inputs
- find ambiguity before editing
- orient inside large files
- reduce grep/read cycles

**Do not rely on codegraph alone when:**
- dynamic dispatch (call mediated by variable/conditional)
- cron/shell boundaries
- string-literal file paths (use grep)
- ambiguous symbols without file qualification
- production-path proof before a code change

**Ambiguity workaround:** `codegraph_node` picks the first match for common names (`main`, `run`, `load`, `test`). Use `codegraph_explore` with the filename included in the query to force file-scoped resolution.

## Hermes acceptance gate (when revisiting)

Register codegraph with Hermes only after a wrapper/policy exists for:
1. Dynamic-dispatch break handling (agent must not halt silently)
2. Ambiguous-symbol disambiguation (pick correct file-scoped match)
3. Fallback to grep/read for file literals
4. Bounded output — no hallucinated path completion
5. Explicit warning when graph proof is partial

## Rollback

```bash
codegraph uninit /mnt/c/Projects/biotech_screener/biotech-screener
codegraph uninstall --target claude --location global
rm -rf ~/.codegraph/ && npm uninstall -g @colbymchenry/codegraph
```
