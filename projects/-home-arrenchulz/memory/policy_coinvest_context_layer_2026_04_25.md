---
name: Coinvest as context layer, not ranker feature
description: Strategic architecture decision (2026-04-25) — coinvest/elite-manager ownership is the context/gate layer, not a standalone alpha ranker feature. Constrains next ranker retrain. Do NOT strip coinvest from live ranker without audited replacement and forward attribution.
type: project
originSessionId: 70ef2e44-ae3e-43e6-90ff-957a934f5373
---
**Strategic architecture decision (2026-04-25):** coinvest/elite-manager ownership should be treated primarily as a **context/gate layer**, not as a standalone alpha ranker feature. Future ranker retrains should reduce duplicated institutional exposure and test whether within-gate ranking can be driven by financial risk, conditional clinical/catalyst/EES mispricing, Form 4 freshness, and options-implied expectation gaps. **Do not remove live coinvest ranker exposure without an audited replacement and forward attribution check.**

**Why:** Live model has coinvest playing three roles simultaneously — A4 selector gate, ranker feature (capped Family C vector: coinvest +0.02, financial −0.0533), and inst_delta pruning. Institutional block explains 92.7% of selector variance; clinical = 0%. The current architecture is effectively a 13F co-investment filter wearing a screener costume, with concentration risk in any cohort-underperformance regime. The "context layer" framing is currently aspirational, not implemented. Robustness comes from decorrelating *around* coinvest (Form 4 freshness, conditional clinical, EES mispricing), not from giving it more weight or more roles. Stripping it from the ranker today, however, would degrade the only signal with proven live working evidence — so the reframe is a *target*, not a same-day change.

**How to apply:**
- **Next ranker retrain**: design the search space so coinvest is a gate input (already in A4), not a ranker feature. Test within-gate ranking driven by `financial_score`, `conditional_misprice_score` (EES), Form 4 freshness once promoted, and options-implied expectation gaps once Spec 062 clears 30-day review. Promotion still requires Checklist v2 (FM + bootstrap + FDR + LOSO + year stability).
- **Active production**: do NOT mechanically remove `coinvest_score_z` from `production_data/ranker_v2_model.json`. The live deployed vector is frozen and any change requires an audited replacement plus ≥30 forward days of attribution evidence.
- **Reviewing PRs / new features**: anything that adds another institutional-derived feature to the ranker (more 13F-derived variables, more coinvest-conditional weights) is moving the wrong direction. Push toward decorrelation lanes instead.
- **Interaction grid as alpha lane, not hygiene**: cross-layer interactions like `coinvest × clinical`, `coinvest × EES`, `coinvest × options-implied move` are alpha candidates and require full Checklist v2 treatment. Do not let them in under a "robustness" or "context layer" label.
