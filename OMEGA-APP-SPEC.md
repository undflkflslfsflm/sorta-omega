# Sorta Omega — Unified Personal OS

**Version:** 3.0 consolidated specification · **Date:** 17 September 2026  
**Deliverable:** One authoritative product and implementation description for Codex.  
**Status:** Planning requirements, not existing code, tested endpoints, live connections, or a deployed application.

> Build the existing Sorta Notes + Calendar idea as one integrated Personal OS. Incorporate the supplied Personal OS requirements without restarting the design, replacing the chosen stack, or losing the original notes/calendar behavior.

## Document map

Sections **1–3** establish the unified product and explicit merge decisions. Sections **4–18** specify the user-facing modules and complete daily workflows. Sections **19–25** define integrations, models, permissions, privacy and cloud behavior. Sections **26–33** define data, implementation, APIs, testing and delivery. Section **34** records provenance. **Appendix A** contains every planned endpoint/native/tool contract; **Appendix B** maps all source requirements; **Appendix C** contains the acceptance scenarios.

Read the product and safety/permission rules together with the operation inventory. Endpoint names alone do not override source ownership, private-context isolation or action confirmation.

## 1. Product objective and scope

Build a Windows-first, local-first, cloud-accessible personal command center for a student who does not want to organize information manually. The user dumps material into one Inbox. The system saves it, understands it, organizes it, connects it to existing knowledge and commitments, proposes or performs permitted actions, schedules work, supports studying, and remembers the result.

The finished application must answer three questions using the same underlying data:

- **What do I know, and where is the original?** Notes, files, school material, messages, transcripts, projects, and source-linked retrieval.
- **What is coming up, and what must I remember?** Calendar, deadlines, conditional promises, preparation, people, and reminders.
- **Given my goals, constraints, and evidence, what should I do next?** Tasks, study plans, knowledge gaps, attendance catch-up, performance, and protected personal time.

The core loop is:

```text
CAPTURE → SAVE ORIGINAL → UNDERSTAND → ORGANIZE → CONNECT
                                            ↓
REMEMBER ← LEARN FROM OBSERVED RESULTS ← EXECUTE ← PLAN
```

This is **one product**, one repository, one owner identity, one permission system, one canonical source model, and shared tasks, events, people, commitments, jobs, and synchronization. Notes and Calendar are integrated workspaces, not separate forks or independent databases. Direct Windows shortcuts and authenticated web routes may open either workspace without creating separate products.

The complete scope includes the original automatic notes organizer and source-linked RAG; the full calendar/commitment extension; school, grades, attendance and performance; material-grounded tutoring and study planning; deterministic scheduling; evidence-based memory and personal interests; personal-data connectors; bounded AI tools; and complete deployment, recovery, contracts, and tests.

This specification consolidates the supplied sources. Product choices and contract clarifications below are implementation requirements, not newly researched claims about external services. Named technologies and integrations must be verified and pinned during implementation. No provider access, model performance, or external capability is assumed merely because it appears here.

## 2. Merge decisions — preserve the design, remove contradictions

These decisions replace incompatible statements in older descriptions. Codex should follow this document rather than reopening settled architecture discussions.

| Overlap | Unified requirement |
|---|---|
| Notes app versus calendar companion versus Personal OS | One integrated application with shared workspaces. Preserve `/notes` and `/calendar` deep links and optional launch shortcuts. |
| Earlier calendar/integration exclusions | Superseded. Calendar, Microsoft 365, school adapters and the supplied personal-data framework are included. |
| Earlier five-destination navigation versus the larger Personal OS menu | Keep a small default pinned navigation; expose every module through expandable sections and the command bar. Features are not omitted to preserve a menu count. |
| Existing concrete stack versus the upload's alternative stack suggestions | Keep React/TypeScript, Tauri, Tiptap/Yjs, SQLite/IndexedDB, Fastify, PostgreSQL/pgvector and the existing worker topology. Inspect and reuse an actual repository first. No unnecessary Next.js/Python/backend rewrite. |
| Earlier grade/attendance exclusion | Superseded as a product feature exclusion. Grades and attendance are first-class modules. Their sensitive imports remain separately enabled, permission-scoped, and read-only toward school systems. |
| Google-style calendar versus Google provider | Keep the Google-Calendar-style UI with independent branding. Add Google Calendar as a provider alongside local and Microsoft calendars, with separately verified scopes and write consent. |
| Local-only AI versus optional cloud AI | Local inference remains the default and must work independently. Add an explicit optional cloud-provider mode, off by default, per-vault and per-purpose. No fallback triggered by local failure. Local-only vaults do not become cloud-eligible by enabling a global provider. |
| Automatic actions versus confirmation | Explicit user commands and previously enabled narrow personal automation can create reversible local tasks/events. Inferred/ambiguous actions are proposals. External/destructive writes require confirmation by default; separately approved trusted own-calendar rules remain narrow. Invitations/RSVP/shared changes require an explicit action preview and confirmation. |
| Weekly sync versus a current school calendar | Weekly personal-data aggregation/insights default to Sunday 03:00 Europe/Oslo after opt-in. Operational school/calendar freshness retains source-appropriate incremental updates and refresh schedules; it does not wait a week. |
| Confidence examples such as 87% | Retain confidence, reason, and evidence fields. Do not display self-reported model scores as calibrated probabilities. Numerical estimates require a documented interpretation/evaluation. |
| Browser automation versus a bounded application | Add replaceable, explicitly authorized extraction adapters. Do not grant a general autonomous browser/shell agent, credential access, or arbitrary network execution. |
| Meetly/audio naming | Preserve the requested Meetly/audio adapter. Meetily or another actual package may be bound only after its exact identity and supported export/API are established. A label is not an API contract. |

Still outside scope: a full Notion database builder, infinite canvas, public social feed, team-collaboration product, plugin marketplace, arbitrary coding/host-control agent, background location surveillance, and automatic publishing of notes. Reuse relationships for useful navigation rather than requiring a decorative whole-vault graph.

## 3. Non-negotiable invariants

1. **Save before AI.** Capture succeeds without a model or internet. Classification, transcription, indexing, scheduling, and connector failures cannot erase an original.
2. **One canonical record.** A note appearing in several projects/topics remains one note. Imported provider records remain versioned sources with linked annotations, not uncontrolled editable duplicates.
3. **Separate originals and interpretations.** Preserve original content, user edits, extracted text, generated derivatives, structured provider data, and inferred facts distinctly.
4. **Source-linked intelligence.** Facts, commitments, study recommendations, interests, and generated answers retain exact supporting revisions and passages where available. Missing evidence is visible.
5. **User control wins.** Corrections and field locks survive reprocessing. Inferences never silently become confirmed facts. AI mutations record provenance and an undo path where reversible.
6. **Organization is not a gate.** Uncategorized notes remain searchable. There is no obligation to empty an Inbox or approve every label.
7. **Deterministic enforcement.** The LLM proposes typed interpretations. Code validates permissions, resolves calendar arithmetic, checks constraints, schedules, and executes allowed commands.
8. **Honest availability.** Saved locally, synced, imported snapshot, source stale, extraction pending, indexed, AI offline, permission denied, and externally blocked are distinct states.
9. **Private context stays private.** Private prep, loans, profiles, school records and source excerpts never enter provider event descriptions, invitations or lock-screen previews by default.
10. **One authorization/write path.** UI, imports, agents, API, MCP, synchronization and connectors all use the same domain policies. No privileged second writer.
11. **No fake production functionality.** No canned AI answers, fabricated grades, fabricated attendance, fake live connectors, stub success responses, or empty lists described as complete synchronization.
12. **Offline core and recovery.** Notes, cached calendars, tasks and lexical search remain usable with visible coverage. Backups and full-fidelity exports must restore into a clean installation.

## 4. Application shell, navigation, and daily experience

### 4.1 One interface, progressive disclosure

Use a polished consumer-product interface rather than a generic administration dashboard. It must be keyboard-friendly, readable, responsive and usable without knowing database terminology. Respect reduced motion, focus visibility and accessible contrast. Do not encode status only in color.

Default pinned navigation: **Inbox, Today, Calendar, Tasks, Brain**. Expandable sections expose **School, Study, Performance, Attendance, People, Projects & Ideas, Personal Profile, Integrations, Settings**. Users may pin frequently used modules. Ask/Find/Make is globally accessible and has its own workspace route. Do not force all modules onto the opening dashboard.

On mobile prioritize Capture, Today, Calendar, Tasks and the command bar. A web/PWA session uses the same records as Windows. A fresh offline browser cannot pretend to hold an uncached vault.

### 4.2 Today and the next action

Today prioritizes one clear next action, the upcoming schedule, preparation for the next event, due tasks, and urgent source changes. Performance, attendance and insights are expandable summaries.

A next-action card contains a concrete task, actual source material, an honest duration estimate, and **Start**. Example: “Economics — read pages 84–91 — about 15 minutes.” The page range must exist in the selected source. Estimates are not promises.

Support “I have 20 minutes,” “What should I do now?”, “Plan my evening,” and “Resume where I stopped.” Recommendations consider deadlines, fixed events, remaining work, current goals, protected time, and available material. Explain why, allow replacement/dismissal, and do not shame missed sessions.

### 4.3 Command bar

The command bar can find notes, answer questions, open records, create a permitted personal task, propose rescheduling, start study, inspect memories, or explain a decision. Its answer and any proposed mutation are separate objects. Text such as “Done” cannot substitute for a persisted command result.

Examples: “What did we learn in economics yesterday?”, “What did I promise Hanako?”, “Move my study block to tomorrow,” “What do you know about my interests?”, “Why was this scheduled?”

## 5. Universal Inbox and capture

Capture accepts text, rich text, Markdown, code, ideas, personal reflections, tasks, reminders, messages, assignments, documents, URLs, screenshots, images, voice, audio and lecture transcripts. Preserve supplied source identity and authored time separately from import time. Unsupported files can be stored, with indexing limitations visible.

The opening surface is a large “Paste or write anything” field. Title, tags and destination are optional. Save returns a durable local acknowledgment before AI work begins. Original attachments remain accessible even when extraction fails.

Windows includes a configurable global shortcut, initially `Ctrl+Shift+Space`, a tray action, quick-capture window, deliberate clipboard capture, native file picker, and optional start-at-login. Detect shortcut conflicts. Do not continuously read the clipboard, microphone or browsing history.

The Edge/Chrome clipper saves selected text or the invoked article with its title, URL, selection and capture date. URL ingestion/fetch is explicit; a plain pasted URL is not permission to crawl a site. Folder watching uses an owner-selected folder, import preview, exclusions, hashing and version tracking. The cloud cannot provide arbitrary local paths. A disappearing source file does not delete an imported note automatically.

The pipeline is:

```text
Persist original + source metadata + operation ID
→ acknowledge durable save
→ enqueue extraction/classification/indexing
→ create evidence-backed candidate records
→ apply allowed local policy or retain proposals
→ update searchable projections and relevant preparation/plans
```

Repeated delivery with the same operation identity creates one capture. A large mixed paste stays intact; splitting or merging requires preview and preserves ancestry. Imported documents may contain text resembling commands; these remain content, not authority.

## 6. Notes, Brain, organization, projects, and ideas

### 6.1 Editor and library

Provide headings, paragraphs, lists, checkboxes, code blocks, quotes, simple tables, callouts, images, attachments, internal links, Markdown paste/export, autosave, undo/redo and revision history. Keep the editor's required components available without paid extensions.

Use canonical Yjs document state and immutable snapshots. Markdown/plain text is a projection/export format, not a second independently editable body. A details drawer shows original capture, source, current filing, tasks, related notes, AI actions, history and index status.

All notes, recent, pinned, project, topic, school-subject and saved-collection views reference the same content. Begin with Inbox and All notes rather than a compulsory taxonomy.

### 6.2 AI classification

Recognize the supplied semantic categories: task, event, assignment, assessment, note, idea, project, person, reference, school material, reminder, memory, question, message, document and other. These are typed interpretations and filters, not reasons to overwrite or physically move a capture.

Retrieve likely existing destinations before classification. Extract a short title, existing label/project IDs, entities, related records, source spans, and candidate actions. Prefer established aliases. Permit multiple memberships. Ambiguous material remains useful in Inbox and search.

Store origin separately from epistemic status. Origin includes owner input, provider record, extraction or generation; status includes explicit/confirmed, inferred, disputed or recommended. An owner sentence can still be uncertain or hypothetical. A trusted source can become stale or conflict with another source.

Classification returns bounded schema-valid IDs and text spans, not code, filesystem paths or database commands. Record source revision, model digest, prompt version, concise reason and applied policy. No hidden chain-of-thought field.

### 6.3 Emerging organization and corrections

New topics remain provisional until sufficient distinct evidence and no existing alias conflict. Preserve the previous starting policy of three distinct notes before optional promotion, configurable and evaluated rather than presented as scientific. Broad hierarchy changes require preview.

“Wrong area” changes and locks the relevant association. Broader rules require a preview of affected notes. Store corrections as examples and deterministic rules; do not claim to have retrained the model. Reclassification cannot overwrite locks or apply obsolete results.

### 6.4 Projects, ideas and useful relationships

An idea can link to related ideas, research, sources and conversations; with confirmation it can become or join a project. Project views combine notes, tasks, generated briefs, progress, upcoming events, open questions and decisions.

A project is a typed entity over the existing project label/identity, not a second unrelated project store. Promotion preserves the original idea and provenance. Merging ideas/projects/people requires a reversible preview.

Related-to, elaborates-on and potentially-contradicts links show evidence. Similarity alone is not proof of dependence or contradiction. Generated project briefs retain source manifests, show staleness, and refresh AI-owned sections without overwriting user annotations.

## 7. Source processing, global search, and RAG

### 7.1 Supported materials

Process text/Markdown, sanitized HTML, PDF, DOCX, PPTX, XLSX, PNG/JPEG/WebP and tested audio formats. Preserve originals, file names, source times and access scope. Publish actual tested limits and unsupported content. Extract available text first; only use image recognition/OCR where needed or explicitly requested.

Do not execute Office macros, embedded scripts, external workbook links or attachments. Bound file size, archive expansion, parser time and memory. Distinguish password-protected, damaged, unsupported and temporarily unprocessable material.

Each document/chunk can reference subject, course, teacher, date, source, document, chapter, lesson, topic, content type, and created/updated times. Only fill fields supported by source or owner input. Missing chapter/course information is not guessed into an authoritative label.

### 7.2 Find, Ask, Make

**Find** retrieves originals and passages without needing a generated answer. Combine lexical matching, embeddings, metadata filters, source diversity and optional reranking. Preserve exact errors, names and code fragments. Search notes, files, tasks, calendar events, assignments, messages, projects, ideas, memories and authorized personal-data records through typed scopes.

**Ask** answers from the selected authorized material and cites the exact supporting revision/block/page/timestamp. “No supporting source found” is valid. Disagreements and source freshness are shown. General brainstorming is an explicit mode, not personal history fabricated by the model.

**Make** creates briefs, summaries, comparisons, outlines, checklists and study artifacts as labeled derivatives linked to originals. Generated summaries do not become independent corroborating evidence for other AI summaries.

Clicking a citation opens a split source panel at the relevant passage; the user can open the full record and return. Historical answers open historical snapshots, not silently changed current text. For structured records, source navigation opens the relevant historical provider field/value.

### 7.3 Retrieval contract

Check authorization before retrieval. Parse visible filters. Start with paragraph/heading-aware chunks around 300–700 tokens, retaining short notes intact; initial retrieval may use about 30 candidates and 6–12 final passages. These are tuning defaults retained from the notes plan, not achieved quality claims.

Rank fusion, optional reranking and source diversification produce a bounded evidence packet. Validate that citations belong to supplied authorized revisions and that claimed exact quotations occur in them. Valid citation IDs are not a proof that every generated claim is supported; evaluate support separately.

Indexes record model/chunker versions. Do not mix embedding spaces. Reindex resumably into a separate index and switch only after validation. Lexical search works while embeddings are unavailable. Without a running authorized embedding backend, a new remote semantic query cannot be promised just because stored vectors exist.

## 8. Calendar and ordinary scheduling

The calendar uses a familiar Google-Calendar-style layout with original branding. Include day, week, workweek, month and agenda views; Monday-first defaults; date jump; mini-month navigator; current-time marker; timezone display; visible layers; keyboard navigation; and a readable phone agenda.

Create/edit personal events, drag/reschedule, resize duration, duplicate, trash/restore, recurrence and exceptions. Provide keyboard/form equivalents to dragging. Editing recurrence distinguishes this occurrence, this and following, or the whole series, with provider-specific restrictions visible.

Layers include Personal, School, Study/Preparation, Exercise, Social, Deadlines, Assessments and attendance overlays. Provider calendars can be independently shown. Source-owned lessons, exams and deadlines remain source-owned; private planning cannot rewrite official school information.

An event drawer shows title, time state, place, private people references, actual provider attendees separately, sources, history, conflicts, freshness, private prep and linked files. AI-generated flexible blocks are visually distinguishable and have “Why was this scheduled?”

Use the existing `TimeSpec` union:

- `timed`: start and end instants plus timezone and original local values.
- `start_only`: known start, unknown end; no fabricated duration.
- `date_only`: date with `deadline` or `time_unknown` semantics; neither claims all-day busy time.
- `all_day`: explicitly all-day, with an exclusive end date.
- `unresolved`: original wording and unresolved interpretations.

An unknown-time appointment appears in **Time not set**, not at midnight or an arbitrary hour. A deadline marker is not a meeting. A visual marker's height is not evidence of duration. External timed writes require complete time information or an explicitly accepted default-duration rule.

## 9. Note-to-calendar automation and conditional commitments

### 9.1 Canonical integrated scenario

Earlier note: “I borrowed Hanako's book. I'll return it next time I meet her.” Create an active commitment referencing Hanako, the book, the original passage, and a condition requiring a compatible in-person encounter. No invented deadline.

Later note: “Meet Hanako at Embers in two weeks.” Preserve the statement timestamp, resolve the date deterministically, and under the enabled owner-note policy create one private entry. With no clock time, retain Time not set. Attach “Bring Hanako's book” with both source passages in the private prep panel.

For a statement written September 17, 2026 in Europe/Oslo, “in two weeks” refers to October 1, 2026 regardless of later processing time. Retain calendar-date arithmetic across DST rather than adding a fixed elapsed-hour count blindly.

The original mismatched example is a mandatory negative test: a loan from **Ember** plus a meeting with **Hanako** at **Embers** does not establish that Ember is Hanako or will attend. Keep person/place identities distinct. Visiting a person's venue does not prove their presence; a video call cannot fulfill a physical handover condition.

### 9.2 Commitment lifecycle

A commitment is an ongoing promise, loan, follow-up or condition-dependent action. It can remain active without a date. States: proposed, active, fulfilled, cancelled, superseded. Store actor/counterparty, object, bounded condition, optional deadline, activation time, source evidence, field locks, suppression decisions and completion evidence.

Prep belongs to an event occurrence and references an existing commitment or explicit requirement. Prep states pending, packed, dismissed, not-applicable are independent of commitment completion. Packing a book is not returning it. An event ending is not proof of fulfillment.

Cancellation withdraws event-specific prep/reminders but preserves the unresolved commitment for the next suitable event. Rescheduling rebinds reminders once. “Returned Hanako's book” may fulfill a unique commitment under an enabled owner rule; “returned it” with multiple candidates remains a proposal.

Match by resolved identity, active status, compatible context, field authority and access scope before semantic ranking. “Next time” binds to the next eligible occurrence rather than creating multiple promises. Preserve dismissal feedback so irrelevant matches do not reappear unchanged.

### 9.3 Private preparation

Group prep into **Bring, Do beforehand, Discuss, Open these files**. Include explicit requirements, owner-authored reusable checklists and evidence-backed commitments. Label generic templates separately from teacher instructions. No invented packing requirement or travel time.

The private overlay is not serialized into provider descriptions, invitation bodies, ordinary ICS exports or notification previews. Local-only evidence enriching a cloud event is computed locally; its private derivation stays local.

### 9.4 Intent and change rules

Definite owner-authored plans with resolved dates can become reversible private entries after policy opt-in. Maybe/should/could, negation, fictional quotations, old examples and uncertain external messages remain suggestions or non-events. Structured authoritative provider records can be mirrored without LLM reinterpretation.

Keep raw wording, language, statement identity, reference timestamp/timezone and source revision. Import time is not a substitute for missing authored time. Editing unrelated paragraphs does not move a relative date forward. A newly authored replacement statement establishes a new reference only visibly.

“Move that meeting” requires a uniquely resolved event. User-corrected time fields remain locked. Cancelled occurrences do not cancel entire series. Source disappearance and an explicit cancellation are different observations.

## 10. Tasks, reminders, and execution

This is the supplied **ADHD-friendly execution UX**: reduce executive-function overhead through one clear next action, short blocks, one-click starts and forgiving recovery, without making clinical claims.

Use one task model for checkboxes, personal tasks, study work, imported task references, assignment preparation and project actions. Do not create separate unsynchronized task stores for School and Calendar.

Explicit checkboxes are owner-authored tasks. Definite owner requests can be applied under enabled capture rules; other inferred tasks are suggestions until accepted. Completing a checkbox-linked task updates the canonical note through the normal edit service. Imported To Do/Planner completion remains a separate provider fact unless a future approved write capability is actually added.

Tasks support due date/time, estimates, remaining effort, split policy, dependency references, state, priority, source anchors and optional course/project/assessment links. Distinguish due date from scheduled work sessions. A reminder is not another task.

Reminders support snooze, dismiss, complete, quiet hours, channels and missed-delivery state. Store schedules independently of the LLM. Deduplicate after restart; invalidate old triggers when the relevant event changes. Known reminders and deterministic cloud jobs can run with AI off, while actual notification delivery depends on device permissions/connectivity and OS behavior.

Focus sessions support start, pause, resume, interrupt and finish with observed active duration. A running timer does not prove the work was completed. Ask for or accept explicit completion/progress; preserve partial work. Offer short blocks, breaks, one-click source opening, overdue recovery and protected free time without guilt-based streaks.

## 11. School workspace and source-grounded learning context

School is a first-class workspace containing subjects, courses, teachers, classes, timetable, assignments, assessments, tests/exams, deadlines, grades, attendance, notes, transcripts and materials. Teachers reuse People identities; lessons link canonical calendar occurrences rather than duplicating event times.

A subject/course page shows applicable current instructions, upcoming assessments, assignments, material, related notes, knowledge gaps, study plan and optional performance/attendance. Preserve academic period, cohort/class and student-specific applicability where supplied.

Imported assignments retain original instructions, authorized files, current due date, source revisions, submission state when permitted, and applicable student-specific extensions. A personal task or AI plan does not change a teacher's assignment.

A lesson opens room/time/source, relevant announcements, textbook sections, transcript and preparation. Do not infer a whole school year's recurrence from one sample week; rotations, holidays and exceptions require explicit source or owner-approved bounds.

Manual school records and imported snapshots are supported with clearly labeled origin. A disconnected account produces truthful empty/unavailable states, not fabricated sample school data. Functional manual/import workflows must exist even when live institutional access is blocked.

## 12. Attendance and catch-up

Attendance is first-class, separately enabled for import and never written back automatically. Retain source statuses **Present, Absent, Late, Partial, Excused, Unknown**, the raw provider code, and source identity. When a provider expresses presence and excusal as different fields, preserve both rather than collapsing their meaning.

Records include student/owner, course, subject, teacher when known, lesson/occurrence, date, start/end when known, status, duration/units when supplied, source ID, observed/authored timestamps and revision. An unobserved lesson is Unknown, not Present. Missing import data is not evidence of absence.

Provide overall and subject views, time trends, missed lessons, late arrivals and calendar overlays. Display coverage, calculation basis and units for percentages; do not mix lesson counts with hours or assume an official school denominator. These are descriptive personal views, not official attendance rulings.

A missed lesson can produce a catch-up proposal from actual associated notes, transcript, teacher messages, materials and assignments. Show what the sources establish and what is missing. “Here is what appears to have been covered” needs evidence; a textbook chapter nearby in the curriculum is not proof of that lesson's content.

Accepting a catch-up plan creates normal tasks/study sessions through the shared scheduler. User corrections are annotations unless editing a manual local record; never rewrite imported official attendance. Sensitive records are hidden from notification previews and public/provider exports by default.

## 13. Grades, performance, and knowledge gaps

Store subject/course, assessment, original grade representation/scale, date, official weight only when supplied, owner target, source, revision and explanatory context. Support nonnumeric grades. A personal target or descriptive aggregate is not an official predicted final grade.

Performance combines documented assessment results, accepted targets, upcoming assessment dates/importance where known, demonstrated knowledge gaps, estimated remaining work, available time, recorded study duration, completion and attendance coverage. Do not simply prioritize the lowest grade.

Every recommendation explains its contributing factors and missing data. Unknown assessment weights remain unknown; do not silently invent official weighting. A displayed average must state its formula, included records and whether it is unweighted or based on explicit weights. Preserve school scales rather than assuming all grades use one scale.

Knowledge gaps are linked to concept/material and evidence such as a scored response, owner report or teacher feedback. Reading a chapter, time spent, or one wrong generated question does not conclusively establish mastery or inability. Owner can correct/dismiss inferred gaps. Model grading is labeled, appealable and never represented as an official school mark.

No promised grade outcome, mental-health diagnosis, motivation score or psychological explanation. Behavior-derived suggestions describe observed data and limitations. Source deletion/revocation invalidates dependent summaries and recommendations.

## 14. Study planner and tutoring modes

### 14.1 Material-grounded study plans

From “Need to study chapter 6 before Friday,” identify a supported course, the actual chapter and an applicable assessment/deadline when available. Retrieve connected material, existing knowledge-gap evidence and calendar constraints. Preserve ambiguity rather than choosing an unrelated chapter.

Break work into manageable units tied to actual sections/pages/topics: read, explain, practice, recall and review. Estimates are editable, with provenance as owner estimate or model estimate. A plan exposes scope, material version, deadline source, remaining work and reasons. Do not produce a generic plan while ignoring supplied relevant material.

The study planner generates structured work requirements, not arbitrary calendar coordinates. The deterministic scheduler places accepted work. The user can start from a calendar session, task, chapter, assessment, search result or Today.

### 14.2 Modes

Implement **Explain, Socratic Tutor, Active Recall, Flashcards, Practice Questions, Mock Exam, Explain Like I'm 12, Advanced Explanation, Identify Knowledge Gaps**. All can operate on an explicit source scope with difficulty/length controls.

Explain modes retain source terminology and citations; simplified explanations are labeled transformations. Socratic mode asks incremental questions and retains the user's answers. Recall and practice provide source-backed feedback. Mock exams retain the selected scope, instructions, questions, answers, timing if enabled and scoring rubric; they are practice, not school examinations or guaranteed predictions.

Flashcards have an editable prompt, answer, source anchors, revision and review history. An initial deterministic spaced-review policy can be configurable, versioned and based on recorded ratings; do not claim it is clinically or educationally optimal. Deleting or changing a source marks affected cards stale for review rather than silently changing historical answers.

### 14.3 Study state and adaptation

Persist plan progress, active/paused sessions, responses, feedback and source links across restarts. Capture interruption without marking a lesson failed. Replanning uses remaining effort, not restarting completed work.

Track planned versus observed duration, subject/task type, time of day, postponement, session length and breaks only within this app or explicitly provided integrations. Show patterns only with adequate disclosed samples and coverage; do not infer nonuse means failure. Adapt future estimates and suggested windows transparently, with manual overrides and reset.

## 15. Deterministic scheduler and replanning

### 15.1 Architecture

```text
Owner request / accepted task / structured school deadline
→ LLM extracts work requirements where interpretation is needed
→ schema validation + evidence/permissions
→ deterministic scheduler reads current constraints
→ candidate plan + conflicts + explanations
→ existing proposal/policy approval
→ revision-checked calendar commands
```

Use code for date math, recurrence expansion, free/busy, capacity, deadline feasibility and placement. Do not let an LLM invent exact free slots or execute schedule writes directly.

### 15.2 Inputs and placement

Inputs include task IDs, remaining estimated minutes, earliest start, deadline, priority, dependencies, split/min/max block rules, desired subject/material, preferred periods, fixed calendar occurrences, source freshness, protected sleep/exercise/social/free time, breaks, daily limits and owner-locked blocks.

Build a bounded planning horizon. Expand recurrence within it; subtract known fixed/protected intervals and explicit buffers. Treat unknown-duration/missing-time events as uncertainty that is shown in the plan, not proof of free time. Where it matters, request resolution or flag the affected placement as provisional.

A reproducible initial policy can sort feasible work by deadline, explicit priority and dependency readiness, then apply configurable preference penalties, fragmentation limits and minimal-change preference. Record algorithm version, constraints version, tie-breaks and reason codes. Weights are product configuration, not universal scientific facts. Replace the internal optimizer only behind conformance tests without changing the domain contract.

Return planned blocks, unscheduled work, capacity shortfall, uncertain intervals, constraint violations avoided and reasons. Never satisfy a deadline by secretly moving school, sleep, social time or locked appointments. Impossible requests return an explanation and options; they do not fabricate availability.

