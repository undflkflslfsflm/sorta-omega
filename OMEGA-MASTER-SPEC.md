# Sorta Omega — Unified Personal OS

**Version:** 3.0 · 17 September 2026  
**Deliverable:** Authoritative product description and implementation contract for Codex.  
**State:** Planning, not implemented software, a deployed service, or verified private-account access.  
**Target:** The owner's Windows RTX 4090 PC hosts the application, data, and local AI. The owner accesses the same application from another PC using a browser/PWA, and optionally a Windows client or phone.

> Throw information into one place. The system saves it, sorts it, connects it, turns clear intentions into useful plans, remembers unfinished commitments, and helps you find both the original evidence and the next sensible action.

## 0. Binding merge decisions — extend, do not redesign

This specification absorbs the existing Sorta Notes + Calendar plan and all 62 sections of the uploaded **Personal OS — AI-Powered Personal Operating System** into one product. It is not a replacement brainstorm. Preserve functioning repository code, agreed notes capabilities, calendar semantics, APIs, security boundaries, and local-first architecture. Extend them through shared services.

The two uploaded Personal OS files have identical wording after normalizing whitespace and code-fence formatting. The later file is the canonical source; there is no extra second product to implement.

| Existing requirement or apparent conflict | Unified decision |
|---|---|
| Notes plus a separately launchable calendar | One application, one account/vault system, one data model, and one shared shell. Notes and Calendar remain deep-linkable launch destinations, not forks or independent databases. |
| Earlier cloud hub plus a local AI worker | Run that same hub and worker on the 4090 PC by default. Secure remote access replaces the requirement for a separate cloud-hosted hub. Keep the server deployable elsewhere without requiring it now. |
| Earlier five-item notes navigation versus Personal OS sections | Keep capture and everyday navigation simple. Expose all requested modules through grouped navigation, workspace shortcuts, and command search. Do not remove modules merely to preserve five labels. |
| Earlier exclusion of grades and attendance | Include private grade/performance and attendance modules as requested in Personal OS. Import them only through separately enabled, authorized capabilities; no school-record writes. |
| Earlier Google-calendar-style UI without Google sync | Retain the UI; add a real optional Google Calendar provider under the same provider abstraction because the uploaded specification requests it. |
| Automatic personal events versus confirmation for writes | An owner enables a bounded trusted-personal-automation policy once. Clear owner-authored private plans can then be applied with Undo. External/destructive actions require confirmation by default; invitations and shared-calendar changes require an explicit reviewed action. |
| Optional cloud AI in Personal OS versus earlier local-only model rule | Keep all default inference local and no automatic fallback. The provider interface may support an explicitly configured cloud provider, disabled by default, with per-vault authorization, visible disclosure and cost controls. |
| Optional Maxun, Firecrawl, Anakin OSS, CLI-Anything, Meetly/Meetily | Retain their adapter roles. They are not mandatory replacements for working components or evidence of provider access. Exact backend identity/version/API and capability support must be verified before enabling. |
| Host-only privacy versus remote viewing | Machine-local vaults remain inaccessible remotely. Separately authorized host-synced vaults may be read by enrolled remote clients. Remote viewing is an intentional disclosure to that client, not proof that data never leaves the host. |

This document controls the current build. Historical documents in `reference-inputs` are provenance, not competing instructions. The merged API inventory retains earlier operation IDs and contracts, with explicit extensions described here. Do not rebuild the product from scratch just because its scope expanded.

## 1. The finished application

Sorta Omega is a personal command center combining a second brain, notes library, grounded assistant, calendar, conditional commitments, tasks, school management, source-based study, grades/performance, attendance, projects, people, personal memory, interest evidence, integrations, and a permissioned tool system.

The complete loop is:

```text
CAPTURE → SAVE ORIGINAL → UNDERSTAND → ORGANIZE → CONNECT
                                     ↓
                                   PLAN → EXECUTE → LEARN → REMEMBER
                                     ↑                        |
                                     └──── useful evidence ───┘
```

“Learn” means update explicit preferences, correction examples, evidence-backed observations, and measured scheduling estimates. It does not imply training model weights or covertly profiling the owner.

One note may participate in several modules without being copied. An assignment is a school object linked to its source and a task; scheduled work is a session linked to that task and a calendar occurrence. An event's packing item can point to an existing commitment rather than create another independent obligation.

The app must answer both **“Where did I put it?”** and **“Given my actual commitments, time, material, and goals, what should I do next?”** The answer remains an explanation or proposal the owner can correct, not a command to obey.

### 1.1 Unified screens

| Destination | Primary experience |
|---|---|
| Inbox / Capture | Paste, type, drop a file, record deliberately, or clip a page. Save without organizing. |
| Today | One clear next action, upcoming schedule, what to bring, due work, and a compact daily brief. |
| Notes / Brain | Canonical notes, documents, projects, topics, relationships, sources, memories and grounded Find/Ask/Make. |
| Calendar | Familiar day/week/workweek/month/agenda views, lessons, deadlines, private plans and flexible study blocks. |
| Tasks / Commitments | Dated work, subtasks, undated promises, loans, contextual follow-ups and completion evidence. |
| School | Subjects, courses, teachers, lessons, assignments, assessments, materials and source freshness. |
| Study | Source-backed tutoring, practice, recall, flashcards, mock exams, study plans and session execution. |
| Performance / Attendance | Private evidence-backed progress, grades, targets, missed lessons and catch-up material. |
| Projects / People | Ideas becoming projects; relationships among notes/tasks; people, agreed plans and outstanding promises. |
| Personal Profile / Memory | What the app remembers, its evidence, explicit preferences, interests, corrections and deletion controls. |
| Integrations / Settings | Selected accounts/resources, permissions, health, models, remote access, notifications, backups and diagnostics. |

On desktop, use grouped navigation rather than displaying every data table. On a small screen, prioritize Inbox, Today, Calendar, Tasks, and the AI command bar. Every module remains reachable. Notes and Calendar can each be pinned as a launch shortcut into the same app.

Use readable typography, keyboard access, visible focus, adjustable text size, reduced motion and progressive disclosure. No shame-based overdue screens, compulsory streaks or decorative graph that blocks basic work. Every drag operation has a keyboard/form equivalent. English and Norwegian content must work without rewriting originals into another language.

## 2. 4090 host and access from the other PC

### 2.1 Required topology

```text
OTHER PC / PHONE
Browser or installed PWA
Optional trusted offline cache
        |
Authenticated HTTPS through approved access mode
        |
4090 WINDOWS HOST
  Shared web UI + Fastify API + authentication
  PostgreSQL + pgvector + original file store
  Durable jobs + deterministic scheduler + connector workers
  Local AI worker → Ollama → RTX 4090
  Optional local transcription/extraction helpers
  Windows desktop client / quick capture
```

The remote PC does not need CUDA, a GPU, Ollama, model files, PostgreSQL, Docker, or a copy of the server. It renders the UI and communicates with the host. Optional browser caching and the existing Windows replica do not create a second independent authority.

Retain the existing TypeScript/Fastify/PostgreSQL hub and worker packages; change their deployment placement, not their domain architecture. Run inference on the 4090 host. Inspect the actual CPU, installed RAM, free disk, GPU/VRAM, drivers, existing Ollama, virtualization support, firewall policy and service setup rather than inferring them from “4090 PC.” No performance promises follow from the GPU name alone.

Package a documented Windows host profile and keep the existing Docker Compose profile runnable. The chosen host installation must keep the API, database, worker and local runtime on owner-controlled infrastructure. Native Windows services or a verified WSL2/container setup may satisfy this. Pick and test one default during preflight; do not require both or migrate a working environment unnecessarily. Do not expose a native Ollama instance on the LAN to solve a container routing problem.

Server, database and worker must not rely on an open developer terminal. Test restart, crash recovery, service-account file access and operation after the desktop UI closes. Do not claim pre-login availability based solely on a Docker Desktop “start at login” setting. Host service startup, GPU availability under its service context, and any WSL/container startup must each be tested. Never enable automatic Windows login as a workaround.

### 2.2 Primary access mode: private Tailscale + HTTPS

Use Tailscale on the host and on the other PC when installation is allowed. Tailscale Serve provides access to a local web service within the owner's tailnet; its access rules and HTTPS configuration apply [R1].

The app service should listen on a loopback port, proposed `127.0.0.1:3210`. Serve publishes only the application HTTPS origin. Database, Ollama, worker administration, browser automation, and OS remote control remain private/internal.

An illustrative operator command is:

```powershell
tailscale serve --bg http://127.0.0.1:3210
tailscale serve status
```

These are setup examples to verify against the installed CLI, not commands executed by this planning package. Preserve existing Serve configuration and choose an unused endpoint rather than resetting unrelated services. The CLI supports persistent background serving; Windows unattended Tailscale operation is a separate setting [R2, R3]. Neither setting starts the application/database for you.

Codex must provide an owner-run setup flow that discovers the real assigned HTTPS address, restricts access to approved identities/devices, enables suitable app authentication, validates origin/CSRF behavior and tests the second client. Never invent a working hostname. Do not activate Tailscale Funnel, router port forwarding, an exit node, subnet routing, RDP or a public model server for this feature.

### 2.3 Browser-only access mode: Cloudflare Tunnel + Access

Include an alternative for a PC where installing Tailscale is unavailable or not permitted. Use a named Cloudflare Tunnel from the host to a user-owned hostname, protected by Cloudflare Access, plus application-level ownership/vault checks. The remote client uses normal HTTPS in its browser. Tunnel uses outbound connections from the host [R4]. Access must be configured before publishing the route; a tunnel alone is not an authentication system [R5].

Require an explicit owner allowlist, an appropriate authentication/MFA policy, short controllable sessions, origin token validation and a tested deny response. Verify Access JWT signatures, issuer, audience and expiry through maintained libraries or documented origin protection [R6]. Never trust a client-supplied email header. Protect HTML, APIs, source downloads, exports and realtime connections consistently. Do not expose an unauthenticated “temporary testing” endpoint or a public quick tunnel.

A domain, account setup and policy approval are external setup requirements. Produce configuration and diagnostics; do not purchase a domain, change unrelated DNS or publish private content automatically. Respect managed-device/network policies rather than treating this alternative as a bypass.

**Privacy distinction:** this mode intentionally places an external HTTPS reverse proxy in the data path. Do not advertise it as end-to-end encrypted between only the owner's devices or as data never leaving them. Describe the TLS/processing boundary and disable content logging/caching where applicable. Local AI remains local; remote transport and external AI are separate choices.

### 2.4 Origin, callbacks and synchronization

Choose one canonical application origin per deployment. WebAuthn/passkeys, OAuth redirects, cookies, PWA caches and deep links must use that origin deliberately. Do not assume a passkey registered for a tailnet hostname automatically works on a different custom domain. Changing origins needs a tested migration/re-enrollment and cache-cleanup flow without stranding access.

Private-only Tailscale access does not make a provider webhook publicly reachable. Use supported outbound polling/delta synchronization by default for that profile. Browser OAuth callbacks may use an allowed registered origin reachable by the browser; provider-specific registration rules still apply. For a separately enabled public callback ingress, expose only exact provider callback paths, validate their provider proof/state, and do not exempt the whole API from Access. Provider webhooks cannot complete a human Access login. Never invent realtime freshness while actually polling hourly.

Use one sync protocol and one durable write path across all clients. The browser uses authenticated requests, bounded SSE and WebSocket reconnects; native clients use the same domain contracts. Render generated content incrementally, but retain durable job IDs rather than relying on one long-lived proxy request. Upload files in bounded resumable parts. Detect reauthentication versus network failure; preserve pending edits in either case.

### 2.5 Availability and client trust

| State | Contract |
|---|---|
| Host on, app and models healthy | Full remote notes, calendar, search, AI, school/authorized source sync and planning. |
| Host on, models unavailable | Notes, calendar, tasks, keyword search, structured provider synchronization and stored reminders continue; new semantic query embeddings and generation wait visibly. |
| Host off/asleep, disconnected, or app stopped | No live remote backend or new AI. Previously trusted cached material may work; new clients cannot load uncached data. |
| Trusted client offline | Persist local edits/captures in its approved cache, show pending upload and reconcile on reconnect. Only cached notes/files are available. |
| Shared/untrusted browser | Default to session-only content, no persistent private vault cache, no background account tokens; clear app-owned caches on logout. |
| Remote authorization revoked | Deny new requests/sync. A downloaded/exported/offline copy cannot be guaranteed remotely erased. |

A home-hosted server is not always-on cloud infrastructure. The host must remain powered and connected for full remote use. Report last host contact, cache age, AI state and connector freshness separately. Sleep policy changes require owner approval. Do not claim an off machine can be woken through an unreachable service; Wake-on-LAN is not a required dependency.

Previously scheduled notifications remain subject to the actual operating system/browser delivery capability. When the only host is off it cannot originate new pushes. A private cloud hub/always-on worker remains an optional future deployment profile, not a hidden dependency or an automatic fallback.

## 3. Universal Inbox and canonical notes

The primary capture surface has one large field and no required taxonomy. Text, Markdown, rich text, code, URLs, screenshots, images, files, audio, assignments, transcripts, messages, ideas, reminders and personal thoughts enter the same pipeline. Preserve raw originals, authored timestamps, capture timestamps, language and source links.

Save and acknowledge durability before extraction or AI. A note remains searchable when it cannot be classified. Processing and syncing are separate statuses. A rejected or unavailable model must never prevent note capture.

Keep the existing Windows quick-capture shortcut, configurable initially as `Ctrl+Shift+Space`, small tray capture window, conflict detection, autosave, undo/redo and optional startup. The remote browser has an in-app shortcut; a browser-only installation cannot pretend it has an operating-system-wide hotkey or unrestricted folder watching.

The block editor retains headings, paragraphs, lists, checkboxes, code, quotations, tables, callouts, images, attachments and internal links. Tiptap/Yjs document state is canonical; Markdown is a projection/export, not an independently writable competing body. Immutable note revisions support historical evidence.

A details drawer shows original capture, source, filing, related items, tasks, commitments, events, revisions and AI actions. Notes and imported documents can have owner annotations without modifying imported originals.

Keep browser clipping through an explicit action, selected-folder watching, duplicate retry protection, batch import, safe supported formats, original attachments, portable export, and tested restore. No continuous clipboard, browsing-history or microphone surveillance. Existing source watchers run on the machine that can access the selected folder; a remote browser cannot watch a folder on another PC without a separately installed/authorized local helper.

## 4. Classification, organization and corrections

Classify into the uploaded vocabulary where useful: TASK, EVENT, ASSIGNMENT, ASSESSMENT, NOTE, IDEA, PROJECT, PERSON, REFERENCE, SCHOOL MATERIAL, REMINDER, MEMORY, QUESTION, MESSAGE, DOCUMENT or OTHER. These are facets/extracted records, not mutually exclusive containers. An input can produce several linked objects while retaining one canonical source.

Extract titles, existing areas/topics/projects, explicit entities, dates, action candidates and relevant relationships. Retrieve existing destinations and aliases before calling the model. Prefer stable categories; provisional topics remain searchable without crowding the sidebar. Promotion/merge/restructure operations have inspectable rules and Undo. No duplicate “Coding,” “Programming” and “Software development” categories unless deliberately distinct.

Every interpretation carries source/revision anchors, observed/created times, explicit versus inferred status, a brief reason, model/prompt version and confidence metadata. Preserve the uploaded distinction among confirmed information, inference, recommendation and user-created information. Do not treat “imported from somewhere” as automatic truth or an LLM's percentage as a calibrated probability.

A correction updates the association, stores a correction example, and locks the owner's chosen field. Broader rules require a preview. Reprocessing never silently overrides a lock. A long mixed dump may produce linked sections or a proposed split; splitting/merging is reversible and preserves originals. Near-duplicates are suggestions, not automatic deletion.

Use a related-notes panel and inspectable relationship graph where useful. Show inferred relations with evidence; semantic similarity is not proof of identity, causation or contradiction. A graph is a secondary view, not the primary storage system or required navigation.

## 5. Knowledge, RAG and source navigation

Index notes, original documents, permitted messages, textbook material, transcripts, ideas, projects, source-owned school records and explicitly enabled personal-data items. Add subject, course, teacher, chapter, lesson, content type, source timestamps and freshness when actually available. Do not invent missing textbook chapter mappings or lesson associations.

**Find** combines full-text and semantic retrieval with visible metadata filters. Exact names, quoted phrases, code, error messages and dates must remain discoverable. Search structured objects as well as prose, returning typed results linked to canonical records.

**Ask** answers from selected sources or the authorized vault. It should abstain when unsupported and surface conflicting evidence. **Make** creates a source-linked derivative such as a project brief, summary, checklist, comparison or study guide. An explicitly chosen brainstorming mode can use general knowledge, labeled separately from the user's records.

The modular pipeline is parse → extract usable text → preserve metadata/anchors → semantic chunks → embeddings → authorized lexical/vector retrieval → rank fusion/reranking → bounded evidence packet → grounded response → validated citations. Reranking is a pluggable retrieval stage; it need not require an additional permanently loaded model. Model/runtime selection must be evaluated, not expanded by default.

Authorization and vault/sensitive-source policy apply before candidate retrieval, not just after generation. Diversify results so one long document does not dominate. Do not mix embedding spaces/dimensions; version chunking and embeddings, rebuild resumably and switch indexes only after validation.

Every citation opens the exact source revision, paragraph/block, file page, slide/sheet/cell where supported, or audio timestamp. Historical answers keep historical anchors after edits. The model returns IDs supplied in the evidence packet; it cannot create arbitrary citation URLs. A valid source ID proves resolvability, not that every generated claim is entailed; test both.

Originals are the default evidence. Generated summaries cannot become an endless self-confirming chain of independent authorities. Derived material retains ancestry and becomes stale when sources change. Source deletion/access loss invalidates retrieval and dependent excerpts under the explicit retention/purge policy.

## 6. Calendar, events and commitments

### 6.1 Familiar calendar, richer context

Retain day, week, workweek, month and agenda views, mini-month navigation, Monday-first configurable weeks, timezones, keyboard navigation, colors plus non-color statuses, recurrence and exceptions, event editing/resizing, history, trash and restore. Use original product branding, not copied Google assets.

Layers include School, Study, Exercise, Social, Personal, AI-generated, Deadline, Assessment and attendance overlays. Imported provider calendars can be toggled independently. Fixed official records are source-owned; personal study/planning overlays do not rewrite them.

Event details include identity, source, freshness, raw/resolved time, location, private people/context, separate external attendees, notes/files and four preparation groups: **Bring**, **Do beforehand**, **Discuss**, **Open these files**.

`TimeSpec` remains a discriminated union: `timed`, `start_only`, `date_only` with deadline/time-unknown semantics, explicit `all_day`, and `unresolved`. A missing clock time is not midnight; a date-only deadline is not an all-day meeting. Unknown duration must not masquerade as a known busy interval. User-configured defaults are visible, reversible assumptions.

Preserve the statement's authored time, locale, timezone and identity. “In two weeks” is resolved deterministically from that statement, not upload/processing time. Editing unrelated text does not reset its reference date. Handle “om to uker,” ambiguous Fridays, daylight-saving gaps/folds, recurrence edits and timetable exceptions explicitly.

### 6.2 Conditional memory — the book example

A note says: “I borrowed Hanako's book. I'll give it back next time I meet her.” Create an active commitment linked to the statement: return this object to this resolved person at the next suitable in-person encounter. Do not invent a deadline.

Later: “Meet Hanako at Embers in two weeks.” Save it, extract a definite intention, resolve date/person/place, apply the enabled personal policy, and create a private event. When no time is given, display it in **Time not set**. Match the active commitment and add “Bring Hanako's book” with both source passages.

A loan from **Ember** is not automatically a loan from **Hanako**. **Embers** may be a venue, not a person. Owner-confirmed aliases or explicit participant facts can establish a connection; spelling similarity cannot. A virtual meeting is not a physical handover. Going to someone's house does not prove they will attend.

A commitment is independent of calendar occurrences. Rescheduling updates bindings/reminders. Cancellation removes event-specific preparation without cancelling the promise. Packing does not fulfill a return. Time passing does not fulfill it either. An unambiguous completion note may close the commitment under a trusted rule; otherwise retain a proposal.

### 6.3 General commitments and social planning

Support loans, promises, follow-ups, things to ask during the next lesson/meeting and items to bring to a place/appointment. States: proposed, active, fulfilled, cancelled, superseded. Preserve object, counterparty, bounded condition AST, source, activation time, optional explicit deadline, completion evidence, revision and dismissed matches.

Prep-item states such as pending, packed, dismissed and not-applicable are separate. Manual prep and owner-created templates are supported. A generic school-bag template is not a teacher instruction. One obligation can be linked to an eligible occurrence without multiplying independent tasks across every future meeting.

People include owner-entered friends, family, contacts and groups, linked plans and promises. “Hang out with Jonas this week” can produce proposed windows based on the owner's calendar. Do not claim Jonas is available without an authorized availability source. Protect social and free time alongside school, study, sleep and exercise.

### 6.4 Automation and external calendar writes

The owner opts into source/action-specific trusted personal automation. Clear definite owner plans can auto-create private entries with provenance and Undo. Maybe/hypothetical/quoted/historical/fictional statements do not become confirmed future appointments. Uncertain identities or reference dates remain unresolved without blocking capture.

Structured authorized provider events mirror deterministically. Unstructured email/chat plans are suggestions unless a narrow tested rule is explicitly enabled. New source text never supplies authority to execute arbitrary actions.

Support Local, Microsoft and optional Google calendar providers through the same event/outbox contracts. Read automatically within consent. External create/update/delete requires confirmation by default or an explicit narrow owned-calendar automation rule. Invitations, RSVP, shared changes and room booking require reviewed recipients/content/action. Private context participants never populate provider attendees automatically.

Never copy loans, private notes, prep lists, private RAG answers or sensitive school details into shared descriptions, ICS exports or lock-screen previews by default. External write states distinguish pending, acknowledged, rejected and delivery_unknown. Reconcile a lost response before retrying an action that could duplicate an event or send notifications.

## 7. Tasks, projects and ideas

Retain tasks, explicit checkboxes, suggested extracted actions, subtasks, due dates, priorities, dependencies, estimated/actual work and source links. Completing a linked note checkbox goes through the canonical editor service. Never mark a provider task or school submission complete just because a local study checklist was checked.

A task, assignment, event and study session are different records with references, not copies of one “AI object.” Manual field edits and locks persist. Overdue work can be reorganized without guilt or fabrication that it was completed.

Ideas have their own accessible view. Related ideas can be proposed as a project. Require confirmation before merging or promoting material in ways that rewrite its structure. A project links goals, notes, research, tasks, documents, milestones, decisions, open questions and progress. Project briefs are derived and source-linked; refresh preserves separate owner annotations.

Global search must find the original idea, later notes, relevant research, conversations, tasks and project state together. “Continue this thought” opens the prior context instead of an unrelated generic productivity suggestion.

## 8. First-class school system

Represent subjects, courses, classes/groups, teachers as people with roles, terms, lesson occurrences, assignments, assessments, exams/tests, deadlines and course materials. Avoid creating duplicate teacher entities alongside the common people store. Track authority and source identity per field.

A subject page shows upcoming lessons and assessments, current assignments, materials, related notes/transcripts, study sessions, accepted knowledge gaps and private optional progress/attendance. Links open original resources, not just AI paraphrases.

