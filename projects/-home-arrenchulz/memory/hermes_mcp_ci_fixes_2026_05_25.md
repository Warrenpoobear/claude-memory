---
name: hermes-mcp-ci-fixes-2026-05-25
description: Hermes MCP hardening + CI paths-ignore + repo hygiene — 2026-05-25
metadata: 
  node_type: memory
  type: project
  status: active
  related: hermes_model_migration_deepseek_2026_05_20
  originSessionId: bfaf2f47-3e88-4a27-8b40-7b9e01fd383f
---

Session 2026-05-25 operational fixes across hermes-agent and biotech-screener.

## Hermes MCP hardening (hermes-agent)

**`hermes-mcp-serve` PATH guard** (`2d150b3b7`): Prepends `~/.local/bin`, `~/.hermes/bin`, `~/.cargo/bin` to PATH when missing — fixes silent failures in Cursor Cloud / cron / non-interactive MCP launcher contexts.

**`.cursor/mcp.json`** (`10765e685`): Added `HERMES_REPO`, `HERMES_HOME`, `HERMES_AGENTS_DIR` env vars (synced from `.mcp.json.example`). Previously missing — resolved paths in Cursor Cloud.

**`.cursor/environment.json`** (`10765e685`, new file): Activates `.venv` or `venv` on workspace open; falls back to `./setup-hermes.sh` if no venv and `hermes` not found. Ensures hermes is on PATH before MCP launch.

**Why:** Cursor Cloud agents spin up in non-interactive shells where `~/.local/bin` is not on PATH; without this, `hermes-mcp-serve` silently fails to find `hermes`.

## CI paths-ignore (biotech-screener)

**`f7918443`**: Added `paths-ignore` to `tests.yml`, `container-smoke.yml`, `replay-regression.yml`.

Skipped paths: `**/*.md`, `docs/**`, `.cursor/**`, `skills/**`, `.claude/**`, `**/*.mdc`, `artifacts/**`

**Why:** GitHub Actions budget/quota was exhausted — all jobs blocked with "budget preventing further use". Doc-only commits (skill hub updates, runbook edits) were burning CI minutes for no code change.

**Remaining action:** Raise Actions spending limit at GitHub Settings → Billing → Spending limits. The path filters prevent future waste but don't reset the current billing period.

## Repo hygiene (all repos)

**`core.fileMode false`** set on all 4 repos: hermes-agent, asset-allocation, performance validation, biotech-screener. Eliminates WSL2/NTFS permission-bit noise (3,655 phantom `M` files in hermes-agent).

**hermes-agent tracking branch** fixed from `fork/fix/provider-parity-inert-assignments` → `fork/main`. Was showing 584 commits "ahead" due to wrong tracking ref.

## Hermes fleet status (2026-05-25, weekend)

- **YELLOW**: 16 OK / 1 WARN (`fleet_steward`) / 8 STALE / 0 FAIL
- STALE agents caused by Together AI 402 credit errors 2026-05-20; recovered 2026-05-22
- **Before Monday**: check Together AI balance
- `hermeslink.service`: INACTIVE/dead (non-critical)