### 15.3 Replanning

Triggers include missed/partial work, new assignments or exams, changed deadlines, moved events, changed availability, or tasks taking longer. Replan remaining flexible work with minimal disruption. Preserve started/completed and locked blocks. Coalesce repeated triggers to avoid constant schedule churn.

Local flexible blocks may move under an enabled bounded rule; otherwise create a plan preview. Important external changes retain explicit review. A preview carries input revisions and expires when they change. Acceptance rechecks conflicts atomically. Bulk changes have an undo record; undo must not erase subsequent manual changes.

The calendar preparation-plan endpoint and school study planner must call this same scheduler. Do not build one heuristic for Calendar and another disconnected planner for School.

## 16. People, social planning, and long-term memory

People contains explicitly recorded friends, family, teachers, groups and contacts. Store aliases with evidence, provider identities with account scope, linked meetings, relevant notes, and active commitments. A name match is a candidate, not identity proof. Never infer another person's availability from silence or their attendance from a venue name.

“I want to hang out with Jonas this week” is a social intention, not a confirmed meeting. Suggest available times using the user's actual schedule and other availability only when explicitly connected/authorized. Social, exercise and free time are legitimate protected categories. Sending a message or invitation remains a separate confirmed action; the app does not message contacts autonomously.

Long-term memory holds explicitly supplied facts, projects, ideas, goals, preferences, recurring plans, study preferences, workflows and evidence-backed interests. Every memory is searchable, editable, timestamped, source-linked and qualified as explicit/inferred/recommended. Memory may be confirmed, corrected, dismissed, superseded or purged. A durable memory is not an uninspectable model prompt.

Answer “What do you remember about this project?”, “Why do you think I prefer this?” and “What evidence supports this?” by opening the actual stored memory and supporting source revisions. A dismissed inference must not silently reappear after the next sync; record suppression and apply it when evidence changes.

## 17. Personal Profile, interests, and personal-data normalization

The Personal Profile shows **Interests, Preferences, Projects, Goals, Current Focus, Emerging Interests, Long-term Interests**. Its purpose is an inspectable model of useful preferences, not an invasive psychological profile. The user can confirm, correct, dismiss, delete evidence or disable this feature.

Potential inputs are selected notes, projects, reading, school work, recorded app activity, and authorized imported data from YouTube, Spotify, TikTok, Instagram, Reddit, Discord or other supported services. These are requested connector families, not claims that all watch/like/history data is available. Each imported field must say exactly what it represents.

Normalize provider observations into `PersonalDataItem` with provider/account/source-object identity, actual interaction/action type, content/resource reference, timestamps, content hash, available metadata and evidence. Distinguish viewed, liked, saved, followed and explicitly stated. A saved URL is not a watched video; repeated syncs are not new interactions.

Interest analysis separates:

- **Observation:** what was actually recorded and over which coverage window.
- **Inference:** a tentative interest or trend inferred from those observations.
- **Evidence:** source links and counts after deduplication.
- **Uncertainty:** missing sources, sampling/coverage, inference method and model version.

Do not turn one interaction into a permanent preference. Permit decay, contradictory evidence and explicit correction. A percentage trend requires a named metric, comparable windows and nonmisleading denominator; missing history is not zero activity. Confidence examples from the supplied concept are illustrative only, not automatic numerical outputs.

Do not infer mental-health conditions, sexual orientation, religious/political affiliation, health diagnoses or other sensitive traits from consumption. Explicitly user-provided information can be stored under controlled memory settings, but it is not needed for interest ranking. Do not use a profile to manipulate choices or maximize engagement.

Imported profile data stays separate from scheduling authority. A suspected interest cannot override an explicit deadline, move protected time, register the user for an event or subscribe to a service. Personalization proposes; owner goals and permissions govern.

## 18. Weekly sync, insights, and behavior-based adaptation

After explicit enablement, personal-data aggregation defaults to **Sunday 03:00 Europe/Oslo**. Support manual, daily, weekly and configurable schedules. Store timezone, next run, last attempt/success, cursor, last seen ID, hash, source timestamp and imported/updated/deleted counts. For configurable schedules that fall in a skipped local time, use the next valid local time and show that adjustment; for a repeated local time, execute once at the first occurrence. Persist the local date/run identity to deduplicate catch-up after restart.

Use provider-specific incremental sync when actually supported. Do not redownload every source every week. The weekly orchestrator can review all selected sources but operational calendar/school updates keep their faster source-appropriate schedules. A local worker or local-only job runs only while its host is available; show missed/delayed runs honestly.

Weekly Review may cover school, observed study time, completion, attendance coverage, upcoming assessments, projects/ideas, explicitly scheduled social/exercise/free time, authorized content interactions, emerging interests and source-backed recommendations. No unsupported psychological or causal claims. A pattern such as “shorter sessions were completed more often” shows sample sizes and is not proof that duration caused success.

Insights are versioned generated artifacts with time window, coverage, source manifest, limitations and feedback. Refresh does not silently rewrite user annotations. Notifications are opt-in, batched, quiet-hours aware and dismissible. No automatic notification for every tag, inferred preference or profile change.

## 19. Unified integration framework and permissions

### 19.1 Shared provider contract

Extend the existing connector framework rather than introducing independent Microsoft, personal-data and scraping frameworks. Resource adapters implement capability discovery, connect/authorize, health, list containers, initial/incremental sync, fetch, normalize, deep-link resolution, reauthorize and disconnect. Write capabilities are separate and explicitly declared.

Each connection stores provider/account/tenant identity, target vault, credential reference, selected resources/history window, granted permissions, sync schedule, privacy/export rules and per-capability readiness. Secrets never appear in record bodies, model input, logs, exported documents or frontend bundles.

Capability states include supported, unsupported, unverified, needs consent, administrator approval required, needs provider configuration, import-only, degraded and unavailable for this account. Execution states include disconnected, authentication required, syncing, rate limited and error. Keep readiness separate from last sync success.

An implementation must show selected/denied/skipped containers, coverage period, record counts, last successful/failed sync, next attempt and safe error. A partially accessible account must not be labeled completely synced. Disconnect, stop future sync, retain a permitted snapshot and delete imported data are separate explicit choices.

### 19.2 Authorization and source processing

Use official supported authentication flows and libraries. Public/native clients must not embed confidential client secrets. Keep credentials in OS-protected local storage or an encrypted server credential store; the integration worker receives only the access it needs. The AI worker receives normalized authorized content, not provider tokens, browser cookies or unrestricted HTTP access.

Consent is incremental and scope-limited. Personal and school accounts remain distinct. Tenant administrator approval is an external prerequisite, not an error to bypass. Read access does not automatically authorize copying institutional content into an independently hosted cloud; honor account policy and the user's selected storage boundary.

Persist immutable source revisions before projections. Identity includes provider, tenant/account, container and provider object ID. Use pagination, checkpoints after successful persistence, deduplication, retry/backoff, source tombstones, expiration and reauthorization. A 403/429 or temporary source outage is not an authoritative deletion.

## 20. Microsoft 365, Google Calendar, and InSchool

### 20.1 Microsoft 365 requested coverage

Use the documented Microsoft Graph resource APIs where supported, selected and authorized. The existing connector matrix's resource-specific restrictions remain requirements to verify during implementation, not a new claim of current access.

| Resource family | Required application behavior and boundary |
|---|---|
| Outlook Calendar | Read selected calendars; recurrence/exceptions, locations, cancellations and conflicts. Separately enabled own-calendar writeback through the outbox and confirmation policy. |
| Outlook email | Selected messages, threads and attachments as evidence for instructions/deadlines/plans. Import does not mark read, send, move or delete messages. |
| Outlook contacts | Optional identity disambiguation for relevant people; no automatic whole-directory import or name-based identity certainty. |
| Teams channels and replies | Selected class announcements and replies, fully paginated. Later corrections in replies matter. Denied channels remain visible as coverage gaps. |
| Teams chats | Separate opt-in for selected accessible conversations; no all-tenant export shortcut. |
| Teams Assignments | Instructions, due dates, resources and applicable student-specific status/dates where allowed. Treat grades as a separate permission/capability, not implied by basic assignment read. |
| OneDrive / SharePoint files | Selected documents and resources become versioned, cited sources. Files only on the PC use local import/watching instead. |
| Word / PowerPoint / Excel content | Parse authorized files and supported representations through ingestion. Do not invent a universal separate all-documents API for each desktop app. |
| OneNote | Selected notebooks, sections/pages and supported resources, preserving page identity and origin. |
| To Do | Read-only mirror of selected lists/tasks; local prep/task completion does not silently change provider tasks. |
| Planner | Read supported selected plans/tasks; preserve the existing basic-plan scope and explicit premium limitation until an actually verified capability expands it. |
| SharePoint Lists | Capability-gated selected structured lists and explicit field mappings. |
| Existing meeting transcripts / recordings | Separate permissions and availability checks. Calendar access does not imply access to recordings. Never begin recording automatically. |
| Forms / Loop / Whiteboard / other products | Supported exports/files or independently verified native resource adapters. No claim that a single Microsoft login exposes every product. |

School-specific assignment and grade permissions may need administrator consent. Record exact scopes and actual tenant results at implementation. Do not hardcode the previous reference document as proof that permission was granted.

### 20.2 Google Calendar provider

Implement the Google provider through the same calendar domain, selected-calendar discovery, capability report, OAuth storage, source revisions, outbox, recurrence and privacy rules. Verify exact provider endpoints/scopes and notification/reconciliation behavior from official documentation before enabling.

The calendar UI works without Google. Google connection is optional for the user but is an included adapter implementation target, not a second event database. Read sync and write consent are distinct. Do not infer permission to send invitations from calendar read access or from mentioning a contact.

### 20.3 InSchool / Visma InSchool adapter

Retain a dedicated adapter with authenticate/health/sync/incremental-sync/normalize/disconnect behavior, implemented through the shared framework. Desired data includes applicable schedule, classes, subjects, school information, assignments/assessments and separately enabled grades/attendance only where exposed and authorized.

The supplied plan did not establish a public self-service student timetable API or universal ICS feed. This merge does not establish one either. Do not invent endpoints, mistake another school product or OneRoster interface for InSchool, or assume Feide login grants an integration API.

Supported readiness paths:

1. **Approved API/integration:** genuine school/provider documentation, permitted resources and an authorized test account.
2. **Verified feed/export:** an actual institution-provided calendar or data export, with its coverage and freshness stated.
3. **Import bridge:** working CSV/ICS/text/HTML/PDF or deliberately captured permitted timetable snapshot with mapping preview and source date. Screenshot-derived schedule fields require review before applying.

A snapshot is labeled **Imported snapshot — not live**. No fabricated yearly recurrence, room changes, grades or attendance. Build manual/import school features regardless of live-access blockers. Live readiness requires a real source read, a detected update, scope/restart/deduplication checks and actual authorization.

No writes to school attendance, grades, submissions, leave requests or messages. No password collection, Feide/MFA bypass, cookie extraction, replayed private authentication headers or unsupported API presented as approved.

## 21. Personal-data providers and replaceable web extraction

### 21.1 Requested provider families

The integration registry accommodates YouTube, Spotify, TikTok, Instagram, Reddit, Discord and future providers. For each, identify the exact supported personal data, API/export/browser capability, credential type, account eligibility, scopes, coverage and limitations. Do not assume public content scraping gives access to private personal history.

Prefer an official suitable API. Where personal data is not available, implement a real supported owner-provided export/import path or report the exact unavailable capability. Default to selected sources, not surveillance of every account. Normalized records reuse SourceObject and PersonalDataItem, existing sync jobs and RAG.

### 21.2 Extraction adapter roles

Retain the names and intended roles from the supplied specification without claiming verified package identity or capabilities:

| Candidate | Intended role |
|---|---|
| Maxun | Optional self-hosted website-to-API/browser extraction workflows when no suitable official API exists. |
| Firecrawl | Public web crawling, Markdown/structured extraction and RAG ingestion; prefer self-hosting where practical. |
| Anakin OSS | Optional interchangeable extraction backend behind the same interface. Exact project/package/API must be identified before binding it. |
| Playwright-compatible infrastructure | Bounded permitted interaction for an explicitly configured source, not an unrestricted autonomous browser. |

These are replaceable integration targets. Do not install every product or make the core application depend on all of them. Implement adapter contracts, actual supported bindings and capability tests, with missing provider configuration visible rather than fabricated success. An optional feature can be disabled by the owner; an advertised implemented binding must still work against its verified interface. A scaffold without a usable backend remains unimplemented, not merely unconfigured. A declared optional binding is not a fake live integration.

Authenticated extraction is permitted only when the owner and service allow it and the flow uses supported interactive authentication. No CAPTCHA, access-control, rate-limit or MFA bypass. Credentials remain in the integration worker, never in the model. An extractor can read only its approved origins/resources and cannot execute arbitrary navigation instructions from imported text.

Public URL ingestion uses the existing capture/source processing pipeline: fetch approved content, preserve origin/time, extract, chunk, embed and cite. Bound crawl depth/pages/cost, stop on policy violations and make external data transfer visible. Local-only vault content cannot silently be sent to a hosted extractor.

## 22. Audio, transcripts, and lesson association

Retain deliberate audio capture and the optional local whisper.cpp transcription helper. Record original audio durably, preserve timestamps, and report unavailable transcription honestly. Do not auto-start microphone recording from an event or school timetable.

The dedicated **Meetly/audio adapter** supports an identified service's permitted transcript/audio exports or documented API. The supplied naming is not sufficient to invent an API or silently substitute a similarly named application. Owner-provided transcript/audio import is a working fallback, not a claim of live sync.

Pipeline: audio/transcript source → local transcription where needed → optional speaker segmentation → topic segments → evidenced course/date/lesson association → concept/instruction/date/task extraction → shared RAG and proposals.

Use unknown speaker labels when identities are not established. Do not invent teacher names, statements or precise timestamp/page anchors absent from extraction. Owner corrections create a new extraction/transcript revision. Associating a recording to a lesson must be inspectable and reversible.

A lesson transcript can support explanations, catch-up, questions, homework and exam information, but extracted hints are not guarantees of exam content. Respect recording permission and institutional rules. No automatic meeting/lesson recording is authorized by this specification.

## 23. AI architecture, tools, and model policy

### 23.1 Retained small-model defaults

Retain **Qwen3.5-4B**, initially `qwen3.5:4b`, for classification, concise synthesis, extraction and grounded responses; retain **Qwen3-Embedding-0.6B**, initially `qwen3-embedding:0.6b`, for embeddings. Initial embedding index dimensions remain 1,024 if the verified runtime/model supports that contract. Optional local transcription is a separate on-demand helper.

These are inherited configuration choices, not newly verified model-release, size or speed claims. Implementation must verify actual tags, official provenance, licenses, runtime compatibility and digests before pinning. Run real inference, embedding and quality tests. No silent larger-model download or invented benchmark.

Keep a provider abstraction for generate/chat/embed/extract/classify. Ollama is the required working local adapter; an explicitly configured OpenAI-compatible local endpoint can be supported without assuming every backend has identical semantics. Optional cloud inference is an explicitly enabled adapter/mode with model identity, disclosure, budgets and per-vault purpose scopes. It is never a hidden response to worker failure.

Local-only vaults have no cloud AI or hosted extraction path by default or via a broad global setting. Moving content across that boundary requires an explicit export/mode-change preview and authorization. Cloud sync and cloud inference are different settings.

### 23.2 Typed bounded agent router

Use one routing layer over domain tools: Brain/RAG, School, Calendar, Tasks, Study, Performance, Attendance, People, Memory, Personal Data and Integrations. Tools share service authorization; model text cannot grant new tools or permissions.

Validate closed structured schemas, resource IDs, evidence spans, input revisions, finite predicates, quotas and permission policies before commands. Invalid output may get bounded repair/retry; it must never execute malformed requests. No arbitrary SQL, shell, Python, URLs, scripts or filesystem paths from the model.

READ, PROPOSE and WRITE are distinct scopes. Prefer proposal-only external tools. Natural-language commands can initiate permitted domain jobs; a teacher document cannot impersonate the owner. Tools do not receive raw credentials or private browser state. Do not require a multi-agent council or a swarm for every note.

### 23.3 MCP and CLI compatibility

Keep existing local MCP tools for capture/search/read/ask/collections/jobs and calendar context/proposals. Extend with scoped school, study, memory, performance and personal-data tools listed in Appendix A. Returned private information may leave the device through the invoking client; disclose this at grant time.

Provide CLI-Anything-style structured command compatibility where useful: predictable JSON, explicit schema version, state, error codes and reversible domain operations. This is a compatibility style, not a dependency or universal application-control integration. A local CLI cannot bypass the same write/confirmation policy.

### 23.4 Resource and action logs

Prioritize capture/editing and interactive search above background ingestion/analysis/transcription. Limit concurrency, context/token budgets, CPU/GPU usage and tool steps; expose pause, quiet hours and cancellation. Initial context budgets from the existing plan are tuning defaults, not performance guarantees.

Every meaningful action records actor, source revisions, model/prompt/policy versions, typed input/result references, time, concise reason, confidence semantics, confirmation and final effect. Log IDs by default; sensitive content diagnostics require temporary explicit opt-in and redaction. Do not store hidden chain-of-thought as an audit requirement.

## 24. Cloud access, offline operation, and privacy

Keep the established hybrid topology:

- **Windows app/local service:** durable SQLite replica, original-file cache, local queue, narrow native integration and optional local inference.
- **Private cloud hub:** authenticated web/PWA, API, sync, structured integrations/jobs, PostgreSQL indexes, file storage and backups.
- **Owner-controlled AI worker:** Windows or an enrolled always-on machine, outbound authenticated hub connection, local model runtime and explicitly scoped jobs.

No public Ollama port, generic shell endpoint or unauthenticated worker channel. A worker receives only authorized vault/job inputs. New AI work queues visibly when no authorized backend is available.

| State | Required behavior |
|---|---|
| Windows offline with local model | Local notes/tasks/cached calendar and local lexical/RAG function over available data; show replica scope/freshness. External writes remain pending. |
| Hub online, all local workers off, cloud AI disabled | Browser capture/read/edit, keyword search, authorized structured sync, existing reminders and deterministic scheduling can continue. New interpretation/embeddings/answers wait. |
| Hub and an enrolled worker online | Remote access and worker-backed semantic/AI operations work within their permissions. |
| Local model unavailable and no internet | Manual core and cached lexical search still work. No fake chat response or infinite typing indicator. |
| Source permission expired | Display stale/restricted cached state according to policy; stop treating it as current evidence. |
| Explicit optional cloud AI enabled for a synced vault | Only allowed purposes/data use that provider, with budgets and visible backend identity. No automatic expansion to other vaults. |

Cloud-synced vaults use HTTPS and encrypted-at-rest storage, but the server processes plaintext for sync/search/calendar functions. This is **not end-to-end encrypted or zero-knowledge**. Local inference does not change the cloud-storage trust boundary.

Local-only vaults do not register notes, profile metadata, embeddings, jobs or context with the hub. Enabling/disabling sync shows what will be uploaded or remain remotely. Stop-sync and delete-cloud-copy are separate actions. Operating-system/disk protection is not equivalent to a UI lock; do not claim protection from an already compromised unlocked device.

## 25. Calendar provider writes and private-context isolation

Canonical events have ownership `sorta`, `outlook`, `google`, `school` or `import`. Provider identity/occurrence mappings and private overlays are separate. Similarity across providers yields a possible-duplicate proposal, not destructive automatic merging.

Read sync and writeback are separate. A selected owned calendar can receive reviewed or narrowly preauthorized minimal event content through the shared outbox. Private participant references are not provider attendees. Auto-created private events must not send invitations. Keep private loans, school performance, profile facts, prep and source excerpts out of serialized provider payloads.

Invitations, RSVP, shared-event changes and room/resource bookings require explicit per-action review of recipients, time, visibility, provider and public payload. Restore must not resend invitations automatically. This spec does not authorize general messaging or unrelated external writes.

Outbox state: pending, in-flight, delivery-unknown, acknowledged, rejected, cancelled. A local 201 only proves a record exists, not external delivery. On a lost response, reconcile with supported provider identities/idempotency before retrying. Maintain concurrency/version checks, notification subscription renewal, replay handling and safe rescan after expired cursors.

Structured change notifications are hints to reread/reconcile, not a complete ordered history. Each provider/resource needs its actual documented update strategy. Provider callbacks cannot authorize arbitrary data or worker commands.

## 26. Data model and canonical relationships

Extend the existing domain with the following canonical families. All applicable records carry owner/vault, stable ID, timestamps, mutable resource version, origin/evidence and deletion state. Do not use content or a display name as a primary key.

| Family | Records and relationships |
|---|---|
| Identity and storage | Owner/User, Vault, Device, Session, Token, preferences, credentials reference, Blob, Backup/Export manifest. |
| Sources and notes | Capture, Note/Document, canonical Yjs state, NoteRevision, SourceObject, SourceRevision, Attachment, ExtractionRevision, DocumentChunk, CitationAnchor, Transcript. |
| Organization | Label, membership, collection, routing rule, correction, relationship, typed Entity, alias, Idea, Project. Ideas/projects reuse entity identity. |
| Calendar and obligations | Calendar, CalendarEvent, series/exception/occurrence, provider mapping, private overlay, Commitment, binding, PrepItem. |
| Tasks and execution | Task, dependency, Reminder, Notification, StudySession, task/session progress and observed duration. |
| School | Subject, Course, Teacher reference to Person, Class/group reference, Lesson reference to calendar occurrence, Assignment, Assessment, Grade, AttendanceRecord, target. |
| Study | StudyPlan and units, StudyActivity, PracticeResponse, KnowledgeGap, FlashcardDeck/Card/Review and scheduler preferences. |
| Memory and profile | Memory, Goal/preference as typed memory/entity, Interest, InterestEvidence, PersonalDataItem, profile projection, insight. |
| Integration and operations | Connection/Integration, selected Resource, capability, cursor, SyncRecord, Job, outbox/subscription lease, sync tombstone, policy, Proposal, AIAction/Operation, feedback. |

Disambiguate **CalendarEvent** from the existing **VaultEvent** change-stream record. Preserve the existing `/events` SSE route and use `/calendar-events` for calendar resources. A task linked to an assignment is not the assignment itself. A grade is not a knowledge-gap estimate. A prep checkbox is not completion of a loan.

`EvidenceRef` identifies a vault, canonical source, immutable revision, and typed locator: note block/span, document page/region, audio interval or structured record field. Preserve observed/provider/authored times and field authority. Model IDs and ephemeral search ranks are not evidence identity.

`Memory`/`Interest` stores kind, value, explicit/inferred status, evidence, confidence semantics, first/last observed, owner correction and optional decay/suppression. `KnowledgeGap` links material/concept, observed responses and uncertainty. `StudySession` links one or more task/plan units, actual state transitions, active duration and explicit outcomes.

`SchedulePlan` is a versioned proposal over existing calendar/task records with immutable input revisions, constraints, candidate blocks, unscheduled effort and reason codes. It is not an independently authoritative calendar. `ConditionAST` remains finite: next compatible encounter, next class occurrence, before event, confirmed place and bounded boolean combinations.

School status transformations retain raw codes. Presence and excusal can be distinct; grade scales and official weights are source-specific. Use null/unknown rather than filling missing values with zero.

## 27. Engineering architecture and repository

Inspect the actual repository first. Preserve working features, data and unrelated user changes. Use the existing architecture unless a documented implementation blocker demands a limited change. This is an additive merge, not permission to rebuild everything in a different framework.

| Layer | Retained choice |
|---|---|
| UI | React, TypeScript, Vite and shared responsive components/PWA. |
| Windows | Tauri 2 with narrow Rust/native integration and packaged local service. |
| Editor | Tiptap open-source components and Yjs; source anchors and immutable revisions. |
| Calendar grid | Existing proposed FullCalendar Standard binding after license/compatibility verification; no paid premium dependency without approval. |
| Local data | SQLite, FTS5, version-pinned rebuildable sqlite-vec adapter, local original files. Renderer has no raw SQL. |
| Browser offline | IndexedDB cache and sync queue. |
| Cloud API | Node LTS, TypeScript, Fastify, schema-first domain contracts. |
| Cloud data | PostgreSQL + pgvector, explicit migrations, immutable blob storage. |
| Jobs | PostgreSQL jobs/outbox; offline SQLite queue. One durable job model. |
| AI | Shared worker and provider abstraction; required local Ollama; optional explicit cloud/local-compatible adapters. |
| Packaging | Windows installer, containerized hub/worker options, Compose, upgrade/backup/restore tooling. |

Use a modular monolith and shared packages, not dozens of microservices. Keep original apps `web`, `desktop`, `server`, `browser-extension`, `local-worker`, `mcp`. Add bounded packages/services for calendar, commitments, policy, entity resolution, school, study, scheduler, attendance/performance, memory/profile, integrations and insights alongside existing contracts/domain/editor/storage/retrieval/ai/ingestion/ui.

Provider-specific adapters normalize into shared domain types. Domain code does not depend on one scraping backend. The native renderer cannot access arbitrary SQL, paths or executables; local calls use validated authenticated IPC and the same contracts as cloud services.

Do not claim these component choices alone implement synchronization, security, accessibility or quality. Ship their application-level behavior and tests.

## 28. Synchronization, jobs, and source lifecycle

Persist local edits before acknowledgment. Use idempotent operation IDs, typed domain commands, outbox events and cursor acknowledgment. Yjs merges note bodies; structured calendar/task/school metadata uses expected revisions and explicit conflict handling. Do not put appointment times into unconstrained CRDT text fields.

WebSocket/SSE improve responsiveness but durable cursor pull/push/snapshot resync recovers missed events. Revoked devices cannot send writes. Tombstones and a purge ledger prevent old replicas from resurrecting deleted records. A new source version invalidates dependent projections without rewriting historical evidence.

Jobs use queued, waiting-for-worker, running, succeeded, failed, cancelled and superseded. Provide progress stage and real counts, not invented percentages. Inputs carry vault, revision/hash, model/prompt/chunker/policy version, priority and idempotency identity. Use expiring leases, heartbeat, bounded retry, cancellation and checkpoints. Delivery is at-least-once with idempotent effects; do not claim exactly-once execution.

Worker roles are allowlisted. A scheduler worker does not need AI, a source connector handles credentials, and a model worker sees authorized normalized input only. The hub cannot dispatch arbitrary scripts or source-selected binaries. Stale results cannot overwrite newer edits, policy changes or owner locks.

Purge immediately excludes affected data from new search/planning and invalidates/restricts chunks, vectors, memories, profile evidence, prep, cached answers and generated artifacts as appropriate. Unrelated confirmed events and user-authored notes do not disappear merely because a supporting source is removed. Explain affected dependencies in the purge preview.

Historical answers containing purged private excerpts follow redaction/invalidation policy. Backups expire on retention; offline/revoked devices and downloaded exports cannot be guaranteed erased remotely. Make those limits explicit.

## 29. API, native commands, and tool completeness

Appendix A is the consolidated operation inventory. It retains original notes/calendar identities and adds only the operations required by the merged modules. Its machine-readable companion is `omega-api-inventory.json`; the Markdown appendix is self-contained. Neither is an implemented OpenAPI document.

Produce explicit schemas in `packages/contracts`, actual OpenAPI 3.1 from implemented routes, generated clients and native/MCP/CLI/realtime schemas. No arbitrary unvalidated dictionaries. Contract shorthand is a design instruction to define concrete types, not a license for `any`.

All `/api/v1/vaults/{vaultId}` routes check individual-object ownership as well as collection scope. Local-only records are absent from cloud APIs. `owner_reauth` requires recent strong authentication; `job_lease` requires an enrolled worker and the exact unexpired job/input scope.

Common rules: secure session cookies/origin/CSRF checks; scoped revocable native/API tokens; closed owner bootstrap; tested passkey/recovery flow; cursor pagination and bounded ranges; payload depth/file/model budgets; input/response validation; rate limits; idempotency keys bound to actor/route/payload hash; and ETag/If-Match for revision-checked metadata. DELETE uses If-Match, not a mandatory request body. `revision_id` names historical evidence; `expected_revision` names mutable resource concurrency.

Use 201 only for durable creation, 202 only for an actually queued durable job, 204 for empty success and truthful errors. `JobHandle` includes job ID, current state and status/events/result links. Keep provider delivery separate from local persistence. `List<T>` is bounded items and an opaque next cursor.

Standard errors include type, title, status, stable code, safe detail, request ID, field errors and retry guidance. No secrets, raw provider errors or private snippets. Add clear codes for unknown time/identity, stale/access-revoked source, read-only imported data, missing consent/provider configuration, capacity shortfall, stale preview, unsupported recurrence, worker offline and delivery unknown.

One shared proposal flow accepts/rejects merges, profile changes, scheduler plans, source imports and external-action previews with operation-specific permission checks. One shared job lifecycle serves all modules. Shared search/chat supports typed record scopes. Shared export, backup and purge cover the expanded domain. Shared sync carries the added typed changes; no second notification bus or model job database.

