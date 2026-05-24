---
name: Operational phase policy (2026-04-04)
description: Post-buildout policy — observation mode, no new construction, timing-hazard validation is the proving ground
type: project
---

Four production-adjacent builds shipped 2026-04-04 (commit 31033721):
1. Timing hazard dashboard pilot (Spec 057)
2. Event type score overlay (Spec 056)
3. Unified production monitor (overlap, HHI, catalyst quality, ranker drift)
4. Checklist v2 hardened into promotion workflow + CI

**Why:** Alpha stack is frozen. These improve the operating system without reopening closed alpha lanes. User's assessment: "converted from promising research system into a much more serious operating system."

**How to apply:**
- Next move is OBSERVATION, not construction — run daily cycles, tune thresholds only on evidence
- Checklist v2 is now mandatory in practice — no signal discussed as promotable without a valid packet
- Timing-hazard review loop is the first Event EV proving ground — compare predictions to realized date changes
- Do NOT reopen: options-alpha, clinical rescue, insider-selector promotion
- Threshold tuning only if obvious alert spam or missed obvious issues
