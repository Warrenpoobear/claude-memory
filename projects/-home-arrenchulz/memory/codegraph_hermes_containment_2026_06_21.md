---
name: codegraph-hermes-containment-2026-06-21
description: "CodeGraph watcher / Hermes MCP gateway containment audit — instance A traced to Cursor, reaped by closing Cursor; reversible disable patch drafted but UNAPPLIED"
metadata: 
  node_type: memory
  type: project
  status: shipped
  related: 
    - biotech-containment-governance-2026-06-21
    - hermes-update-2026-06-21
    - infra-ubuntu-wsl2-verdict-2026-06-21
  originSessionId: 1b96737f-246c-461f-996a-59db489feb5f
---

Read-only audit lane (2026-06-21) into CodeGraph `serve --mcp` watchers causing transient `.git/index.lock` races during the ranker test commit. RESOLVED.

**Findings:**
- 3 codegraph MCP instances ran: **A** = 0.9.4 via Hermes gateway (launched by **Cursor**, Windows PID 50360); **B/C** = 0.9.7 spawned by two Claude Code sessions (`~/.npm-global`). B/C are expected per-client servers.
- `.git/index.lock` races were **NOT** a live codegraph watcher — the per-repo codegraph daemon (`.codegraph/daemon.pid` PID 61179) is DEAD: Unix sockets unsupported on `/mnt/c` (`ENOTSUP`). Real cause = **WSL2 `/mnt/c` 9p latency** + transient indexing. Mitigation: foreground git + short retry loop. Durable fix = move repo off `/mnt/c` (see [[infra-ubuntu-wsl2-verdict-2026-06-21]]).
- Instance A was a **passive Hermes MCP tool gateway** (`hermes mcp serve`, FastMCP, read-only query tools like `agent_health_summary`/`fleet_context_snapshot`), **NOT** the autonomous fleet (fleet closed: only 1 hermes proc, no cron). Standing **capability gap** vs `ALL_AGENTS_CLOSED`, not an active breach.
- Launch chain: Cursor.exe 50360 → cmd → `wsl.exe bash -c 'source ~/.hermes/hermes-agent/.venv/bin/activate && hermes mcp serve'` → WSL gateway → codegraph 0.9.4. Source entry lives in the **Windows-global** `C:\Users\DarrenSchulz\.cursor\mcp.json` (= `/mnt/c/Users/DarrenSchulz/.cursor/mcp.json`), which has `hermes` (bash) + a misconfigured `codegraph` (`--path ${workspaceFolder}` unexpanded). Repo workspace `.cursor/mcp.json` has its own working codegraph + a separate `python3 -m mcp_server.hermes_server` hermes (untouched).

**Resolution taken:** Path 2 — operator **closed Cursor manually**. Verified reaped: Cursor 50360 gone, hermes 318648 gone, codegraph 318651/318664 gone, no respawn, repo clean. No kills, no file/config/repo edits.

**UNAPPLIED reversible patch (documented option):** in `/mnt/c/Users/DarrenSchulz/.cursor/mcp.json`, move `hermes` + global `codegraph` out of `mcpServers` into an ignored key `mcpServers_disabled_2026_06_21` (renaming the inner key does NOT disable — Cursor launches all `mcpServers` entries). Backup to `mcp.json.bak.2026-06-21` first; plain JSON, no comments. Rollback = restore backup, restart Cursor. **Apply trigger:** only if reopening Cursor auto-respawns the Hermes gateway. Editing config does not stop a running gateway (Cursor re-reads only on restart).

See [[biotech-containment-governance-2026-06-21]] for the parent containment incident (INC-2026-06-20-AUTOPUSH).
