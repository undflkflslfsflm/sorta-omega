import { describe, expect, it } from "vitest";
import { nextActionSetSchema } from "@sorta/contracts";
import { calendarImportInputSchema } from "@sorta/contracts";
import { applyRestoreSchema, createBackupSchema, createRestorePlanSchema } from "@sorta/contracts";
import { setToolPoliciesSchema } from "@sorta/contracts";
import { executeNaturalLanguageCommandSchema } from "@sorta/contracts";
import { checkDeploymentSchema, hostResourceReportSchema } from "@sorta/contracts";
import { previewRemoteAccessSetupSchema, setHostResourcePolicySchema } from "@sorta/contracts";
import { requestDeviceCachePurgeSchema, setDeviceCachePolicySchema } from "@sorta/contracts";
import { setConnectionMappingSchema } from "@sorta/contracts";
import { rebuildPersonalProfileSchema, syncSelectedPersonalDataSchema } from "@sorta/contracts";
import { previewConnectionDisconnectSchema } from "@sorta/contracts";
import { applyImportSchema, planImportSchema } from "@sorta/contracts";
import { previewSchoolImportSchema } from "@sorta/contracts";
import { withdrawStudyPlanSchema } from "@sorta/contracts";
import { proposeSocialTimeSchema } from "@sorta/contracts";
import { purgeRequestSchema } from "@sorta/contracts";
import { authorizationRequestSchema, reauthorizationRequestSchema } from "@sorta/contracts";
import { acceptProposalSchema, aiDisclosurePreviewInputSchema, analyzeTranscriptSchema, approveDevicePairingSchema, archiveGradeRecordSchema, askHandleSchema, calendarExportInputSchema, connectorScheduleSchema, correctKnowledgeGapSchema, correctTranscriptSchema, createApiTokenSchema, createAttendanceRecordSchema, createCalendarEventSchema, createCaptureSchema, createCatchUpPlanSchema, createExportSchema, createFlashcardSchema, createGradeRecordSchema, createMemorySchema, createNoteSchema, createPerformanceGradeSchema, createReminderSchema, createSchoolAssessmentSchema, createSchoolAssignmentSchema, createSchoolCourseSchema, createSchoolLessonSchema, createStudyActivitySchema, createStudySessionSchema, createSyncSnapshotSchema, createTaskSchema, createUrlCaptureSchema, decideInterestClaimSchema, editorDocumentSchema, expectedNoteRevisionSchema, generateArtifactSchema, generatePerformanceRecommendationsSchema, interestEvidenceSchema, linkCourseMaterialSchema, momentumSummaryQuerySchema, occurrenceExceptionInputSchema, preparationPlanInputSchema, previewIdeaPromotionSchema, proposeIdeaProjectSchema, proposeScheduleSchema, proposeTaskBreakdownSchema, proposalInputSchema, pushSyncSchema, recordFlashcardReviewSchema, reviewFlashcardSchema, rejectProposalSchema, reprocessNoteSchema, resourceSelectionInputSchema, resurfacingFeedbackInputSchema, resolvedCitationSchema, restoreNoteRevisionSchema, runDomainToolSchema, schedulePreviewRequestSchema, schoolReadinessReportSchema, searchSuggestionsSchema, setNoteLabelsSchema, setPersonalDataPoliciesSchema, setSchedulerPreferencesSchema, setSchedulingConstraintsSchema, setVaultAiPolicySchema, startExecutionSessionSchema, studySessionActionSchema, submitStudyResponseSchema, syncBatchSchema, syncSnapshotResultSchema, syncSocketClientFrameSchema, syncSocketServerFrameSchema, taskExecutionHistorySchema, teacherViewSchema, toolDescriptorSchema, transcriptSegmentSchema, transitionExecutionSessionSchema, updateCalendarEventSchema, updateGradeRecordSchema, updateKnowledgeGapSchema, updateMomentumPreferencesSchema, updateNotificationSchema, updateReminderSchema, vaultAiPolicySchema } from "@sorta/contracts";