An assignment retains instructions, applicable student-specific deadlines/status where provided, resources, rubric/criteria if available and source versions. A teacher's later reply can amend instructions; retain both and disclose conflict when authority is unclear. Reading an announcement alone does not complete an assignment.

Course/chapter mapping is explicit or evidence-backed. A plan for Chapter 6 links actual Chapter 6 sections/pages. A document title matching a subject is not sufficient proof of the precise assigned chapter. Unknown material coverage is visible.

Imported official school objects are read-only. The owner can add manual private records or annotations, distinguished from official data. Changes to those annotations do not write grades, attendance, submissions, leave requests or messages back to the school.

## 9. Attendance and missed-lesson recovery

Attendance is a first-class private optional dataset, not an inference from whether an app timer ran. Preserve provider raw codes alongside normalized values: Present, Absent, Late, Partial, Excused, Unknown. Also retain student, subject/course, teacher if known, date, start/end, source/provider ID and timestamps.

Show overall and subject/time-period views, late arrivals, missed lessons and trends. A calendar overlay can show an absence against the applicable lesson without cancelling that lesson or revealing sensitive reasons in a shared export.

Link a missed lesson to available teacher instructions, notes, textbook sections, assignments and transcripts. Offer a source-grounded catch-up plan. When coverage is missing, say “Material for this lesson has not been found,” not “Here is what your class covered” based on a guess.

Attendance summaries must state the counted period, unit, known/unknown coverage and denominator. Missing records are not automatic absences or presence. Keep excusal distinct from attendance status where source systems do. Do not invent jurisdictional eligibility thresholds or legal absence consequences; these would require a separate authoritative rules source, not an LLM guess.

Import requires explicit capability authorization, and the owner can disable performance/planning use separately. Manual corrections are private overlays unless an explicitly authorized administrative workflow exists; no such school write workflow is included here.

## 10. Grades, performance and knowledge gaps

Track assessment, subject/course, raw grade and scale, date, optional authoritative weight, explicit target, study time, completion, attendance coverage and knowledge-gap evidence. Source-owned grades remain separate from practice scores and owner-entered estimates.

Dashboards show history and goals without pretending averages are official predicted final grades. Display a numerical aggregate only when the scale and aggregation method are defined; preserve categorical feedback and do not invent weights. The sample numbers in the source specification are demonstration data, never production results.

Prioritization considers deadline proximity, confirmed importance, remaining workload, known gaps, goals, actual available time and sufficiently supported performance observations. Show the factors and missing information. Lowest grade alone must not dictate every recommendation. Do not promise a grade outcome or describe correlation between app usage and scores as proven study effectiveness.

Knowledge gaps derive from actual questions attempted, corrections, self-ratings and assessment evidence. Label practice-model evaluation as an estimate; allow correction and appeal to the cited source/rubric. Unknown is not weak. Missing activity data is not evidence of laziness or inattention.

## 11. Study planner and tutoring

### 11.1 Source-based plans

From “Need to study chapter 6 before Friday,” identify the subject and applicable assessment, locate the real assigned material, estimate and label remaining effort, create linked tasks and break them into manageable sessions. Retrieve prior attempts and accepted gaps when enabled. Ask for missing material/reference rather than invent chapter contents.

A plan may sequence reading a subsection, exercises, recall, a practice test and a brief review, all linked to source sections. Generated durations and ordering are recommendations. Do not advertise these as proven optimal or silently replace supplied course requirements with generic advice.

The LLM produces validated task descriptions, links, duration estimates, dependencies and soft preferences. The deterministic scheduler decides exact placement. A plan preview explains changes, conflicts, available capacity and uncertainty. Approval/standing trusted policy determines application.

### 11.2 All requested study modes

Implement Explain, Socratic Tutor, Active Recall, Flashcards, Practice Questions, Mock Exam, Explain Like I'm 12, Advanced Explanation and Identify Knowledge Gaps. Launch from a calendar session, task, chapter, assessment, search result or Today card.

Explain modes preserve source terminology and expose citations. Socratic mode asks one useful question at a time and can switch to direct explanation. Recall/practice separate question, attempt, hints, answer and feedback so an answer is not revealed before the attempt by default. Mock exams label generated questions as practice, not the teacher's actual exam.

Flashcards retain question/answer, source anchor, edit history, subject/topic, review attempts and next-due state. Provide a documented deterministic configurable review scheduler, separate from the calendar capacity scheduler. Avoid unsupported promises about a particular review algorithm. Correcting/deleting a card invalidates dependent practice evidence appropriately.

Store session source versions, generated exercises, owner responses, hint use, rubric where available, estimated evaluation, self-assessment and correction events. The small local model may decline to grade when source evidence is inadequate. Do not turn guessed answers into confirmed misconceptions.

Transcript-based tutoring links timestamps. Speaker segmentation may be supplied by a verified backend; unknown speakers retain neutral labels. Never invent a teacher's identity or quotation. Lesson association requires a known class/time/source or owner confirmation.

## 12. Deterministic scheduling, execution and adaptation

### 12.1 Constraint engine

Implement deterministic placement, not model-selected exact slots. Inputs are tasks, deadlines, dependencies, splittability, minimum/maximum block sizes, priorities, estimated remaining work, preferred periods and evidence. Constraints include fixed events, school timetable, explicit sleep, exercise, social time, protected free time, breaks, daily workload limits, buffers and owner locks.

Separate hard constraints from weighted preferences. Hard constraints must not be violated to produce a pretty calendar. Enumerate candidate intervals, enforce deadlines/dependencies/limits, and score legal alternatives reproducibly. Tie-break deterministically; record constraint/version snapshots. Do not require a heavyweight external optimization service if a testable local algorithm meets the contract.

Unknown-time appointments remain unresolved planning risks, not invisible commitments. Surface that uncertainty before scheduling a full day around them. User-entered travel buffers are supported; no live traffic or friend's availability without an actual authorized provider.

A schedule proposal records baseline versions, placements, unscheduled workload and reasons. Applying it checks versions and constraints again in a transaction. If calendars changed, recompute/propose rather than apply a stale plan. A shortfall is a valid result; do not double-book, sacrifice protected sleep/free time or invent task completion.

### 12.2 Next action and focus

Today prioritizes one concrete action with its material and estimated duration: “Read pages 84–91, about 15 minutes — Start.” The owner can ask “I have 20 minutes,” “What should I do now?” or “Plan my evening.” Use authorized structured commitments and actual constraints; explain why this action was selected and allow another choice.

Provide start/pause/resume/finish, short focus blocks, break suggestions, one-click material opening, distraction-minimal view, overdue recovery and optional momentum summaries. A focus timer is a measurement aid, not surveillance. An elapsed timer is not proof of learning or completion. Record missing/aborted sessions honestly.

### 12.3 Automatic replanning

Triggers include missed work, new assignments, changed assessments, changed availability, cancelled/moved events or longer-than-estimated work. Recalculate remaining effort and move only eligible flexible unstarted blocks under policy. Minimize disruption, retain locks and explain affected items. Do not reshuffle the whole week for every small update.

Important external calendar modifications require the existing preview/confirmation. Local auto-replanning can be enabled narrowly. Do not fill every free minute with catch-up work. The owner can accept, edit, ignore or disable the automation.

### 12.4 Momentum / adaptation

With explicit tracking enabled, compare planned and actual durations, time of day, subject, task type, postponement, completion, session size and breaks. Adapt duration estimates and soft preferences only with enough relevant observations. Show sample size, window and uncertainty; never invent percentages from a few records.

Separate explicit preferences from observed tendencies. The owner can reset learned estimates, exclude a period, correct logged time or turn learning off. This is a scheduling aid, not psychological diagnosis or a judgment of character.

## 13. Personal profile, long-term memory and digital interests

The **Who I Am** view contains interests, preferences, projects, goals, current focus, emerging/long-term topics and source-linked memories. It answers “What do you know about me, and why?” Every inference can be confirmed, corrected, dismissed or deleted.

Memory retains explicit facts, recurring plans, study preferences, workflows, projects and goals with evidence, timestamps and status. Keep explicit owner statements distinguishable from observed behavior and recommendations. A one-off watched item does not establish a lasting preference.

Opt-in personal-data sources may include TikTok, Instagram, YouTube, Spotify, Reddit, Discord, selected web material and activity within Sorta. Normalize records independently of transport: provider/account, source item identity, action kind, time, content/reference, URL, metadata and access/coverage state.

Do not conflate saved, liked, played, watched, skipped, subscribed or merely fetched. Infer a trend only from supported observations. “18 saved videos about AI” is not “18 videos fully watched.” Do not fabricate unavailable engagement history. Display denominators/windows and how changes were calculated; the source's percentage examples are illustrative, not baseline data.

Interests can decay over time. Dismissed inferences stay suppressed against unchanged evidence. Deleting a personal-data item retracts its evidence from profile entries and insights. Do not infer sensitive characteristics, political preferences, diagnoses or intimate attributes from browsing/media traces. Keep third-party people records limited to explicit useful relationship information.

No personal profile is a prerequisite for core notes, calendar or school features. The owner may use the entire core app without connecting any social service.

## 14. Integrations — one framework, honest capabilities

### 14.1 Shared contract

All providers share the same connection/account/resource registry, credential references, durable sync jobs, source normalization, evidence, permissions, history and health screens. Implement lifecycle operations corresponding to `connect`, `authenticate`, `discoverCapabilities`, `listContainers`, `health_check`, `sync`, `incremental_sync`, `fetchSource`, `normalize`, `resolveDeepLink`, `reauthorize` and `disconnect`.

Reuse the existing `/connections`, `/source-objects`, `/jobs`, import/export and provider-outbox APIs. Do not write a duplicate “personal integrations” service with a second token store or unrelated IDs. Provider-native scopes, consent, account eligibility, quotas and actual field coverage remain provider-specific.

Health and capability states distinguish connected, disconnected, authentication required, admin approval required, needs provider configuration, rate limited, syncing, degraded/error, unsupported and import-only. Show last success/failure, next scheduled run, resource coverage/window, imported count, errors and manual sync. Adapter code is not a live connection.

Prefer official supported APIs. Then use a documented export/import, deliberate page capture, or a permitted configured browser/extraction adapter. No credentials in prompts, no cookie theft, authentication/CAPTCHA/MFA bypass, unauthorized access, rate-limit evasion or claims that a scraper makes every platform available.

### 14.2 Microsoft 365

Retain selected Outlook mail/calendar and optional contacts, Teams channels/replies/chats/assignments, OneNote, OneDrive, SharePoint files/lists, To Do, basic Planner resources and authorized transcripts/recordings where their exact capabilities permit. Word/PPTX/XLSX content enters through accessible files. Do not claim universal access to every Microsoft product.

Use supported authentication libraries, incremental consent and separate school/personal accounts. School permissions may be blocked by tenant policy; keep denied capabilities explicit. Do not substitute tenant-wide app permissions to defeat denied delegated consent. Verify current official endpoints/scopes when implementing; the prior connector research is a baseline, not a guarantee about this account.

Fetch paginated replies as well as main messages. Preserve student-specific applicable assignments/deadlines where available. Isolate account/tenant/container identities. Do not mark mail read, send messages, submit assignments, mutate files, attendance or grades as import side effects. To Do/Planner mirrors remain read-only unless a separately specified provider write feature is deliberately added.

Grade/attendance data is newly in product scope, but requires its own available permission/capability. A connection that can read assignments is not assumed to expose grades or attendance. Authoritative protected school content may only be copied to this personal host/client when permitted by the account/source policy.

### 14.3 Visma InSchool

Retain the dedicated `VismaAdapter` interface and per-capability readiness. Desired data is the owner's applicable timetable, subjects/classes, rooms, changes, assignments/school information, and separately enabled authorized attendance/grade data where genuinely exposed.

Use an actual provider/school-approved specification, a verified institution-provided feed/export, or a working clearly labeled import bridge. Do not invent a student API, treat a different school product's API as InSchool, or mistake roster access for timetable access. A snapshot is not live sync. Do not extrapolate an entire academic year from one example week without explicit approved boundaries.

Authentication is provider-supported and interactive where required. Never capture Feide passwords or copy another app's session cookies. When a live capability cannot be established, retain its interface, readiness explanation and real importer; continue the rest of the product. Live completion requires authorized end-to-end evidence, not a fixture labeled synced.

### 14.4 Google Calendar and personal-data providers

Add Google Calendar as an optional provider using the existing calendar model, source ownership, private overlays, outbox, confirmation policy and sync contracts. OAuth/read/write permissions and actual recurrence behavior must be verified against current official documentation at implementation.

YouTube, Spotify, TikTok, Instagram, Reddit and Discord appear in the capability registry as optional sources, not a promise that all likes/watch history/private messages can be fetched. For each selected capability, document exact API/export fields, account/app eligibility, auth, quotas, retention and a live test. Unsupported history can be imported from an actual owner-provided export. Do not automate user accounts with prohibited self-bot/session extraction patterns.

### 14.5 Maxun, Firecrawl, Anakin OSS and controlled browser access

Preserve three interchangeable adapter roles from the uploaded spec:

| Adapter candidate | Intended role, not an assertion of enabled access |
|---|---|
| Maxun | User-configured permitted website-to-API/browser workflow: supported login, navigation and extraction. |
| Firecrawl | Selected public web fetching/crawling, clean Markdown, structured extraction and RAG ingestion; prefer self-hosting when practical. |
| Anakin OSS | Optional interchangeable scraper/extractor once the exact project, license, supported interface and safe deployment are established. |

Keep the app independent of any single scraper. A verified safe-fetch/plain-document import path works without optional backends. The exact Anakin OSS target is not supplied in the attachment; record it as unresolved, not a randomly selected similarly named package. The name Maxun does not prove an authenticated social site is accessible or permitted.

Store browser profiles/credentials in an isolated integration worker, never expose cookies to the model, and require intentional supported sign-in. Scope automations to configured sites and read workflows. Do not let pasted material choose arbitrary browser actions or executable scripts. Pause on login/MFA/CAPTCHA or layout changes and report the failure. Remote PCs are not secretly automated by the host.

The source uses “Meetly.” Retain that adapter name/alias, with **Meetily** as the project already referenced in this conversation. Verify the installed edition's actual transcript/export interface [R9]. Import original audio/transcripts with timestamps and source identity; do not assume a reminder API or paid-only feature exists. Sorta owns reminders and study events regardless of the transcription tool.

### 14.6 Synchronization schedules

Keep configurable weekly personal-data synchronization, initially Sunday at 03:00 Europe/Oslo after enablement, plus daily/manual/custom schedules. School timetables and calendars have independent suitable refresh schedules; do not leave urgent school changes stale for a week merely because personal interests sync weekly.

Use cursors, source timestamps, content hashes and stable IDs for incremental work. Store data before advancing a cursor. Handle pagination, duplicate delivery, deletion, revoked access, expired cursors and throttling with bounded retries/backoff. Missing/denied data is not an authoritative deletion.

If the host sleeps through a run, show the missed schedule and run one catch-up under policy when it returns; do not replay an unbounded backlog. Schedule wall-clock recurrences deterministically across DST, including Sunday 03:00. New personal insights are based only on actually imported records with visible coverage.

## 15. Weekly review and proactive assistance

Generate an opt-in weekly review covering school/study time, completion, attendance coverage, upcoming assessments, projects/ideas, planned social/exercise/free time, observed digital interests, catch-up suggestions and upcoming workload risks.

Everything is source-linked and timestamped. Planned exercise is not measured exercise; a timer is not proof of completed study; consumption unavailable from a provider remains unavailable. Summaries can be generated on demand when a scheduled run did not occur.

Keep suggestions bounded, useful and dismissible. Quiet resurfacing connects a current project to an older relevant note. A daily “ready for tomorrow” view combines the actual schedule, explicit equipment requirements, unresolved times, deadlines and private promises. Do not send a notification for every inferred relation or invent a psychological explanation for behavior.

## 16. AI runtime and permissioned agents

Keep **Qwen3.5-4B**, initially `qwen3.5:4b`, as the default local general model and **Qwen3-Embedding-0.6B**, initially `qwen3-embedding:0.6b`, as the default embedding model. Their Ollama tags were checked for this merge [R7, R8]. Keep the existing fixed 1,024-dimensional embedding plan, subject to a runtime dimension check and official model-template verification. Do not guess output size or silently mix incompatible embeddings.

Do not choose a larger model just because the host has a 4090. Benchmark classification, extraction, citation support, date/person ambiguity, tutoring and memory on the real workload. Pin version/digest/quantization/runtime and record latency/memory. Larger-model evaluation can be an explicit future setting, not an automatic download or replacement.

The provider layer exposes `generate`, `chat`, `embed`, `extract` and `classify`; the rest of the product uses it rather than hard-coded vendor calls. Ship a real Ollama adapter and an explicitly configured OpenAI-compatible local-server adapter if it is enabled. Cloud providers are opt-in only, no automatic local-failure fallback, and never allowed for a prohibited vault. An OpenAI-compatible protocol does not by itself mean a server is local.

Use small bounded validated outputs, likely destinations/context and concise evidence packets. The agent router selects allowed domain tools for School, Calendar, Brain/RAG, Tasks, Study, Performance, People and Personal Data. It does not launch a large council for each sentence or send the complete vault to every request.

LLM → schema validation → entity/source validation → permission policy → deterministic domain command → audit/outbox. No shell, SQL, arbitrary URLs, host paths, credentials or model-written code execution from extracted content. Keep READ, local bounded WRITE, external WRITE and destructive operations explicit. Even read tools require scope checks because personal data is sensitive.

The AI action log records action/tool, source versions, normalized safe input/output, reason, model/prompt/policy versions, confirmation, result and reversible effect. Do not require or store hidden chain of thought. Ordinary logs contain IDs and timing rather than private text or tokens.

Interactive capture is CPU/storage work and never waits for the GPU. Prioritize user Ask/study interaction over batches. Initially allow one generation job per GPU worker; schedule embeddings/transcription with bounded resource budgets and measured headroom. Provide pause, quiet hours and a low-resource/gaming mode. Recover honestly from OOM/runtime failure; no secret cloud escalation.

Keep local MCP tools and CLI-Anything-style JSON tools with the same permissions and service layer. Compatibility means predictable schemas, state/error handling and reversible operations where feasible—not a dependency on a universal executable controlling everything. Tool discovery must show implemented capabilities, not fictional handlers. Connecting an external AI client can disclose the returned notes to that client; display that boundary.

## 17. Shared engineering architecture

### 17.1 Stack and repository

Preserve a working repository's choices where compatible. For a new repository retain the agreed React/TypeScript/Vite PWA, Tauri Windows shell, Tiptap/Yjs editor, Fastify/TypeScript API, PostgreSQL/pgvector hub, SQLite desktop replica, IndexedDB browser cache, local Ollama worker and optional local transcription helper. Keep FullCalendar Standard as the calendar-grid candidate pending compatibility/license checks; do not require paid plugins.

Use a modular monolith and existing database-backed jobs, not a collection of duplicate microservices. New school/performance/profile features extend shared domain packages.

```text
apps/
  web/ desktop/ server/ browser-extension/ local-worker/ mcp/
packages/
  contracts/ domain/ editor/ storage/ retrieval/ ingestion/ ai/ ui/
  calendar/ commitments/ school/ study/ scheduler/ performance/
  attendance/ people/ memory/ personal-data/ integrations/ policy/
infra/
  windows-host/ compose/ remote-access/ migrations/ backup/
docs/
  architecture/ api/ operations/ security/ evaluation/
tests/
  unit/ contracts/ integration/ e2e/ native/ model-eval/ fixtures/
```

Logical `/auth`, `/inbox`, `/tasks`, `/calendar`, `/school`, `/study`, `/brain`, `/rag`, `/memory`, `/performance`, `/attendance`, `/people`, `/personal-data`, `/integrations`, `/ai`, `/agents`, `/scheduler`, `/sync` and `/insights` modules correspond to the uploaded service boundaries, not separately deployed servers.

### 17.2 Data model and canonical identities

Reuse owner, vault, device, session, note, capture, revision, block, attachment/blob, source object/revision, source anchor, label, collection, relationship, correction, proposal, AI operation, chat/message, task, reminder, notification, job, integration/account/resource/cursor, provider outbox and sync tombstone.

Add or extend: Person/roles/aliases, Subject, Course/term, Assignment, Assessment, AttendanceRecord, GradeRecord/scale, StudyPlan, StudySession, Exercise, Attempt, Flashcard/Review, KnowledgeGap, SchedulingConstraint/Run/Placement, ExecutionSession, Memory, Idea, Project, Goal, Interest/InterestEvidence, PersonalDataItem and AIInsight.

Retain Calendar, Event/series/exception/revision/provider mapping, private overlay, Commitment/condition/binding and PrepItem. Map `CalendarEvent` to the existing event entity rather than creating another calendar-event table because a different source used a different name. Transcript is an original media/source plus extraction revisions, not a second independent notes database.

All user data is owner/vault scoped with stable IDs, timestamps, revisions, provenance and explicit derived status. Provider identities include account/tenant/container/object, not a display name alone. A known blob hash or source ID is not authorization.

Important relationships: task ↔ assignment/goal; study plan → tasks/material; session → task/calendar occurrence; grade → assessment; attendance → lesson occurrence; promise → person/object/source; prep → event occurrence/commitment/evidence; profile inference → evidence items. Keep practice estimates and private annotations separate from official provider records.

Use deterministic typed columns/validated JSON unions for structured fields. Do not use an opaque JSON “brain” blob as the primary domain schema. Source version references permit stale-result rejection and deletion propagation.

### 17.3 Writes, sync and jobs

One authorized domain command layer handles UI, API, MCP, tools, imports and providers. Yjs merges note bodies; calendar times, grades, commitments and metadata use version-checked commands. CRDT convergence is not proof that every semantic conflict is resolved correctly.

Persist local edits before acknowledgment. Use idempotent operation IDs, expected versions, transactional outbox, cursors, snapshots and acknowledgments. Retry at-least-once delivery without duplicate effects. Tombstones/purge ledger prevent old replicas resurrecting deleted IDs. Cross-origin/client caches never become permission bypasses.

Jobs remain queued, waiting_for_worker, running, succeeded, failed, cancelled or superseded. Use leases/heartbeats, bounded retries, checkpoints, actual stage progress and usable terminal errors. Record source hash/revision, owner/vault, model/prompt/chunker versions and policy. A stale extraction result cannot override a newer edit or user lock.

Background job families cover Inbox processing, source extraction, embeddings/reindex, authorized integration/calendar sync, interest analysis, weekly reviews, study generation, deterministic replanning and backup verification. Bounded queues prevent optional crawlers/audio from blocking saving or reminders. Cancellation stops future effects; an external write already acknowledged requires its own reviewed compensating action.

## 18. API, tools and endpoint completeness

The machine-readable `API-INVENTORY.json` is the consolidated design inventory. The human-readable operation appendix in this document is the same inventory, not a competing route set. It retains the 149 baseline operations and 79 calendar-extension operations, then adds explicit Personal OS and deployment operations without recreating common jobs/proposals/tasks/sources.

These are planned contracts, not a generated/validated OpenAPI implementation. Codex must implement typed schemas, actual services/persistence, permissions, UI connections, failure paths and tests, then generate OpenAPI 3.1 and the client from real contracts. Do not create a generic endpoint returning invented success to satisfy an operation count.

All scoped REST routes use `/api/v1/vaults/{vaultId}`; installation/session operations retain their existing paths. Native calls use equivalent domain contracts without exposing unrestricted local HTTP/SQL. Compatibility aliases can preserve earlier SDK operation IDs but must not create parallel state.

