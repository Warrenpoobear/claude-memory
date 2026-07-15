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