describe("domain contracts", () => {
  it("accepts the initial scheduling revision in next actions", () => {
    const response = { generatedAt: "2026-09-23T12:00:00.000Z", constraintsRevision: 0, availableMinutes: null, context: "any", contextApplied: false, courseScope: null, candidates: [], limitations: [] };
    expect(nextActionSetSchema.safeParse(response).success).toBe(true);
    expect(nextActionSetSchema.safeParse({ ...response, constraintsRevision: -1 }).success).toBe(false);
  });
  it("bounds social-time proposals and requires unique explicit connection scope",()=>{const id="00000000-0000-4000-8000-000000000123";const base={window:{startsAt:"2026-09-21T09:00:00.000Z",endsAt:"2026-09-21T17:00:00.000Z"},durationEstimate:60,userConstraintsRevision:0};expect(proposeSocialTimeSchema.safeParse(base).success).toBe(true);expect(proposeSocialTimeSchema.safeParse({...base,durationEstimate:5}).success).toBe(false);expect(proposeSocialTimeSchema.safeParse({...base,connectedAvailabilityScope:{connectionIds:[id,id]}}).success).toBe(false);});
  it("requires literal permanent-purge confirmation and a positive revision",()=>{expect(purgeRequestSchema.safeParse({confirmation:"permanently_purge",expectedRevision:2}).success).toBe(true);expect(purgeRequestSchema.safeParse({confirmation:"delete",expectedRevision:2}).success).toBe(false);expect(purgeRequestSchema.safeParse({confirmation:"permanently_purge",expectedRevision:0}).success).toBe(false);});
  it("keeps provider authorization capabilities and return targets finite",()=>{expect(authorizationRequestSchema.safeParse({requestedCapabilities:["calendar.read"],registeredReturnTarget:"connection_detail"}).success).toBe(true);expect(authorizationRequestSchema.safeParse({requestedCapabilities:["calendar.read","calendar.read"],registeredReturnTarget:"connections"}).success).toBe(false);expect(reauthorizationRequestSchema.safeParse({requestedCapabilities:["calendar.write"],registeredReturnTarget:"connections",reason:"permission_upgrade"}).success).toBe(true);});
  it("rejects empty capture before persistence", () => {
    expect(createCaptureSchema.safeParse({ text: "", clientOperationId: "operation-1" }).success).toBe(false);
    const blobId="00000000-0000-4000-8000-000000000123";
    expect(createCaptureSchema.safeParse({ blobIds:[blobId], clientOperationId:"file-operation-1" }).success).toBe(true);
    expect(createCaptureSchema.safeParse({ blobIds:[blobId,blobId], clientOperationId:"file-operation-2" }).success).toBe(false);
  });

  it("requires explicit consent and bounded owner text for URL capture",()=>{
    expect(createUrlCaptureSchema.safeParse({url:"https://example.com/page",fetchConsent:true,selectedText:"Relevant excerpt"}).success).toBe(true);
    expect(createUrlCaptureSchema.safeParse({url:"https://example.com/page",fetchConsent:false}).success).toBe(false);
    expect(createUrlCaptureSchema.safeParse({url:"not a URL",fetchConsent:true}).success).toBe(false);
  });

  it("requires a bounded explicit scope and revision-fenced refresh for generated artifacts",()=>{
    const noteId="00000000-0000-4000-8000-000000000123";
    expect(generateArtifactSchema.safeParse({kind:"summary",scope:{noteIds:[noteId]}}).success).toBe(true);
    expect(generateArtifactSchema.safeParse({kind:"summary",scope:{}}).success).toBe(false);
    expect(generateArtifactSchema.safeParse({kind:"summary",scope:{noteIds:[noteId]},targetGeneratedNoteId:noteId}).success).toBe(false);
    expect(generateArtifactSchema.safeParse({kind:"summary",scope:{noteIds:[noteId]},targetGeneratedNoteId:noteId,expectedRevision:2}).success).toBe(true);
  });

  it("bounds performance recommendation horizons and deduplicates course scope",()=>{const courseId="00000000-0000-4000-8000-000000000123";expect(generatePerformanceRecommendationsSchema.safeParse({courseIds:[courseId],horizon:{from:"2026-09-01",to:"2026-12-31"}}).success).toBe(true);expect(generatePerformanceRecommendationsSchema.safeParse({courseIds:[courseId,courseId],horizon:{from:"2026-09-01",to:"2026-12-31"}}).success).toBe(false);expect(generatePerformanceRecommendationsSchema.safeParse({horizon:{from:"2026-09-01",to:"2028-12-31"}}).success).toBe(false);});

  it("requires configured identities and explicit destructive confirmation for backup restore",()=>{const id="00000000-0000-4000-8000-000000000123";expect(createBackupSchema.safeParse({destinationId:id,encryptionProfileId:"windows-dpapi-host-v1"}).success).toBe(true);expect(createRestorePlanSchema.safeParse({backupId:id,targetMode:"isolated_validation"}).success).toBe(true);expect(applyRestoreSchema.safeParse({planRevision:1,destructiveConfirmation:"yes"}).success).toBe(false);expect(applyRestoreSchema.safeParse({planRevision:1,destructiveConfirmation:"replace_installation_from_verified_backup"}).success).toBe(true);});

  it("keeps grade records typed, source-linked, and revision-fenced by transport",()=>{const courseId="00000000-0000-4000-8000-000000000123",sourceId="00000000-0000-4000-8000-000000000124";const base={courseId,rawGrade:"5+",scale:"Norwegian 1-6",date:"2026-09-21",officialOrManual:"official" as const,sourceAnchorIds:[sourceId],feedbackSourceId:sourceId};expect(createGradeRecordSchema.safeParse(base).success).toBe(true);expect(createGradeRecordSchema.safeParse({...base,sourceAnchorIds:[sourceId,sourceId]}).success).toBe(false);expect(updateGradeRecordSchema.safeParse({}).success).toBe(false);expect(updateGradeRecordSchema.safeParse({rawGrade:"6"}).success).toBe(true);expect(archiveGradeRecordSchema.safeParse({reason:"Duplicate owner record"}).success).toBe(true);});

  it("requires unique grounded sources for bounded task breakdowns",()=>{const sourceId="00000000-0000-4000-8000-000000000123";expect(proposeTaskBreakdownSchema.safeParse({sourceScope:{sourceIds:[sourceId]},maxSessionMinutes:30,remainingWork:{minutes:90}}).success).toBe(true);expect(proposeTaskBreakdownSchema.safeParse({sourceScope:{sourceIds:[sourceId,sourceId]}}).success).toBe(false);expect(proposeTaskBreakdownSchema.safeParse({sourceScope:{sourceIds:[sourceId]},remainingWork:{}}).success).toBe(false);});

  it("requires an explicit reason when correcting a knowledge gap",()=>{const anchor="00000000-0000-4000-8000-000000000123";expect(correctKnowledgeGapSchema.safeParse({state:"corrected",correctionReason:"The original inference confused two concepts.",evidenceAnchorIds:[anchor]}).success).toBe(true);expect(correctKnowledgeGapSchema.safeParse({state:"dismissed",correctionReason:""}).success).toBe(false);});

  it("creates only bounded canonical note content and revision-fences lifecycle changes",()=>{
    expect(createNoteSchema.safeParse({content:{kind:"text",text:"Owner-authored note"}}).success).toBe(true);
    expect(createNoteSchema.safeParse({content:{kind:"html",html:"<script>alert(1)</script>"}}).success).toBe(false);
    expect(createNoteSchema.safeParse({id:"not-a-uuid",content:{kind:"text",text:"x"}}).success).toBe(false);
    expect(expectedNoteRevisionSchema.safeParse({expectedRevision:2}).success).toBe(true);
    expect(expectedNoteRevisionSchema.safeParse({expectedRevision:0}).success).toBe(false);
    expect(restoreNoteRevisionSchema.safeParse({expectedCurrentRevision:3}).success).toBe(true);
  });

  it("keeps rich editor documents inside the supported node and safe-link vocabulary",()=>{
    expect(editorDocumentSchema.safeParse({type:"doc",content:[{type:"heading",attrs:{level:2},content:[{type:"text",text:"Safe rich note",marks:[{type:"bold"}]}]}]}).success).toBe(true);
    expect(editorDocumentSchema.safeParse({type:"doc",content:[{type:"paragraph",content:[{type:"text",text:"unsafe",marks:[{type:"link",attrs:{href:"javascript:alert(1)"}}]}]}]}).success).toBe(false);
    expect(editorDocumentSchema.safeParse({type:"doc",content:[{type:"iframe",attrs:{src:"https://attacker.example"}}]}).success).toBe(false);
  });

  it("keeps pairing and API-token grants inside the closed scope vocabulary", () => {
    const vaultId = "00000000-0000-4000-8000-000000000123";
    expect(approveDevicePairingSchema.safeParse({ user_code: "ABCD-EFGH", vault_ids: [vaultId], scopes: ["vault:read", "shell:run"], approved_role: "client" }).success).toBe(false);
    expect(createApiTokenSchema.safeParse({ label: "CLI", vault_ids: [vaultId], scopes: ["vault:read"], expires_at: "2027-01-01T00:00:00.000Z" }).success).toBe(true);
  });

  it("rejects calendar events whose end precedes start", () => {
    expect(createCalendarEventSchema.safeParse({
      title: "Impossible",
      startsAt: "2026-09-18T12:00:00.000Z",
      endsAt: "2026-09-18T11:00:00.000Z"
    }).success).toBe(false);
  });

  it("requires an explicit series or occurrence scope for recurrence edits",()=>{
    expect(updateCalendarEventSchema.safeParse({expectedRevision:2,title:"Ambiguous edit"}).success).toBe(false);
    expect(updateCalendarEventSchema.safeParse({scope:"series",expectedRevision:2,title:"Whole series"}).success).toBe(true);
    expect(occurrenceExceptionInputSchema.safeParse({expectedRevision:2,originalStartsAt:"2026-09-20T10:00:00.000Z",cancelled:true}).success).toBe(false);
    expect(occurrenceExceptionInputSchema.safeParse({scope:"occurrence",expectedRevision:2,originalStartsAt:"2026-09-20T10:00:00.000Z",cancelled:true}).success).toBe(true);
  });

  it("bounds preparation plans and keeps estimates and locked events explicit",()=>{
    const taskId="00000000-0000-4000-8000-000000000071",eventId="00000000-0000-4000-8000-000000000072";
    expect(preparationPlanInputSchema.safeParse({taskIds:[taskId],window:{startsAt:"2026-09-20T10:00:00.000Z",endsAt:"2026-09-27T10:00:00.000Z"},limits:{dailyLimitMinutes:120},estimates:{[taskId]:45},lockedEventIds:[eventId],expectedInputRevisions:{[taskId]:2,[`calendar_event:${eventId}`]:1,scheduler_preferences:0}}).success).toBe(true);
    expect(preparationPlanInputSchema.safeParse({taskIds:[taskId],window:{startsAt:"2026-09-20T10:00:00.000Z",endsAt:"2026-11-27T10:00:00.000Z"},expectedInputRevisions:{}}).success).toBe(false);
  });

  it("bounds private calendar exports and fixes their privacy mode",()=>{
    const calendarId="00000000-0000-4000-8000-000000000071";
    expect(calendarExportInputSchema.safeParse({calendarIds:[calendarId],from:"2026-09-20T10:00:00.000Z",to:"2026-12-20T10:00:00.000Z",format:"ics",privacy:"minimal"}).success).toBe(true);
    expect(calendarExportInputSchema.safeParse({calendarIds:[calendarId],from:"2026-09-20T10:00:00.000Z",to:"2027-12-20T10:00:00.000Z",format:"ics",privacy:"full"}).success).toBe(false);
    expect(createExportSchema.safeParse({scope:{domains:["school","study","profile"]},format:"full_fidelity",includeHistory:true}).success).toBe(true);
  });

  it("accepts only an explicit ICS attachment and target calendar for import preview",()=>{const attachmentId="00000000-0000-4000-8000-000000000071",targetCalendarId="00000000-0000-4000-8000-000000000072";expect(calendarImportInputSchema.safeParse({attachmentId,format:"ics",timezone:"Europe/Oslo",targetCalendarId}).success).toBe(true);expect(calendarImportInputSchema.safeParse({attachmentId,format:"csv",timezone:"Europe/Oslo",targetCalendarId,sendInvitations:true}).success).toBe(false);});

  it("rejects locked labels that are not assigned", () => {
    expect(setNoteLabelsSchema.safeParse({ expectedRevision: 1, labelIds: [], lockedLabelIds: ["00000000-0000-4000-8000-000000000099"] }).success).toBe(false);
  });

  it("accepts only the currently implemented named reprocessing stage", () => {
    expect(reprocessNoteSchema.safeParse({ expectedRevision: 2, stages: ["classify"] }).success).toBe(true);
    expect(reprocessNoteSchema.safeParse({ expectedRevision: 2, stages: ["classify", "arbitrary_script"] }).success).toBe(false);
  });

  it("requires canonical IDs for course references", () => {
    expect(createSchoolCourseSchema.safeParse({ name: "Math", subjectId: "not-a-subject", teacherEntityIds: [], classEntityIds: [], sourceAnchorIds: [] }).success).toBe(false);
  });

  it("requires evidence for inferred course-material mappings",()=>{const sourceId="00000000-0000-4000-8000-000000000123",anchorId="00000000-0000-4000-8000-000000000124";expect(linkCourseMaterialSchema.safeParse({sourceId,mappingOrigin:"owner"}).success).toBe(true);expect(linkCourseMaterialSchema.safeParse({sourceId,mappingOrigin:"inferred"}).success).toBe(false);expect(linkCourseMaterialSchema.safeParse({sourceId,mappingOrigin:"inferred",evidenceAnchorIds:[anchorId]}).success).toBe(true);});

  it("keeps unknown assignment due time explicit", () => {
    const courseId = "00000000-0000-4000-8000-000000000123";
    expect(createSchoolAssignmentSchema.parse({ courseId, title: "Essay" }).due).toEqual({ kind: "unknown" });
    expect(createSchoolAssignmentSchema.safeParse({ courseId, title: "Essay", due: { kind: "exact", dueAt: "tomorrow", timezone: "Europe/Oslo" } }).success).toBe(false);
  });

  it("does not let a lesson duplicate a linked calendar event's time", () => {
    const courseId = "00000000-0000-4000-8000-000000000123"; const calendarEventId = "00000000-0000-4000-8000-000000000124";
    expect(createSchoolLessonSchema.safeParse({ courseId, calendarEventId, timeSpec: { kind: "exact", startsAt: "2026-09-19T09:00:00.000Z", endsAt: "2026-09-19T10:00:00.000Z", timezone: "Europe/Oslo" }, sourceAnchorIds: [] }).success).toBe(false);
    expect(createSchoolLessonSchema.safeParse({ courseId, timeSpec: { kind: "exact", startsAt: "2026-09-19T10:00:00.000Z", endsAt: "2026-09-19T09:00:00.000Z", timezone: "Europe/Oslo" }, sourceAnchorIds: [] }).success).toBe(false);
  });

  it("keeps missing assessment date, scope, and weight unknown", () => {
    const parsed = createSchoolAssessmentSchema.parse({ courseId: "00000000-0000-4000-8000-000000000123", title: "Chapter test", kind: "test" });
    expect(parsed.timeSpec).toEqual({ kind: "unknown" }); expect(parsed.materialScope).toBeNull(); expect(parsed.officialWeight).toBeNull();
  });

  it("requires attendance duration and unit to travel together", () => {
    expect(createAttendanceRecordSchema.safeParse({ courseId: "00000000-0000-4000-8000-000000000123", date: "2026-09-19", rawStatus: "Absent", normalizedStatus: "absent", duration: 45, units: null }).success).toBe(false);
  });

  it("preserves a missing official grade weight as unknown", () => {
    const parsed = createPerformanceGradeSchema.parse({ courseId: "00000000-0000-4000-8000-000000000123", gradeValue: "5", gradeScale: "1-6", date: "2026-09-19" });
    expect(parsed.officialWeight).toBeNull();
  });

  it("requires explicit bounded study-session inputs and actions", () => {
    expect(createStudySessionSchema.safeParse({ unitIds: ["00000000-0000-4000-8000-000000000123"], taskIds: [], materialSourceIds: [] }).success).toBe(false);
    expect(createStudySessionSchema.safeParse({ taskIds: [], unitIds: [], materialSourceIds: [], mode: "active_recall", estimatedMinutes: 25 }).success).toBe(true);
    expect(createStudySessionSchema.safeParse({ taskIds: ["00000000-0000-4000-8000-000000000123"], unitIds: [], materialSourceIds: [], mode: "active_recall", estimatedMinutes: 25, startImmediately: true }).success).toBe(false);
    expect(createStudySessionSchema.safeParse({ taskIds: ["00000000-0000-4000-8000-000000000123"], unitIds: [], materialSourceIds: [], mode: "active_recall", estimatedMinutes: 25, startImmediately: true, expectedTaskRevisions: { "00000000-0000-4000-8000-000000000123": 2 } }).success).toBe(true);
    expect(studySessionActionSchema.safeParse({ action: "complete", observedAt: "sometime", expectedRevision: 1 }).success).toBe(false);
  });

  it("keeps execution timers explicit and transitions observation-based",()=>{const taskId="00000000-0000-4000-8000-000000000123";expect(startExecutionSessionSchema.safeParse({taskId,mode:"focus",clientOperationId:"execution-op-1"}).success).toBe(true);expect(transitionExecutionSessionSchema.safeParse({action:"finish",observedAt:"2026-09-21T10:00:00.000Z",completedWork:{description:"Drafted section one"},remainingWork:{minutes:30},actualMinutesCorrection:42}).success).toBe(true);expect(transitionExecutionSessionSchema.safeParse({action:"resume",observedAt:"2026-09-21T10:00:00.000Z",remainingWork:{minutes:30}}).success).toBe(false);});

  it("requires an owner correction when a knowledge gap is corrected", () => {
    expect(updateKnowledgeGapSchema.safeParse({ status: "corrected", expectedRevision: 1 }).success).toBe(false);
    expect(updateKnowledgeGapSchema.safeParse({ status: "corrected", correction: "The issue was notation, not the concept.", expectedRevision: 1 }).success).toBe(true);
  });

  it("bounds flashcard content and review ratings", () => {
    const deckId = "00000000-0000-4000-8000-000000000123";
    expect(createFlashcardSchema.safeParse({ deckId, prompt: "What is inertia?", answer: "Resistance to change in motion." }).success).toBe(true);
    expect(recordFlashcardReviewSchema.safeParse({ responseId: "review-1", rating: "perfect-ish", observedAt: "2026-09-19T10:00:00.000Z", expectedCardRevision: 1 }).success).toBe(false);
    expect(reviewFlashcardSchema.safeParse({observedAt:"2026-09-19T10:00:00.000Z",outcome:"good",answer:"My answer",hintsUsed:1,elapsedMs:12000}).success).toBe(true);
    expect(reviewFlashcardSchema.safeParse({observedAt:"2026-09-19T10:00:00.000Z",outcome:"mastered"}).success).toBe(false);
  });

  it("rejects inconsistent scheduler bounds and strips unrecognized predicates", () => {
    const base = { timezone: "Europe/Oslo", protectedWindows: [], preferredWindows: [], dailyLimitMinutes: 180, breakMinutes: 10, minBlockMinutes: 90, maxBlockMinutes: 25, allowSplit: true, replanPolicy: "manual_only", algorithmVersion: "deterministic-scheduler-v1" };
    expect(setSchedulerPreferencesSchema.safeParse({ preferences: base, expectedRevision: 0 }).success).toBe(false);
    const parsed = setSchedulerPreferencesSchema.parse({ preferences: { ...base, minBlockMinutes: 25, maxBlockMinutes: 90, arbitraryPredicate: "run shell" }, expectedRevision: 0 });
    expect("arbitraryPredicate" in parsed.preferences).toBe(false);
  });

  it("validates master scheduling constraints and exact revision-fenced plans",()=>{const taskId="00000000-0000-4000-8000-000000000123",hash="a".repeat(64),window={startsAt:"2026-09-21T08:00:00.000Z",endsAt:"2026-09-22T08:00:00.000Z"};expect(setSchedulingConstraintsSchema.safeParse({timezone:"Europe/Oslo",protectedWindows:[],preferredWindows:[],dailyLimits:{defaultMinutes:180},breaks:{betweenBlocksMinutes:10,minBlockMinutes:25,maxBlockMinutes:90},freezeHorizonMinutes:120,movementPolicy:"minimize_disruption",allowSplit:true}).success).toBe(true);expect(proposeScheduleSchema.safeParse({taskIds:[taskId],window,constraintsRevision:2,calendarRevision:hash,allowSplit:true,objectiveParameters:{strategy:"deadline_priority_v1"}}).success).toBe(true);expect(proposeScheduleSchema.safeParse({taskIds:[taskId,taskId],window,constraintsRevision:2,calendarRevision:hash,allowSplit:true}).success).toBe(false);});

  it("keeps unknown task effort explicit and validates task block bounds", () => {
    expect(createTaskSchema.parse({ title: "Read chapter" }).estimatedMinutes).toBeUndefined();
    expect(createTaskSchema.safeParse({ title: "Read chapter", minBlockMinutes: 60, maxBlockMinutes: 20 }).success).toBe(false);
  });

  it("keeps reminder schedules concrete and notification acknowledgements finite",()=>{
    const taskId="00000000-0000-4000-8000-000000000123";
    expect(createReminderSchema.safeParse({taskId,remindAt:"2026-09-21T08:00:00.000Z",timezone:"Europe/Oslo",channel:"in_app"}).success).toBe(true);
    expect(createReminderSchema.safeParse({taskId,remindAt:"tomorrow",timezone:"Europe/Oslo",channel:"email"}).success).toBe(false);
    expect(updateReminderSchema.safeParse({expectedRevision:1}).success).toBe(false);
    expect(updateReminderSchema.safeParse({expectedRevision:1,status:"snoozed",remindAt:"2026-09-21T09:00:00.000Z"}).success).toBe(true);
    expect(updateNotificationSchema.safeParse({state:"dismissed"}).success).toBe(true);
    expect(updateNotificationSchema.safeParse({state:"unread"}).success).toBe(false);
  });

  it("requires revision-fenced inputs and a forward scheduler horizon", () => {
    const taskId = "00000000-0000-4000-8000-000000000123";
    expect(schedulePreviewRequestSchema.safeParse({ taskIds: [taskId], horizon: { startsAt: "2026-09-20T10:00:00.000Z", endsAt: "2026-09-20T09:00:00.000Z" }, expectedInputRevisions: { [taskId]: 1, scheduler_preferences: 0 } }).success).toBe(false);
    expect(schedulePreviewRequestSchema.safeParse({ taskIds: [taskId], horizon: { startsAt: "2026-09-20T09:00:00.000Z", endsAt: "2026-09-20T10:00:00.000Z" }, expectedInputRevisions: { [taskId]: 1, scheduler_preferences: 0 } }).success).toBe(true);
  });

  it("bounds momentum windows and keeps adaptation preferences closed", () => {
    expect(momentumSummaryQuerySchema.safeParse({ dateFrom: "2026-09-01", dateTo: "2026-09-30", courseId: null }).success).toBe(true);
    expect(momentumSummaryQuerySchema.safeParse({ dateFrom: "2026-02-30", dateTo: "2026-09-30", courseId: null }).success).toBe(false);
    expect(momentumSummaryQuerySchema.safeParse({ dateFrom: "2025-01-01", dateTo: "2026-09-30", courseId: null }).success).toBe(false);
    expect(updateMomentumPreferencesSchema.safeParse({ enabled: true, evidenceWindowDays: 28, minObservations: 5, userLockedParameters: ["protected_windows"] }).success).toBe(true);
    expect(updateMomentumPreferencesSchema.safeParse({ enabled: true, userLockedParameters: ["sleep_schedule"] }).success).toBe(false);
    expect(updateMomentumPreferencesSchema.safeParse({}).success).toBe(false);
  });

  it("identifies task execution history by canonical task and bounded session records", () => {
    const taskId = "00000000-0000-4000-8000-000000000123";
    expect(taskExecutionHistorySchema.safeParse({ taskId, items: [], nextCursor: null }).success).toBe(true);
    expect(taskExecutionHistorySchema.safeParse({ taskId: "not-a-task", items: [], nextCursor: null }).success).toBe(false);
  });

  it("keeps synchronization events metadata-only and explicitly requires a snapshot", () => {
    expect(syncBatchSchema.safeParse({ events: [], nextCursor: null, hasMore: false, snapshotRequired: true, retentionFloorEventId: "0", latestEventId: "42" }).success).toBe(true);
    expect(syncBatchSchema.safeParse({ events: [{ eventId: 1, payload: { noteBody: "must not travel here" } }], nextCursor: null, hasMore: false, snapshotRequired: false, retentionFloorEventId: "0", latestEventId: "1" }).success).toBe(false);
  });

  it("binds synchronization snapshots to an enrolled device and a bounded manifest", () => {
    const deviceId = "00000000-0000-4000-8000-000000000123";
    expect(createSyncSnapshotSchema.safeParse({ deviceId }).success).toBe(true);
    expect(createSyncSnapshotSchema.safeParse({ deviceId, arbitraryQuery: "SELECT *" }).success).toBe(false);
    expect(syncSnapshotResultSchema.safeParse({ type: "sync_snapshot", protocolVersion: 1, snapshotId: "00000000-0000-4000-8000-000000000124", requestedForDeviceId: deviceId, watermarkCursor: "cursor", entries: [], entryCount: 0, generatedAt: "2026-09-20T12:00:00.000Z", writesApplied: false }).success).toBe(true);
  });

  it("requires bounded unique idempotency keys for typed sync writes", () => {
    const deviceId="00000000-0000-4000-8000-000000000123",operationId="00000000-0000-4000-8000-000000000124",taskId="00000000-0000-4000-8000-000000000125";
    const operation={type:"task_update" as const,operationId,taskId,expectedRevision:2,patch:{completed:true}};
    expect(pushSyncSchema.safeParse({deviceId,lastCursor:"cursor",operations:[operation]}).success).toBe(true);
    expect(pushSyncSchema.safeParse({deviceId,lastCursor:"cursor",operations:[operation,operation]}).success).toBe(false);
    expect(pushSyncSchema.safeParse({deviceId,lastCursor:"cursor",operations:[{type:"task_create",operationId,taskId,command:{title:"Offline task"}}]}).success).toBe(true);
    expect(pushSyncSchema.safeParse({deviceId,lastCursor:"cursor",operations:[{type:"calendar_event_trash",operationId,eventId:taskId,expectedRevision:1,scope:"occurrence"}]}).success).toBe(false);
  });

  it("negotiates only versioned bounded synchronization socket frames",()=>{
    const deviceId="00000000-0000-4000-8000-000000000123";
    expect(syncSocketClientFrameSchema.safeParse({type:"hello",protocolVersion:1,deviceId,cursor:"cursor",mode:"read_write"}).success).toBe(true);
    expect(syncSocketClientFrameSchema.safeParse({type:"hello",protocolVersion:2,deviceId,cursor:"cursor",mode:"read_write"}).success).toBe(false);
    expect(syncSocketServerFrameSchema.safeParse({type:"changes",events:[],nextCursor:"cursor"}).success).toBe(true);
    expect(syncSocketServerFrameSchema.safeParse({type:"error",code:"run_shell",retryable:false}).success).toBe(false);
  });

  it("requires a proposal revision and bounds rejection reasons", () => {
    expect(rejectProposalSchema.safeParse({ expectedProposalRevision: 0 }).success).toBe(false);
    expect(rejectProposalSchema.safeParse({ expectedProposalRevision: 1, reason: "No longer needed" }).success).toBe(true);
  });

  it("requires explicit confirmation before applying a proposal", () => {
    expect(acceptProposalSchema.safeParse({ expectedProposalRevision: 1, confirmation: "preview_only" }).success).toBe(false);
    expect(acceptProposalSchema.safeParse({ expectedProposalRevision: 1, confirmation: "apply_schedule" }).success).toBe(true);
    expect(acceptProposalSchema.safeParse({ expectedProposalRevision: 1, confirmation: "apply_content_proposal" }).success).toBe(true);
    expect(acceptProposalSchema.safeParse({ expectedProposalRevision: 1, confirmation: "apply_study_withdrawal" }).success).toBe(true);
  });

  it("keeps content proposals typed, revision-fenced, and idea promotion unambiguous",()=>{
    const a="00000000-0000-4000-8000-000000000101",b="00000000-0000-4000-8000-000000000102";
    expect(proposalInputSchema.safeParse({kind:"merge_notes",inputs:{targetNoteId:a,sourceNoteIds:[b],mergedTitle:"Combined",mergedBody:"Evidence-preserving body"},expectedRevisions:{[a]:2,[b]:1}}).success).toBe(true);
    expect(proposalInputSchema.safeParse({kind:"run_shell",inputs:{},expectedRevisions:{}}).success).toBe(false);
    expect(previewIdeaPromotionSchema.safeParse({targetProjectId:b,newProjectName:"Duplicate choice",expectedRevisions:{[a]:1,[b]:1}}).success).toBe(false);
    expect(previewIdeaPromotionSchema.safeParse({newProjectName:"New project",expectedRevisions:{[a]:1}}).success).toBe(true);
    expect(proposeIdeaProjectSchema.safeParse({relatedIdeaIds:[b],proposedTitle:"Research project"}).success).toBe(true);
    expect(proposeIdeaProjectSchema.safeParse({relatedIdeaIds:[b,b],proposedTitle:"Research project"}).success).toBe(false);
  });

  it("requires evidence for inferred memory and never lets it start confirmed", () => {
    const anchorId = "00000000-0000-4000-8000-000000000123";
    expect(createMemorySchema.safeParse({ kind: "fact", content: "Likely preference", origin: "inferred" }).success).toBe(false);
    expect(createMemorySchema.safeParse({ kind: "fact", content: "Likely preference", origin: "inferred", sourceAnchorIds: [anchorId], userConfirmed: true }).success).toBe(false);
    expect(createMemorySchema.safeParse({ kind: "preference", content: "I prefer short review blocks", origin: "explicit", userConfirmed: true }).success).toBe(true);
  });

  it("requires revision fences for every requested catch-up lesson", () => {
    const lessonId="00000000-0000-4000-8000-000000000123";
    expect(createCatchUpPlanSchema.safeParse({lessonIds:[lessonId],expectedLessonRevisions:{}}).success).toBe(false);
    const parsed=createCatchUpPlanSchema.parse({lessonIds:[lessonId],expectedLessonRevisions:{[lessonId]:2}});
    expect(parsed.estimatePolicy).toBe("unknown_unless_explicit");
  });

  it("keeps ask handles compact and citation resolution explicit",()=>{
    const id="00000000-0000-4000-8000-000000000123";
    expect(askHandleSchema.safeParse({jobId:id,userMessageId:id,answerMessageId:id,status:"waiting_for_worker"}).success).toBe(true);
    expect(searchSuggestionsSchema.safeParse({labels:[{id,name:"Physics"}],titles:[],savedQueries:[]}).success).toBe(true);
    expect(resolvedCitationSchema.safeParse({source:{id,kind:"capture",contentHash:"a".repeat(64),available:true},revision:{noteId:id,citedRevision:1,currentRevision:2},anchor:{chunkId:id,startOffset:0,endOffset:4},exactExcerpt:"Fact",currentNoteLink:{noteId:id,title:"Note",path:`/notes/${id}`},historical:true}).success).toBe(true);
  });

  it("distinguishes teacher projections and import-only school readiness",()=>{
    const id="00000000-0000-4000-8000-000000000123";
    expect(teacherViewSchema.safeParse({id,name:"Teacher",role:"teacher",aliases:[],courseIds:[id],sourceAnchorIds:[],revision:1,updatedAt:"2026-09-20T12:00:00.000Z"}).success).toBe(true);
    expect(schoolReadinessReportSchema.safeParse({connectionId:id,provider:"visma_inschool",state:"import_only",route:{kind:"import_snapshot",approved:true,registeredReturnTargetRequired:false},consent:{credentialConfigured:false,resourceSelectionRecorded:false},capabilityTests:[{key:"visma_inschool.owner_export",mode:"import_only",enabled:false,verifiedAt:null,passed:false,limitation:"Snapshot only"}],readyForLiveSync:false,snapshotOnly:true,lastSuccessAt:null,limitations:["Snapshot only"]}).success).toBe(true);
  });

  it("keeps cloud AI disabled unless policy and disclosure agree",()=>{
    const id="00000000-0000-4000-8000-000000000123",base={local:{enabled:true,profileId:"local-qwen-general",backend:"local_worker" as const},purposes:["grounded_qa" as const],limits:{maxSourceBytesPerRequest:200000,maxRequestsPerDay:500}};
    expect(vaultAiPolicySchema.safeParse({vaultId:id,...base,cloud:{enabled:false,providerConnectionId:null},disclosure:{cloudContentEgressEnabled:false,statement:"Local only"},revision:0,createdAt:null,updatedAt:null}).success).toBe(true);
    expect(setVaultAiPolicySchema.safeParse({policy:{...base,cloud:{enabled:true,providerConnectionId:id},disclosure:{cloudContentEgressEnabled:false,statement:"Mismatch"}},expectedRevision:0,explicitConsent:true,disclosurePreviewId:id}).success).toBe(false);
    expect(aiDisclosurePreviewInputSchema.safeParse({providerConnectionId:id,purpose:"grounded_qa",scope:{kinds:["note"],sourceIds:[]},limits:base.limits}).success).toBe(true);
  });

  it("requires disclosure before enabling personal-data processing",()=>{
    const policies={enabledProviders:["youtube" as const],analysisTypes:["interest_topics" as const],retentionDays:90,weeklySync:{enabled:true,weekday:1,localTime:"03:00",timezone:"Europe/Oslo"},privacy:{includeRawTitles:false,includeUrls:false,allowProfileInference:true}};
    expect(setPersonalDataPoliciesSchema.safeParse({policies,expectedRevision:0}).success).toBe(false);
    expect(setPersonalDataPoliciesSchema.safeParse({policies,expectedRevision:0,disclosureConfirmation:"enable_personal_data_analysis"}).success).toBe(true);
  });

  it("keeps interest decisions explicit and evidence semantics non-inferential",()=>{const id="00000000-0000-4000-8000-000000000123",time="2026-09-21T12:00:00.000Z";expect(decideInterestClaimSchema.safeParse({decision:"correct",correctedValue:"Local AI",reason:"More precise"}).success).toBe(true);expect(decideInterestClaimSchema.safeParse({decision:"correct"}).success).toBe(false);expect(interestEvidenceSchema.safeParse({personalDataItemId:id,interactionKind:"fetched",observedEventTime:time,provider:"youtube",accountLabel:"Owner export",sourceItemId:"x",title:"A title",contentReference:null,sourceUrl:null,extractionLimits:{semantics:"owner_export_declared",knownFields:["title"],unknownFields:["watch_duration"],windowFrom:null,windowTo:null,limitations:["Fetch does not establish playback"]},fetchingContentProvesConsumption:false,linkedAt:time}).success).toBe(true);});

  it("requires bounded resurfacing feedback semantics",()=>{
    const id="00000000-0000-4000-8000-000000000123";
    expect(resurfacingFeedbackInputSchema.safeParse({noteId:id,action:"dismiss"}).success).toBe(true);
    expect(resurfacingFeedbackInputSchema.safeParse({noteId:id,action:"hide_topic"}).success).toBe(false);
    expect(resurfacingFeedbackInputSchema.safeParse({noteId:id,action:"hide_topic",labelId:id}).success).toBe(true);
  });

  it("keeps agent tools finite and read-only",()=>{
    const id="00000000-0000-4000-8000-000000000123";
    expect(runDomainToolSchema.safeParse({toolName:"get_note_summary",input:{noteId:id},mode:"read"}).success).toBe(true);
    expect(runDomainToolSchema.safeParse({toolName:"run_shell",input:{command:"whoami"},mode:"execute"}).success).toBe(false);
    expect(toolDescriptorSchema.safeParse({name:"search_notes",domain:"notes",description:"Search",effect:"read",requiredGrant:"notes:read",inputSchema:{type:"object"},outputSchema:{type:"object"},capability:{state:"available",reason:null}}).success).toBe(true);
  });

  it("keeps tool policies bounded and incapable of granting ambient host access",()=>{const id="00000000-0000-4000-8000-000000000123";expect(setToolPoliciesSchema.safeParse({policies:[{toolName:"search_notes",enabled:true,scope:{kind:"selected_notes",noteIds:[id]},confirmation:"none",quota:{maxRunsPerHour:20,maxResultBytes:65536}}]}).success).toBe(true);expect(setToolPoliciesSchema.safeParse({policies:[{toolName:"run_shell",enabled:true,scope:{kind:"vault",noteIds:[]},confirmation:"none",quota:{maxRunsPerHour:20,maxResultBytes:65536}}]}).success).toBe(false);});

  it("bounds natural-language commands to explicit source and context identities",()=>{const id="00000000-0000-4000-8000-000000000123";expect(executeNaturalLanguageCommandSchema.safeParse({text:"search notes for thermodynamics",sourceScope:{noteIds:[id]},contextIds:[id],clientOperationId:"command-123"}).success).toBe(true);expect(executeNaturalLanguageCommandSchema.safeParse({text:"run shell",sourceScope:{noteIds:[id,id]},clientOperationId:"command-123"}).success).toBe(false);});

  it("keeps deployment probes finite and missing hardware explicit",()=>{expect(checkDeploymentSchema.safeParse({profileId:"home-host",checkKinds:["database","local_ai_endpoint"]}).success).toBe(true);expect(checkDeploymentSchema.safeParse({profileId:"home-host",checkKinds:["database","database"]}).success).toBe(false);expect(hostResourceReportSchema.safeParse({cpu:{model:"Intel",logicalProcessors:32,physicalCores:null},memory:{totalBytes:64,freeBytes:32},gpus:[],disks:[],runtime:{osPlatform:"win32",osRelease:"unknown",architecture:"x64",nodeVersion:"22.0.0",localAiBackend:"openai_compatible",configuredModel:"Qwen/Qwen3.8-Flash-Next",endpointOrigin:"http://127.0.0.1:11434"},probeState:{windowsHardware:"unavailable",limitations:["Probe unavailable"]},observedAt:"2026-09-21T12:00:00.000Z"}).success).toBe(true);});

  it("revision-fences bounded host resource policy and keeps access setup preview-only",()=>{const policy={maxInferenceConcurrency:2,backgroundBudget:{maxConcurrentJobs:1,maxCpuPercent:50,maxGpuMemoryPercent:80},quietHours:{startsAt:"22:00",endsAt:"07:00",timezone:"Europe/Oslo"},pauseBackground:false,modelProfileIds:["local-qwen-general"],interactivePriority:"preempt_background" as const,modelResidency:"unload_when_idle" as const};expect(setHostResourcePolicySchema.safeParse(policy).success).toBe(true);expect(setHostResourcePolicySchema.safeParse({...policy,modelProfileIds:["same","same"]}).success).toBe(false);expect(setHostResourcePolicySchema.safeParse({...policy,quietHours:{startsAt:"22:00",endsAt:"22:00",timezone:"Europe/Oslo"}}).success).toBe(false);expect(previewRemoteAccessSetupSchema.safeParse({mode:"tailscale_private",ownerConfigReference:"settings:remote/tailscale",canonicalOriginCandidate:"https://omega.example.ts.net"}).success).toBe(true);expect(previewRemoteAccessSetupSchema.safeParse({mode:"cloudflare_access",ownerConfigReference:"secret value",canonicalOriginCandidate:"http://example.com/path"}).success).toBe(false);});

  it("separates device cache authorization from unverifiable offline erasure",()=>{const id="00000000-0000-4000-8000-000000000123",base={trusted:true,selectedVaultIds:[id],cacheLimits:{maxBytes:536870912,maxItems:10000},expireAfterSeconds:86400,clearOnLogout:true};expect(setDeviceCachePolicySchema.safeParse(base).success).toBe(true);expect(setDeviceCachePolicySchema.safeParse({...base,trusted:false}).success).toBe(false);expect(setDeviceCachePolicySchema.safeParse({...base,selectedVaultIds:[id,id]}).success).toBe(false);expect(requestDeviceCachePurgeSchema.safeParse({selectedVaultIds:[id],requestReason:"Owner revoked this offline copy"}).success).toBe(true);expect(requestDeviceCachePurgeSchema.safeParse({selectedVaultIds:[],requestReason:"none"}).success).toBe(false);});

  it("keeps connection mappings declarative and schema-bounded",()=>{const base={datasets:[{sourceKind:"calendar_event",targetRecordType:"calendar_event" as const,fieldMappings:[{sourceField:"subject",targetField:"title",transformation:"string_trim" as const,provenance:"provider_schema" as const}]}],timezone:"Europe/Oslo",entityMapping:{person:"provider_id_then_email" as const,course:"provider_id_then_code" as const,calendar:"provider_id" as const},extractionProfile:"provider_native_v1" as const};expect(setConnectionMappingSchema.safeParse(base).success).toBe(true);expect(setConnectionMappingSchema.safeParse({...base,datasets:[...base.datasets,...base.datasets]}).success).toBe(false);expect(setConnectionMappingSchema.safeParse({...base,datasets:[{...base.datasets[0],fieldMappings:[...base.datasets[0].fieldMappings,...base.datasets[0].fieldMappings]}]}).success).toBe(false);expect(setConnectionMappingSchema.safeParse({...base,datasets:[{...base.datasets[0],fieldMappings:[{...base.datasets[0].fieldMappings[0],transformation:"javascript_eval"}]}]}).success).toBe(false);});

  it("requires explicit deduplicated personal-data sync and profile source scopes",()=>{const id="00000000-0000-4000-8000-000000000123",from="2026-09-01T00:00:00.000Z",to="2026-10-01T00:00:00.000Z";expect(syncSelectedPersonalDataSchema.safeParse({connectionIds:[id],capabilities:["watch_history"],window:{from,to},catchUpRunKey:"sunday-2026-09-20"}).success).toBe(true);expect(syncSelectedPersonalDataSchema.safeParse({connectionIds:[id,id],capabilities:["watch_history"]}).success).toBe(false);expect(rebuildPersonalProfileSchema.safeParse({sourceScope:{personalDataItemIds:[id],providers:[]},timeWindow:{from,to},policyRevision:1}).success).toBe(true);expect(rebuildPersonalProfileSchema.safeParse({sourceScope:{personalDataItemIds:[],providers:[]},timeWindow:{from,to},policyRevision:1}).success).toBe(false);});

  it("makes disconnect retention an explicit finite preview choice",()=>{expect(previewConnectionDisconnectSchema.safeParse({retentionChoice:"retain_sources_delete_derived"}).success).toBe(true);expect(previewConnectionDisconnectSchema.safeParse({retentionChoice:"delete_everything_everywhere"}).success).toBe(false);});

  it("separates import planning from explicitly confirmed application",()=>{const id="00000000-0000-4000-8000-000000000123";expect(planImportSchema.safeParse({blobId:id,format:"omega_notes_json_v1",options:{stripFrontmatter:false}}).success).toBe(true);expect(planImportSchema.safeParse({blobId:id,format:"zip_with_scripts"}).success).toBe(false);expect(applyImportSchema.safeParse({planRevision:1,collisionPolicy:"skip_existing_title",confirmation:"apply_import_plan"}).success).toBe(true);expect(applyImportSchema.safeParse({planRevision:1,collisionPolicy:"replace",confirmation:"apply_import_plan"}).success).toBe(false);});

  it("keeps school import a bounded timestamped snapshot preview",()=>{const id="00000000-0000-4000-8000-000000000123";expect(previewSchoolImportSchema.safeParse({attachmentId:id,format:"auto",mapping:{class:"course"},sourceTimestamp:"2026-09-21T10:00:00.000Z",timezone:"Europe/Oslo",period:{from:"2026-08-01",to:"2026-12-31"}}).success).toBe(true);expect(previewSchoolImportSchema.safeParse({attachmentId:id,format:"csv",sourceTimestamp:"not-time",timezone:"Europe/Oslo"}).success).toBe(false);});

  it("withdraws only an explicit unique set of unstarted study blocks",()=>{const id="00000000-0000-4000-8000-000000000123";expect(withdrawStudyPlanSchema.safeParse({selectedUnstartedBlockIds:[id],reason:"Plan changed"}).success).toBe(true);expect(withdrawStudyPlanSchema.safeParse({selectedUnstartedBlockIds:[id,id]}).success).toBe(false);expect(withdrawStudyPlanSchema.safeParse({selectedUnstartedBlockIds:[]}).success).toBe(false);});

  it("requires explicit bounded connector selection and scheduling",()=>{
    const id="00000000-0000-4000-8000-000000000123";
    expect(resourceSelectionInputSchema.safeParse({selectedResourceIds:[id],window:{from:"2026-09-01T00:00:00.000Z",to:"2026-10-01T00:00:00.000Z"},scopeExpansionApproval:true,sensitiveDataOptIns:["grades"]}).success).toBe(true);
    expect(resourceSelectionInputSchema.safeParse({selectedResourceIds:[id,id],scopeExpansionApproval:true}).success).toBe(false);
    expect(connectorScheduleSchema.safeParse({enabled:true,intervalMinutes:60,windows:[{weekday:7,start:"03:00",end:"05:00",timezone:"Europe/Oslo"}]}).success).toBe(true);
    expect(connectorScheduleSchema.safeParse({enabled:true,intervalMinutes:5,windows:[]}).success).toBe(false);
  });

  it("bounds generated study activities and idempotent responses",()=>{
    const id="00000000-0000-4000-8000-000000000123";
    expect(createStudyActivitySchema.safeParse({mode:"simple",sourceScope:{sourceIds:[id]},length:5,language:"nb-NO"}).success).toBe(true);
    expect(createStudyActivitySchema.safeParse({mode:"official_exam",sourceScope:{sourceIds:[id]},length:50}).success).toBe(false);
    expect(submitStudyResponseSchema.safeParse({itemId:id,answer:"My answer",responseId:id,expectedActivityRevision:2,elapsedActiveSeconds:45}).success).toBe(true);
  });

  it("preserves transcript timestamps while permitting owner text and speaker corrections",()=>{
    expect(transcriptSegmentSchema.safeParse({id:"segment-1",startMs:0,endMs:1250,text:"Welcome",speaker:{id:null,label:"Unknown speaker",status:"unknown"}}).success).toBe(true);
    expect(transcriptSegmentSchema.safeParse({id:"segment-1",startMs:1250,endMs:1000,text:"Impossible",speaker:{id:null,label:"Unknown speaker",status:"unknown"}}).success).toBe(false);
    expect(correctTranscriptSchema.safeParse({segmentEdits:[{segmentId:"segment-1",text:"Corrected wording"}],expectedRevision:2}).success).toBe(true);
    expect(correctTranscriptSchema.safeParse({segmentEdits:[],speakerLabelCorrections:[],expectedRevision:2}).success).toBe(false);
    expect(analyzeTranscriptSchema.safeParse({scope:"all",expectedRevision:2}).success).toBe(true);
  });
});
