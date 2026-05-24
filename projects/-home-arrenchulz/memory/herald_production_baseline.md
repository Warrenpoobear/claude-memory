---
name: Herald production baseline (2026-03-31)
description: First full-universe PR fetch — 336/341 tickers, 3312 PRs, GlobeNewswire parser fix was the unlock
type: project
---

## Herald First Production Run (2026-03-31)

### Coverage
- 336/341 tickers (99%)
- 3,312 press releases captured
- 259 clinical, 166 regulatory, 2,887 other
- GlobeNewswire: 3,054 releases (backbone)
- Direct IR: 258 releases (39 verified URLs)

### Missing tickers (5)
- NUVL: uses PR Newswire, not GlobeNewswire; has direct IR URL but page structure differs
- HRMY: PR Newswire company
- SERA: PR Newswire company
- STVN: PR Newswire company
- _XBI_BENCHMARK_: expected (not a real company)

### Classification (local keywords)
- Informational: 1,378 (42%)
- Needs review: 1,934 (58%)
- Actionable: 0 (conservative classifier — Grok would improve this)

### Key finding
GlobeNewswire parser fix moved coverage from 36/341 to 336/341 in one commit.
Direct IR URLs are quality supplement, not coverage backbone.

**How to apply:** Herald is production-grade. Focus on classification quality (Grok) and dedup, not more source plumbing.
