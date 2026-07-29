---
name: bluesky-monitor
description: |
  Monitor a Bluesky account via AT Protocol: profile diffs, new posts, engagement spikes, and (with app password) notifications/mentions/follows. Use when the user says "Bluesky status", "check Bluesky", "Bluesky mentions", "anything on Bluesky", "Bluesky digest", "monitor my Bluesky", or similar. Observation-only — never post, like, follow, or delete.
allowed-tools:
  - Bash(python3 *)
  - Bash(ls *)
  - Bash(cat *)
  - Bash(test *)
  - Bash(echo *)
---

# Bluesky Monitor

Read-only account monitor for one Bluesky handle.

## Context

- **Poller**: `~/.claude/scripts/bluesky_monitor.py` (repo copy: `scripts/bluesky_monitor.py`)
- **Config (optional)**: `~/.claude/bluesky-monitor/config.env`
- **State**: `~/.claude/bluesky-monitor/state.json` (gitignored locally; not in this repo)
- **Public API**: `https://public.api.bsky.app` — profile + author feed (no auth)
- **Authenticated**: `com.atproto.server.createSession` + `app.bsky.notification.listNotifications` via PDS (`BSKY_PDS`, default `https://bsky.social`)
- **Governance**: OBSERVATION_ONLY — no writes to Bluesky

## Setup (once)

1. Decide the handle to watch (do not infer from GitHub/email).
2. Create an **app password** at Bluesky → Settings → Privacy and security → App passwords (not the main password).
3. Write config (never commit this file):

```bash
mkdir -p ~/.claude/bluesky-monitor
cat > ~/.claude/bluesky-monitor/config.env <<'EOF'
export BSKY_HANDLE='your.handle.bsky.social'
export BSKY_APP_PASSWORD='xxxx-xxxx-xxxx-xxxx'
# optional:
# export BSKY_PDS='https://bsky.social'
# export BSKY_STATE_PATH="$HOME/.claude/bluesky-monitor/state.json"
EOF
chmod 600 ~/.claude/bluesky-monitor/config.env
```

Template: `skills/bluesky-monitor/config.example.env`

## Steps

### 1 — Load config if present
```bash
test -f ~/.claude/bluesky-monitor/config.env && . ~/.claude/bluesky-monitor/config.env
echo "Handle: ${BSKY_HANDLE:-UNSET}"
```
If `BSKY_HANDLE` is unset, stop and ask the user for it.

### 2 — Run the poller
```bash
. ~/.claude/bluesky-monitor/config.env 2>/dev/null || true
python3 ~/.claude/scripts/bluesky_monitor.py
```
Fallbacks:
```bash
python3 scripts/bluesky_monitor.py --handle "$BSKY_HANDLE"
# JSON for programmatic use:
python3 scripts/bluesky_monitor.py --json
# Inspect without advancing state:
python3 scripts/bluesky_monitor.py --dry-run
```

### 3 — Interpret severity
| Severity | Meaning |
|----------|---------|
| OK | No material deltas |
| ATTENTION | New posts, mentions/replies, or engagement spikes |
| ALERT | Profile identity fields changed (handle/bio/avatar/banner) — possible compromise; human review |

First run prints `BASELINE` — establish state only; do not alarm.

### 4 — Report
```
BLUESKY — YYYY-MM-DD HH:MM UTC — @handle — OK|ATTENTION|ALERT

WHAT CHANGED
- ...

NEEDS RESPONSE
- ...

WATCH
- ...

ACTIONS (human only)
- ...
```
If quiet: one short "Quiet since last check" note.

## Optional cron (WSL)

Inside the weekday uptime window if you want a standing check (adjust handle via config.env):

```cron
# Bluesky monitor — every 2h Mon–Fri 08–20 ET
0 8-20/2 * * 1-5 . $HOME/.claude/bluesky-monitor/config.env; /usr/bin/python3 $HOME/.claude/scripts/bluesky_monitor.py >> $HOME/.claude/bluesky-monitor/monitor.log 2>&1
```

Cron is optional and must be authorized by the operator (same rule as other Hermes/WSL jobs).

## Pitfalls

- **Wrong handle**: never invent from `djschulz` / GitHub usernames; many collisions on Bluesky.
- **Main password rejected / unsafe**: only app passwords.
- **Public mode**: without `BSKY_APP_PASSWORD` you still get profile + posts; mentions/follows require auth.
- **State file**: deleting `state.json` resets the baseline (next run looks like first run).
- **Rate limits**: keep cron ≥30 minutes; poller uses small pages (≤50).

## Session-end learning

After this skill runs, if anything surprised you, log a learning per `~/.claude/docs/session-end-learning.md` (Pattern-Key `SKILL_BLUESKY_MONITOR_{description}`).
