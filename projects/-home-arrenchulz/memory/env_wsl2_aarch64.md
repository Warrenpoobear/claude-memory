---
name: Dev machine is WSL2 aarch64 (Windows on ARM)
description: User's dev machine arch is aarch64 under WSL2, not x86_64 — affects wheel availability for many Python packages
type: project
originSessionId: b9d88e96-eb38-45d4-b094-c0b588a6ad1e
---
Dev machine: Windows on ARM laptop running WSL2 Ubuntu. `uname -m` = `aarch64`.

**Why:** Many quant/ML Python packages (pyqlib, some torch builds, some pandas ecosystem tools) publish x86_64 wheels only and no sdist on PyPI, so `pip install <pkg>` fails with "no matching distribution" even when the package claims Python 3.12 support.

**How to apply:**
- Before recommending any Python lib as part of a pilot, check PyPI wheel list for `manylinux*_aarch64` or an sdist. If neither exists, default install will fail.
- Fallbacks in order: (1) `pip install git+<github>` source build (needs gcc + build-essential + python3-dev), (2) conda-forge aarch64 builds if available, (3) move pilot to an x86_64 host.
- Flag the arch constraint upfront in repo evaluations (30-day plan for OpenBB/Qlib/FinGPT/TradingAgents/Kronos) — treat aarch64 install friction as itself a negative signal about "friction to adopt."

Concrete case 2026-04-18: pyqlib 0.9.7 published cp38–cp312 wheels for x86_64 (linux/win/mac) but no aarch64 wheel and no sdist. Only remaining option was GitHub source build.
