---
name: hermes_skills_status_2026_05_31
description: "Hermes skills documentation and registry status (31 skills, clean audit, no drift)"
metadata: 
  node_type: memory
  type: project
  expires: 2026-07-15
  status: active
  originSessionId: b4c593fc-9d54-4d1e-a337-a8143bf78810
---

# Hermes Skills Status — 2026-05-31

**Audit Result:** ✓ CLEAN (2026-05-31)

## Current Inventory

| Category | Count | Status |
|----------|-------|--------|
| **Total Hermes Docs** | 31 | Authoritative in `/docs/hermes_skills/` |
| **Registered in _meta.json** | 31 | 100% coverage |
| **SKILL_MAP entries** | 16 | Mapped to agents/tasks |
| **REFERENCE_MAP entries** | 3 | dossier, excel, word refs |
| **HERMES_NATIVE (docs-only)** | 12 | No `/skills/` source (Path C runbooks, openclaw-debug, town-operator-bridge, hermeslink-state-capture, memory-steward) |
| **Mirrored from /skills/** | 19 | Source authority in `/skills/<dir>/SKILL.md` or `/skills/<dir>/REFERENCE.md` |

## Sync Status

- **No drift detected** — cursor-synced skills match `/skills/` sources ✓
- **Memory-steward:** Hermes-authoritative (mirror in `docs/` is source of truth) ✓
- **All registered skills have source_authority field** ✓
- **No unregistered files** ✓

## Key Rules (Operator Layer)

1. **Edit source, sync mirror:** Edit `/skills/<dir>/SKILL.md` → run `tools/sync_hermes_skills.py` → mirror updates in `docs/hermes_skills/`
2. **Hermes-native exception:** Edit directly in `docs/hermes_skills/*.md` for Path C runbooks, openclaw-*, town-operator-bridge, hermeslink-*, memory-steward
3. **Memory-steward locked:** Do not overwrite mirror via sync; treat `docs/hermes_skills/memory-steward.md` as canonical
4. **Operator runtime ≠ repo:** `~/.hermes/skills/` on WSL is NOT auto-synced; verify freshness before assuming Hermes reads updated bodies

## Next Sync Commands

```bash
# Verify audit (expect clean output)
python3 tools/audit_hermes_skills.py

# Sync skills mirror (if /skills/ edited)
python3 tools/sync_hermes_skills.py

# Register any new skills
python3 tools/sync_hermes_skills.py --register-meta

# Commit all changes
git add docs/hermes_skills skills docs/hermes_agents tools
git commit -m "docs(hermes): sync skills mirror"
```

## Related Docs

- **Operator layout & runbook:** `docs/hermes_agents/operator_host_skills.md`
- **Tools taxonomy:** `docs/hermes_agents/hermes_tools_map.md`
- **Harvest/sync history:** `docs/hermes_skills/harvest_log.md`
- **Agent fleet (separate):** `docs/hermes_agents/agent_roster.md`

## Last Verified

- **Audit date:** 2026-05-31 (clean)
- **Sync state:** No drift (cursor-synced)
- **Production impact:** None (skills are metadata/documentation only; agent behavior lives in `agents/<name>/SOUL.md`)