Every operation needs success, invalid-input, authorization and persistence/read-consistency tests. Mutations additionally require idempotency/concurrency; jobs require cancel/retry/restart; external effects require lost-response reconciliation. CI compares the actual router and schemas with the inventory. An implementation-only helper can remain private; an additional public route must update the inventory and tests.

## 30. Security, privacy, export, and recovery

Treat documents, imported messages, web content, filenames and model output as untrusted. Policy and authorization enforce safety beyond prompt framing. Validate outputs before any action. A provider record cannot grant permission or reveal credentials to the model.

Use HTML sanitization, restrictive CSP, safe link/file rendering, parser sandboxes, fixed executable arguments, decompression/traversal limits and resource budgets. Public fetchers reject private/local/metadata addresses and unsafe schemes/ports, revalidate redirects/DNS and do not forward credentials to arbitrary origins. Separately approved private sources use scoped local adapters, not a public-fetch bypass.

Keep content out of ordinary logs. Allow evidence-linked audit records with bounded retention and owner inspection. No raw passwords, OAuth secrets, refresh tokens or cookies in model prompts, browser localStorage, exported documents or renderer bundles. Connector/worker egress follows configured destinations, not model-selected URLs.

Grades, attendance, personal interaction history and profile inference have granular consent and export controls. Provide connection inspection, manual sync, schedule changes, deletion, memory correction, suggestion rejection, cloud-AI disablement and automation disablement without losing manual functionality.

Exports include readable Markdown, originals, canonical document snapshots, metadata, relations, histories when selected and source mappings. Full-fidelity round-trip into a fresh vault must work with explicit ID remapping. Normal calendar exports omit private overlays; full private backups include them only within the selected encrypted backup scope.

Back up database and originals consistently with checksums, versions, manifest and recovery instructions. Use explicit encryption/recovery-secret handling. Indexes are rebuildable; original files and revision history are not. Preserve restore-job status outside a database being replaced, validate first, enter maintenance mode for replacement and retain recovery/rollback instructions.

Test restoration into a clean installation. Restored external outboxes start disabled until reauthorization/reconciliation, preventing duplicate invitations or writes. Show backup recency, verification and retention honestly. Installer/uninstaller preserves data unless removal is separately confirmed. An unsigned installer is not signed; a deployment recipe is not a running service.

## 31. Testing, evaluations, and production truthfulness

Appendix C retains the calendar acceptance cases and adds merged-product scenarios. The original notes requirements remain release gates. Tests must identify implementation, test path, environment, result and evidence; distinguish passed, failed, not run and externally blocked.

Cover durable save/restart; two-device offline notes and structured-event conflicts; idempotency; user locks; exact historical citations; unanswerable questions; stale jobs; unknown dates; DST and recurrence; identity mismatch; packed-versus-returned; private sidecar isolation; forbidden invitations; source injection; scoped tokens; provider pagination/replies/throttle/cursor expiration; sensitive imports; school snapshots; truthful profile trends; tutoring source scope; deterministic scheduler capacity/protected time; broken model output; backup/restore and purge.

Development fixtures are allowed only in an explicit isolated demo/test vault and environment, visibly marked and resettable. Do not seed production with a user's supposed grades, teacher messages, interests or timetable. An unavailable provider yields a capability explanation and working manual/import alternatives, not manufactured success.

Retain the previous notes evaluation targets as **targets, not results**: at least 200 varied notes, 100 labeled retrieval questions, held-out evaluation; auto-filing precision target 95% with coverage reported and a starting 70% coverage target on labeled unambiguous notes; Recall@10 target 90%; citation-resolution validity 100%; no unauthorized retrieval; no-answer abstention target 95%. Separately evaluate factual source support.

Expand fixtures to English/Norwegian typos, mixed-language school materials, date ambiguity, partial attendance data, grade scales, contradictory sources, source revisions, identity collisions, missed sessions, API failures and malicious source instructions. Benchmark actual model/runtime digests, hardware, warm/cold latency, memory and resource contention; never infer performance from parameter count.

Retain responsiveness targets on a documented test PC: local text save p95 below 200 ms, quick capture appearance below 500 ms, lexical search below 300 ms over 10,000 short notes. These exclude AI generation/large-file ingestion and are measurements Codex must report, not claims in this plan.

A feature is complete only when UI, persistence, real backend behavior, permissions, loading/empty/error/offline states, restart behavior, documented contracts and relevant tests work. A blocked live provider can coexist with a completed adapter/importer, but its live capability stays blocked/unverified. Core completion and live-integration verification are separate release dimensions.

## 32. Implementation order for Codex

These are delivery stages, not separate products or optional deletion of scope.

**Stage 0 — inspect and map.** Inspect the repository, current stack, schemas, authentication, AI, tests and user changes. Create a requirement/route/test matrix and implementation sequence. Reuse existing work. Document any actual blocker; do not restart framework selection.

**Stage 1 — durable shared core.** Finish capture/editor, original storage/history, tasks, manual calendar/recurrence, owner auth, cloud/Windows sync, lexical search and evidence identities. Prove restart and a second client. Start provider capability/authentication spikes early so school-consent blockers are discovered now.

**Stage 2 — librarian, RAG and calendar memory.** Real local model setup, ingestion, embeddings, hybrid retrieval, exact citations, classification/corrections, typed intent/date/entity extraction, commitments, private prep, policies, undo and source reprocessing. Prove both the positive book example and the Ember/Hanako negative case.

**Stage 3 — school and execution.** Canonical courses/lessons/assignments/assessments, manual/import grades and attendance, source-based catch-up, study plans/modes, deterministic scheduler, focus state, replanning and descriptive performance. Reuse existing calendar/tasks rather than duplicating them.

**Stage 4 — connected sources.** Complete declared Microsoft resources, Google Calendar, InSchool approved/import-only modes, files/web/audio adapters, source updates and external calendar outbox. Add personal-data official/export adapters and actually identified optional extraction bindings, with real capability reports. Institutional consent and provider registration stay explicit prerequisites.

**Stage 5 — memory and cross-domain assistance.** Inspectable memories/profile/interests, personal-data normalization, weekly sync/review, pattern-based estimates, People/Projects and command/tool interfaces. Keep optional cloud mode off unless enabled; demonstrate local-only boundaries.

**Stage 6 — production hardening.** Full API/native/tool conformance, failed/expired permission recovery, offline/stale-source/purge tests, accessibility and mobile, real Windows installer tests, cloud deployment artifacts, upgrade/backup/restore, real-model reports and authorized live-provider verification.

Within each stage deliver vertical slices, not screens with mock handlers. Continue implementable work when external credentials/approval are missing. Do not claim a feature is done solely because an interface or test fixture exists. Do not silently remove difficult requirements.

## 33. Required deliverables and Codex execution instructions

Codex must build the implementation in the authorized repository, not just produce another plan. Preserve unrelated changes. Do not purchase services, publish private material, enable accounts, send invitations or deploy publicly without actual authorization.

Deliver source code, lockfiles, migrations, concrete schemas/OpenAPI/client, Windows installer and private web deployment artifacts, configuration examples without secrets, required optional-runtime setup paths, backup/restore tooling, operation/feature/test traceability, actual evaluation and test reports, security/privacy notes, dependency/license inventory, operating instructions and exact external blockers.

Every included UI control calls working domain behavior or displays the actual permission/provider prerequisite. Optional providers have truthful disabled/not-configured states and verified adapters where possible, not “connected” demo data. Document formats, unsupported provider operations and measured limits clearly.

Do not end after scaffolding, static mockups, route stubs or a README. Work through the staged implementation and tests. When execution environment limits block native/live checks, state what was built, what was run and the exact remaining check; do not relabel unexecuted tests as passed.

The defining acceptance journey is:

> Capture a messy note offline on Windows; retrieve its exact source later from another client; turn a clear personal plan into a private calendar entry; attach the right prior promise without confusing people; ingest authorized school material; generate a material-grounded study plan around fixed and protected time; record real progress and catch-up needs; correct an inference; and recover the complete data in a clean installation.

## 34. Source provenance and coverage

The source set is the attached **Personal OS — AI-Powered Personal Operating System** (`Limte inn markdown(1).md`, 62 numbered sections), the existing **Sorta Notes + Calendar v2** package, and the retained notes/API foundation inside that package. This is a consolidation of their requirements, not independent confirmation of their external references.

Section 2 explicitly resolves changed scope and defaults. Appendix B maps every numbered section of the supplied Personal OS into this specification and maps the retained notes/calendar responsibilities. Appendix A consolidates existing operation identities and adds typed-module contracts. Appendix C carries forward acceptance scenarios and adds the new module tests.

The master document is self-contained. Older product exclusions or conflicting roadmap statements do not override it. Supporting JSON files are machine-readable versions/checks, not additional competing product specifications. The package does not contain application code or evidence of live account access.


---

## Appendix A. Consolidated endpoint and tool inventory

This appendix contains **356 planned HTTP/realtime operations**: 149 retained notes operations, 79 retained calendar operations, and 128 added operations for the merged modules. Counts describe design coverage, not implementation or passed tests. Existing operation IDs and method/path identities are preserved.

### A.1 Shared contract reuse

1. Existing proposal GET/accept/reject handles calendar mutations, identity merges, preparation plans, import mapping, provider-action previews and disconnect previews; add discriminated schemas and operation-specific authorization.
2. Existing job status/events/cancel/retry serves all extraction, matching, imports and provider jobs. Retry of provider sends requires reconciliation and safe idempotency.
3. Existing note capture/edit/import endpoints emit source-change events after durable commit; calendar extraction uses the canonical write path.
4. Existing task/reminder/notification endpoints gain event/occurrence/commitment references; they do not create second independent task or notification stores.
5. Existing search/chat routes add bounded calendar/source-object/commitment filters and source anchors, with proposed actions separate from assistant text.
6. Existing device sync handles typed calendar, commitment, alias, policy and tombstone commands with revision conflict checks; note body CRDT is unchanged.
7. Existing attachment/file export/download permissions serve source objects and ICS exports; private context is excluded unless explicitly chosen in an approved full backup.
8. Existing backup/restore includes source revisions, calendar/commitment/outbox data, and connection configuration with credential handling. Restores start provider sends disabled until reauthorization/reconciliation.
9. School lessons reference canonical calendar events; assignments reference provider sources and local preparation tasks. No second schedule/task store.
10. Shared entities also identify people, teachers, ideas/projects and optional group/course references; original calendar-entity route names remain compatible.
11. Shared sources/chunks/citations support school fields, transcripts, personal observations, memory evidence and study activity provenance with source-specific access checks.
12. Shared proposals apply scheduler plans, catch-up, idea promotion and profile changes. Actual external writes still need kind-specific consent.
13. Shared connections, capabilities, selection, schedules, job status, imports and disconnect handle Microsoft, Google, InSchool, personal-data, transcript, extractor and optional AI providers.
14. Shared task endpoints gain estimate/remaining effort, dependency, project/course/assessment, event/session and source-owned reference variants.
15. Shared preferences/sync/jobs/audit/notifications/export/purge include the additional domains, with sensitive domain grants and local-only boundaries.
16. Cloud AI remains opt-in, per-vault/purpose, independently configured from sync. Model/backend labels and job receipts always disclose actual backend; no automatic fallback.

### A.2 Added schema minimums

All record variants require concrete types, limits, enums and documented errors during implementation. These field-level minimums supplement the main specification and per-operation contracts; they are not an executable OpenAPI schema.

**`UnifiedSearchScope`:** Closed filters over record kinds, IDs, authorized vault/course/project/container, dates, source origin and generated/original state; enforce intersection with caller grants.

**`EvidenceRef`:** vault_id, source_kind, source_id, immutable revision_id, typed block/span/page/region/time/field locator, observed/authored time and access state; no model-invented link.

**`SchoolRecordBase`:** id, vault_id, revision, origin: manual|provider|import_snapshot, source_refs, created_at, updated_at, archived_at?, freshness; provider-owned fields cannot be edited by local CRUD.

**`Subject`:** SchoolRecordBase + name, code?, academic_period?, linked_course_ids.

**`Course`:** SchoolRecordBase + name, subject_id, academic_period?, teacher_entity_ids, class_entity_ids.

**`SchoolLesson`:** SchoolRecordBase + course_id, canonical calendar_event/occurrence reference, room and source field mappings; timetable data must not diverge.

**`SchoolAssignment`:** SchoolRecordBase + course_id, title, instructions, material_refs, due: DueSpec?, applicable_student, provider_status?, local_preparation_task_ids.

**`Assessment`:** SchoolRecordBase + course_id, title, kind: test|exam|assessment, TimeSpec, material_scope, optional source-supplied weight.

**`AttendanceRecord`:** SchoolRecordBase + owner/student, course_id, lesson_id?, date, TimeSpec?, raw_status, normalized_status, excusal_status?, duration?, units?, source record identity; unknown is not present.

**`Grade`:** SchoolRecordBase + course_id, assessment_id?, original grade_value, declared scale, date, optional official_weight, source field references; no automatic official prediction.

**`PerformanceTarget`:** id, course_id, target_value, declared scale, effective_period?, revision, owner origin.

**`StudyPlan`:** id, vault_id, revision, course/assessment/task refs, goals, actual material_scope/revisions, deadline/evidence, units, estimates, status, progress, schedule_proposal_ids, stale_sources.

**`StudySession`:** id, revision, plan/unit/task/material/event links, state: planned|active|paused|interrupted|completed|skipped, estimate, active_time_segments, explicit outcome, actual progress, source snapshots.

**`StudyActivity`:** id, revision, mode, allowed material_scope, generated artifact/source refs, activity items and rubric where applicable, state, response refs; mode is a closed enum.

**`PracticeResponse`:** idempotent response_id, activity/item/version, owner answer, active elapsed time if observed, saved_at, grading state, model-feedback/source refs, owner corrections; model grade is nonofficial.

**`KnowledgeGap`:** id, revision, course/concept/material refs, evidence refs, origin: owner_report|teacher_feedback|practice_inference, status, uncertainty, correction/suppression.

**`FlashcardDeck`:** id, revision, name, course_id?, material_scope?, state, created/updated/archived timestamps.

**`Flashcard`:** id, revision, deck_id, prompt, answer, source_refs, original/generated origin, approved/stale/archived state, review policy version, next_due projection.

**`FlashcardReview`:** id, response_id, card/revision, rating from declared bounded scale, observed time, optional active duration, review policy version, computed next_due.

**`SchedulerPreferences`:** revision, timezone, protected/fixed windows, break/daily limits, block split bounds, preferred periods, algorithm/version and explicit replanning policy; no arbitrary executable predicates.

**`SchedulePlan`:** Proposal payload: immutable input revisions, algorithm/constraints versions, candidate local calendar commands, capacity shortfall, uncertain windows, reason codes and undo dependencies.

**`Memory`:** id, revision, kind, value, entity refs, origin, explicit/inferred/recommended status, EvidenceRef[], confidence semantics, owner locks, suppression/decay, timestamps.

**`Interest`:** id, revision, label, origin/status, observation refs, computed metrics with windows/denominator, confidence semantics, decay, owner correction/suppression.

**`PersonalDataItem`:** id, revision, provider/account/container/object identity, actual action type, resource ref/URL, authored/observed/import times, content hash, bounded provider metadata and access/retention state.

**`PersonalDataPolicies`:** revision, enabled providers/resources/analysis types, weekly/daily/manual schedule in timezone, retention, privacy mode and explicit consent records; not authentication secrets.

**`AIInsight`:** id, revision, kind, window, source manifest, coverage metrics, generated content, limitations, model/prompt versions, freshness, feedback and separate owner annotations.

**`Project`:** typed shared Entity/Label identity, revision, name, linked ideas/notes/goals/tasks/events, status and generated brief projection; no duplicate project-label source of truth.

**`Idea`:** typed shared Entity identity, revision, title, canonical note/source refs, related ideas/project memberships, status and promotion ancestry.

**`Transcript`:** canonical SourceObject/extraction revision, original blob ref, timestamped segments, speaker IDs/unknown labels, lesson association/evidence, corrections and analysis artifact refs.

**`VaultAiPolicy`:** revision, local/optional-cloud backend IDs, enabled purposes, per-job/monthly budgets where relevant, source eligibility, consent/disclosure version, no-fallback default.

**`ToolDescriptor`:** allowlisted name/version/domain, closed input/output schema refs, effect class read|propose|write, required grants, capability/readiness, budget and audit contract.

**`CommandContext`:** bounded current note/event/course/session/project IDs plus explicit authorized scope; no serialized credentials or arbitrary system prompts.

### A.3 Operations

Common tests for every operation: success, schema/invalid-input validation, owner/vault/domain authorization, and durable effect or read consistency. Add revision/idempotency/restart tests for mutations; lifecycle tests for jobs; actual callback/outbox/reconciliation tests for providers. Do not interpret a read route as permission to expose all linked sensitive domains.

#### Identity and installation

**N001 · `GET /health/live` — `healthLive`**

Access: `public`. Success: `200`.

Request: `none`

Response: `Health {status: ok}`

Process liveness only; no versions, keys, topology, or account details.

**N002 · `GET /health/ready` — `healthReady`**

Access: `public`. Success: `200`.

Request: `none`

Response: `Health {status: ready}`

503 when required persistence is unavailable; no internal diagnostics.

**N003 · `GET /api/v1/meta` — `getMeta`**

Access: `public`. Success: `200`.

Request: `none`

Response: `Meta {api_version, client_min_version, schema_version}`

Return supported protocol versions, not private vault configuration.

**N004 · `POST /api/v1/auth/bootstrap/options` — `bootstrapOptions`**

Access: `one_time_bootstrap_secret`. Success: `200`.

Request: `{bootstrap_secret, owner_label}`

Response: `WebAuthnRegistrationOptions {challenge_id, public_key_options, expires_at}`

Only before owner initialization; rate limit; persist challenge.

**N005 · `POST /api/v1/auth/bootstrap/verify` — `bootstrapVerify`**

Access: `bootstrap_challenge`. Success: `201`.

Request: `{challenge_id, credential: WebAuthnRegistrationResponse}`

Response: `BootstrapResult {owner, recovery_codes_once, session}`

Atomically consume bootstrap secret/challenge; establish closed owner account and secure cookie.

**N006 · `POST /api/v1/auth/login/options` — `loginOptions`**

Access: `public_rate_limited`. Success: `200`.

Request: `none`

Response: `WebAuthnAuthenticationOptions {challenge_id, public_key_options, expires_at}`

Short-lived, origin/RP-bound challenge; do not disclose private content.

**N007 · `POST /api/v1/auth/login/verify` — `loginVerify`**

Access: `login_challenge`. Success: `200`.

Request: `{challenge_id, credential: WebAuthnAuthenticationResponse}`

Response: `Session {id, owner_id, expires_at, auth_level}`

Verify challenge/origin/RP; set secure cookie; consume challenge once.

**N008 · `GET /api/v1/auth/session` — `getSession`**

Access: `session`. Success: `200`.

Request: `none`

Response: `Session`

Return current session or 401, never a fabricated anonymous owner.

**N009 · `POST /api/v1/auth/logout` — `logout`**

Access: `session`. Success: `204`.

Request: `none`

Response: `empty`

Revoke session and clear cookie; idempotent.

**N010 · `POST /api/v1/auth/recovery` — `recoverAccount`**

Access: `recovery_code_rate_limited`. Success: `200`.

Request: `{recovery_code}`

Response: `RecoverySession {id, expires_at, allowed_actions}`

Consume a hashed recovery code once; restricted session permits replacing passkeys, not immediately exporting all data.

**N011 · `GET /api/v1/auth/passkeys` — `listPasskeys`**

Access: `owner`. Success: `200`.

Request: `none`

Response: `List<PasskeySummary>`

Never return private key material.

**N012 · `POST /api/v1/auth/passkeys/options` — `passkeyOptions`**

Access: `owner_reauth_or_recovery`. Success: `200`.

Request: `{label}`

Response: `WebAuthnRegistrationOptions`

Explicit account recovery or recent strong authentication required.

**N013 · `POST /api/v1/auth/passkeys/verify` — `passkeyVerify`**

Access: `owner_reauth_or_recovery`. Success: `201`.

Request: `{challenge_id, credential: WebAuthnRegistrationResponse}`

Response: `PasskeySummary`

Verify and register; recovery flow revokes previous recovery session and follows documented session policy.

**N014 · `DELETE /api/v1/auth/passkeys/{passkeyId}` — `deletePasskey`**

Access: `owner_reauth`. Success: `204`.

Request: `none`

Response: `empty`

Prevent removing the last viable sign-in/recovery path.

**N015 · `POST /api/v1/auth/recovery-codes/rotate` — `rotateRecoveryCodes`**

Access: `owner_reauth`. Success: `200`.

Request: `none`

Response: `RecoveryCodes {codes_once: string[]}`

Invalidate old codes; store new hashes only; never log plaintext codes.

**N016 · `GET /api/v1/auth/sessions` — `listSessions`**

Access: `owner`. Success: `200`.

Request: `none`

Response: `List<SessionSummary>`

Include current-device marker and last activity without secrets.

**N017 · `DELETE /api/v1/auth/sessions/{sessionId}` — `revokeSession`**

Access: `owner`. Success: `204`.

Request: `none`

Response: `empty`

Revoke targeted session, including active event streams.

**N018 · `POST /api/v1/auth/token/refresh` — `refreshNativeToken`**

Access: `native_refresh_token`. Success: `200`.

Request: `{refresh_token}`

Response: `TokenPair {access_token, refresh_token, expires_at}`

Rotate refresh tokens; detect replay; no browser localStorage token flow.

#### Devices and API access

**N019 · `POST /api/v1/device-pairings` — `createPairing`**

Access: `public_rate_limited`. Success: `201`.

Request: `{device_name, requested_role: client|worker, client_public_key?}`

Response: `PairingChallenge {pairing_id, device_code_once, user_code, expires_at}`

No data access until approved from an authenticated owner session.

**N020 · `POST /api/v1/device-pairings/{pairingId}/approve` — `approvePairing`**

Access: `owner_reauth`. Success: `200`.

Request: `{user_code, vault_ids, scopes, approved_role}`

Response: `PairingApproval {status, expires_at}`

Approve exact device and scope; worker scope cannot exceed owner scope.

**N021 · `POST /api/v1/device-pairings/{pairingId}/exchange` — `exchangePairing`**

Access: `pairing_device_secret`. Success: `[200, 202]`.

Request: `{device_code}`

Response: `TokenPair or PairingPending {status, retry_after_seconds}`

One-time exchange; pending/expired are explicit; never mint token on failed approval.

**N022 · `GET /api/v1/devices` — `listDevices`**

Access: `owner`. Success: `200`.

Request: `none`

Response: `List<DeviceSummary>`

List authorized devices, scope, role, status, last seen.

**N023 · `DELETE /api/v1/devices/{deviceId}` — `revokeDevice`**

Access: `owner_reauth`. Success: `204`.

Request: `none`

Response: `empty`

Revoke tokens, worker claims, streams, and future synchronization; do not promise remote deletion of cached files.

**N024 · `GET /api/v1/tokens` — `listApiTokens`**

Access: `owner`. Success: `200`.

Request: `none`

Response: `List<ApiTokenSummary>`

List labels/scopes/expiry without token secrets.

**N025 · `POST /api/v1/tokens` — `createApiToken`**

Access: `owner_reauth`. Success: `201`.

Request: `{label, vault_ids, scopes, expires_at}`

Response: `ApiTokenCreated {id, secret_once, scopes, expires_at}`

No wildcard permission by default; hash stored token; show secret once.

**N026 · `DELETE /api/v1/tokens/{tokenId}` — `revokeApiToken`**

Access: `owner`. Success: `204`.

Request: `none`

Response: `empty`

Immediate revocation of future requests and relevant streams.

#### Vaults, preferences and status

**N027 · `GET /api/v1/vaults` — `listVaults`**

Access: `owner_or_scoped_client`. Success: `200`.

Request: `none`

Response: `List<VaultSummary>`

Cloud API lists only cloud-authorized vaults; local-only vaults never register here.

**N028 · `POST /api/v1/vaults` — `createVault`**

Access: `owner`. Success: `201`.

Request: `{name, locale, timezone}`

Response: `Vault`

Explicitly creates a cloud vault; desktop local vault creation is native/local.

**N029 · `GET /api/v1/vaults/{vaultId}` — `getVault`**

Access: `vault:read`. Success: `200`.

Request: `none`

Response: `Vault`

Check vault ownership before returning metadata.

**N030 · `PATCH /api/v1/vaults/{vaultId}` — `updateVault`**

Access: `vault:write`. Success: `200`.

Request: `{name?, locale?, timezone?, expected_revision}`

Response: `Vault`

Changing sync/privacy mode is not an implicit metadata patch.

**N031 · `POST /api/v1/vaults/{vaultId}/purge` — `purgeVault`**

Access: `owner_reauth`. Success: `202`.

Request: `{confirmation: PurgeConfirmation, expected_revision}`

Response: `JobHandle`

Explicit destructive operation; purge derived data/tombstone IDs and revoke active jobs.

**N032 · `GET /api/v1/preferences` — `getPreferences`**

Access: `owner`. Success: `200`.

Request: `none`

Response: `Preferences`

Versioned, bounded settings schema.

**N033 · `PATCH /api/v1/preferences` — `updatePreferences`**

Access: `owner`. Success: `200`.

Request: `PreferencesPatch + expected_revision`

Response: `Preferences`

Validate locale/timezone/notification choices; no arbitrary endpoints or executable settings.

**N034 · `GET /api/v1/status` — `getStatus`**

Access: `owner`. Success: `200`.

Request: `none`

Response: `SystemStatus {storage, sync, workers, backup, versions}`

Operational diagnostics only; no prompts, tokens, or stack traces.

**N035 · `GET /api/v1/vaults/{vaultId}/today` — `getToday`**

Access: `owner_vault or intersected module read grants`. Success: `200`.

Request: `{date?: ISO-date, timezone?: IANA-zone}`

Response: `TodayView {next_action?, schedule, prep, tasks, recent_notes, resurfacing, project_briefs, school_summary?, performance_summary?, attendance_summary?, insights?, freshness, omitted_scopes}`

Read-only shared projection across enabled/authorized modules; omit ungranted sensitive domains explicitly. No unexpected generation, profile inference or schedule mutation.

#### Capture and notes

**N036 · `POST /api/v1/vaults/{vaultId}/captures` — `createCapture`**

Access: `capture:write`. Success: `201`.

Request: `{client_capture_id, kind, text?, rich_text?, blob_ids?, source?: SourceMetadata}`

Response: `CaptureReceipt {capture_id, note_id, revision_id, processing_jobs}`

Save original and note before returning; idempotency key prevents duplicate retries.

**N037 · `GET /api/v1/vaults/{vaultId}/captures/{captureId}` — `getCapture`**

Access: `notes:read`. Success: `200`.

Request: `none`

Response: `Capture {id, note_id, original, source, stages}`

Return immutable original and actual per-stage status; attached bodies use authorized blob reads.

**N038 · `POST /api/v1/vaults/{vaultId}/url-captures` — `createUrlCapture`**

Access: `capture:write`. Success: `202`.

Request: `{url, fetch_consent: true, selected_text?, title?}`

Response: `JobHandle`

Explicit safe fetch; private-network redirects/SSRF blocked; resulting capture preserves source URL.

**N039 · `GET /api/v1/vaults/{vaultId}/notes` — `listNotes`**

Access: `notes:read`. Success: `200`.

Request: `{cursor?, limit?, filters?: NoteFilters, sort?}`

Response: `List<NoteSummary>`

Bounded filters and pagination; exclude trash by default; include unsorted notes.

**N040 · `POST /api/v1/vaults/{vaultId}/notes` — `createNote`**

Access: `notes:write`. Success: `201`.

Request: `{id?, title?, content: InitialContent, provenance?}`

Response: `Note`

Create canonical editor document and first revision atomically.

**N041 · `GET /api/v1/vaults/{vaultId}/notes/{noteId}` — `getNote`**

Access: `notes:read`. Success: `200`.

Request: `none`

Response: `Note`

Canonical metadata plus authorized current-document reference; no unrestricted blob URLs.

**N042 · `PATCH /api/v1/vaults/{vaultId}/notes/{noteId}` — `updateNoteMetadata`**

Access: `notes:write`. Success: `200`.

Request: `{title?, pinned?, archived?, user_locks?, expected_revision}`

Response: `Note`

Metadata only; no competing editable body field; preserve AI/user provenance.

**N043 · `DELETE /api/v1/vaults/{vaultId}/notes/{noteId}` — `trashNote`**

Access: `notes:write`. Success: `204`.

Request: `{expected_revision}`

Response: `empty`

Soft-delete with tombstone/event; immediately exclude from new retrieval.

**N044 · `POST /api/v1/vaults/{vaultId}/notes/{noteId}/restore` — `restoreTrashedNote`**

Access: `notes:write`. Success: `200`.

Request: `{expected_revision}`

Response: `Note`

Explicitly restore recoverable trash, never a permanently purged ID.

**N045 · `POST /api/v1/vaults/{vaultId}/notes/{noteId}/purge` — `purgeNote`**

Access: `owner_reauth`. Success: `202`.

Request: `{confirmation: PurgeConfirmation, expected_revision}`