Every route requires explicit input/output validation, ownership/sensitive capability authorization, pagination/limits where relevant, appropriate idempotency, expected revisions for replacement writes, standard safe errors, rate limits and traceable persistence. A `201` means an internal record exists; it does not prove a provider write succeeded. A `202` means a durable job was accepted, with status/cancel/error/result paths. `delivery_unknown` is not success.

Authentication uses maintained session/WebAuthn/OAuth components, secure HttpOnly cookies, origin checks and CSRF protection, with revocable scoped native/API tokens. No provider refresh token in the browser bundle/localStorage, model context or logs. Bootstrap is one owner, closed after setup, with tested recovery.

Keep SSE job progress, reconnect IDs, bounded websocket sync and cursor fallback. Unauthorized jobs, attachments, citation targets and exports are protected just like notes. Unknown capability returns an explicit capability/error response, not an empty “synced” list. Do not expose a general shell/SQL/browser-control endpoint.

Extend existing search, Today, generations, tasks, proposals/accept/reject, connections, sources, sync, notifications, audits and exports to new domain kinds. Do not build duplicate retrieval and notification endpoints per screen. Existing calendar preparation-plan is a compatibility entry into the single scheduler/study-planning service.

Every operation maps to feature IDs, actual routes, domain command/query, UI/tool caller and tests. CI compares the inventory, registered routes and generated OpenAPI; no fictional documented routes and no undocumented private-data routes. Native and MCP contracts receive the same scope/failure tests.

## 19. Privacy, storage, backups and source deletion

Store provider secrets encrypted in an OS/server credential system accessible only to approved integration workers. The LLM receives normalized authorized content, never passwords, cookies, OAuth refresh tokens or authentication headers. Protect host disk/backups with real encryption; an app lock is not disk encryption.

Machine-local vaults do not upload data/metadata/embeddings/prep to the hub or remote clients. A host-synced vault is remotely accessible only after explicit enablement and authorization. Private grade/attendance/profile data can have tighter client cache and tool permissions. Enabling a connector, cloud AI or remote transport discloses exactly which data crosses which boundary.

Imported files/web text/model outputs are untrusted. Sanitize rendered HTML, enforce CSP, disable macro/script execution, isolate extraction, bound archive expansion/file sizes, block archive traversal, and enforce a public-fetch SSRF policy including redirects/DNS changes. Configured local providers use a separate explicit allowlist, not a general “allow private IP” switch controlled by model text.

Browser automation profiles, service tokens and host tools are isolated from note content. No automatic cloud-model fallback, unexpected crawling, sending messages, public note sharing or account-wide data import. Optional cloud adapters require explicit per-vault policy and visible external processing.

Trash removes material from new retrieval; purge invalidates related chunks/vectors, summaries, cached answers, memory/profile evidence and private preparation. Confirmed events do not disappear merely because a supporting note is removed; apply the declared source/derivative policy and remove unsupported private excerpts. Historical quotations may require redaction. Tombstones prevent resurrection.

Exports preserve readable Markdown, original attachments, canonical snapshots/revisions, metadata, relationships and source anchors, including new school/study/commitment/profile records when selected. Public calendar exports exclude private sidecars and sensitive fields by default. Test a full-fidelity round trip with ID remapping into a fresh vault.

Backups include database, original file manifest, revisions and necessary protected key/recovery information consistently. Indexes are rebuildable; originals are not. Encrypt backup bundles, provide retention/verification status, and test restore in maintenance mode into a clean installation. Keep restore-job status outside the database being replaced. External sends remain disabled after restore until account reauthorization/reconciliation.

A backup on the same 4090 PC is not protection against losing that PC. Support an explicitly selected separate destination; do not silently sync private backups to a provider. Explain offline-device/export/backup-retention limits to deletion. Never claim zero-knowledge/E2EE for a server that processes plaintext.

## 20. First-run and operational experience

On the 4090 host, allow durable capture before models or connectors are configured. The setup sequence is: inspect/preserve existing installation → establish storage and owner recovery → prove local notes/calendar → validate local runtime/models → choose remote mode and canonical origin → verify a second client → enable selected sources → choose bounded automation/notification/cache policies.

Provide `doctor`, start, stop, status, logs-with-redaction, upgrade, rollback, export, backup, verify and restore operator commands/scripts. Configuration templates have no embedded credentials. Diagnostic responses distinguish network, host API, database, AI, sync, auth, provider and notification health.

Include resumable model download/cancel/storage checks, actual structured-output/embedding tests, real host resource information, queue pause and low-resource mode. Never alter an unrelated local model installation or open its networking without permission.

On the other PC, the owner follows the real authenticated URL and uses the web app or installs the PWA. It must work without the development toolchain. A trusted-device option permits a selected offline cache; a shared-device option does not persist private data. The home-host mode is visible so the owner understands why a sleeping host is unavailable.

Integration onboarding explains scopes, selected containers/history, private-data categories and access blockers before import. Missing credentials/administrator approval/domain/backend identity are external blockers, not empty successful data sources. Source connections can be disconnected independently without erasing unrelated notes; deletion is a separate previewed action.

## 21. Implementation order without dropping scope

**Stage 0 — Inspect and preserve.** Inspect the actual repository, working features, schema, authentication, AI, migrations and local changes. Map this specification to code. Document consequential decisions. Resolve installed-runtime questions through preflight rather than rewriting the stack.

**Stage 1 — Shared application and two-PC proof.** Durable notes/capture, canonical sources, local/calendar CRUD, shared navigation, auth, tasks, revisions, storage and one working secure remote mode. Prove saving on one PC and finding/opening it on the other, plus cached offline edits. Test restart early.

**Stage 2 — Librarian and calendar memory.** Real local inference/embeddings, classification/corrections, hybrid retrieval/source anchors, dates/entities, commitments, preparation, automation/Undo, recurrence and private overlay isolation. Run the positive book scenario and the Hanako/Ember negative scenario before enabling automatic extraction writes.

**Stage 3 — School and deterministic study.** Subjects/courses/materials/assignments/assessments, private authorized grades/attendance, study plan, constraint scheduler, focus execution, tutoring modes and catch-up. Prove one real authorized Microsoft read path early so consent blockers are not discovered at the end. Use manual/imported real sources when a provider is blocked.

**Stage 4 — Complete source and provider coverage.** Remaining Microsoft resources, Google provider, verified InSchool/import bridge, audio/Meetly adapter, browser clipper, watched folders, safe document/web ingestion and optional configured scraper backends. Finish actual outbox writes, consent, refresh and deletion behavior.

**Stage 5 — Personal data and adaptation.** Optional account capabilities, normalized evidence, source-linked memory/profile, interest decay, weekly synchronization/insights, adaptive estimates, social planning, projects/ideas and tool/CLI/MCP integration. No profile inference without opt-in/source support.

**Stage 6 — Release evidence.** API conformance, two-device conflicts, purge/revocation, runtime failure, real-model evaluation, security, accessibility, Windows installer/host startup, proxy/realtime tests, backup/restore and operator guide. Each advertised live integration is separately verified on an authorized account.

These stages order work; they are not permission to stop at a mockup or permanently drop late-stage features. A provider blocked by external access remains explicitly blocked while the rest is completed. Finish enabled supported workflows end to end; do not call a provider live until its actual tests pass.

## 22. Acceptance and definition of done

A feature is finished only when the UI, domain logic, persistence, authorization, loading/empty/error states, validated AI, source traceability, restart behavior and meaningful tests work. Production cannot fall back to fake notes, calendars, grades, attendance, messages, sync or AI outputs. Demo fixtures use separate database/configuration and visible labeling.

Retain baseline notes tests and the full calendar suite. Add tests covering school coverage/authority, deterministic placement, study source correctness, practice versus official grades, unknown attendance, identity/profile corrections, actual provider field availability, weekly catch-up, all remote paths, trusted cache/revocation and host-off behavior.

Mandatory end-to-end scenarios include:

1. Capture on the remote PC, save durably, organize on the 4090, retrieve by remembered meaning and open the exact original passage from either client.
2. Record a loan and later a matching meeting; get one correct bring item; move/cancel the meeting without losing the promise; distinguish packed from returned and reject the mismatched-person example.
3. Import actual chapter material and an assessment, create a source-backed study plan within constraints, start a session, record a real attempt and replan remaining work without moving fixed school events.
4. Record a known absence with incomplete material coverage; show only supported catch-up sources and unknowns, with correct denominator/period summaries.
5. Enable an actual personal-data capability, import observed interaction types, show editable evidence-backed interests, then remove a source and retract its derivatives.
6. Stop the model while the host runs; keep manual notes/calendar/search working. Stop the host; show only explicitly cached information and pending local work, not an imaginary live cloud.
7. Revoke a client/source, purge supporting evidence, test cross-vault requests and hostile document instructions; no secret disclosure, unauthorized invitation or stale-content resurrection.
8. Restore into a clean installation and verify notes, files, citations, commitments, school/study records and controlled provider reconciliation.

Use the original proposed model targets as targets, not achievements: held-out auto-filing precision/coverage, retrieval Recall@10, citation resolvability, source entailment and abstention, with dataset sizes and raw failures. Evaluate scheduling with deterministic/property tests, not model prose. Report warm/cold latency, real RAM/VRAM, long-document behavior and contention on the actual host. No guaranteed instant inference.

Deliver source, migrations, lockfiles, schemas/OpenAPI/client, full route/feature/test mapping, isolated demo mode, real local model adapter, host/Windows/PWA artifacts, secure-access configuration/runbook, measured test reports, dependency/license inventory and tested recovery. Report `implemented`, `tested_with_fixtures`, `live_verified`, `failed`, `not_run` and `externally_blocked` distinctly. A code path or document is not a passed test, a configured tunnel or a live account.

## 23. Source and merge provenance

The feature requirements above come from the existing Sorta Notes specification, Sorta Calendar/connector/API/test package, the uploaded Personal OS specification, and the owner's new 4090-host/other-PC requirement. Additional decisions are confined to merging conflicts and making that remote deployment implementable: explicit hosting placement, private/browser-only transport modes, client cache trust, webhook reachability and host-off semantics.

`FEATURE-COVERAGE.md` maps all 62 Personal OS sections and the retained Sorta feature families into this document. `API-INVENTORY.json` and its appendix consolidate contracts. No private account, repository implementation, device network or deployment has been inspected by this planning work.

Primary references checked specifically for the remote/model/adapter clarification are listed below. They support component facts, not completed software. Verify versions, APIs, permissions and terms again when installing or connecting. Earlier provider references are preserved in `reference-inputs/RESEARCH-SOURCES-v2.md` and are not silently treated as a current live account test.

- **[R1]** Tailscale Serve, private tailnet service access and HTTPS: `https://tailscale.com/docs/features/tailscale-serve`
- **[R2]** Serve CLI and persistent background mode: `https://tailscale.com/docs/reference/tailscale-cli/serve`
- **[R3]** Tailscale unattended operation: `https://tailscale.com/docs/how-to/run-unattended`
- **[R4]** Cloudflare Tunnel outbound model: `https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/`
- **[R5]** Access-protected self-hosted HTTP application: `https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/`
- **[R6]** Access JWT validation: `https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/`
- **[R7]** Default general model distribution: `https://ollama.com/library/qwen3.5:4b`
- **[R8]** Default embedding distribution: `https://ollama.com/library/qwen3-embedding:0.6b`
- **[R9]** Meetily project identity and capabilities: `https://github.com/Zackriya-Solutions/meetily`
- **[R10]** Firecrawl self-host deployment documentation: `https://docs.firecrawl.dev/contributing/self-host`


# Appendix A — Complete merged endpoint catalog

**Planning only.** 355 HTTP/realtime operations: 149 retained notes operations, 79 retained calendar operations and 127 added Personal OS/host operations. All must use actual typed schemas, authorization, durable effects, honest capability states and tests. This catalog is not an implemented API or OpenAPI file.

Common request/error/authorization rules in master sections 17–19 apply to every operation. Successful empty responses have no body. Method-sensitive private scopes are mandatory. Retained operation IDs are compatible entry points; extensions add shared domain scope rather than another write path.

`/api/v1/vaults/{vaultId}/events` is the existing **SSE change stream**, not the calendar event collection. Calendar records remain at `/calendar-events`. Static/provider-specific paths must not be swallowed by parameter routes.

## Identity and installation

### `healthLive`
`GET /health/live` · success `200` · scope `public`
- **Request:** none
- **Response:** Health {status: ok}
- **Contract:** Process liveness only; no versions, keys, topology, or account details.

### `healthReady`
`GET /health/ready` · success `200` · scope `public`
- **Request:** none
- **Response:** Health {status: ready}
- **Contract:** 503 when required persistence is unavailable; no internal diagnostics.

### `getMeta`
`GET /api/v1/meta` · success `200` · scope `public`
- **Request:** none
- **Response:** Meta {api_version, client_min_version, schema_version}
- **Contract:** Return supported protocol versions, not private vault configuration.

### `bootstrapOptions`
`POST /api/v1/auth/bootstrap/options` · success `200` · scope `one_time_bootstrap_secret`
- **Request:** {bootstrap_secret, owner_label}
- **Response:** WebAuthnRegistrationOptions {challenge_id, public_key_options, expires_at}
- **Contract:** Only before owner initialization; rate limit; persist challenge.

### `bootstrapVerify`
`POST /api/v1/auth/bootstrap/verify` · success `201` · scope `bootstrap_challenge`
- **Request:** {challenge_id, credential: WebAuthnRegistrationResponse}
- **Response:** BootstrapResult {owner, recovery_codes_once, session}
- **Contract:** Atomically consume bootstrap secret/challenge; establish closed owner account and secure cookie.

### `loginOptions`
`POST /api/v1/auth/login/options` · success `200` · scope `public_rate_limited`
- **Request:** none
- **Response:** WebAuthnAuthenticationOptions {challenge_id, public_key_options, expires_at}
- **Contract:** Short-lived, origin/RP-bound challenge; do not disclose private content.

### `loginVerify`
`POST /api/v1/auth/login/verify` · success `200` · scope `login_challenge`
- **Request:** {challenge_id, credential: WebAuthnAuthenticationResponse}
- **Response:** Session {id, owner_id, expires_at, auth_level}
- **Contract:** Verify challenge/origin/RP; set secure cookie; consume challenge once.

### `getSession`
`GET /api/v1/auth/session` · success `200` · scope `session`
- **Request:** none
- **Response:** Session
- **Contract:** Return current session or 401, never a fabricated anonymous owner.

### `logout`
`POST /api/v1/auth/logout` · success `204` · scope `session`
- **Request:** none
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Revoke session and clear cookie; idempotent.

### `recoverAccount`
`POST /api/v1/auth/recovery` · success `200` · scope `recovery_code_rate_limited`
- **Request:** {recovery_code}
- **Response:** RecoverySession {id, expires_at, allowed_actions}
- **Contract:** Consume a hashed recovery code once; restricted session permits replacing passkeys, not immediately exporting all data.

### `listPasskeys`
`GET /api/v1/auth/passkeys` · success `200` · scope `owner`
- **Request:** none
- **Response:** List<PasskeySummary>
- **Contract:** Never return private key material.

### `passkeyOptions`
`POST /api/v1/auth/passkeys/options` · success `200` · scope `owner_reauth_or_recovery`
- **Request:** {label}
- **Response:** WebAuthnRegistrationOptions
- **Contract:** Explicit account recovery or recent strong authentication required.

### `passkeyVerify`
`POST /api/v1/auth/passkeys/verify` · success `201` · scope `owner_reauth_or_recovery`
- **Request:** {challenge_id, credential: WebAuthnRegistrationResponse}
- **Response:** PasskeySummary
- **Contract:** Verify and register; recovery flow revokes previous recovery session and follows documented session policy.

### `deletePasskey`
`DELETE /api/v1/auth/passkeys/{passkeyId}` · success `204` · scope `owner_reauth`
- **Request:** none
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Prevent removing the last viable sign-in/recovery path.

### `rotateRecoveryCodes`
`POST /api/v1/auth/recovery-codes/rotate` · success `200` · scope `owner_reauth`
- **Request:** none
- **Response:** RecoveryCodes {codes_once: string[]}
- **Contract:** Invalidate old codes; store new hashes only; never log plaintext codes.

### `listSessions`
`GET /api/v1/auth/sessions` · success `200` · scope `owner`
- **Request:** none
- **Response:** List<SessionSummary>
- **Contract:** Include current-device marker and last activity without secrets.

### `revokeSession`
`DELETE /api/v1/auth/sessions/{sessionId}` · success `204` · scope `owner`
- **Request:** none
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Revoke targeted session, including active event streams.

### `refreshNativeToken`
`POST /api/v1/auth/token/refresh` · success `200` · scope `native_refresh_token`
- **Request:** {refresh_token}
- **Response:** TokenPair {access_token, refresh_token, expires_at}
- **Contract:** Rotate refresh tokens; detect replay; no browser localStorage token flow.

## Devices and API access

### `createPairing`
`POST /api/v1/device-pairings` · success `201` · scope `public_rate_limited`
- **Request:** {device_name, requested_role: client|worker, client_public_key?}
- **Response:** PairingChallenge {pairing_id, device_code_once, user_code, expires_at}
- **Contract:** No data access until approved from an authenticated owner session.

### `approvePairing`
`POST /api/v1/device-pairings/{pairingId}/approve` · success `200` · scope `owner_reauth`
- **Request:** {user_code, vault_ids, scopes, approved_role}
- **Response:** PairingApproval {status, expires_at}
- **Contract:** Approve exact device and scope; worker scope cannot exceed owner scope.

### `exchangePairing`
`POST /api/v1/device-pairings/{pairingId}/exchange` · success `[200, 202]` · scope `pairing_device_secret`
- **Request:** {device_code}
- **Response:** TokenPair or PairingPending {status, retry_after_seconds}
- **Contract:** One-time exchange; pending/expired are explicit; never mint token on failed approval.

### `listDevices`
`GET /api/v1/devices` · success `200` · scope `owner`
- **Request:** none
- **Response:** List<DeviceSummary>
- **Contract:** List authorized devices, scope, role, status, last seen.

### `revokeDevice`
`DELETE /api/v1/devices/{deviceId}` · success `204` · scope `owner_reauth`
- **Request:** none
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Revoke tokens, worker claims, streams, and future synchronization; do not promise remote deletion of cached files.

### `listApiTokens`
`GET /api/v1/tokens` · success `200` · scope `owner`
- **Request:** none
- **Response:** List<ApiTokenSummary>
- **Contract:** List labels/scopes/expiry without token secrets.

### `createApiToken`
`POST /api/v1/tokens` · success `201` · scope `owner_reauth`
- **Request:** {label, vault_ids, scopes, expires_at}
- **Response:** ApiTokenCreated {id, secret_once, scopes, expires_at}
- **Contract:** No wildcard permission by default; hash stored token; show secret once.

### `revokeApiToken`
`DELETE /api/v1/tokens/{tokenId}` · success `204` · scope `owner`
- **Request:** none
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Immediate revocation of future requests and relevant streams.

## Vaults, preferences and status

### `listVaults`
`GET /api/v1/vaults` · success `200` · scope `owner_or_scoped_client`
- **Request:** none
- **Response:** List<VaultSummary>
- **Contract:** Remote API lists only explicitly remote-authorized host-synced vaults; machine-local vaults never register here.

### `createVault`
`POST /api/v1/vaults` · success `201` · scope `owner`
- **Request:** {name, locale, timezone}
- **Response:** Vault
- **Contract:** Explicitly creates a cloud vault; desktop local vault creation is native/local.

### `getVault`
`GET /api/v1/vaults/{vaultId}` · success `200` · scope `vault:read`
- **Request:** none
- **Response:** Vault
- **Contract:** Check vault ownership before returning metadata. Omega: distinguish machine-local from explicitly remote-authorized host-synced vaults; local-only data never becomes remote context implicitly.

### `updateVault`
`PATCH /api/v1/vaults/{vaultId}` · success `200` · scope `vault:write`
- **Request:** {name?, locale?, timezone?, expected_revision}
- **Response:** Vault
- **Contract:** Changing sync/privacy mode is not an implicit metadata patch. Omega: mode/privacy changes require preview and authorization; remote viewing is explicit client disclosure and is different from enabling a cloud AI provider.

### `purgeVault`
`POST /api/v1/vaults/{vaultId}/purge` · success `202` · scope `owner_reauth`
- **Request:** {confirmation: PurgeConfirmation, expected_revision}
- **Response:** JobHandle
- **Contract:** Explicit destructive operation; purge derived data/tombstone IDs and revoke active jobs.

### `getPreferences`
`GET /api/v1/preferences` · success `200` · scope `owner`
- **Request:** none
- **Response:** Preferences
- **Contract:** Versioned, bounded settings schema. Omega: typed preferences include time protection, focus, privacy, optional profiling, sensitive school categories and default personal-data sync. Do not return credential material.

### `updatePreferences`
`PATCH /api/v1/preferences` · success `200` · scope `owner`
- **Request:** PreferencesPatch + expected_revision
- **Response:** Preferences
- **Contract:** Validate locale/timezone/notification choices; no arbitrary endpoints or executable settings. Omega: distinguish owner policy from inferred preferences; explicit consent for expanded data egress/profile inference. Security-sensitive deployment changes use reviewed host setup.

### `getStatus`
`GET /api/v1/status` · success `200` · scope `owner`
- **Request:** none
- **Response:** SystemStatus {storage, sync, workers, backup, versions}
- **Contract:** Operational diagnostics only; no prompts, tokens, or stack traces. Omega: distinguish home host availability, AI runtime, authorized providers, cache freshness and pending local changes; no claim of always-on cloud while the host is down.

### `getToday`
`GET /api/v1/vaults/{vaultId}/today` · success `200` · scope `notes:read`
- **Request:** {date?: ISO-date, timezone?: IANA-zone}
- **Response:** TodayView {recent_notes, tasks, resurfacing, project_briefs}
- **Contract:** Read-only materialized view with freshness; no unexpected generation or scheduling. Omega: include one next action, school/calendar freshness, private preparation, due work, optional performance/attendance and resumable work; hide unenabled sensitive modules.

## Capture and notes

### `createCapture`
`POST /api/v1/vaults/{vaultId}/captures` · success `201` · scope `capture:write`
- **Request:** {client_capture_id, kind, text?, rich_text?, blob_ids?, source?: SourceMetadata}
- **Response:** CaptureReceipt {capture_id, note_id, revision_id, processing_jobs}
- **Contract:** Save original and note before returning; idempotency key prevents duplicate retries.

### `getCapture`
`GET /api/v1/vaults/{vaultId}/captures/{captureId}` · success `200` · scope `notes:read`
- **Request:** none
- **Response:** Capture {id, note_id, original, source, stages}
- **Contract:** Return immutable original and actual per-stage status; attached bodies use authorized blob reads.

### `createUrlCapture`
`POST /api/v1/vaults/{vaultId}/url-captures` · success `202` · scope `capture:write`
- **Request:** {url, fetch_consent: true, selected_text?, title?}
- **Response:** JobHandle
- **Contract:** Explicit safe fetch; private-network redirects/SSRF blocked; resulting capture preserves source URL.

### `listNotes`
`GET /api/v1/vaults/{vaultId}/notes` · success `200` · scope `notes:read`
- **Request:** {cursor?, limit?, filters?: NoteFilters, sort?}
- **Response:** List<NoteSummary>
- **Contract:** Bounded filters and pagination; exclude trash by default; include unsorted notes.

