# Owner feedback queue

This is a working queue, not a claim that a feature is live. Finish and verify one item before advancing. “In GitHub” means the code is pushed but the 4090 deployment has not been verified.

| Owner request | Current state | Evidence still needed |
| --- | --- | --- |
| Drop multiple files into the Inbox with minimal steps | Local implementation: one batch creates one Inbox item, with partial-upload reporting and link retry | Push, deploy, then upload mixed files from the live browser and reopen originals |
| Explain and open an apparently empty “Revision 3” card | Local implementation: Inbox cards open in Brain and explicitly distinguish an empty text preview from the original/attachments; version label no longer suggests content | Push, deploy, inspect the specific live note's source and attachments without assuming what is in it |
| Make the maths-test source text readable on a phone | Local implementation: full-width assessment row, collapsible details, sentence/label sections | Push, deploy, visually verify the maths-test record on the narrow live viewport |
| Calendar as a timed weekly grid, with current week indicator | In GitHub since `7c797c3`; not live-verified | Deploy and compare actual week/classes on phone and desktop |
| Color the class itself red for absence or yellow for lateness, including type | In GitHub since `d65a63c`; automatic InSchool attendance extraction is not yet present | Deploy; verify linked attendance with real source records, then implement and live-test InSchool attendance ingestion |
| Automatically populate subjects, courses, lessons, assessments, assignments, attendance, grades and their details from InSchool/Teams | Partial: timetable one-week import live-verified; broader traversal and other categories incomplete | Reauthenticate the 4090's isolated school browser, verify multiweek import, then add each missing source dataset with coverage checks |
| Remove manual “cockpit” work from everyday use; commitments should come from capture/import | In GitHub: primary Tasks screen has no add forms; explicit Inbox task commands create source-linked tasks automatically, and inferred task notes offer one-step acceptance. Local Brain change shows note text first and folds editing/correction controls away. Person-linked promise extraction is still missing | Push Brain change and deploy; live-test task/source linkage and Brain readability; then build promise extraction and simplify remaining surfaces |
| Norwegian/European date display and entry | Partial: reminder entry and snooze use explicit `dd.mm.yyyy hh:mm` locally | Audit every other visible date input/output, remove confusing native `mm/dd/yyyy` controls, and verify locale behavior live |
| Whole-account Teams/365 and Gmail collection | Open/partial | Obtain authorized account access and verify dataset-by-dataset sync, contents, pagination and completeness |

The live site may lag GitHub while remote deployment is unavailable. Do not mark a row finished from a passing unit test alone.
