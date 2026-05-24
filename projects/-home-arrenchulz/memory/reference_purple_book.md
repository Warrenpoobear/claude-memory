---
name: FDA Purple Book — Biologics Competition Registry
description: FDA database of licensed biologics, biosimilars, interchangeables, and reference product exclusivity — use for commercial biologics competition/erosion context. Download CSVs from purplebooksearch.fda.gov/index.cfm?event=downloads, actual file URLs at accessdata.fda.gov.
type: reference
---

FDA Purple Book (purplebooksearch.fda.gov) — searchable database of all FDA-licensed biological products including biosimilars, interchangeables, reference products, and exclusivity information. Covers CDER biologics and CBER-regulated products (cell/gene therapies, vaccines, hematologic, allergenic).

**Integration priority (user-defined 2026-04-01):**
1. Dashboard context — "Biologic Competition" card on ticker detail
2. Slow-moving shadow features (biosimilar_count, interchangeable_count, exclusivity flags)
3. Bounded competitive-risk overlay for commercial biologics (shadow-only first)

**Best fit:** Commercial-stage biologics competitive landscape — biosimilar/interchangeability screening, reference-product mapping, exclusivity context, franchise erosion risk.

**NOT for:** Dev-stage catalyst prediction, valuation comps, daily news monitoring, small molecules.

**Division of labor:**
- Purple Book = biologics competition / exclusivity context
- DealForma = transaction / valuation context
- Herald + Grok + CRT = event flow and catalyst resolution
