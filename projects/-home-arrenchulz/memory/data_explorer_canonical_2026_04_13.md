---
name: Data Explorer as canonical reporting layer
description: Data explorer agent is the authoritative daily report source; console agent summaries are non-authoritative without dataset evidence
type: feedback
originSessionId: 46f68338-702e-45a6-bf37-be3e67098e19
---
Data explorer (`python -m tools.data_explorer`) is the canonical daily truth source for screener analysis. Console agent summaries (Claude web, API) are non-authoritative unless backed by dataset evidence.

**Why:** Console agent produced a report on 2026-04-13 with materially wrong claims — inverted signal hierarchy (clinical "dominant" when it's 0%), fabricated "PoS Score", wrong score ranges (3.7–63 instead of 0.58–0.67), hallucinated backtest numbers (392 periods instead of 67). The data explorer report corrected all of these by reading actual snapshot data.

**How to apply:** When generating analysis or answering questions about current system state, always read the snapshot data directly rather than relying on remembered or hallucinated system descriptions. Use the data explorer CLI or load rankings.csv directly. If a claim can't be verified from the data, say so.
