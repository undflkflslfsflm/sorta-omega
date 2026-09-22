# Browser offline device policy

The trusted-browser switch previously created a sync-capable client device and
immediately wrote persistent IndexedDB data, without reading or updating the
server's cache policy. New device policies default to session-only, so the UI's
claim of an enrolled private replica was not established by server state.

Enrollment now reads `GET /api/v1/devices/{id}/cache-policy` and, when needed,
uses revision-fenced `PUT` to explicitly approve trusted-persistent caching for
the Omega vault. Caching is enabled locally only after the returned policy proves
both conditions. The server's `clearOnLogout` choice is saved locally. A newly
created grant is revoked on best effort if policy approval or local enrollment
fails, avoiding a silent orphan grant.

Sign-out always locally blocks the core cache before showing sign-in. When the
recorded policy requires clearing, it removes app-owned core records, note
snapshots/drafts, sync queues, conflicts, cursors and pending captures while
preserving the device identity and policy needed for later authenticated use.
If unsynced captures or edits exist, the owner must explicitly confirm their
permanent removal. If pending-data inspection or deletion fails, data is retained
and locked instead of being silently discarded. A retain-on-logout policy keeps
bytes but still locks them until a complete authorized refresh succeeds.

## Evidence and limits

Contract exports now include the existing `DeviceCachePolicy` schema type. Three
enrollment tests cover promotion, already-approved retain policy and rejection of
an unapproved server response. Fake-IndexedDB coverage verifies logout clearing
removes private/pending records but preserves device identity and policy. Startup,
workspace authorization and queue suites cover the surrounding lock boundary.
Live passkey recency, real PostgreSQL policy persistence, failed-cleanup UI and
browser sign-out/re-sign-in remain end-to-end release work.

## Expiry and purge enforcement

The browser records a finite policy expiry relative to the server policy's last
update and checks it synchronously before any trusted-cache path. On each online
replica synchronization it refreshes the authoritative policy. A policy that is
expired, session-only, untrusted, missing the Omega vault, or carries a pending
purge clears private replica data, disables new offline caching and applies the
core access block before returning an authorization failure. Network failure
during this check may use only a still-unexpired local approval. An expired but
otherwise eligible policy must be revision-fenced through the server again to
renew its validity; it is not silently extended in local storage.

Additional tests cover recorded expiry, exact-boundary synchronous disablement,
renewal, online purge clearing/disablement and valid-policy refresh without data
loss. The current API does not expose a device-side purge acknowledgement route;
after a purge, the owner can revoke/erase the old device and enroll a new one,
and the product must not claim remote-erasure certification.

Expiry no longer only withholds reads while leaving expired bytes indefinitely.
Startup performs local expiry cleanup before deciding whether offline mode is
available; synchronization repeats the check before contacting the server; and
an in-app timer clears the private replica when approval expires while the app is
open. Authenticated online UI may remain visible, but its expired offline copy is
removed. An offline-only UI returns to the unavailable screen. Cleanup preserves
device identity and policy metadata for later authenticated renewal, disables
new caching, removes the local expiry marker and applies the core cache block.
Focused tests prove expired private bytes are removed without issuing a policy
request, in addition to the synchronous read-disable boundary.

Policy verification also treats server-side device absence (`404`/`410`) as
revocation: it clears and disables the local replica, then surfaces a local 403
so the workspace removes displayed cached data. Authentication failures and
transient network/server outages are not reclassified as revocation; retained
data remains locked or eligible for the normal, still-valid offline fallback.
Two focused tests distinguish revoked-device cleanup from a network failure that
must preserve the cache.

## Cache limits

The browser records the exact `cacheLimits` returned by the approved server
policy. A legacy local trust flag without those authoritative limits is not
eligible for offline use. Every write that can increase private retained data—
captures, core projections, note snapshots and drafts, sync operations, and
conflicts—runs in one read/write transaction spanning all private stores. The
projected UTF-8 JSON byte count and item count are checked before any mutation,
so an over-limit write aborts without a partial draft, queue entry, cursor move,
or conflict record. Transactions touching the same stores serialize concurrent
tabs against the same budget. Device identity, policy controls, cursors, and
authorization-block markers do not consume the content quota.

Focused tests cover byte and item rejection, rollback, concurrent-tab
serialization, authoritative limit enrollment, invalidation, and refusal of a
pre-upgrade trust flag that has no recorded limits. Browser-engine and storage-
pressure behavior remain part of end-to-end release validation.
