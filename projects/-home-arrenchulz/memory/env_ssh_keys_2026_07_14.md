---
name: env-ssh-keys
description: SSH key layout — WSL id_ed25519 passphrase-less (cron pushes); Windows-side id_ed25519 passphrase-protected (Cursor); passphrase not recoverable
metadata: 
  node_type: memory
  type: reference
  originSessionId: 19d919c4-2c34-4788-b7ea-eef0adad84d3
---

Two ed25519 keypairs exist (verified 2026-07-14 via `ssh-keygen -y -P ""`):
- **WSL `~/.ssh/id_ed25519` — NO passphrase.** Used by BatchMode cron pushes (e.g. the Camp Fimfo
  weekly monitor push, see [[project_campfimfo_waco_demand_monitor_2026_07_10]]).
- **Windows `C:\Users\<user>\.ssh\id_ed25519` — passphrase-protected.** This is the key Cursor/Windows
  tooling uses. The user asked for its passphrase 2026-07-14: it is NOT stored anywhere on disk and
  cannot be recovered from the key file — only a password manager or their memory has it. Windows
  `ssh-agent` may hold it cached (why Cursor works without prompting). If forgotten: generate a new
  key and swap the public key on GitHub; there is no recovery path.
  - **2026-07-17: confirmed this key is a repo-scoped GitHub deploy key for `biotech-screener` only**,
    not an account-level key. `ssh -T git@github.com` from Windows returns
    `Hi Warrenpoobear/biotech-screener!` (the `user/repo` form is GitHub's signature for a deploy
    key). It authenticates fine but cannot clone/fetch any other repo over SSH (e.g. it failed on
    `wake-robin-knowledge` with `Permission denied (publickey)`). GitHub deploy keys cannot be
    reused across repos. Workaround for other repos: use HTTPS + `gh auth login` (account-level
    token) instead of SSH — do not add this key as a deploy key to another repo.
