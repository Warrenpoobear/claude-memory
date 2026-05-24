---
name: options_integration_strategy
description: Options roadmap v2 (2026-04-01) — liquidity-gated states, CRT×options backfill, event premium leaderboard, construction overlays; coverage work done, operationalization phase
type: project
---

## Status Shift (2026-04-01)
Options coverage is no longer the bottleneck. Eligible ranked names are ~96% covered (183/190), but only ~42% have **liquid chains**. Liquidity is now the real gate.

Strongest dispersion cohorts: **hard-catalyst**, **regulatory**, **IV-extreme**.

## Priority Stack (ordered)

1. **Liquidity-gated options states** — replace binary "has options" with three states:
   - covered + liquid
   - covered + thin
   - absent
   Applies to: ranker readiness, dashboard filters, watch/alert confidence, construction overlay.

2. **CRT × options realized-return backfill** — the CRT/options join exists but lacks realized price reactions. Main missing piece before catalyst EV layer is analytically useful.

3. **Confidence-aware `price_action_watch`** — add `alert_confidence`, `trigger_mode`, `history_depth`, `chain_quality_gate_pass`, spread/liquidity gate flags. High operator value now.

4. **Event premium leaderboard / dashboard surfacing** — decomposition is live and good: 28/30 full-quality top-name decomps with event premium ratio, skew richness, IV momentum, surface regime, catalyst proximity. This is within-top-30 differentiation DEM cannot provide.

5. **Options-aware construction overlay (shadow)** — penalize extreme implied moves with poor chain quality, reduce size on crowded/high-premium, surface cheap implied moves for review. Shadow overlay only, not active selector.

6. **Ranker-ready window accumulation** — only 8/30 dates usable. Keep accumulating recent snapshots until training window is real.

7. **Options EV pilot rerun** — code-complete but time-gated. First h5 was directional only. Inside top-30, event-premium may help even if inverted full-universe. Keep study definition fixed, rerun as h20/h63 mature.

## Closed/Superseded Lanes
- Lane 1 (PoS divergence): DEFERRED — hard-catalyst outcomes still pending
- Lane 3 (crowding): ABANDONED (IC=-0.013, no component survives)
- Basic coverage expansion: DONE — no longer the bottleneck

**Why:** Coverage proved healthy (~96% on ranked names). The binding constraint is chain liquidity (~42%), which gates all downstream uses: ranking, EV modeling, risk overlays.

**How to apply:** Every options feature/filter/signal must check liquidity state, not just coverage. Use options now for decomposition, monitoring, and risk overlays. Use them for ranking only after the recent options-populated window is long enough.