### `createNote`
`POST /api/v1/vaults/{vaultId}/notes` · success `201` · scope `notes:write`
- **Request:** {id?, title?, content: InitialContent, provenance?}
- **Response:** Note
- **Contract:** Create canonical editor document and first revision atomically.

### `getNote`
`GET /api/v1/vaults/{vaultId}/notes/{noteId}` · success `200` · scope `notes:read`
- **Request:** none
- **Response:** Note
- **Contract:** Canonical metadata plus authorized current-document reference; no unrestricted blob URLs.

### `updateNoteMetadata`
`PATCH /api/v1/vaults/{vaultId}/notes/{noteId}` · success `200` · scope `notes:write`
- **Request:** {title?, pinned?, archived?, user_locks?, expected_revision}
- **Response:** Note
- **Contract:** Metadata only; no competing editable body field; preserve AI/user provenance.

### `trashNote`
`DELETE /api/v1/vaults/{vaultId}/notes/{noteId}` · success `204` · scope `notes:write`
- **Request:** {expected_revision}
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Soft-delete with tombstone/event; immediately exclude from new retrieval.

### `restoreTrashedNote`
`POST /api/v1/vaults/{vaultId}/notes/{noteId}/restore` · success `200` · scope `notes:write`
- **Request:** {expected_revision}
- **Response:** Note
- **Contract:** Explicitly restore recoverable trash, never a permanently purged ID.

### `purgeNote`
`POST /api/v1/vaults/{vaultId}/notes/{noteId}/purge` · success `202` · scope `owner_reauth`
- **Request:** {confirmation: PurgeConfirmation, expected_revision}
- **Response:** JobHandle
- **Contract:** Purge note-derived caches and quotes under policy; retain minimal deletion ledger. Omega: invalidate evidence-derived profile interests, study content, memories and prep; keep unrelated confirmed calendar records under explicit provenance policy.

### `getNoteDocument`
`GET /api/v1/vaults/{vaultId}/notes/{noteId}/document` · success `200` · scope `notes:read`
- **Request:** {format: editor_json|markdown|text, revision_id?}
- **Response:** DocumentRepresentation {format, content, revision_id, source_map}
- **Contract:** Render from canonical document state; historical reads recheck current access.

### `editNote`
`POST /api/v1/vaults/{vaultId}/notes/{noteId}/edits` · success `201` · scope `notes:write`
- **Request:** {expected_revision, edit: AppendMarkdown|ReplaceRange|ReplaceDocument}
- **Response:** NoteRevision
- **Contract:** External edits create canonical Yjs transactions and snapshots; unsafe stale replacements rejected.

### `listNoteRevisions`
`GET /api/v1/vaults/{vaultId}/notes/{noteId}/revisions` · success `200` · scope `notes:read`
- **Request:** {cursor?, limit?}
- **Response:** List<RevisionSummary>
- **Contract:** Show user/machine provenance and immutable source identity.

### `getNoteRevision`
`GET /api/v1/vaults/{vaultId}/notes/{noteId}/revisions/{revisionId}` · success `200` · scope `notes:read`
- **Request:** none
- **Response:** NoteRevision
- **Contract:** Return exact historical representation or explicit unavailable result, not latest content.

### `restoreNoteRevision`
`POST /api/v1/vaults/{vaultId}/notes/{noteId}/revisions/{revisionId}/restore` · success `201` · scope `notes:write`
- **Request:** {expected_current_revision}
- **Response:** NoteRevision
- **Contract:** Create a new revision from history; do not rewrite the old revision.

### `getRelatedNotes`
`GET /api/v1/vaults/{vaultId}/notes/{noteId}/related` · success `200` · scope `notes:read`
- **Request:** {limit?}
- **Response:** RelatedResult {explicit_links, suggested_links}
- **Contract:** Clearly distinguish similarity suggestions from confirmed semantic relationships.

### `reprocessNote`
`POST /api/v1/vaults/{vaultId}/notes/{noteId}/reprocess` · success `202` · scope `ai:run`
- **Request:** {stages: ProcessingStage[], expected_revision}
- **Response:** JobHandle
- **Contract:** Run only named stages; respect locks and model policy; no silent duplicate generation.

## Uploads and original files

### `createUpload`
`POST /api/v1/vaults/{vaultId}/uploads` · success `201` · scope `capture:write`
- **Request:** {filename, media_type, byte_length, sha256}
- **Response:** UploadSession {upload_id, part_size, expires_at}
- **Contract:** Bound total size/type; filename is metadata, never a server path.

### `putUploadPart`
`PUT /api/v1/vaults/{vaultId}/uploads/{uploadId}/parts/{partNumber}` · success `204` · scope `capture:write`
- **Request:** binary bytes; Content-Range and part SHA256
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Idempotent numbered parts; reject mismatched length/hash/overlap.

### `completeUpload`
`POST /api/v1/vaults/{vaultId}/uploads/{uploadId}/complete` · success `201` · scope `capture:write`
- **Request:** {sha256, part_count}
- **Response:** BlobSummary
- **Contract:** Verify assembled length/hash and type; atomically finalize immutable blob.

### `cancelUpload`
`DELETE /api/v1/vaults/{vaultId}/uploads/{uploadId}` · success `204` · scope `capture:write`
- **Request:** none
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Clean temporary parts; cancellation does not erase unrelated completed blobs.

### `getBlobMetadata`
`GET /api/v1/vaults/{vaultId}/blobs/{blobId}` · success `200` · scope `notes:read`
- **Request:** none
- **Response:** BlobSummary
- **Contract:** Known content hash is not authorization.

### `getBlobContent`
`GET /api/v1/vaults/{vaultId}/blobs/{blobId}/content` · success `200` · scope `notes:read_or_job_scoped_worker`
- **Request:** {download?: boolean}; Range header supported
- **Response:** binary bytes with safe content headers
- **Contract:** Recheck ownership/job scope; safe disposition; no active HTML execution.

## Organization and collections

### `listLabels`
`GET /api/v1/vaults/{vaultId}/labels` · success `200` · scope `notes:read`
- **Request:** {kind?: area|project|topic|entity, cursor?, limit?}
- **Response:** List<Label>
- **Contract:** Return stable IDs, aliases, provisional/confirmed status, and supported-note count.

### `createLabel`
`POST /api/v1/vaults/{vaultId}/labels` · success `201` · scope `notes:write`
- **Request:** {kind, name, aliases?, parent_id?}
- **Response:** Label
- **Contract:** Validate kind, duplicates, parent cycles, and sidebar limits.

### `updateLabel`
`PATCH /api/v1/vaults/{vaultId}/labels/{labelId}` · success `200` · scope `notes:write`
- **Request:** {name?, aliases?, parent_id?, pinned?, expected_revision}
- **Response:** Label
- **Contract:** Explicit owner edit; conflicting changes use revision checks.

### `deleteLabel`
`DELETE /api/v1/vaults/{vaultId}/labels/{labelId}` · success `204` · scope `notes:write`
- **Request:** {expected_revision, remove_associations: true}
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Remove category associations, not notes; log undoable operation.

### `setNoteLabels`
`PUT /api/v1/vaults/{vaultId}/notes/{noteId}/labels` · success `200` · scope `notes:write`
- **Request:** {label_ids, locked_label_ids, expected_revision}
- **Response:** NoteOrganization
- **Contract:** User associations override later classification; validate all IDs in this vault.

### `correctOrganization`
`POST /api/v1/vaults/{vaultId}/notes/{noteId}/corrections` · success `201` · scope `notes:write`
- **Request:** {expected_revision, remove_label_ids?, add_label_ids?, reason?, lock: boolean}
- **Response:** CorrectionReceipt
- **Contract:** Persist scoped correction and updated associations; do not silently create global routing rules.

### `listRelationships`
`GET /api/v1/vaults/{vaultId}/relationships` · success `200` · scope `notes:read`
- **Request:** {note_id?, kind?, cursor?, limit?}
- **Response:** List<Relationship>
- **Contract:** Evidence-backed suggestions marked unconfirmed.

### `createRelationship`
`POST /api/v1/vaults/{vaultId}/relationships` · success `201` · scope `notes:write`
- **Request:** {from_note_id, to_note_id, kind, evidence_anchor_ids?}
- **Response:** Relationship
- **Contract:** Both source notes must belong to authorized vault; explicit links marked user-authored.

### `deleteRelationship`
`DELETE /api/v1/vaults/{vaultId}/relationships/{relationshipId}` · success `204` · scope `notes:write`
- **Request:** {expected_revision}
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Remove relationship only, preserving source notes.

### `listCollections`
`GET /api/v1/vaults/{vaultId}/collections` · success `200` · scope `notes:read`
- **Request:** {cursor?, limit?}
- **Response:** List<Collection>
- **Contract:** Include system views and user-saved typed filters.

### `createCollection`
`POST /api/v1/vaults/{vaultId}/collections` · success `201` · scope `notes:write`
- **Request:** {name, filter: NoteFilterAST, sort, view}
- **Response:** Collection
- **Contract:** Validate finite filter AST; no executable query strings.

### `updateCollection`
`PATCH /api/v1/vaults/{vaultId}/collections/{collectionId}` · success `200` · scope `notes:write`
- **Request:** {name?, filter?, sort?, view?, expected_revision}
- **Response:** Collection
- **Contract:** Version and validate filters; system views have documented editable fields.

### `deleteCollection`
`DELETE /api/v1/vaults/{vaultId}/collections/{collectionId}` · success `204` · scope `notes:write`
- **Request:** {expected_revision}
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Remove saved view without deleting its notes.

### `getCollectionItems`
`GET /api/v1/vaults/{vaultId}/collections/{collectionId}/items` · success `200` · scope `notes:read`
- **Request:** {cursor?, limit?}
- **Response:** List<NoteSummary>
- **Contract:** Evaluate authorized query and return actual notes, not a stale mock count.

### `listRoutingRules`
`GET /api/v1/vaults/{vaultId}/rules` · success `200` · scope `notes:read`
- **Request:** {cursor?, limit?}
- **Response:** List<RoutingRule>
- **Contract:** Expose priority, match conditions, destinations, provenance and enabled state.

### `createRoutingRule`
`POST /api/v1/vaults/{vaultId}/rules` · success `201` · scope `notes:write`
- **Request:** {name, condition: RoutingConditionAST, target_label_ids, enabled}
- **Response:** RoutingRule
- **Contract:** Finite declarative matches; validate target IDs and initial affected-note preview.

### `updateRoutingRule`
`PATCH /api/v1/vaults/{vaultId}/rules/{ruleId}` · success `200` · scope `notes:write`
- **Request:** {condition?, target_label_ids?, enabled?, expected_revision}
- **Response:** RoutingRule
- **Contract:** User confirmation for a broadened rule; no arbitrary code.

### `deleteRoutingRule`
`DELETE /api/v1/vaults/{vaultId}/rules/{ruleId}` · success `204` · scope `notes:write`
- **Request:** {expected_revision}
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Stop future application; do not silently reverse historical user choices.

### `previewRoutingRule`
`POST /api/v1/vaults/{vaultId}/rules/preview` · success `200` · scope `notes:read`
- **Request:** {condition: RoutingConditionAST, target_label_ids, sample_limit}
- **Response:** RulePreview {affected_count, sample_note_ids, conflicts}
- **Contract:** Bounded read-only preview; no filing mutation.

## AI proposals and audit

### `listProposals`
`GET /api/v1/vaults/{vaultId}/proposals` · success `200` · scope `notes:read`
- **Request:** {status?, kind?, cursor?, limit?}
- **Response:** List<Proposal>
- **Contract:** No review requirement for all notes; only meaningful suggestions.

### `createProposal`
`POST /api/v1/vaults/{vaultId}/proposals` · success `201` · scope `notes:write`
- **Request:** {kind: merge_notes|split_note|merge_labels|bulk_reassign, inputs, expected_revisions}
- **Response:** Proposal
- **Contract:** Create concrete diff/affected-source preview without applying it. Omega: support typed study/scheduler plans, project/identity merges, profile corrections and provider action previews. Store base revisions, diff, scope, affected source IDs, expiry and permission requirements.

### `getProposal`
`GET /api/v1/vaults/{vaultId}/proposals/{proposalId}` · success `200` · scope `notes:read`
- **Request:** none
- **Response:** Proposal
- **Contract:** Return exact diff, affected note IDs, stale status and evidence.

### `acceptProposal`
`POST /api/v1/vaults/{vaultId}/proposals/{proposalId}/accept` · success `202` · scope `notes:write`
- **Request:** {expected_proposal_revision, confirmation}
- **Response:** JobHandle
- **Contract:** Apply validated plan transactionally or through idempotent batch with undo log; reject stale plans. Omega: validate the precise proposal type, current revisions, scope and constraints; commit atomically. Recompute or return stale/conflict rather than applying an old schedule or invitation.

### `rejectProposal`
`POST /api/v1/vaults/{vaultId}/proposals/{proposalId}/reject` · success `200` · scope `notes:write`
- **Request:** {expected_proposal_revision, reason?}
- **Response:** Proposal
- **Contract:** Persist dismissal and avoid repeated identical suggestions.

### `listAiOperations`
`GET /api/v1/vaults/{vaultId}/ai-operations` · success `200` · scope `notes:read`
- **Request:** {note_id?, cursor?, limit?}
- **Response:** List<AiOperation>
- **Contract:** Expose source revision, model digest, prompt version and changes; no hidden reasoning trace.

### `getAiOperation`
`GET /api/v1/vaults/{vaultId}/ai-operations/{operationId}` · success `200` · scope `notes:read`
- **Request:** none
- **Response:** AiOperation
- **Contract:** Detailed reversible metadata diff and evidence.

### `undoAiOperation`
`POST /api/v1/vaults/{vaultId}/ai-operations/{operationId}/undo` · success `200` · scope `notes:write`
- **Request:** {expected_current_revisions}
- **Response:** UndoReceipt
- **Contract:** Apply safe inverse; conflict if subsequent user edits would be overwritten.

### `getActivity`
`GET /api/v1/vaults/{vaultId}/activity` · success `200` · scope `notes:read`
- **Request:** {note_id?, cursor?, limit?}
- **Response:** List<ActivityEvent>
- **Contract:** Redacted, authorized event log; never leak another vault through IDs or messages.

## Search, chat and source navigation

### `searchNotes`
`POST /api/v1/vaults/{vaultId}/search` · success `[200, 202]` · scope `search:read`
- **Request:** {query, mode: lexical|hybrid|semantic, scope: SearchScope, limit, cursor?}
- **Response:** SearchResult for lexical; JobHandle for hybrid/semantic
- **Contract:** Lexical response is synchronous; model-dependent search is durable async and explicitly waits for a worker. Omega: search typed notes, documents, tasks, events, assignments, subjects, projects, ideas, memories and permitted personal-data records. Apply account/vault/category policy before retrieval; preserve compatibility of note-only filters.

### `suggestSearch`
`GET /api/v1/vaults/{vaultId}/search/suggestions` · success `200` · scope `search:read`
- **Request:** {prefix, limit?}
- **Response:** SearchSuggestions {labels, titles, saved_queries}
- **Contract:** Cheap authorized lexical/metadata suggestions; never needs generation.

### `resolveCitation`
`GET /api/v1/vaults/{vaultId}/citations/{citationId}` · success `200` · scope `notes:read`
- **Request:** none
- **Response:** ResolvedCitation {source, revision, anchor, exact_excerpt, current_note_link, historical}
- **Contract:** Open exact evidence; distinguish unavailable/purged source from current revision; all access rechecked.

### `listChats`
`GET /api/v1/vaults/{vaultId}/chats` · success `200` · scope `notes:read`
- **Request:** {cursor?, limit?}
- **Response:** List<ChatSummary>
- **Contract:** Only authorized vault chats.

### `createChat`
`POST /api/v1/vaults/{vaultId}/chats` · success `201` · scope `ask:run`
- **Request:** {title?, default_scope: SearchScope}
- **Response:** Chat
- **Contract:** Persist scope; default excludes generated notes as independent sources. Omega: accept a validated conversation mode (notes, tutor, calendar, profile or explicit brainstorm) and source scope. No mode grants additional permissions.

### `getChat`
`GET /api/v1/vaults/{vaultId}/chats/{chatId}` · success `200` · scope `notes:read`
- **Request:** none
- **Response:** Chat
- **Contract:** Return settings and stable identity, not unrelated conversation content.

### `deleteChat`
`DELETE /api/v1/vaults/{vaultId}/chats/{chatId}` · success `204` · scope `notes:write`
- **Request:** none
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Delete conversation/cache under retention policy and cancel pending answers.

### `listMessages`
`GET /api/v1/vaults/{vaultId}/chats/{chatId}/messages` · success `200` · scope `notes:read`
- **Request:** {cursor?, limit?}
- **Response:** List<Message>
- **Contract:** Include status, source manifest, and any purge/stale markers.

### `askNotes`
`POST /api/v1/vaults/{vaultId}/chats/{chatId}/messages` · success `202` · scope `ask:run`
- **Request:** {client_message_id, text, mode: grounded|brainstorm, scope?, queue_when_offline: boolean}
- **Response:** AskHandle {job_id, user_message_id, answer_message_id, status}
- **Contract:** Persist request first; source-linked answer only; offline worker state is immediate and honest. Omega: permit source-grounded school/study/profile queries and explicit tutor mode; separate answers from action proposals and official records from practice. Chat mode and authorized source scope are persisted.

### `generateArtifact`
`POST /api/v1/vaults/{vaultId}/generations` · success `202` · scope `ai:run`
- **Request:** {kind: summary|project_brief|comparison|outline|study_questions|checklist, scope, instructions?, output_language?, target_generated_note_id?, expected_revision?}
- **Response:** JobHandle
- **Contract:** Create a derivative note or explicitly refresh AI-owned blocks of a generated note at the expected revision; retain user edits and source history; never overwrite original notes. Omega: support study guides, flashcards, mock exams, project briefs, weekly insights and preparation summaries through typed generation kinds. Persist source/revision manifest and job.

## Tasks, reminders and notifications

### `listTasks`
`GET /api/v1/vaults/{vaultId}/tasks` · success `200` · scope `notes:read`
- **Request:** {status?, source_note_id?, due_before?, cursor?, limit?}
- **Response:** List<Task>
- **Contract:** Separate proposed from accepted tasks; exclude rejected suggestions by default. Omega: include authorized school/project/commitment context, estimates, remaining work and applicable filters without leaking sensitive grade records.

### `createTask`
`POST /api/v1/vaults/{vaultId}/tasks` · success `201` · scope `notes:write`
- **Request:** {title, source_anchor_id?, due_date?, due_at?, timezone?, status: accepted}
- **Response:** Task
- **Contract:** Explicit creation; date-only and timed values are distinct. Omega: support project/course/assignment links, duration estimates with origin, dependencies, splittability and explicit due-date semantics. Do not duplicate a source-owned assignment.

### `updateTask`
`PATCH /api/v1/vaults/{vaultId}/tasks/{taskId}` · success `200` · scope `notes:write`
- **Request:** {title?, status?, due_date?, due_at?, timezone?, expected_revision}
- **Response:** Task
- **Contract:** Accept/complete/reject candidate explicitly; source-checkbox update uses normal document transaction. Omega: revision-check progress, completion, estimates and dependency changes; linked execution/session/checkbox projections update through one domain command. Provider-owned task changes do not imply external writeback.

### `deleteTask`
`DELETE /api/v1/vaults/{vaultId}/tasks/{taskId}` · success `204` · scope `notes:write`
- **Request:** {expected_revision}
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Do not delete its source note; remove or detach reminders.

### `listReminders`
`GET /api/v1/vaults/{vaultId}/reminders` · success `200` · scope `notes:read`
- **Request:** {status?, cursor?, limit?}
- **Response:** List<Reminder>
- **Contract:** Expose delivery state and missed status.

### `createReminder`
`POST /api/v1/vaults/{vaultId}/reminders` · success `201` · scope `notes:write`
- **Request:** {task_id?, source_anchor_id?, remind_at, timezone, channel: in_app|desktop}
- **Response:** Reminder
- **Contract:** Explicit schedule only; validate a concrete time and timezone.

### `updateReminder`
`PATCH /api/v1/vaults/{vaultId}/reminders/{reminderId}` · success `200` · scope `notes:write`
- **Request:** {remind_at?, status: scheduled|snoozed|dismissed?, expected_revision}
- **Response:** Reminder
- **Contract:** Snooze/dismiss is idempotent and synchronized; no duplicate delivery on reconnect.

### `deleteReminder`
`DELETE /api/v1/vaults/{vaultId}/reminders/{reminderId}` · success `204` · scope `notes:write`
- **Request:** {expected_revision}
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Cancel future deliveries.

### `listNotifications`
`GET /api/v1/vaults/{vaultId}/notifications` · success `200` · scope `notes:read`
- **Request:** {unread_only?, cursor?, limit?}
- **Response:** List<Notification>
- **Contract:** Respect preferences and scope; no browser-push guarantees.

### `updateNotification`
`PATCH /api/v1/vaults/{vaultId}/notifications/{notificationId}` · success `200` · scope `notes:write`
- **Request:** {state: read|dismissed}
- **Response:** Notification
- **Contract:** Store acknowledgement once across devices.

## Jobs, models and worker protocol

### `listJobs`
`GET /api/v1/vaults/{vaultId}/jobs` · success `200` · scope `jobs:read`
- **Request:** {kind?, status?, cursor?, limit?}
- **Response:** List<JobSummary>
- **Contract:** Separate waiting-for-worker and failure; redact unneeded payloads.

### `getJob`
`GET /api/v1/vaults/{vaultId}/jobs/{jobId}` · success `200` · scope `jobs:read`
- **Request:** none
- **Response:** Job {status, stage, progress, result: JobResult?, error?}
- **Contract:** Discriminated result union: extraction/search/answer/generation/import/export/etc.; no untyped arbitrary result blob.

### `cancelJob`
`POST /api/v1/vaults/{vaultId}/jobs/{jobId}/cancel` · success `200` · scope `jobs:write`
- **Request:** none
- **Response:** Job
- **Contract:** Cooperative cancellation with terminal-state fencing and explicit partial-work policy.

### `retryJob`
`POST /api/v1/vaults/{vaultId}/jobs/{jobId}/retry` · success `202` · scope `jobs:write`
- **Request:** {expected_input_revision?}
- **Response:** JobHandle
- **Contract:** Only valid retryable jobs; no duplicate side effects or obsolete input reuse.

### `streamJobEvents`
`GET /api/v1/vaults/{vaultId}/jobs/{jobId}/events` · success `200` · scope `jobs:read`
- **Request:** Last-Event-ID header
- **Response:** SSE<JobEvent>
- **Contract:** Resumable bounded replay; sources/tokens scoped; final state agrees with persisted job.

### `getAiStatus`
`GET /api/v1/vaults/{vaultId}/ai/status` · success `200` · scope `notes:read`
- **Request:** none
- **Response:** AiStatus {workers, capabilities, available_models, queued_jobs}
- **Contract:** Distinguish model missing, worker offline, busy, available and error. Omega: report tested local model/runtime availability and queue state; a loaded model name is not proof of schema/embedding compatibility.

