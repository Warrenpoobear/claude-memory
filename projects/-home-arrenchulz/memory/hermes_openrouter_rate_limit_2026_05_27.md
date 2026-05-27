---
name: hermes_openrouter_rate_limit_2026_05_27
description: OpenRouter free DeepSeek tier rate-limited; fallback to Llama 3.3 active
metadata: 
  node_type: memory
  type: project
  status: active
  expires: 2026-06-03
  relates_to: "hermes_model_migration_deepseek_2026_05_20, hermes_status_2026_05_26"
  originSessionId: 0e96d9ea-2b71-47af-b5c8-5bae26c2e768
---

# OpenRouter Rate Limit Issue (2026-05-27)

## Problem
OpenRouter's free `deepseek/deepseek-v4-flash:free` tier is **HTTP 429 rate-limited**.

**Evidence:**
```
Primary attempt: deepseek/deepseek-v4-flash:free → HTTP 429
Message: "Provider returned error — temporarily rate-limited upstream"
Current state: Auto-fallback to Together AI Llama 3.3 70B
```

**Impact:**
- Gateway config is correct ✅ (points to OpenRouter DeepSeek)
- But every request hits rate limit and falls back to Llama 3.3 70B
- All 27 Hermes agents now running on Llama (degraded performance)
- Explains stale agents in fleet (they're blocked by slow model, not yfinance)

## Current Fallback Status
- **Primary:** OpenRouter DeepSeek → RATE LIMITED
- **Fallback:** Together AI Llama 3.3 70B → OPERATIONAL
  - Latency: 10.69s (slow; baseline for all requests now)
  - Success rate: 100%
  - Account quota: UNKNOWN (need to verify balance before Monday)

## Root Cause
No OPENROUTER_API_KEY set in environment. Using free tier which has strict rate limits.

## Solutions (in order of recommendation)

### A. Add OpenRouter API Key (PREFERRED)
1. Get API key from https://openrouter.ai/settings/integrations
2. Set env var: `export OPENROUTER_API_KEY="..."`
3. Hermes will automatically use your quota instead of free tier
4. Cost: ~$0.01–0.05/query (check pricing)
5. Removes rate limit immediately

### B. Switch Primary to Together AI
1. Edit config.yaml: set `default: meta-llama/Llama-3.3-70B-Instruct-Turbo`
2. Change provider to `together`
3. Accept 10.7s latency as baseline
4. Need to verify Together quota before Monday (per memory note)

### C. Keep Current (Hybrid Fallback)
- Leave as-is
- All queries degrade to Llama 3.3 (10.7s latency)
- No immediate action needed
- Acceptable if Within SLA, but slower than intended

## Monitoring Gap
- No cron job for Together latency monitoring (script exists but unscheduled)
- Last test: 2026-05-13 (14 days old)
- Should re-enable: `python3 ~/.hermes/monitor_together_latency.py` every 30 min

## Next Steps
1. Decide between A/B/C above
2. Test routing after decision: `hermes chat -q "model check"`
3. Verify Together AI balance before Monday 2026-06-02 (regardless of choice)
4. Re-enable latency monitoring cron