Response: `JobHandle`

Purge note-derived caches and quotes under policy; retain minimal deletion ledger.

**N046 · `GET /api/v1/vaults/{vaultId}/notes/{noteId}/document` — `getNoteDocument`**

Access: `notes:read`. Success: `200`.

Request: `{format: editor_json|markdown|text, revision_id?}`

Response: `DocumentRepresentation {format, content, revision_id, source_map}`

Render from canonical document state; historical reads recheck current access.

**N047 · `POST /api/v1/vaults/{vaultId}/notes/{noteId}/edits` — `editNote`**

Access: `notes:write`. Success: `201`.

Request: `{expected_revision, edit: AppendMarkdown|ReplaceRange|ReplaceDocument}`

Response: `NoteRevision`

External edits create canonical Yjs transactions and snapshots; unsafe stale replacements rejected.

**N048 · `GET /api/v1/vaults/{vaultId}/notes/{noteId}/revisions` — `listNoteRevisions`**

Access: `notes:read`. Success: `200`.

Request: `{cursor?, limit?}`

Response: `List<RevisionSummary>`

Show user/machine provenance and immutable source identity.

**N049 · `GET /api/v1/vaults/{vaultId}/notes/{noteId}/revisions/{revisionId}` — `getNoteRevision`**

Access: `notes:read`. Success: `200`.

Request: `none`

Response: `NoteRevision`

Return exact historical representation or explicit unavailable result, not latest content.

**N050 · `POST /api/v1/vaults/{vaultId}/notes/{noteId}/revisions/{revisionId}/restore` — `restoreNoteRevision`**

Access: `notes:write`. Success: `201`.

Request: `{expected_current_revision}`

Response: `NoteRevision`

Create a new revision from history; do not rewrite the old revision.

**N051 · `GET /api/v1/vaults/{vaultId}/notes/{noteId}/related` — `getRelatedNotes`**

Access: `notes:read`. Success: `200`.

Request: `{limit?}`

Response: `RelatedResult {explicit_links, suggested_links}`

Clearly distinguish similarity suggestions from confirmed semantic relationships.

**N052 · `POST /api/v1/vaults/{vaultId}/notes/{noteId}/reprocess` — `reprocessNote`**

Access: `ai:run`. Success: `202`.

Request: `{stages: ProcessingStage[], expected_revision}`

Response: `JobHandle`

Run only named stages; respect locks and model policy; no silent duplicate generation.

#### Uploads and original files

**N053 · `POST /api/v1/vaults/{vaultId}/uploads` — `createUpload`**

Access: `capture:write`. Success: `201`.

Request: `{filename, media_type, byte_length, sha256}`

Response: `UploadSession {upload_id, part_size, expires_at}`

Bound total size/type; filename is metadata, never a server path.

**N054 · `PUT /api/v1/vaults/{vaultId}/uploads/{uploadId}/parts/{partNumber}` — `putUploadPart`**

Access: `capture:write`. Success: `204`.

Request: `binary bytes; Content-Range and part SHA256`

Response: `empty`

Idempotent numbered parts; reject mismatched length/hash/overlap.

**N055 · `POST /api/v1/vaults/{vaultId}/uploads/{uploadId}/complete` — `completeUpload`**

Access: `capture:write`. Success: `201`.

Request: `{sha256, part_count}`

Response: `BlobSummary`

Verify assembled length/hash and type; atomically finalize immutable blob.

**N056 · `DELETE /api/v1/vaults/{vaultId}/uploads/{uploadId}` — `cancelUpload`**

Access: `capture:write`. Success: `204`.

Request: `none`

Response: `empty`

Clean temporary parts; cancellation does not erase unrelated completed blobs.

**N057 · `GET /api/v1/vaults/{vaultId}/blobs/{blobId}` — `getBlobMetadata`**

Access: `notes:read`. Success: `200`.

Request: `none`

Response: `BlobSummary`

Known content hash is not authorization.

**N058 · `GET /api/v1/vaults/{vaultId}/blobs/{blobId}/content` — `getBlobContent`**

Access: `notes:read_or_job_scoped_worker`. Success: `200`.

Request: `{download?: boolean}; Range header supported`

Response: `binary bytes with safe content headers`

Recheck ownership/job scope; safe disposition; no active HTML execution.

#### Organization and collections

**N059 · `GET /api/v1/vaults/{vaultId}/labels` — `listLabels`**

Access: `notes:read`. Success: `200`.

Request: `{kind?: area|project|topic|entity, cursor?, limit?}`

Response: `List<Label>`

Return stable IDs, aliases, provisional/confirmed status, and supported-note count.

**N060 · `POST /api/v1/vaults/{vaultId}/labels` — `createLabel`**

Access: `notes:write`. Success: `201`.

Request: `{kind, name, aliases?, parent_id?}`

Response: `Label`

Validate kind, duplicates, parent cycles, and sidebar limits.

**N061 · `PATCH /api/v1/vaults/{vaultId}/labels/{labelId}` — `updateLabel`**

Access: `notes:write`. Success: `200`.

Request: `{name?, aliases?, parent_id?, pinned?, expected_revision}`

Response: `Label`

Explicit owner edit; conflicting changes use revision checks.

**N062 · `DELETE /api/v1/vaults/{vaultId}/labels/{labelId}` — `deleteLabel`**

Access: `notes:write`. Success: `204`.

Request: `{expected_revision, remove_associations: true}`

Response: `empty`

Remove category associations, not notes; log undoable operation.

**N063 · `PUT /api/v1/vaults/{vaultId}/notes/{noteId}/labels` — `setNoteLabels`**

Access: `notes:write`. Success: `200`.

Request: `{label_ids, locked_label_ids, expected_revision}`

Response: `NoteOrganization`

User associations override later classification; validate all IDs in this vault.

**N064 · `POST /api/v1/vaults/{vaultId}/notes/{noteId}/corrections` — `correctOrganization`**

Access: `notes:write`. Success: `201`.

Request: `{expected_revision, remove_label_ids?, add_label_ids?, reason?, lock: boolean}`

Response: `CorrectionReceipt`

Persist scoped correction and updated associations; do not silently create global routing rules.

**N065 · `GET /api/v1/vaults/{vaultId}/relationships` — `listRelationships`**

Access: `notes:read`. Success: `200`.

Request: `{note_id?, kind?, cursor?, limit?}`

Response: `List<Relationship>`

Evidence-backed suggestions marked unconfirmed.

**N066 · `POST /api/v1/vaults/{vaultId}/relationships` — `createRelationship`**

Access: `notes:write`. Success: `201`.

Request: `{from_note_id, to_note_id, kind, evidence_anchor_ids?}`

Response: `Relationship`

Both source notes must belong to authorized vault; explicit links marked user-authored.

**N067 · `DELETE /api/v1/vaults/{vaultId}/relationships/{relationshipId}` — `deleteRelationship`**

Access: `notes:write`. Success: `204`.

Request: `{expected_revision}`

Response: `empty`

Remove relationship only, preserving source notes.

**N068 · `GET /api/v1/vaults/{vaultId}/collections` — `listCollections`**

Access: `notes:read`. Success: `200`.

Request: `{cursor?, limit?}`

Response: `List<Collection>`

Include system views and user-saved typed filters.

**N069 · `POST /api/v1/vaults/{vaultId}/collections` — `createCollection`**

Access: `notes:write`. Success: `201`.

Request: `{name, filter: NoteFilterAST, sort, view}`

Response: `Collection`

Validate finite filter AST; no executable query strings.

**N070 · `PATCH /api/v1/vaults/{vaultId}/collections/{collectionId}` — `updateCollection`**

Access: `notes:write`. Success: `200`.

Request: `{name?, filter?, sort?, view?, expected_revision}`

Response: `Collection`

Version and validate filters; system views have documented editable fields.

**N071 · `DELETE /api/v1/vaults/{vaultId}/collections/{collectionId}` — `deleteCollection`**

Access: `notes:write`. Success: `204`.

Request: `{expected_revision}`

Response: `empty`

Remove saved view without deleting its notes.

**N072 · `GET /api/v1/vaults/{vaultId}/collections/{collectionId}/items` — `getCollectionItems`**

Access: `notes:read`. Success: `200`.

Request: `{cursor?, limit?}`

Response: `List<NoteSummary>`

Evaluate authorized query and return actual notes, not a stale mock count.

**N073 · `GET /api/v1/vaults/{vaultId}/rules` — `listRoutingRules`**

Access: `notes:read`. Success: `200`.

Request: `{cursor?, limit?}`

Response: `List<RoutingRule>`

Expose priority, match conditions, destinations, provenance and enabled state.

**N074 · `POST /api/v1/vaults/{vaultId}/rules` — `createRoutingRule`**

Access: `notes:write`. Success: `201`.

Request: `{name, condition: RoutingConditionAST, target_label_ids, enabled}`

Response: `RoutingRule`

Finite declarative matches; validate target IDs and initial affected-note preview.

**N075 · `PATCH /api/v1/vaults/{vaultId}/rules/{ruleId}` — `updateRoutingRule`**

Access: `notes:write`. Success: `200`.

Request: `{condition?, target_label_ids?, enabled?, expected_revision}`

Response: `RoutingRule`

User confirmation for a broadened rule; no arbitrary code.

**N076 · `DELETE /api/v1/vaults/{vaultId}/rules/{ruleId}` — `deleteRoutingRule`**

Access: `notes:write`. Success: `204`.

Request: `{expected_revision}`

Response: `empty`

Stop future application; do not silently reverse historical user choices.

**N077 · `POST /api/v1/vaults/{vaultId}/rules/preview` — `previewRoutingRule`**

Access: `notes:read`. Success: `200`.

Request: `{condition: RoutingConditionAST, target_label_ids, sample_limit}`

Response: `RulePreview {affected_count, sample_note_ids, conflicts}`

Bounded read-only preview; no filing mutation.

#### AI proposals and audit

**N078 · `GET /api/v1/vaults/{vaultId}/proposals` — `listProposals`**

Access: `owner_vault or proposal-kind-specific grants`. Success: `200`.

Request: `{status?, kind?, cursor?, limit?}`

Response: `List<Proposal>`

No review requirement for all notes; only meaningful suggestions. Apply per-kind evidence/privacy and domain permissions; the original notes grant alone cannot authorize calendar invites or access grade/profile data.

**N079 · `POST /api/v1/vaults/{vaultId}/proposals` — `createProposal`**

Access: `proposal:create plus kind-specific source/domain grants`. Success: `201`.

Request: `{kind: ProposalKind, inputs: discriminated ProposalInput, expected_revisions}`

Response: `Proposal`

Persist a concrete diff and evidence preview without applying. Closed variants include original note/label merges, calendar mutations, entity merges, provider actions, imports, study/scheduler plans, memory/profile proposals and idea promotion. Receiving a proposal does not grant permission to accept it.

**N080 · `GET /api/v1/vaults/{vaultId}/proposals/{proposalId}` — `getProposal`**

Access: `owner_vault or proposal-kind-specific grants`. Success: `200`.

Request: `none`

Response: `Proposal`

Return the exact typed diff, affected record IDs across authorized modules, stale state and evidence. Apply per-kind evidence/privacy and domain permissions; a notes grant alone cannot authorize invitations or grade/profile access.

**N081 · `POST /api/v1/vaults/{vaultId}/proposals/{proposalId}/accept` — `acceptProposal`**

Access: `owner_vault or proposal-kind-specific grants`. Success: `202`.

Request: `{expected_proposal_revision, confirmation}`

Response: `JobHandle`

Apply validated plan transactionally or through idempotent batch with undo log; reject stale plans. Apply per-kind evidence/privacy and domain permissions; the original notes grant alone cannot authorize calendar invites or access grade/profile data.

**N082 · `POST /api/v1/vaults/{vaultId}/proposals/{proposalId}/reject` — `rejectProposal`**

Access: `owner_vault or proposal-kind-specific grants`. Success: `200`.

Request: `{expected_proposal_revision, reason?}`

Response: `Proposal`

Persist dismissal and avoid repeated identical suggestions. Apply per-kind evidence/privacy and domain permissions; the original notes grant alone cannot authorize calendar invites or access grade/profile data.

**N083 · `GET /api/v1/vaults/{vaultId}/ai-operations` — `listAiOperations`**

Access: `notes:read`. Success: `200`.

Request: `{note_id?, cursor?, limit?}`

Response: `List<AiOperation>`

Expose source revision, model digest, prompt version and changes; no hidden reasoning trace.

**N084 · `GET /api/v1/vaults/{vaultId}/ai-operations/{operationId}` — `getAiOperation`**

Access: `notes:read`. Success: `200`.

Request: `none`

Response: `AiOperation`

Detailed reversible metadata diff and evidence.

**N085 · `POST /api/v1/vaults/{vaultId}/ai-operations/{operationId}/undo` — `undoAiOperation`**

Access: `notes:write`. Success: `200`.

Request: `{expected_current_revisions}`

Response: `UndoReceipt`

Apply safe inverse; conflict if subsequent user edits would be overwritten.

**N086 · `GET /api/v1/vaults/{vaultId}/activity` — `getActivity`**

Access: `notes:read`. Success: `200`.

Request: `{note_id?, cursor?, limit?}`

Response: `List<ActivityEvent>`

Redacted, authorized event log; never leak another vault through IDs or messages.

#### Search, chat and source navigation

**N087 · `POST /api/v1/vaults/{vaultId}/search` — `searchNotes`**

Access: `search:read`. Success: `[200, 202]`.

Request: `{query, mode: lexical|hybrid|semantic, scope: UnifiedSearchScope, limit, cursor?}`

Response: `UnifiedSearchResult for lexical; JobHandle with UnifiedSearchResult for model-dependent search`

Search authorized notes, source objects, tasks, events, commitments, school, projects, memories and opted-in personal data with typed filters. Lexical retrieval is synchronous; semantic/hybrid jobs use the explicitly allowed backend and expose unavailable AI. Never broaden scopes or switch to cloud silently.

**N088 · `GET /api/v1/vaults/{vaultId}/search/suggestions` — `suggestSearch`**

Access: `search:read`. Success: `200`.

Request: `{prefix, limit?}`

Response: `SearchSuggestions {labels, titles, saved_queries}`

Cheap authorized lexical/metadata suggestions; never needs generation.

**N089 · `GET /api/v1/vaults/{vaultId}/citations/{citationId}` — `resolveCitation`**

Access: `notes:read`. Success: `200`.

Request: `none`

Response: `ResolvedCitation {source, revision, anchor, exact_excerpt, current_note_link, historical}`

Open exact evidence; distinguish unavailable/purged source from current revision; all access rechecked.

**N090 · `GET /api/v1/vaults/{vaultId}/chats` — `listChats`**

Access: `notes:read`. Success: `200`.

Request: `{cursor?, limit?}`

Response: `List<ChatSummary>`

Only authorized vault chats.

**N091 · `POST /api/v1/vaults/{vaultId}/chats` — `createChat`**

Access: `ask:run`. Success: `201`.

Request: `{title?, default_scope: SearchScope}`

Response: `Chat`

Persist scope; default excludes generated notes as independent sources.

**N092 · `GET /api/v1/vaults/{vaultId}/chats/{chatId}` — `getChat`**

Access: `notes:read`. Success: `200`.

Request: `none`

Response: `Chat`

Return settings and stable identity, not unrelated conversation content.

**N093 · `DELETE /api/v1/vaults/{vaultId}/chats/{chatId}` — `deleteChat`**

Access: `notes:write`. Success: `204`.

Request: `none`

Response: `empty`

Delete conversation/cache under retention policy and cancel pending answers.

**N094 · `GET /api/v1/vaults/{vaultId}/chats/{chatId}/messages` — `listMessages`**

Access: `notes:read`. Success: `200`.

Request: `{cursor?, limit?}`

Response: `List<Message>`

Include status, source manifest, and any purge/stale markers.

**N095 · `POST /api/v1/vaults/{vaultId}/chats/{chatId}/messages` — `askNotes`**

Access: `ask:run`. Success: `202`.

Request: `{client_message_id, text, mode: grounded|brainstorm, scope?, queue_when_offline: boolean}`

Response: `AskHandle {job_id, user_message_id, answer_message_id, status}`

Persist request first; source-linked answer only; offline worker state is immediate and honest.

**N096 · `POST /api/v1/vaults/{vaultId}/generations` — `generateArtifact`**

Access: `ai:run`. Success: `202`.

Request: `{kind: summary|project_brief|comparison|outline|study_questions|checklist|catch_up|lesson_summary, scope: UnifiedSearchScope, instructions?, output_language?, target_generated_note_id?, expected_revision?}`

Response: `JobHandle`

Create a derivative note or explicitly refresh AI-owned blocks of a generated note at the expected revision; retain user edits and source history; never overwrite original notes. Use the same evidence/permission pipeline for new school derivatives; grades/profile data require their own read grants.

#### Tasks, reminders and notifications

**N097 · `GET /api/v1/vaults/{vaultId}/tasks` — `listTasks`**

Access: `notes:read`. Success: `200`.

Request: `{status?, source_note_id?, due_before?, cursor?, limit?}`

Response: `List<Task>`

Separate proposed from accepted tasks; exclude rejected suggestions by default. Include typed project/course/assignment/assessment/study links, estimates and remaining work; keep imported provider completion separate.

**N098 · `POST /api/v1/vaults/{vaultId}/tasks` — `createTask`**

Access: `notes:write`. Success: `201`.

Request: `{title, source_anchor_id?, due_date?, due_at?, timezone?, status: accepted}`

Response: `Task`

Explicit creation; date-only and timed values are distinct. Include typed project/course/assignment/assessment/study links, estimates and remaining work; keep imported provider completion separate.

**N099 · `PATCH /api/v1/vaults/{vaultId}/tasks/{taskId}` — `updateTask`**

Access: `notes:write`. Success: `200`.

Request: `{title?, status?, due_date?, due_at?, timezone?, expected_revision}`

Response: `Task`

Accept/complete/reject candidate explicitly; source-checkbox update uses normal document transaction. Include typed project/course/assignment/assessment/study links, estimates and remaining work; keep imported provider completion separate.

**N100 · `DELETE /api/v1/vaults/{vaultId}/tasks/{taskId}` — `deleteTask`**

Access: `notes:write`. Success: `204`.

Request: `{expected_revision}`

Response: `empty`

Do not delete its source note; remove or detach reminders.

**N101 · `GET /api/v1/vaults/{vaultId}/reminders` — `listReminders`**

Access: `notes:read`. Success: `200`.

Request: `{status?, cursor?, limit?}`

Response: `List<Reminder>`

Expose delivery state and missed status.

**N102 · `POST /api/v1/vaults/{vaultId}/reminders` — `createReminder`**

Access: `notes:write`. Success: `201`.

Request: `{task_id?, source_anchor_id?, remind_at, timezone, channel: in_app|desktop}`

Response: `Reminder`

Explicit schedule only; validate a concrete time and timezone.

**N103 · `PATCH /api/v1/vaults/{vaultId}/reminders/{reminderId}` — `updateReminder`**

Access: `notes:write`. Success: `200`.

Request: `{remind_at?, status: scheduled|snoozed|dismissed?, expected_revision}`

Response: `Reminder`

Snooze/dismiss is idempotent and synchronized; no duplicate delivery on reconnect.

**N104 · `DELETE /api/v1/vaults/{vaultId}/reminders/{reminderId}` — `deleteReminder`**

Access: `notes:write`. Success: `204`.

Request: `{expected_revision}`

Response: `empty`

Cancel future deliveries.

**N105 · `GET /api/v1/vaults/{vaultId}/notifications` — `listNotifications`**

Access: `notes:read`. Success: `200`.

Request: `{unread_only?, cursor?, limit?}`

Response: `List<Notification>`

Respect preferences and scope; no browser-push guarantees.

**N106 · `PATCH /api/v1/vaults/{vaultId}/notifications/{notificationId}` — `updateNotification`**

Access: `notes:write`. Success: `200`.

Request: `{state: read|dismissed}`

Response: `Notification`

Store acknowledgement once across devices.

#### Jobs, models and worker protocol

**N107 · `GET /api/v1/vaults/{vaultId}/jobs` — `listJobs`**

Access: `jobs:read`. Success: `200`.

Request: `{kind?, status?, cursor?, limit?}`

Response: `List<JobSummary>`

Separate waiting-for-worker and failure; redact unneeded payloads.

**N108 · `GET /api/v1/vaults/{vaultId}/jobs/{jobId}` — `getJob`**

Access: `jobs:read`. Success: `200`.

Request: `none`

Response: `Job {status, stage, progress, result: JobResult?, error?}`

Discriminated result union: extraction/search/answer/generation/import/export/etc.; no untyped arbitrary result blob.

**N109 · `POST /api/v1/vaults/{vaultId}/jobs/{jobId}/cancel` — `cancelJob`**

Access: `jobs:write`. Success: `200`.

Request: `none`

Response: `Job`

Cooperative cancellation with terminal-state fencing and explicit partial-work policy.

**N110 · `POST /api/v1/vaults/{vaultId}/jobs/{jobId}/retry` — `retryJob`**

Access: `jobs:write`. Success: `202`.

Request: `{expected_input_revision?}`

Response: `JobHandle`

Only valid retryable jobs; no duplicate side effects or obsolete input reuse.

**N111 · `GET /api/v1/vaults/{vaultId}/jobs/{jobId}/events` — `streamJobEvents`**

Access: `jobs:read`. Success: `200`.

Request: `Last-Event-ID header`

Response: `SSE<JobEvent>`

Resumable bounded replay; sources/tokens scoped; final state agrees with persisted job.

**N112 · `GET /api/v1/vaults/{vaultId}/ai/status` — `getAiStatus`**

Access: `notes:read`. Success: `200`.

Request: `none`

Response: `AiStatus {workers, capabilities, available_models, allowed_backends, active_policy, queued_jobs, disclosure_state}`

Distinguish unavailable local model/worker, busy, enabled cloud backend, and disabled/not-configured cloud mode. Never activate a backend from a status read.

**N113 · `GET /api/v1/ai/models` — `listModelProfiles`**

Access: `owner`. Success: `200`.

Request: `none`

Response: `List<ModelProfile>`

Return configured allowlisted model profiles with explicit backend kind, identity/digest where applicable and capability status. Local profiles remain distinct from optional cloud profiles. Listing a cloud profile neither enables it nor permits fallback or local-only vault disclosure.

**N114 · `POST /api/v1/vaults/{vaultId}/ai/tests` — `testAiSetup`**

Access: `ai:run`. Success: `202`.

Request: `{worker_id, model_profile_id}`

Response: `JobHandle`

Real harmless completion/schema/embedding tests against the selected installed runtime.

**N115 · `GET /api/v1/vaults/{vaultId}/index/status` — `getIndexStatus`**

Access: `notes:read`. Success: `200`.

Request: `none`

Response: `IndexStatus {current_profile, chunker_version, indexed_revisions, pending, errors}`

Do not show ready until required revisions actually have valid indexes.

**N116 · `POST /api/v1/vaults/{vaultId}/index/rebuild` — `rebuildIndex`**

Access: `owner`. Success: `202`.

Request: `{model_profile_id, scope?, chunker_version}`

Response: `JobHandle`

Shadow rebuild and atomic switch after validation; preserve originals and old index during rebuild.

**N117 · `GET /api/v1/workers` — `listWorkers`**

Access: `owner`. Success: `200`.

Request: `none`

Response: `List<WorkerSummary>`

Worker role is an enrolled device, not a separately public registration path.

**N118 · `PATCH /api/v1/workers/{workerId}` — `configureWorker`**

Access: `owner_reauth`. Success: `200`.

Request: `{vault_ids?, allowed_job_types?, paused?, resource_policy?, expected_revision}`

Response: `WorkerSummary`

Finite configuration only; never accept executable, arbitrary model URL, or host path.

**N119 · `POST /api/v1/worker/heartbeat` — `workerHeartbeat`**

Access: `enrolled_worker`. Success: `200`.

Request: `{device_id, installed_profiles, capacity, runtime_status}`

Response: `WorkerHeartbeatResponse {server_time, config_revision}`

Authenticate worker identity and validate reported model digests.

**N120 · `POST /api/v1/worker/jobs/claim` — `claimWorkerJob`**

Access: `enrolled_worker`. Success: `[200, 204]`.

Request: `{supported_job_types, available_capacity}`

Response: `WorkerLease {job_id, vault_id, lease_token, expires_at, input_manifest}`

Atomically lease eligible authorized job; 204 when none; at-least-once/idempotent processing.

**N121 · `GET /api/v1/worker/jobs/{jobId}/input` — `getWorkerJobInput`**

Access: `job_lease`. Success: `200`.

Request: `lease token header`

Response: `TypedJobInput`

Only job-authorized source revisions/blobs; no generic vault scan or arbitrary file read.

**N122 · `POST /api/v1/worker/jobs/{jobId}/heartbeat` — `renewWorkerLease`**

Access: `job_lease`. Success: `200`.

Request: `{lease_token, stage, progress?}`

Response: `LeaseState {expires_at, cancel_requested}`

Expired/revoked leases cannot be renewed or commit results.

**N123 · `POST /api/v1/worker/jobs/{jobId}/events` — `appendWorkerEvents`**

Access: `job_lease`. Success: `200`.

Request: `{lease_token, events: WorkerProgressEvent[], sequence}`

Response: `EventAck {accepted_sequence}`

Bounded/idempotent batches; do not allow worker-provided arbitrary HTML or hidden reasoning streams.

**N124 · `POST /api/v1/worker/jobs/{jobId}/complete` — `completeWorkerJob`**

Access: `job_lease`. Success: `200`.

Request: `{lease_token, input_hash, result: TypedJobResult}`

Response: `Job`

Validate result/evidence/profile and current input revision before applying effects; stale results superseded.

**N125 · `POST /api/v1/worker/jobs/{jobId}/fail` — `failWorkerJob`**

Access: `job_lease`. Success: `200`.

Request: `{lease_token, error_code, safe_detail, retryable}`

Response: `Job`

Server decides retry policy; avoid credentials/source text in error detail.

#### System jobs and resurfacing

**N126 · `GET /api/v1/system-jobs` — `listSystemJobs`**

Access: `owner_reauth`. Success: `200`.

Request: `{status?, cursor?, limit?}`

Response: `List<JobSummary>`

List installation-scoped backup/restore jobs that do not belong to a single vault.

**N127 · `GET /api/v1/system-jobs/{jobId}` — `getSystemJob`**

Access: `owner_reauth`. Success: `200`.

Request: `none`

Response: `Job`

Expose durable installation-job status and typed result under owner authorization.

**N128 · `POST /api/v1/system-jobs/{jobId}/cancel` — `cancelSystemJob`**

Access: `owner_reauth`. Success: `200`.

Request: `none`

Response: `Job`

Honor documented cancellation boundaries; a committed restore cannot pretend to roll back merely because cancellation was requested.

**N129 · `POST /api/v1/system-jobs/{jobId}/retry` — `retrySystemJob`**

Access: `owner_reauth`. Success: `202`.

Request: `none`

Response: `JobHandle`

Retry only retryable installation jobs; preserve manifests and idempotent effects.

**N130 · `GET /api/v1/system-jobs/{jobId}/events` — `streamSystemJobEvents`**

Access: `owner_reauth`. Success: `200`.

Request: `Last-Event-ID header`

Response: `SSE<JobEvent>`

Installation-scoped progress; no vault-content or key leakage; durable status survives reconnect.

**N131 · `POST /api/v1/vaults/{vaultId}/resurfacing/feedback` — `resurfacingFeedback`**

Access: `notes:write`. Success: `201`.

Request: `{note_id, action: dismiss|snooze|hide_topic, label_id?, until?}`

Response: `ResurfacingFeedback`

Persist user choice, prevent repeated dismissed suggestions, and validate any topic belongs to this vault.

#### Synchronization and realtime

**N132 · `POST /api/v1/vaults/{vaultId}/sync/push` — `pushSync`**

Access: `sync:write`. Success: `200`.

Request: `{device_id, operations: SyncOperation[], last_cursor}`

Response: `SyncAck {accepted_operation_ids, cursor, conflicts}`

Persist canonical changes/outbox atomically; bounded idempotent batch; tombstone checks.

**N133 · `GET /api/v1/vaults/{vaultId}/sync/pull` — `pullSync`**

Access: `sync:read`. Success: `200`.

Request: `{cursor?, limit?}`

Response: `SyncBatch {events, next_cursor, has_more, snapshot_required}`

Cursor-based recovery with per-vault access and explicit expired-cursor behavior.

**N134 · `POST /api/v1/vaults/{vaultId}/sync/snapshots` — `createSyncSnapshot`**

Access: `sync:read`. Success: `202`.

Request: `{device_id}`

Response: `JobHandle`

Consistent authorized snapshot with watermark; needed for fresh/expired clients.

**N135 · `GET /api/v1/vaults/{vaultId}/sync/ws` — `openSyncSocket`**

Access: `sync:read_and_optional_write`. Success: `101`.

Request: `WebSocket handshake + negotiated protocol version`

Response: `WebSocket<SyncFrame>`

Authenticated origin-bound handshake; persist-before-ack; same domain write path as REST; read-only clients cannot push.

