# Recurrence dependency contract

Verified 2026-09-18 against the published `rrule` 2.8.1 package documentation:

- Package: https://www.npmjs.com/package/rrule
- The library implements RFC-style recurrence rules and provides TypeScript declarations.
- Its documented timezone model can return zero-offset values that represent floating local wall time. Omega therefore uses `rrule` only for the recurrence sequence, then converts each floating wall-clock value into a real UTC instant through `Intl.DateTimeFormat` for the event's validated IANA timezone.
- Every API expansion is bounded to at most 366 days and 500 occurrences. Exceptions remain persisted Omega domain records with stable occurrence identifiers.

The Europe/Oslo spring-forward fixture verifies that a weekly 09:00 event remains at 09:00 local time while its UTC offset changes.