### `listModelProfiles`
`GET /api/v1/ai/models` · success `200` · scope `owner`
- **Request:** none
- **Response:** List<ModelProfile>
- **Contract:** Allowlisted model profiles with pinned digests/capabilities. Managed local profiles reject implicit cloud tags; explicitly configured cloud providers are separate disabled-by-default profiles requiring per-vault authorization. Omega: retain selected small local defaults; explicit provider abstraction may expose owner-configured cloud profiles as disabled until separately authorized. No automatic fallback.

### `testAiSetup`
`POST /api/v1/vaults/{vaultId}/ai/tests` · success `202` · scope `ai:run`
- **Request:** {worker_id, model_profile_id}
- **Response:** JobHandle
- **Contract:** Real harmless completion/schema/embedding tests against the selected installed runtime.

### `getIndexStatus`
`GET /api/v1/vaults/{vaultId}/index/status` · success `200` · scope `notes:read`
- **Request:** none
- **Response:** IndexStatus {current_profile, chunker_version, indexed_revisions, pending, errors}
- **Contract:** Do not show ready until required revisions actually have valid indexes.

### `rebuildIndex`
`POST /api/v1/vaults/{vaultId}/index/rebuild` · success `202` · scope `owner`
- **Request:** {model_profile_id, scope?, chunker_version}
- **Response:** JobHandle
- **Contract:** Shadow rebuild and atomic switch after validation; preserve originals and old index during rebuild.

### `listWorkers`
`GET /api/v1/workers` · success `200` · scope `owner`
- **Request:** none
- **Response:** List<WorkerSummary>
- **Contract:** Worker role is an enrolled device, not a separately public registration path.

### `configureWorker`
`PATCH /api/v1/workers/{workerId}` · success `200` · scope `owner_reauth`
- **Request:** {vault_ids?, allowed_job_types?, paused?, resource_policy?, expected_revision}
- **Response:** WorkerSummary
- **Contract:** Finite configuration only; never accept executable, arbitrary model URL, or host path. Omega: prioritize interactive work over embeddings/classification/transcription; resource limits and optional cloud egress require explicit owner policy. No arbitrary command execution.

### `workerHeartbeat`
`POST /api/v1/worker/heartbeat` · success `200` · scope `enrolled_worker`
- **Request:** {device_id, installed_profiles, capacity, runtime_status}
- **Response:** WorkerHeartbeatResponse {server_time, config_revision}
- **Contract:** Authenticate worker identity and validate reported model digests.

### `claimWorkerJob`
`POST /api/v1/worker/jobs/claim` · success `[200, 204]` · scope `enrolled_worker`
- **Request:** {supported_job_types, available_capacity}
- **Response:** WorkerLease {job_id, vault_id, lease_token, expires_at, input_manifest}
- **Contract:** Atomically lease eligible authorized job; 204 when none; at-least-once/idempotent processing.

### `getWorkerJobInput`
`GET /api/v1/worker/jobs/{jobId}/input` · success `200` · scope `job_lease`
- **Request:** lease token header
- **Response:** TypedJobInput
- **Contract:** Only job-authorized source revisions/blobs; no generic vault scan or arbitrary file read.

### `renewWorkerLease`
`POST /api/v1/worker/jobs/{jobId}/heartbeat` · success `200` · scope `job_lease`
- **Request:** {lease_token, stage, progress?}
- **Response:** LeaseState {expires_at, cancel_requested}
- **Contract:** Expired/revoked leases cannot be renewed or commit results.

### `appendWorkerEvents`
`POST /api/v1/worker/jobs/{jobId}/events` · success `200` · scope `job_lease`
- **Request:** {lease_token, events: WorkerProgressEvent[], sequence}
- **Response:** EventAck {accepted_sequence}
- **Contract:** Bounded/idempotent batches; do not allow worker-provided arbitrary HTML or hidden reasoning streams.

### `completeWorkerJob`
`POST /api/v1/worker/jobs/{jobId}/complete` · success `200` · scope `job_lease`
- **Request:** {lease_token, input_hash, result: TypedJobResult}
- **Response:** Job
- **Contract:** Validate result/evidence/profile and current input revision before applying effects; stale results superseded.

### `failWorkerJob`
`POST /api/v1/worker/jobs/{jobId}/fail` · success `200` · scope `job_lease`
- **Request:** {lease_token, error_code, safe_detail, retryable}
- **Response:** Job
- **Contract:** Server decides retry policy; avoid credentials/source text in error detail.

## System jobs and resurfacing

### `listSystemJobs`
`GET /api/v1/system-jobs` · success `200` · scope `owner_reauth`
- **Request:** {status?, cursor?, limit?}
- **Response:** List<JobSummary>
- **Contract:** List installation-scoped backup/restore jobs that do not belong to a single vault.

### `getSystemJob`
`GET /api/v1/system-jobs/{jobId}` · success `200` · scope `owner_reauth`
- **Request:** none
- **Response:** Job
- **Contract:** Expose durable installation-job status and typed result under owner authorization.

### `cancelSystemJob`
`POST /api/v1/system-jobs/{jobId}/cancel` · success `200` · scope `owner_reauth`
- **Request:** none
- **Response:** Job
- **Contract:** Honor documented cancellation boundaries; a committed restore cannot pretend to roll back merely because cancellation was requested.

### `retrySystemJob`
`POST /api/v1/system-jobs/{jobId}/retry` · success `202` · scope `owner_reauth`
- **Request:** none
- **Response:** JobHandle
- **Contract:** Retry only retryable installation jobs; preserve manifests and idempotent effects.

### `streamSystemJobEvents`
`GET /api/v1/system-jobs/{jobId}/events` · success `200` · scope `owner_reauth`
- **Request:** Last-Event-ID header
- **Response:** SSE<JobEvent>
- **Contract:** Installation-scoped progress; no vault-content or key leakage; durable status survives reconnect.

### `resurfacingFeedback`
`POST /api/v1/vaults/{vaultId}/resurfacing/feedback` · success `201` · scope `notes:write`
- **Request:** {note_id, action: dismiss|snooze|hide_topic, label_id?, until?}
- **Response:** ResurfacingFeedback
- **Contract:** Persist user choice, prevent repeated dismissed suggestions, and validate any topic belongs to this vault.

## Synchronization and realtime

### `pushSync`
`POST /api/v1/vaults/{vaultId}/sync/push` · success `200` · scope `sync:write`
- **Request:** {device_id, operations: SyncOperation[], last_cursor}
- **Response:** SyncAck {accepted_operation_ids, cursor, conflicts}
- **Contract:** Persist canonical changes/outbox atomically; bounded idempotent batch; tombstone checks.

### `pullSync`
`GET /api/v1/vaults/{vaultId}/sync/pull` · success `200` · scope `sync:read`
- **Request:** {cursor?, limit?}
- **Response:** SyncBatch {events, next_cursor, has_more, snapshot_required}
- **Contract:** Cursor-based recovery with per-vault access and explicit expired-cursor behavior.

### `createSyncSnapshot`
`POST /api/v1/vaults/{vaultId}/sync/snapshots` · success `202` · scope `sync:read`
- **Request:** {device_id}
- **Response:** JobHandle
- **Contract:** Consistent authorized snapshot with watermark; needed for fresh/expired clients.

### `openSyncSocket`
`GET /api/v1/vaults/{vaultId}/sync/ws` · success `101` · scope `sync:read_and_optional_write`
- **Request:** WebSocket handshake + negotiated protocol version
- **Response:** WebSocket<SyncFrame>
- **Contract:** Authenticated origin-bound handshake; persist-before-ack; same domain write path as REST; read-only clients cannot push.

### `streamVaultEvents`
`GET /api/v1/vaults/{vaultId}/events` · success `200` · scope `sync:read`
- **Request:** Last-Event-ID header
- **Response:** SSE<VaultEvent>
- **Contract:** Authorized changes/notifications only; resumable and bounded; revoked connections closed.

## Import, export and recovery

### `planImport`
`POST /api/v1/vaults/{vaultId}/imports` · success `202` · scope `notes:write`
- **Request:** {blob_id, format, options: ImportOptions}
- **Response:** JobHandle
- **Contract:** Validate archive and build preview/per-item manifest; do not silently mutate existing notes.

### `getImport`
`GET /api/v1/vaults/{vaultId}/imports/{importId}` · success `200` · scope `notes:read`
- **Request:** {cursor?, limit?}
- **Response:** ImportManifest {status, items, warnings, counts}
- **Contract:** Show actual per-file results and source relationships.

### `applyImport`
`POST /api/v1/vaults/{vaultId}/imports/{importId}/apply` · success `202` · scope `notes:write`
- **Request:** {plan_revision, collision_policy, confirmation}
- **Response:** JobHandle
- **Contract:** Resumable idempotent apply; explicit ID remapping and import provenance.

### `createExport`
`POST /api/v1/vaults/{vaultId}/exports` · success `202` · scope `export:read`
- **Request:** {scope, format: markdown_bundle|full_fidelity, include_history}
- **Response:** JobHandle
- **Contract:** Authorized consistent snapshot including original blobs/manifest; expiry stated. Omega: include selected school/study/profile records in full-fidelity authorized exports; shared calendar exports exclude private overlays by default.

### `getExport`
`GET /api/v1/vaults/{vaultId}/exports/{exportId}` · success `200` · scope `export:read`
- **Request:** none
- **Response:** ExportManifest {status, format, byte_length?, sha256?, expires_at}
- **Contract:** Do not return download URL before an artifact exists.

### `downloadExport`
`GET /api/v1/vaults/{vaultId}/exports/{exportId}/download` · success `200` · scope `export:read`
- **Request:** none
- **Response:** binary export bundle
- **Contract:** Recheck scope, revoke expired access; safe content disposition and checksum.

### `listBackups`
`GET /api/v1/backups` · success `200` · scope `owner_reauth`
- **Request:** {cursor?, limit?}
- **Response:** List<BackupSummary>
- **Contract:** No arbitrary server path browsing; expose last verification and retention.

### `createBackup`
`POST /api/v1/backups` · success `202` · scope `owner_reauth`
- **Request:** {destination_id, encryption_profile_id}
- **Response:** JobHandle
- **Contract:** Use administrator-configured destination; coherent database/blob manifest and encryption policy. Omega: consistent backup includes all new canonical school/study/commitment/profile records and original blobs; provider outbox is restored in reconciliation-only mode.

### `getBackupManifest`
`GET /api/v1/backups/{backupId}` · success `200` · scope `owner_reauth`
- **Request:** none
- **Response:** BackupManifest
- **Contract:** Versions, completeness, checksums and restore prerequisites; no encryption secret.

### `downloadBackup`
`GET /api/v1/backups/{backupId}/download` · success `200` · scope `owner_reauth`
- **Request:** none
- **Response:** encrypted backup bundle
- **Contract:** Strong recent authentication, no unencrypted secret material; audited download.

### `verifyBackup`
`POST /api/v1/backups/{backupId}/verify` · success `202` · scope `owner_reauth`
- **Request:** none
- **Response:** JobHandle
- **Contract:** Verify checksums, decryptability through configured key access, and manifest completeness; not a fake healthy flag.

### `createRestorePlan`
`POST /api/v1/restore-plans` · success `202` · scope `owner_reauth`
- **Request:** {backup_id, target_mode: isolated_validation|replace_installation}
- **Response:** JobHandle
- **Contract:** Dry-run schema/compatibility/data checks; no live mutation yet.

### `applyRestore`
`POST /api/v1/restore-plans/{restorePlanId}/apply` · success `202` · scope `owner_reauth`
- **Request:** {plan_revision, destructive_confirmation}
- **Response:** JobHandle
- **Contract:** Maintenance-mode apply with coherent rollback/recovery procedure and isolated restore test evidence. Omega: restore all domains without re-sending provider actions or resurrecting purged IDs; verify origin/passkey and credentials recovery separately.

## Calendars and event lifecycle

### `listCalendars`
`GET /api/v1/vaults/{vaultId}/calendars` · success `200` · scope `owner_vault`
- **Request:** cursor, limit
- **Response:** List<Calendar>
- **Contract:** Return ownership, read/write capability, selected visibility, source freshness and provider mapping.

### `createCalendar`
`POST /api/v1/vaults/{vaultId}/calendars` · success `201` · scope `owner_vault`
- **Request:** CreateCalendar {name, display_preferences, timezone, origin: sorta}
- **Response:** Calendar
- **Contract:** Create a private Sorta calendar. Provider creation is a separate explicit write action.