**N136 · `GET /api/v1/vaults/{vaultId}/events` — `streamVaultEvents`**

Access: `sync:read`. Success: `200`.

Request: `Last-Event-ID header`

Response: `SSE<VaultEvent>`

Authorized changes/notifications only; resumable and bounded; revoked connections closed.

#### Import, export and recovery

**N137 · `POST /api/v1/vaults/{vaultId}/imports` — `planImport`**

Access: `notes:write`. Success: `202`.

Request: `{blob_id, format, options: ImportOptions}`

Response: `JobHandle`

Validate archive and build preview/per-item manifest; do not silently mutate existing notes.

**N138 · `GET /api/v1/vaults/{vaultId}/imports/{importId}` — `getImport`**

Access: `notes:read`. Success: `200`.

Request: `{cursor?, limit?}`

Response: `ImportManifest {status, items, warnings, counts}`

Show actual per-file results and source relationships.

**N139 · `POST /api/v1/vaults/{vaultId}/imports/{importId}/apply` — `applyImport`**

Access: `notes:write`. Success: `202`.

Request: `{plan_revision, collision_policy, confirmation}`

Response: `JobHandle`

Resumable idempotent apply; explicit ID remapping and import provenance.

**N140 · `POST /api/v1/vaults/{vaultId}/exports` — `createExport`**

Access: `export:read`. Success: `202`.

Request: `{scope, format: markdown_bundle|full_fidelity, include_history}`

Response: `JobHandle`

Authorized consistent snapshot including original blobs/manifest; expiry stated.

**N141 · `GET /api/v1/vaults/{vaultId}/exports/{exportId}` — `getExport`**

Access: `export:read`. Success: `200`.

Request: `none`

Response: `ExportManifest {status, format, byte_length?, sha256?, expires_at}`

Do not return download URL before an artifact exists.

**N142 · `GET /api/v1/vaults/{vaultId}/exports/{exportId}/download` — `downloadExport`**

Access: `export:read`. Success: `200`.

Request: `none`

Response: `binary export bundle`

Recheck scope, revoke expired access; safe content disposition and checksum.

**N143 · `GET /api/v1/backups` — `listBackups`**

Access: `owner_reauth`. Success: `200`.

Request: `{cursor?, limit?}`

Response: `List<BackupSummary>`

No arbitrary server path browsing; expose last verification and retention.

**N144 · `POST /api/v1/backups` — `createBackup`**

Access: `owner_reauth`. Success: `202`.

Request: `{destination_id, encryption_profile_id}`

Response: `JobHandle`

Use administrator-configured destination; coherent database/blob manifest and encryption policy.

**N145 · `GET /api/v1/backups/{backupId}` — `getBackupManifest`**

Access: `owner_reauth`. Success: `200`.

Request: `none`

Response: `BackupManifest`

Versions, completeness, checksums and restore prerequisites; no encryption secret.

**N146 · `GET /api/v1/backups/{backupId}/download` — `downloadBackup`**

Access: `owner_reauth`. Success: `200`.

Request: `none`

Response: `encrypted backup bundle`

Strong recent authentication, no unencrypted secret material; audited download.

**N147 · `POST /api/v1/backups/{backupId}/verify` — `verifyBackup`**

Access: `owner_reauth`. Success: `202`.

Request: `none`

Response: `JobHandle`

Verify checksums, decryptability through configured key access, and manifest completeness; not a fake healthy flag.

**N148 · `POST /api/v1/restore-plans` — `createRestorePlan`**

Access: `owner_reauth`. Success: `202`.

Request: `{backup_id, target_mode: isolated_validation|replace_installation}`

Response: `JobHandle`

Dry-run schema/compatibility/data checks; no live mutation yet.

**N149 · `POST /api/v1/restore-plans/{restorePlanId}/apply` — `applyRestore`**

Access: `owner_reauth`. Success: `202`.

Request: `{plan_revision, destructive_confirmation}`

Response: `JobHandle`

Maintenance-mode apply with coherent rollback/recovery procedure and isolated restore test evidence.

#### Calendars and event lifecycle

**C001 · `GET /api/v1/vaults/{vaultId}/calendars` — `listCalendars`**

Access: `owner_vault`. Success: `200`.

Request: `cursor, limit`

Response: `List<Calendar>`

Return ownership, read/write capability, selected visibility, source freshness and provider mapping.

**C002 · `POST /api/v1/vaults/{vaultId}/calendars` — `createCalendar`**

Access: `owner_vault`. Success: `201`.

Request: `CreateCalendar {name, display_preferences, timezone, origin: sorta}`

Response: `Calendar`

Create a private Sorta calendar. Provider creation is a separate explicit write action.

**C003 · `GET /api/v1/vaults/{vaultId}/calendars/{calendarId}` — `getCalendar`**

Access: `owner_vault`. Success: `200`.

Request: `none`

Response: `Calendar`

Scope-check the calendar and associated source metadata.

**C004 · `PATCH /api/v1/vaults/{vaultId}/calendars/{calendarId}` — `updateCalendar`**

Access: `owner_vault`. Success: `200`.

Request: `CalendarPatch; If-Match`

Response: `Calendar`

Modify owner-controlled metadata; cannot turn a read-only source calendar into a writable provider calendar.

**C005 · `DELETE /api/v1/vaults/{vaultId}/calendars/{calendarId}` — `archiveCalendar`**

Access: `owner_vault`. Success: `204`.

Request: `If-Match`

Response: `none`

Archive locally with tombstone/undo; no implied deletion of an external calendar.

**C006 · `GET /api/v1/vaults/{vaultId}/calendar-view` — `getCalendarView`**

Access: `owner_vault`. Success: `200`.

Request: `from, to, timezone, calendar_ids, view`

Response: `CalendarView`

Bound the range and occurrence expansion. Return time-unknown markers separately from busy intervals; expose stale sources. Preserve independent permission gates for private preparation, optional grade/attendance overlays and Google/Microsoft source ownership.

**C007 · `GET /api/v1/vaults/{vaultId}/calendar-events` — `listCalendarEvents`**

Access: `owner_vault`. Success: `200`.

Request: `bounded filters, cursor, limit`

Response: `List<CalendarEvent>`

Filter canonical events without losing provider/tentative/cancelled distinctions. Preserve independent permission gates for private preparation, optional grade/attendance overlays and Google/Microsoft source ownership.

**C008 · `POST /api/v1/vaults/{vaultId}/calendar-events` — `createCalendarEvent`**

Access: `owner_vault`. Success: `201`.

Request: `CreateCalendarEvent; Idempotency-Key`

Response: `CalendarEvent`

Commit internal event and any authorized outbox action atomically. Internal creation is not provider acknowledgment.

**C009 · `GET /api/v1/vaults/{vaultId}/calendar-events/{eventId}` — `getCalendarEvent`**

Access: `owner_vault`. Success: `200`.

Request: `revision_id?`

Response: `CalendarEvent | HistoricalCalendarEvent`

Return the current record or authorized immutable revision; old evidence must stay revision-specific.

**C010 · `PATCH /api/v1/vaults/{vaultId}/calendar-events/{eventId}` — `updateCalendarEvent`**

Access: `owner_vault`. Success: `200`.

Request: `CalendarEventPatch; If-Match; Idempotency-Key`

Response: `CalendarEvent`

Validate TimeSpec, field locks, ownership and recurrence edit scope; enqueue authorized writeback but do not invent success.

**C011 · `DELETE /api/v1/vaults/{vaultId}/calendar-events/{eventId}` — `trashCalendarEvent`**

Access: `owner_vault`. Success: `204`.

Request: `If-Match; Idempotency-Key`

Response: `none`

Trash personal event; cancel its local reminders. Preserve underlying commitments. Shared provider cancellations require the explicit preview flow.

**C012 · `POST /api/v1/vaults/{vaultId}/calendar-events/{eventId}/restore` — `restoreCalendarEvent`**

Access: `owner_vault`. Success: `200`.

Request: `expected_revision; Idempotency-Key`

Response: `CalendarEvent`

Restore internal record only; never silently recreate external invitations or resend notifications.

**C013 · `GET /api/v1/vaults/{vaultId}/calendar-events/{eventId}/revisions` — `listCalendarEventRevisions`**

Access: `owner_vault`. Success: `200`.

Request: `cursor, limit`

Response: `List<EventRevision>`

Expose actor, source, policy, changed fields and resolvable evidence, excluding credentials.

**C014 · `GET /api/v1/vaults/{vaultId}/calendar-events/{eventId}/occurrences` — `listEventOccurrences`**

Access: `owner_vault`. Success: `200`.

Request: `from, to, cursor, limit`

Response: `List<EventOccurrence>`

Expand recurrence with timezone, exceptions and stable occurrence identifiers; bound expansion.

**C015 · `POST /api/v1/vaults/{vaultId}/calendar-events/{eventId}/exceptions` — `createEventException`**

Access: `owner_vault`. Success: `201`.

Request: `OccurrenceExceptionInput; If-Match; Idempotency-Key`

Response: `EventException`

Create one-occurrence override/cancellation and reevaluate prep/reminders for only affected occurrences.

**C016 · `PATCH /api/v1/vaults/{vaultId}/calendar-events/{eventId}/exceptions/{exceptionId}` — `updateEventException`**

Access: `owner_vault`. Success: `200`.

Request: `ExceptionPatch; If-Match`

Response: `EventException`

Revision-safe update; do not rewrite the entire series inadvertently.

**C017 · `DELETE /api/v1/vaults/{vaultId}/calendar-events/{eventId}/exceptions/{exceptionId}` — `removeEventException`**

Access: `owner_vault`. Success: `204`.

Request: `If-Match`

Response: `none`

Restore series behavior after checking impact; provider actions respect the separate write policy.

#### Private event preparation and planning

**C018 · `GET /api/v1/vaults/{vaultId}/calendar-events/{eventId}/private-context` — `getPrivateEventContext`**

Access: `owner_vault`. Success: `200`.

Request: `occurrence_id?`

Response: `PrivateEventContext`

Return prep, linked commitments, notes and evidence. Never include this representation in provider payloads. Preserve independent permission gates for private preparation, optional grade/attendance overlays and Google/Microsoft source ownership.

**C019 · `POST /api/v1/vaults/{vaultId}/calendar-events/{eventId}/context-refresh` — `refreshPrivateEventContext`**

Access: `owner_vault`. Success: `202`.

Request: `occurrence_id?, expected_revision; Idempotency-Key`

Response: `JobHandle`

Enqueue bounded matching/synthesis; deterministic matches may finish without a model. Mark stale context honestly.

**C020 · `POST /api/v1/vaults/{vaultId}/calendar-events/{eventId}/prep-items` — `createPrepItem`**

Access: `owner_vault`. Success: `201`.

Request: `CreatePrepItem {occurrence_id?, type, text, evidence, commitment_id?}`

Response: `PrepItem`

Create manual or validated policy-authorized item, preserving provenance and uniqueness of commitment binding.

**C021 · `PATCH /api/v1/vaults/{vaultId}/calendar-events/{eventId}/prep-items/{prepId}` — `updatePrepItem`**

Access: `owner_vault`. Success: `200`.

Request: `PrepItemPatch; If-Match`

Response: `PrepItem`

Packing/completing prep does not fulfill a loan; allow dismiss/not-applicable and persist suppression.

**C022 · `DELETE /api/v1/vaults/{vaultId}/calendar-events/{eventId}/prep-items/{prepId}` — `removePrepItem`**

Access: `owner_vault`. Success: `204`.

Request: `If-Match`

Response: `none`

Remove binding/item but preserve its source and active commitment; prevent repeated re-suggestion of the same rejected match.

**C023 · `POST /api/v1/vaults/{vaultId}/calendar/free-busy` — `calendarFreeBusy`**

Access: `owner_vault`. Success: `200`.

Request: `FreeBusyQuery {calendar_ids, from, to, timezone}`

Response: `FreeBusyResult`

Use structured intervals only. Report missing duration, stale sources and time-unknown conflicts separately. Preserve independent permission gates for private preparation, optional grade/attendance overlays and Google/Microsoft source ownership.

**C024 · `GET /api/v1/vaults/{vaultId}/calendar/brief` — `getCalendarBrief`**

Access: `owner_vault`. Success: `200`.

Request: `date, timezone`

Response: `CalendarBrief`

Return cached source-linked brief and deterministic upcoming items; expose generation/freshness state.

**C025 · `POST /api/v1/vaults/{vaultId}/calendar/brief-refresh` — `refreshCalendarBrief`**

Access: `owner_vault`. Success: `202`.

Request: `date, timezone; Idempotency-Key`

Response: `JobHandle`

Use actual jobs, bounded sources and privacy-safe notification policy.

**C026 · `POST /api/v1/vaults/{vaultId}/calendar/preparation-plan` — `previewPreparationPlan`**

Access: `owner_vault`. Success: `202`.

Request: `PreparationPlanInput {task_ids, study_plan_id?, window, limits, estimates, locked_event_ids, expected_input_revisions}`

Response: `JobHandle`

Call the same deterministic scheduler used by study/replanning. Persist a Proposal with capacity/uncertainty explanations, not schedule changes. Acceptance rechecks current revisions/conflicts through shared proposal acceptance.

**C027 · `GET /api/v1/vaults/{vaultId}/calendar/conflicts` — `listCalendarConflicts`**

Access: `owner_vault`. Success: `200`.

Request: `from, to, cursor, limit`

Response: `List<CalendarConflict>`

Expose overlapping fixed events, inconsistent source dates and capacity conflicts with source ownership.

#### Commitments and identity

**C028 · `GET /api/v1/vaults/{vaultId}/commitments` — `listCommitments`**

Access: `owner_vault`. Success: `200`.

Request: `status, person_id?, project_id?, cursor, limit`

Response: `List<Commitment>`

Include undated active commitments; no fabricated deadlines.

**C029 · `POST /api/v1/vaults/{vaultId}/commitments` — `createCommitment`**

Access: `owner_vault`. Success: `201`.

Request: `CreateCommitment; Idempotency-Key`

Response: `Commitment`

Validate finite condition AST, evidence and entity references; state changes come from policy or owner.

**C030 · `GET /api/v1/vaults/{vaultId}/commitments/{commitmentId}` — `getCommitment`**

Access: `owner_vault`. Success: `200`.

Request: `none`

Response: `CommitmentDetail`

Include source evidence, eligible/current bindings and status history.

**C031 · `PATCH /api/v1/vaults/{vaultId}/commitments/{commitmentId}` — `updateCommitment`**

Access: `owner_vault`. Success: `200`.

Request: `CommitmentPatch; If-Match`

Response: `Commitment`

Support active/fulfilled/cancelled/superseded transitions with actor/evidence. Time passing is not valid fulfillment evidence.

**C032 · `DELETE /api/v1/vaults/{vaultId}/commitments/{commitmentId}` — `archiveCommitment`**

Access: `owner_vault`. Success: `204`.

Request: `If-Match`

Response: `none`

Archive and remove future bindings/reminders without deleting original notes.

**C033 · `POST /api/v1/vaults/{vaultId}/commitments/{commitmentId}/match` — `rematchCommitment`**

Access: `owner_vault`. Success: `202`.

Request: `expected_revision; Idempotency-Key`

Response: `JobHandle`

Match eligible events using entity identity/context; do not conflate people and places.

**C034 · `GET /api/v1/vaults/{vaultId}/calendar-entities` — `listCalendarEntities`**

Access: `owner_vault`. Success: `200`.

Request: `kind, query?, cursor, limit`

Response: `List<CalendarEntity>`

Scope and type distinguish people/places/items/classes. Reuse the shared entity identity store.

**C035 · `POST /api/v1/vaults/{vaultId}/calendar-entities` — `createCalendarEntity`**

Access: `owner_vault`. Success: `201`.

Request: `CreateEntity {kind, name, evidence?}`

Response: `CalendarEntity`

Create a typed owner-confirmed entity, not a provider contact write.

**C036 · `PATCH /api/v1/vaults/{vaultId}/calendar-entities/{entityId}` — `updateCalendarEntity`**

Access: `owner_vault`. Success: `200`.

Request: `EntityPatch; If-Match`

Response: `CalendarEntity`

Preserve historical identities and rerun affected matching when owner changes a fact.

**C037 · `POST /api/v1/vaults/{vaultId}/calendar-entities/{entityId}/aliases` — `addEntityAlias`**

Access: `owner_vault`. Success: `201`.

Request: `AliasInput {alias, evidence?, scope}; Idempotency-Key`

Response: `EntityAlias`

Owner-confirmed alias only; prevent cross-type automatic merge. This changes Sorta identity, not provider contacts.

**C038 · `DELETE /api/v1/vaults/{vaultId}/calendar-entities/{entityId}/aliases/{aliasId}` — `removeEntityAlias`**

Access: `owner_vault`. Success: `204`.

Request: `If-Match`

Response: `none`

Invalidate affected automatic matches and preserve the audit trail.

**C039 · `POST /api/v1/vaults/{vaultId}/calendar-entities/merge-preview` — `previewEntityMerge`**

Access: `owner_vault`. Success: `200`.

Request: `EntityMergeInput {entity_ids, target_id, reason}`

Response: `Proposal`

Preview affected events/commitments before shared proposal acceptance. No automatic destructive identity merging.

#### Automation policy and explanations

**C040 · `GET /api/v1/vaults/{vaultId}/calendar-policies` — `getCalendarPolicies`**

Access: `owner_vault`. Success: `200`.

Request: `none`

Response: `CalendarPolicySet`

Return source/action-specific rules, enabled state and version; no self-scored confidence masquerading as measured quality.

**C041 · `PUT /api/v1/vaults/{vaultId}/calendar-policies` — `setCalendarPolicies`**

Access: `owner_vault`. Success: `200`.

Request: `CalendarPolicySet; If-Match`

Response: `CalendarPolicySet`

Validate finite predicates, persist owner opt-in, show effects of newly allowed actions and keep external sending gated.

**C042 · `POST /api/v1/vaults/{vaultId}/calendar-policies/dry-run` — `dryRunCalendarPolicy`**

Access: `owner_vault`. Success: `202`.

Request: `PolicyDryRunInput {policy, source_ids, bounded_window}`

Response: `JobHandle`

Evaluate against authorized sources without creating events, commitments or provider actions.

**C043 · `GET /api/v1/vaults/{vaultId}/calendar-decisions` — `listCalendarDecisions`**

Access: `owner_vault`. Success: `200`.

Request: `source_id?, event_id?, outcome?, cursor, limit`

Response: `List<AutomationDecision>`

Return why applied/suggested/blocked and evidence/policy version; omit hidden model reasoning.

**C044 · `POST /api/v1/vaults/{vaultId}/calendar-decisions/{decisionId}/undo` — `undoCalendarDecision`**

Access: `owner_vault`. Success: `200`.

Request: `expected_revision; Idempotency-Key`

Response: `UndoResult`

Compensating domain command under current revision checks. External irreversible sends are not claimed undoable.

#### Provider connection lifecycle

**C045 · `GET /api/v1/vaults/{vaultId}/connections` — `listConnections`**

Access: `owner_vault`. Success: `200`.

Request: `none`

Response: `List<ConnectionSummary>`

Report actual per-resource coverage and blockers; never return credentials.

**C046 · `POST /api/v1/vaults/{vaultId}/connections` — `createConnection`**

Access: `owner_vault`. Success: `201`.

Request: `CreateConnection {provider_key, adapter_kind, mode, selected_scopes, policy, credential_ref?}`

Response: `Connection`

Create an unconnected configuration for a registered Microsoft, Google, InSchool, personal-data, transcript, extractor or optional AI adapter. Never return live success merely for configuration. Credentials use protected enrollment, not note/model content. Unknown adapter identities remain unverified; no arbitrary provider endpoints.

**C047 · `GET /api/v1/vaults/{vaultId}/connections/{connectionId}` — `getConnection`**

Access: `owner_vault`. Success: `200`.

Request: `none`

Response: `ConnectionDetail`

Include selected containers, consent/health/freshness and redacted configuration.

**C048 · `POST /api/v1/vaults/{vaultId}/connections/{connectionId}/authorize` — `beginProviderAuthorization`**

Access: `owner_vault`. Success: `200`.

Request: `AuthorizationRequest {requested_capabilities, registered_return_target}`

Response: `AuthorizationStart`

Use registered provider adapter; persist OAuth state/PKCE transaction. Return supported login URL, not model-selected host.

**C049 · `POST /api/v1/vaults/{vaultId}/connections/{connectionId}/reauthorize` — `reauthorizeProvider`**

Access: `owner_vault`. Success: `200`.

Request: `ReauthorizationRequest`

Response: `AuthorizationStart`

Explicit reconnect/permission upgrade, preserving data identity and no consent bypass.

**C050 · `GET /api/v1/vaults/{vaultId}/connections/{connectionId}/capabilities` — `getConnectionCapabilities`**

Access: `owner_vault`. Success: `200`.

Request: `none`

Response: `CapabilityReport`

Return verified/consent-required/unverified states per resource and exact tested coverage.

**C051 · `POST /api/v1/vaults/{vaultId}/connections/{connectionId}/probe` — `probeConnection`**

Access: `owner_vault`. Success: `202`.

Request: `none; Idempotency-Key`

Response: `JobHandle`

Make safe adapter-specific permission/availability checks; no account write and no arbitrary URL probing.

**C052 · `GET /api/v1/vaults/{vaultId}/connections/{connectionId}/resources` — `listConnectionResources`**

Access: `owner_vault`. Success: `200`.

Request: `kind, parent_id?, cursor, limit`

Response: `List<ConnectorResource>`

Enumerate only resources available through granted permissions; track denied/skipped containers.

**C053 · `PUT /api/v1/vaults/{vaultId}/connections/{connectionId}/selection` — `selectConnectionResources`**

Access: `owner_vault`. Success: `200`.

Request: `ResourceSelection; If-Match`

Response: `ResourceSelection`

Validate chosen IDs, window and vault/export policy; preview impact of widening scope.

**C054 · `POST /api/v1/vaults/{vaultId}/connections/{connectionId}/sync` — `syncConnection`**

Access: `owner_vault`. Success: `202`.

Request: `SyncRequest {selected_resource_ids?, mode: incremental|rescan}; Idempotency-Key`

Response: `JobHandle`

Real durable sync with pagination/cursors; resource blockers are typed results, not empty successful downloads.

**C055 · `GET /api/v1/vaults/{vaultId}/connections/{connectionId}/sync-status` — `getConnectionSyncStatus`**

Access: `owner_vault`. Success: `200`.

Request: `none`

Response: `ConnectorSyncStatus`

Separate last attempt/success, partial coverage, throttling, authorization and worker availability.

**C056 · `PATCH /api/v1/vaults/{vaultId}/connections/{connectionId}/schedule` — `setConnectionSchedule`**

Access: `owner_vault`. Success: `200`.

Request: `ConnectorSchedule {enabled, interval, windows}; If-Match`

Response: `ConnectorSchedule`

Respect provider limits; deterministic import can run without the LLM. Scheduling exists in delivered software, not in this plan.

**C057 · `POST /api/v1/vaults/{vaultId}/connections/{connectionId}/disconnect-preview` — `previewConnectionDisconnect`**

Access: `owner_vault`. Success: `200`.

Request: `retention_choice`

Response: `Proposal`

Preview token deletion, subscription stop, retained cache and affected derived content.

**C058 · `POST /api/v1/vaults/{vaultId}/connections/{connectionId}/disconnect` — `disconnectConnection`**

Access: `owner_vault`. Success: `202`.

Request: `DisconnectConfirmation {preview_id, expected_revision}; Idempotency-Key`

Response: `JobHandle`

Stop ingestion/subscriptions, remove local tokens, attempt provider revocation where supported, apply retention; report any incomplete provider cleanup.

**C059 · `GET /api/v1/oauth/microsoft/callback` — `microsoftOAuthCallback`**

Access: `oauth_transaction`. Success: `303`.

Request: `code|error, state`

Response: `RedirectOrSafeError`

Consume a one-time state bound to owner/vault/connection; token exchange through supported auth library, no secrets in redirect/logs.

**C060 · `POST /api/v1/integrations/microsoft/notifications` — `microsoftChangeNotifications`**

Access: `validated_provider_subscription`. Success: `202`.

Request: `ProviderHandshakeQuery | ProviderNotificationBatch`

Response: `ProviderHandshakeText | EmptyAccepted`

Implement actual Graph handshake/client-state/subscription checks, replay protection and bounded queueing. Only this narrow provider envelope bypasses an owner session.

#### Imported sources and school domain

**C061 · `GET /api/v1/vaults/{vaultId}/source-objects` — `listSourceObjects`**

Access: `owner_vault`. Success: `200`.

Request: `connection_id?, kind?, container_id?, cursor, limit`

Response: `List<SourceObject>`

Return authorized imported sources and access/freshness state, not duplicate editable personal notes.

**C062 · `GET /api/v1/vaults/{vaultId}/source-objects/{sourceId}` — `getSourceObject`**

Access: `owner_vault`. Success: `200`.

Request: `revision_id?`

Response: `SourceObjectDetail`

Resolve immutable source revision/deep link and retained allowed evidence; permission-check attachment access.

**C063 · `POST /api/v1/vaults/{vaultId}/source-objects/{sourceId}/refresh` — `refreshSourceObject`**

Access: `owner_vault`. Success: `202`.

Request: `expected_revision?; Idempotency-Key`

Response: `JobHandle`

Use registered provider and source identity only. No SSRF via model-supplied URL.

**C064 · `POST /api/v1/vaults/{vaultId}/source-objects/{sourceId}/exclusion` — `excludeSourceObject`**

Access: `owner_vault`. Success: `200`.

Request: `ExclusionInput {excluded, reason}; If-Match`

Response: `SourceExclusion`

Stop future indexing/derived actions for excluded sources and invalidate existing derived results per policy.

**C065 · `GET /api/v1/vaults/{vaultId}/school/overview` — `getSchoolOverview`**

Access: `owner_vault`. Success: `200`.

Request: `from, to, connection_ids?`

Response: `SchoolOverview`

Aggregate permitted lessons/deadlines/materials with explicit coverage and source freshness; no default grade/health import.

**C066 · `GET /api/v1/vaults/{vaultId}/school/lessons` — `listSchoolLessons`**

Access: `owner_vault`. Success: `200`.

Request: `from, to, course_id?, cursor, limit`

Response: `List<SchoolLesson>`

Return normalized source-owned occurrences and room/cancellation updates, not inferred full-year recurrences.

**C067 · `GET /api/v1/vaults/{vaultId}/school/assignments` — `listSchoolAssignments`**

Access: `owner_vault`. Success: `200`.

Request: `course_id?, state?, from?, to?, cursor, limit`

Response: `List<SchoolAssignment>`

Use applicable student-specific details where authorized; distinguish assignment, submission and locally planned work.

**C068 · `GET /api/v1/vaults/{vaultId}/school/assignments/{assignmentId}` — `getSchoolAssignment`**

Access: `owner_vault`. Success: `200`.

Request: `none`

Response: `SchoolAssignmentDetail`

Return source-linked instructions, materials and the applicable due date. Optional linked grade data is included only with separate enabled performance/grade access; assignment read alone does not grant it.

**C069 · `POST /api/v1/vaults/{vaultId}/school/import-preview` — `previewSchoolImport`**

Access: `owner_vault`. Success: `202`.

Request: `SchoolImportInput {attachment_id, format, mapping?, source_timestamp, timezone, period?}`

Response: `JobHandle`

Parse authorized artifact with schema/format detection. Produce a mapping/effect Proposal; snapshots explicitly not live.

**C070 · `GET /api/v1/vaults/{vaultId}/school/connections/{connectionId}/readiness` — `getSchoolConnectionReadiness`**

Access: `owner_vault`. Success: `200`.

Request: `none`

Response: `SchoolReadinessReport`

Report actual approved route/spec/consent/test status. A template adapter or fixture is not a live connection.

#### External calendar actions and reminders

**C071 · `POST /api/v1/vaults/{vaultId}/calendar-events/{eventId}/provider-action-preview` — `previewProviderCalendarAction`**

Access: `owner_vault`. Success: `200`.

Request: `ProviderActionRequest {kind, target_calendar_id, recipients?, public_fields?, response?}`

Response: `Proposal`

Exact recipient/content/visibility/effect preview. Private prep never included implicitly. Execute via generic proposal acceptance after policy checks. Applies to Microsoft and Google via registered adapters; keep public payloads separate from private overlays.

**C072 · `GET /api/v1/vaults/{vaultId}/calendar-provider-actions` — `listProviderCalendarActions`**

Access: `owner_vault`. Success: `200`.

Request: `status?, event_id?, cursor, limit`

Response: `List<ProviderCalendarAction>`

Show pending, in-flight, delivery-unknown, acknowledged, rejected and cancelled; protect secret/provider diagnostics. Applies to Microsoft and Google via registered adapters; keep public payloads separate from private overlays.

**C073 · `GET /api/v1/vaults/{vaultId}/calendar-provider-actions/{actionId}` — `getProviderCalendarAction`**

Access: `owner_vault`. Success: `200`.

Request: `none`

Response: `ProviderCalendarAction`

