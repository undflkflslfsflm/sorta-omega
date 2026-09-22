# Private access preflight — 2026-09-22

## Verified state

- The client node `takk-oyvind` and deployment node `silent-4090` both reported `Running` in the same Tailscale network.
- Client Tailscale address: `100.74.176.23`.
- Deployment-node Tailscale address: `100.113.88.18`.
- Deployment-node MagicDNS name: `silent-4090.tail19ab4a.ts.net`.
- A Tailscale ping from the client reached the deployment node directly through `192.168.1.118:41641` in 12 ms.
- SSH remained reachable through the explicitly allowed LAN client after tightening the firewall.
- Direct Tailscale access to TCP ports 22, 3210, 5432, 8000, and 11434 was refused after adding the interface-scoped SSH block.

## Boundary retained

- The default broad Windows OpenSSH inbound rule is disabled.
- `Sorta-Scoped-SSH-In-TCP` permits SSH only from the configured exact LAN client address.
- `Sorta-Block-SSH-Tailscale` explicitly blocks TCP 22 on the Tailscale adapter.
- The application, PostgreSQL, model API, and Ollama ports are not directly exposed to the tailnet.
- Tailscale Funnel was not enabled.

## Remaining validation

- Tailscale Serve and its HTTPS certificate still require account-level approval before the private application URL can be activated.
- After approval, validate HTTPS through `https://silent-4090.tail19ab4a.ts.net`, confirm Funnel remains disabled, and re-scan the direct service ports.
- Set the application/WebAuthn canonical origin to the final HTTPS URL and redeploy before owner bootstrap or passkey enrollment.
- No unauthorized identity or cross-user access test has been claimed.