### `getCalendar`
`GET /api/v1/vaults/{vaultId}/calendars/{calendarId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** Calendar
- **Contract:** Scope-check the calendar and associated source metadata.

### `updateCalendar`
`PATCH /api/v1/vaults/{vaultId}/calendars/{calendarId}` · success `200` · scope `owner_vault`
- **Request:** CalendarPatch; If-Match
- **Response:** Calendar
- **Contract:** Modify owner-controlled metadata; cannot turn a read-only source calendar into a writable provider calendar.

### `archiveCalendar`
`DELETE /api/v1/vaults/{vaultId}/calendars/{calendarId}` · success `204` · scope `owner_vault`
- **Request:** If-Match
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Archive locally with tombstone/undo; no implied deletion of an external calendar.

### `getCalendarView`
`GET /api/v1/vaults/{vaultId}/calendar-view` · success `200` · scope `owner_vault`
- **Request:** from, to, timezone, calendar_ids, view
- **Response:** CalendarView
- **Contract:** Bound the range and occurrence expansion. Return time-unknown markers separately from busy intervals; expose stale sources.

### `listCalendarEvents`
`GET /api/v1/vaults/{vaultId}/calendar-events` · success `200` · scope `owner_vault`
- **Request:** bounded filters, cursor, limit
- **Response:** List<CalendarEvent>
- **Contract:** Filter canonical events without losing provider/tentative/cancelled distinctions.

### `createCalendarEvent`
`POST /api/v1/vaults/{vaultId}/calendar-events` · success `201` · scope `owner_vault`
- **Request:** CreateCalendarEvent; Idempotency-Key
- **Response:** CalendarEvent
- **Contract:** Commit internal event and any authorized outbox action atomically. Internal creation is not provider acknowledgment.

### `getCalendarEvent`
`GET /api/v1/vaults/{vaultId}/calendar-events/{eventId}` · success `200` · scope `owner_vault`
- **Request:** revision_id?
- **Response:** CalendarEvent | HistoricalCalendarEvent
- **Contract:** Return the current record or authorized immutable revision; old evidence must stay revision-specific.

### `updateCalendarEvent`
`PATCH /api/v1/vaults/{vaultId}/calendar-events/{eventId}` · success `200` · scope `owner_vault`
- **Request:** CalendarEventPatch; If-Match; Idempotency-Key
- **Response:** CalendarEvent
- **Contract:** Validate TimeSpec, field locks, ownership and recurrence edit scope; enqueue authorized writeback but do not invent success.

### `trashCalendarEvent`
`DELETE /api/v1/vaults/{vaultId}/calendar-events/{eventId}` · success `204` · scope `owner_vault`
- **Request:** If-Match; Idempotency-Key
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Trash personal event; cancel its local reminders. Preserve underlying commitments. Shared provider cancellations require the explicit preview flow.

### `restoreCalendarEvent`
`POST /api/v1/vaults/{vaultId}/calendar-events/{eventId}/restore` · success `200` · scope `owner_vault`
- **Request:** expected_revision; Idempotency-Key
- **Response:** CalendarEvent
- **Contract:** Restore internal record only; never silently recreate external invitations or resend notifications.

### `listCalendarEventRevisions`
`GET /api/v1/vaults/{vaultId}/calendar-events/{eventId}/revisions` · success `200` · scope `owner_vault`
- **Request:** cursor, limit
- **Response:** List<EventRevision>
- **Contract:** Expose actor, source, policy, changed fields and resolvable evidence, excluding credentials.

### `listEventOccurrences`
`GET /api/v1/vaults/{vaultId}/calendar-events/{eventId}/occurrences` · success `200` · scope `owner_vault`
- **Request:** from, to, cursor, limit
- **Response:** List<EventOccurrence>
- **Contract:** Expand recurrence with timezone, exceptions and stable occurrence identifiers; bound expansion.

### `createEventException`
`POST /api/v1/vaults/{vaultId}/calendar-events/{eventId}/exceptions` · success `201` · scope `owner_vault`
- **Request:** OccurrenceExceptionInput; If-Match; Idempotency-Key
- **Response:** EventException
- **Contract:** Create one-occurrence override/cancellation and reevaluate prep/reminders for only affected occurrences.

### `updateEventException`
`PATCH /api/v1/vaults/{vaultId}/calendar-events/{eventId}/exceptions/{exceptionId}` · success `200` · scope `owner_vault`
- **Request:** ExceptionPatch; If-Match
- **Response:** EventException
- **Contract:** Revision-safe update; do not rewrite the entire series inadvertently.

### `removeEventException`
`DELETE /api/v1/vaults/{vaultId}/calendar-events/{eventId}/exceptions/{exceptionId}` · success `204` · scope `owner_vault`
- **Request:** If-Match
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Restore series behavior after checking impact; provider actions respect the separate write policy.

## Private event preparation and planning

### `getPrivateEventContext`
`GET /api/v1/vaults/{vaultId}/calendar-events/{eventId}/private-context` · success `200` · scope `owner_vault`
- **Request:** occurrence_id?
- **Response:** PrivateEventContext
- **Contract:** Return prep, linked commitments, notes and evidence. Never include this representation in provider payloads.

### `refreshPrivateEventContext`
`POST /api/v1/vaults/{vaultId}/calendar-events/{eventId}/context-refresh` · success `202` · scope `owner_vault`
- **Request:** occurrence_id?, expected_revision; Idempotency-Key
- **Response:** JobHandle
- **Contract:** Enqueue bounded matching/synthesis; deterministic matches may finish without a model. Mark stale context honestly.

### `createPrepItem`
`POST /api/v1/vaults/{vaultId}/calendar-events/{eventId}/prep-items` · success `201` · scope `owner_vault`
- **Request:** CreatePrepItem {occurrence_id?, type, text, evidence, commitment_id?}
- **Response:** PrepItem
- **Contract:** Create manual or validated policy-authorized item, preserving provenance and uniqueness of commitment binding.

### `updatePrepItem`
`PATCH /api/v1/vaults/{vaultId}/calendar-events/{eventId}/prep-items/{prepId}` · success `200` · scope `owner_vault`
- **Request:** PrepItemPatch; If-Match
- **Response:** PrepItem
- **Contract:** Packing/completing prep does not fulfill a loan; allow dismiss/not-applicable and persist suppression.

### `removePrepItem`
`DELETE /api/v1/vaults/{vaultId}/calendar-events/{eventId}/prep-items/{prepId}` · success `204` · scope `owner_vault`
- **Request:** If-Match
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Remove binding/item but preserve its source and active commitment; prevent repeated re-suggestion of the same rejected match.

### `calendarFreeBusy`
`POST /api/v1/vaults/{vaultId}/calendar/free-busy` · success `200` · scope `owner_vault`
- **Request:** FreeBusyQuery {calendar_ids, from, to, timezone}
- **Response:** FreeBusyResult
- **Contract:** Use structured intervals only. Report missing duration, stale sources and time-unknown conflicts separately.

### `getCalendarBrief`
`GET /api/v1/vaults/{vaultId}/calendar/brief` · success `200` · scope `owner_vault`
- **Request:** date, timezone
- **Response:** CalendarBrief
- **Contract:** Return cached source-linked brief and deterministic upcoming items; expose generation/freshness state.

### `refreshCalendarBrief`
`POST /api/v1/vaults/{vaultId}/calendar/brief-refresh` · success `202` · scope `owner_vault`
- **Request:** date, timezone; Idempotency-Key
- **Response:** JobHandle
- **Contract:** Use actual jobs, bounded sources and privacy-safe notification policy.

### `previewPreparationPlan`
`POST /api/v1/vaults/{vaultId}/calendar/preparation-plan` · success `202` · scope `owner_vault`
- **Request:** PreparationPlanInput {task_ids, window, limits, estimates, locked_event_ids}
- **Response:** JobHandle
- **Contract:** Produce a persisted Proposal, not schedule changes. Acceptance uses the shared proposal endpoint after checking current conflicts.

### `listCalendarConflicts`
`GET /api/v1/vaults/{vaultId}/calendar/conflicts` · success `200` · scope `owner_vault`
- **Request:** from, to, cursor, limit
- **Response:** List<CalendarConflict>
- **Contract:** Expose overlapping fixed events, inconsistent source dates and capacity conflicts with source ownership.

## Commitments and identity

### `listCommitments`
`GET /api/v1/vaults/{vaultId}/commitments` · success `200` · scope `owner_vault`
- **Request:** status, person_id?, project_id?, cursor, limit
- **Response:** List<Commitment>
- **Contract:** Include undated active commitments; no fabricated deadlines.

### `createCommitment`
`POST /api/v1/vaults/{vaultId}/commitments` · success `201` · scope `owner_vault`
- **Request:** CreateCommitment; Idempotency-Key
- **Response:** Commitment
- **Contract:** Validate finite condition AST, evidence and entity references; state changes come from policy or owner.

### `getCommitment`
`GET /api/v1/vaults/{vaultId}/commitments/{commitmentId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** CommitmentDetail
- **Contract:** Include source evidence, eligible/current bindings and status history.

### `updateCommitment`
`PATCH /api/v1/vaults/{vaultId}/commitments/{commitmentId}` · success `200` · scope `owner_vault`
- **Request:** CommitmentPatch; If-Match
- **Response:** Commitment
- **Contract:** Support active/fulfilled/cancelled/superseded transitions with actor/evidence. Time passing is not valid fulfillment evidence.

### `archiveCommitment`
`DELETE /api/v1/vaults/{vaultId}/commitments/{commitmentId}` · success `204` · scope `owner_vault`
- **Request:** If-Match
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Archive and remove future bindings/reminders without deleting original notes.

### `rematchCommitment`
`POST /api/v1/vaults/{vaultId}/commitments/{commitmentId}/match` · success `202` · scope `owner_vault`
- **Request:** expected_revision; Idempotency-Key
- **Response:** JobHandle
- **Contract:** Match eligible events using entity identity/context; do not conflate people and places.

### `listCalendarEntities`
`GET /api/v1/vaults/{vaultId}/calendar-entities` · success `200` · scope `owner_vault`
- **Request:** kind, query?, cursor, limit
- **Response:** List<CalendarEntity>
- **Contract:** Scope and type distinguish people/places/items/classes. Reuse the shared entity identity store. Omega: the same canonical entity registry supplies People, teachers, groups and venues. Filter by entity type; do not create a separate People identity store.

### `createCalendarEntity`
`POST /api/v1/vaults/{vaultId}/calendar-entities` · success `201` · scope `owner_vault`
- **Request:** CreateEntity {kind, name, evidence?}
- **Response:** CalendarEntity
- **Contract:** Create a typed owner-confirmed entity, not a provider contact write. Omega: shared typed person/place/group/object entities with evidence and explicitly confirmed aliases; no name-only identity merge.

### `updateCalendarEntity`
`PATCH /api/v1/vaults/{vaultId}/calendar-entities/{entityId}` · success `200` · scope `owner_vault`
- **Request:** EntityPatch; If-Match
- **Response:** CalendarEntity
- **Contract:** Preserve historical identities and rerun affected matching when owner changes a fact. Omega: preserve owner-corrected identity fields and display-only teacher/contact extensions; no silent merging of venue and person.

### `addEntityAlias`
`POST /api/v1/vaults/{vaultId}/calendar-entities/{entityId}/aliases` · success `201` · scope `owner_vault`
- **Request:** AliasInput {alias, evidence?, scope}; Idempotency-Key
- **Response:** EntityAlias
- **Contract:** Owner-confirmed alias only; prevent cross-type automatic merge. This changes Sorta identity, not provider contacts.

### `removeEntityAlias`
`DELETE /api/v1/vaults/{vaultId}/calendar-entities/{entityId}/aliases/{aliasId}` · success `204` · scope `owner_vault`
- **Request:** If-Match
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Invalidate affected automatic matches and preserve the audit trail.

### `previewEntityMerge`
`POST /api/v1/vaults/{vaultId}/calendar-entities/merge-preview` · success `200` · scope `owner_vault`
- **Request:** EntityMergeInput {entity_ids, target_id, reason}
- **Response:** Proposal
- **Contract:** Preview affected events/commitments before shared proposal acceptance. No automatic destructive identity merging.

## Automation policy and explanations

### `getCalendarPolicies`
`GET /api/v1/vaults/{vaultId}/calendar-policies` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** CalendarPolicySet
- **Contract:** Return source/action-specific rules, enabled state and version; no self-scored confidence masquerading as measured quality.

### `setCalendarPolicies`
`PUT /api/v1/vaults/{vaultId}/calendar-policies` · success `200` · scope `owner_vault`
- **Request:** CalendarPolicySet; If-Match
- **Response:** CalendarPolicySet
- **Contract:** Validate finite predicates, persist owner opt-in, show effects of newly allowed actions and keep external sending gated.

### `dryRunCalendarPolicy`
`POST /api/v1/vaults/{vaultId}/calendar-policies/dry-run` · success `202` · scope `owner_vault`
- **Request:** PolicyDryRunInput {policy, source_ids, bounded_window}
- **Response:** JobHandle
- **Contract:** Evaluate against authorized sources without creating events, commitments or provider actions.

### `listCalendarDecisions`
`GET /api/v1/vaults/{vaultId}/calendar-decisions` · success `200` · scope `owner_vault`
- **Request:** source_id?, event_id?, outcome?, cursor, limit
- **Response:** List<AutomationDecision>
- **Contract:** Return why applied/suggested/blocked and evidence/policy version; omit hidden model reasoning.

### `undoCalendarDecision`
`POST /api/v1/vaults/{vaultId}/calendar-decisions/{decisionId}/undo` · success `200` · scope `owner_vault`
- **Request:** expected_revision; Idempotency-Key
- **Response:** UndoResult
- **Contract:** Compensating domain command under current revision checks. External irreversible sends are not claimed undoable.

## Provider connection lifecycle

### `listConnections`
`GET /api/v1/vaults/{vaultId}/connections` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** List<ConnectionSummary>
- **Contract:** Report actual per-resource coverage and blockers; never return credentials.

### `createConnection`
`POST /api/v1/vaults/{vaultId}/connections` · success `201` · scope `owner_vault`
- **Request:** CreateConnection {provider, mode, selected_scopes, policy}
- **Response:** Connection
- **Contract:** Create configuration record, not a successful authenticated integration. InSchool starts unverified unless a supported route exists. Omega: provider registry includes supported Microsoft resource adapters, Google Calendar, authorized InSchool, personal-data sources and configured extraction backends. Store a credential reference, never secrets in model context.

### `getConnection`
`GET /api/v1/vaults/{vaultId}/connections/{connectionId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** ConnectionDetail
- **Contract:** Include selected containers, consent/health/freshness and redacted configuration.

### `beginProviderAuthorization`
`POST /api/v1/vaults/{vaultId}/connections/{connectionId}/authorize` · success `200` · scope `owner_vault`
- **Request:** AuthorizationRequest {requested_capabilities, registered_return_target}
- **Response:** AuthorizationStart
- **Contract:** Use registered provider adapter; persist OAuth state/PKCE transaction. Return supported login URL, not model-selected host.

### `reauthorizeProvider`
`POST /api/v1/vaults/{vaultId}/connections/{connectionId}/reauthorize` · success `200` · scope `owner_vault`
- **Request:** ReauthorizationRequest
- **Response:** AuthorizationStart
- **Contract:** Explicit reconnect/permission upgrade, preserving data identity and no consent bypass.

### `getConnectionCapabilities`
`GET /api/v1/vaults/{vaultId}/connections/{connectionId}/capabilities` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** CapabilityReport
- **Contract:** Return verified/consent-required/unverified states per resource and exact tested coverage. Omega: each dataset has its own availability, granted scopes, selection, coverage window, live verification and account restrictions. A provider name alone proves no data capability.

### `probeConnection`
`POST /api/v1/vaults/{vaultId}/connections/{connectionId}/probe` · success `202` · scope `owner_vault`
- **Request:** none; Idempotency-Key
- **Response:** JobHandle
- **Contract:** Make safe adapter-specific permission/availability checks; no account write and no arbitrary URL probing.

### `listConnectionResources`
`GET /api/v1/vaults/{vaultId}/connections/{connectionId}/resources` · success `200` · scope `owner_vault`
- **Request:** kind, parent_id?, cursor, limit
- **Response:** List<ConnectorResource>
- **Contract:** Enumerate only resources available through granted permissions; track denied/skipped containers.

### `selectConnectionResources`
`PUT /api/v1/vaults/{vaultId}/connections/{connectionId}/selection` · success `200` · scope `owner_vault`
- **Request:** ResourceSelection; If-Match
- **Response:** ResourceSelection
- **Contract:** Validate chosen IDs, window and vault/export policy; preview impact of widening scope. Omega: grades, attendance, private chats and personal-data history are separate opt-ins; incremental expansion of selected scope requires explicit approval.

### `syncConnection`
`POST /api/v1/vaults/{vaultId}/connections/{connectionId}/sync` · success `202` · scope `owner_vault`
- **Request:** SyncRequest {selected_resource_ids?, mode: incremental|rescan}; Idempotency-Key
- **Response:** JobHandle
- **Contract:** Real durable sync with pagination/cursors; resource blockers are typed results, not empty successful downloads. Omega: typed requested datasets and bounded lookback. Jobs are checkpointed and idempotent; unsupported data remains unsupported, not an empty success.

### `getConnectionSyncStatus`
`GET /api/v1/vaults/{vaultId}/connections/{connectionId}/sync-status` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** ConnectorSyncStatus
- **Contract:** Separate last attempt/success, partial coverage, throttling, authorization and worker availability. Omega: expose partial, stale, denied, not supported and import-only coverage separately; never infer complete history from the fetched subset.

### `setConnectionSchedule`
`PATCH /api/v1/vaults/{vaultId}/connections/{connectionId}/schedule` · success `200` · scope `owner_vault`
- **Request:** ConnectorSchedule {enabled, interval, windows}; If-Match
- **Response:** ConnectorSchedule
- **Contract:** Respect provider limits; deterministic import can run without the LLM. Scheduling exists in delivered software, not in this plan. Omega: per-resource polling schedules are separate from Sunday 03:00 Europe/Oslo personal-data refresh. Deduplicate missed-run catch-up after host downtime.

### `previewConnectionDisconnect`
`POST /api/v1/vaults/{vaultId}/connections/{connectionId}/disconnect-preview` · success `200` · scope `owner_vault`
- **Request:** retention_choice
- **Response:** Proposal
- **Contract:** Preview token deletion, subscription stop, retained cache and affected derived content.

### `disconnectConnection`
`POST /api/v1/vaults/{vaultId}/connections/{connectionId}/disconnect` · success `202` · scope `owner_vault`
- **Request:** DisconnectConfirmation {preview_id, expected_revision}; Idempotency-Key
- **Response:** JobHandle
- **Contract:** Stop ingestion/subscriptions, remove local tokens, attempt provider revocation where supported, apply retention; report any incomplete provider cleanup.

### `microsoftOAuthCallback`
`GET /api/v1/oauth/microsoft/callback` · success `303` · scope `oauth_transaction`
- **Request:** code|error, state
- **Response:** RedirectOrSafeError
- **Contract:** Consume a one-time state bound to owner/vault/connection; token exchange through supported auth library, no secrets in redirect/logs. Omega: use the registered canonical origin and correct client flow. Browser redirect reachability is distinct from provider webhook reachability; never weaken state/issuer checks to work around a proxy.

### `microsoftChangeNotifications`
`POST /api/v1/integrations/microsoft/notifications` · success `202` · scope `validated_provider_subscription`
- **Request:** ProviderHandshakeQuery | ProviderNotificationBatch
- **Response:** ProviderHandshakeText | EmptyAccepted
- **Contract:** Implement actual Graph handshake/client-state/subscription checks, replay protection and bounded queueing. Only this narrow provider envelope bypasses an owner session. Omega home-host mode: disabled ingress unless a verified public callback path is deliberately configured. Private Tailscale deployments poll supported resources; callbacks cannot complete interactive Access authentication.

## Imported sources and school domain

### `listSourceObjects`
`GET /api/v1/vaults/{vaultId}/source-objects` · success `200` · scope `owner_vault`
- **Request:** connection_id?, kind?, container_id?, cursor, limit
- **Response:** List<SourceObject>
- **Contract:** Return authorized imported sources and access/freshness state, not duplicate editable personal notes. Omega: include textbooks, school records, transcripts and authorized personal data with ownership, authored/observed times, source kind, retention and coverage.

### `getSourceObject`
`GET /api/v1/vaults/{vaultId}/source-objects/{sourceId}` · success `200` · scope `owner_vault`
- **Request:** revision_id?
- **Response:** SourceObjectDetail
- **Contract:** Resolve immutable source revision/deep link and retained allowed evidence; permission-check attachment access. Omega: return exact authorized revision/extraction context and original source deep link. Access to a URL or source ID alone is not authorization.

### `refreshSourceObject`
`POST /api/v1/vaults/{vaultId}/source-objects/{sourceId}/refresh` · success `202` · scope `owner_vault`
- **Request:** expected_revision?; Idempotency-Key
- **Response:** JobHandle
- **Contract:** Use registered provider and source identity only. No SSRF via model-supplied URL.

### `excludeSourceObject`
`POST /api/v1/vaults/{vaultId}/source-objects/{sourceId}/exclusion` · success `200` · scope `owner_vault`
- **Request:** ExclusionInput {excluded, reason}; If-Match
- **Response:** SourceExclusion
- **Contract:** Stop future indexing/derived actions for excluded sources and invalidate existing derived results per policy.

### `getSchoolOverview`
`GET /api/v1/vaults/{vaultId}/school/overview` · success `200` · scope `owner_vault`
- **Request:** from, to, connection_ids?
- **Response:** SchoolOverview
- **Contract:** Aggregate permitted lessons/deadlines/materials with explicit coverage and source freshness; no default grade/health import. Omega: extend to subjects, assessments, materials, optional grade/attendance summaries, study links and honest source freshness.

### `listSchoolLessons`
`GET /api/v1/vaults/{vaultId}/school/lessons` · success `200` · scope `owner_vault`
- **Request:** from, to, course_id?, cursor, limit
- **Response:** List<SchoolLesson>
- **Contract:** Return normalized source-owned occurrences and room/cancellation updates, not inferred full-year recurrences.

### `listSchoolAssignments`
`GET /api/v1/vaults/{vaultId}/school/assignments` · success `200` · scope `owner_vault`
- **Request:** course_id?, state?, from?, to?, cursor, limit
- **Response:** List<SchoolAssignment>
- **Contract:** Use applicable student-specific details where authorized; distinguish assignment, submission and locally planned work. Omega: normalized assignments are source-owned or explicitly manual, have applicable student-specific dates and link to one canonical task where work is planned.

### `getSchoolAssignment`
`GET /api/v1/vaults/{vaultId}/school/assignments/{assignmentId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** SchoolAssignmentDetail
- **Contract:** Source links/instructions/materials and applicable due date; no grade scope unless a later explicit feature changes policy. Omega: include original instructions/materials, source-owned versus personal fields, deadline revisions, optional linked task and study plan.

### `previewSchoolImport`
`POST /api/v1/vaults/{vaultId}/school/import-preview` · success `202` · scope `owner_vault`
- **Request:** SchoolImportInput {attachment_id, format, mapping?, source_timestamp, timezone, period?}
- **Response:** JobHandle
- **Contract:** Parse authorized artifact with schema/format detection. Produce a mapping/effect Proposal; snapshots explicitly not live.

### `getSchoolConnectionReadiness`
`GET /api/v1/vaults/{vaultId}/school/connections/{connectionId}/readiness` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** SchoolReadinessReport
- **Contract:** Report actual approved route/spec/consent/test status. A template adapter or fixture is not a live connection.

## External calendar actions and reminders

### `previewProviderCalendarAction`
`POST /api/v1/vaults/{vaultId}/calendar-events/{eventId}/provider-action-preview` · success `200` · scope `owner_vault`
- **Request:** ProviderActionRequest {kind, target_calendar_id, recipients?, public_fields?, response?}
- **Response:** Proposal
- **Contract:** Exact recipient/content/visibility/effect preview. Private prep never included implicitly. Execute via generic proposal acceptance after policy checks.

### `listProviderCalendarActions`
`GET /api/v1/vaults/{vaultId}/calendar-provider-actions` · success `200` · scope `owner_vault`
- **Request:** status?, event_id?, cursor, limit
- **Response:** List<ProviderCalendarAction>
- **Contract:** Show pending, in-flight, delivery-unknown, acknowledged, rejected and cancelled; protect secret/provider diagnostics.

### `getProviderCalendarAction`
`GET /api/v1/vaults/{vaultId}/calendar-provider-actions/{actionId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** ProviderCalendarAction
- **Contract:** Return provider acknowledgment identity and reconciliation state, never claim a pending write completed.

### `reconcileProviderCalendarAction`
`POST /api/v1/vaults/{vaultId}/calendar-provider-actions/{actionId}/reconcile` · success `202` · scope `owner_vault`
- **Request:** none; Idempotency-Key
- **Response:** JobHandle
- **Contract:** Read/check delivery state before retry after lost response; no duplicate invitations from blind retry.

### `cancelPendingProviderCalendarAction`
`POST /api/v1/vaults/{vaultId}/calendar-provider-actions/{actionId}/cancel` · success `200` · scope `owner_vault`
- **Request:** If-Match
- **Response:** ProviderCalendarAction
- **Contract:** Cancel only unsent outbox work. Already sent actions require a new reviewed compensating action.

### `setEventReminderPlan`
`POST /api/v1/vaults/{vaultId}/calendar-events/{eventId}/reminder-plan` · success `200` · scope `owner_vault`
- **Request:** EventReminderPlan {occurrence_scope, schedules, channels}; If-Match
- **Response:** EventReminderPlan
- **Contract:** Persist deterministic reminder rules linked to event/commitment, coalesce duplicates and respect quiet hours.

### `getEventReminderPlan`
`GET /api/v1/vaults/{vaultId}/calendar-events/{eventId}/reminder-plan` · success `200` · scope `owner_vault`
- **Request:** occurrence_id?
- **Response:** EventReminderPlan
- **Contract:** Return next triggers and deliverability, not guaranteed OS delivery.

### `previewCalendarImport`
`POST /api/v1/vaults/{vaultId}/calendar-import-preview` · success `202` · scope `owner_vault`
- **Request:** CalendarImportInput {attachment_id, format: ics, timezone, target_calendar_id}
- **Response:** JobHandle
- **Contract:** Produce proposal with duplicate/recurrence/cancellation handling; no meeting invitations from ICS import.

### `exportCalendar`
`POST /api/v1/vaults/{vaultId}/calendar-export` · success `202` · scope `owner_vault`
- **Request:** CalendarExportInput {calendar_ids, from, to, format: ics, privacy: minimal}; Idempotency-Key
- **Response:** JobHandle
- **Contract:** Create private export under existing export/download service; omit private prep and hidden notes by default.

## School structure and authoritative records

### `listSubjects`
`GET /api/v1/vaults/{vaultId}/school/subjects` · success `200` · scope `owner_vault`
- **Request:** cursor?, limit?, typed filters
- **Response:** List<Subject>
- **Contract:** A subject is a canonical school entity, with manual/provider origin and source links.

### `createSubject`
`POST /api/v1/vaults/{vaultId}/school/subjects` · success `201` · scope `owner_vault`
- **Request:** name, code?, description?, source_anchors?
- **Response:** Subject
- **Contract:** A subject is a canonical school entity, with manual/provider origin and source links. Create durable object; validate links and source ownership.

### `getSubject`
`GET /api/v1/vaults/{vaultId}/school/subjects/{subjectId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** Subject
- **Contract:** A subject is a canonical school entity, with manual/provider origin and source links.

### `updateSubject`
`PATCH /api/v1/vaults/{vaultId}/school/subjects/{subjectId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; partial permitted fields: name, code?, description?, source_anchors?
- **Response:** Subject
- **Contract:** A subject is a canonical school entity, with manual/provider origin and source links. Preserve authoritative fields and user locks; conflict instead of silent overwrite.

### `archiveSubject`
`DELETE /api/v1/vaults/{vaultId}/school/subjects/{subjectId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; archive reason?
- **Response:** Subject {archived_at}
- **Contract:** A subject is a canonical school entity, with manual/provider origin and source links. Archive local object; do not delete provider data, source documents or linked evidence.

### `listCourses`
`GET /api/v1/vaults/{vaultId}/school/courses` · success `200` · scope `owner_vault`
- **Request:** cursor?, limit?, typed filters
- **Response:** List<Course>
- **Contract:** Bind actual course period and teachers; shared entity IDs, not copied person records.

### `createCourse`
`POST /api/v1/vaults/{vaultId}/school/courses` · success `201` · scope `owner_vault`
- **Request:** subject_id, title, academic_period {start_date,end_date,timezone}, teacher_entity_ids[], class_source_id?, source_anchors?
- **Response:** Course
- **Contract:** Bind actual course period and teachers; shared entity IDs, not copied person records. Create durable object; validate links and source ownership.

### `getCourse`
`GET /api/v1/vaults/{vaultId}/school/courses/{courseId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** Course
- **Contract:** Bind actual course period and teachers; shared entity IDs, not copied person records.

### `updateCourse`
`PATCH /api/v1/vaults/{vaultId}/school/courses/{courseId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; partial permitted fields: subject_id, title, academic_period {start_date,end_date,timezone}, teacher_entity_ids[], class_source_id?, source_anchors?
- **Response:** Course
- **Contract:** Bind actual course period and teachers; shared entity IDs, not copied person records. Preserve authoritative fields and user locks; conflict instead of silent overwrite.

### `archiveCourse`
`DELETE /api/v1/vaults/{vaultId}/school/courses/{courseId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; archive reason?
- **Response:** Course {archived_at}
- **Contract:** Bind actual course period and teachers; shared entity IDs, not copied person records. Archive local object; do not delete provider data, source documents or linked evidence.

### `listCourseMaterials`
`GET /api/v1/vaults/{vaultId}/school/courses/{courseId}/materials` · success `200` · scope `owner_vault`
- **Request:** cursor?, limit?, chapter?, lesson_id?, kind?
- **Response:** List<CourseMaterialLink>
- **Contract:** Return source links and mapping evidence, not duplicated files.

### `linkCourseMaterial`
`POST /api/v1/vaults/{vaultId}/school/courses/{courseId}/materials` · success `201` · scope `owner_vault`
- **Request:** source_id, revision_id?, chapter?, lesson_id?, mapping_origin, evidence?
- **Response:** CourseMaterialLink
- **Contract:** Validate source access and actual mapping; unresolved chapters remain unresolved.

### `unlinkCourseMaterial`
`DELETE /api/v1/vaults/{vaultId}/school/courses/{courseId}/materials/{materialLinkId}` · success `204` · scope `owner_vault`
- **Request:** If-Match
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Remove association only; preserve source and original file.

### `listAssessments`
`GET /api/v1/vaults/{vaultId}/school/assessments` · success `200` · scope `owner_vault`
- **Request:** cursor?, limit?, typed filters
- **Response:** List<Assessment>
- **Contract:** An assessment and its deadline/calendar projection share stable identity. Scope/weight missing remains unknown.

### `createAssessment`
`POST /api/v1/vaults/{vaultId}/school/assessments` · success `201` · scope `owner_vault`
- **Request:** course_id, title, kind, time_spec, scope_material_links[], importance?, source_anchors?, origin
- **Response:** Assessment
- **Contract:** An assessment and its deadline/calendar projection share stable identity. Scope/weight missing remains unknown. Create durable object; validate links and source ownership.

### `getAssessment`
`GET /api/v1/vaults/{vaultId}/school/assessments/{assessmentId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** Assessment
- **Contract:** An assessment and its deadline/calendar projection share stable identity. Scope/weight missing remains unknown.

### `updateAssessment`
`PATCH /api/v1/vaults/{vaultId}/school/assessments/{assessmentId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; partial permitted fields: course_id, title, kind, time_spec, scope_material_links[], importance?, source_anchors?, origin
- **Response:** Assessment
- **Contract:** An assessment and its deadline/calendar projection share stable identity. Scope/weight missing remains unknown. Preserve authoritative fields and user locks; conflict instead of silent overwrite.

### `archiveAssessment`
`DELETE /api/v1/vaults/{vaultId}/school/assessments/{assessmentId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; archive reason?
- **Response:** Assessment {archived_at}
- **Contract:** An assessment and its deadline/calendar projection share stable identity. Scope/weight missing remains unknown. Archive local object; do not delete provider data, source documents or linked evidence.

### `createManualSchoolAssignment`
`POST /api/v1/vaults/{vaultId}/school/assignments` · success `201` · scope `owner_vault`
- **Request:** course_id, title, instructions_source_id?, due_time_spec?, material_links[], optional_task_id?
- **Response:** SchoolAssignment
- **Contract:** Create explicitly manual assignment and optional canonical task association; never assert school publication.

### `updateSchoolAssignmentOverlay`
`PATCH /api/v1/vaults/{vaultId}/school/assignments/{assignmentId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; personal_status?, task_id?, personal_estimate?, manual_fields?
- **Response:** SchoolAssignment
- **Contract:** Only manual source fields or personal overlays can change; source-owned instructions/due dates cannot be overwritten here.

### `archiveSchoolAssignmentOverlay`
`POST /api/v1/vaults/{vaultId}/school/assignments/{assignmentId}/archive` · success `200` · scope `owner_vault`
- **Request:** If-Match; reason?
- **Response:** SchoolAssignment
- **Contract:** Hide/archive personal view without deleting or submitting school data.

### `getSchoolLesson`
`GET /api/v1/vaults/{vaultId}/school/lessons/{lessonId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** SchoolLesson
- **Contract:** Return canonical occurrence, actual source time/room/status, linked materials and freshness.

### `listSchoolTeachers`
`GET /api/v1/vaults/{vaultId}/school/teachers` · success `200` · scope `owner_vault`
- **Request:** cursor?, limit?, course_id?
- **Response:** List<PersonWithCourseRoles>
- **Contract:** Projection of shared people/entity registry; no parallel teacher identity database.

### `createCatchUpPlan`
`POST /api/v1/vaults/{vaultId}/school/catch-up-plans` · success `202` · scope `owner_vault`
- **Request:** lesson_ids[], authorized_source_scope, constraints_profile_id?, estimate_policy
- **Response:** JobHandle<CatchUpPlan>
- **Contract:** Use actual missed-lesson evidence, report uncovered material, and produce a proposal; no invented class content.

## Private attendance and performance

### `listAttendanceRecords`
`GET /api/v1/vaults/{vaultId}/school/attendance` · success `200` · scope `owner_vault + school_private:read`
- **Request:** cursor?, limit?, typed filters
- **Response:** List<AttendanceRecord>
- **Contract:** Separately enabled private school data. Present/Absent/Late/Partial/Excused/Unknown are explicit, not inferred from missing rows or app inactivity. Source-owned records use personal correction overlays only.

### `createAttendanceRecord`
`POST /api/v1/vaults/{vaultId}/school/attendance` · success `201` · scope `owner_vault + school_private:write`
- **Request:** lesson_id?, course_id, local_date, start?, end?, status, minutes?, source_anchors?, origin, reason_category?
- **Response:** AttendanceRecord
- **Contract:** Separately enabled private school data. Present/Absent/Late/Partial/Excused/Unknown are explicit, not inferred from missing rows or app inactivity. Source-owned records use personal correction overlays only. Create durable object; validate links and source ownership.

### `getAttendanceRecord`
`GET /api/v1/vaults/{vaultId}/school/attendance/{attendanceRecordId}` · success `200` · scope `owner_vault + school_private:read`
- **Request:** none
- **Response:** AttendanceRecord
- **Contract:** Separately enabled private school data. Present/Absent/Late/Partial/Excused/Unknown are explicit, not inferred from missing rows or app inactivity. Source-owned records use personal correction overlays only.

### `updateAttendanceRecord`
`PATCH /api/v1/vaults/{vaultId}/school/attendance/{attendanceRecordId}` · success `200` · scope `owner_vault + school_private:write`
- **Request:** If-Match; partial permitted fields: lesson_id?, course_id, local_date, start?, end?, status, minutes?, source_anchors?, origin, reason_category?
- **Response:** AttendanceRecord
- **Contract:** Separately enabled private school data. Present/Absent/Late/Partial/Excused/Unknown are explicit, not inferred from missing rows or app inactivity. Source-owned records use personal correction overlays only. Preserve authoritative fields and user locks; conflict instead of silent overwrite.

### `archiveAttendanceRecord`
`DELETE /api/v1/vaults/{vaultId}/school/attendance/{attendanceRecordId}` · success `200` · scope `owner_vault + school_private:write`
- **Request:** If-Match; archive reason?
- **Response:** AttendanceRecord {archived_at}
- **Contract:** Separately enabled private school data. Present/Absent/Late/Partial/Excused/Unknown are explicit, not inferred from missing rows or app inactivity. Source-owned records use personal correction overlays only. Archive local object; do not delete provider data, source documents or linked evidence.

### `getAttendanceSummary`
`GET /api/v1/vaults/{vaultId}/school/attendance-summary` · success `200` · scope `owner_vault + school_private:read`
- **Request:** course_id?, date_from, date_to, denominator_basis
- **Response:** AttendanceSummary {known_minutes,absent_minutes,unknown_minutes,coverage,method,source_manifest}
- **Contract:** Show period, denominator, units and missing coverage. Never infer legal thresholds or convert unknown into present/absent.

### `listGradeRecords`
`GET /api/v1/vaults/{vaultId}/school/grades` · success `200` · scope `owner_vault + school_private:read`
- **Request:** cursor?, limit?, typed filters
- **Response:** List<GradeRecord>
- **Contract:** Keep original grade scale, explicit weights and provenance. Practice scores are not official grades; source-owned grades cannot be edited or submitted to school.

### `createGradeRecord`
`POST /api/v1/vaults/{vaultId}/school/grades` · success `201` · scope `owner_vault + school_private:write`
- **Request:** course_id, assessment_id?, raw_grade, scale, date, official_or_manual, weight?, source_anchors?, feedback_source_id?
- **Response:** GradeRecord
- **Contract:** Keep original grade scale, explicit weights and provenance. Practice scores are not official grades; source-owned grades cannot be edited or submitted to school. Create durable object; validate links and source ownership.

### `getGradeRecord`
`GET /api/v1/vaults/{vaultId}/school/grades/{gradeRecordId}` · success `200` · scope `owner_vault + school_private:read`
- **Request:** none
- **Response:** GradeRecord
- **Contract:** Keep original grade scale, explicit weights and provenance. Practice scores are not official grades; source-owned grades cannot be edited or submitted to school.

### `updateGradeRecord`
`PATCH /api/v1/vaults/{vaultId}/school/grades/{gradeRecordId}` · success `200` · scope `owner_vault + school_private:write`
- **Request:** If-Match; partial permitted fields: course_id, assessment_id?, raw_grade, scale, date, official_or_manual, weight?, source_anchors?, feedback_source_id?
- **Response:** GradeRecord
- **Contract:** Keep original grade scale, explicit weights and provenance. Practice scores are not official grades; source-owned grades cannot be edited or submitted to school. Preserve authoritative fields and user locks; conflict instead of silent overwrite.

### `archiveGradeRecord`
`DELETE /api/v1/vaults/{vaultId}/school/grades/{gradeRecordId}` · success `200` · scope `owner_vault + school_private:write`
- **Request:** If-Match; archive reason?
- **Response:** GradeRecord {archived_at}
- **Contract:** Keep original grade scale, explicit weights and provenance. Practice scores are not official grades; source-owned grades cannot be edited or submitted to school. Archive local object; do not delete provider data, source documents or linked evidence.

### `getPerformanceSummary`
`GET /api/v1/vaults/{vaultId}/performance/summary` · success `200` · scope `owner_vault + school_private:read when private grades requested`
- **Request:** course_id?, date_from?, date_to?, include_private_grades=false
- **Response:** PerformanceSummary
- **Contract:** Explain aggregation and coverage; trends/recommendations use multiple available factors, not unsupported grade predictions.

### `listKnowledgeGaps`
`GET /api/v1/vaults/{vaultId}/performance/knowledge-gaps` · success `200` · scope `owner_vault`
- **Request:** course_id?, assessment_id?, cursor?, limit?
- **Response:** List<KnowledgeGap>
- **Contract:** Use actual attempts/rubrics/material coverage; confidence and insufficient evidence remain visible.

### `correctKnowledgeGap`
`PATCH /api/v1/vaults/{vaultId}/performance/knowledge-gaps/{gapId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; state, correction_reason, evidence?
- **Response:** KnowledgeGap
- **Contract:** Owner can correct/dismiss; preserve previous inference and reason without overwriting an official record.

### `generateStudyRecommendations`
`POST /api/v1/vaults/{vaultId}/performance/recommendations` · success `202` · scope `owner_vault`
- **Request:** course_scope[], horizon, goal_ids[], source_scope, schedule_constraints_version
- **Response:** JobHandle<StudyRecommendations>
- **Contract:** Combine deadlines, material gaps, available time, targets and explicit workload; show missing inputs and source-linked reasons.

## Tasks, projects, ideas and explicit goals

### `listProjects`
`GET /api/v1/vaults/{vaultId}/projects` · success `200` · scope `owner_vault`
- **Request:** cursor?, limit?, typed filters
- **Response:** List<Project>
- **Contract:** Project links existing canonical notes, tasks, research and ideas; no copied source corpus.

### `createProject`
`POST /api/v1/vaults/{vaultId}/projects` · success `201` · scope `owner_vault`
- **Request:** title, description_note_id?, status, goal_ids[], source_anchors?
- **Response:** Project
- **Contract:** Project links existing canonical notes, tasks, research and ideas; no copied source corpus. Create durable object; validate links and source ownership.

### `getProject`
`GET /api/v1/vaults/{vaultId}/projects/{projectId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** Project
- **Contract:** Project links existing canonical notes, tasks, research and ideas; no copied source corpus.

### `updateProject`
`PATCH /api/v1/vaults/{vaultId}/projects/{projectId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; partial permitted fields: title, description_note_id?, status, goal_ids[], source_anchors?
- **Response:** Project
- **Contract:** Project links existing canonical notes, tasks, research and ideas; no copied source corpus. Preserve authoritative fields and user locks; conflict instead of silent overwrite.

### `archiveProject`
`DELETE /api/v1/vaults/{vaultId}/projects/{projectId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; archive reason?
- **Response:** Project {archived_at}
- **Contract:** Project links existing canonical notes, tasks, research and ideas; no copied source corpus. Archive local object; do not delete provider data, source documents or linked evidence.

### `listIdeas`
`GET /api/v1/vaults/{vaultId}/ideas` · success `200` · scope `owner_vault`
- **Request:** cursor?, limit?, typed filters
- **Response:** List<Idea>
- **Contract:** An idea remains traceable to its original capture and subsequent revisions.

### `createIdea`
`POST /api/v1/vaults/{vaultId}/ideas` · success `201` · scope `owner_vault`
- **Request:** source_anchor, title?, project_id?, state?
- **Response:** Idea
- **Contract:** An idea remains traceable to its original capture and subsequent revisions. Create durable object; validate links and source ownership.

### `getIdea`
`GET /api/v1/vaults/{vaultId}/ideas/{ideaId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** Idea
- **Contract:** An idea remains traceable to its original capture and subsequent revisions.

### `updateIdea`
`PATCH /api/v1/vaults/{vaultId}/ideas/{ideaId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; partial permitted fields: source_anchor, title?, project_id?, state?
- **Response:** Idea
- **Contract:** An idea remains traceable to its original capture and subsequent revisions. Preserve authoritative fields and user locks; conflict instead of silent overwrite.

### `archiveIdea`
`DELETE /api/v1/vaults/{vaultId}/ideas/{ideaId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; archive reason?
- **Response:** Idea {archived_at}
- **Contract:** An idea remains traceable to its original capture and subsequent revisions. Archive local object; do not delete provider data, source documents or linked evidence.

### `proposeIdeaProject`
`POST /api/v1/vaults/{vaultId}/ideas/{ideaId}/project-proposal` · success `201` · scope `owner_vault`
- **Request:** related_idea_ids[], proposed_title, existing_project_id?
- **Response:** Proposal
- **Contract:** Preview promotion/merge using shared proposal framework; preserve originals and require acceptance before merging.

### `listGoals`
`GET /api/v1/vaults/{vaultId}/goals` · success `200` · scope `owner_vault`
- **Request:** cursor?, limit?, typed filters
- **Response:** List<Goal>
- **Contract:** Goals are explicit owner choices. Targets, including grades, are not promised results; inferred goals stay proposals.

### `createGoal`
`POST /api/v1/vaults/{vaultId}/goals` · success `201` · scope `owner_vault`
- **Request:** title, kind, target?, scale?, target_date?, course_id?, project_id?, constraints?, source_anchors?
- **Response:** Goal
- **Contract:** Goals are explicit owner choices. Targets, including grades, are not promised results; inferred goals stay proposals. Create durable object; validate links and source ownership.

### `getGoal`
`GET /api/v1/vaults/{vaultId}/goals/{goalId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** Goal
- **Contract:** Goals are explicit owner choices. Targets, including grades, are not promised results; inferred goals stay proposals.

### `updateGoal`
`PATCH /api/v1/vaults/{vaultId}/goals/{goalId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; partial permitted fields: title, kind, target?, scale?, target_date?, course_id?, project_id?, constraints?, source_anchors?
- **Response:** Goal
- **Contract:** Goals are explicit owner choices. Targets, including grades, are not promised results; inferred goals stay proposals. Preserve authoritative fields and user locks; conflict instead of silent overwrite.

### `archiveGoal`
`DELETE /api/v1/vaults/{vaultId}/goals/{goalId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; archive reason?
- **Response:** Goal {archived_at}
- **Contract:** Goals are explicit owner choices. Targets, including grades, are not promised results; inferred goals stay proposals. Archive local object; do not delete provider data, source documents or linked evidence.

### `getTask`
`GET /api/v1/vaults/{vaultId}/tasks/{taskId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** Task
- **Contract:** Return canonical task, dependency state, remaining work and linked sessions/evidence.

### `getTaskExecutionHistory`
`GET /api/v1/vaults/{vaultId}/tasks/{taskId}/execution-history` · success `200` · scope `owner_vault`
- **Request:** cursor?, limit?
- **Response:** List<ExecutionSession>
- **Contract:** Actual owner-recorded work is distinct from elapsed calendar time or inferred attendance.

### `proposeTaskBreakdown`
`POST /api/v1/vaults/{vaultId}/tasks/{taskId}/breakdown` · success `202` · scope `owner_vault`
- **Request:** source_scope, max_session_minutes?, remaining_work?
- **Response:** JobHandle<TaskBreakdownProposal>
- **Contract:** Bounded local generation creates a dependency-aware proposal with source-linked steps and labeled estimates.

## Study plans, tutoring and execution

### `listStudyPlans`
`GET /api/v1/vaults/{vaultId}/study/plans` · success `200` · scope `owner_vault`
- **Request:** course_id?, assessment_id?, status?, cursor?, limit?
- **Response:** List<StudyPlan>
- **Contract:** Return draft/approved/active/stale/finished plans with source revisions and schedule links.

### `createStudyPlan`
`POST /api/v1/vaults/{vaultId}/study/plans` · success `202` · scope `owner_vault`
- **Request:** assessment_id? or goal_id, source_scope, material_links[], constraints_profile_id, workload_estimates?, tutoring_preferences?
- **Response:** JobHandle<StudyPlanProposal>
- **Contract:** Use actual chapter/material boundaries; return gaps and estimates. Deterministic scheduler proposes placement; generation never directly writes events.

### `getStudyPlan`
`GET /api/v1/vaults/{vaultId}/study/plans/{studyPlanId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** StudyPlan
- **Contract:** Open source-backed steps, linked tasks/sessions, revision status and approval proposal.

### `updateStudyPlan`
`PATCH /api/v1/vaults/{vaultId}/study/plans/{studyPlanId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; title?, step_overrides?, locked_step_ids?, personal_annotations?
- **Response:** StudyPlan
- **Contract:** Preserve source-backed generated sections versus owner annotations; scheduling-affecting edits need fresh constraint validation.

### `withdrawStudyPlan`
`POST /api/v1/vaults/{vaultId}/study/plans/{studyPlanId}/withdraw` · success `201` · scope `owner_vault`
- **Request:** If-Match; selected_unstarted_block_ids[], reason?
- **Response:** Proposal
- **Contract:** Preview withdrawal of unstarted flexible blocks; do not delete work history or fixed/externally shared events.

### `listStudySessions`
`GET /api/v1/vaults/{vaultId}/study/sessions` · success `200` · scope `owner_vault`
- **Request:** date_from?, date_to?, course_id?, status?, cursor?, limit?
- **Response:** List<StudySessionView>
- **Contract:** Projection linking canonical task, calendar occurrence and execution record; no independent competing schedule.

### `getStudySession`
`GET /api/v1/vaults/{vaultId}/study/sessions/{studySessionId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** StudySessionView
- **Contract:** Return source material, planned work, execution state, attempts and resume context.

### `startExecutionSession`
`POST /api/v1/vaults/{vaultId}/execution-sessions` · success `201` · scope `owner_vault`
- **Request:** task_id, study_session_id?, planned_minutes?, mode, client_operation_id
- **Response:** ExecutionSession
- **Contract:** Start explicit actual-work timer using persisted timestamps; do not infer work or attendance from calendar presence.

### `getExecutionSession`
`GET /api/v1/vaults/{vaultId}/execution-sessions/{executionSessionId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** ExecutionSession
- **Contract:** Return persisted elapsed/paused state and reference material after restart.

### `transitionExecutionSession`
`POST /api/v1/vaults/{vaultId}/execution-sessions/{executionSessionId}/transition` · success `200` · scope `owner_vault`
- **Request:** If-Match; action: pause|resume|finish|abandon, observed_at, completed_work?, remaining_work?, actual_minutes_correction?
- **Response:** ExecutionSession
- **Contract:** Validate state transitions, single-active policy and offline event order; no double-counting after reconnect. Finishing time is not mastery.

### `listStudyExercises`
`GET /api/v1/vaults/{vaultId}/study/exercises` · success `200` · scope `owner_vault`
- **Request:** course_id?, mode?, source_id?, cursor?, limit?
- **Response:** List<StudyExercise>
- **Contract:** Exercises include source anchors, generated status, rubric provenance and correction state.

### `generateStudyExercise`
`POST /api/v1/vaults/{vaultId}/study/exercises` · success `202` · scope `owner_vault`
- **Request:** mode: explain|socratic|active_recall|flashcards|practice|mock_exam|explain_12|advanced|knowledge_gaps, source_scope, course_id?, difficulty?, count?
- **Response:** JobHandle<StudyExerciseSet>
- **Contract:** All requested modes supported through typed policy. Source-grounded by default; generation cannot fabricate textbook questions as quotations.

### `getStudyExercise`
`GET /api/v1/vaults/{vaultId}/study/exercises/{exerciseId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** StudyExercise
- **Contract:** Return authorized question/explanation and sources; answer disclosure follows owner-selected practice mode, not security through hidden HTML.

### `submitStudyAttempt`
`POST /api/v1/vaults/{vaultId}/study/exercises/{exerciseId}/attempts` · success `201` · scope `owner_vault`
- **Request:** response, response_kind, started_at?, completed_at, hints_used[], confidence_self_report?, idempotency_key
- **Response:** StudyAttempt
- **Contract:** Persist real owner answer before grading. Keep practice results separate from official grades.

### `listStudyAttempts`
`GET /api/v1/vaults/{vaultId}/study/attempts` · success `200` · scope `owner_vault`
- **Request:** course_id?, exercise_id?, cursor?, limit?
- **Response:** List<StudyAttempt>
- **Contract:** Return actual answers, hints, elapsed evidence and grading status within private scope.

### `getStudyAttempt`
`GET /api/v1/vaults/{vaultId}/study/attempts/{attemptId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** StudyAttempt
- **Contract:** Open original response, rubric, source evidence and feedback history.

### `gradeStudyAttempt`
`POST /api/v1/vaults/{vaultId}/study/attempts/{attemptId}/feedback` · success `202` · scope `owner_vault`
- **Request:** rubric_source_id?, grading_mode, expected_attempt_revision
- **Response:** JobHandle<StudyFeedback>
- **Contract:** Use explicit answer/rubric for deterministic grading where possible; uncertain model feedback is labeled and source-linked. Never promise correctness.

### `correctStudyFeedback`
`PATCH /api/v1/vaults/{vaultId}/study/attempts/{attemptId}/feedback` · success `200` · scope `owner_vault`
- **Request:** If-Match; correction, evidence?, score_override?
- **Response:** StudyFeedback
- **Contract:** Owner corrections preserve audit/source and update dependent knowledge-gap estimates, never official grades.

### `listFlashcards`
`GET /api/v1/vaults/{vaultId}/study/flashcards` · success `200` · scope `owner_vault`
- **Request:** course_id?, due_before?, cursor?, limit?
- **Response:** List<Flashcard>
- **Contract:** Cards are linked to real source passages and generator/review history.

### `createFlashcard`
`POST /api/v1/vaults/{vaultId}/study/flashcards` · success `201` · scope `owner_vault`
- **Request:** front, back, source_anchors[], course_id?, initial_schedule?
- **Response:** Flashcard
- **Contract:** Save explicit card; generated sets may use the exercise-generation route and shared writes.

### `updateFlashcard`
`PATCH /api/v1/vaults/{vaultId}/study/flashcards/{flashcardId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; front?, back?, source_anchors?, suspended?
- **Response:** Flashcard
- **Contract:** Preserve revisions and suspend stale-source cards or mark corrections explicitly.

### `archiveFlashcard`
`DELETE /api/v1/vaults/{vaultId}/study/flashcards/{flashcardId}` · success `200` · scope `owner_vault`
- **Request:** If-Match
- **Response:** Flashcard
- **Contract:** Archive without deleting underlying notes or historical attempts.

### `reviewFlashcard`
`POST /api/v1/vaults/{vaultId}/study/flashcards/{flashcardId}/reviews` · success `201` · scope `owner_vault`
- **Request:** observed_at, outcome, answer?, hints_used?, elapsed_ms?
- **Response:** FlashcardReviewReceipt
- **Contract:** Persist actual review, apply a versioned deterministic interval policy and report next review; no clinical or guaranteed-learning claim.

## Deterministic scheduling and next actions

### `getSchedulingConstraints`
`GET /api/v1/vaults/{vaultId}/scheduler/constraints` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** SchedulingConstraints
- **Contract:** Include protected sleep/social/free time, fixed events, windows, limits, breaks, deadlines and explicit preferences.

### `setSchedulingConstraints`
`PUT /api/v1/vaults/{vaultId}/scheduler/constraints` · success `200` · scope `owner_vault`
- **Request:** If-Match; timezone, protected_windows[], preferred_windows[], daily_limits, breaks, freeze_horizon, movement_policy
- **Response:** SchedulingConstraints
- **Contract:** Validate time ranges/DST and preserve user locks. Conflict with existing plans produces a separate proposal, not silent bulk movement.

### `proposeSchedule`
`POST /api/v1/vaults/{vaultId}/scheduler/plans` · success `202` · scope `owner_vault`
- **Request:** task_ids[], window, constraints_revision, calendar_revision, allow_split, objective_parameters?
- **Response:** JobHandle<ScheduleProposal>
- **Contract:** Deterministic interval placement and constraint checks; same input/config produces same proposal. Expose unscheduled work and shortfall.

### `proposeReplan`
`POST /api/v1/vaults/{vaultId}/scheduler/replans` · success `202` · scope `owner_vault`
- **Request:** trigger, affected_task_ids[], prior_plan_id?, constraints_revision, calendar_revision, remaining_work
- **Response:** JobHandle<ScheduleProposal>
- **Contract:** Minimize disruption; preserve fixed/locked/in-progress and freeze-horizon blocks. Apply through version-checked shared proposals.

### `getScheduleExplanation`
`GET /api/v1/vaults/{vaultId}/scheduler/explanations/{proposalId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** ScheduleExplanation
- **Contract:** Return deterministic reasons, constraints, estimates and unplaced workload; do not manufacture historical preference evidence.

### `getNextActions`
`GET /api/v1/vaults/{vaultId}/next-actions` · success `200` · scope `owner_vault`
- **Request:** available_minutes?, context?, course_scope?
- **Response:** NextActionSet
- **Contract:** Return small actionable set derived from actual tasks/schedule with reasons; unknown durations are labeled.

### `getMomentumSummary`
`GET /api/v1/vaults/{vaultId}/momentum/summary` · success `200` · scope `owner_vault`
- **Request:** date_from, date_to, course_id?
- **Response:** MomentumSummary
- **Contract:** Report real completion/duration observations and minimum evidence/coverage; missed sessions are not a psychological diagnosis.

### `setMomentumPreferences`
`PATCH /api/v1/vaults/{vaultId}/momentum/preferences` · success `200` · scope `owner_vault`
- **Request:** If-Match; enabled, evidence_window, min_observations, user_locked_parameters[]
- **Response:** MomentumPreferences
- **Contract:** Opt-in adaptive estimates cannot override protected time or silently mutate explicit preferences.

## Memory, profile and personal-data evidence

### `listMemories`
`GET /api/v1/vaults/{vaultId}/memories` · success `200` · scope `owner_vault`
- **Request:** cursor?, limit?, typed filters
- **Response:** List<Memory>
- **Contract:** Memory is evidence-linked, editable and retractable. Inference cannot silently become a confirmed preference.

### `createMemory`
`POST /api/v1/vaults/{vaultId}/memories` · success `201` · scope `owner_vault`
- **Request:** kind, content, source_anchors[], explicit_or_inferred, valid_from?, expires_at?, user_confirmed?
- **Response:** Memory
- **Contract:** Memory is evidence-linked, editable and retractable. Inference cannot silently become a confirmed preference. Create durable object; validate links and source ownership.

### `getMemory`
`GET /api/v1/vaults/{vaultId}/memories/{memoryId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** Memory
- **Contract:** Memory is evidence-linked, editable and retractable. Inference cannot silently become a confirmed preference.

### `updateMemory`
`PATCH /api/v1/vaults/{vaultId}/memories/{memoryId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; partial permitted fields: kind, content, source_anchors[], explicit_or_inferred, valid_from?, expires_at?, user_confirmed?
- **Response:** Memory
- **Contract:** Memory is evidence-linked, editable and retractable. Inference cannot silently become a confirmed preference. Preserve authoritative fields and user locks; conflict instead of silent overwrite.

### `archiveMemory`
`DELETE /api/v1/vaults/{vaultId}/memories/{memoryId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; archive reason?
- **Response:** Memory {archived_at}
- **Contract:** Memory is evidence-linked, editable and retractable. Inference cannot silently become a confirmed preference. Archive local object; do not delete provider data, source documents or linked evidence.

### `getPersonalProfile`
`GET /api/v1/vaults/{vaultId}/personal-profile` · success `200` · scope `owner_vault`
- **Request:** include_evidence=true, time_window?
- **Response:** PersonalProfile
- **Contract:** Aggregate actual memories/goals/projects/interests with source evidence, uncertainty and owner corrections; no fixed psychological identity.

### `listInterestClaims`
`GET /api/v1/vaults/{vaultId}/personal-profile/interests` · success `200` · scope `owner_vault`
- **Request:** state?, cursor?, limit?
- **Response:** List<InterestClaim>
- **Contract:** Observations, inferred interests and owner-confirmed preferences remain distinct; trend denominators and coverage are explicit.

### `getInterestEvidence`
`GET /api/v1/vaults/{vaultId}/personal-profile/interests/{interestId}/evidence` · success `200` · scope `owner_vault`
- **Request:** cursor?, limit?
- **Response:** List<InterestEvidence>
- **Contract:** Each item records interaction kind, observed event time, source and extraction limits. Fetching content does not prove watching it.

### `decideInterestClaim`
`POST /api/v1/vaults/{vaultId}/personal-profile/interests/{interestId}/decision` · success `200` · scope `owner_vault`
- **Request:** If-Match; confirm|correct|dismiss, corrected_value?, reason?
- **Response:** InterestClaim
- **Contract:** Persist owner decision and suppression; no reinstatement from the unchanged rejected evidence.

### `rebuildPersonalProfile`
`POST /api/v1/vaults/{vaultId}/personal-profile/rebuild` · success `202` · scope `owner_vault`
- **Request:** source_scope, time_window, policy_revision
- **Response:** JobHandle<ProfileProposal>
- **Contract:** Analyze only opted-in evidence; preserve owner locks, show changes and use sufficient observations/decay. No sensitive trait inference or political preference prediction.

### `listPersonalDataItems`
`GET /api/v1/vaults/{vaultId}/personal-data/items` · success `200` · scope `owner_vault`
- **Request:** connection_id?, action_type?, date_from?, date_to?, cursor?, limit?
- **Response:** List<PersonalDataItem>
- **Contract:** Return normalized actually observed records with exact platform action type and coverage, not invented browsing/listening history.

### `getPersonalDataItem`
`GET /api/v1/vaults/{vaultId}/personal-data/items/{personalDataItemId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** PersonalDataItem
- **Contract:** Show original authorized evidence plus normalized view and source identity.

### `deletePersonalDataItem`
`DELETE /api/v1/vaults/{vaultId}/personal-data/items/{personalDataItemId}` · success `204` · scope `owner_vault`
- **Request:** If-Match; local_removal_policy
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Remove owner local import and retract derived evidence; do not delete provider content. Record reimport suppression where selected.

### `syncSelectedPersonalData`
`POST /api/v1/vaults/{vaultId}/personal-data/sync` · success `202` · scope `owner_vault`
- **Request:** connection_ids[], capabilities[], window?, catch_up_run_key?
- **Response:** JobHandle<PersonalDataSyncReport>
- **Contract:** Fan out to shared connector jobs; persist incremental cursors and deduplicate Sunday/catch-up runs.

### `listInsights`
`GET /api/v1/vaults/{vaultId}/insights` · success `200` · scope `owner_vault`
- **Request:** kind?, date_from?, date_to?, cursor?, limit?
- **Response:** List<AIInsight>
- **Contract:** Weekly and on-demand insights retain observed totals, coverage, sources and inference labels.

### `getInsight`
`GET /api/v1/vaults/{vaultId}/insights/{insightId}` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** AIInsight
- **Contract:** Open source-backed school/project/social/profile review with original evidence and revision status.

### `updateInsightFeedback`
`PATCH /api/v1/vaults/{vaultId}/insights/{insightId}` · success `200` · scope `owner_vault`
- **Request:** If-Match; pinned?, dismissed?, correction_note_id?
- **Response:** AIInsight
- **Contract:** Allow dismissal/correction without rewriting source facts; suppress identical resurfacing.

## People and cross-domain context

### `listPeople`
`GET /api/v1/vaults/{vaultId}/people` · success `200` · scope `owner_vault`
- **Request:** cursor?, limit?, role?, query?
- **Response:** List<PersonSummary>
- **Contract:** Read projection of canonical calendar/entity registry, including authorized teacher/contact roles. Do not scrape unrelated directory members.

### `getPersonContext`
`GET /api/v1/vaults/{vaultId}/people/{personId}` · success `200` · scope `owner_vault`
- **Request:** include_active_commitments=true, window?
- **Response:** PersonContext
- **Contract:** Combine actual plans, borrowed items and discussion notes with exact identity and private-source policy. No inferred personality dossier.

### `proposeSocialTime`
`POST /api/v1/vaults/{vaultId}/people/{personId}/availability-proposals` · success `202` · scope `owner_vault`
- **Request:** window, duration_estimate, user_constraints_revision, connected_availability_scope?
- **Response:** JobHandle<SocialTimeProposal>
- **Contract:** Use only owner or explicitly shared availability. Owner free time is not evidence the other person is free; no invitations on proposal generation.

## Additional connector and bounded agent interfaces

### `listIntegrationProviders`
`GET /api/v1/integration-providers` · success `200` · scope `owner`
- **Request:** none
- **Response:** List<IntegrationProviderDescriptor>
- **Contract:** Document actually implemented capabilities, verified backend identity, account blockers and disabled optional modules.

### `providerOAuthCallback`
`GET /api/v1/oauth/{providerId}/callback` · success `302` · scope `validated_oauth_state`
- **Request:** provider-registry-specific code/error/state; exact registered redirect
- **Response:** OAuthCallbackResult or validated redirect
- **Contract:** Dispatch only enabled allowlisted providers; Microsoft retains its existing callback. Validate state/issuer/audience and one-time binding; no arbitrary redirect/provider URL.

### `googleCalendarChangeNotification`
`POST /api/v1/integrations/google/notifications` · success `204` · scope `validated_provider_notification`
- **Request:** validated channel/resource identifiers, provider proof per actual contract
- **Response:** No body (204); inspect the linked resource/job/audit for outcome.
- **Contract:** Optional narrowly published callback, not available by assumption on tailnet. Re-fetch authorized changes, deduplicate; never trust payload as calendar authority.

### `getConnectionMapping`
`GET /api/v1/vaults/{vaultId}/connections/{connectionId}/mapping` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** ConnectionMapping
- **Contract:** Show explicit source-field normalization, permitted datasets and extraction provenance; hide credentials.

### `setConnectionMapping`
`PUT /api/v1/vaults/{vaultId}/connections/{connectionId}/mapping` · success `200` · scope `owner_vault`
- **Request:** If-Match; typed mapping for verified provider schema, timezone, entity mapping, supported extraction profile
- **Response:** ConnectionMapping
- **Contract:** Validate against known schema. Cannot execute arbitrary code, install a package or turn an unverified website into a verified live API.

### `listAgentTools`
`GET /api/v1/tools` · success `200` · scope `owner`
- **Request:** scope?
- **Response:** List<PermissionedTool>
- **Contract:** Return finite installed tool schemas and permission classes; internal secrets/filesystem are never tools.

### `executeNaturalLanguageCommand`
`POST /api/v1/vaults/{vaultId}/commands` · success `202` · scope `owner_vault`
- **Request:** text, source_scope, context_ids[], client_operation_id
- **Response:** JobHandle<CommandResult>
- **Contract:** Router extracts typed intent; domain authorization/policy govern read and proposal actions. A command cannot authorize external writes merely by quoting imported text.

### `getToolPolicies`
`GET /api/v1/vaults/{vaultId}/tool-policies` · success `200` · scope `owner_vault`
- **Request:** none
- **Response:** ToolPolicySet
- **Contract:** Display approved bounded automations, default confirmations, scope and version.

### `setToolPolicies`
`PUT /api/v1/vaults/{vaultId}/tool-policies` · success `200` · scope `owner_vault`
- **Request:** If-Match; allowlisted tool policies, scopes, confirmation requirements, quotas
- **Response:** ToolPolicySet
- **Contract:** Owner policy only; destructive/external actions retain reviewed safeguards. No unrestricted shell/file/network policy grants.

## Home host, remote access and trusted clients

### `getHostResources`
`GET /api/v1/host/resources` · success `200` · scope `host:admin`
- **Request:** none
- **Response:** HostResourceReport
- **Contract:** Authenticated real CPU/RAM/GPU/disk/runtime observations and timestamp; missing probes are unknown, not guessed from 4090.

### `getDeploymentProfile`
`GET /api/v1/deployment` · success `200` · scope `host:admin`
- **Request:** none
- **Response:** DeploymentProfile
- **Contract:** Current home-host profile, configured canonical origin, access mode and diagnostic states; no secrets or claim that planned URLs are configured.

### `checkDeployment`
`POST /api/v1/deployment/checks` · success `202` · scope `host:admin`
- **Request:** profile_id, check_kinds from finite allowlist
- **Response:** SystemJobHandle<DeploymentCheckReport>
- **Contract:** Probe only registered own service addresses and known settings. No arbitrary URL scanner, router configuration or firewall disabling.

### `previewRemoteAccessSetup`
`POST /api/v1/deployment/access-preview` · success `202` · scope `host:admin`
- **Request:** mode: tailscale_private|cloudflare_access, owner_config_reference, canonical_origin_candidate
- **Response:** SystemJobHandle<AccessSetupPlan>
- **Contract:** Validate prerequisites and produce exact reviewed setup actions/risks. Never publish or purchase automatically; no raw tunnel token in result.

### `getDeviceCachePolicy`
`GET /api/v1/devices/{deviceId}/cache-policy` · success `200` · scope `owner_device`
- **Request:** none
- **Response:** DeviceCachePolicy
- **Contract:** Report trusted/session-only mode, selected cached vaults and reported cache state; an offline device report may be stale.

### `setDeviceCachePolicy`
`PUT /api/v1/devices/{deviceId}/cache-policy` · success `200` · scope `owner_device`
- **Request:** If-Match; trusted, selected_vault_ids[], cache_limits, expire_after?, clear_on_logout
- **Response:** DeviceCachePolicy
- **Contract:** Explicit owner approval for persistent remote copies; revoke new access and request cleanup without promising erasure of offline copies.

### `requestDeviceCachePurge`
`POST /api/v1/devices/{deviceId}/cache-purge` · success `202` · scope `owner_device`
- **Request:** selected_vault_ids[], request_reason
- **Response:** CachePurgeRequest
- **Contract:** Record requested/acknowledged cleanup separately; disconnected devices cannot be certified erased.

### `getHostResourcePolicy`
`GET /api/v1/resource-policy` · success `200` · scope `host:admin`
- **Request:** none
- **Response:** ResourcePolicy
- **Contract:** Describe interactive priority, concurrency, model residency and owner limits.

### `setHostResourcePolicy`
`PUT /api/v1/resource-policy` · success `200` · scope `host:admin`
- **Request:** If-Match; max_inference_concurrency, background_budget, quiet_hours, pause_background, model_profile_ids[]
- **Response:** ResourcePolicy
- **Contract:** Apply validated resource caps, never install a new model or alter unrelated Ollama policy silently.

## Native commands

- `capture.open` — Open configurable quick-capture window. No implicit clipboard read or content upload. 
- `clipboard.capture_selection` — Capture on deliberate user command. Read only the explicitly requested clipboard payload. 
- `vault.create_local` — Create local-only vault. No cloud registration or outbound event. 
- `vault.sync_preview` — Preview enabling/disabling cloud sync. Show exactly which data, attachments, and derivatives would be uploaded or remain remotely. Existing sync contract now targets the approved home host by default; machine-local vaults stay non-remote. Cloud deployment remains an optional profile.
- `vault.enable_sync` — Apply approved cloud configuration. Explicit owner consent; authenticated hub; initial upload resumable. Existing sync contract now targets the approved home host by default; machine-local vaults stay non-remote. Cloud deployment remains an optional profile.
- `vault.disable_sync` — Stop future synchronization. Clearly distinguish stopping sync from removing the remote copy. Existing sync contract now targets the approved home host by default; machine-local vaults stay non-remote. Cloud deployment remains an optional profile.
- `folder_watch.list` — List local allowed-folder watches. Do not transmit local paths to the hub. 
- `folder_watch.create` — Select folder, exclusions, and preview import. Native picker and canonical allowed path; no remote path strings. 
- `folder_watch.update` — Pause/change an existing watch. Reconfirm any expanded filesystem scope. 
- `folder_watch.delete` — Stop a watch. Does not erase imported notes or source files. 
- `model.inspect` — Inspect installed local models and runtime. Loopback or explicitly paired private runtime only. 
- `model.install` — Install approved registry model after consent. Pinned digest, disk check, bounded progress/cancellation; no arbitrary download URL. 
- `model.test` — Run real capability/embedding test. Report actual result and measured resource usage. 
- `worker.configure` — Pause, resume, or set resource policy. No arbitrary native commands or source scripts. 
- `audio.record` — Start/stop deliberate voice capture. Visible microphone state and durable original audio. 
- `file.import` — Import user-selected supported files. Same capture/import service contract as cloud; preserve originals. 
- `export.save` — Save authorized bundle to chosen path. Native save picker; path never chosen by an LLM. 
- `backup.configure` — Configure local backup destination and retention. Explicit path/key handling; no automatic unapproved cloud destination. 
- `backup.run` — Create consistent local backup. Use safe SQLite snapshot and complete blob manifest. 
- `backup.restore` — Preview and restore local backup. Validate first, confirmation, maintenance mode; no silent overwrite. 
- `reminders.deliver` — Deliver due local notification. Permission-aware, deduplicated; record missed delivery honestly. 
- `app.update` — Check/apply authenticated application update. Verified update artifact; preserve vaults and rollback/recovery path. 
- `launch_calendar_view` — Deep-link into the unified calendar/commitment/source view. Use existing auth, native IPC and shared service path. 
- `open_calendar_event` — Deep-link into the unified calendar/commitment/source view. Use existing auth, native IPC and shared service path. 
- `open_commitment` — Deep-link into the unified calendar/commitment/source view. Use existing auth, native IPC and shared service path. 
- `navigate_to_event_source` — Deep-link into the unified calendar/commitment/source view. Use existing auth, native IPC and shared service path. 
- `host.preflight` — Inspect actual Windows host prerequisites. Read-only, owner-approved checks; unknown resources remain unknown. 
- `host.service_setup` — Install selected verified host service profile. Explicit local approval; no automatic login or unrelated installation replacement. 
- `remote.setup` — Apply owner-reviewed private or Access-protected configuration. Owner setup, real diagnostics; do not reset other Serve/DNS config or expose runtime ports. 
- `cache.clear` — Clear this client app-owned offline cache. Preserve unsynced edits via explicit conflict/export decision; do not clear unrelated browser data. 
- `study.open` — Open source-backed next action and resume focus. Same task/execution/session records; do not infer completion. 
- `host.doctor` — Diagnose server/model/provider/access components. Redacted output, no secret printing, distinguish not tested from passed. 

## MCP tools

- `capture_note` · `capture:write` · input: capture contract + vault_id · output: CaptureReceipt.
- `search_notes` · `search:read` · input: search contract + vault_id · output: SearchResult or JobHandle.
- `get_note` · `notes:read` · input: vault_id, note_id, optional revision_id · output: Note + requested document representation.
- `ask_notes` · `ask:run` · input: vault_id, question, SearchScope, queue_when_offline · output: AskHandle; bounded polling returns Message when complete.
- `list_collections` · `notes:read` · input: vault_id, cursor?, limit? · output: List<Collection>.
- `get_job` · `jobs:read` · input: vault_id, job_id · output: Job with typed result or terminal error.
- `cancel_job` · `jobs:write` · input: vault_id, job_id · output: Job with actual cancellation state.
- `calendar_find` · `read` — Structured calendar search with scope and freshness.
- `calendar_context` · `read_private` — Read private prep only within authorized vault; warn that external AI clients may receive it.
- `commitments_find` · `read` — Find active source-backed commitments.
- `calendar_propose` · `proposal_only` — Persist a proposal; never use tool output to imply invitation authority.
- `school_assignments` · `school:read` · input: vault_id, course_id?, cursor? · output: List<SchoolAssignment>.
- `school_schedule` · `school:read` · input: vault_id, window · output: SchoolSchedule.
- `school_attendance` · `school_private:read` · input: vault_id, course_scope, window · output: AttendanceSummary.
- `study_propose_plan` · `study:propose` · input: vault_id, goal/assessment_id, source_scope, constraints_version · output: JobHandle<StudyPlanProposal>.
- `study_next_action` · `study:read` · input: vault_id, available_minutes? · output: NextActionSet.
- `performance_summary` · `school_private:read` · input: vault_id, course_scope, window · output: PerformanceSummary.
- `memory_find` · `memory:read` · input: vault_id, query, source_scope · output: List<MemoryWithEvidence>.
- `memory_propose` · `memory:propose` · input: vault_id, content, evidence_ids, explicit_or_inferred · output: Proposal.
- `personal_data_sync` · `connections:sync` · input: vault_id, allowed_connection_ids, window? · output: JobHandle.
- `personal_profile` · `profile:read` · input: vault_id, time_window?, include_evidence · output: PersonalProfile.
- `tasks_propose` · `tasks:propose` · input: vault_id, typed requested action, task_id?, expected_revision? · output: Proposal.
- `scheduler_propose` · `scheduler:propose` · input: vault_id, tasks, window, constraints_revision · output: JobHandle<ScheduleProposal>.

Native/MCP tools are adapters over the same permissioned services, not additional owners of data. Do not duplicate persistence or permit arbitrary host execution.

# Appendix B — Codex implementation instruction


Build the actual unified application specified in `OMEGA-MASTER-SPEC.md` in the current authorized repository. This is implementation work, not a request to brainstorm another architecture or deliver only a dashboard. Preserve existing working code, local changes, contracts and migrations. Inspect the repository first; extend rather than rewrite.

## Source of truth

Read `OMEGA-MASTER-SPEC.md`, including its merged endpoint appendix. It already absorbs Sorta Notes, Sorta Calendar and all 62 sections of the uploaded Personal OS. `API-INVENTORY.json` contains the same planned contracts; `FEATURE-COVERAGE.md` maps retained requirements; `ACCEPTANCE-TESTS.md` defines release scenarios. Files under `reference-inputs/` are historical provenance, not competing scope instructions. Do not reapply superseded notes-only/calendar-only exclusions.

## Product

One personal command center: universal capture, canonical block notes, automatic organization, exact-source RAG, calendar, conditional commitments/private preparation, tasks, projects, people, school materials/assignments/assessments, opt-in private attendance/grades, source-based study/tutoring/flashcards, deterministic scheduling/replanning, focus execution, evidence-based memory/profile, incremental integrations and weekly insights. All modules use one identity/vault/source/task/job system.

The key continuity test is a borrowing note followed later by a meeting note: create the correct private meeting and linked preparation without losing the original promise, inventing a time, confusing person/place identities or sending an invitation. The school test links actual material and an assessment to a study plan, constrained calendar slots, actual practice and evidence-based replanning.

## Hardware and remote access

The owner's Windows RTX 4090 PC hosts the existing Fastify/PostgreSQL/pgvector hub, original files, jobs/scheduler/connectors and local Ollama worker. Keep React/TypeScript/Vite, Tauri, Tiptap/Yjs, SQLite/IndexedDB replicas and shared packages unless the actual repository already has a sound equivalent. Do not require a separate cloud database or a model on the other PC.

Implement access through an authenticated browser/PWA on the other PC. Default profile: private Tailscale Serve HTTPS where client installation is permitted. Include the documented Cloudflare Tunnel+Access alternative for permitted browser-only access, with Access protection before publication, origin validation and explicit transport privacy boundaries. Use one configured canonical origin. Keep Ollama/database/debug ports private. No Funnel, unauthenticated tunnel, router port forwarding or forced firewall disablement.

Inspect actual host resources/services; do not guess RAM/CPU from 4090. Prove the selected service startup profile, two-PC use, streaming/upload recovery, authorization, client-cache policy and host-off limitations. Do not claim a powered-off host provides live cloud service. See `REMOTE-ACCESS.md`.

Keep the existing small defaults `qwen3.5:4b` and `qwen3-embedding:0.6b` behind provider interfaces, verifying official versions/digests/runtime and evaluating actual quality. No silent model upgrade or cloud fallback. The LLM produces typed interpretations; code controls dates, recurrence, scheduling, permissions and mutations.

## Work and completion

Implement the ordered stages in master section 21 without treating later stages as out of scope. Maintain requirement→module→route→test coverage as code lands. Finish all enabled UI paths with real persistence, validation, authorization, loading/empty/error states, provenance, restart recovery and meaningful tests. Generate actual OpenAPI 3.1, JSON Schemas and clients from implemented contracts; the supplied JSON is a planning inventory, not a deployed API.

Use shared proposals/jobs/sources/events rather than duplicate implementations. Long operations create durable 202 jobs with status/cancel/retry paths. User edits/locks beat stale model output. No fake citations, grades, attendance, connections, AI answers or success-shaped stubs in production. Demo data must be isolated and labeled.

Microsoft resources need verified per-resource permission and pagination/coverage. InSchool needs a genuine approved interface/feed or clearly labeled import path. Optional personal-data/extraction adapters must report actual capabilities; do not guess Anakin's identity or pretend a Meetly/Meetily API exists. Do not bypass authentication, school restrictions, CAPTCHA or service controls. Missing accounts/permissions are explicit blockers, not authorization to fabricate results.

External calendar writes use reviewed policies and a durable provider outbox. Shared changes/invitations require exact recipient/content review; private prep is never exported accidentally. Never give the model credentials, shell access or arbitrary network destinations.

Run every applicable scenario and actual-model/Windows tests in available authorized environments. Report implemented, fixture-tested, live-verified, failed, not-run and externally-blocked separately. Continue unblocked work when a provider prerequisite is missing. Do not label documentation as deployment, a route as implemented because it appears in this inventory, or a test as passed because it exists.

Deliver runnable source/build artifacts, migrations/lockfiles, contracts/client, coverage matrix, measured test/model results, Windows host/desktop and web/PWA packaging, remote-access setup/diagnostics, consistent backup/restore evidence, dependency/license inventory and precise unresolved prerequisites. Do not publish private content, buy infrastructure, change unrelated accounts or modify unrelated repositories.
