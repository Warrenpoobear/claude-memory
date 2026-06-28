---
name: hermes-chat
description: |
  Send a query to the Hermes agent system via the chat interface. Use when the user says "ask hermes", "hermes chat", "query hermes", "send to hermes", or wants to invoke a Hermes skill or get a Hermes response. Verifies gateway is up first, then sends the query and returns the response.
allowed-tools:
  - Bash(curl *)
  - Bash(hermes *)
  - Bash(python3 *)
---

# Hermes Chat

Send a query to the Hermes agent system.

## Steps

### 1 — Verify gateway is up
```bash
curl -s --max-time 3 http://localhost:8642/health 2>/dev/null || echo "Gateway :8642 not responding"
```
If down, report and stop — do not attempt to send query.

### 2 — Send query
```bash
hermes chat -q "USER_QUERY_HERE"
```
If `hermes` CLI is not in PATH:
```bash
cd /mnt/c/Projects/biotech_screener/biotech-screener && source .env && hermes chat -q "USER_QUERY_HERE"
```

### 3 — Alternative: direct HTTP if CLI unavailable
```bash
curl -s -X POST http://localhost:8642/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "USER_QUERY_HERE"}' | python3 -m json.tool
```

### 4 — Report response verbatim

## Notes
- Do not use `hermes cron run` or `hermes cron tick` on paused jobs — re-enables them as side effect
- Use `-q` flag only (quiet mode); interactive mode not supported in this context
- If response is slow (>10s): Together AI fallback is active (Llama 3.3 70B), normal behavior
- Hermes skills registered: 31 skills across governance, signal, ops, liquidity, research, debug, office domains