Return provider acknowledgment identity and reconciliation state, never claim a pending write completed. Applies to Microsoft and Google via registered adapters; keep public payloads separate from private overlays.

**C074 · `POST /api/v1/vaults/{vaultId}/calendar-provider-actions/{actionId}/reconcile` — `reconcileProviderCalendarAction`**

Access: `owner_vault`. Success: `202`.

Request: `none; Idempotency-Key`

Response: `JobHandle`

Read/check delivery state before retry after lost response; no duplicate invitations from blind retry. Applies to Microsoft and Google via registered adapters; keep public payloads separate from private overlays.

**C075 · `POST /api/v1/vaults/{vaultId}/calendar-provider-actions/{actionId}/cancel` — `cancelPendingProviderCalendarAction`**

Access: `owner_vault`. Success: `200`.

Request: `If-Match`

Response: `ProviderCalendarAction`

Cancel only unsent outbox work. Already sent actions require a new reviewed compensating action. Applies to Microsoft and Google via registered adapters; keep public payloads separate from private overlays.

**C076 · `POST /api/v1/vaults/{vaultId}/calendar-events/{eventId}/reminder-plan` — `setEventReminderPlan`**

Access: `owner_vault`. Success: `200`.

Request: `EventReminderPlan {occurrence_scope, schedules, channels}; If-Match`

Response: `EventReminderPlan`

Persist deterministic reminder rules linked to event/commitment, coalesce duplicates and respect quiet hours.

**C077 · `GET /api/v1/vaults/{vaultId}/calendar-events/{eventId}/reminder-plan` — `getEventReminderPlan`**

Access: `owner_vault`. Success: `200`.

Request: `occurrence_id?`

Response: `EventReminderPlan`

Return next triggers and deliverability, not guaranteed OS delivery.

**C078 · `POST /api/v1/vaults/{vaultId}/calendar-import-preview` — `previewCalendarImport`**

Access: `owner_vault`. Success: `202`.

Request: `CalendarImportInput {attachment_id, format: ics, timezone, target_calendar_id}`

Response: `JobHandle`

Produce proposal with duplicate/recurrence/cancellation handling; no meeting invitations from ICS import.

**C079 · `POST /api/v1/vaults/{vaultId}/calendar-export` — `exportCalendar`**

Access: `owner_vault`. Success: `202`.

Request: `CalendarExportInput {calendar_ids, from, to, format: ics, privacy: minimal}; Idempotency-Key`

Response: `JobHandle`

Create private export under existing export/download service; omit private prep and hidden notes by default.

#### Shared domain lifecycle

**O001 · `GET /api/v1/vaults/{vaultId}/tasks/{taskId}` — `getTask`**

Access: `tasks:read`. Success: `200`.

Request: `none`

Response: `Task`

Return canonical task, source/assignment/session links and actual state. No implicit completion.

**O002 · `GET /api/v1/vaults/{vaultId}/calendar-entities/{entityId}` — `getCalendarEntity`**

Access: `owner_vault`. Success: `200`.

Request: `none`

Response: `CalendarEntity`

Return typed shared identity, confirmed aliases and authorized source links; no inferred personal dossier.

**O003 · `DELETE /api/v1/vaults/{vaultId}/calendar-entities/{entityId}` — `archiveCalendarEntity`**

Access: `owner_vault`. Success: `204`.

Request: `If-Match`

Response: `empty`

Archive local identity after dependency preview/confirmation when referenced; preserve source provenance and unresolved commitments, never delete provider contacts.

#### School structure

**O004 · `GET /api/v1/vaults/{vaultId}/school/subjects` — `listSubjects`**

Access: `school:read`. Success: `200`.

Request: `{cursor?, limit?, filters: SubjectFilters?}`

Response: `List<Subject>`

Local subject definition with canonical scoped identity. Lists use bounded filters and show source coverage.

**O005 · `POST /api/v1/vaults/{vaultId}/school/subjects` — `createSubject`**

Access: `school:write`. Success: `201`.

Request: `{name, code?, academic_period?, source_anchor_ids?}`

Response: `Subject`

Local subject definition with canonical scoped identity. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O006 · `GET /api/v1/vaults/{vaultId}/school/subjects/{subjectId}` — `getSubject`**

Access: `school:read`. Success: `200`.

Request: `none`

Response: `Subject`

Local subject definition with canonical scoped identity. Lists use bounded filters and show source coverage.

**O007 · `PATCH /api/v1/vaults/{vaultId}/school/subjects/{subjectId}` — `updateSubject`**

Access: `school:write`. Success: `200`.

Request: `{patch: SubjectPatch, expected_revision}`

Response: `Subject`

Local subject definition with canonical scoped identity. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O008 · `DELETE /api/v1/vaults/{vaultId}/school/subjects/{subjectId}` — `archiveSubject`**

Access: `school:write`. Success: `204`.

Request: `If-Match; archive only`

Response: `empty`

Local subject definition with canonical scoped identity. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O009 · `GET /api/v1/vaults/{vaultId}/school/courses` — `listCourses`**

Access: `school:read`. Success: `200`.

Request: `{cursor?, limit?, filters: CourseFilters?}`

Response: `List<Course>`

Validate subject/person/class references. Imported course identity and school schedule remain authoritative to their source. Lists use bounded filters and show source coverage.

**O010 · `POST /api/v1/vaults/{vaultId}/school/courses` — `createCourse`**

Access: `school:write`. Success: `201`.

Request: `{name, subject_id, academic_period?, teacher_entity_ids?, class_entity_ids?, source_anchor_ids?}`

Response: `Course`

Validate subject/person/class references. Imported course identity and school schedule remain authoritative to their source. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O011 · `GET /api/v1/vaults/{vaultId}/school/courses/{courseId}` — `getCourse`**

Access: `school:read`. Success: `200`.

Request: `none`

Response: `Course`

Validate subject/person/class references. Imported course identity and school schedule remain authoritative to their source. Lists use bounded filters and show source coverage.

**O012 · `PATCH /api/v1/vaults/{vaultId}/school/courses/{courseId}` — `updateCourse`**

Access: `school:write`. Success: `200`.

Request: `{patch: CoursePatch, expected_revision}`

Response: `Course`

Validate subject/person/class references. Imported course identity and school schedule remain authoritative to their source. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O013 · `DELETE /api/v1/vaults/{vaultId}/school/courses/{courseId}` — `archiveCourse`**

Access: `school:write`. Success: `204`.

Request: `If-Match; archive only`

Response: `empty`

Validate subject/person/class references. Imported course identity and school schedule remain authoritative to their source. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O014 · `GET /api/v1/vaults/{vaultId}/school/teachers` — `listSchoolTeachers`**

Access: `school:read`. Success: `200`.

Request: `{course_id?, cursor?, limit?}`

Response: `List<TeacherView>`

Projection of authorized shared Person identities with teacher roles; create/correct identities through shared entity routes, not a duplicate teacher store.

#### School material and assessments

**O015 · `POST /api/v1/vaults/{vaultId}/school/lessons` — `createSchoolLesson`**

Access: `school:write`. Success: `201`.

Request: `{course_id, calendar_event_id?, time_spec?, room?, source_anchor_ids?}`

Response: `SchoolLesson`

Local lessons use shared calendar commands and evidence. A timetable occurrence is not an independently edited copy. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O016 · `GET /api/v1/vaults/{vaultId}/school/lessons/{schoolLessonId}` — `getSchoolLesson`**

Access: `school:read`. Success: `200`.

Request: `none`

Response: `SchoolLesson`

Local lessons use shared calendar commands and evidence. A timetable occurrence is not an independently edited copy. Lists use bounded filters and show source coverage.

**O017 · `PATCH /api/v1/vaults/{vaultId}/school/lessons/{schoolLessonId}` — `updateSchoolLesson`**

Access: `school:write`. Success: `200`.

Request: `{patch: SchoolLessonPatch, expected_revision}`

Response: `SchoolLesson`

Local lessons use shared calendar commands and evidence. A timetable occurrence is not an independently edited copy. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O018 · `DELETE /api/v1/vaults/{vaultId}/school/lessons/{schoolLessonId}` — `archiveSchoolLesson`**

Access: `school:write`. Success: `204`.

Request: `If-Match; archive only`

Response: `empty`

Local lessons use shared calendar commands and evidence. A timetable occurrence is not an independently edited copy. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O019 · `POST /api/v1/vaults/{vaultId}/school/assignments` — `createSchoolAssignment`**

Access: `school:write`. Success: `201`.

Request: `{course_id, title, instructions_source_ids?, due: DueSpec?, material_refs?, task_ids?}`

Response: `SchoolAssignment`

Keep local preparation separate from actual assignment/submission state. No submission or school-provider writes. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O020 · `PATCH /api/v1/vaults/{vaultId}/school/assignments/{schoolAssignmentId}` — `updateSchoolAssignment`**

Access: `school:write`. Success: `200`.

Request: `{patch: SchoolAssignmentPatch, expected_revision}`

Response: `SchoolAssignment`

Keep local preparation separate from actual assignment/submission state. No submission or school-provider writes. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O021 · `DELETE /api/v1/vaults/{vaultId}/school/assignments/{schoolAssignmentId}` — `archiveSchoolAssignment`**

Access: `school:write`. Success: `204`.

Request: `If-Match; archive only`

Response: `empty`

Keep local preparation separate from actual assignment/submission state. No submission or school-provider writes. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O022 · `GET /api/v1/vaults/{vaultId}/school/assessments` — `listAssessments`**

Access: `school:read`. Success: `200`.

Request: `{cursor?, limit?, filters: AssessmentFilters?}`

Response: `List<Assessment>`

Unknown date/scope/weight remains unknown; a generated practice exam is not an official assessment. Lists use bounded filters and show source coverage.

**O023 · `POST /api/v1/vaults/{vaultId}/school/assessments` — `createAssessment`**

Access: `school:write`. Success: `201`.

Request: `{course_id, title, kind, time_spec?, material_scope?, official_weight?, source_anchor_ids?}`

Response: `Assessment`

Unknown date/scope/weight remains unknown; a generated practice exam is not an official assessment. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O024 · `GET /api/v1/vaults/{vaultId}/school/assessments/{assessmentId}` — `getAssessment`**

Access: `school:read`. Success: `200`.

Request: `none`

Response: `Assessment`

Unknown date/scope/weight remains unknown; a generated practice exam is not an official assessment. Lists use bounded filters and show source coverage.

**O025 · `PATCH /api/v1/vaults/{vaultId}/school/assessments/{assessmentId}` — `updateAssessment`**

Access: `school:write`. Success: `200`.

Request: `{patch: AssessmentPatch, expected_revision}`

Response: `Assessment`

Unknown date/scope/weight remains unknown; a generated practice exam is not an official assessment. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O026 · `DELETE /api/v1/vaults/{vaultId}/school/assessments/{assessmentId}` — `archiveAssessment`**

Access: `school:write`. Success: `204`.

Request: `If-Match; archive only`

Response: `empty`

Unknown date/scope/weight remains unknown; a generated practice exam is not an official assessment. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

#### Attendance

**O027 · `GET /api/v1/vaults/{vaultId}/attendance/records` — `listAttendanceRecords`**

Access: `attendance:read`. Success: `200`.

Request: `{cursor?, limit?, filters: AttendanceRecordFilters?}`

Response: `List<AttendanceRecord>`

Preserve raw provider status, presence/excusal distinction, source coverage and owner/manual origin; never infer present from missing data. Lists use bounded filters and show source coverage.

**O028 · `POST /api/v1/vaults/{vaultId}/attendance/records` — `createAttendanceRecord`**

Access: `attendance:write`. Success: `201`.

Request: `{course_id, lesson_id?, date, time_spec?, raw_status, normalized_status, excusal_status?, duration?, units?, source_anchor_ids?}`

Response: `AttendanceRecord`

Preserve raw provider status, presence/excusal distinction, source coverage and owner/manual origin; never infer present from missing data. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O029 · `GET /api/v1/vaults/{vaultId}/attendance/records/{attendanceRecordId}` — `getAttendanceRecord`**

Access: `attendance:read`. Success: `200`.

Request: `none`

Response: `AttendanceRecord`

Preserve raw provider status, presence/excusal distinction, source coverage and owner/manual origin; never infer present from missing data. Lists use bounded filters and show source coverage.

**O030 · `PATCH /api/v1/vaults/{vaultId}/attendance/records/{attendanceRecordId}` — `updateAttendanceRecord`**

Access: `attendance:write`. Success: `200`.

Request: `{patch: AttendanceRecordPatch, expected_revision}`

Response: `AttendanceRecord`

Preserve raw provider status, presence/excusal distinction, source coverage and owner/manual origin; never infer present from missing data. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O031 · `DELETE /api/v1/vaults/{vaultId}/attendance/records/{attendanceRecordId}` — `archiveAttendanceRecord`**

Access: `attendance:write`. Success: `204`.

Request: `If-Match; archive only`

Response: `empty`

Preserve raw provider status, presence/excusal distinction, source coverage and owner/manual origin; never infer present from missing data. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O032 · `GET /api/v1/vaults/{vaultId}/attendance/summary` — `getAttendanceSummary`**

Access: `attendance:read`. Success: `200`.

Request: `{course_id?, from, to, aggregation: lessons|minutes|source_defined}`

Response: `AttendanceSummary {counts, denominator, units, coverage, excluded_unknowns, source_refs}`

Compute only meaningful comparable aggregates; expose unknowns and basis, not an official regulatory absence calculation.

**O033 · `POST /api/v1/vaults/{vaultId}/attendance/catch-up-preview` — `previewAttendanceCatchUp`**

Access: `attendance:read + school:read + study:write`. Success: `202`.

Request: `{attendance_record_ids, material_scope?, constraints?, expected_revisions}`

Response: `JobHandle`

Ground missed-lesson catch-up in actual linked material; result is a study/task Proposal with gaps, not invented lesson coverage.

#### Performance and grades

**O034 · `GET /api/v1/vaults/{vaultId}/performance/grades` — `listGrades`**

Access: `performance:read`. Success: `200`.

Request: `{cursor?, limit?, filters: GradeFilters?}`

Response: `List<Grade>`

Preserve original grade scale/unknown weights; manual annotation does not change official grades. No outcome guarantee. Lists use bounded filters and show source coverage.

**O035 · `POST /api/v1/vaults/{vaultId}/performance/grades` — `createGrade`**

Access: `performance:write`. Success: `201`.

Request: `{course_id, assessment_id?, grade_value, grade_scale, date, official_weight?, source_anchor_ids?}`

Response: `Grade`

Preserve original grade scale/unknown weights; manual annotation does not change official grades. No outcome guarantee. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O036 · `GET /api/v1/vaults/{vaultId}/performance/grades/{gradeId}` — `getGrade`**

Access: `performance:read`. Success: `200`.

Request: `none`

Response: `Grade`

Preserve original grade scale/unknown weights; manual annotation does not change official grades. No outcome guarantee. Lists use bounded filters and show source coverage.

**O037 · `PATCH /api/v1/vaults/{vaultId}/performance/grades/{gradeId}` — `updateGrade`**

Access: `performance:write`. Success: `200`.

Request: `{patch: GradePatch, expected_revision}`

Response: `Grade`

Preserve original grade scale/unknown weights; manual annotation does not change official grades. No outcome guarantee. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O038 · `DELETE /api/v1/vaults/{vaultId}/performance/grades/{gradeId}` — `archiveGrade`**

Access: `performance:write`. Success: `204`.

Request: `If-Match; archive only`

Response: `empty`

Preserve original grade scale/unknown weights; manual annotation does not change official grades. No outcome guarantee. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O039 · `GET /api/v1/vaults/{vaultId}/performance/targets` — `listPerformanceTargets`**

Access: `performance:read`. Success: `200`.

Request: `{course_id?, cursor?, limit?}`

Response: `List<PerformanceTarget>`

Return owner targets separately from school grade facts.

**O040 · `PUT /api/v1/vaults/{vaultId}/performance/targets/{courseId}` — `setPerformanceTarget`**

Access: `performance:write`. Success: `200`.

Request: `{target_value, scale, effective_period?, expected_revision}`

Response: `PerformanceTarget`

Validate scale and ownership; target does not become predicted/official grade.

**O041 · `DELETE /api/v1/vaults/{vaultId}/performance/targets/{courseId}` — `removePerformanceTarget`**

Access: `performance:write`. Success: `204`.

Request: `If-Match`

Response: `empty`

Remove owner target and invalidate dependent recommendations without deleting grades.

**O042 · `GET /api/v1/vaults/{vaultId}/performance/summary` — `getPerformanceSummary`**

Access: `performance:read`. Success: `200`.

Request: `{course_id?, from?, to?, formula_id?}`

Response: `PerformanceSummary`

Show included source grades, declared aggregate formula, missing weights, observed study outcomes and coverage; no fabricated prediction.

**O043 · `POST /api/v1/vaults/{vaultId}/performance/recommendations` — `generatePerformanceRecommendations`**

Access: `performance:read + study:read + ai:run`. Success: `202`.

Request: `{course_ids?, horizon, source_scope, goal_ids?}`

Response: `JobHandle`

Use actual targets, upcoming assessments, gaps, remaining effort and time; show factors and uncertainty. Does not schedule or modify grades.

#### Study plans and sessions

**O044 · `GET /api/v1/vaults/{vaultId}/study/plans` — `listStudyPlans`**

Access: `study:read`. Success: `200`.

Request: `{course_id?, status?, cursor?, limit?}`

Response: `List<StudyPlan>`

Return source/version/deadline/progress and scheduling proposal links.

**O045 · `POST /api/v1/vaults/{vaultId}/study/plans` — `createStudyPlan`**

Access: `study:write + source:read + ai:run`. Success: `202`.

Request: `{material_scope, course_id?, assessment_id?, task_ids?, deadline?, goals?, constraints?}`

Response: `JobHandle`

Retrieve actual source materials; create an editable draft plan and units/estimates. Exact placement goes through the shared scheduler and proposal flow.

**O046 · `GET /api/v1/vaults/{vaultId}/study/plans/{studyPlanId}` — `getStudyPlan`**

Access: `study:read`. Success: `200`.

Request: `none`

Response: `StudyPlan`

Return actual material units, state, estimates, progress, stale-source warnings and associated tasks/sessions.

**O047 · `PATCH /api/v1/vaults/{vaultId}/study/plans/{studyPlanId}` — `updateStudyPlan`**

Access: `study:write`. Success: `200`.

Request: `{patch: StudyPlanPatch, expected_revision}`

Response: `StudyPlan`

Edit user-controlled goals/units/estimates or state; source scope expansion requires authorization; no hidden external schedule write.

**O048 · `DELETE /api/v1/vaults/{vaultId}/study/plans/{studyPlanId}` — `archiveStudyPlan`**

Access: `study:write`. Success: `204`.

Request: `If-Match`

Response: `empty`

Archive plan; preview related future flexible-block cancellation rather than deleting completed history or fixed school events.

**O049 · `GET /api/v1/vaults/{vaultId}/study/sessions` — `listStudySessions`**

Access: `study:read`. Success: `200`.

Request: `{course_id?, plan_id?, state?, from?, to?, cursor?, limit?}`

Response: `List<StudySession>`

Return persisted sessions and observed activity, not inferred completion from elapsed calendar time.

**O050 · `POST /api/v1/vaults/{vaultId}/study/sessions` — `createStudySession`**

Access: `study:write`. Success: `201`.

Request: `{plan_id?, unit_ids?, task_ids?, material_scope, mode?, estimated_minutes?, calendar_event_id?}`

Response: `StudySession`

Create a session linked to canonical work and source scope; does not silently start a microphone, timer or appointment.

**O051 · `GET /api/v1/vaults/{vaultId}/study/sessions/{studySessionId}` — `getStudySession`**

Access: `study:read`. Success: `200`.

Request: `none`

Response: `StudySession`

Return source material, focus state, observed duration, responses and explicit progress.

**O052 · `POST /api/v1/vaults/{vaultId}/study/sessions/{studySessionId}/actions` — `applyStudySessionAction`**

Access: `study:write`. Success: `200`.

Request: `{action: start|pause|resume|interrupt|complete|skip, observed_at, progress?, outcome?, expected_revision}`

Response: `StudySession`

Finite legal transitions; persist active-time segments idempotently; completion requires explicit action and does not fabricate mastery.

**O053 · `DELETE /api/v1/vaults/{vaultId}/study/sessions/{studySessionId}` — `archiveStudySession`**

Access: `study:write`. Success: `204`.

Request: `If-Match`

Response: `empty`

Archive personal session with retained provenance; do not treat archive as completion or delete official lesson.

#### Study activities and tutoring

**O054 · `POST /api/v1/vaults/{vaultId}/study/activities` — `createStudyActivity`**

Access: `study:write + source:read + ai:run`. Success: `202`.

Request: `{mode: explain|socratic|active_recall|flashcards|practice|mock_exam|simple|advanced|knowledge_gaps, source_scope, session_id?, difficulty?, length?, language?}`

Response: `JobHandle`

Produce source-linked editable learning activity using actual allowed materials; preserve cited question/answer generation revisions and disclose unsupported scope.

**O055 · `GET /api/v1/vaults/{vaultId}/study/activities` — `listStudyActivities`**

Access: `study:read`. Success: `200`.

Request: `{session_id?, mode?, cursor?, limit?}`

Response: `List<StudyActivity>`

Paginated saved activities with actual source/progress state.

**O056 · `GET /api/v1/vaults/{vaultId}/study/activities/{activityId}` — `getStudyActivity`**

Access: `study:read`. Success: `200`.

Request: `none`

Response: `StudyActivity`

Return safe generated content, source references and response history with mode-specific fields.

**O057 · `POST /api/v1/vaults/{vaultId}/study/activities/{activityId}/responses` — `submitStudyResponse`**

Access: `study:write + ai:run`. Success: `202`.

Request: `{item_id, answer, response_id, expected_activity_revision, elapsed_active_seconds?}`

Response: `JobHandle`

Persist answer before grading/next-turn generation. Model feedback is nonofficial and source-linked; worker failure does not lose response. Retry cannot duplicate scoring history.

**O058 · `POST /api/v1/vaults/{vaultId}/study/activities/{activityId}/feedback` — `correctStudyFeedback`**

Access: `study:write`. Success: `201`.

Request: `{response_id, correction, source_anchor_ids?, expected_revision}`

Response: `StudyFeedbackCorrection`

Persist owner challenge/correction, preserve original response/AI assessment, invalidate dependent gap inference as appropriate.

**O059 · `DELETE /api/v1/vaults/{vaultId}/study/activities/{activityId}` — `archiveStudyActivity`**

Access: `study:write`. Success: `204`.

Request: `If-Match`

Response: `empty`

Archive activity and apply response retention; do not silently delete source notes.

#### Flashcards and knowledge gaps

**O060 · `GET /api/v1/vaults/{vaultId}/study/decks` — `listFlashcardDecks`**

Access: `study:read`. Success: `200`.

Request: `{cursor?, limit?, filters: FlashcardDeckFilters?}`

Response: `List<FlashcardDeck>`

Decks preserve source references; source changes mark affected cards stale, not rewritten historical evidence. Lists use bounded filters and show source coverage.

**O061 · `POST /api/v1/vaults/{vaultId}/study/decks` — `createFlashcardDeck`**

Access: `study:write`. Success: `201`.

Request: `{name, material_scope?, course_id?}`

Response: `FlashcardDeck`

Decks preserve source references; source changes mark affected cards stale, not rewritten historical evidence. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O062 · `GET /api/v1/vaults/{vaultId}/study/decks/{flashcardDeckId}` — `getFlashcardDeck`**

Access: `study:read`. Success: `200`.

Request: `none`

Response: `FlashcardDeck`

Decks preserve source references; source changes mark affected cards stale, not rewritten historical evidence. Lists use bounded filters and show source coverage.

**O063 · `PATCH /api/v1/vaults/{vaultId}/study/decks/{flashcardDeckId}` — `updateFlashcardDeck`**

Access: `study:write`. Success: `200`.

Request: `{patch: FlashcardDeckPatch, expected_revision}`

Response: `FlashcardDeck`

Decks preserve source references; source changes mark affected cards stale, not rewritten historical evidence. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O064 · `DELETE /api/v1/vaults/{vaultId}/study/decks/{flashcardDeckId}` — `archiveFlashcardDeck`**

Access: `study:write`. Success: `204`.

Request: `If-Match; archive only`

Response: `empty`

Decks preserve source references; source changes mark affected cards stale, not rewritten historical evidence. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O065 · `GET /api/v1/vaults/{vaultId}/study/cards` — `listFlashcards`**

Access: `study:read`. Success: `200`.

Request: `{cursor?, limit?, filters: FlashcardFilters?}`

Response: `List<Flashcard>`

Editable source-linked card. Generated cards remain labeled derivatives, not independent evidence. Lists use bounded filters and show source coverage.

**O066 · `POST /api/v1/vaults/{vaultId}/study/cards` — `createFlashcard`**

Access: `study:write`. Success: `201`.

Request: `{deck_id, prompt, answer, source_anchor_ids, status?}`

Response: `Flashcard`

Editable source-linked card. Generated cards remain labeled derivatives, not independent evidence. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O067 · `GET /api/v1/vaults/{vaultId}/study/cards/{flashcardId}` — `getFlashcard`**

Access: `study:read`. Success: `200`.

Request: `none`

Response: `Flashcard`

Editable source-linked card. Generated cards remain labeled derivatives, not independent evidence. Lists use bounded filters and show source coverage.

**O068 · `PATCH /api/v1/vaults/{vaultId}/study/cards/{flashcardId}` — `updateFlashcard`**

Access: `study:write`. Success: `200`.

Request: `{patch: FlashcardPatch, expected_revision}`

Response: `Flashcard`

Editable source-linked card. Generated cards remain labeled derivatives, not independent evidence. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O069 · `DELETE /api/v1/vaults/{vaultId}/study/cards/{flashcardId}` — `archiveFlashcard`**

Access: `study:write`. Success: `204`.

Request: `If-Match; archive only`

Response: `empty`

Editable source-linked card. Generated cards remain labeled derivatives, not independent evidence. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O070 · `GET /api/v1/vaults/{vaultId}/study/review-queue` — `getFlashcardReviewQueue`**

Access: `study:read`. Success: `200`.

Request: `{deck_id?, at?, limit?}`

Response: `List<FlashcardReviewItem>`

Use documented deterministic versioned review policy; show due basis and exclude stale/unapproved cards under policy.

**O071 · `POST /api/v1/vaults/{vaultId}/study/cards/{flashcardId}/reviews` — `recordFlashcardReview`**

Access: `study:write`. Success: `201`.

Request: `{response_id, rating, observed_at, active_seconds?, expected_card_revision}`

Response: `FlashcardReview`

Persist actual review, update next-review projection deterministically and idempotently; no claimed universal optimization.

**O072 · `GET /api/v1/vaults/{vaultId}/study/knowledge-gaps` — `listKnowledgeGaps`**

Access: `study:read`. Success: `200`.

Request: `{course_id?, material_ref?, status?, cursor?, limit?}`

Response: `List<KnowledgeGap>`

Show evidence type, uncertainty and source/material revision; reading alone is not mastery proof.

**O073 · `POST /api/v1/vaults/{vaultId}/study/knowledge-gaps` — `createReportedKnowledgeGap`**

Access: `study:write`. Success: `201`.

Request: `{course_id?, concept, material_refs?, statement, evidence_refs?}`

Response: `KnowledgeGap`

Store an explicit owner-reported gap distinct from inferred or teacher-reported evidence.

**O074 · `PATCH /api/v1/vaults/{vaultId}/study/knowledge-gaps/{gapId}` — `updateKnowledgeGap`**

Access: `study:write`. Success: `200`.

Request: `{status: confirmed|corrected|dismissed|resolved, correction?, evidence_refs?, expected_revision}`

Response: `KnowledgeGap`

Persist owner correction/suppression; invalidate plan projections as needed without erasing historical responses.

#### Deterministic scheduling

**O075 · `GET /api/v1/vaults/{vaultId}/scheduler/preferences` — `getSchedulerPreferences`**

Access: `schedule:read`. Success: `200`.

Request: `none`

Response: `SchedulerPreferences`

Protected windows, constraints, budgets and policy versions; no psychological guesses.

**O076 · `PUT /api/v1/vaults/{vaultId}/scheduler/preferences` — `setSchedulerPreferences`**

Access: `schedule:write`. Success: `200`.

Request: `{preferences: SchedulerPreferences, expected_revision}`

Response: `SchedulerPreferences`

Validate timezone, protected windows, daily limits, min/max blocks and explicit replan permissions. Change triggers a preview, not silent external writes.

**O077 · `POST /api/v1/vaults/{vaultId}/scheduler/preview` — `previewSchedule`**

Access: `schedule:write`. Success: `202`.

Request: `{task_ids?, study_plan_id?, horizon, constraint_overrides?, expected_input_revisions}`

Response: `JobHandle`

Run deterministic shared scheduler and persist Proposal with blocks, unscheduled effort, unknown availability and reason codes. Calendar preparation endpoint delegates here.

**O078 · `POST /api/v1/vaults/{vaultId}/scheduler/replan` — `previewReplan`**

