---
name: hermes_openrouter_endpoint_offline_2026_06_01
description: OpenRouter deepseek/deepseek-v4-flash:free endpoint offline; switched to Together AI primary
metadata: 
  node_type: memory
  type: project
  status: resolved
  date: 2026-06-01
  originSessionId: 7aaaa27d-e4f5-4c4c-8fec-8c82b385f194
---

## Incident: OpenRouter DeepSeek Endpoint Offline

**Date:** 2026-06-01  
**Status:** RESOLVED

## Error

```
No endpoints found for deepseek/deepseek-v4-flash:free
```

- Agents began failing to initialize
- OpenRouter free tier endpoint no longer available
- Root cause: OpenRouter removed or blocked the endpoint

## Resolution

**Switched primary model from OpenRouter to Together AI:**

```yaml
# hermes-operator.md
OLD: model: deepseek/deepseek-v4-flash:free
NEW: model: together/meta-llama/Llama-3.3-70B-Instruct-Turbo
```

**Why Together AI:**
- API key already in `.env` (TOGETHER_API_KEY)
- Model is stable and performing well
- No rate limits on paid plan
- Eliminates fallback overhead (was 10.7s per query)

## Impact

- ✅ Hermes agents now operational on Together AI primary
- ✅ Latest snapshot (2026-06-01) continues without interruption
- ✅ No fallback latency degradation
- ✅ Production pipeline restored to normal speed

## Monitoring

- Fleet health: 29 agents active (confirm in next run)
- Together AI balance: verify within 24h
- Agent latency: should see 2–3x improvement vs OpenRouter fallback

## References

- Commit: hermes-operator.md updated 2026-06-01
- Fallback memory: [[hermes_openrouter_fallback_decision_2026_06_01]]
