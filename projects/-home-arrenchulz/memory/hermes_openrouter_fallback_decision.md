---
name: hermes_openrouter_fallback_decision_2026_06_01
description: "OpenRouter free tier with Together fallback — operational, no API key upgrade planned"
metadata: 
  node_type: memory
  type: project
  status: active
  date: 2026-06-01
  originSessionId: 7aaaa27d-e4f5-4c4c-8fec-8c82b385f194
---

## Decision: Keep OpenRouter free tier + Together fallback

**Date:** 2026-06-01 (confirmed by user)  
**Status:** OPERATIONAL

## Current Configuration

- **Primary:** `deepseek/deepseek-v4-flash:free` (OpenRouter free tier)
- **Fallback:** `meta-llama/Llama-3.3-70B-Instruct-Turbo` (Together AI)
- **Trigger:** HTTP 429 rate limit on free tier
- **Fallback latency:** ~10.7s per query
- **Cost:** Zero (free tier) + Together fallback consumption

## Why

- Acceptable operational cost (free primary, occasional fallback)
- Together AI balance is adequate
- No urgent need for paid OpenRouter tier
- Fleet continues to produce snapshots successfully (2026-06-01 complete)

## Monitoring

- Continue 30-min yfinance rate-limit checks
- Monitor agent latency in next 3–5 runs (track Together fallback frequency)
- Alert if Together balance drops below 20% OR fallback latency exceeds 15s consistently

## References

- `.env` has both keys configured (OPENROUTER_API_KEY absent, TOGETHER_API_KEY present)
- hermes-operator.md: model still `deepseek/deepseek-v4-flash:free`