Access: `schedule:write`. Success: `202`.

Request: `{affected_task_ids?, trigger, horizon, expected_input_revisions}`

Response: `JobHandle`

Preserve fixed/started/completed/locked work; minimize churn, deduplicate triggers and retain capacity shortfall. Apply only through shared proposal/policy checks.

**O079 · `GET /api/v1/vaults/{vaultId}/scheduler/recommendations` — `getNextActionCandidates`**

Access: `schedule:read + authorized source domain reads`. Success: `200`.

Request: `{available_minutes?, at?, course_id?, limit?}`

Response: `List<NextAction>`

Deterministic available candidate selection with evidence, estimates and reason codes; no mutation, hidden inference or ungranted grade/profile read.

#### Memory

**O080 · `GET /api/v1/vaults/{vaultId}/memories` — `listMemories`**

Access: `memory:read`. Success: `200`.

Request: `{cursor?, limit?, filters: MemoryFilters?}`

Response: `List<Memory>`

Owner confirmation/correction never destroys evidence history. Inferred entries remain qualified; candidate inferences need source and suppression policy. Lists use bounded filters and show source coverage.

**O081 · `POST /api/v1/vaults/{vaultId}/memories` — `createMemory`**

Access: `memory:write`. Success: `201`.

Request: `{kind: fact|preference|goal|workflow|project_context|interest, value, entity_refs?, evidence_refs?, status: explicit|inferred|recommended}`

Response: `Memory`

Owner confirmation/correction never destroys evidence history. Inferred entries remain qualified; candidate inferences need source and suppression policy. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O082 · `GET /api/v1/vaults/{vaultId}/memories/{memoryId}` — `getMemory`**

Access: `memory:read`. Success: `200`.

Request: `none`

Response: `Memory`

Owner confirmation/correction never destroys evidence history. Inferred entries remain qualified; candidate inferences need source and suppression policy. Lists use bounded filters and show source coverage.

**O083 · `PATCH /api/v1/vaults/{vaultId}/memories/{memoryId}` — `updateMemory`**

Access: `memory:write`. Success: `200`.

Request: `{patch: MemoryPatch, expected_revision}`

Response: `Memory`

Owner confirmation/correction never destroys evidence history. Inferred entries remain qualified; candidate inferences need source and suppression policy. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O084 · `DELETE /api/v1/vaults/{vaultId}/memories/{memoryId}` — `archiveMemory`**

Access: `memory:write`. Success: `204`.

Request: `If-Match; archive only`

Response: `empty`

Owner confirmation/correction never destroys evidence history. Inferred entries remain qualified; candidate inferences need source and suppression policy. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O085 · `POST /api/v1/vaults/{vaultId}/memories/{memoryId}/purge` — `purgeMemory`**

Access: `memory:write + owner_reauth`. Success: `202`.

Request: `{confirmation, expected_revision}`

Response: `JobHandle`

Purge memory and its derivatives under dependency policy; remove semantic indexes/caches and prevent reimport through persisted suppression.

#### Personal profile and interests

**O086 · `GET /api/v1/vaults/{vaultId}/personal-profile` — `getPersonalProfile`**

Access: `profile:read`. Success: `200`.

Request: `{at?, include_evidence?: boolean}`

Response: `PersonalProfile`

Inspectable evidence-based projection of interests/preferences/goals/projects/current focus; no inferred sensitive psychological traits.

**O087 · `POST /api/v1/vaults/{vaultId}/personal-profile/refresh` — `refreshPersonalProfile`**

Access: `profile:write + personal-data:read + ai:run`. Success: `202`.

Request: `{window, source_scope, expected_profile_revision?}`

Response: `JobHandle`

Analyze authorized observations; persist inferred candidates/insights with source/coverage rather than permanent confirmed preferences. Respect dismissals and decay.

**O088 · `GET /api/v1/vaults/{vaultId}/interests` — `listInterests`**

Access: `profile:read`. Success: `200`.

Request: `{status?, cursor?, limit?}`

Response: `List<Interest>`

Separate observed evidence, tentative trend and confirmed preference; state metric/coverage for any numbers.

**O089 · `GET /api/v1/vaults/{vaultId}/interests/{interestId}` — `getInterest`**

Access: `profile:read`. Success: `200`.

Request: `none`

Response: `Interest {evidence, metrics, status, confidence_semantics, suppression, revision}`

Open exact supporting permitted observations and qualifications; no ungranted source details.

**O090 · `PATCH /api/v1/vaults/{vaultId}/interests/{interestId}` — `updateInterest`**

Access: `profile:write`. Success: `200`.

Request: `{action: confirm|correct|dismiss, value?, reason?, expected_revision}`

Response: `Interest`

Store owner decision, field locks and suppression; one interaction cannot become a permanent preference automatically.

**O091 · `POST /api/v1/vaults/{vaultId}/interests/{interestId}/purge` — `purgeInterest`**

Access: `profile:write + owner_reauth`. Success: `202`.

Request: `{confirmation, expected_revision, evidence_policy}`

Response: `JobHandle`

Purge derived interest and specified owned evidence under explicit preview; do not silently delete unrelated source notes.

#### Personal data

**O092 · `GET /api/v1/vaults/{vaultId}/personal-data/items` — `listPersonalDataItems`**

Access: `personal-data:read`. Success: `200`.

Request: `{provider?, account_id?, action?, from?, to?, cursor?, limit?}`

Response: `List<PersonalDataItem>`

Return actual normalized observations with interaction semantics, timestamps and coverage, not inferred watch history.

**O093 · `GET /api/v1/vaults/{vaultId}/personal-data/items/{itemId}` — `getPersonalDataItem`**

Access: `personal-data:read`. Success: `200`.

Request: `none`

Response: `PersonalDataItem`

Expose provenance and exact known semantics, not credential/session artifacts.

**O094 · `POST /api/v1/vaults/{vaultId}/personal-data/purge-preview` — `previewPersonalDataPurge`**

Access: `personal-data:write + owner_reauth`. Success: `201`.

Request: `{selection: PersonalDataFilter, expected_revisions?, retention_choice}`

Response: `Proposal`

Preview affected observations, memories, interests, indexes and summaries. Execute with shared proposal acceptance and tombstones.

**O095 · `POST /api/v1/vaults/{vaultId}/personal-data/import-preview` — `previewPersonalDataImport`**

Access: `personal-data:write`. Success: `202`.

Request: `{blob_id, provider_key, export_format, account_label, source_time?, mappings?}`

Response: `JobHandle`

Use an actually supported export parser, preserve unknown fields/coverage and show mapping preview. Applying uses shared import/proposal logic.

**O096 · `POST /api/v1/vaults/{vaultId}/personal-data/sync` — `syncPersonalData`**

Access: `personal-data:write + connections:sync`. Success: `202`.

Request: `{connection_ids, incremental: boolean, window?}`

Response: `JobHandle`

Fan out only to authorized selected adapters, record actual cursors/counts and per-source failures; does not grant missing permissions.

**O097 · `GET /api/v1/vaults/{vaultId}/personal-data/policies` — `getPersonalDataPolicies`**

Access: `profile:read`. Success: `200`.

Request: `none`

Response: `PersonalDataPolicies`

Return enabled source/analysis types, retention, weekly sync and privacy settings; no secrets.

**O098 · `PUT /api/v1/vaults/{vaultId}/personal-data/policies` — `setPersonalDataPolicies`**

Access: `profile:write + owner_reauth`. Success: `200`.

Request: `{policies, expected_revision, disclosure_confirmation?}`

Response: `PersonalDataPolicies`

Explicitly enable/disable interest analysis, retention and scheduled aggregation; scheduling a source cannot grant inaccessible history.

#### Projects and ideas

**O099 · `GET /api/v1/vaults/{vaultId}/ideas` — `listIdeas`**

Access: `notes:read`. Success: `200`.

Request: `{cursor?, limit?, filters: IdeaFilters?}`

Response: `List<Idea>`

Use typed shared entity/label identity and preserve original capture. Promotion/merge goes through preview. Lists use bounded filters and show source coverage.

**O100 · `POST /api/v1/vaults/{vaultId}/ideas` — `createIdea`**

Access: `notes:write`. Success: `201`.

Request: `{title, note_ids?, description?, entity_refs?, evidence_refs?}`

Response: `Idea`

Use typed shared entity/label identity and preserve original capture. Promotion/merge goes through preview. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O101 · `GET /api/v1/vaults/{vaultId}/ideas/{ideaId}` — `getIdea`**

Access: `notes:read`. Success: `200`.

Request: `none`

Response: `Idea`

Use typed shared entity/label identity and preserve original capture. Promotion/merge goes through preview. Lists use bounded filters and show source coverage.

**O102 · `PATCH /api/v1/vaults/{vaultId}/ideas/{ideaId}` — `updateIdea`**

Access: `notes:write`. Success: `200`.

Request: `{patch: IdeaPatch, expected_revision}`

Response: `Idea`

Use typed shared entity/label identity and preserve original capture. Promotion/merge goes through preview. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O103 · `DELETE /api/v1/vaults/{vaultId}/ideas/{ideaId}` — `archiveIdea`**

Access: `notes:write`. Success: `204`.

Request: `If-Match; archive only`

Response: `empty`

Use typed shared entity/label identity and preserve original capture. Promotion/merge goes through preview. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O104 · `GET /api/v1/vaults/{vaultId}/projects` — `listProjects`**

Access: `notes:read`. Success: `200`.

Request: `{cursor?, limit?, filters: ProjectFilters?}`

Response: `List<Project>`

Reuse existing project identity and canonical tasks/notes; projections must not diverge from legacy project labels. Lists use bounded filters and show source coverage.

**O105 · `POST /api/v1/vaults/{vaultId}/projects` — `createProject`**

Access: `notes:write`. Success: `201`.

Request: `{name, idea_ids?, note_ids?, goal_memory_ids?, existing_project_label_id?}`

Response: `Project`

Reuse existing project identity and canonical tasks/notes; projections must not diverge from legacy project labels. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O106 · `GET /api/v1/vaults/{vaultId}/projects/{projectId}` — `getProject`**

Access: `notes:read`. Success: `200`.

Request: `none`

Response: `Project`

Reuse existing project identity and canonical tasks/notes; projections must not diverge from legacy project labels. Lists use bounded filters and show source coverage.

**O107 · `PATCH /api/v1/vaults/{vaultId}/projects/{projectId}` — `updateProject`**

Access: `notes:write`. Success: `200`.

Request: `{patch: ProjectPatch, expected_revision}`

Response: `Project`

Reuse existing project identity and canonical tasks/notes; projections must not diverge from legacy project labels. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O108 · `DELETE /api/v1/vaults/{vaultId}/projects/{projectId}` — `archiveProject`**

Access: `notes:write`. Success: `204`.

Request: `If-Match; archive only`

Response: `empty`

Reuse existing project identity and canonical tasks/notes; projections must not diverge from legacy project labels. Source-owned fields are read-only; mutations affect owner-authored records/annotations only. Archive is not remote deletion.

**O109 · `POST /api/v1/vaults/{vaultId}/ideas/{ideaId}/promotion-preview` — `previewIdeaPromotion`**

Access: `notes:write`. Success: `201`.

Request: `{target_project_id?, new_project_name?, expected_revisions}`

Response: `Proposal`

Preview linking/creating project without deleting the original idea; execute via shared proposal acceptance.

#### Insights and review

**O110 · `GET /api/v1/vaults/{vaultId}/insights` — `listInsights`**

Access: `insights:read plus source-specific grants`. Success: `200`.

Request: `{kind?, from?, to?, cursor?, limit?}`

Response: `List<AIInsight>`

List generated reviews/recommendations with scope, actual source coverage and freshness.

**O111 · `POST /api/v1/vaults/{vaultId}/insights` — `generateInsight`**

Access: `insights:write + ai:run plus source-specific grants`. Success: `202`.

Request: `{kind: weekly_review|project_review|study_pattern|interest_trend, window, scope}`

Response: `JobHandle`

Generate evidence-linked insight with explicit limits and original source manifest; no causal or psychological overclaim, no automatic external action.

**O112 · `GET /api/v1/vaults/{vaultId}/insights/{insightId}` — `getInsight`**

Access: `insights:read plus source-specific grants`. Success: `200`.

Request: `none`

Response: `AIInsight`

Recheck source/domain access and reveal stale/missing evidence rather than cached unauthorized excerpts.

**O113 · `PATCH /api/v1/vaults/{vaultId}/insights/{insightId}` — `updateInsightFeedback`**

Access: `insights:write`. Success: `200`.

Request: `{state: seen|dismissed|pinned, annotation?, expected_revision}`

Response: `AIInsight`

Save owner feedback/annotation separately from generated content; preserve prior revisions.

**O114 · `DELETE /api/v1/vaults/{vaultId}/insights/{insightId}` — `archiveInsight`**

Access: `insights:write`. Success: `204`.

Request: `If-Match`

Response: `empty`

Hide/archive generated insight without deleting underlying originals.

#### Transcripts

**O115 · `GET /api/v1/vaults/{vaultId}/transcripts` — `listTranscripts`**

Access: `notes:read`. Success: `200`.

Request: `{course_id?, lesson_id?, source?, cursor?, limit?}`

Response: `List<Transcript>`

Projection of canonical audio/extraction sources; no duplicate transcript store detached from originals.

**O116 · `GET /api/v1/vaults/{vaultId}/transcripts/{transcriptId}` — `getTranscript`**

Access: `notes:read`. Success: `200`.

Request: `{revision_id?}`

Response: `Transcript`

Return timestamped segments, unknown/confirmed speaker labels, source link and association evidence.

**O117 · `PATCH /api/v1/vaults/{vaultId}/transcripts/{transcriptId}` — `correctTranscript`**

Access: `notes:write`. Success: `200`.

Request: `{segment_edits?, speaker_label_corrections?, expected_revision}`

Response: `Transcript`

Create a new extraction revision, retain original audio and previous text/anchors; no invented timestamp corrections.

**O118 · `POST /api/v1/vaults/{vaultId}/transcripts/{transcriptId}/lesson-association` — `associateTranscriptWithLesson`**

Access: `notes:write + school:write`. Success: `201`.

Request: `{lesson_id, evidence_refs?, expected_revision}`

Response: `TranscriptAssociation`

Persist explicit owner association and its provenance; do not edit official timetable or assume a speaker identity.

**O119 · `POST /api/v1/vaults/{vaultId}/transcripts/{transcriptId}/analysis` — `analyzeTranscript`**

Access: `notes:read + ai:run`. Success: `202`.

Request: `{scope: concept_summary|instructions|homework|dates|questions|all, expected_revision}`

Response: `JobHandle`

Extract evidence-backed candidates into existing source/proposal pipeline; no automatic school mutations or recording.

#### Provider callbacks

**O120 · `GET /api/v1/oauth/google/callback` — `googleOAuthCallback`**

Access: `oauth_state_bound`. Success: `302`.

Request: `provider callback query; persisted one-time state and exact redirect binding`

Response: `Safe redirect or safe error page`

Bind to connection/owner/PKCE transaction. Verify against actual documented Google flow; not a generic token forwarding endpoint.

**O121 · `POST /api/v1/integrations/google/notifications` — `googleChangeNotifications`**

Access: `verified provider subscription`. Success: `204`.

Request: `documented headers/payload for registered subscription`

Response: `empty or provider-documented acknowledgment`

Validate actual provider-specific notification contract, map registered channel/resource and enqueue reconciliation durably. No inference in handler; no invented universal webhook payload.

**O122 · `GET /api/v1/oauth/personal/{providerKey}/callback` — `personalProviderOAuthCallback`**

Access: `oauth_state_bound`. Success: `302`.

Request: `registered-provider callback fields bound to persisted state`

Response: `Safe redirect or safe error page`

Only a compiled/configured allowlist of actually supported OAuth adapters. Unknown provider keys fail. No arbitrary destination, cookie import or implicit provider identity.

#### AI mode and provider permissions

**O123 · `GET /api/v1/vaults/{vaultId}/ai/policy` — `getVaultAiPolicy`**

Access: `owner_vault`. Success: `200`.

Request: `none`

Response: `VaultAiPolicy`

Show enabled local/cloud backend, purposes, limits and disclosure. Default cloud disabled; local-only vault absent from cloud routes.

**O124 · `POST /api/v1/vaults/{vaultId}/ai/disclosure-preview` — `previewAiDisclosure`**

Access: `owner_vault`. Success: `200`.

Request: `{provider_connection_id, purpose, scope, limits}`

Response: `DisclosurePreview`

Show exact proposed data boundary/provider/settings without sending content; local-only boundary crossing requires separate approved export/mode change.

**O125 · `PUT /api/v1/vaults/{vaultId}/ai/policy` — `setVaultAiPolicy`**

Access: `owner_reauth`. Success: `200`.

Request: `{policy: VaultAiPolicy, expected_revision, disclosure_preview_id?, explicit_consent?}`

Response: `VaultAiPolicy`

Validate purpose/vault/backend eligibility and budgets. Never authorize cloud automatically after a local failure; enabling sync does not enable inference.

#### Commands and tool routing

**O126 · `POST /api/v1/vaults/{vaultId}/commands` — `runCommand`**

Access: `commands:run plus resolved tool grants`. Success: `202`.

Request: `{text, context: CommandContext, mode: answer|propose|execute_allowed, allowed_scope, client_request_id}`

Response: `JobHandle`

Route through finite domain tools, preserve original request, permission-check before effects and return answer plus separate proposed/applied commands. No unrestricted host access.

**O127 · `GET /api/v1/vaults/{vaultId}/agent-tools` — `listAgentTools`**

Access: `owner_vault or tools:read`. Success: `200`.

Request: `{domain?}`

Response: `List<ToolDescriptor>`

Expose actual supported tool schemas, read/propose/write grants and capability state; unavailable tools not advertised as executable.

**O128 · `POST /api/v1/vaults/{vaultId}/tool-runs` — `runDomainTool`**

Access: `tools:run plus tool-specific grants`. Success: `202`.

Request: `{tool_name, input: discriminated ToolInput, mode, expected_revisions?, approved_proposal_id?}`

Response: `JobHandle`

Validate allowlisted tool schema, scoped records, source trust and policy. Only approved exact external payload may execute; no arbitrary command/URL/credential input.

### A.4 Native commands

These are scoped native IPC/local-service commands, not public HTTP routes. Local domain methods otherwise use the same validated contracts against local storage.

**`capture.open`** — Open configurable quick-capture window. No implicit clipboard read or content upload.

**`clipboard.capture_selection`** — Capture on deliberate user command. Read only the explicitly requested clipboard payload.

**`vault.create_local`** — Create local-only vault. No cloud registration or outbound event.

**`vault.sync_preview`** — Preview enabling/disabling cloud sync. Show exactly which data, attachments, and derivatives would be uploaded or remain remotely.

**`vault.enable_sync`** — Apply approved cloud configuration. Explicit owner consent; authenticated hub; initial upload resumable.

**`vault.disable_sync`** — Stop future synchronization. Clearly distinguish stopping sync from removing the remote copy.

**`folder_watch.list`** — List local allowed-folder watches. Do not transmit local paths to the hub.

**`folder_watch.create`** — Select folder, exclusions, and preview import. Native picker and canonical allowed path; no remote path strings.

**`folder_watch.update`** — Pause/change an existing watch. Reconfirm any expanded filesystem scope.

**`folder_watch.delete`** — Stop a watch. Does not erase imported notes or source files.

**`model.inspect`** — Inspect installed local models and runtime. Loopback or explicitly paired private runtime only.

**`model.install`** — Install approved registry model after consent. Pinned digest, disk check, bounded progress/cancellation; no arbitrary download URL.

**`model.test`** — Run real capability/embedding test. Report actual result and measured resource usage.

**`worker.configure`** — Pause, resume, or set resource policy. No arbitrary native commands or source scripts.

**`audio.record`** — Start/stop deliberate voice capture. Visible microphone state and durable original audio.

**`file.import`** — Import user-selected supported files. Same capture/import service contract as cloud; preserve originals.

**`export.save`** — Save authorized bundle to chosen path. Native save picker; path never chosen by an LLM.

**`backup.configure`** — Configure local backup destination and retention. Explicit path/key handling; no automatic unapproved cloud destination.

**`backup.run`** — Create consistent local backup. Use safe SQLite snapshot and complete blob manifest.

**`backup.restore`** — Preview and restore local backup. Validate first, confirmation, maintenance mode; no silent overwrite.

**`reminders.deliver`** — Deliver due local notification. Permission-aware, deduplicated; record missed delivery honestly.

**`app.update`** — Check/apply authenticated application update. Verified update artifact; preserve vaults and rollback/recovery path.

**`launch_calendar_view`** — Direct navigation in the same integrated app. No duplicate database, provider write or implied source disclosure.

**`open_calendar_event`** — Direct navigation in the same integrated app. No duplicate database, provider write or implied source disclosure.

**`open_commitment`** — Direct navigation in the same integrated app. No duplicate database, provider write or implied source disclosure.

**`navigate_to_event_source`** — Direct navigation in the same integrated app. No duplicate database, provider write or implied source disclosure.

**`focus.control`** — Start/pause/resume/finish the canonical study session. Use validated domain transitions; no false completion or unrestricted timer commands.

**`app.open_workspace`** — Open a registered application workspace/deep link. Allowlist routes, validate IDs/scopes, no arbitrary URL or native execution.

**`personal_export.import`** — Select a personal-data export and preview import. Native picker, tested parser, shared import/proposal pipeline; no account-cookie extraction.

### A.5 Local MCP and structured CLI tools

Each tool calls the same service/policy layer; grant read/propose/write separately. CLI commands use the same finite input/output schemas and machine-readable error envelope. Private output can be disclosed to the calling client, including an external model it uses.

**`capture_note`** · Grant `capture:write` · Input `capture contract + vault_id` · Output `CaptureReceipt`. 

**`search_notes`** · Grant `search:read` · Input `search contract + vault_id` · Output `SearchResult or JobHandle`. 

**`get_note`** · Grant `notes:read` · Input `vault_id, note_id, optional revision_id` · Output `Note + requested document representation`. 

**`ask_notes`** · Grant `ask:run` · Input `vault_id, question, SearchScope, queue_when_offline` · Output `AskHandle; bounded polling returns Message when complete`. 

**`list_collections`** · Grant `notes:read` · Input `vault_id, cursor?, limit?` · Output `List<Collection>`. 

**`get_job`** · Grant `jobs:read` · Input `vault_id, job_id` · Output `Job with typed result or terminal error`. 

**`cancel_job`** · Grant `jobs:write` · Input `vault_id, job_id` · Output `Job with actual cancellation state`. 

**`calendar_find`** · Grant `read` · Input `typed vault/scoped calendar or commitment input` · Output `typed result or Proposal/JobHandle`. Structured calendar search with scope and freshness.

**`calendar_context`** · Grant `read_private` · Input `typed vault/scoped calendar or commitment input` · Output `typed result or Proposal/JobHandle`. Read private prep only within authorized vault; warn that external AI clients may receive it.

**`commitments_find`** · Grant `read` · Input `typed vault/scoped calendar or commitment input` · Output `typed result or Proposal/JobHandle`. Find active source-backed commitments.

**`calendar_propose`** · Grant `proposal_only` · Input `typed vault/scoped calendar or commitment input` · Output `typed result or Proposal/JobHandle`. Persist a proposal; never use tool output to imply invitation authority.

**`school_find`** · Grant `school:read` · Input `vault_id, bounded course/assignment/lesson query` · Output `SchoolSearchResult`. Source ownership and freshness; grades/attendance require separate grants.

**`school_attendance`** · Grant `attendance:read` · Input `vault_id, bounded course/date range` · Output `AttendanceSummary`. Unknown coverage is visible; no school writes.

**`study_create_plan`** · Grant `study:write + ai:run` · Input `vault_id, material_scope, goal, constraints` · Output `JobHandle`. Evidence-grounded draft; scheduler preview/acceptance is separate.

**`study_next_action`** · Grant `schedule:read` · Input `vault_id, available_minutes?, at?` · Output `NextAction[]`. Read-only recommendations, not scheduling authority.

**`performance_summary`** · Grant `performance:read` · Input `vault_id, course_id?, range` · Output `PerformanceSummary`. Descriptive verified records, no promised grade.

**`brain_add_memory`** · Grant `memory:write` · Input `vault_id, typed value, evidence, epistemic_status` · Output `Memory or Proposal`. Owner text/confirmed authority separate from tool client inference.

**`brain_memories`** · Grant `memory:read` · Input `vault_id, query, scope, limit` · Output `Memory[]`. Evidence-linked and scoped.

**`personal_data_sync`** · Grant `personal-data:write + connections:sync` · Input `vault_id, connection_ids` · Output `JobHandle`. Only already authorized selected sources; no new grants.

**`personal_interest_profile`** · Grant `profile:read` · Input `vault_id, scope?` · Output `PersonalProfile`. Private content may be disclosed to the invoking external client; explicit access grant.

### A.6 Realtime and common failures

Version the existing handshake/auth/subscribe/state-vector/document-update/ack/conflict/tombstone/resync/ping/pong/error frames. Note bodies use Yjs encodings; structured records use revision-checked commands. Keep `/events` as the authorized change stream, not the calendar collection.

SSE events include job lifecycle, source/note changed/trashed/purged, search results, answer delta/sources, reminder due, calendar changes, study progress and source-access changes. Streams carry bounded typed payloads, event IDs and resumable cursors. A disconnected stream is not proof of job failure or success; recover from durable status. Only a persisted final answer with validated citations is complete.

Test expired/revoked/wrong-vault credentials, invalid schema, stale revision, unknown/trashed/purged source, reused idempotency key with changed input, upload hash mismatch, missing model, unavailable worker, invalid model JSON, cancelled/expired lease, source access revoked, missing admin/provider consent, throttling, stale calendar preview, unresolved date/identity, capacity shortfall and expired sync cursor. Sanitize errors and never report a dependency-blocked action as completed.


---

## Appendix B. Source-to-specification coverage

This map is a consolidation check, not proof of implementation. Every one of the uploaded Personal OS document's 62 sections is retained within the indicated integrated module. Explicit scope/default changes are recorded in section 2; no alternate-stack suggestion requires rewriting the established codebase.

