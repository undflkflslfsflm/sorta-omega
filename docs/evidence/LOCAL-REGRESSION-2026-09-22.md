# Local regression run, 2026-09-22

Implementation tested: `cd02acb` on the Surface Windows checkout.
Runtime: Node 24.19.0, pnpm 11.19.0; this differs from the pinned release baseline of Node 22.x / pnpm 10.15.1.

`pnpm test` passed with successful process exits: 229 tests total (API 186, local worker 26, desktop 7, web 5, browser bridge 2, maintenance worker 2, generated client 1). API uses one worker. This does not resolve the reported parallel-worker crash.

`pnpm contracts:check` passed: 420 HTTP operations and generated client schema are current.

`pnpm deps:check` initially failed because the generated inventory still recorded the old Node engine range. Regeneration changed only that range from `>=22` to `>=22 <23`; the lockfile did not change. The check was rerun after regeneration.

This run does not establish release acceptance. No live PostgreSQL, real provider account, RTX model inference, Windows installer, backup restore, rendered browser interaction or two-client convergence was executed. A production build was not rerun in this pass. Earlier focused web and local-worker typechecks passed following their respective changes.
