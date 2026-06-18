---
name: hermes_gateway_lan_fixes_2026_06_05
description: Hermes gateway LAN accessibility fixes — lmstudio binding + Telegram conflict resolution
metadata: 
  node_type: memory
  type: project
  status: resolved
  date: 2026-06-05
  originSessionId: fd68ec6b-a368-491a-b569-0e504fd6753b
---

## Hermes Gateway LAN Fixes (2026-06-05)

**Issue**: Hermes gateways not accessible from LAN; lmstudio bound to localhost only; default gateway blocked by Telegram token conflict.

**Root Causes**:
1. `~/.hermes/profiles/lmstudio/.env` had `API_SERVER_HOST="127.0.0.1"` (env vars override config.yaml)
2. Default gateway and researcher gateway both trying to use same Telegram bot token
3. Researcher gateway had Telegram enabled; default gateway couldn't start

**Fixes Applied**:

### 1. lmstudio Gateway LAN Access
- File: `~/.hermes/profiles/lmstudio/.env`
  - Changed: `API_SERVER_HOST="127.0.0.1"` → `API_SERVER_HOST="0.0.0.0"`
- File: `~/.hermes/profiles/lmstudio/config.yaml`
  - Changed: `host: 127.0.0.1` → `host: 0.0.0.0` in platforms.api_server

### 2. Telegram Token Conflict Resolution
- File: `~/.hermes/config.yaml`
  - Added: `enabled: false` to telegram section (main config)
  - Researcher gateway profile retains Telegram enabled (no conflict)

**Result**:
- ✅ lmstudio gateway: listening on `*:8643` (LAN accessible)
- ✅ researcher gateway: listening on `*:8642` (LAN accessible)
- ✅ default gateway: disabled (Telegram off, no conflicts)
- ✅ Health checks passing on both active gateways

**Key Learning**: Environment variables in `~/.hermes/profiles/{profile}/.env` take precedence over config.yaml settings. The `.env` file is the authoritative source for API_SERVER_HOST binding.

**Documentation**: Committed to biotech screener as `HERMES_GATEWAY_CONFIG.md` (commit 934bac41)