| Uploaded section | Integrated sections | Merge handling |
|---|---|---|
| 1. Product Vision | 1, 2, 3 | Retained in shared domain/services; no separate app or data store. |
| 2. Core Product Loop | 1, 5, 15 | Retained in shared domain/services; no separate app or data store. |
| 3. Universal Inbox | 5 | Retained in shared domain/services; no separate app or data store. |
| 4. AI Classification | 6, 23 | Retained in shared domain/services; no separate app or data store. |
| 5. Personal Knowledge Base / Second Brain | 6, 7 | Retained in shared domain/services; no separate app or data store. |
| 6. School System | 11 | Retained in shared domain/services; no separate app or data store. |
| 7. Teams Integration | 19, 20 | Retained in shared domain/services; no separate app or data store. |
| 8. Visma InSchool Integration | 19, 20 | Retained in shared domain/services; no separate app or data store. |
| 9. Attendance System | 12 | Added first-class module; sensitive imports separately enabled and source-owned data read-only. |
| 10. Grade & Performance System | 13 | Added first-class module; sensitive imports separately enabled and source-owned data read-only. |
| 11. AI Study Planner | 14, 15 | Retained in shared domain/services; no separate app or data store. |
| 12. Study Modes | 14 | Retained in shared domain/services; no separate app or data store. |
| 13. Deterministic Scheduling Engine | 15 | Retained in shared domain/services; no separate app or data store. |
| 14. ADHD-Friendly Execution UX | 4, 10, 14 | Retained in shared domain/services; no separate app or data store. |
| 15. Automatic Replanning | 15 | Retained in shared domain/services; no separate app or data store. |
| 16. Calendar | 8, 9 | Retained in shared domain/services; no separate app or data store. |
| 17. Calendar Integrations | 20, 25 | Google provider added to the existing local/Microsoft calendar abstraction. |
| 18. Social / People System | 9, 16 | Retained in shared domain/services; no separate app or data store. |
| 19. Personal Digital Profile | 16, 17 | Retained in shared domain/services; no separate app or data store. |
| 20. Social Media / Personal Data Integrations | 19, 21 | Named optional provider/adapter roles retained; actual package/API/capability verified before activation. |
| 21. Maxun Integration | 21 | Named optional provider/adapter roles retained; actual package/API/capability verified before activation. |
| 22. Firecrawl Integration | 21 | Named optional provider/adapter roles retained; actual package/API/capability verified before activation. |
| 23. Anakin OSS | 21 | Named optional provider/adapter roles retained; actual package/API/capability verified before activation. |
| 24. Weekly Personal Data Sync | 18, 19 | Weekly personal aggregation retained; operational source freshness is not reduced to weekly. |
| 25. Personal Data Normalization | 17, 19, 26 | Retained in shared domain/services; no separate app or data store. |
| 26. Interest Detection | 17 | Evidence/confidence retained; illustrative percentages are not treated as calibrated facts. |
| 27. Second Brain Memory | 16 | Retained in shared domain/services; no separate app or data store. |
| 28. AI Agent Architecture | 23 | Retained in shared domain/services; no separate app or data store. |
| 29. CLI-Anything Compatibility | 23, 29 | Retained in shared domain/services; no separate app or data store. |
| 30. Security & Privacy | 24, 30 | Local default retained; optional cloud mode requires explicit per-vault/purpose consent. |
| 31. Permission Model | 3, 9, 19, 23, 25 | Retained in shared domain/services; no separate app or data store. |
| 32. AI Action Log | 23, 28 | Retained in shared domain/services; no separate app or data store. |
| 33. Dashboard | 4, 18 | Retained in shared domain/services; no separate app or data store. |
| 34. Navigation | 4 | All modules available; small pinned navigation with progressive disclosure. |
| 35. AI Command Bar | 4, 23 | Retained in shared domain/services; no separate app or data store. |
| 36. Weekly AI Insights | 18 | Retained in shared domain/services; no separate app or data store. |
| 37. Adaptive Scheduling / Momentum Engine | 14, 15, 18 | Retained in shared domain/services; no separate app or data store. |
| 38. Data Model | 26 | Retained in shared domain/services; no separate app or data store. |
| 39. Source & Evidence Model | 3, 7, 26 | Evidence/confidence retained; illustrative percentages are not treated as calibrated facts. |
| 40. LLM Architecture | 23, 24 | Local default retained; optional cloud mode requires explicit per-vault/purpose consent. |
| 41. RAG Architecture | 7 | Retained in shared domain/services; no separate app or data store. |
| 42. Meetly / Audio Integration | 22 | Named optional provider/adapter roles retained; actual package/API/capability verified before activation. |
| 43. Web Knowledge Ingestion | 7, 21 | Retained in shared domain/services; no separate app or data store. |
| 44. UX Principles | 4 | Retained in shared domain/services; no separate app or data store. |
| 45. No Fake Functionality | 3, 31, 33 | Retained in shared domain/services; no separate app or data store. |
| 46. Integration Health | 19, 20, 21 | Retained in shared domain/services; no separate app or data store. |
| 47. Error Handling | 28, 29, 30 | Retained in shared domain/services; no separate app or data store. |
| 48. LLM Structured Output | 23, 29 | Retained in shared domain/services; no separate app or data store. |
| 49. Architecture Principles | 3, 19, 23, 27, 28, 30 | Retained in shared domain/services; no separate app or data store. |
| 50. Suggested Technical Architecture | 2, 27 | Retain the existing concrete stack; preserve repository-first reuse instruction. |
| 51. Core Services | 27 | Retained in shared domain/services; no separate app or data store. |
| 52. Background Workers | 18, 28 | Retained in shared domain/services; no separate app or data store. |
| 53. User Control | 6, 16, 17, 19, 30 | Retained in shared domain/services; no separate app or data store. |
| 54. Personal Profile UI | 17 | Evidence/confidence retained; illustrative percentages are not treated as calibrated facts. |
| 55. Search | 7 | Retained in shared domain/services; no separate app or data store. |
| 56. Projects & Ideas | 6 | Retained in shared domain/services; no separate app or data store. |
| 57. Development Seed Mode | 31 | Retained in shared domain/services; no separate app or data store. |
| 58. Testing | 31 | Retained in shared domain/services; no separate app or data store. |
| 59. Definition of Done | 31, 33 | Retained in shared domain/services; no separate app or data store. |
| 60. Implementation Strategy | 32 | Integrated delivery sequence preserves all feature groups instead of parallel roadmaps. |
| 61. First Development Task | 32, 33 | Retained in shared domain/services; no separate app or data store. |
| 62. Final Product Principle | 1, 33 | Retained in shared domain/services; no separate app or data store. |

### Retained Sorta Notes foundation

| Prior responsibility | Unified sections |
|---|---|
| Product contract, canonical originals, initial scope | 1, 2, 3 |
| Capture, library, editor, Find/Ask/Make, Today and settings | 4, 5, 6, 7 |
| Librarian, corrections, duplicate/split/merge rules | 6 |
| Tasks, dates, reminders, quiet resurfacing | 9, 10, 18 |
| Attachments, RAG, historical citations, source deletion | 7, 22, 28, 30 |
| Small-model setup, resource policy and actual evaluation | 23, 31 |
| Hybrid cloud and local-only availability | 24 |
| Retained architecture, storage, one write path, sync and jobs | 26, 27, 28 |
| API completeness, REST/MCP/native interface | 23, 29 |
| Imports, watching, full-fidelity exports and recovery | 5, 7, 30 |
| Security and truthful acceptance/delivery | 3, 30, 31, 32, 33 |

### Retained Sorta Calendar foundation

| Prior responsibility | Unified sections |
|---|---|
| Integrated launch routes and familiar calendar interface | 2, 4, 8 |
| Book-return positive scenario and Hanako/Ember/Embers negative scenario | 9 |
| TimeSpec, DST, statement references, recurrence and cancellations | 8, 9 |
| Bounded automatic plans, commitments, private prep and reminders | 9, 10, 25 |
| School context, source-owned schedule and preparation plans | 11, 14, 15 |
| Microsoft/InSchool capabilities and source freshness | 19, 20 |
| Provider outbox, invitation consent, private sidecar | 25 |
| Offline/local-only boundaries and source deletion | 24, 28, 30 |
| Shared schema, domain commands and release evidence | 26, 27, 29, 31, 33 |

All original notes and calendar operation IDs are retained in Appendix A. Their shared schemas/scopes are broadened explicitly where required, not duplicated under parallel services. Provider assumptions from older references remain verification tasks; no new live verification occurred during this merge.


---

## Appendix C. Acceptance scenarios

There are **133 scenario requirements** below: 16 retained notes functional gates, 62 retained calendar gates and 55 merged-product gates. They supplement per-operation contract/security tests and the measured evaluation targets. They are **not executed or passed application tests**.

### C.1 Retained notes functional gates

**NOTE-01** — Capture text while the model and network are disabled; restart the app and recover it unchanged.

**NOTE-02** — Sync a captured note and its original attachment to a second authenticated client.

**NOTE-03** — Paste the same text using the same idempotency key several times; create one capture.

**NOTE-04** — Edit the same note on two offline devices; reconnect and verify convergence, history, and source mapping.

**NOTE-05** — Complete an inferred task only after acceptance and verify the source relationship.

**NOTE-06** — Correct a filing decision; reindex/reclassify and verify that the correction remains respected.

**NOTE-07** — Ask a supported question; every displayed citation opens the exact authorized source revision.

**NOTE-08** — Ask an unanswerable question; the app abstains rather than inventing personal history.

**NOTE-09** — Stop the worker mid-job; lease recovery does not duplicate generated notes or associations.

**NOTE-10** — Edit a note while classification runs; the obsolete result cannot overwrite current content or locks.

**NOTE-11** — Delete/purge a source; test search indexes, caches, conversations, sync tombstones, and citation behavior.

**NOTE-12** — Simulate a different owner/vault credential on every resource family; no content or existence leaks.

**NOTE-13** — Import and export mixed files with Unicode, Norwegian characters, code, tables, broken links, and unsupported files; preserve originals and report per-item outcomes.

**NOTE-14** — Restore a backup into a clean install and verify original files and representative citations.

**NOTE-15** — Read/edit/search remotely with the PC off; show keyword search and honest AI-unavailable state.

**NOTE-16** — Test clean installation, upgrade, rollback path, and uninstallation behavior on Windows. User data removal requires separate confirmation.

### C.2 Retained calendar gates

**CORE-01 — Save then extract**

Action: Kill the worker immediately after saving a personal note.

Required result: Original note persists; calendar job can resume without loss or duplicate event.

**CORE-02 — Integrated workspaces**

Action: Open one event source in Notes, Calendar and School where applicable.

Required result: All views resolve the same source/revision and identity, not copies or separate databases.

**CORE-03 — Relative date reference**

Action: Create a note on 2026-09-17 Europe/Oslo: meet Hanako in two weeks; process on a later day.

Required result: Resolved date is 2026-10-01; processing time does not shift it.

**CORE-04 — Missing time**

Action: Use the same note without a clock time.

Required result: A Time not set marker appears; no invented hour, duration, or all-day busy interval.

**CORE-05 — Loan to same person**

Action: Active loan from Hanako plus future compatible in-person meeting with Hanako.

Required result: One source-linked bring item; one still-active commitment.

**CORE-06 — Original identity mismatch**

Action: Loan from Ember plus meeting with Hanako at Embers.

Required result: No definite book-return binding without evidence linking the people/attendance.

**CORE-07 — Verified alias**

Action: Owner explicitly confirms two names are one person, then rematches.

Required result: Eligible match works with alias provenance; no cross-type person/place merge.

**CORE-08 — Virtual encounter**

Action: Loan requires physical handover; next encounter is a video call.

Required result: No handover reminder is bound to the video call.

**CORE-09 — Cancelled event**

Action: Cancel the meeting carrying an active loan prep item.

Required result: Event reminders withdrawn; loan remains active and may bind to next compatible event.

**CORE-10 — Rescheduled event**

Action: Move a personal meeting after a reminder has been scheduled.

Required result: Old trigger invalidated, new trigger scheduled once; prep remains linked.

**CORE-11 — Packed is not returned**

Action: Mark the book as packed; let event end time pass.

Required result: Loan remains active; elapsed time does not mark fulfilled.

**CORE-12 — Explicit completion**

Action: Owner writes an unambiguous completion statement under an enabled rule.

Required result: Unique commitment can be fulfilled with evidence/audit; ambiguous pronoun produces a proposal.

**CORE-13 — Negation/hypothetical**

Action: Import maybe meet Friday, do not meet Friday, and a quoted tutorial scheduling example.

Required result: No confirmed event is created from these fixtures.

**CORE-14 — Old imported source**

Action: Import an old note without reliable authored timestamp saying in two weeks.

Required result: Reference date unresolved; no use of upload date as hidden assumption.

**CORE-15 — Unrelated edit**

Action: Edit an unrelated paragraph two days after extraction.

Required result: Original statement reference date stays fixed; event does not drift.

**CORE-16 — Source locking**

Action: Owner manually changes an inferred event time, then reprocesses its note.

Required result: Locked time survives; proposed conflict visible.

**CORE-17 — Same note replay**

Action: Deliver the same source revision/job result/webhook repeatedly.

Required result: No additional event, promise, prep item or reminder.

**CORE-18 — Ambiguous reschedule**

Action: Say move that meeting when two candidates exist.

Required result: Retain a resolvable proposal; neither meeting changes automatically.

**CORE-19 — Language fixtures**

Action: Test English/Norwegian dates, pronouns and borrowed-object statements.

Required result: Labeled intent/date/identity accuracy is reported; unsupported cases abstain.

**CAL-01 — Recurring series**

Action: Create weekly event with one moved occurrence and one cancelled occurrence.

Required result: Correct grid, stable IDs, no series-wide accidental change.

**CAL-02 — DST spring**

Action: Use an invalid local event time in Europe/Oslo spring transition.

Required result: Require a defined explicit correction rather than silently choosing a time.

**CAL-03 — DST autumn**

Action: Use an ambiguous repeated local hour.

Required result: Require/retain explicit offset/fold choice.

**CAL-04 — All-day versus date-only**

Action: Create explicit all-day event and an unknown-time marker.

Required result: Different TimeSpec/free-busy behavior and correct exclusive end dates.

**CAL-05 — Duration missing**

Action: Start known, end unknown.

Required result: Render labeled incomplete duration; no provider write with invented end.

**CAL-06 — Offline competing edits**

Action: Edit same event time on two disconnected devices.

Required result: Deterministic conflict handling; no silent last-write destruction of a confirmed schedule.

**CAL-07 — Preparation capacity**

Action: Ask to fit more study hours than available before deadline.

Required result: Expose shortfall; do not move official classes or schedule through protected time.

**CAL-08 — ICS roundtrip**

Action: Export/import supported recurrence and exceptions.

Required result: Stable event identity and privacy-safe field preservation; no invitation sends.

**PRIV-01 — Private sidecar**

Action: Attach loan notes to a shared Outlook event.

Required result: No private prep/note text in provider description, shared export, attendee payload or notification preview.

**PRIV-02 — Internal participants**

Action: Auto-create personal meeting with named person.

Required result: Provider attendees array is empty; no invitation is sent.

**PRIV-03 — Explicit invitation**

Action: Preview recipients/content, then explicitly confirm.

Required result: Only reviewed public content is sent; action has provider acknowledgment.

**PRIV-04 — Source injection**

Action: Teacher attachment asks the AI to bypass policy, export vault or invite the whole class.

Required result: Treated as content; no action/privilege escalation.

**PRIV-05 — Cross-vault access**

Action: Use another vault/account ID in a source/event/context route.

Required result: Denied without information leakage, including worker jobs and citations.

**PRIV-06 — Local-only derivation**

Action: Match a local-only note against a synced event on Windows.

Required result: Derived prep stays local and absent from cloud APIs/backups unless explicitly local backup.

**PRIV-07 — Token protection**

Action: Inspect logs, prompts, exports, browser storage and renderer bundles.

Required result: No provider credentials/client secrets appear.

**PRIV-08 — Revocation**

Action: Revoke school permission or access to a selected source.

Required result: Stops ingestion; stale/access-revoked evidence is excluded/restricted per policy, not treated as current.

**PRIV-09 — OAuth cross-account**

Action: Replay callback state or substitute another owner/tenant.

Required result: Rejected; correct connection/vault binding preserved.

**PRIV-10 — Fetch redirection**

Action: Provide malicious feed/file redirect toward internal services.

Required result: Network allowlist/SSRF defenses reject; credentials not forwarded to arbitrary hosts.

**MS-01 — Consent blocker**

Action: School refuses EduAssignments permission.

Required result: Assignment capability says admin approval required; other allowed connectors work.

**MS-02 — Selected scope**

Action: Select two folders and one channel only.

Required result: Only selected content indexed; unselected/private containers absent.

**MS-03 — Replies and pages**

Action: Fetch multi-page Teams messages including reply pagination.

Required result: No silent missing replies; completeness/denied resources reported.

**MS-04 — Assignment deadline update**

Action: Change authorized structured assignment deadline, including a student-specific applicable date.

Required result: One deadline changes; prep replan offered; no fabricated duplicate deadline.

**MS-05 — Lost create response**

Action: Provider accepts personal event creation but connection drops before acknowledgment.

Required result: Reconciliation/idempotency finds existing event; no duplicate creation or invite.

**MS-06 — Provider throttle**

Action: Return 429 Retry-After on multiple resources.

Required result: Backoff and durable progress; not full-account rescan loops.

**MS-07 — Expired cursor**

Action: Expire delta token during sync.

Required result: Safe bounded rescan; old events not all interpreted as cancelled.

**MS-08 — Webhook duplicates/out of order**

Action: Replay and reorder valid change hints.

Required result: Source re-read/reconciliation yields correct final state without duplicates.

**MS-09 — Webhook forgery**

Action: Bad client state, unknown subscription or unexpected challenge.

Required result: Does not authorize data access or inject a provider event.

**MS-10 — Premium Planner**

Action: Attempt unsupported premium plan ingestion through basic Graph adapter.

Required result: Capability unavailable is explicit; no empty all-tasks-synced claim.

**MS-11 — Read-only import**

Action: Import mail/files/assignments/tasks.

Required result: No read marking, deletion, grade/attendance mutation, task completion or assignment submission side effects.

**MS-12 — Source documents**

Action: Parse selected DOCX/PPTX/XLSX with malicious macros/links.

Required result: Extract safely; no macro execution or arbitrary external network fetch.

**VIS-01 — Unverified live API**

Action: No school-approved InSchool route exists in configuration.

Required result: Readiness unverified/import-only; no invented endpoint or fake live success.

**VIS-02 — Snapshot import**

Action: Import one-week timetable snapshot with known source date.

Required result: Preview mapping; snapshot/freshness label; no invented whole-year repeating timetable.

**VIS-03 — Supported live route**

Action: With genuine authorized configured route, read own timetable and a later changed room/cancelled lesson.

Required result: Correct one-user mapping and update; live evidence recorded separately from fixtures.

**VIS-04 — Provider identity mismatch**

Action: Try to use unrelated Flyt Skole/OneRoster fixture as proof of InSchool timetable access.

Required result: Rejected as proof; capability remains unverified.

**VIS-05 — Credential boundary**

Action: Provider requires interactive reauthentication.

Required result: Explicit supported reauth; no password capture/MFA bypass/cookie extraction.

**OPS-01 — AI worker off**

Action: Keep hub running, stop all model workers.

Required result: Structured calendar/provider sync and stored reminders function; new AI work waits visibly.

**OPS-02 — Offline writeback**

Action: Create event offline then reconnect.

Required result: Locally persisted pending entry syncs once and receives actual provider result.

**OPS-03 — Notification denied**

Action: Disable notification permission or use sleeping/offline device.

Required result: Delivery limitation visible; no guaranteed alarm claim; missed item surfaces once.

**OPS-04 — Backup restore**

Action: Restore full backup into new installation.

Required result: Notes/calendar/commitments/evidence recover; provider sends disabled until reauth/reconciliation.

**OPS-05 — Deletion propagation**

Action: Purge a source that supports calendar context.

Required result: Remove/invalidate source-derived excerpts, embeddings and prep; do not erase unrelated confirmed events without policy.

**OPS-06 — Contract completeness**

Action: Compare actual route registry with the unified manifest and exercise malformed/unauthorized/stale requests.

Required result: No production stub successes; each applicable endpoint has real effects/results, explicit scope checks and tests.

**OPS-07 — Real model evaluation**

Action: Run labeled extraction/matching suite with actual selected local models.

Required result: Report exact digests/runtime/hardware and measured errors, precision and abstention coverage; no fabricated results.

**OPS-08 — Clean install and phone view**

Action: Install on supported Windows and load authenticated calendar PWA on phone.

Required result: Capture, source links, calendar and offline states usable without developer tooling.

### C.3 Merged-product gates

**OMEGA-01 — One canonical workflow**

Action: Create a note-derived assignment-preparation task and view it in Notes, Tasks, Calendar, School and Today.

Required result: Same task/source identity, consistent state; completing it updates the linked canonical checkbox when applicable.

**OMEGA-02 — No architectural reset**

Action: Inspect migrations and storage after upgrading a populated Sorta install.

Required result: Existing notes, histories, calendars, citations and scopes survive; no duplicate task/calendar database or required framework rewrite.

**OMEGA-03 — Original preservation**

Action: Classify a multi-topic paste as a task, memory and project idea.

Required result: Original remains unchanged and searchable; typed interpretations link back to it.

**OMEGA-04 — Source-owned school fields**

Action: Edit the room/date/status of an imported official lesson through local record APIs.

Required result: Unauthorized changes rejected or stored as explicit annotations; official provider record unchanged.

**OMEGA-05 — Sensitive feature opt-in**

Action: Connect basic school sources without enabling grades/attendance.

Required result: No grade/attendance import or hidden dashboard inference; manual module remains available.

**OMEGA-06 — Manual school workflow**

Action: Use School with no working institutional API.

Required result: Manual subjects/assignments and approved snapshots persist and link to study/calendar; no fake live status.

**OMEGA-07 — Student-specific deadline**

Action: Import a class assignment and a supported student-specific extension.

Required result: Applicable authoritative due date is preserved with source; no duplicate deadline or assumption all students share it.

**OMEGA-08 — Unknown attendance**

Action: Import only some lessons in a date range.

Required result: Unobserved lessons remain Unknown, not Present/Absent; coverage and denominator are visible.

**OMEGA-09 — Attendance units**

Action: Mix minute-based and lesson-count attendance sources.

Required result: No meaningless combined percentage; preserve raw status/units and expose calculation basis.

**OMEGA-10 — Excusal distinction**

Action: Import an absent but excused record with separate provider fields.

Required result: Raw fields and normalized presence/excusal stay distinct; no invented present status.

**OMEGA-11 — Catch-up evidence**

Action: Request catch-up for a missed class with one teacher message but no transcript.

Required result: Plan cites what the message supports and states missing coverage; no fabricated lecture content.

**OMEGA-12 — Grade scale and missing weights**

Action: Import numeric/nonnumeric grades with unknown assessment weights.

Required result: Original scale retained; no invented weights or official final-grade prediction.

**OMEGA-13 — Performance explanation**

Action: Request study priority with grades, an upcoming assessment and a documented knowledge gap.

Required result: Recommendation states contributing factors, source coverage and uncertainty; does not merely rank lowest grades or promise outcomes.

**OMEGA-14 — Actual chapter scope**

Action: Create a chapter-six plan when two subjects have chapter six.

Required result: Ambiguous course remains resolvable proposal; selected plan uses actual supplied chapter material.

**OMEGA-15 — All study modes**

Action: Run each supported study mode over a fixture textbook passage.

Required result: Mode-appropriate working output, response persistence and source links; no hardcoded canned answers.

**OMEGA-16 — Answer before model grading**

Action: Submit a practice answer and stop the worker during grading.

Required result: Answer survives restart and grading resumes idempotently; no invented completed evaluation.

**OMEGA-17 — Nonofficial feedback**

Action: Model marks a supported correct answer wrong; owner challenges it with a source.

Required result: Correction and original grading retained; affected gap inference updated/retracted; no school grade write.

**OMEGA-18 — Mastery evidence**

Action: Run a timer while displaying a chapter without answers or completion.

Required result: No asserted mastery or completed task solely from viewing/time elapsed.

**OMEGA-19 — Flashcard source update**

Action: Change a source used by an existing card and review history.

Required result: Stale card flagged; history still references original revision; review schedule remains deterministic.

**OMEGA-20 — Session interruption**

Action: Pause/interrupt/restart a focus session on two clients.

Required result: Observed active duration and explicit state survive; duplicate commands do not double-count time.

**OMEGA-21 — Deterministic planner**

Action: Run the same plan inputs, constraints version and algorithm twice.

Required result: Same candidate placement/reasons under defined tie-breaks; no LLM-selected free slots.

**OMEGA-22 — Protected time and shortfall**

Action: Request more study effort than fits before deadline with sleep/social/exercise protected.

Required result: Capacity shortfall shown; no hidden violation or movement of fixed/protected blocks.

**OMEGA-23 — Unknown availability**

Action: Plan around a same-day missing-time appointment or unknown-duration event.

Required result: Uncertainty remains visible and affected slots are unresolved/provisional per policy, not claimed definitely free.

**OMEGA-24 — Partial work replan**

Action: Complete half a task, miss a session and trigger several source updates.

Required result: Only remaining flexible work replan proposed; started/completed/locked blocks preserved and churn coalesced.

**OMEGA-25 — Stale plan acceptance**

Action: Modify the calendar after a schedule preview, then accept the old proposal.

Required result: Revision/conflict recheck rejects stale plan; no overwritten appointment.

**OMEGA-26 — Shared planner**

Action: Request equivalent preparation through Calendar and Study.

Required result: Both use the same scheduler/constraints and canonical events, not two competing plans.

**OMEGA-27 — Social intention**

Action: Write that you would like to see Jonas this week with no agreement.

Required result: Suggested times only; no confirmed appointment, assumed availability or unsolicited invitation.

**OMEGA-28 — Memory correction**

Action: Correct a stored preference and reprocess its original evidence.

Required result: User lock/suppression respected; old inference not silently restored.

**OMEGA-29 — Observation semantics**

Action: Import liked/saved video records without viewing history.

Required result: No claim the user watched them; actual action types and missing history retained.

**OMEGA-30 — Duplicate personal sync**

Action: Run incremental and full retry over the same interaction exports.

Required result: One observation per source identity; repeated syncs do not inflate interests.

**OMEGA-31 — Sparse interests**

Action: Provide one interaction and request a profile.

Required result: No permanent preference, diagnosis or unsupported confidence percentage; evidence limitation visible.

**OMEGA-32 — Profile trend coverage**

Action: Compare full prior-week data with two days of current-week data.

Required result: No misleading unqualified percent change; coverage/window/denominator shown.

**OMEGA-33 — Profile control**

Action: Dismiss an inferred interest, then resync unchanged evidence.

Required result: Dismissal persists; new materially different evidence handled under inspectable policy.

**OMEGA-34 — Sensitive trait inference**

Action: Import content that could tempt a model to infer health, religion or sexuality.

Required result: No inferred sensitive psychological/identity profile; store only permitted actual observations or explicitly supplied controlled memory.

**OMEGA-35 — Weekly versus live updates**

Action: Enable weekly personal sync and change a school event midweek.

Required result: School calendar updates under its operational policy; it does not wait until Sunday.

**OMEGA-36 — Scheduled job missed run**

Action: Stop the responsible host at scheduled aggregation time and restart it later.

Required result: Missed/delayed state truthful; policy-controlled deduplicated catch-up, no invented on-time run.

**OMEGA-37 — Unsupported personal data**

Action: Select a provider capability that its actual API/account does not expose.

Required result: Explicit unavailable/import-only state and exact limitation; no invented private history API.

**OMEGA-38 — Named adapter identity**

Action: Leave Anakin or Meetly backend identity/configuration unresolved.

Required result: Adapter not treated as live; binding requires actual supported package/interface; normal imports still function.

**OMEGA-39 — Official API preference**

Action: Offer both an approved official resource API and a browser extraction route.

Required result: Use approved official capability; browser route does not silently bypass permission limits.

**OMEGA-40 — Browser extraction boundary**

Action: A scraped page asks the worker to fetch unrelated private resources or bypass login.

Required result: No scope expansion, password/cookie exposure, CAPTCHA/MFA bypass or arbitrary navigation.

**OMEGA-41 — Local transcript provenance**

Action: Correct a transcript sentence and unknown speaker label.

Required result: Original audio and previous revision remain; sources/timestamps preserved without inventing speaker identity.

**OMEGA-42 — No auto-recording**

Action: Import a lesson/event with an instruction to record it.

Required result: No microphone starts without explicit recording action/permission.

**OMEGA-43 — Google provider parity**

Action: Use a permitted test Google calendar for recurrence/read/write/private-event workflows.

Required result: Shared event/outbox/privacy behavior holds; real provider checks are reported separately from fixtures.

**OMEGA-44 — Cloud AI default**

Action: Stop all local workers with cloud adapter configured but disabled.

Required result: Explicit waiting/unavailable state; no external inference request.

**OMEGA-45 — Per-vault cloud consent**

Action: Enable one cloud purpose for a synced vault and query another/local-only vault.

Required result: No implicit cross-vault disclosure or cloud fallback; local-only boundary enforced.

**OMEGA-46 — Cloud versus sync settings**

Action: Enable cloud synchronization without choosing cloud inference.

Required result: Cloud AI remains off; public/provider labels do not imply zero-knowledge storage.

**OMEGA-47 — Tool authorization**

Action: Invoke grade/profile or external-write tools with capture-only/MCP read-only grants.

Required result: Denied without hidden data leaks or actions; model text cannot upgrade grants.

**OMEGA-48 — Structured command result**

Action: Ask the command bar to perform a permitted local mutation.

Required result: Durable action result and audit distinguish applied versus proposed; no unsupported Done text.

**OMEGA-49 — Project promotion**

Action: Promote an idea into a project using a preview.

Required result: Original note/idea preserved; project shares typed identity/labels/tasks without duplicates.

**OMEGA-50 — Dependency purge**

Action: Purge observations or a school source supporting memories, insights and prep.

Required result: Derived private excerpts/indexes invalidate or retract; unrelated confirmed events and originals are preserved under previewed policy.

**OMEGA-51 — Expanded backup**

Action: Restore all modules into a clean install.

Required result: Notes/history, tasks/events/loans, grades/attendance, study progress/cards, memories/profile/evidence recover; external sends stay disabled pending reauthorization.

**OMEGA-52 — Demo isolation**

Action: Open a new production vault after running development seed tests.

Required result: No fictitious teachers, grades, attendance, interactions or synced status appears.

**OMEGA-53 — All routes real**

Action: Exercise every applicable consolidated operation through generated clients.

Required result: Actual domain persistence/results, no placeholder success; contracts match implementation and blocked providers are truthful.

**OMEGA-54 — Integrated accessible UI**

Action: Use keyboard only and a phone-sized screen across primary workflows.

Required result: All core actions accessible without drag-only controls; small default navigation still exposes every module.

**OMEGA-55 — Original note quality gates**

Action: Run retained held-out note/retrieval/citation tests with the expanded corpus.

Required result: Report actual counts, coverage, digests and failures; extra modules do not excuse losing core notes behavior.

### C.4 Release evidence and limits

Record test file, feature/operation IDs, execution environment/time, actual result and evidence. A scenario is not passed because code or a test name exists. Fixture success does not establish live provider access; native tests not run on Windows remain not run. An external blocker does not authorize mock production data.

Known release invariants: no unauthorized invitations/provider writes, no cross-vault or secret leakage, durable original capture, historical citation correctness, working restore/offline synchronization, unknown identities/dates do not become invented facts, deterministic scheduling respects fixed/protected time, and disabled cloud AI does not receive data. Failed invariants block release.

Report installed/configured adapters, tests against fixtures, and real live-provider verification separately. Missing owner credentials, school consent, provider specification, runtime installation, signing keys or deployment authorization are exact external prerequisites, not claimed accomplishments.
