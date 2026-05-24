---
name: Options Research Policy
description: Options lane scoped to event-pricing/Greeks overlay ONLY — no alpha/selector/ranker use. Governs all future options research.
type: project
---

**Options research is OVERLAY-ONLY.** No selector/ranker/alpha input. (2026-04-06)

**Why:** 37 options signals tested (Spec 053), ALL failed as selectors/rankers. Revalidated 2026-04-05 after coverage upgrade (65.6%→98.6%) — cheap_vol_score degraded further (t=2.74→0.64). High IV was negative selector signal. Event premium was destructive. Adding options to incumbent selector/ranker either did nothing or made it worse.

**Four greenlit use cases:**
1. Market-implied move vs realized move around catalysts
2. Greeks-based branch sensitivity for event scenarios
3. Term-structure / event-premium diagnostics for operator review
4. Risk overlays / hedge awareness on names already in the book

**Explicitly OUT of scope:**
- No market-making stack
- No generic surface-alpha mining
- No production selector/ranker input from options
- No position-sizing logic based on options alone

**How to apply:** Any options research proposal must fit one of the four use cases above. If someone proposes options as a ranking signal, cite this policy and the Spec 053 revalidation. The right question: "Can options-implied pricing and Greeks improve our understanding of what the market already expects around a biotech catalyst?" — NOT "Can options beat coinvest?"

**Fits with:** Event EV engine (Spec 057), existing overlay infrastructure (EPD leaderboard, EXTREME IV flags, event-premium alerts, near-catalyst tiebreaking, shadow monitoring).
