---
name: massive_options_provider
description: Massive options-history provider setup — API surfaces, constraints, and integration plan
type: project
---

Massive as new options-history provider for historical research/backfills.

**Why:** Need historical options data (contracts, day/minute aggs, trades) for options alpha research. Tastytrade/DXLink stays for live chain diagnostics.

**How to apply:**
- API key from env: `MASSIVE_API_KEY` (access key ID + secret)
- Options Developer tier includes: contracts, day aggs (4yr), minute aggs (4yr), trades (4yr)
- Does NOT include historical quote flat files (Advanced/Business only)
- REST for metadata/discovery, flat files for bulk history
- Timestamps are UTC; convert to ET only at presentation
- AI-friendly docs: `https://massive.com/docs/rest/llms.txt`, append `.md` to docs URLs
- Do not replace tastytrade/DXLink, do not wire into live ranking yet
- Auth: access_key_id + secret_access_key (S3-style for flat files, header for REST)
