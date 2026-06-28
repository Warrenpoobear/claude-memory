---
name: iss-review
description: |
  Display or reference the Investment Strategy Statement (ISS) for Darren Schulz. Use when the user says "ISS", "investment strategy", "strategy statement", "ISS alignment", "check strategy", "what's my strategy", "coherence check", "structural exclusions", or "barbell check". Shows the five-layer framework, structural exclusions, current thesis, and coherence note. Can optionally cross-check current positions against structural exclusions and the core/satellite framing.
allowed-tools:
  - Read
  - Bash(cat *)
  - mcp__robinhood-trading__get_equity_positions
  - mcp__robinhood-trading__get_equity_quotes
---

# ISS Review

Surfaces the Investment Strategy Statement and optionally checks portfolio alignment.

## Steps

### 1 — Load ISS
```bash
cat /home/arrenchulz/.claude/docs/investment-strategy-statement.md
```

### 2 — Display by intent

**If asked for the full ISS** — present all five layers with formatting intact.

**If asked for a quick summary** — surface these three things only:
- The barbell framing (one sentence each side)
- Layer 2 Tier-1 managers
- The coherence note (always)

**If asked for structural exclusions** — list Layer 1 exclusions and confirm any named ticker is not on the list.

### 3 — Optional: alignment check

If the user asks for an alignment or coherence check against current positions:

```
get_equity_positions(account_number="802349084")
```

Then:
- Cross-check each held ticker against the Layer 1 structural exclusions list. Flag any match.
- Flag any biotech-satellite names that appear to have migrated to a core context (or vice versa).
- Note if the account is using the correct account type for each sleeve (biotech → IRA tax-advantaged; core quality → taxable).

### 4 — Always surface the coherence note

Whenever both the core equity and biotech satellite books are referenced together in the same conversation, append:

> ⚠️ **Coherence note:** The quality core and the biotech satellite are philosophically opposite by design. The barbell holds together only because the satellite is intentional, separately governed, and not core capital. Evaluate them on separate terms.

## Update procedure

To update the ISS (e.g., after a thesis change or annual review):
1. Edit `/home/arrenchulz/.claude/docs/investment-strategy-statement.md` directly.
2. Re-publish the artifact from the scratchpad HTML if a visual version is needed.
3. Note the change date and nature in the ISS file header.
