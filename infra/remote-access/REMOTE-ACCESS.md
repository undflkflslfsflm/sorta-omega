# Private remote access

Sorta Omega uses one canonical HTTPS origin. Do not configure both profiles at once, and do not expose PostgreSQL, Ollama, worker administration, debug ports, or a development server.

## Required preflight

Run `infra/windows-host/host-doctor.ps1` on the intended RTX 4090 host. The report is read-only and records actual CPU, RAM, GPU, storage, installed runtimes, and relevant service state. Preserve the report with the deployment evidence; unknown probes remain unknown.

Before remote access, prove all of the following locally:

- the production app listens only on `127.0.0.1:3210`;
- owner passkey bootstrap is closed and a recovery method has been saved;
- `/health/ready` returns ready after a restart;
- the configured `APP_ORIGIN` is the exact final HTTPS origin;
- cookies, WebAuthn RP ID, CORS, origin checks, PWA scope, and OAuth callbacks all use that origin.

## Default: Tailscale Serve

Use this when Tailscale may be installed on both computers. First inspect the existing configuration:

```powershell
tailscale version
tailscale status
tailscale serve status --json
```

Do not reset unrelated Serve configuration. After reviewing the tailnet access policy and choosing an unused mount, an administrator may publish only the loopback application:

```powershell
tailscale serve --bg http://127.0.0.1:3210
tailscale serve status --json
```

The current Tailscale CLI documents `--bg` as persistent across terminal exit and restart. Windows unattended mode is a separate, owner-approved setting. Never use Funnel for Sorta Omega.

Verification requires a second enrolled device: deny an unapproved identity, sign in with the application passkey, save and reopen a note, test reconnect, inspect cache policy, and confirm host-off behavior.

Official references:

- https://tailscale.com/docs/reference/tailscale-cli/serve
- https://tailscale.com/docs/how-to/run-unattended

## Alternative: Cloudflare Tunnel plus Access

Use only when the remote computer cannot install Tailscale and the owner has an approved domain/account. Configure Access before the published route. The origin must reject requests that lack a valid Access token; trusting an email header is insufficient. Keep application passkey and vault authorization enabled behind Access.

This mode places Cloudflare in the HTTPS transport path. It is not device-to-device end-to-end encryption. Disable unnecessary caching/logging, publish only the exact application and required provider callback paths, and test a deny response before any private content is loaded.

Official references:

- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/application-token/
