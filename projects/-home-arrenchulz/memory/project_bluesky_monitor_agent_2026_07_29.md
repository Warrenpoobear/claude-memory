---
name: Bluesky monitor agent
description: Claude Code agent + skill + poller for observation-only Bluesky account monitoring (AT Protocol)
type: project
---

Designed 2026-07-29 in `Warrenpoobear/claude-memory` as a standing Bluesky account monitor.

**Deliverables**
- Agent: `agents/bluesky-monitor.md` (Haiku, cyan, project memory)
- Skill: `skills/bluesky-monitor/SKILL.md`
- Poller: `scripts/bluesky_monitor.py` (stdlib only; public AppView + optional app-password notifications)
- Config template: `skills/bluesky-monitor/config.example.env` → copy to `~/.claude/bluesky-monitor/config.env`

**What it watches**
- Profile identity fields (handle, display name, bio, avatar, banner) → ALERT on change
- New posts/replies from the watched account
- Follower deltas + engagement spikes vs prior snapshot
- Notifications (mentions/replies/likes/follows/quotes) when `BSKY_APP_PASSWORD` is set

**Governance**
- Observation-only: no posts, likes, follows, deletes
- Handle must be set explicitly (`BSKY_HANDLE`) — do not infer from GitHub/email
- App password only; never store secrets in git or agent memory files
- Optional WSL cron documented in the skill; not installed by default

**Why:** Give a low-noise digest and compromise radar for a personal Bluesky account, matching the existing monitor-agent pattern (`openclaw-monitor`, campfimfo-style poller + skill).

**How to apply:** Set handle + app password in `~/.claude/bluesky-monitor/config.env`, run `python3 scripts/bluesky_monitor.py` or ask Claude to use the `bluesky-monitor` agent/skill. First run is baseline only.
