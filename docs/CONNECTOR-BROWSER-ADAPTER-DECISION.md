# Browser-assisted connector decision

Verified 2026-09-21. This note records evidence and implementation boundaries; it is not proof that any account is connected.

## Microsoft Teams

- `gediz/teams-web-chat-exporter` is an active MIT-licensed reference with a browser-extension architecture, structured local exports, bounded per-chat selection, and API-first/DOM-fallback behavior: <https://github.com/gediz/teams-web-chat-exporter>.
- `SomeSunlight/teams-chat-exporter` is a small MIT-licensed Playwright reference that uses a dedicated browser profile and UI scrolling: <https://github.com/SomeSunlight/teams-chat-exporter>.
- `superyyrrzzz/teams-crawler` is a two-commit prototype that instructs the user to copy a bearer token from browser traffic. Omega must not adopt that token-handling design: <https://github.com/superyyrrzzz/teams-crawler>.

Omega should prefer supported Microsoft APIs. If delegated consent is unavailable and organizational policy permits export, the fallback is a deliberately enabled local import bridge. It must run in an isolated integration-worker browser profile, require interactive owner sign-in, pause for MFA/CAPTCHA/layout changes, select explicit chats/channels and date ranges, and emit normalized import artifacts. Cookies, tokens and browser storage never enter API responses, logs, prompts, exports or the model context.

## Visma InSchool

- `CheesyPhoenix/BetterSchool` was archived on 2023-10-13 and labels itself unmaintained. It may inform historical field mapping only; it is not current compatibility evidence: <https://github.com/CheesyPhoenix/BetterSchool>.

Omega retains `VismaAdapter` and truthful per-capability readiness. A live adapter requires current authorized end-to-end evidence from the owner's school account and policy. Until then, the connection remains `unverified` or `import_only`. A permitted browser bridge may use its own isolated profile and interactive Feide sign-in, but must never capture a password, import cookies from another application, bypass MFA, reverse-engineer unrelated private resources, or claim a snapshot is live synchronization.

## Implemented local bridge

`apps/browser-bridge` provides an owner-run, visible Microsoft Edge session for Teams and InSchool. It uses a caller-selected isolated persistent profile, so an interactive sign-in can remain valid between runs. The profile is never serialized into an API response, import artifact, log, prompt, model input, or exported cookie jar.

Teams mode opens only `https://teams.microsoft.com`, waits for the owner to select the exact chat/channel, scrolls the visible message container toward its oldest loaded content, and emits an `omega_notes_json_v1` snapshot that can use the normal upload → import preview → apply flow. InSchool mode requires an exact HTTPS `*.inschool.visma.no` origin, waits for the owner to open the exact timetable week, and emits an `omega_school_json_v1` snapshot for the existing school import-preview route. Both stop with an explicit layout-review error if the expected bounded elements are absent; neither reports live synchronization.

Example owner-run commands:

```powershell
pnpm --filter @sorta/browser-bridge start -- --provider teams --profile "D:\SortaOmega\profiles\teams" --output "D:\SortaOmega\imports\teams-notes.json"
pnpm --filter @sorta/browser-bridge start -- --provider inschool --origin "https://YOUR-COUNTY.inschool.visma.no" --profile "D:\SortaOmega\profiles\inschool" --output "D:\SortaOmega\imports\inschool-week.json"
```

The profile and output directories must be owner-controlled absolute paths. Layout selectors and real account coverage remain deployment-time verification items.

## Shared implementation contract

1. The API stores only a credential reference and capability/readiness metadata.
2. The connector worker owns the encrypted browser profile outside model-visible storage.
3. Navigation is compiled/configured per adapter; imported page content cannot choose URLs or actions.
4. Resource selection and sensitive-data opt-ins are enforced before ingestion.
5. Every run reports coverage, pagination, denied resources, freshness and partial failures.
6. Browser extraction is read-only. Provider writes use separately approved official outbox adapters.
7. The public URL fetcher is not a private-network or authenticated-browser escape hatch.
