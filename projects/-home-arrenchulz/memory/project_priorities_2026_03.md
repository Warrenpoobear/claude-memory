---
name: Project priorities March 2026
description: Operating mandate — freeze baseline, operate the packet, PIT-only research, no duplicate infra
type: project
---

## Operating Mandate (established 2026-03-19)

**"Freeze the baseline. Trust PIT. Stop building duplicate infrastructure. Only spend effort on new information sources that the current model does not already see."**

### Active State
- **Baseline**: v1.11.0 / `9f1f4587`, unchanged until evidence says otherwise
- **Daily interface**: decision memo + action lists + shadow portfolio (not raw CSV)
- **PIT panel**: SEC-8K-enriched, frozen as of 2026-03-19 (`7bbff57e`), manifest: `manifests/pit_panel_eval_dates.txt` (70 dates)
- **Shadow candidates**: catalyst tilt (`2b1c8959`), build_window clinical tilt (`d59b6cc3` — NEEDS_MORE at +0.01pp)

### What to do
1. **Operate the baseline** — run daily production, generate packet, collect PM feedback
2. **PIT-only formal research** — anything decision-grade runs on PIT bundles, everything else is exploratory
3. **New signal-source work** (one at a time, through governance path):
   - Graveyard / survivorship instrumentation (real gap, `data/graveyard/` exists)
   - PI trial count (CTGov-based, fits existing preference)
   - Catalyst history / event-source expansion
   - Options activity/crowding research
4. **Promotion standards stay high** — candidate → promotion battery → shadow → promote only on evidence

### What NOT to do
- No duplicate leakage/PIT infrastructure (CCFT/PIT-first is already the invariant)
- No fixed composite formulas before evidence
- No sprint-sized plans that bundle infra + signals + validation + staging
- No model changes unless the packet surfaces persistent misranks or shadow candidates clearly outperform
- No ignoring the existing options stack or governance rails

### Prior Priorities (2026-03-13, superseded)
- P1 regulatory coverage expansion: DONE (PDUFA 7→15, 91-180d 1→3 names)
- P2 catalyst tilt: still shadowing
- P3 calendar alpha: frozen at 0.3
- P4 clinical_plus_options: demoted to opportunistic shadow

**Why:** The system's next gains come from operating the baseline and testing genuinely new information sources, not from more scaffolding or grand redesigns.

**How to apply:** Every session should start from "is the baseline running clean?" not "what model change should we make?" Only reopen model work if PM feedback or shadow performance forces it.
