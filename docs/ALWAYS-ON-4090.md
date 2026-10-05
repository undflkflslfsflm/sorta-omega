# Keeping SILENT-4090 available

The 4090 being offline in Tailscale does not by itself prove Windows slept. Diagnose the next outage before changing unrelated network or service settings: inspect uptime, the System event log for sleep/boot/power-loss events, Tailscale service state, and the app readiness endpoint.

## Host power

`infra/windows-host/set-always-on-ac-power.ps1` reports the active scheme's AC sleep and hibernation settings without changing them. Run it with `-Apply` in elevated PowerShell on **SILENT-4090** to set both AC idle timeouts to zero. It saves the prior query output in `%ProgramData%\SortaOmega\power-policy`. It deliberately leaves DC/battery, display timeout, Windows Update, hibernation availability, and user-initiated shutdown unchanged. Verify the after-values and an overnight idle interval on the actual host.

No Windows power plan can restart a PC that is shut down or has lost mains power. Set the motherboard/UEFI option commonly called *Restore on AC Power Loss* to **Power On** after confirming the exact board and firmware; do not assume that Windows can set it. A UPS can bridge short outages, but the PC, router/modem, and any required switch all need power for remote access.

## Runtime recovery

- Tailscale and OpenSSH must start automatically, but keep the existing scoped Tailscale SSH rule and never open SSH broadly.
- `SortaOmega-DockerDesktop` is an at-startup watchdog for Docker Desktop. The production app and PostgreSQL Compose services use `restart: unless-stopped`. Check both the watchdog and container health after an actual reboot.
- Qwen generation, Ollama embedding, and the local worker have their own scheduled runtimes. Confirm task state, last result, listener, and a real model request after reboot rather than treating `Ready` as healthy.
- The school browser import tasks currently use an **interactive** Windows logon and a signed-in Edge profile. Locking the desktop is different from signing out. A reboot without user sign-in may restore the API but leave Teams/InSchool imports paused. Do not enable automatic Windows sign-in just to hide this limitation; move these collectors to durable authorized APIs where possible, or arrange a secure interactive sign-in after reboot.
- Review each school task's `StartWhenAvailable` and `WakeToRun` settings and its status log. A scheduler can retry missed work after boot, but cannot execute on a powered-off host. `WakeToRun` is not a substitute for preventing idle sleep.

After any change, test in order: host stays online while idle, Tailscale/SSH reconnect, Docker and model health, Sorta `/health/ready`, authenticated browser UI, then a real school import. Keep the existing backup/restore validation in scope; uptime is not a backup.
