---
name: OpenClaw heartbeat bash-tool env-var phantom failures
description: Agent HEARTBEATs that grep `[ -n "$VAR" ]` in their bash tool can falsely report secrets missing — the bash-tool sandbox doesn't inherit env vars that the parent cron shell loaded via `source .env`. Python SDK calls work fine.
type: project
originSessionId: 5c6a5e68-077e-42e4-88e5-794e96471906
---
OpenClaw agents launched via `tools/run_agent_direct.py` spawn a Claude
subprocess whose **bash tool runs in a sandboxed environment that does
NOT carry through `.env` secrets**, even when the cron line did
`source .env` before invoking. Confirmed 2026-04-27 with
`grok_biotech_watch`:

- `.env` has `XAI_API_KEY=<84-char value>`, valid.
- `source .env` works in plain bash; cron line is `cd … && source .env
  2>/dev/null && /usr/bin/python3 tools/run_agent_direct.py …`.
- `tools/build_grok_biotech_watch.py:586` reads `os.environ.get(
  "XAI_API_KEY", "")` and would see the value via Python env
  inheritance.
- BUT the agent's HEARTBEAT bash check ran `[ -n "${XAI_API_KEY}" ]`
  inside its bash tool and saw it as **empty**, reported "FAIL: no
  XAI_API_KEY", and short-circuited before any Python API call.

**Why:** the bash tool inside the spawned Claude session has its own
restricted env — likely a whitelist/strip rather than full inheritance
from the wrapping Python process. The Python SDK call path is fine.
The heartbeat self-check is the source of the false negative.

**How to apply:**

- **Don't trust HEARTBEAT bash-tool secret-presence checks as proof of
  outage.** If an agent's HEARTBEAT reports "FAIL: no $SECRET" but the
  `.env` value is present and the code reads it via `os.getenv`, the
  agent's actual API path may work — the heartbeat is a phantom.
- Likely affects any agent whose HEARTBEAT bash tool tests for: NCBI
  key, SMTP_USER/SMTP_PASS, Alpaca creds (`APCA_API_KEY_ID`,
  `APCA_API_SECRET_KEY`), Polygon, openFDA, etc. Those phantom-failure
  reports should be treated as diagnostic noise, not outage signals,
  unless corroborated by a missing artifact or a Python-side error.
- For `grok_biotech_watch` specifically, the agent never wrote an alert
  artifact since 2026-03-31 (`artifacts/grok_watch/` last touched
  2026-03-31). The persistent silence may have a separate root cause;
  the heartbeat phantom hides whether Python's SDK call would actually
  succeed if the heartbeat let it run.
- Real fix (post-04-28 verification gate): either pass through
  whitelisted secrets to the bash-tool env in `run_agent_direct.py`,
  OR rewrite agent HEARTBEATs to invoke a tiny Python check
  (`python3 -c "import os; assert os.environ.get('XAI_API_KEY')"`)
  instead of bash-side `[ -n ... ]`. The Python check sees the parent
  env correctly. Don't build before pause clears.

**Open question for the 04-28 audit:** does the persistent
`artifacts/grok_watch/` silence since 03-31 have a real cause, or is
it ALL phantom heartbeat failures stacking up? Force one Python-only
run (`python3 tools/build_grok_biotech_watch.py` directly, no agent
wrapper) and see whether it produces an alert artifact.
