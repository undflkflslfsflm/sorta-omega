# Core offline cache authorization

The main workspace refresh previously treated every thrown error as a host
outage. A 403, conflict, validation response, malformed payload or IndexedDB
failure could therefore substitute cached notes/tasks/events and display an
incorrect “host unavailable” message.

Only a network `TypeError` or API 5xx now permits trusted core-cache fallback.
A 401 returns to authentication without reading the cache. A 403 immediately
removes the displayed core workspace, selected note and derived collections,
sets an in-memory block, and attempts to persist that block in IndexedDB. The
in-memory block takes effect even if persistence fails. Later offline startup
and refresh cannot read core cached records until a complete authorized online
refresh succeeds and removes the block.

Other responses do not substitute cache. If online core data loaded but later
offline-cache maintenance or pending-capture flushing fails, the online data
remains visible with an explicit cache-maintenance warning; it is not mislabeled
as an outage.

## Evidence and limits

The failure classifier has direct coverage for 401, 403, network errors, common
5xx statuses, conflicts, absence, validation, throttling, malformed responses and
storage errors. Fake-IndexedDB tests verify persistent block, withheld reads,
authorized unblock and preservation of retained bytes. UI state clearing and
full sign-in/reconnect behavior still require real browser/backend revocation
testing. Cache bytes are retained for authorized recovery and are not claimed to
be remotely erased while a browser is offline.
