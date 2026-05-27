---
name: ""
metadata: 
  node_type: memory
  originSessionId: ee8dbb2b-22a4-49ff-8d99-f5e261281a6f
---

## Implementation Complete (Commits 899595ad + 7c359ff2)

**Tool:** `tools/firecrawl_research_ingest.py`
**Docs:** `docs/firecrawl_research_integration.md`
**Hermes Skill:** `firecrawl-research-discovery` (registered in `~/.hermes/skills/biotech-screener/`)
**Agents:** Herald + Intraday Mover Watch (SOUL.md updated)
**Commitment:** Research-only, no ranker/selector inputs

## Governance Enforcement

All 6 research-only constraints hardcoded + enforced:
- `RESEARCH_ONLY = true`
- `NO_MODEL_FEATURES = true`
- `NO_RANKER_INPUTS = true`
- `NO_SELECTOR_INPUTS = true`
- `SOURCE_URL_REQUIRED = true`
- `FETCH_TIMESTAMP_REQUIRED = true`

Every artifact writes `_metadata.json` confirming research-only status. Prevents accidental wiring into alpha.

## Capabilities

**Search:** biotech news, company pipelines, PR/investor decks, FDA/trial content via Firecrawl web/news/images indexes

**Scrape:** markdown-cleaned content with graceful failure handling (paywalls, JS-heavy sites, bot-protection logged as `failed` in manifest)

**Output:** structured artifacts with source URL tracking + UTC timestamps
```
artifacts/research/firecrawl/YYYY-MM-DD/
  _metadata.json (governance tags + stats)
  search_results.json (raw web results)
  source_manifest.json (fetch status per URL + timestamps)
  analyst_summary.md (human digest)
  scraped_pages.md (markdown content)
```

## CLI Usage

**Search only (debug):**
```bash
python tools/firecrawl_research_ingest.py \
  --query "obesity drug phase 3 trial" \
  --limit 20 \
  --skip-scrape \
  --out artifacts/research/firecrawl/$(date +%F)
```

**Search + scrape:**
```bash
python tools/firecrawl_research_ingest.py \
  --query "Lilly Zepbound obesity" \
  --limit 10 \
  --timeout 30 \
  --out artifacts/research/firecrawl/$(date +%F)
```

**API key:** Export `FIRECRAWL_API_KEY` or pass `--api-key`

## Testing Notes

✅ Search working (found 5 results for "Lilly Zepbound obesity")
✅ Scrape implemented with Pydantic Document object handling
✅ Timeout minimum enforced (Firecrawl API requires ≥1000ms)
✅ Failed scrapes handled gracefully (NEJM paywall, TrialX denied)
✅ Governance metadata written to every artifact directory
✅ UTC datetime deprecation warnings fixed

## Integration Points (Future)

**Phase 1 (NOW):** Research-only validation; daily digest consumption by analysts

**Phase 2 (post-13F/h20d gates):** Catalyst extraction → Spec 063 (Intraday Mover Watch) correlation

**Phase 3 (post-governance):** Possible ranker/selector feature candidacy under Spec 089 KG governance

**Hard boundary:** No composite alpha wiring until Spec 089 approval + evidence collected

## Why This Pattern

Your model governance says "wire existing fields first, don't invent new ones." Firecrawl follows the same rule: validate as a **research context layer** (like coinvest), then later explore selective signal extraction under governance. This prevents EES-style silent leakage into alpha before the pipeline matures.

## Hermes Integration (Commit 7c359ff2)

**Skill registered:** `firecrawl-research-discovery` in `~/.hermes/skills/biotech-screener/`
- README.md: quick start + feature summary
- SKILL.md: full capability reference (search, scrape, output, parameters, examples)
- _meta.json: version 1.0.0

**Agents updated:** Herald + Intraday Mover Watch SOUL.md
- Herald: can invoke skill for biotech news discovery + competitor intelligence
- Intraday Mover Watch: can invoke skill for news context enrichment on price movers

**Invocation:** `/skill firecrawl-research-discovery` (in-session) or `hermes -s firecrawl-research-discovery`

## Next Steps

1. Run daily searches for 2+ weeks (research-only mode)
   - Herald calls skill periodically to discover external biotech news (complement to company IR)
   - Intraday Mover Watch calls skill when significant moves detected (news context enrichment)
2. Consume digests in `artifacts/research/firecrawl/*/analyst_summary.md`
3. Evaluate catalyst discovery accuracy vs Spec 063 movers
4. If ready (post-governance), propose Spec 110 extension for catalyst KG + ranker candidate evaluation
